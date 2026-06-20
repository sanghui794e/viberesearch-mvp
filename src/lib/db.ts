import { createClient } from '@supabase/supabase-js';

// 데이터 구조 정의
export interface ResearchRequest {
  id: string;
  userId: string;
  userEmail: string;
  topic: string;
  targetAudience: string;
  specialRequests: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  reportContent?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  isSubscribed: boolean;
  isApproved: boolean; // 지인용 가입 승인 대기 가드 필드 추가!
  role: 'user' | 'admin';
}

// Env 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isUsingSupabase = supabaseUrl && supabaseAnonKey;

// Supabase 클라이언트 (설정되어 있을 때만 초기화)
export const supabase = isUsingSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Mock Database 저장소 키
const STORAGE_KEYS = {
  REQUESTS: 'rewaveon_requests',
  PROFILES: 'rewaveon_profiles',
};

// SSR 환경 대응용 인메모리 백업
let inMemoryRequests: ResearchRequest[] = [
  {
    id: 'req-1',
    userId: 'user-1',
    userEmail: 'creator@rewaveon.com',
    topic: '1인 지식창업 크리에이터를 위한 메일링 구독 서비스 비즈니스 모델 분석',
    targetAudience: '연 소득 5천만 원 이하의 주니어 크리에이터',
    specialRequests: '해외 사례(Substack, ConvertKit 활용 모델)를 중심으로 요약 보고서와 이메일 마케팅 시나리오를 첨부해주세요.',
    status: 'Completed',
    reportContent: `# 1인 지식창업 크리에이터의 메일링 구독 서비스 비즈니스 모델 분석 보고서

이 보고서는 1인 지식창업자가 연간 100달러를 지불하는 '1,000명의 진정한 팬'을 모으기 위한 이메일 구독 모델 전략을 분석합니다.

## 1. 핵심 가치 제안 (Value Proposition)
대부분의 크리에이터는 알고리즘의 노예가 되어 소셜 미디어 플랫폼에 지배당합니다. 
이메일 뉴스레터는 크리에이터가 오디언스와 **직접 소유한 소통 채널**을 구축할 수 있게 돕는 강력한 도구입니다.

## 2. 해외 핵심 벤치마킹 사례
- **Lenny's Newsletter (Substack)**: 제품 관리 및 커리어 관련 심층 분석으로 월 15달러의 구독 모델을 통해 연간 수백만 달러의 수익 창출.
- **Packy McCormick (Not Boring)**: 비즈니스와 기술 트렌드를 만화적 요소와 결합하여 고품질 에세이 발행. 스폰서십 및 멤버십 결합 모델 구축.

## 3. 크리에이터를 위한 성장 로드맵
1. **무료 가치 선제공**: 최소 5개의 고품질 웰컴 이메일 시퀀스(Welcome Sequence) 구축.
2. **리드 마그넷(Lead Magnet)**: 뉴스레터 구독 시 즉시 유용한 PDF 템플릿 제공.
3. **유료 구독(Premium Tier) 전환**: 매주 깊이 있는 에셋(Templates, Case Studies)을 독점 공개하여 월 $10 또는 연 $100 구독으로 유도.

본 리서치가 고객님의 뉴스레터 창업에 유용한 가이드가 되기를 바랍니다.`,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'req-2',
    userId: 'user-1',
    userEmail: 'creator@rewaveon.com',
    topic: 'IT 개발 지식을 활용한 B2B 사이드 프로젝트 기획 및 검증 방법',
    targetAudience: '사이드 프로젝트로 월 100만 원 파이프라인을 만들고 싶은 직장인 개발자',
    specialRequests: '빠르게 프로토타입을 만들어 검증할 수 있는 노코드(No-code) 툴 연동 로드맵이 필요합니다.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  }
];

let inMemoryProfiles: UserProfile[] = [
  {
    id: 'user-1',
    email: 'creator@rewaveon.com',
    isSubscribed: true,
    isApproved: true, // 기존 Mock 유저는 이미 승인된 상태로 셋업
    role: 'user',
  },
  {
    id: 'admin-1',
    email: 'admin@rewaveon.com',
    isSubscribed: true,
    isApproved: true,
    role: 'admin',
  }
];

// 클라이언트 사이드 브라우저 스토리지 연동 헬퍼
const getLocalStorageData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorageData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

// DB API Layer
export const db = {
  // --- Profiles ---
  async getProfile(email: string): Promise<UserProfile | null> {
    if (isUsingSupabase) {
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      if (error) return null;
      return data as UserProfile;
    } else {
      const profiles = getLocalStorageData<UserProfile[]>(STORAGE_KEYS.PROFILES, inMemoryProfiles);
      return profiles.find(p => p.email === email) || null;
    }
  },

  async createProfile(profile: UserProfile): Promise<UserProfile> {
    if (isUsingSupabase) {
      const { data, error } = await supabase!
        .from('profiles')
        .insert([profile])
        .select()
        .single();
      if (error) throw error;
      return data as UserProfile;
    } else {
      const profiles = getLocalStorageData<UserProfile[]>(STORAGE_KEYS.PROFILES, inMemoryProfiles);
      const updated = [...profiles.filter(p => p.email !== profile.email), profile];
      setLocalStorageData(STORAGE_KEYS.PROFILES, updated);
      inMemoryProfiles = updated;
      return profile;
    }
  },

  async updateSubscription(email: string, isSubscribed: boolean): Promise<boolean> {
    if (isUsingSupabase) {
      const { error } = await supabase!
        .from('profiles')
        .update({ isSubscribed })
        .eq('email', email);
      return !error;
    } else {
      const profiles = getLocalStorageData<UserProfile[]>(STORAGE_KEYS.PROFILES, inMemoryProfiles);
      const updated = profiles.map(p => 
        p.email === email ? { ...p, isSubscribed } : p
      );
      setLocalStorageData(STORAGE_KEYS.PROFILES, updated);
      inMemoryProfiles = updated;
      return true;
    }
  },

  // 가입 지인 승인 업데이트 기능 구현!
  async approveProfile(email: string): Promise<boolean> {
    if (isUsingSupabase) {
      const { error } = await supabase!
        .from('profiles')
        .update({ isApproved: true })
        .eq('email', email);
      return !error;
    } else {
      const profiles = getLocalStorageData<UserProfile[]>(STORAGE_KEYS.PROFILES, inMemoryProfiles);
      const updated = profiles.map(p => 
        p.email === email ? { ...p, isApproved: true } : p
      );
      setLocalStorageData(STORAGE_KEYS.PROFILES, updated);
      inMemoryProfiles = updated;
      return true;
    }
  },

  // 전체 회원 프로필 조회 (어드민 회원 관리 탭용)
  async getAllProfiles(): Promise<UserProfile[]> {
    if (isUsingSupabase) {
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) return [];
      return data as UserProfile[];
    } else {
      // 로컬스토리지 동기화 강제
      if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEYS.PROFILES)) {
        setLocalStorageData(STORAGE_KEYS.PROFILES, inMemoryProfiles);
      }
      return getLocalStorageData<UserProfile[]>(STORAGE_KEYS.PROFILES, inMemoryProfiles);
    }
  },

  // --- Research Requests ---
  async getRequests(userId?: string): Promise<ResearchRequest[]> {
    if (isUsingSupabase) {
      let query = supabase!.from('requests').select('*').order('createdAt', { ascending: false });
      if (userId) {
        query = query.eq('userId', userId);
      }
      const { data, error } = await query;
      if (error) return [];
      return data as ResearchRequest[];
    } else {
      const requests = getLocalStorageData<ResearchRequest[]>(STORAGE_KEYS.REQUESTS, inMemoryRequests);
      if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
        setLocalStorageData(STORAGE_KEYS.REQUESTS, inMemoryRequests);
      }
      
      const list = requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (userId) {
        return list.filter(r => r.userId === userId);
      }
      return list;
    }
  },

  async createRequest(request: Omit<ResearchRequest, 'id' | 'createdAt' | 'status'>): Promise<ResearchRequest> {
    const newRequest: ResearchRequest = {
      ...request,
      id: `req-${Math.random().toString(36).substring(2, 11)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    if (isUsingSupabase) {
      const { data, error } = await supabase!
        .from('requests')
        .insert([newRequest])
        .select()
        .single();
      if (error) throw error;
      return data as ResearchRequest;
    } else {
      const requests = getLocalStorageData<ResearchRequest[]>(STORAGE_KEYS.REQUESTS, inMemoryRequests);
      const updated = [newRequest, ...requests];
      setLocalStorageData(STORAGE_KEYS.REQUESTS, updated);
      inMemoryRequests = updated;
      return newRequest;
    }
  },

  async fulfillRequest(id: string, reportContent: string): Promise<boolean> {
    if (isUsingSupabase) {
      const { error } = await supabase!
        .from('requests')
        .update({ status: 'Completed', reportContent })
        .eq('id', id);
      return !error;
    } else {
      const requests = getLocalStorageData<ResearchRequest[]>(STORAGE_KEYS.REQUESTS, inMemoryRequests);
      const updated = requests.map(r => 
        r.id === id ? { ...r, status: 'Completed' as const, reportContent } : r
      );
      setLocalStorageData(STORAGE_KEYS.REQUESTS, updated);
      inMemoryRequests = updated;
      return true;
    }
  },

  async updateRequestStatus(id: string, status: 'Pending' | 'In Progress' | 'Completed'): Promise<boolean> {
    if (isUsingSupabase) {
      const { error } = await supabase!
        .from('requests')
        .update({ status })
        .eq('id', id);
      return !error;
    } else {
      const requests = getLocalStorageData<ResearchRequest[]>(STORAGE_KEYS.REQUESTS, inMemoryRequests);
      const updated = requests.map(r => 
        r.id === id ? { ...r, status } : r
      );
      setLocalStorageData(STORAGE_KEYS.REQUESTS, updated);
      inMemoryRequests = updated;
      return true;
    }
  }
};
