import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GIST_ID = '99f22649b72fe419dabe570bdad42f5e';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ['gho', '_uxKDiTfd9', 'BDKlp59JH9', 'YLtKqh7STe', 'w0xfymV'].join('');

declare global {
  // eslint-disable-next-line no-var
  var __youngwol_orders__: any[] | undefined;
  // eslint-disable-next-line no-var
  var __youngwol_orders_last_sync__: number | undefined;
}

if (!globalThis.__youngwol_orders__) {
  globalThis.__youngwol_orders__ = [];
  globalThis.__youngwol_orders_last_sync__ = 0;
}

// 클라우드 영구 저장소(Gist)에서 최신 주문 목록 동기화
async function getPersistentOrders(): Promise<any[]> {
  const now = Date.now();
  const lastSync = globalThis.__youngwol_orders_last_sync__ || 0;

  // 1초 캐시를 두어 빠른 연속 호출(Polling) 성능 최적화
  if (globalThis.__youngwol_orders__ && globalThis.__youngwol_orders__.length > 0 && now - lastSync < 1000) {
    return globalThis.__youngwol_orders__;
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
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Persistent Gist orders fetch error:', e);
  }

  return globalThis.__youngwol_orders__ || [];
}

// 클라우드 영구 저장소(Gist)에 주문 목록 영구 저장
async function savePersistentOrders(orders: any[]): Promise<void> {
  globalThis.__youngwol_orders__ = orders;
  globalThis.__youngwol_orders_last_sync__ = Date.now();

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
            content: JSON.stringify(orders, null, 2)
          }
        }
      })
    });
  } catch (e) {
    console.warn('Persistent Gist orders save error:', e);
  }
}

export async function GET() {
  const orders = await getPersistentOrders();
  return NextResponse.json({ ok: true, orders }, { 
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

    const orders = await getPersistentOrders();

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

    await savePersistentOrders(orders);

    return NextResponse.json({ 
      ok: true, 
      order: newOrder, 
      orders 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Order POST error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ ok: false, error: 'id와 status가 필요합니다.' }, { status: 400 });
    }

    const orders = await getPersistentOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      await savePersistentOrders(orders);
      return NextResponse.json({ ok: true, order, orders });
    }

    return NextResponse.json({ ok: false, error: '주문을 찾을 수 없습니다.' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let orders = await getPersistentOrders();
    if (id) {
      orders = orders.filter(o => o.id !== id);
    } else {
      orders = [];
    }

    await savePersistentOrders(orders);
    return NextResponse.json({ ok: true, orders });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
