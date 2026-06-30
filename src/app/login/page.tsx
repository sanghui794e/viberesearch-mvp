'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Mail, Lock, Sparkles, Key } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const res = await auth.signIn(email, password);
      if (!res.success) {
        setError(res.error || '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
        setLoading(false);
        return;
      }

      const session = res.session;
      if (session) {
        if (session.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex items-center justify-center px-6 py-12 font-sans selection:bg-primary/30 selection:text-white">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Decorative Light Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Headings */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-xl mx-auto mb-4 shadow-md shadow-primary/20">
            R
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">Rewaveon 로그인</h2>
          <p className="text-sm text-slate-400">비즈니스의 보이지 않던 흐름을 보이는 성장으로 만드는 대시보드</p>
        </div>



        {error && (
          <div className="bg-red-950/40 border border-red-900/65 text-red-300 p-3 rounded-xl text-xs mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-350 uppercase block">이메일 주소</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="creator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-border text-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-350 uppercase block">비밀번호</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-border text-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-primary/20"
          >
            {loading ? '로그인 처리 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>아직 계정이 없으신가요? </span>
          <Link href="/checkout" className="font-bold text-primary hover:underline">
            구독 및 가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}
