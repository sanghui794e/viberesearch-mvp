import { INITIAL_MOCK_ORDERS } from '@/app/demo/60gye/kitchen/mockData';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  getDevSupabaseClient,
  hashAdminSessionToken,
  generateAdminSessionToken,
} from '@/lib/supabaseDev';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🛡️ [보안 격리] 운영 GitHub Gist ID 및 인증 토큰
const GIST_ID = process.env.GITHUB_GIST_ID || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// 🛡️ [운영 전용 Supabase 클라이언트 헬퍼]
function getProdSupabaseClient(): SupabaseClient | null {
  const url = process.env.PROD_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const devUrl = process.env.DEV_SUPABASE_URL || '';

  if (!url || !key) {
    return null;
  }

  if ((devUrl && url === devUrl) || url.toLowerCase().includes('dev')) {
    console.error('보안 차단: 주문 API에서 운영 인증 시 개발용 데이터베이스를 재사용할 수 없습니다.');
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// 🛡️ [개발 환경 격리 절대 규칙]
// 개발 환경(NODE_ENV !== 'production')에서는 어떠한 설정이나 매개변수로도 운영 Gist에 절대 접근 불가
function isLiveGistEnabled(): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return false; // 개발 환경에서는 100% 예외 없이 차단
  }
  return !!(GIST_ID && GITHUB_TOKEN);
}

export interface BusyConfig {
  takeoutMin: number;
  deliveryMin: number;
}

export interface StoreSettings {
  isPaused: boolean;
  pauseReason: string;
  busyLevel?: 'normal' | 'busy' | 'peak';
  customTimes?: {
    normal: BusyConfig;
    busy: BusyConfig;
    peak: BusyConfig;
  };
  customNotice?: string;
  soldOutMenuIds?: string[];
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  isPaused: false,
  pauseReason: '',
  busyLevel: 'normal',
  customTimes: {
    normal: { takeoutMin: 20, deliveryMin: 40 },
    busy: { takeoutMin: 35, deliveryMin: 50 },
    peak: { takeoutMin: 50, deliveryMin: 65 },
  },
  customNotice: '',
  soldOutMenuIds: [],
};

declare global {
  // eslint-disable-next-line no-var
  var __youngwol_demo_orders__: any[] | undefined;
  // eslint-disable-next-line no-var
  var __youngwol_demo_settings__: StoreSettings | undefined;
  // eslint-disable-next-line no-var
  var __youngwol_demo_last_sync__: number | undefined;

  // eslint-disable-next-line no-var
  var __youngwol_live_orders__: any[] | undefined;
  // eslint-disable-next-line no-var
  var __youngwol_live_settings__: StoreSettings | undefined;
  // eslint-disable-next-line no-var
  var __youngwol_live_last_sync__: number | undefined;
}

// 1. 데모(Demo) 메모리 캐시 초기화
if (!globalThis.__youngwol_demo_orders__) {
  globalThis.__youngwol_demo_orders__ = [...INITIAL_MOCK_ORDERS];
  globalThis.__youngwol_demo_settings__ = { ...DEFAULT_STORE_SETTINGS };
  globalThis.__youngwol_demo_last_sync__ = 0;
}

// 2. 실전 매장(Live) 메모리 캐시 초기화
if (!globalThis.__youngwol_live_orders__) {
  globalThis.__youngwol_live_orders__ = [];
  globalThis.__youngwol_live_settings__ = { ...DEFAULT_STORE_SETTINGS };
  globalThis.__youngwol_live_last_sync__ = 0;
}

function getModeConfig(mode: 'live' | 'demo') {
  if (mode === 'live') {
    return {
      fileName: 'live_orders.json',
      getOrders: () => globalThis.__youngwol_live_orders__ || [],
      setOrders: (o: any[]) => { globalThis.__youngwol_live_orders__ = o; },
      getSettings: () => globalThis.__youngwol_live_settings__ || { ...DEFAULT_STORE_SETTINGS },
      setSettings: (s: StoreSettings) => { globalThis.__youngwol_live_settings__ = s; },
      getLastSync: () => globalThis.__youngwol_live_last_sync__ || 0,
      setLastSync: (t: number) => { globalThis.__youngwol_live_last_sync__ = t; },
    };
  }
  return {
    fileName: 'sample_orders.json',
    getOrders: () => globalThis.__youngwol_demo_orders__ || [...INITIAL_MOCK_ORDERS],
    setOrders: (o: any[]) => { globalThis.__youngwol_demo_orders__ = o; },
    getSettings: () => globalThis.__youngwol_demo_settings__ || { ...DEFAULT_STORE_SETTINGS },
    setSettings: (s: StoreSettings) => { globalThis.__youngwol_demo_settings__ = s; },
    getLastSync: () => globalThis.__youngwol_demo_last_sync__ || 0,
    setLastSync: (t: number) => { globalThis.__youngwol_demo_last_sync__ = t; },
  };
}

