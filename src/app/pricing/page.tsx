'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Sparkles, ChevronDown, HelpCircle, ArrowRight,
  Check, Store, ShieldCheck, Gift, Percent, Star, QrCode
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "스타터 플랜 100일 무료 체험 후 자동 결제되나요?",
    answer: "아니요, 동의 없는 자동 결제는 절대 발생하지 않습니다. 100일 동안 충분히 써보시고 실제 배달앱 수수료 절감 효과를 체감하신 뒤, 사장님의 결정에 따라 유료 전환 여부를 직접 선택하실 수 있습니다."
  },
  {
    question: "테이블오더 태블릿 기기 구입비나 설치비가 정말 0원인가요?",
    answer: "네, 0원입니다. 손님이 본인의 스마트폰 카메라로 테이블에 부착된 고급 아크릴 QR을 비추어 주문하는 방식이므로, 대당 수십만 원에 달하는 태블릿 기기값과 거치대, 전선 공사비, 월 렌탈료가 전혀 들지 않습니다."
  },
  {
    question: "기존에 배달의민족이나 요기요를 사용 중인데 함께 쓸 수 있나요?",
    answer: "네, 당연히 가능합니다! 기존 배달앱은 그대로 유지하시면서, 배달 나갈 때 배달 봉투에 '자사몰 주문 시 2,000원 할인 + 사이드 무료' 스티커를 부착하여 배달앱 고객을 수수료 0원인 사장님의 자사몰 단골로 흡수하는 전략입니다."
  },
  {
    question: "30만 원 상당의 'AI 상권 & 경쟁점 분석 리포트'는 언제 제공되나요?",
    answer: "스탠다드 또는 올인원 파트너 플랜 입점 완료 후 48시간 이내에, 인공지능이 사장님 매장 반경 3km 내 배달앱 리뷰, 경쟁점 가격/메뉴 구조, 네이버 플레이스 순위를 정밀 분석한 맞춤형 보고서를 작성하여 전달해 드립니다."
  },
  {
    question: "영월이 아닌 타 지역 매장도 신청할 수 있나요?",
    answer: "네! 원주, 제천, 춘천, 강릉 등 강원/충청 권역은 물론 전국 모든 요식업 및 일반 매장 사장님 누구나 동일한 조건으로 신청 및 이용이 가능합니다."
  }
];

export default function PricingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-primary/30 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-extrabold shadow-md shadow-primary/20">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent leading-none">
                Rewaveon
              </span>
              <span className="text-[9px] text-slate-400 font-medium">소상공인 스마트오더 & 무수수료 자사몰</span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="text-xs font-semibold text-slate-300 hover:text-primary transition-colors">
              홈으로
            </Link>
            <Link 
              href="/demo/60gye" 
              className="text-xs font-bold text-emerald-400 hover:text-primary transition-colors flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
              <Store className="w-3.5 h-3.5" />
              <span>60계치킨 영월점 데모</span>
            </Link>
            <Link
              href="/#contact"
              className="text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-4 h-9 flex items-center rounded-lg transition-colors shadow-sm shadow-primary/20"
            >
              100일 무료 신청
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20">
          
          {/* Header Title */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-bold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>배달앱 수수료 0% • 테이블오더 기기값 0원 • 100일 무료 체험</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              소상공인 맞춤 현실 요금제
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              수백만 원짜리 태블릿 약정도, 배달앱 수수료도 없습니다.<br />
              치킨 10마리 수수료만 아껴도 매달 순이익이 남는 투명하고 정직한 가격 정책입니다.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Plan 1: Starter */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold">스타터 (Starter)</h2>
                  <p className="text-xs text-slate-400">부담 없는 100일 무료 체험</p>
                </div>
                <div className="flex items-baseline gap-1 py-2">
                  <span className="text-4xl font-black tracking-tight text-white">0원</span>
                  <span className="text-xs text-slate-400">/ 100일 체험</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>모바일 QR 스마트오더 메뉴판</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>테이블 QR 스티커 기본 10매 증정</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>포장 및 매장 주문 실시간 접수</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>배달앱 중개수수료 0%</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/#contact"
                className="mt-8 w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center text-xs transition-colors"
              >
                100일 무료 시작하기
              </Link>
            </div>

            {/* Plan 2: Standard (BEST) */}
            <div className="bg-card border-2 border-primary rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black tracking-wider uppercase">
                사장님 강력 추천 ★
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-primary">스탠다드 (Standard)</h2>
                  <p className="text-xs text-slate-400">치킨 10마리 수수료면 전액 회수!</p>
                </div>
                <div className="flex items-baseline gap-1 py-2">
                  <span className="text-4xl font-black tracking-tight text-white">29,000원</span>
                  <span className="text-xs text-slate-400">/ 월</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>스타터 모든 기능 포함</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>고화질 코팅 QR 스티커 20매 무료 제작</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>카운터/출입문 홍보 미니배너 1세트 증정</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>자사몰 단독 할인 & 무료 증정 이벤트 설정</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>네이버 스마트플레이스 / SNS 링크 연동</span>
                  </li>
                  <li className="flex items-center gap-2 text-amber-300 font-bold bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                    <Gift className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>[30만 원 상당] AI 상권 리포트 1회 무료</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/#contact"
                className="mt-8 w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl flex items-center justify-center text-xs transition-colors shadow-md shadow-primary/20"
              >
                스탠다드 입점 신청
              </Link>
            </div>

            {/* Plan 3: All-in-One Partner */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold">올인원 파트너</h2>
                  <p className="text-xs text-slate-400">영월/강원 권역 전담 밀착 케어</p>
                </div>
                <div className="flex items-baseline gap-1 py-2">
                  <span className="text-4xl font-black tracking-tight text-white">59,000원</span>
                  <span className="text-xs text-slate-400">/ 월</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>스탠다드 모든 기능 포함</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>월 1회 메뉴/가격 무상 업데이트 대행</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>주방 전용 태블릿 실시간 알림 시스템 세팅</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>분기별(3개월마다) AI 상권 리포트 정기 제공</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>카카오 알림톡 단골 마케팅 자동화 연동</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/#contact"
                className="mt-8 w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center text-xs transition-colors"
              >
                전담 파트너 문의
              </Link>
            </div>
          </div>

          {/* AI Report Bonus Highlight */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-amber-400">🎁 입점 사장님 100% 무료 제공</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                30만 원 상당 AI 상권 & 경쟁점 정밀 진단 리포트
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                반경 3km 내 배달앱 리뷰 분석, 경쟁점 메뉴/가격 비교, 네이버 스마트플레이스 1순위 노출 팁까지 담긴 맞춤형 리포트를 무료 보너스로 드립니다.
              </p>
            </div>
            <Link
              href="/#contact"
              className="shrink-0 px-6 h-11 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl flex items-center justify-center text-xs transition-colors shadow-md shadow-amber-400/20"
            >
              무료 리포트 신청하기
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">자주 묻는 질문</h2>
              <p className="text-xs sm:text-sm text-slate-400">요금제와 관련해 사장님들께서 가장 자주 하시는 질문입니다.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border/60 bg-slate-950/40 px-5 py-4 text-xs text-slate-300 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-background mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Rewaveon (리웨이브온). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-primary transition-colors">홈으로</Link>
            <Link href="/demo/60gye" className="hover:text-primary transition-colors">60계치킨 영월점 데모</Link>
            <Link href="/#contact" className="hover:text-primary transition-colors">입점 상담</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
