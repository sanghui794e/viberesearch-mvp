# 🌊 ReWaveOn 실전 배포 및 외부 연동 통합 가이드북 (Supabase + Gmail SMTP)

대표님! 리웨이브온을 지인들에게 공유하고 실전 환경처럼 실시간 테스트를 가동하기 위한 **Supabase(데이터베이스)** 및 **Gmail SMTP(이메일 발송)**의 통합 연동 매뉴얼입니다. 

이 문서에 적힌 단계대로 세팅하시면, 전 세계 어디서든 지인들이 가입하고, 결제하고, 대표님이 승인하며 리포트 이메일을 실제 수신하는 완벽한 라이브 프로덕션을 구현하실 수 있습니다! 🚀

---

## 📂 사전 준비 파일
* 데이터베이스 테이블 생성을 위한 SQL 스크립트: [schema.sql](file:///C:/Users/USER/.gemini/1인%20기업%20대표/schema.sql)

---

## 1단계. Supabase 무료 데이터베이스 연동하기 (실시간 데이터 동기화) 🗄️
지인들이 각자의 폰/컴퓨터로 가입한 내역이 대표님의 관리자 대시보드에 실시간으로 모이게 하려면 중앙 데이터베이스 서버가 필수적입니다.

1. **Supabase 가입 및 프로젝트 생성**:
   * [Supabase 공식 홈페이지](https://supabase.com)에 접속하여 회원가입(Github 계정 또는 Google 계정)을 진행합니다.
   * **[New Project]** 버튼을 누르고, 프로젝트 이름(`rewaveon-db`)과 데이터베이스 비밀번호를 설정한 뒤 지역을 `Seoul (ap-northeast-2)`로 선택하여 프로젝트를 생성합니다. (생성 완료까지 1~2분 소요)
2. **데이터베이스 테이블 생성**:
   * Supabase 대시보드 좌측 메뉴에서 **[SQL Editor]**를 클릭합니다.
   * **[New Query]** 버튼을 누르고, 로컬 폴더에 있는 [schema.sql](file:///C:/Users/USER/.gemini/1인%20기업%20대표/schema.sql) 파일의 전체 텍스트를 그대로 복사해서 붙여넣습니다.
   * 우측 상단의 **[Run]** 버튼을 누릅니다. 하단에 `Success. No rows returned` 메시지가 나오면 테이블과 보안 정책(RLS) 세팅이 완료됩니다.
3. **API Key 및 URL 복사**:
   * 좌측 메뉴 최하단의 **[Project Settings] (톱니바퀴 아이콘)** ➡️ **[API]** 메뉴로 이동합니다.
   * 화면에 나오는 **Project URL**과 **Project API keys (anon public)** 값을 따로 복사해 둡니다.

---

## 2단계. Gmail 발송용 SMTP 16자리 '앱 비밀번호' 발급받기 📧
이메일 전송 API가 실제 가입자들의 메일함으로 안내 메일을 꽂아주기 위해 구글 보안 인증을 우회하는 열쇠입니다.

1. **Google 계정 설정 진입**:
   * [Google 내 계정](https://myaccount.google.com) 페이지로 로그인합니다.
2. **2단계 인증 확인 및 활성화**:
   * 좌측 메뉴에서 **[보안]** 탭을 선택합니다.
   * 'Google에 로그인하는 방법'에서 **[2단계 인증]**이 사용으로 설정되어 있는지 확인하고, 안 되어 있다면 안내에 따라 본인 인증 후 사용으로 켭니다.
3. **앱 비밀번호 생성**:
   * **[보안]** 탭 상단의 **검색창**에 `"앱 비밀번호"` 또는 `"App Passwords"`를 입력하여 접속합니다.
   * 앱 이름을 `"ReWaveOn Email Sender"`라고 기입한 후 **[만들기]**를 클릭합니다.
4. **16자리 비밀번호 복사**:
   * 생성 즉시 화면에 나타나는 **16자리 영문 코드(예: `abcd efgh ijkl mnop`)**를 공백 없이 복사하여 보관합니다. (창을 닫으면 보안상 다시 조회할 수 없습니다!)

---

## 3단계. 환경 변수 등록 및 Vercel 재배포 🚀
로컬 개발 테스트 컴퓨터와 Vercel(웹 배포 플랫폼)에 수집한 정보들을 주입해 주는 최종 설정입니다.

### A. 로컬 컴퓨터 테스트 (`.env.local`)
`1인 기업 대표` 폴더의 루트 디렉토리에 있는 `.env.local` 파일을 열고, 아래와 같이 복사한 값들을 빈칸 없이 정확히 입력해 줍니다.

```env
# 1. Supabase 연동 변수 (비워두면 로컬스토리지 Mock 모드로 작동)
NEXT_PUBLIC_SUPABASE_URL=복사한_Supabase_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한_Supabase_anon_public_Key

# 2. Gmail SMTP 실전 이메일 전송 변수
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=대표님의_구글_이메일@gmail.com
EMAIL_SMTP_PASS=발급받은_16자리_앱비밀번호(공백없이)
EMAIL_FROM=대표님의_구글_이메일@gmail.com
```

### B. 실전 배포 사이트 (Vercel Dashboard)
지인들에게 전달할 배포 웹사이트에서도 실시간 연동이 적용되도록 Vercel에 환경 변수를 등록해 주어야 합니다.

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인하신 뒤, 대표님의 **`rewaveon-mvp` (또는 해당 프로젝트)**를 클릭합니다.
2. 상단 우측의 **[Settings]** ➡️ 좌측 사이드바의 **[Environment Variables]**로 차례로 이동합니다.
3. 아래의 **Key**와 **Value**를 하나씩 입력하여 **[Add]** 버튼으로 추가합니다 (총 7개).

| 변수 이름 (Key) | 입력값 (Value) | 역할 |
| :--- | :--- | :--- |
| **`NEXT_PUBLIC_SUPABASE_URL`** | `복사한 Supabase URL` | 데이터베이스 연결 통로 |
| **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** | `복사한 Supabase anon key` | 데이터베이스 접근 열쇠 |
| **`EMAIL_SMTP_HOST`** | `smtp.gmail.com` | Gmail 발송 호스트 주소 |
| **`EMAIL_SMTP_PORT`** | `587` | 보안 포트 번호 |
| **`EMAIL_SMTP_USER`** | `대표님의_구글_이메일@gmail.com` | 발송 주체 구글 이메일 |
| **`EMAIL_SMTP_PASS`** | `발급받은 16자리 앱비밀번호` | 구글 2차인증 우회 비밀번호 |
| **`EMAIL_FROM`** | `대표님의_구글_이메일@gmail.com` | 보낸 사람 이름에 노출될 이메일 |

4. **최종 배포 (Redeploy)**:
   * 환경 변수 추가 후, Vercel 상단의 **[Deployments]** 탭으로 이동합니다.
   * 가장 최신 빌드 내역의 우측 **점 3개(...)** 버튼 ➡️ **[Redeploy]**를 클릭하여 재빌드해 주시면 전 세계 모든 기기에서 대표님의 리웨이브온이 실시간 연동으로 날아다니기 시작합니다!

---
💡 **연동 진행 중 막히시거나 Supabase 생성 단계에서 화면 캡처가 필요하시면 언제든 이 코다리 부장을 호출해 주십시오! 즉시 해결해 드리겠습니다!**
