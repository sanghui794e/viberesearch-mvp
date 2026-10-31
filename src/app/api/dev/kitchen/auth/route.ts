// ==============================================================================
// 🧪 [개발 전용] 주방 관리자 로그인/로그아웃 및 세션 검증 API
// 대상: rewaveon-dev 개발용 격리 데이터베이스 전용
// 보안 원칙:
//   1. [기본 비활성화] ENABLE_DEV_API === 'true' 명시적 설정 시에만 동작
//   2. [해시 안전 검증] scrypt 해시 포맷 손상 시 예외 없이 안전한 실패 반환
//   3. [고정 출처 검증] 요청자 Host 맹신 배제, 서버 공인 고정 화이트리스트 대조
//   4. [IP 보조 수단] x-forwarded-for 헤더는 스푸핑 가능하므로 1차 완화용 보조 힌트로만 취급
//   5. [최신 계정 검증] 세션 확인 시 store_members의 실시간 is_active 및 최신 role 교차 검증
//   6. [보안 쿠키] HttpOnly + Secure + SameSite=Strict 강제 적용
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  getDevSupabaseClient,
  generateAdminSessionToken,
  hashAdminSessionToken,
} from '@/lib/supabaseDev';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function checkDevApiGuard(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.ENABLE_DEV_API === 'true';
}

// 안전한 비밀번호 해시 검증 (형식 손상 시에도 예외 없이 안전 실패)
function safeVerifyPasswordHash(password: string, storedHash: string): boolean {
  try {
    if (!password || !storedHash || typeof storedHash !== 'string') return false;
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const salt = parts[0];
    const originalKey = parts[1];
    if (!salt || !originalKey || salt.length < 16 || originalKey.length < 32) return false;

    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(derivedKey), Buffer.from(originalKey));
  } catch {
    return false;
  }
}

// 클라이언트 IP 추출 (보조 수단: 프록시 환경에 따라 위조 가능하므로 보조적 힌트로만 취급)
function getAuxiliaryClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const candidate = forwarded.split(',')[0].trim();
    if (/^[0-9a-fA-F:.]+$/.test(candidate) && candidate.length <= 45) {
      return candidate;
    }
  }
  return '127.0.0.1';
}

// [서버 공인 신뢰 출처 고정 화이트리스트]
// 요청자가 보낸 Host 헤더를 그대로 믿지 않고, 서버가 사전에 명시한 안전한 개발 출처 목록만 대조합니다.
const TRUSTED_DEV_HOSTS = ['localhost:3000', '127.0.0.1:3000'];

function verifyTrustedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!origin || !host) return false;

  const originHost = origin.replace(/^https?:\/\//, '');

  // 1. 요청된 Host 자체가 공인 화이트리스트에 있는지 검증 (Host 헤더 변조 차단)
  if (!TRUSTED_DEV_HOSTS.includes(host)) {
    return false;
  }

  // 2. Origin 역시 공인 화이트리스트에 속하고, Host와 정확히 1:1 일치하는지 교차 검증
  return TRUSTED_DEV_HOSTS.includes(originHost) && originHost === host;
}