async function getPersistentData(mode: 'live' | 'demo'): Promise<{ orders: any[], storeSettings: StoreSettings }> {
  const cfg = getModeConfig(mode);
  const now = Date.now();
  const lastSync = cfg.getLastSync();

  if (now - lastSync < 1000) {
    return {
      orders: cfg.getOrders(),
      storeSettings: cfg.getSettings(),
    };
  }

  // 🛡️ 개발 환경에서는 운영 Gist 접근 차단
  if (!isLiveGistEnabled()) {
    return {
      orders: cfg.getOrders(),
      storeSettings: cfg.getSettings(),
    };
  }

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'NextApp-60gye',
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      const content = data.files?.[cfg.fileName]?.content || (mode === 'demo' ? data.files?.['orders.json']?.content : null);
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          cfg.setOrders(parsed);
          cfg.setLastSync(now);
          return { orders: parsed, storeSettings: cfg.getSettings() };
        } else if (parsed && Array.isArray(parsed.orders)) {
          cfg.setOrders(parsed.orders);
          if (parsed.storeSettings) {
            cfg.setSettings({ ...DEFAULT_STORE_SETTINGS, ...parsed.storeSettings });
          }
          cfg.setLastSync(now);
          return { orders: parsed.orders, storeSettings: cfg.getSettings() };
        }
      }
    }
  } catch (e) {
    console.warn(`Persistent Gist ${mode} orders fetch error:`, e);
  }

  return {
    orders: cfg.getOrders(),
    storeSettings: cfg.getSettings(),
  };
}

async function savePersistentData(mode: 'live' | 'demo', orders: any[], storeSettings?: StoreSettings): Promise<void> {
  const cfg = getModeConfig(mode);

  // 🛡️ [운영 환경 주문 저장 실패 방지 원칙]
  // 운영 환경(NODE_ENV === 'production')인 경우:
  // 1. 운영 Gist 인증정보가 누락되었거나 저장에 실패하면 임시 메모리에 주문을 성공 처리하지 않는다.
  // 2. 주문 저장 성공이 확인된 경우에만 메모리 캐시를 갱신하고 정상 종료한다.
  if (process.env.NODE_ENV === 'production') {
    if (!GIST_ID || !GITHUB_TOKEN) {
      throw new Error('운영 주문 저장소(GitHub Gist) 인증정보(GITHUB_GIST_ID, GITHUB_TOKEN)가 누락되어 주문을 영속 저장할 수 없습니다.');
    }

    const payloadToSave = {
      orders,
      storeSettings: storeSettings || cfg.getSettings()
    };

    const filePayload: any = {
      [cfg.fileName]: {
        content: JSON.stringify(payloadToSave, null, 2)
      }
    };
    if (mode === 'demo') {
      filePayload['orders.json'] = {
        content: JSON.stringify(payloadToSave, null, 2)
      };
    }

    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'User-Agent': 'NextApp-60gye',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: filePayload
        })
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`운영 주문 저장소(GitHub Gist) 저장에 실패했습니다. (HTTP ${res.status}: ${errText.slice(0, 100)})`);
      }
    } catch (e: any) {
      console.error(`Persistent Gist ${mode} orders save error:`, e);
      throw new Error(e.message || '운영 주문 저장소 동기화 중 오류가 발생했습니다.');
    }

    // 🛡️ 운영 Gist 저장이 확실히 성공(HTTP 200 OK)한 경우에만 메모리 캐시 갱신
    cfg.setOrders(orders);
    if (storeSettings) {
      cfg.setSettings(storeSettings);
    }
    cfg.setLastSync(Date.now());
    return;
  }

  // 🛡️ 개발 환경(NODE_ENV !== 'production')에서는 외부 운영 Gist 접근을 완전 차단하고 격리된 로컬 메모리 캐시에만 안전 저장
  cfg.setOrders(orders);
  if (storeSettings) {
    cfg.setSettings(storeSettings);
  }
  cfg.setLastSync(Date.now());
}

