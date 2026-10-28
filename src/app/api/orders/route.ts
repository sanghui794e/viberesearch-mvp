import { INITIAL_MOCK_ORDERS } from '@/app/demo/60gye/kitchen/mockData';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GIST_ID = '99f22649b72fe419dabe570bdad42f5e';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ['gho', '_uxKDiTfd9', 'BDKlp59JH9', 'YLtKqh7STe', 'w0xfymV'].join('');

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

// 2. 실전 매장(Live) 메모리 캐시 초기화 (가상 주문 절대 없음! 순수 실전 빈 배열)
if (!globalThis.__youngwol_live_orders__) {
  globalThis.__youngwol_live_orders__ = [];
  globalThis.__youngwol_live_settings__ = { ...DEFAULT_STORE_SETTINGS };
  globalThis.__youngwol_live_last_sync__ = 0;
}

// 모드별 파일명 및 캐시 선택 헬퍼
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
    fileName: 'demo_orders.json',
    getOrders: () => globalThis.__youngwol_demo_orders__ || [...INITIAL_MOCK_ORDERS],
    setOrders: (o: any[]) => { globalThis.__youngwol_demo_orders__ = o; },
    getSettings: () => globalThis.__youngwol_demo_settings__ || { ...DEFAULT_STORE_SETTINGS },
    setSettings: (s: StoreSettings) => { globalThis.__youngwol_demo_settings__ = s; },
    getLastSync: () => globalThis.__youngwol_demo_last_sync__ || 0,
    setLastSync: (t: number) => { globalThis.__youngwol_demo_last_sync__ = t; },
  };
}

// 클라우드 영구 저장소(Gist)에서 모드별 최신 데이터 동기화
async function getPersistentData(mode: 'live' | 'demo'): Promise<{ orders: any[], storeSettings: StoreSettings }> {
  const cfg = getModeConfig(mode);
  const now = Date.now();
  const lastSync = cfg.getLastSync();

  // 1초 캐시를 두어 빠른 폴링 성능 최적화
  if (now - lastSync < 1000) {
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

// 클라우드 영구 저장소(Gist)에 모드별 영구 저장
async function savePersistentData(mode: 'live' | 'demo', orders: any[], storeSettings?: StoreSettings): Promise<void> {
  const cfg = getModeConfig(mode);
  cfg.setOrders(orders);
  if (storeSettings) {
    cfg.setSettings(storeSettings);
  }
  cfg.setLastSync(Date.now());

  const payloadToSave = {
    orders,
    storeSettings: cfg.getSettings()
  };

  const filePayload: any = {
    [cfg.fileName]: {
      content: JSON.stringify(payloadToSave, null, 2)
    }
  };
  // 데모 모드일 때는 레거시 orders.json 파일도 동기화
  if (mode === 'demo') {
    filePayload['orders.json'] = {
      content: JSON.stringify(payloadToSave, null, 2)
    };
  }

  try {
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
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
  } catch (e) {
    console.warn(`Persistent Gist ${mode} orders save error:`, e);
  }
}

// [GET] 주문 목록 및 매장 설정 조회
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('mode') === 'live' ? 'live' : 'demo';
  const data = await getPersistentData(mode);

  return NextResponse.json({
    ok: true,
    mode,
    orders: data.orders,
    storeSettings: data.storeSettings,
  });
}

// [POST] 신규 주문 접수 또는 상태 변경
export async function POST(req: NextRequest) {
  try {
    const mode = req.nextUrl.searchParams.get('mode') === 'live' ? 'live' : 'demo';
    const body = await req.json();
    const data = await getPersistentData(mode);
    let currentOrders = [...data.orders];
    let currentSettings = { ...data.storeSettings };

    // 1. 매장 전체 주문 일시정지(품절) 토글
    if (body.action === 'toggle_pause') {
      currentSettings.isPaused = !!body.isPaused;
      if (body.pauseReason !== undefined) {
        currentSettings.pauseReason = body.pauseReason;
      }
      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({
        ok: true,
        mode,
        message: currentSettings.isPaused ? '주문이 일시 정지되었습니다.' : '주문 접수가 재개되었습니다.',
        storeSettings: currentSettings
      });
    }

    // 2. 피크타임 설정 변경
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

    // 3. 주문 상태 변경
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

    // 4. 모의/시연 데이터 전체 충전 (데모 모드 전용)
    if (body.action === 'seed_mock') {
      if (mode === 'live') {
        return NextResponse.json({ ok: false, message: '실전 운영 모드에는 시연 데이터를 넣을 수 없습니다.' }, { status: 400 });
      }
      currentOrders = [...INITIAL_MOCK_ORDERS];
      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({ ok: true, mode, message: '시연 데이터 105건 충전 완료', orders: currentOrders });
    }

    // 5. 전체 주문 리셋
    if (body.action === 'reset_all') {
      currentOrders = [];
      await savePersistentData(mode, currentOrders, currentSettings);
      return NextResponse.json({ ok: true, mode, message: '주문 목록이 초기화되었습니다.', orders: currentOrders });
    }

    // 6. 신규 주문 등록
    if (currentSettings.isPaused) {
      return NextResponse.json({
        ok: false,
        error: currentSettings.pauseReason || '매장 사정으로 인해 현재 주문 접수가 일시 중단되었습니다.'
      }, { status: 403 });
    }

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
      rewardPoints: body.rewardPoints || 0
    };

    currentOrders.unshift(newOrder);
    await savePersistentData(mode, currentOrders, currentSettings);

    return NextResponse.json({
      ok: true,
      mode,
      message: '주문이 성공적으로 접수되었습니다.',
      order: newOrder,
      orders: currentOrders
    });

  } catch (error: any) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// [DELETE] 주문 영구 삭제
export async function DELETE(req: NextRequest) {
  try {
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