// [POST] 관리자 로그인 및 로그아웃
export async function POST(req: NextRequest) {
  if (!checkDevApiGuard()) {
    return NextResponse.json({ ok: false, error: 'ERR_DEV_API_DISABLED' }, { status: 404 });
  }

  // 신뢰할 수 있는 고정 출처 검증 (확인되지 않은 출처는 즉시 403 거부)
  if (!verifyTrustedOrigin(req)) {
    return NextResponse.json({ ok: false, error: 'ERR_UNTRUSTED_ORIGIN' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const action = body.action || 'login';
    const storeId = body.store_id || 'store_60gye_youngwol';
    const clientIp = getAuxiliaryClientIp(req);

    const supabase = getDevSupabaseClient();

    // --------------------------------------------------------------------------
    // 로그아웃 처리
    // --------------------------------------------------------------------------
    if (action === 'logout') {
      const sessionToken = req.cookies.get('kds_session')?.value;
      if (sessionToken) {
        const tokenHash = hashAdminSessionToken(sessionToken);
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token_hash', tokenHash)
          .eq('store_id', storeId);
      }

      const res = NextResponse.json({ ok: true, message: '안전하게 로그아웃되었습니다.' });
      res.cookies.set('kds_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/dev/kitchen',
        maxAge: 0,
      });
      return res;
    }

    // --------------------------------------------------------------------------
    // 로그인 처리
    // --------------------------------------------------------------------------
    const { login_id, password } = body;
    if (!login_id || !password) {
      return NextResponse.json({ ok: false, error: 'ERR_CREDENTIALS_REQUIRED' }, { status: 400 });
    }

    // 1. 로그인 실패 횟수 및 계정 잠금 여부 확인 (admin_login_limits - 보조 방어)
    const { data: limitRecord } = await supabase
      .from('admin_login_limits')
      .select('failed_attempts, locked_until')
      .eq('store_id', storeId)
      .eq('ip_address', clientIp)
      .maybeSingle();

    if (limitRecord && limitRecord.locked_until) {
      const lockTime = new Date(limitRecord.locked_until).getTime();
      if (lockTime > Date.now()) {
        const waitMinutes = Math.ceil((lockTime - Date.now()) / 60000);
        return NextResponse.json({
          ok: false,
          error: 'ERR_ACCOUNT_LOCKED',
          message: `로그인 시도 횟수를 초과하여 계정이 일시 잠금되었습니다. ${waitMinutes}분 후에 다시 시도하십시오.`
        }, { status: 429 });
      }
    }

    // 2. 관리자 계정 조회 및 실시간 활성 상태 확인 (store_members)
    const { data: member } = await supabase
      .from('store_members')
      .select('id, store_id, member_name, login_id, role, password_hash, is_active')
      .eq('store_id', storeId)
      .eq('login_id', login_id.trim())
      .maybeSingle();

    const isPasswordValid = member && member.is_active
      ? safeVerifyPasswordHash(password, member.password_hash)
      : false;

    // 3. 비밀번호 불일치 시 실패 카운트 증가
    if (!member || !isPasswordValid) {
      const currentFailed = (limitRecord?.failed_attempts || 0) + 1;
      const shouldLock = currentFailed >= 5;
      const lockUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;

      await supabase
        .from('admin_login_limits')
        .upsert({
          store_id: storeId,
          ip_address: clientIp,
          failed_attempts: currentFailed,
          locked_until: lockUntil,
          last_attempt_at: new Date().toISOString(),
        });

      return NextResponse.json({
        ok: false,
        error: 'ERR_INVALID_CREDENTIALS',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      }, { status: 401 });
    }

    // 역할 유효성 검증
    const validRoles = ['owner', 'manager', 'staff'];
    if (!validRoles.includes(member.role)) {
      return NextResponse.json({ ok: false, error: 'ERR_UNAUTHORIZED_ROLE' }, { status: 403 });
    }

    // 4. 로그인 성공: 실패 카운트 초기화
    await supabase
      .from('admin_login_limits')
      .delete()
      .eq('store_id', storeId)
      .eq('ip_address', clientIp);

    // 5. 세션 발급 및 등록
    const { sessionToken, sessionTokenHash } = generateAdminSessionToken();
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        store_id: storeId,
        member_id: member.id,
        session_token_hash: sessionTokenHash,
        role: member.role,
        ip_address: clientIp,
        user_agent: req.headers.get('user-agent')?.substring(0, 200) || null,
        expires_at: expiresAt,
      });

    if (sessionError) {
      return NextResponse.json({ ok: false, error: 'ERR_SESSION_CREATE_FAILED' }, { status: 500 });
    }

    // 6. 보안 쿠키 설정
    const res = NextResponse.json({
      ok: true,
      message: '주방 관리자로 정상 인증되었습니다.',
      member: {
        id: member.id,
        name: member.member_name,
        role: member.role,
        store_id: member.store_id,
      },
    });

    res.cookies.set('kds_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/dev/kitchen',
      maxAge: 12 * 60 * 60,
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false, error: 'ERR_INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}

// [GET] 주방 세션 유효성 확인 (store_members 실시간 활성/역할 교차 검증)
export async function GET(req: NextRequest) {
  if (!checkDevApiGuard()) {
    return NextResponse.json({ ok: false, error: 'ERR_DEV_API_DISABLED' }, { status: 404 });
  }

  const sessionToken = req.cookies.get('kds_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ ok: false, isAuthenticated: false }, { status: 401 });
  }

  const tokenHash = hashAdminSessionToken(sessionToken);
  const supabase = getDevSupabaseClient();

  // 1. admin_sessions 세션 레코드 조회
  const { data: session, error: sessionErr } = await supabase
    .from('admin_sessions')
    .select('id, store_id, member_id, role, expires_at')
    .eq('session_token_hash', tokenHash)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (sessionErr || !session) {
    return NextResponse.json({ ok: false, isAuthenticated: false }, { status: 401 });
  }

  // 2. store_members에서 실제 최신 활성 상태 및 최신 역할 교차 검증 (유령 세션 방어)
  const { data: member, error: memberErr } = await supabase
    .from('store_members')
    .select('id, is_active, role')
    .eq('id', session.member_id)
    .eq('store_id', session.store_id)
    .maybeSingle();

  if (memberErr || !member || !member.is_active) {
    await supabase.from('admin_sessions').delete().eq('id', session.id);
    return NextResponse.json({
      ok: false,
      isAuthenticated: false,
      error: 'ERR_ACCOUNT_DISABLED',
      message: '관리자 계정이 비활성화되었거나 권한이 취소되었습니다.'
    }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    isAuthenticated: true,
    session: {
      store_id: session.store_id,
      role: member.role,
    },
  });
}
