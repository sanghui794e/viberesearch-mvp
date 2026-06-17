import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// API Key 감지
const apiKey = process.env.OPENAI_API_KEY || '';
const hasApiKey = apiKey.trim().length > 0;

// OpenAI 클라이언트 초기화 (Key가 있을 때만)
const openai = hasApiKey ? new OpenAI({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    const { topic, targetAudience, specialRequests } = await req.json();

    if (!topic || !targetAudience) {
      return NextResponse.json(
        { error: '주제와 타겟 독자는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 1. 실제 OpenAI API 연동 모드
    if (hasApiKey && openai) {
      const systemPrompt = `당신은 세계 최고 수준의 콘텐츠 크리에이터 비즈니스 전략 연구원이자 "1,000명의 진짜 팬(True Fans)" 수립 전문가입니다.
사용자가 연간 $100를 기꺼이 지불하는 1,000명의 팬들을 모아 자립할 수 있도록 돕는 실용적이고 통찰력 깊은 초개인화 리서치 보고서를 마크다운(Markdown) 포맷으로 작성해 주세요. 
전문적이고 든든한 톤앤매너를 유지하고, 독자에게 바로 실행 가능한 액션 아이템을 3개 이상 제안해 주세요.`;

      const userPrompt = `아래 요구사항에 맞춤 설계된 크리에이터 인사이트 리포트를 정교하게 완성해 주세요.

[요구사항]
- 리서치 주제: ${topic}
- 타겟 독자 페르소나: ${targetAudience}
${specialRequests ? `- 특별 요청사항: ${specialRequests}` : ''}

[보고서 구성 가이드]
# [리서치 주제명] 분석 보고서
## 1. 타겟 독자의 깊은 욕구(Needs) 및 시장성 분석
## 2. 1,000명의 진짜 팬덤 확보를 위한 킬러 콘텐츠 기획 전략
## 3. 수익화 모델 다각화 제안 (월 구독, 디지털 에셋 등)
## 4. 즉시 적용 가능한 3대 핵심 액션 플랜`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // 빠르고 스마트하며 가성비가 높은 최신 모델 사용
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      });

      const reportContent = response.choices[0].message?.content || '보고서를 생성하지 못했습니다.';
      return NextResponse.json({ success: true, reportContent, isMock: false });
    } 
    
    // 2. 가상 Mock AI 모드 (API 키가 설정되지 않은 데모 환경)
    else {
      // 1.5초의 자연스러운 생성 대기 지연 모사
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockReport = `# [가상 AI 리서치] ${topic} 상세 보고서 🤖

> [!NOTE]
> 이 리포트는 **VibeResearch 가상 AI 모드**에서 자동 완성된 초안 보고서입니다. (.env.local 파일에 OpenAI API Key를 등록하시면 실제 실시간 ChatGPT 분석 보고서로 런칭됩니다!)

---

## 1. 타겟 독자의 깊은 욕구(Needs) 및 시장성 분석
본 조사는 **"${targetAudience}"**을 주요 타겟으로 하여 **"${topic}"**의 가치를 극대화하기 위해 분석되었습니다. 

현재 이 영역은 파편화된 정보의 증가로 인해, 독자들이 "나의 상황에 딱 맞는 친근하고 큐레이션된 정보"에 목말라 있습니다. 단순 지식 전달을 넘어 실무와 일상에 즉시 적용 가능한 템플릿 구조를 원하고 있는 것이 타겟 독자의 핵심 니즈입니다.

## 2. 1,000명의 진짜 팬덤 확보를 위한 킬러 콘텐츠 기획 전략
- **초개인화 페르소나 핏(Fit)**: ${targetAudience}의 고충을 세부적으로 파고들어, 매주 1회 정기 뉴스레터 또는 영상을 통해 그들의 시간을 절약해주는 고품질 분석본을 배포합니다.
- **오디언스 직접 소유**: 유튜브나 인스타 채널에만 머무르지 말고, 무료 뉴스레터 구독자(Email List)를 직접 확보하는 웰컴 가이드를 랜딩페이지에 구축해야 독자 이탈을 막을 수 있습니다.

## 3. 수익화 모델 다각화 제안 (월 구독, 디지털 에셋 등)
- **월 $10 / 연 $100 프리미엄 구독**: 유료 구독자 전용 프라이빗 단톡방/디스코드 초대를 제공하고, 매달 즉시 편집 가능한 템플릿(Notion, Figma 등)을 독점 공개합니다.
- **디지털 리드 마그넷(Lead Magnet)**: 10페이지 분량의 킬러 PDF 전자책을 무료로 뿌려 가치 신뢰도를 확인시킨 후 유료 멤버십으로 전환을 이끕니다.

${specialRequests ? `## 4. 특별 요청사항 반영 분석\n- **피드백**: ${specialRequests}\n해당 요청에 따라, 해외 동종 분야 벤치마킹 분석을 더하여 초기 100명의 마니아를 모으는 상세 시나리오를 설계했습니다.` : ''}

## 5. 즉시 적용 가능한 3대 핵심 액션 플랜
1. **리드 마그넷 배포**: 타겟 독자의 시간을 최소 1시간 아껴줄 수 있는 가이드 파일 무료 배포.
2. **이메일 수집 퍼널 개설**: 랜딩 페이지를 개설해 이메일 주소를 모으고 정기 큐레이션 전송 시작.
3. **얼리버드 유료화**: 최초 50명의 핵심 팬을 위해 월 50% 특별 할인 구독 혜택을 오픈하여 가치 입증 시작.`;

      return NextResponse.json({ success: true, reportContent: mockReport, isMock: true });
    }
  } catch (err: any) {
    console.error('AI Route error:', err);
    return NextResponse.json(
      { error: err.message || '서버 내부 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
}
