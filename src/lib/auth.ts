import { supabase, isUsingSupabase, db, UserProfile } from './db';

const AUTH_STORAGE_KEY = 'rewaveon_current_user';

export interface AuthSession {
  email: string;
  role: 'user' | 'admin';
  isSubscribed: boolean;
}

export const auth = {
  // 현재 세션 가져오기
  getCurrentUser(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    
    // 1. Supabase Auth 사용 시 (실제 세션 연동)
    if (isUsingSupabase && supabase) {
      // 비동기로 동작하지만 동기 처리가 어려운 클라이언트 렌더링용 임시 헬퍼
      // 실제 프로젝트에서는 Supabase getSession 이나 context를 사용해야 함.
      // 여기서는 하이브리드 구성을 위해 로컬 스토리지 백업 병행
    }
    
    // 2. Mock 모드 및 세션 캐시 복원
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // 회원가입
  async signUp(email: string, passwordHash: string): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
    const isAdmin = email === 'admin@rewaveon.com' || email === 'admin@viberesearch.com';
    if (isUsingSupabase && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: passwordHash,
      });
      if (error) return { success: false, error: error.message };
      
      // Supabase 트리거 또는 수동 프로필 생성
      const profile = await db.createProfile({
        id: data.user?.id || Math.random().toString(),
        email,
        isSubscribed: false, // 결제 전이므로 기본 false
        isApproved: isAdmin, // 관리자만 자동 승인, 일반 유저는 대기
        role: isAdmin ? 'admin' : 'user',
      });
      
      return { success: true, profile };
    } else {
      // Mock 회원가입
      const existing = await db.getProfile(email);
      if (existing) {
        return { success: false, error: '이미 가입된 이메일 주소입니다.' };
      }

      const isSubscribed = false; // 기본 결제 미완료 상태
      const role = isAdmin ? 'admin' : 'user';

      const profile = await db.createProfile({
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        email,
        isSubscribed,
        isApproved: isAdmin, // 관리자만 자동 승인, 일반 유저는 대기
        role,
      });

      return { success: true, profile };
    }
  },

  // 로그인
  async signIn(email: string, passwordHash: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const isAdmin = email === 'admin@rewaveon.com' || email === 'admin@viberesearch.com';
    if (isUsingSupabase && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordHash,
      });
      if (error) return { success: false, error: error.message };

      const profile = await db.getProfile(email);
      const session: AuthSession = {
        email,
        role: profile?.role || 'user',
        isSubscribed: profile?.isSubscribed || false,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      }
      return { success: true, session };
    } else {
      // Mock 로그인
      const profile = await db.getProfile(email);
      if (!profile) {
        return { success: false, error: '존재하지 않는 사용자 계정입니다.' };
      }

      // 비번 검증 (실제 프로덕션이 아니므로 모의 검증 - admin의 경우 admin1234, 일반 유저는 자유 통과)
      if (isAdmin && passwordHash !== 'admin1234') {
        return { success: false, error: '관리자 비밀번호가 올바르지 않습니다.' };
      }

      const session: AuthSession = {
        email,
        role: profile.role,
        isSubscribed: profile.isSubscribed,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      }
      return { success: true, session };
    }
  },

  // 로그아웃
  async signOut(): Promise<void> {
    if (isUsingSupabase && supabase) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  // 활성 유저의 세션 및 구독 정보 업데이트 (결제 완료 후)
  updateLocalSubscription(isSubscribed: boolean) {
    const user = this.getCurrentUser();
    if (user) {
      const updated = { ...user, isSubscribed };
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      }
    }
  }
};
