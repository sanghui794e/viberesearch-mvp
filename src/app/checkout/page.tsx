'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !expiry || !cvc) {
      alert('모든 카드 세부 정보를 입력해 주세요.');
      return;
    }
    
    setLoading(true);
    
    // Stripe 결제 지연 모방
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // 결제 성공 정보를 임시로 저장하여 회원가입 시 구독자로 등록하게 유도
      if (typeof window !== 'undefined') {
        localStorage.setItem('viberesearch_pending_checkout_email', 'true');
      }

      // 1.5초 후 회원가입 페이지로 이동
      setTimeout(() => {
        router.push('/signup');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060a13] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#060a13] h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>랜딩 페이지로 돌아가기</span>
        </Link>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Order Summary (Notion/Linear Card Style) */}
        <div className="md:col-span-5 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              구독 플랜
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-50">Creator Partner</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            매월 크리에이터 리서치 비서를 무제한 활용하는 플랜입니다.
          </p>

          <div className="border-y border-slate-100 dark:border-slate-800 py-4 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">구독요금 (월간)</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">$99.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">세금 및 수수료</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">$0.00</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline mb-8">
            <span className="text-slate-900 dark:text-slate-100 font-bold">합계</span>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-primary">$99.00</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 block">매달 자동 갱신됨</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Stripe 256비트 암호화 결제 방식으로 데이터를 보호합니다.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>30일 이내 언제든 불만족 시 100% 전액 환불이 보장됩니다.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form (Stripe Theme Copy) */}
        <div className="md:col-span-7 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-lg shadow-slate-100/50 dark:shadow-none">
          {success ? (
            <div className="py-16 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">결제가 완료되었습니다!</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                가상 결제 승인이 정상 완료되었습니다. 이제 다음 페이지에서 전용 로그인 계정을 만드세요.
              </p>
              <div className="pt-6">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>회원가입 페이지로 리다이렉트 중...</span>
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>카드 결제 정보 입력</span>
                </h3>
                <span className="text-xs text-slate-400">Stripe 가상 샌드박스</span>
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block uppercase">
                  카드 번호
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9 ]/g, ''))}
                    className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors font-mono tracking-widest"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">VISA</span>
                </div>
              </div>

              {/* Expiry and CVC Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block uppercase">
                    만료일 (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block uppercase">
                    CVC
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    maxLength={3}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block uppercase">
                  카드 소유자 이름
                </label>
                <input
                  type="text"
                  required
                  placeholder="HONG GILDONG"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors uppercase font-medium"
                />
              </div>

              {/* Country Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block uppercase">
                  국가 또는 지역
                </label>
                <select className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors">
                  <option value="KR">대한민국 (South Korea)</option>
                  <option value="US">미국 (United States)</option>
                  <option value="JP">일본 (Japan)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary disabled:bg-primary/50 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors shadow-md shadow-primary/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>결제 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>$99.00 결제하기 (구독 시작)</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                결제 버튼을 누르면 이용 약관 및 개인정보 처리방침에 동의하며, 월 $99.00 구독 결제가 즉시 청구되는 것을 승인하게 됩니다. (실제 돈은 청구되지 않는 가상 시연 결제입니다.)
              </p>
            </form>
          )}
        </div>
        
      </main>
    </div>
  );
}
