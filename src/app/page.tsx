'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Users, TrendingUp, Zap, CheckCircle2, 
  Lock, Sparkles, Shield, ChevronRight 
} from 'lucide-react';
import { auth, AuthSession } from '@/lib/auth';

export default function LandingPage() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(auth.getCurrentUser());
  }, []);

  // FBM 스무스 스크롤 트리거 함수
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Framer Motion Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-primary/30 selection:text-white">
      
      {/* Navigation Header */}
      <header className="border-b border-border bg-background/85 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-extrabold shadow-md shadow-primary/20">
              R
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Rewaveon
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors">
              주요 기능
            </Link>
            <Link href="#how-it-works" className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors">
              이용 방법
            </Link>
            
            {session ? (
              <Link
                href={session.role === 'admin' ? '/admin' : '/dashboard'}
                className="text-xs font-bold bg-slate-100 text-slate-950 px-4 h-9 flex items-center rounded-lg hover:bg-slate-200 transition-colors"
              >
                대시보드
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-400 hover:text-primary px-3 h-9 flex items-center"
                >
                  로그인
                </Link>
                <Link
                  href="/checkout"
                  className="text-xs font-bold bg-primary text-white px-4 h-9 flex items-center rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                >
                  시작하기
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* 1. Hero Section (FBM Motivation & Spark Trigger) */}
      <section className="relative pt-28 pb-24 overflow-hidden flex-1 flex flex-col justify-center">
        {/* Glowing Background Wave (No rectangular boxes, naturally blending) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <img 
            src="/hero-wave-bg.png" 
            alt="Hero Background Wave" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-auto min-h-[500px] object-cover opacity-25 mix-blend-screen"
          />
          {/* Subtle gradient overlays to dissolve any edge lines of the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          {/* Tagline */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-primary tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI RESEARCH • WEBSITE SOLUTION • GROWTH MARKETING</span>
          </motion.div>
          
          {/* Headline (H1) */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            왜 어떤 브랜드는<br />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">더 빨리 성장할까?</span>
          </motion.h1>
          
          {/* Sub-headline (H2) */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            데이터 뒤에 숨은 흐름을 발견하고, 웹 솔루션과 전략적 실행으로 보이지 않던 흐름을 눈에 보이는 성장으로 만들어 냅니다.
          </motion.p>

          {/* CTA Action Block */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <a
              href="#pricing"
              onClick={scrollToPricing}
              className="w-full sm:w-auto px-8 h-14 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 group"
            >
              <span>1분 만에 전담 비서 고용하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Trust Badges */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>🔒 가상 Stripe 안전 결제 지원 | 🛡️ 30일 100% 만족 보장</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Value Proposition Section (FBM Motivation/Ability) */}
      <section id="features" className="py-24 bg-card/25 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              정보의 홍수 속, 꼭 필요한 인사이트만 필터링합니다
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              어렵고 쓸모없는 데이터 덩어리는 가라. 오로지 실행 가능한 크리에이터 맞춤 처방전만 받으세요.
            </p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">초개인화 오디언스 분석</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  고객의 깊은 소비 심리와 니즈를 완벽 분석하여, 기꺼이 지갑을 열게 만들 킬러 콘텐츠 주제와 포지셔닝 전략을 제안합니다.
                </p>
              </div>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">고전환 웹사이트 솔루션</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  단순한 템플릿 홈피가 아닙니다. 방문자가 구매 버튼을 누를 수밖에 없는 정교한 랜딩페이지와 결제 퍼널을 구축합니다.
                </p>
              </div>
            </motion.div>
            
            {/* Card 3 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">매출 극대화 성장 마케팅</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  동네 주민 타겟의 고효율 쇼츠/릴스 기획부터, 배달 앱 연동 및 이메일 자동 마케팅까지 대표님의 성장을 실현합니다.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. How It Works Section (FBM Facilitator - Ability/Simplicity) */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              단 세 단계로 나만의 전담 리서치 팀 세팅 완료
            </h2>
            <p className="text-sm text-slate-500">
              더 이상의 리서치에 소요되는 시간적 손실과 인적 스트레스는 없습니다.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 relative"
          >
            {/* Step 1 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-card/60 border border-border rounded-2xl p-6 relative flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  1
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1.5">안전하게 구독 시작</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  월 $99 플랜 결제 후 즉시 멤버십 전용 계정이 생성됩니다.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-card/60 border border-border rounded-2xl p-6 relative flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  2
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1.5">간단한 요청서 작성</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  대시보드에서 '주제', '타겟 독자/고객', '요청사항' 세 줄만 입력하고 버튼을 누르세요.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-card/60 border border-border rounded-2xl p-6 relative flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1.5">48시간 내 리포트 수령</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  전담 리서처가 조사를 완료하면, 알람과 함께 즉시 적용 가능한 마케팅 전략 보고서가 업데이트됩니다.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. Pricing Section (FBM Trigger/Payment Switch) */}
      <section id="pricing" className="py-24 bg-card/20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">단 하나의 투명한 요금제</h2>
            <p className="text-sm text-slate-500">
              커피 몇 잔 값으로 검증된 데이터에 기반한 콘텐츠 전략 비서를 두세요.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-card border-2 border-primary rounded-3xl p-8 relative shadow-xl shadow-primary/5"
          >
            <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold tracking-wider uppercase">
              BEST VALUE
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1.5">Growth Partner</h3>
              <p className="text-xs text-slate-500">지속 가능한 비즈니스를 위한 올인원 파트너</p>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-extrabold tracking-tight">$99</span>
              <span className="text-slate-400 font-medium text-xs">/ 월</span>
            </div>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {[
                '언제든 자유로운 리서치 요청 (무제한)',
                '매 요청당 48시간 내 고품질 리서치 배달',
                '심층 PDF 요약 리포트 제공',
                '전용 대시보드 및 리포트 보관함 영구 소장',
                '30일간 효과 없을 시 전액 환불 보장'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/checkout"
              className="w-full h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl flex items-center justify-center transition-colors shadow-md shadow-primary/20 text-sm"
            >
              지금 리웨이브온과 함께 시작하기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-border py-10 bg-background mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              R
            </div>
            <span className="text-xs font-bold tracking-tight">
              Rewaveon
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            © 2026 Rewaveon. All rights reserved. 본 서비스는 MVP 가치 검증 테스트용 사이트입니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