// ------------------------------------------------------------------------------
// 🛡️ 암호학적 주문 비밀 토큰 헬퍼 (고객 본인 소유권 검증)
// ------------------------------------------------------------------------------
function generateCustomerOrderToken(): { token: string; hash: string } {
  const token = 'ord_' + crypto.randomBytes(28).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

function verifyCustomerOrderToken(clientToken: string, storedHash: string): boolean {
  try {
    if (!clientToken || !storedHash || typeof clientToken !== 'string' || typeof storedHash !== 'string') {
      return false;
    }
    const derivedHash = crypto.createHash('sha256').update(clientToken.trim()).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(derivedHash), Buffer.from(storedHash));
  } catch {
    return false;
  }
}

// ------------------------------------------------------------------------------
// 🛡️ 주방 관리자 세션 검증 헬퍼
// ------------------------------------------------------------------------------
async function verifyAdminSession(req: NextRequest): Promise<{
  isAuthenticated: boolean;
  storeId?: string;
  role?: string;
}> {
  try {
    const sessionToken = req.cookies.get('kds_session')?.value ||
      req.cookies.get('orders_admin_session')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
      req.headers.get('x-kds-session');

    if (!sessionToken) {
      return { isAuthenticated: false };
    }

    const tokenHash = hashAdminSessionToken(sessionToken);
    if (!tokenHash) {
      return { isAuthenticated: false };
    }

    // 🛡️ [운영 환경과 개발 환경 인증 저장소 분리 일관 체계]
    let supabase: SupabaseClient | null = null;
    if (process.env.NODE_ENV === 'production') {
      supabase = getProdSupabaseClient();
      if (!supabase) {
        // 운영 인증 저장소가 마련되지 않은 경우 즉시 거부 (임의 계정/우회 불가)
        return { isAuthenticated: false };
      }
    } else {
      supabase = getDevSupabaseClient();
    }

    const { data: session, error: sessErr } = await supabase
      .from('admin_sessions')
      .select('id, store_id, member_id, role, expires_at')
      .eq('session_token_hash', tokenHash)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (sessErr || !session) {
      return { isAuthenticated: false };
    }

    const { data: member, error: memErr } = await supabase
      .from('store_members')
      .select('id, is_active, role')
      .eq('id', session.member_id)
      .eq('store_id', session.store_id)
      .maybeSingle();

    if (memErr || !member || !member.is_active) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      storeId: session.store_id,
      role: member.role,
    };
  } catch {
    return { isAuthenticated: false };
  }
}

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

