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

      // 입력 키워드 기반으로 로컬 매장/소상공인 비즈니스인지 지식 크리에이터 비즈니스인지 감지
      const lowerTopic = (topic + ' ' + targetAudience + ' ' + (specialRequests || '')).toLowerCase();
      const isLocalBusiness = 
        lowerTopic.includes('치킨') || 
        lowerTopic.includes('가게') || 
        lowerTopic.includes('매장') || 
        lowerTopic.includes('식당') || 
        lowerTopic.includes('카페') || 
        lowerTopic.includes('숍') || 
        lowerTopic.includes('네일') || 
        lowerTopic.includes('미용') || 
        lowerTopic.includes('학원') || 
        lowerTopic.includes('꽃') || 
        lowerTopic.includes('로컬') || 
        lowerTopic.includes('강원') || 
        lowerTopic.includes('영월') ||
        lowerTopic.includes('점');

      let mockReport = '';

      if (isLocalBusiness) {
        // 로컬 매장 맞춤형 정교한 가상 리포트 양식
        mockReport = `# [VibeResearch 분석] ${topic} 로컬 밀착형 마케팅 전략 제안서 📊

## 1. 지역 오디언스(소비자) 타겟팅 분석
* **핵심 타겟**: ${targetAudience}
* **소비 성향**: 강원 영월 지역 내 주민과 외부 방문객(캠핑족/관광객)의 유입 특성을 동시에 지닌 상권입니다. 타겟 독자층은 신뢰성 높고 직관적이며, 즉각적인 오프라인 혜택(서비스 증정, 쿠폰)에 가장 민감하게 반응합니다.
* **상권 차별화 포인트**: 타 브랜드와 경쟁하기 위해서는 단순 메뉴 나열 방식이 아닌 매장만의 위생 관리(예: 새 기름 사용 등), 깨끗한 지역 이미지와의 융합, 매장 직원의 친근함을 담은 브랜드 스토리가 핵심 차별화 요소가 됩니다.

## 2. 지역 팬덤 확보를 위한 킬러 콘텐츠 및 마케팅 전략
* **로컬 신뢰도 각인 숏폼 비디오**: 
  - 매일 아침 깨끗한 새 재료와 기름을 개봉하여 튀겨내는 실제 주방 조리 과정을 15초 분량의 소리가 강조된 바삭한 ASMR 영상으로 제작해 배포합니다.
  - 영상 내 로케이션(지도 및 매장 위치)을 노출하여 주민들의 오프라인 매장 친밀감을 높입니다.
* **오프라인 연계 이벤트 설계**:
  - "숏폼/쇼츠 보고 오셨다고 말씀해 주시면 서비스 증정!" 콘셉트의 영상 릴스를 게재하여 자발적 댓글 참여와 군인, 학생, 젊은 부모 세대의 방문율을 자극합니다.

## 3. 타사 대비 경쟁 우위 방안 및 피드백 반영
${specialRequests ? `* **특별 피드백 반영 분석**: ${specialRequests}\n` : ''}* **경쟁 매장 비교**: 대형 프랜차이즈 브랜드(교촌, BHC 등)는 정형화된 중앙 통제식 광고만 집행하여 지역 주민과의 1:1 친밀감이 떨어집니다. 반면 본 매장은 영월 지역 한정 게릴라 이벤트나 군 장병/학생 맞춤형 소통 콘텐츠를 적극적으로 제작해 훨씬 충성도 높은 단골(로컬 팬덤)을 확보하기 유리합니다.

## 4. 즉시 적용 가능한 3대 실행 로드맵
1. **ASMR 숏폼 영상 업로드**: 주 3회 인스타그램 릴스 및 유튜브 쇼츠에 매장 주방 조리 과정을 담은 ASMR 숏폼 콘텐츠 정기 발행 시작.
2. **네이버 플레이스 최적화**: 숏폼 영상과 리뷰 이벤트를 플레이스 공지에 등록하고 10% 웰컴 쿠폰 발급 연동.
3. **로컬 오프라인 혜택 셋팅**: 매장 방문 시 "숏폼 구독 화면"을 인증하면 음료수 또는 사이드 메뉴를 즉석 서비스 제공하여 재방문율 고정.`;
      } else {
        // 일반 지식 크리에이터 / 온라인 비즈니스용 정교한 가상 리포트 양식
        mockReport = `# [VibeResearch 분석] ${topic} 지식 지향형 콘텐츠 비즈니스 전략 기획서 🎯

## 1. 타겟 독자의 페르소나 및 깊은 니즈 분석
* **핵심 타겟**: ${targetAudience}
* **소비 성향**: 정보의 홍수 속에서 내 상황에 정확히 커스텀된 고부가가치 요약 정보 및 실무 가이드라인에 대한 니즈가 강합니다.
* **시장성 분석**: 단순 조회수 중심의 미디어 비즈니스에서 벗어나, 직접 소유한 소통망(뉴스레터 리드 마그넷 및 단골 오디언스 확보)을 갖추어야만 지속 가능한 유료 구독 성장을 기대할 수 있는 시장입니다.

## 2. 1,000명의 진짜 팬덤(True Fans) 확보를 위한 콘텐츠 기획
* **웰컴 이메일 시퀀스(Sequence) 설계**: 
  - 신규 구독자가 들어왔을 때 즉시 감동할 수 있는 3편의 시그니처 무료 가이드를 연달아 발송하여 강력한 첫인상과 전문성 각인.
* **오디언스 락인(Lock-in) 킬러 포맷**:
  - 매주 고정된 날짜에 심층 분석 리포트나 실행 가능한 워크시트(템플릿)를 전송하여 구독자와의 정기적인 터치포인트 구축.

## 3. 수익화 다각화 모델 제안 및 피드백 반영
${specialRequests ? `* **특별 피드백 반영 분석**: ${specialRequests}\n` : ''}* **프리미엄 템플릿 번들링**: 노션, 피그마 또는 PDF 템플릿 등 타겟 독자의 작업 시간을 절반 이하로 줄여줄 수 있는 디지털 에셋을 기획하여 유료 멤버십으로 전환합니다.
* **월 구독/소규모 커뮤니티 개설**: 초기 100명의 마니아를 모으기 위한 소규모 단독 채널(디스코드, 단톡방 등)을 개설하여 프라이빗 코칭 및 라이브 세션을 엮은 패키지 출시.

## 4. 즉시 적용 가능한 3대 실행 로드맵
1. **리드 마그넷 배포**: 구독자의 고민을 즉각 덜어줄 수 있는 소책자 PDF 무료 배포를 통한 이메일 데이터 수집.
2. **이메일 수집 랜딩페이지 구축**: 3초 만에 구독 신청이 가능한 초간단 뉴스레터 수집 홈페이지 개설.
3. **얼리버드 런칭**: 핵심 단골 50명을 대상으로 월간 프리미엄 혜택을 50% 우대된 할인 가격으로 선보여 가치 입증 시작.`;
      }

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
