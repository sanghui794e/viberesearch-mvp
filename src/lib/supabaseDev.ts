// ==============================================================================
// 🛡️ rewaveon-dev 개발 전용 독립 Supabase 클라이언트 및 유틸리티 모듈
// 대상 프로젝트: rewaveon-dev (개발용 격리 데이터베이스 전용)
// 보안 원칙:
//   1. 서버 사이드 전용 구동 (브라우저 번들 노출 원천 차단)
//   2. 운영 데이터베이스(rewaveon-db) 연결 원천 차단 가드 적용
//   3. 서비스 롤 키(Service Role Key) 로그/에러/외부 export 완전 격리
//   4. 외부 패키지 추가 없이 @supabase/supabase-js 및 Node.js 내장 crypto만 활용
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ------------------------------------------------------------------------------
// 1. 서버 사이드 전용 실행 보증 가드 (Browser Execution Guard)
// ------------------------------------------------------------------------------
if (typeof window !== 'undefined') {
  throw new Error('보안 경고: supabaseDev 모듈은 브라우저에서 실행할 수 없습니다. 오직 서버 사이드 API에서만 사용하십시오.');
}

// ------------------------------------------------------------------------------
// 2. 개발용 데이터베이스 연결 검증 및 운영 프로젝트 접속 방지 가드
// ------------------------------------------------------------------------------
const devUrl = process.env.DEV_SUPABASE_URL || '';
const devServiceRoleKey = process.env.DEV_SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * 개발용 DB 연결 상태 및 운영 프로젝트 혼선 방지 검증 함수
 */
function validateDevEnvironment(url: string, key: string): { isValid: boolean; reason?: string } {
  if (!url || !key) {
    return {
      isValid: false,
      reason: 'DEV_SUPABASE_URL 또는 DEV_SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다.',
    };
  }

  // 운영 프로젝트 연결 방지 안전장치
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('rewaveon-db') || lowerUrl.includes('prod') || lowerUrl.includes('production')) {
    throw new Error('치명적 보안 오류: 개발용 모듈이 운영 데이터베이스(rewaveon-db 또는 production)를 가리킬 수 없습니다.');
  }

  return { isValid: true };
}

// ------------------------------------------------------------------------------
// 3. 서버 전용 개발 Supabase 클라이언트 인스턴스 (Service Role 기반)
// ------------------------------------------------------------------------------
let cachedDevClient: SupabaseClient | null = null;

export function getDevSupabaseClient(): SupabaseClient {
  const validation = validateDevEnvironment(devUrl, devServiceRoleKey);
  if (!validation.isValid) {
    throw new Error(`[rewaveon-dev 연결 실패] ${validation.reason}`);
  }

  if (!cachedDevClient) {
    cachedDevClient = createClient(devUrl, devServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedDevClient;
}

// ------------------------------------------------------------------------------
// 4. SQL v6 테이블 1:1 매핑 TypeScript 인터페이스 정의
// ------------------------------------------------------------------------------
export interface StoreRecord {
  id: string;                    // 예: 'store_60gye_youngwol'
  store_code: string;            // 예: '60gye'
  custom_domain?: string | null; // 예: 'order.chicken60-youngwol.com'
  name: string;                  // 예: '[개발테스트] 60계치킨 영월점'
  owner_name: string;
  phone: string;
  business_number?: string | null;
  address?: string | null;
  status: 'active' | 'paused' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface StoreMemberRecord {
  id: string;                    // UUID
  store_id: string;              // stores(id) 외래키
  member_name: string;
  login_id: string;              // 매장 내 로그인 ID
  role: 'owner' | 'manager' | 'staff';
  password_hash: string;         // Argon2id / bcrypt 해시
  is_active: boolean;
  created_at: string;
}

export interface LiveOrderRecord {
  id: string;                    // 주문 고유번호 (예: 'order_1730123456789')
  store_id: string;              // stores(id) 외래키
  order_number?: string | null;  // 주방 단축 번호 (예: '#101')
  customer_name: string;
  phone: string;
  order_type: 'takeout' | 'delivery';
  address?: string | null;
  pickup_time?: string | null;
  target_pickup_time?: string | null;
  minutes_to_add: number;
  payment_method: string;
  request_text?: string | null;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  used_points: number;
  total: number;
  reward_points: number;
  status: 'pending' | 'accepted' | 'cooking' | 'done' | 'cancelled';
  cancel_reason?: string | null;
  token_hash: string;            // 32바이트 토큰의 SHA-256 해시값
  created_at: string;
  updated_at: string;
}

export interface LiveOrderItemRecord {
  id: number;                    // BIGSERIAL
  order_id: string;              // live_orders(id)
  store_id: string;              // live_orders(store_id) 복합 외래키
  name: string;
  item_type: string;
  price: number;
  quantity: number;
  is_custom: boolean;
  custom_details?: string | null;
  created_at: string;
}

export interface AdminSessionRecord {
  id: string;                    // UUID
  store_id: string;              // stores(id)
  member_id: string;             // store_members(id) 복합 외래키
  session_token_hash: string;    // 세션 난수 토큰의 SHA-256 해시
  role: string;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  expires_at: string;
}

export interface AdminLoginLimitRecord {
  store_id: string;              // stores(id)
  ip_address: string;            // 접속 IP
  failed_attempts: number;
  locked_until?: string | null;
  last_attempt_at: string;
}

// ------------------------------------------------------------------------------
// 5. 보안 토큰 생성 및 해시 헬퍼 유틸리티 (Node.js 내장 crypto 활용)
// ------------------------------------------------------------------------------

/**
 * 고객 주문별 32바이트 암호학적 난수 비밀 토큰 및 SHA-256 해시 생성
 * @returns { token: string (고객 브라우저에 반환할 원문), hash: string (DB에 저장할 해시) }
 */
export function generateOrderAuthToken(): { token: string; hash: string } {
  const token = 'ord_' + crypto.randomBytes(28).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

/**
 * 입력된 토큰 문자열을 단방향 SHA-256 해시로 변환하여 DB 조회용 해시값 생성
 */
export function hashOrderAuthToken(token: string): string {
  if (!token || typeof token !== 'string') return '';
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * 주방 관리자 세션용 32바이트 암호학적 난수 토큰 및 SHA-256 해시 생성
 * @returns { sessionToken: string (쿠키에 주입할 원문), sessionTokenHash: string (DB에 저장할 해시) }
 */
export function generateAdminSessionToken(): { sessionToken: string; sessionTokenHash: string } {
  const sessionToken = 'kds_' + crypto.randomBytes(28).toString('hex');
  const sessionTokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
  return { sessionToken, sessionTokenHash };
}

/**
 * 쿠키에서 전달받은 주방 세션 토큰을 SHA-256 해시로 변환하여 DB 세션 검증
 */
export function hashAdminSessionToken(sessionToken: string): string {
  if (!sessionToken || typeof sessionToken !== 'string') return '';
  return crypto.createHash('sha256').update(sessionToken.trim()).digest('hex');
}
