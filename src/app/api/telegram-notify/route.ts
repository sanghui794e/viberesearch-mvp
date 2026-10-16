import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, orderType, address, pickupTime, targetPickupTime, items, total, requestText } = body;

    // 영월점 기본 텔레그램 Chat ID (확보된 값)
    const chatId = process.env.TELEGRAM_CHAT_ID || '-5362496406';
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      console.log('텔레그램 봇 토큰이 환경변수(TELEGRAM_BOT_TOKEN)에 설정되어 있지 않습니다.');
      return NextResponse.json({ 
        ok: false, 
        message: '텔레그램 봇 토큰 미설정 (시뮬레이션 모드 작동 중)' 
      });
    }

    // 텔레그램 전송용 텍스트 메시지 포맷팅
    const menuSummary = items.map((i: any) => `• ${i.name} (${i.type}) x ${i.quantity}개`).join('\n');
    const orderTypeLabel = orderType === 'takeout' ? '🛍️ [포장 주문]' : '🛵 [배달 주문]';

    const messageText = `
🚨 [60계치킨 영월점 신규 주문 접수]

${orderTypeLabel}
• 주문자: ${name} 님 (${phone})
${orderType === 'delivery' ? `• 배달주소: ${address}` : `• 방문예정: ${pickupTime}`}
⏰ 조리/방문 완료 목표시각: ${targetPickupTime || '18:10'}

[주문 제품]
${menuSummary}

• 결제 금액: ${Number(total).toLocaleString()}원
• 요청 사항: ${requestText || '없음'}

주방 전광판 및 영수증 프린터로 전달되었습니다!
`.trim();

    // Telegram SendMessage API 호출
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
      }),
    });

    const telegramData = await telegramRes.json();

    if (telegramData.ok) {
      return NextResponse.json({ ok: true, message: '텔레그램 알림 전송 성공!' });
    } else {
      return NextResponse.json({ ok: false, error: telegramData.description });
    }

  } catch (error: any) {
    console.error('Telegram notification error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
