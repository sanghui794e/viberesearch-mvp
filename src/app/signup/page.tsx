'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Sparkles, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribedPending, setIsSubscribedPending] = useState(false);

  useEffect(() => {
    // 결제 성공 이력 확인 (Stripe 가상 결제 완료 플래그)
    if (typeof window !== 'undefined') {
      const pending = localStorage.getItem('viberesearch_pending_checkout_email');
      if (pending === 'true') {
        setIsSubscribedPending(true);
      }
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const res = await auth.signUp(email, password);
      
      if (!res.success) {
        setError(res.error || '회원가입에 실패했습니다.');
        setLoading(false);
        return;
      }

      // 구독 정보 연동 처리
      if (isSubscribedPending) {
        await db.updateSubscription(email, true);
        localStorage.removeItem('viberesearch_pending_checkout_email');
      }

      // 자동 로그인 처리
      const loginRes = await auth.signIn(email, password);
      if (loginRes.success) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060a13] text-slate-800 dark:text-slate-100 flex items-center justify-center px-6 py-12 font-sans transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-md shadow-primary/20">
            V
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-slate-50">VibeResearch 계정 생성</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">전담 리서치 비서를 맞이할 계정을 생성하세요.</p>
        </div>

        {/* Checkout verification banner */}
        {isSubscribedPending ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-bold">결제가 확인되었습니다!</span> 가입 즉시 $99/월 플랜 구독 혜택이 적용되어 대시보드가 오픈됩니다.
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold">대시보드 구독 제한 모드:</span> 활성화된 결제가 확인되지 않았습니다. 가입 후 대시보드를 활성화하려면 <Link href="/checkout" className="underline font-bold text-primary">구독 결제</Link>를 진행하셔야 합니다.
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase block">이메일 주소</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="creator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase block">비밀번호 (6자 이상)</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-primary/20"
          >
            {loading ? '계정 생성 중...' : '계정 만들기'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>이미 계정이 있으신가요? </span>
          <Link href="/login" className="font-bold text-primary hover:underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
