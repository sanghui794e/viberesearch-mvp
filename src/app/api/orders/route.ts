import { NextResponse } from 'next/server';

// Next.js Node.js Serverless 글로벌 주문 저장소
declare global {
  // eslint-disable-next-line no-var
  var __youngwol_orders__: any[] | undefined;
}

if (!globalThis.__youngwol_orders__) {
  globalThis.__youngwol_orders__ = [];
}

export async function GET() {
  const orders = globalThis.__youngwol_orders__ || [];
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

    if (!globalThis.__youngwol_orders__) {
      globalThis.__youngwol_orders__ = [];
    }

    // 중복 방지 (이미 존재하는 주문이면 갱신, 없으면 맨 앞에 추가)
    const existingIndex = globalThis.__youngwol_orders__.findIndex(o => o.id === newOrder.id);
    if (existingIndex > -1) {
      globalThis.__youngwol_orders__[existingIndex] = {
        ...globalThis.__youngwol_orders__[existingIndex],
        ...newOrder
      };
    } else {
      globalThis.__youngwol_orders__.unshift(newOrder);
      // 최근 100건 유지
      if (globalThis.__youngwol_orders__.length > 100) {
        globalThis.__youngwol_orders__ = globalThis.__youngwol_orders__.slice(0, 100);
      }
    }

    return NextResponse.json({ 
      ok: true, 
      order: newOrder, 
      orders: globalThis.__youngwol_orders__ 
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

    if (!globalThis.__youngwol_orders__) {
      globalThis.__youngwol_orders__ = [];
    }

    const order = globalThis.__youngwol_orders__.find(o => o.id === id);
    if (order) {
      order.status = status;
      return NextResponse.json({ ok: true, order, orders: globalThis.__youngwol_orders__ });
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

    if (id) {
      if (globalThis.__youngwol_orders__) {
        globalThis.__youngwol_orders__ = globalThis.__youngwol_orders__.filter(o => o.id !== id);
      }
    } else {
      globalThis.__youngwol_orders__ = [];
    }

    return NextResponse.json({ ok: true, orders: globalThis.__youngwol_orders__ || [] });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