// ------------------------------------------------------------------------------
// [GET] 주문 목록 및 상태 조회
// ------------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('mode') === 'live' ? 'live' : 'demo';
  const data = await getPersistentData(mode);

  // 1. 관리자 세션 검증
  const auth = await verifyAdminSession(req);
  if (auth.isAuthenticated) {
    return NextResponse.json({
      ok: true,
      mode,
      orders: data.orders,
      storeSettings: data.storeSettings,
    });
  }

  // 2. 비인증(고객) 단건 주문 상태 조회 검증
  const specificOrderId = req.nextUrl.searchParams.get('id') || req.nextUrl.searchParams.get('order_id');
  if (specificOrderId) {
    const matched = data.orders.find(o => o.id === specificOrderId);
    if (!matched) {
      return NextResponse.json({ ok: false, error: 'ERR_ORDER_NOT_FOUND', message: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 🛡️ [주문 소유권 엄격 검증]
    // 요청 헤더(x-order-token)에서 고객 비밀 토큰 추출
    const clientToken = req.headers.get('x-order-token') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    // 레거시 주문(token_hash 미보유) 또는 토큰 불일치 시 엄격 거부
    if (!matched.token_hash || !clientToken || !verifyCustomerOrderToken(clientToken, matched.token_hash)) {
      return NextResponse.json({
        ok: false,
        error: 'ERR_UNAUTHORIZED_ORDER',
        message: '주문 소유권 인증에 실패했습니다. 유효한 비밀 토큰이 필요합니다.'
      }, { status: 403 });
    }

    // 🛡️ [개인정보 완전 배제: 최소 상태 정보만 반환]
    const minimalStatus = {
      id: matched.id,
      status: matched.status,
      minutesToAdd: matched.minutesToAdd,
      targetPickupTime: matched.targetPickupTime,
      cancelReason: matched.cancelReason || null,
      timestamp: matched.timestamp,
    };

    return NextResponse.json({
      ok: true,
      mode,
      order: minimalStatus,
      storeSettings: data.storeSettings,
      isGuestView: true,
    });
  }

  // 3. 단건 ID 없는 일반 게스트 조회: 주문 목록은 빈 배열(개인정보 보호) 및 매장 안내 정보만 반환
  return NextResponse.json({
    ok: true,
    mode,
    orders: [],
    storeSettings: data.storeSettings,
    isGuestView: true,
  });
}

// ------------------------------------------------------------------------------
// [POST] 신규 주문 접수 및 관리자 제어 액션
// ------------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const mode = req.nextUrl.searchParams.get('mode') === 'live' ? 'live' : 'demo';
    const body = await req.json();

    // 0. 관리자 로그인 검증 및 전용 세션 동기화
    if (body.action === 'admin_login_verify') {
      const storeId = body.store_id || 'store_60gye_youngwol';
      const loginId = body.login_id;
      const password = body.password;

      if (!loginId || !password) {
        return NextResponse.json({ ok: false, error: 'ERR_CREDENTIALS_REQUIRED' }, { status: 400 });
      }

      try {
        let supabase: SupabaseClient | null = null;
        if (process.env.NODE_ENV === 'production') {
          supabase = getProdSupabaseClient();
          if (!supabase) {
            return NextResponse.json({
              ok: false,
              error: 'ERR_PROD_AUTH_STORAGE_NOT_CONFIGURED',
              message: '운영 관리자 인증 저장소가 아직 준비되지 않았습니다.'
            }, { status: 503 });
          }
        } else {
          supabase = getDevSupabaseClient();
        }

        const { data: member } = await supabase
          .from('store_members')
          .select('id, store_id, member_name, login_id, role, password_hash, is_active')
          .eq('store_id', storeId)
          .eq('login_id', String(loginId).trim())
          .maybeSingle();

        const isPasswordValid = member && member.is_active && safeVerifyPasswordHash(password, member.password_hash);
        if (!isPasswordValid || !member) {
          return NextResponse.json({ ok: false, error: 'ERR_INVALID_CREDENTIALS' }, { status: 401 });
        }

        const { sessionToken, sessionTokenHash } = generateAdminSessionToken();
        const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

        await supabase.from('admin_sessions').insert({
          store_id: storeId,
          member_id: member.id,
          session_token_hash: sessionTokenHash,
          role: member.role,
          ip_address: '127.0.0.1',
          expires_at: expiresAt,
        });

        const res = NextResponse.json({
          ok: true,
          message: '주방 관리자로 정상 인증되었습니다.',
          member: { id: member.id, name: member.member_name, role: member.role }
        });

        res.cookies.set('orders_admin_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 12 * 60 * 60,
        });

        return res;
      } catch {
        return NextResponse.json({ ok: false, error: 'ERR_INTERNAL_SERVER_ERROR' }, { status: 500 });
      }
    }

    if (body.action === 'admin_logout') {
      const res = NextResponse.json({ ok: true, message: '로그아웃되었습니다.' });
      res.cookies.set('orders_admin_session', '', { path: '/', maxAge: 0 });
      return res;
    }

    // 관리자 전용 제어 액션 세션 검증
    const adminActions = ['toggle_pause', 'update_settings', 'update_status', 'seed_mock', 'reset_all'];
    if (adminActions.includes(body.action)) {
      const auth = await verifyAdminSession(req);
      if (!auth.isAuthenticated) {
        return NextResponse.json({
          ok: false,
          error: 'ERR_UNAUTHORIZED',
          message: '해당 기능을 실행할 주방 관리자 세션 권한이 없습니다.'
        }, { status: 401 });
      }
    }

    const data = await getPersistentData(mode);
    let currentOrders = [...data.orders];
    let currentSettings = { ...data.storeSettings };

    if (body.action === 'toggle_pause') {
      currentSettings.isPaused = !!body.isPaused;
      if (body.pauseReason !== undefined) currentSettings.pauseReason = body.pauseReason;
      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({
        ok: true,
        mode,
        message: currentSettings.isPaused ? '주문이 일시 정지되었습니다.' : '주문 접수가 재개되었습니다.',
        storeSettings: currentSettings
      });
    }

    if (body.action === 'update_settings') {
      if (body.busyLevel) currentSettings.busyLevel = body.busyLevel;
      if (body.customTimes) currentSettings.customTimes = body.customTimes;
      if (body.customNotice !== undefined) currentSettings.customNotice = body.customNotice;
      if (Array.isArray(body.soldOutMenuIds)) currentSettings.soldOutMenuIds = body.soldOutMenuIds;
      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({
        ok: true,
        mode,
        message: '매장 설정이 저장되었습니다.',
        storeSettings: currentSettings
      });
    }

    if (body.action === 'update_status') {
      const { id, status, minutesToAdd, rejectReason } = body;
      currentOrders = currentOrders.map(o => {
        if (o.id === id) {
          const updated = { ...o, status };
          if (minutesToAdd) updated.minutesToAdd = minutesToAdd;
          if (rejectReason) updated.rejectReason = rejectReason;
          return updated;
        }
        return o;
      });

      if (body.alsoPauseStore && body.pauseReason) {
        currentSettings.isPaused = true;
        currentSettings.pauseReason = body.pauseReason;
      }

      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({ ok: true, mode, orders: currentOrders, storeSettings: currentSettings });
    }

    if (body.action === 'seed_mock') {
      if (mode === 'live') {
        return NextResponse.json({ ok: false, message: '실전 운영 모드에는 시연 데이터를 넣을 수 없습니다.' }, { status: 400 });
      }
      currentOrders = [...INITIAL_MOCK_ORDERS];
      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({ ok: true, mode, message: '시연 데이터 105건 충전 완료', orders: currentOrders });
    }

    if (body.action === 'reset_all') {
      currentOrders = [];
      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({ ok: true, mode, message: '주문 목록이 초기화되었습니다.', orders: currentOrders });
    }

    // --------------------------------------------------------------------------
    // [고객 신규 주문 접수]
    // --------------------------------------------------------------------------
    if (currentSettings.isPaused) {
      return NextResponse.json({
        ok: false,
        error: currentSettings.pauseReason || '매장 사정으로 인해 현재 주문 접수가 일시 중단되었습니다.'
      }, { status: 403 });
    }

    // 🛡️ [암호학적 비밀 토큰 발급 및 해시 영속 보존]
    const { token: orderToken, hash: tokenHash } = generateCustomerOrderToken();

    const newOrder = {
      id: body.id || `order_${Date.now()}`,
      name: body.name || '손님',
      phone: body.phone || '',
      orderType: body.orderType || 'takeout',
      address: body.address || '',
      pickupTime: body.pickupTime || '20분 후',
      targetPickupTime: body.targetPickupTime || '',
      minutesToAdd: body.minutesToAdd || 20,
      paymentMethod: body.paymentMethod || '현장결제',
      requestText: body.requestText || '',
      items: body.items || [],
      subtotal: body.subtotal || 0,
      discount: body.discount || 0,
      deliveryFee: body.deliveryFee || 0,
      usedPoints: body.usedPoints || 0,
      total: body.total || 0,
      timestamp: body.timestamp || new Date().toISOString(),
      status: 'pending',
      rewardPoints: body.rewardPoints || 0,
      token_hash: tokenHash // 영속 저장소에 함께 보관되어 서버 재시작 후에도 검증 유지
    };

    currentOrders.unshift(newOrder);
    await savePersistentData(mode, currentOrders, currentSettings);

    return NextResponse.json({
      ok: true,
      mode,
      message: '주문이 성공적으로 접수되었습니다.',
      order: {
        id: newOrder.id,
        status: newOrder.status,
        minutesToAdd: newOrder.minutesToAdd,
        targetPickupTime: newOrder.targetPickupTime,
        total: newOrder.total,
        order_token: orderToken // 고객 브라우저에만 1회성 비밀 토큰 전달
      }
    });

  } catch (error: any) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// ------------------------------------------------------------------------------
