import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // SMTP 환경 변수 로드
    const smtpHost = process.env.EMAIL_SMTP_HOST;
    const smtpPort = process.env.EMAIL_SMTP_PORT;
    const smtpUser = process.env.EMAIL_SMTP_USER;
    const smtpPass = process.env.EMAIL_SMTP_PASS;
    const emailFrom = process.env.EMAIL_FROM || 'no-reply@viberesearch.com';

    const isSmtpConfigured = smtpHost && smtpPort && smtpUser && smtpPass;

    if (isSmtpConfigured) {
      console.log(`[Email Service] Attempting to send actual email to ${email} via ${smtpHost}`);
      
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort!),
        secure: smtpPort === '465', // 465 포트는 SSL 사용
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"VibeResearch" <${emailFrom}>`,
        to: email,
        subject: '[VibeResearch] 가입 승인이 완료되었습니다! 🎉',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 24px; font-weight: bold; color: #3b82f6;">VibeResearch</span>
            </div>
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #0f172a; text-align: center;">가입 승인이 완료되었습니다! ⏳➡️🔓</h2>
            <p style="font-size: 14px; line-height: 1.6; margin-bottom: 12px;">안녕하세요, 크리에이터님!</p>
            <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">VibeResearch의 프라이빗 베타 테스트 참가를 위한 대기 승인이 성공적으로 처리되었습니다. 이제 자유롭게 리서치를 요청하고 분석 보고서를 수령하실 수 있습니다.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <span style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 6px;">서비스 정보</span>
              <div style="font-size: 13px; font-weight: bold; color: #334155;">계정 이메일: ${email}</div>
              <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-top: 4px;">상태: 대시보드 무제한 활성</div>
            </div>

            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://viberesearch-mvp.vercel.app/dashboard" style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-weight: bold; font-size: 14px; padding: 12px 24px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);">
                내 대시보드로 이동하기
              </a>
            </div>

            <p style="font-size: 12px; line-height: 1.6; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
              본 메일은 VibeResearch 가입 승인에 따른 자동 발송 메일입니다. 궁금하신 점이 있다면 <a href="mailto:admin@viberesearch.com" style="color: #3b82f6; text-decoration: none;">admin@viberesearch.com</a>으로 문의해 주세요.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[Email Service] Success sending actual email to ${email}`);
      return NextResponse.json({ success: true, mode: 'smtp' });
    } else {
      // SMTP 설정이 없어 가상 Mock Mode 작동
      console.warn(`[Email Service] SMTP is not configured. Running in Mock Mode.`);
      console.log(`
=========================================
[MOCK EMAIL TRANSMISSION]
-----------------------------------------
To:      ${email}
From:    ${emailFrom}
Subject: [VibeResearch] 가입 승인이 완료되었습니다! 🎉
Content:
안녕하세요, 크리에이터님! VibeResearch 대기 승인이 처리되었습니다.
대시보드(https://viberesearch-mvp.vercel.app/dashboard)에서 첫 리서치 비서를 만나보세요!
=========================================
      `);
      return NextResponse.json({ success: true, mode: 'mock' });
    }
  } catch (error: any) {
    console.error('[Email Service] Failed to send email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
