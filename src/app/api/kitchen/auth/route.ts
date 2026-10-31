// ==============================================================================
// 🛡️ [운영 전용] 주방 관리자 로그인/로그아웃 및 세션 검증 API
// 대상: 운영 환경 전용 (Production Kitchen Admin Auth)
// 보안 원칙:
//   1. [개발용 격리] 개발용 수파베이스 계정/키(DEV_SUPABASE_...) 재사용 절대 금지
//   2. [안전 거부] 운영 인증 저장소(PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_ROLE_KEY)
//      미설정 시 인증 요청을 즉시 503/401로 안전 거부 (임의 계정/우회 불가)
//   3. [전역 세션 쿠키] kds_session 쿠키를 path: '/'로 설정하여 주방 화면 및
//      주문 관리 API(/api/orders)에서 동일한 운영 세션 공유
//   4. [해시 안전 검증] scrypt 해시 검증 및 타이밍 공격 방지(timingSafeEqual)
//   5. [최신 계정 검증] 세션 확인 시 store_members의 실시간 is_active 교차 검증
//   6. [보안 쿠키] HttpOnly + Secure + SameSite=Strict 강제 적용
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ------------------------------------------------------------------------------
// 1. 운영 전용 Supabase 클라이언트 헬퍼
// ------------------------------------------------------------------------------
function getProdSupabaseClient(): SupabaseClient | null {
  const url = process.env.PROD_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const devUrl = process.env.DEV_SUPABASE_URL || '';

  // 운영 인증 저장소 환경변수 누락 시 안전 실패 (null 반환)
  if (!url || !key) {
    return null;
  }

  // 🛡️ 개발용 DB URL과의 혼선 또는 재사용 원천 차단
  if ((devUrl && url === devUrl) || url.toLowerCase().includes('dev')) {
    console.error('보안 위반 감지: 운영 인증 엔드포인트에서 개발용 데이터베이스를 재사용할 수 없습니다.');
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ------------------------------------------------------------------------------
// 2. 비밀번호 해시 및 세션 토큰 헬퍼
// ------------------------------------------------------------------------------
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

function generateAdminSessionToken(): { sessionToken: string; sessionTokenHash: string } {
  const sessionToken = 'kds_' + crypto.randomBytes(28).toString('hex');
  const sessionTokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
  return { sessionToken, sessionTokenHash };
}

function hashAdminSessionToken(sessionToken: string): string {
  if (!sessionToken || typeof sessionToken !== 'string') return '';
  return crypto.createHash('sha256').update(sessionToken.trim()).digest('hex');
}

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

// ------------------------------------------------------------------------------
// 3. [POST] 운영 주방 관리자 로그인 및 로그아웃
// ------------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const supabase = getProdSupabaseClient();

    // 🛡️ [운영 인증 저장소 부재 시 안전 거부]
    if (!supabase) {
      return NextResponse.json({
        ok: false,
        error: 'ERR_PROD_AUTH_STORAGE_NOT_CONFIGURED',
        message: '운영 관리자 인증 저장소(PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_ROLE_KEY)가 아직 설정되지 않아 인증을 처리할 수 없습니다.'
      }, { status: 503 });
    }

    const body = await req.json();
    const action = body.action || 'login';
    const storeId = body.store_id || 'store_60gye_youngwol';
    const clientIp = getAuxiliaryClientIp(req);

    // --------------------------------------------------------------------------
    // 로그아웃 처리
    // --------------------------------------------------------------------------
    if (action === 'logout') {
      const sessionToken = req.cookies.get('kds_session')?.value ||
        req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

      if (sessionToken) {
        const tokenHash = hashAdminSessionToken(sessionToken);
        try {
          await supabase
            .from('admin_sessions')
            .delete()
            .eq('session_token_hash', tokenHash)
            .eq('store_id', storeId);
        } catch {}
      }

      const res = NextResponse.json({ ok: true, message: '안전하게 로그아웃되었습니다.' });
      res.cookies.set('kds_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
      return res;
    }

    // --------------------------------------------------------------------------
    // 로그인 처리
    // --------------------------------------------------------------------------
    const { login_id, password } = body;
    if (!login_id || !password) {
      return NextResponse.json({ ok: false, error: 'ERR_CREDENTIALS_REQUIRED', message: '아이디와 비밀번호를 모두 입력해 주세요.' }, { status: 400 });
    }

    // 1. 로그인 실패 횟수 및 일시 잠금 검사 (보조 방어)
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

    // 2. 운영 store_members 테이블에서 계정 조회 및 활성 여부 확인
    const { data: member, error: memberFetchErr } = await supabase
      .from('store_members')
      .select('id, store_id, member_name, login_id, role, password_hash, is_active')
      .eq('store_id', storeId)
      .eq('login_id', login_id.trim())
      .maybeSingle();

    if (memberFetchErr) {
      console.error('운영 관리자 계정 조회 오류:', memberFetchErr);
      return NextResponse.json({ ok: false, error: 'ERR_AUTH_DATABASE_ERROR', message: '인증 저장소 조회 중 오류가 발생했습니다.' }, { status: 500 });
    }

    const isPasswordValid = member && member.is_active
      ? safeVerifyPasswordHash(password, member.password_hash)
      : false;

    // 3. 비밀번호 불일치 또는 비활성 계정 처리
    if (!member || !isPasswordValid) {
      const currentFailed = (limitRecord?.failed_attempts || 0) + 1;
      const shouldLock = currentFailed >= 5;
      const lockUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;

      try {
        await supabase
          .from('admin_login_limits')
          .upsert({
            store_id: storeId,
            ip_address: clientIp,
            failed_attempts: currentFailed,
            locked_until: lockUntil,
            last_attempt_at: new Date().toISOString(),
          });
      } catch {}

      return NextResponse.json({
        ok: false,
        error: 'ERR_INVALID_CREDENTIALS',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      }, { status: 401 });
    }

    // 4. 권한 유효성 검증
    const validRoles = ['owner', 'manager', 'staff'];
    if (!validRoles.includes(member.role)) {
      return NextResponse.json({ ok: false, error: 'ERR_UNAUTHORIZED_ROLE', message: '주방 관리 권한이 부여되지 않은 계정입니다.' }, { status: 403 });
    }

    // 5. 로그인 성공: 실패 횟수 초기화
    try {
      await supabase
        .from('admin_login_limits')
        .delete()
        .eq('store_id', storeId)
        .eq('ip_address', clientIp);
    } catch {}

    // 6. 32바이트 암호 난수 세션 발급 및 등록
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
      console.error('운영 세션 생성 실패:', sessionError);
      return NextResponse.json({ ok: false, error: 'ERR_SESSION_CREATE_FAILED', message: '세션 등록에 실패했습니다.' }, { status: 500 });
    }

    // 7. 응답 반환 및 사이트 전역 보안 쿠키(path: '/') 설정
    const res = NextResponse.json({
      ok: true,
      message: '운영 주방 관리자로 정상 인증되었습니다.',
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
      path: '/',
      maxAge: 12 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    console.error('운영 관리자 인증 처리 오류:', error);
    return NextResponse.json({ ok: false, error: 'ERR_INTERNAL_SERVER_ERROR', message: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}

// ------------------------------------------------------------------------------
// 4. [GET] 운영 주방 세션 유효성 확인
// ------------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const supabase = getProdSupabaseClient();

    // 🛡️ [운영 인증 저장소 미설정 시 안전 거부]
    if (!supabase) {
      return NextResponse.json({
        ok: false,
        isAuthenticated: false,
        error: 'ERR_PROD_AUTH_STORAGE_NOT_CONFIGURED',
        message: '운영 관리자 인증 저장소가 아직 설정되지 않았습니다.'
      }, { status: 503 });
    }

    const sessionToken = req.cookies.get('kds_session')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!sessionToken) {
      return NextResponse.json({ ok: false, isAuthenticated: false }, { status: 401 });
    }

    const tokenHash = hashAdminSessionToken(sessionToken);
    if (!tokenHash) {
      return NextResponse.json({ ok: false, isAuthenticated: false }, { status: 401 });
    }

    // 1. admin_sessions 세션 레코드 조회 및 만료 검사
    const { data: session, error: sessionErr } = await supabase
      .from('admin_sessions')
      .select('id, store_id, member_id, role, expires_at')
      .eq('session_token_hash', tokenHash)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (sessionErr || !session) {
      return NextResponse.json({ ok: false, isAuthenticated: false }, { status: 401 });
    }

    // 2. store_members에서 실시간 활성 상태 교차 검증 (비활성화 즉시 차단)
    const { data: member, error: memberErr } = await supabase
      .from('store_members')
      .select('id, is_active, role')
      .eq('id', session.member_id)
      .eq('store_id', session.store_id)
      .maybeSingle();

    if (memberErr || !member || !member.is_active) {
      try {
        await supabase.from('admin_sessions').delete().eq('id', session.id);
      } catch {}
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
  } catch {
    return NextResponse.json({ ok: false, isAuthenticated: false }, { status: 500 });
  }
}