// [PATCH] 주문 상태 변경 및 고객 직접 주문 취소
// ------------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    const mode = req.nextUrl.searchParams.get('mode') === 'live' ? 'live' : 'demo';
    const body = await req.json();
    const data = await getPersistentData(mode);
    let currentOrders = [...data.orders];
    let currentSettings = { ...data.storeSettings };

    const isCustomerCancel = body.status === 'cancelled' &&
      typeof body.cancelReason === 'string' &&
      body.cancelReason.includes('고객');

    // 🛡️ [고객 직접 취소 소유권 검증]
    if (isCustomerCancel) {
      const targetOrder = currentOrders.find(o => o.id === body.id);
      if (!targetOrder) {
        return NextResponse.json({ ok: false, error: 'ERR_ORDER_NOT_FOUND', message: '취소할 주문을 찾을 수 없습니다.' }, { status: 404 });
      }

      // 요청 헤더(x-order-token)에서 고객 비밀 토큰 추출
      const clientToken = req.headers.get('x-order-token') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

      // 레거시 주문 또는 토큰 불일치 시 엄격 거부
      if (!targetOrder.token_hash || !clientToken || !verifyCustomerOrderToken(clientToken, targetOrder.token_hash)) {
        return NextResponse.json({
          ok: false,
          error: 'ERR_UNAUTHORIZED_CANCEL',
          message: '본인 주문만 취소할 수 있습니다. 유효한 비밀 토큰이 필요합니다.'
        }, { status: 403 });
      }

      if (targetOrder.status === 'cooking' || targetOrder.status === 'done') {
        return NextResponse.json({ ok: false, error: 'ERR_CANNOT_CANCEL', message: '이미 조리 중이거나 완료된 주문은 취소할 수 없습니다.' }, { status: 400 });
      }

      currentOrders = currentOrders.map(o => {
        if (o.id === body.id) {
          return { ...o, status: 'cancelled', cancelReason: body.cancelReason };
        }
        return o;
      });

      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({ ok: true, mode, message: '고객 주문이 정상적으로 취소되었습니다.' });
    }

    // 🛡️ 주방 관리자 상태 변경은 관리자 세션 검증
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json({
        ok: false,
        error: 'ERR_UNAUTHORIZED',
        message: '관리자 권한이 필요한 요청입니다.'
      }, { status: 401 });
    }

    if (body.isStorePaused !== undefined) {
      currentSettings.isPaused = !!body.isStorePaused;
      if (body.pauseReason !== undefined) currentSettings.pauseReason = body.pauseReason;
    }

    if (body.busyLevel) currentSettings.busyLevel = body.busyLevel;
    if (body.customTimes) currentSettings.customTimes = body.customTimes;
    if (body.customNotice !== undefined) currentSettings.customNotice = body.customNotice;
    if (Array.isArray(body.soldOutMenuIds)) currentSettings.soldOutMenuIds = body.soldOutMenuIds;

    if (body.id && body.status) {
      currentOrders = currentOrders.map(o => {
        if (o.id === body.id) {
          const updated = { ...o, status: body.status };
          if (body.cancelReason) updated.cancelReason = body.cancelReason;
          if (body.minutesToAdd) updated.minutesToAdd = body.minutesToAdd;
          return updated;
        }
        return o;
      });
    }

    await savePersistentData(mode, currentOrders, currentSettings);
    return NextResponse.json({
      ok: true,
      mode,
      orders: currentOrders,
      storeSettings: currentSettings
    });

  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// ------------------------------------------------------------------------------
// [DELETE] 주문 영구 삭제 (관리자 전용 기능)
// ------------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthenticated) {
      return NextResponse.json({
        ok: false,
        error: 'ERR_UNAUTHORIZED',
        message: '주문 삭제는 주방 관리자 세션이 필요합니다.'
      }, { status: 401 });
    }

    const mode = req.nextUrl.searchParams.get('mode') === 'live' ? 'live' : 'demo';
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Order ID is required' }, { status: 400 });
    }

    const data = await getPersistentData(mode);
    const updated = data.orders.filter(o => o.id !== id);
    await savePersistentData(mode, updated, data.storeSettings);

    return NextResponse.json({
      ok: true,
      mode,
      message: '주문이 영구 삭제되었습니다.',
      orders: updated
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
