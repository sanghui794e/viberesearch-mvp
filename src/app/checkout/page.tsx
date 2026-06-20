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
        localStorage.setItem('rewaveon_pending_checkout_email', 'true');
      }

      // 1.5초 후 회원가입 페이지로 이동
      setTimeout(() => {
        router.push('/signup');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 font-sans selection:bg-primary/30 selection:text-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>메인으로 돌아가기</span>
        </Link>
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
          ReWaveOn
        </span>
      </header>

      {/* Main Checkout Area */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Product Summary */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">구독 요금제</span>
            <h2 className="text-3xl font-extrabold text-white">ReWaveOn Pro</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              소상공인 맞춤 마케팅 전략 수립 및 AI 리서치 분석 보고서 무제한 생성 플랜입니다.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-sm text-slate-350">월 구독 비용</span>
              <span className="text-2xl font-bold text-white">$99.00 / 월</span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              * 구독은 매달 자동 갱신되며, 언제든지 대시보드 설정에서 해지하실 수 있습니다.
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-450 shrink-0 mt-0.5" />
              <span>Stripe 보안 암호화 결제 방식이 적용되어 개인정보가 철저히 보호됩니다.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-400">
              <Lock className="w-4.5 h-4.5 text-emerald-450 shrink-0 mt-0.5" />
              <span>30일 이내 해지 시 불만족 시 100% 전액 환불을 보장합니다.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="md:col-span-7 bg-card border border-border p-8 rounded-3xl shadow-xl relative overflow-hidden">
          {success ? (
            <div className="py-16 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-900/50 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">결제가 완료되었습니다!</h2>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                가상 결제 확인이 성공하였습니다. 이제 다음 페이지에서 로그인 및 사용하실 계정을 생성해 주세요.
              </p>
              <div className="pt-6">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>회원가입 페이지로 리다이렉트 중...</span>
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>카드 결제 정보 입력</span>
                </h3>
                <span className="text-[10px] bg-slate-900 px-2 py-1 rounded border border-border text-slate-500 font-bold tracking-wider">STRIPE MOCK MODE</span>
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-350 block uppercase">
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
                    className="w-full h-11 px-4 bg-slate-950 border border-border text-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-mono tracking-widest"
                    autoComplete="cc-number"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">VISA</span>
                </div>
              </div>

              {/* Expiry and CVC Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block uppercase">
                    만료일 (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-950 border border-border text-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                    autoComplete="cc-exp"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block uppercase">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    maxLength={3}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-11 px-4 bg-slate-950 border border-border text-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-350 block uppercase">
                  카드 소유자 이름
                </label>
                <input
                  type="text"
                  required
                  placeholder="HONG GILDONG"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-950 border border-border text-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors uppercase font-medium"
                  autoComplete="cc-name"
                />
              </div>

              {/* Country Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-350 block uppercase">
                  국가 또는 지역
                </label>
                <select className="w-full h-11 px-4 bg-slate-950 border border-border text-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors">
                  <option value="KR">대한민국 (South Korea)</option>
                  <option value="US">미국 (United States)</option>
                  <option value="JP">일본 (Japan)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary disabled:bg-primary/50 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors shadow-md shadow-primary/20 text-sm"
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

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                결제 버튼을 누르면 이용 약관 및 개인정보 처리방침에 동의하며, 월 $99.00 구독 결제가 즉시 청구되는 것을 승인하게 됩니다. (실제 돈은 청구되지 않는 가상 시연 결제입니다.)
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
