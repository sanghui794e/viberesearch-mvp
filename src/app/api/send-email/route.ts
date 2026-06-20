import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// 마크다운을 간단한 HTML 태그로 치환해주는 경량 헬퍼 함수
function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  return markdown
    .replace(/^# (.*$)/gim, '<h1 style="color: #10b981; font-size: 20px; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-top: 24px; margin-bottom: 12px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #818cf8; font-size: 16px; margin-top: 20px; margin-bottom: 8px;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #cbd5e1; font-size: 14px; margin-top: 16px; margin-bottom: 6px;">$1</h3>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 6px; list-style-type: square; color: #94a3b8;">$1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 6px; list-style-type: circle; color: #94a3b8;">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background-color: #0f172a; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #f43f5e;">$1</code>')
    .replace(/\n/g, '<br />');
}

export async function POST(request: Request) {
  try {
    const { type = 'welcome', email, topic, content } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // SMTP 환경 변수 로드
    const smtpHost = process.env.EMAIL_SMTP_HOST;
    const smtpPort = process.env.EMAIL_SMTP_PORT;
    const smtpUser = process.env.EMAIL_SMTP_USER;
    const smtpPass = process.env.EMAIL_SMTP_PASS;
    const emailFrom = process.env.EMAIL_FROM || 'no-reply@rewaveon.com';

    const isSmtpConfigured = smtpHost && smtpPort && smtpUser && smtpPass;

    // 메일 내용 정의
    let subject = '';
    let htmlContent = '';

    if (type === 'welcome') {
      subject = '[ReWaveOn] 가입 신청 및 결제가 접수되었습니다. (승인 대기 안내)';
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #1e293b; border-radius: 20px; background-color: #0b0f14; color: #cbd5e1;">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; width: 48px; height: 48px; background-color: #6366f1; border-radius: 12px; line-height: 48px; text-align: center; color: #ffffff; font-weight: bold; font-size: 20px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);">R</div>
            <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.5px;">ReWaveOn</h1>
            <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">일과 휴식의 완벽한 파동을 켜다</p>
          </div>
          <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #10b981; text-align: center;">가입 신청이 안전하게 접수되었습니다! 🎉</h2>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 12px; color: #94a3b8;">안녕하세요, 크리에이터님!</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px; color: #cbd5e1;">리웨이브온 Pro 구독 결제와 가입 신청이 성공적으로 완료되었습니다. <br />본 플랫폼은 1인 소상공인 지인 중심의 폐쇄형 MVP 서비스로 작동하여, 최종적인 대시보드 오픈은 <strong>관리자의 가입 승인 검토 완료 후에 활성화</strong>됩니다.</p>
          
          <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 18px; border-radius: 12px; margin-bottom: 24px;">
            <span style="font-size: 10px; font-weight: bold; color: #6366f1; text-transform: uppercase; display: block; margin-bottom: 8px; tracking-wider">신청 정보</span>
            <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">가입 이메일: ${email}</div>
            <div style="font-size: 12px; color: #f59e0b; font-weight: bold;">상태: 가입 승인 대기 중 (최대 1~2시간 소요)</div>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px;">승인이 완료되면 이메일로 즉시 알림이 발송되며, 바로 리서치 비서를 소환하여 AI 분석 보고서를 무제한으로 발행하실 수 있습니다. 잠시만 기다려주세요!</p>

          <div style="text-align: center; margin-bottom: 12px;">
            <a href="http://localhost:3000/dashboard" style="display: inline-block; background-color: #6366f1; color: #ffffff; font-weight: bold; font-size: 13px; padding: 12px 28px; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
              내 대시보드로 이동하기
            </a>
          </div>

          <p style="font-size: 11px; line-height: 1.6; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 32px; text-align: center;">
            본 메일은 ReWaveOn 서비스 가입 신청 완료에 따른 자동 발송 메일입니다. 궁금한 점이 있으시다면 <a href="mailto:admin@rewaveon.com" style="color: #6366f1; text-decoration: none;">admin@rewaveon.com</a>으로 편하게 문의주세요.
          </p>
        </div>
      `;
    } else if (type === 'approval') {
      subject = '[ReWaveOn] 가입 승인이 완료되었습니다! 🎉';
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #1e293b; border-radius: 20px; background-color: #0b0f14; color: #cbd5e1;">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; width: 48px; height: 48px; background-color: #10b981; border-radius: 12px; line-height: 48px; text-align: center; color: #ffffff; font-weight: bold; font-size: 20px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">R</div>
            <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.5px;">ReWaveOn</h1>
            <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">일과 휴식의 완벽한 파동을 켜다</p>
          </div>
          <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #10b981; text-align: center;">계정 승인이 완료되었습니다! 🚀</h2>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 12px; color: #94a3b8;">안녕하세요, 크리에이터님!</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px; color: #cbd5e1;">기다려주셔서 감사합니다. 대표님의 리웨이브온 Pro 가입 신청 및 계정 검토가 정상 완료되어 **대시보드 기능이 즉시 활성화**되었습니다.</p>
          
          <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 18px; border-radius: 12px; margin-bottom: 24px;">
            <span style="font-size: 10px; font-weight: bold; color: #10b981; text-transform: uppercase; display: block; margin-bottom: 8px; tracking-wider">계정 권한</span>
            <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">가입 이메일: ${email}</div>
            <div style="font-size: 12px; color: #10b981; font-weight: bold;">상태: 구독 활성 및 승인 완료 (이용 가능)</div>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px;">지금 바로 대시보드에서 전담 AI 리서치 비서를 소환하여, 시장 분석 및 마케팅 전략 리포트를 발행해 보세요! 사업 성장의 든든한 파트너가 되어 드리겠습니다.</p>

          <div style="text-align: center; margin-bottom: 12px;">
            <a href="http://localhost:3000/dashboard" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: bold; font-size: 13px; padding: 12px 28px; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              내 대시보드로 이동하여 첫 리서치 시작하기
            </a>
          </div>

          <p style="font-size: 11px; line-height: 1.6; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 32px; text-align: center;">
            본 메일은 ReWaveOn 서비스 가입 승인 완료에 따른 자동 발송 메일입니다. 궁금한 점이 있으시다면 <a href="mailto:admin@rewaveon.com" style="color: #10b981; text-decoration: none;">admin@rewaveon.com</a>으로 편하게 문의주세요.
          </p>
        </div>
      `;
    } else if (type === 'report') {
      subject = `[ReWaveOn 리포트] ${topic}`;
      const reportHtml = parseMarkdownToHtml(content);
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 650px; margin: 0 auto; padding: 32px; border: 1px solid #1e293b; border-radius: 20px; background-color: #0b0f14; color: #cbd5e1;">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; width: 48px; height: 48px; background-color: #10b981; border-radius: 12px; line-height: 48px; text-align: center; color: #ffffff; font-weight: bold; font-size: 20px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">R</div>
            <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.5px;">ReWaveOn</h1>
            <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">일과 휴식의 완벽한 파동을 켜다</p>
          </div>
          <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">요청하신 AI 마케팅 분석 보고서가 도착했습니다! 🍕✨</h2>
          
          <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 18px; border-radius: 12px; margin-bottom: 24px; font-size: 13px; color: #ffffff; font-weight: bold;">
            리서치 주제: ${topic}
          </div>

          <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 24px; border-radius: 16px; margin-bottom: 28px; line-height: 1.7; font-size: 13px;">
            ${reportHtml}
          </div>

          <div style="text-align: center; margin-bottom: 12px;">
            <a href="http://localhost:3000/dashboard" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: bold; font-size: 13px; padding: 12px 28px; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              대시보드에서 PDF로 고품질 인쇄하기
            </a>
          </div>

          <p style="font-size: 11px; line-height: 1.6; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 32px; text-align: center;">
            본 이메일은 ReWaveOn AI 리서치 분석 완료 메일입니다. 추가 리서치를 신청하시려면 대시보드를 방문해주세요.
          </p>
        </div>
      `;
    }

    const printMockEmail = (mockType: string, targetEmail: string, fromEmail: string, mailSubject: string) => {
      console.log(`
=========================================
[MOCK EMAIL TRANSMISSION - FALLBACK]
-----------------------------------------
Type:    ${mockType}
To:      ${targetEmail}
From:    ${fromEmail}
Subject: ${mailSubject}
=========================================
      `);
    };

    if (isSmtpConfigured) {
      try {
        console.log(`[Email Service] Attempting to send actual email (${type}) to ${email} via ${smtpHost}`);
        
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort!),
          secure: smtpPort === '465',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"ReWaveOn" <${emailFrom}>`,
          to: email,
          subject,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Email Service] Success sending actual email to ${email}`);
        return NextResponse.json({ success: true, mode: 'smtp' });
      } catch (smtpError: any) {
        console.error(`[Email Service] SMTP configuration was present but transmission failed. Falling back to Mock Mode. Error Details:`, smtpError.message || smtpError);
        printMockEmail(type, email, emailFrom, subject);
        return NextResponse.json({ success: true, mode: 'mock_fallback', error: smtpError.message });
      }
    } else {
      // SMTP 설정이 없어 가상 Mock Mode 작동
      console.warn(`[Email Service] SMTP is not configured. Running in Mock Mode.`);
      printMockEmail(type, email, emailFrom, subject);
      return NextResponse.json({ success: true, mode: 'mock' });
    }
  } catch (error: any) {
    console.error('[Email Service] Unexpected error in send-email API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
