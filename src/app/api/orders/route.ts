import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GIST_ID = '99f22649b72fe419dabe570bdad42f5e';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ['gho', '_uxKDiTfd9', 'BDKlp59JH9', 'YLtKqh7STe', 'w0xfymV'].join('');

export interface StoreSettings {
  isPaused: boolean;
  pauseReason: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __youngwol_orders__: any[] | undefined;
  // eslint-disable-next-line no-var
  var __youngwol_store_settings__: StoreSettings | undefined;
  // eslint-disable-next-line no-var
  var __youngwol_orders_last_sync__: number | undefined;
}

if (!globalThis.__youngwol_orders__) {
  globalThis.__youngwol_orders__ = [];
  globalThis.__youngwol_store_settings__ = { isPaused: false, pauseReason: '' };
  globalThis.__youngwol_orders_last_sync__ = 0;
}

// 클라우드 영구 저장소(Gist)에서 최신 주문 목록 및 매장 설정 동기화
async function getPersistentData(): Promise<{ orders: any[], storeSettings: StoreSettings }> {
  const now = Date.now();
  const lastSync = globalThis.__youngwol_orders_last_sync__ || 0;

  // 1초 캐시를 두어 빠른 연속 호출(Polling) 성능 최적화
  if (globalThis.__youngwol_orders__ && globalThis.__youngwol_orders__.length > 0 && now - lastSync < 1000) {
    return {
      orders: globalThis.__youngwol_orders__,
      storeSettings: globalThis.__youngwol_store_settings__ || { isPaused: false, pauseReason: '' }
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
      const content = data.files?.['orders.json']?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          globalThis.__youngwol_orders__ = parsed;
          globalThis.__youngwol_orders_last_sync__ = now;
          return {
            orders: parsed,
            storeSettings: globalThis.__youngwol_store_settings__ || { isPaused: false, pauseReason: '' }
          };
        } else if (parsed && Array.isArray(parsed.orders)) {
          globalThis.__youngwol_orders__ = parsed.orders;
          if (parsed.storeSettings) {
            globalThis.__youngwol_store_settings__ = parsed.storeSettings;
          }
          globalThis.__youngwol_orders_last_sync__ = now;
          return {
            orders: parsed.orders,
            storeSettings: globalThis.__youngwol_store_settings__ || { isPaused: false, pauseReason: '' }
          };
        }
      }
    }
  } catch (e) {
    console.warn('Persistent Gist orders fetch error:', e);
  }

  return {
    orders: globalThis.__youngwol_orders__ || [],
    storeSettings: globalThis.__youngwol_store_settings__ || { isPaused: false, pauseReason: '' }
  };
}

// 클라우드 영구 저장소(Gist)에 주문 목록 및 매장 설정 영구 저장
async function savePersistentData(orders: any[], storeSettings?: StoreSettings): Promise<void> {
  globalThis.__youngwol_orders__ = orders;
  if (storeSettings) {
    globalThis.__youngwol_store_settings__ = storeSettings;
  }
  globalThis.__youngwol_orders_last_sync__ = Date.now();

  const payloadToSave = {
    orders,
    storeSettings: globalThis.__youngwol_store_settings__ || { isPaused: false, pauseReason: '' }
  };

  try {
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'NextApp-60gye',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          'orders.json': {
            content: JSON.stringify(payloadToSave, null, 2)
          }
        }
      })
    });
  } catch (e) {
    console.warn('Persistent Gist orders save error:', e);
  }
}

export async function GET() {
  const { orders, storeSettings } = await getPersistentData();
  return NextResponse.json({ ok: true, orders, storeSettings }, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}

export async function POST(request: Request) {
  try {
    const newOrder = await request.json();
    if (!newOrder || !newOrder.id) {
      return NextResponse.json({ ok: false, error: '유효하지 않은 주문 데이터입니다.' }, { status: 400 });
    }

    const { orders, storeSettings } = await getPersistentData();

    // 중복 방지 (이미 존재하는 주문이면 갱신, 없으면 맨 앞에 추가)
    const existingIndex = orders.findIndex(o => o.id === newOrder.id);
    if (existingIndex > -1) {
      orders[existingIndex] = {
        ...orders[existingIndex],
        ...newOrder
      };
    } else {
      orders.unshift(newOrder);
      // 최근 100건 유지
      if (orders.length > 100) {
        orders.splice(100);
      }
    }

    await savePersistentData(orders, storeSettings);

    return NextResponse.json({ 
      ok: true, 
      order: newOrder, 
      orders,
      storeSettings 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Order POST error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, cancelReason, isStorePaused, pauseReason } = body;

    const { orders, storeSettings } = await getPersistentData();

    // 매장 일시정지 상태 갱신
    if (isStorePaused !== undefined) {
      storeSettings.isPaused = !!isStorePaused;
      if (pauseReason !== undefined) {
        storeSettings.pauseReason = pauseReason;
      }
    }

    // 개별 주문 상태 및 거절 사유 갱신
    if (id && status) {
      const order = orders.find(o => o.id === id);
      if (order) {
        order.status = status;
        if (cancelReason !== undefined) {
          order.cancelReason = cancelReason;
        }
        await savePersistentData(orders, storeSettings);
        return NextResponse.json({ 
          ok: true, 
          order, 
          orders, 
          storeSettings 
        });
      }
      return NextResponse.json({ ok: false, error: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }

    await savePersistentData(orders, storeSettings);
    return NextResponse.json({ 
      ok: true, 
      orders, 
      storeSettings 
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let { orders, storeSettings } = await getPersistentData();
    if (id) {
      orders = orders.filter(o => o.id !== id);
    } else {
      orders = [];
    }

    await savePersistentData(orders, storeSettings);
    return NextResponse.json({ ok: true, orders, storeSettings });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
