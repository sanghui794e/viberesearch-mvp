'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, ChevronRight, HelpCircle, Lock, Sparkles, 
  TrendingUp, Zap, Smartphone, QrCode, Store, Gift, 
  Percent, Clock, ShieldCheck, MapPin, PhoneCall, 
  AlertCircle, ChevronDown, Check, Coins, Layers, Star,
  Calculator, Utensils, FileText
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "정말 영월 및 인근 지역은 대표가 직접 찾아와서 세팅해 주시나요?",
    answer: "네, 100% 사실입니다! 영월읍, 원주, 제천 등 인근 지역은 리웨이브온 김상희 대표가 직접 매장을 방문하여 테이블 QR 스티커 부착, 메뉴판 사진 등록, 카운터 주문 접수 테스트까지 전 과정을 1:1로 원스톱 무료 세팅해 드립니다."
  },
  {
    question: "기존에 배달의민족이나 요기요를 사용 중인데 함께 쓸 수 있나요?",
    answer: "네, 당연히 가능합니다! 기존 배달앱은 그대로 유지하시면서, 배달 나갈 때 배달 봉투에 '자사몰 주문 시 2,000원 할인 + 사이드 무료' 스티커를 부착하여 배달앱 고객을 수수료 0원인 사장님의 자사몰 단골로 흡수하는 전략입니다."
  },
  {
    question: "테이블오더 태블릿 기기 구입비나 설치비가 정말 0원인가요?",
    answer: "네, 0원입니다. 손님이 본인의 스마트폰 카메라로 테이블에 부착된 고급 아크릴 QR을 비추어 주문하는 방식이므로, 대당 수십만 원에 달하는 태블릿 기기값과 거치대, 전선 공사비, 월 렌탈료가 전혀 들지 않습니다."
  },
  {
    question: "스마트폰 조작이 서툰 어르신 손님도 주문할 수 있나요?",
    answer: "별도의 앱 설치나 회원가입 절차가 일절 없습니다. 기본 카메라 앱을 QR에 갖다 대기만 하면 1초 만에 큼직한 글씨와 고화질 메뉴 사진이 뜨며, 터치 2번으로 주문이 완료되어 60~70대 어르신들도 손쉽게 이용하십니다."
  },
  {
    question: "30만 원 상당의 'AI 상권 & 경쟁점 분석 리포트'는 정말 무료인가요?",
    answer: "네! 리웨이브온 입점 사장님들의 실질적인 매출 성장을 위해, 인공지능이 매장 반경 3km 내 배달앱 리뷰, 경쟁점 가격/메뉴 구조, 네이버 플레이스 순위를 정밀 분석한 맞춤형 보고서를 100% 무료 입점 특전으로 제공합니다."
  }
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sales, setSales] = useState<number>(5000000);
  const [conversion, setConversion] = useState<number>(30);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    region: '영월군',
    category: '치킨/피자',
    inquiry: ''
  });

  // 실시간 계산 로직 (배달앱 평균 수수료 13.5% 기준)
  const calcResults = useMemo(() => {
    const feeRate = 0.135;
    const lostFeeMonthly = Math.round(sales * feeRate);
    const monthlySavings = Math.round(sales * (conversion / 100) * feeRate);
    const annualSavings = monthlySavings * 12;
    const chickenCount = Math.round(annualSavings / 22000);
    return {
      lostFeeMonthly,
      monthlySavings,
      annualSavings,
      chickenCount
    };
  }, [sales, conversion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storeName || !formData.phone) {
      alert('매장명과 연락처를 입력해 주세요.');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('rewaveon_inquiries') || '[]');
      existing.push({ ...formData, date: new Date().toISOString() });
      localStorage.setItem('rewaveon_inquiries', JSON.stringify(existing));
    } catch {
      // ignore
    }
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-primary/30 selection:text-white relative">
      
      {/* 1. 상단 긴급 지원 안내 바 */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white text-xs py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>
          <strong>[영월/강원 권역 소상공인 100일 무료 지원]</strong> 기기값 0원 • <strong>대표 1:1 방문 무료 세팅</strong> • <strong>30만 원 상당 AI 상권 리포트 100% 무료 증정!</strong>
        </span>
      </div>

      {/* 2. 네비게이션 헤더 */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-extrabold shadow-md shadow-primary/20">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent leading-none">
                Rewaveon
              </span>
              <span className="text-[9px] text-slate-400 font-medium">소상공인 스마트오더 & 무수수료 자사몰</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="/demo/60gye" 
              className="text-xs font-bold text-emerald-400 hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
              <Store className="w-3.5 h-3.5" />
              <span>60계치킨 영월점 라이브 데모</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </Link>
            <a href="#calculator" className="text-xs font-semibold text-slate-300 hover:text-primary transition-colors">
              수수료 절감 계산기
            </a>
            <a href="#step-flow" className="text-xs font-semibold text-slate-300 hover:text-primary transition-colors">
              3단계 작동 원리
            </a>
            <a href="#local-guarantee" className="text-xs font-semibold text-slate-300 hover:text-primary transition-colors">
              대표 방문 세팅
            </a>
            <a href="#ai-report" className="text-xs font-semibold text-slate-300 hover:text-primary transition-colors">
              AI 상권 리포트
            </a>
            <a href="#pricing" className="text-xs font-semibold text-slate-300 hover:text-primary transition-colors">
              요금제
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:010-3363-7945"
              className="hidden sm:inline-flex text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 h-9 items-center gap-1.5 rounded-lg transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>전화 상담</span>
            </a>
            <a
              href="#contact"
              className="text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-4 h-9 flex items-center rounded-lg transition-all shadow-md shadow-primary/20"
            >
              100일 무료 신청
            </a>
          </div>
        </div>
      </header>

      {/* 3. 히어로 섹션 */}
      <section className="relative pt-16 pb-16 overflow-hidden flex flex-col justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-bold text-emerald-300 tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>실제 매장(60계치킨 영월점) 운영 검증 완료 • 배달앱 수수료 0% • 기기값 0원</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.25] sm:leading-[1.2]"
          >
            배달앱에 뜯기던 수수료 9.8%~15%,<br />
            <span className="bg-gradient-to-r from-primary via-emerald-300 to-teal-400 bg-clip-text text-transparent">
              이제 내 통장 순이익으로 100% 돌려받으세요
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            대당 수십만 원짜리 태블릿 기기값? 3년 위약금 약정? 전혀 필요 없습니다.<br className="hidden sm:inline" />
            손님 스마트폰 카메라 QR 하나로 <strong className="text-white">매장 주문부터 포장/배달 할인, 단골 카톡 관리</strong>까지 끝내는 맞춤형 자사몰을 만들어 드립니다.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <Link
              href="/demo/60gye"
              className="w-full sm:w-auto px-7 h-13 bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary/25 transition-all text-sm sm:text-base group"
            >
              <Store className="w-5 h-5" />
              <span>60계치킨 영월점 실전 데모 직접 체험하기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#calculator"
              className="w-full sm:w-auto px-6 h-13 bg-slate-800/90 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 transition-all text-sm sm:text-base"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>우리 가게 순이익 계산해보기</span>
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card/60 border border-border">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">초기 기기값 0원</p>
                <p className="text-[11px] text-slate-400">손님 스마트폰 QR로 즉시 해결</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card/60 border border-border">
              <Percent className="w-5 h-5 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">배달앱 중개수수료 0%</p>
                <p className="text-[11px] text-slate-400">자사몰 주문 시 전액 사장님 수익</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card/60 border border-border">
              <Gift className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">30만 원 상당 AI 리포트</p>
                <p className="text-[11px] text-slate-400">상권 & 경쟁점 정밀 진단 100% 무료</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. [신규 무기 1] 🧮 실시간 배달앱 수수료 vs 순이익 계산기 */}
      <section id="calculator" className="py-16 bg-gradient-to-b from-card/60 via-slate-900 to-background border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-card border-2 border-primary/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold text-primary">
                <Calculator className="w-3.5 h-3.5" />
                <span>실시간 순이익 시뮬레이션</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                우리 매장은 매달 배달앱에 <span className="text-red-400">얼마를 뺏기고 있을까요?</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                슬라이더를 움직여 현재 배달 매출을 선택해 보세요. 리웨이브온 도입 시 통장에 남는 진짜 순이익이 계산됩니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              
              {/* 컨트롤 슬라이더 */}
              <div className="space-y-6 bg-slate-950/60 p-5 sm:p-6 rounded-2xl border border-border">
                
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">우리 매장 한 달 배달 매출</span>
                    <span className="font-black text-primary text-base">{sales.toLocaleString()}원</span>
                  </div>

                  {/* 빠른 금액 선택 퀵 칩 버튼 */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button type="button" onClick={() => setSales(3000000)} className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 rounded-lg transition-colors">300만</button>
                    <button type="button" onClick={() => setSales(5000000)} className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold rounded-lg transition-colors">500만(평균)</button>
                    <button type="button" onClick={() => setSales(15000000)} className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 rounded-lg transition-colors">1,500만</button>
                    <button type="button" onClick={() => setSales(30000000)} className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-[10px] text-amber-300 font-bold rounded-lg transition-colors">3,000만(성업)</button>
                    <button type="button" onClick={() => setSales(50000000)} className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-primary/30 text-[10px] text-primary font-bold rounded-lg transition-colors">5,000만(대형)</button>
                    <button type="button" onClick={() => setSales(80000000)} className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 rounded-lg transition-colors">8,000만+</button>
                  </div>

                  <input 
                    type="range" 
                    min="1000000" 
                    max="80000000" 
                    step="1000000" 
                    value={sales} 
                    onChange={(e) => setSales(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>100만</span>
                    <span>2,000만</span>
                    <span>4,000만</span>
                    <span>6,000만</span>
                    <span>8,000만+</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">자사몰로 전환할 단골 손님 비율</span>
                    <span className="font-black text-emerald-400 text-base">{conversion}% {conversion === 30 ? '(권장치)' : ''}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    step="5" 
                    value={conversion} 
                    onChange={(e) => setConversion(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>10% (보수적)</span>
                    <span>30% (평균)</span>
                    <span>50% (적극홍보)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                  <p>💡 배달 봉투에 <strong>[포장 2,000원 할인+사이드 무료]</strong> 스티커를 붙이면 배달앱 손님의 약 30%가 자연스럽게 수수료 0원인 사장님 자사몰로 유입됩니다.</p>
                  <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">🏢 <strong>월 배달 매출 8,000만 원 초과 또는 다점포 프랜차이즈</strong>는 고객직통(010-3363-7945)으로 연락 주시면 대형 매장 전용 엔터프라이즈 맞춤 설계를 지원해 드립니다.</p>
                </div>
              </div>

              {/* 결과 카드 */}
              <div className="space-y-4">
                
                {sales >= 30000000 && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>월 3,000만 원 이상 성업 매장 정밀 진단</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      현재 1년에 약 <strong className="text-amber-300 font-bold">{Math.round(calcResults.lostFeeMonthly * 12 / 10000).toLocaleString()}만</strong>원이 배달앱 수수료로 증발하고 있습니다! 자사몰 전환 시 <strong>매달 <span className="text-emerald-400 font-bold">{calcResults.monthlySavings.toLocaleString()}</span>원(연간 <span className="text-emerald-300 font-bold">{Math.round(calcResults.annualSavings / 10000).toLocaleString()}만</span>원)</strong>의 순이익이 통장에 더 꽂힙니다.
                    </p>
                  </div>
                )}
                
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-red-300 font-bold">현재 배달앱에 버리는 수수료 (월)</span>
                    <p className="text-lg font-black text-red-400">약 {calcResults.lostFeeMonthly.toLocaleString()}원</p>
                  </div>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full font-bold">
                    연 {Math.round(calcResults.lostFeeMonthly * 12 / 10000).toLocaleString()}만 원 증발
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border-2 border-emerald-500/50 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      리웨이브온 전환 시 추가 순이익
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black">100% 내 통장 입금</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">매달 사장님 통장에 더 꽂히는 돈</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">+{calcResults.monthlySavings.toLocaleString()}원</span>
                      <span className="text-xs text-slate-300">/ 월</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-500/30 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">연간 누적 순수익 증가:</span>
                    <span className="text-base sm:text-lg font-black text-amber-300">+{calcResults.annualSavings.toLocaleString()}원 / 년</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-[11px] text-emerald-300 font-medium text-center">
                    🍗 <strong>치킨 {calcResults.chickenCount}마리를 공짜로 더 판 것</strong>과 같은 순이익입니다!
                  </div>
                </div>

                <a
                  href="#contact"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all text-sm"
                >
                  <span>100일 무료 체험으로 이 순이익 챙기기</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. [신규 무기 2] 📱 3단계 실전 흐름도 */}
      <section id="step-flow" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              "너무 쉬워서 어르신도 5초 만에 주문합니다"<br />
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                주문부터 주방 접수까지 단 3단계
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              복잡한 기계 조작도, 앱 다운로드도 없습니다. 손님 스마트폰 카메라와 사장님 매장 스마트폰/태블릿만 있으면 끝납니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="bg-card border border-border hover:border-primary/50 transition-all rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary font-black text-lg">
                  01
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400">손님 스마트폰</span>
                  <h3 className="text-lg font-bold text-white">테이블 QR에 카메라만 찰칵!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    별도의 앱 설치나 번거로운 회원가입 절차가 0%! 손님이 기본 카메라를 QR에 대면 1초 만에 우리 가게 고화질 메뉴판이 열립니다.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary shrink-0" />
                <span>대당 수십만 원 테이블 태블릿 기기값 0원</span>
              </div>
            </div>

            <div className="bg-card border border-border hover:border-primary/50 transition-all rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-black text-lg">
                  02
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400">터치 2번 주문 & 할인</span>
                  <h3 className="text-lg font-bold text-white">메뉴 고르고 즉시 혜택 적용</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    먹고 싶은 메뉴를 터치하고 '자사몰 단독 2,000원 할인 & 미니쫀득볼 무료' 혜택을 확인하며 매장/포장/배달 주문을 완료합니다.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>배민/요기요 중개수수료 0원 직거래 달성</span>
              </div>
            </div>

            <div className="bg-card border border-border hover:border-primary/50 transition-all rounded-3xl p-6 sm:p-7 relative flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 font-black text-lg">
                  03
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-cyan-400">주방 & 카운터</span>
                  <h3 className="text-lg font-bold text-white">"딩동!" 주문 접수 & 영수증 출력</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    매장 스마트폰이나 카운터 태블릿에서 실시간 알림음이 울리며 주방 프린터로 영수증이 자동 출력됩니다. 사장님은 바로 조리만 하시면 끝!
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>주문 접수 누락 방지 & 홀 서빙 인건비 절감</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. [신규 무기 3] 📍 영월/강원 권역 대표 1:1 방문 무료 세팅 보증 */}
      <section id="local-guarantee" className="py-12 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-y border-emerald-500/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>영월 • 원주 • 제천 권역 소상공인 특별 안심 보증</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                "컴맹이셔도 전혀 걱정 마세요. <span className="text-primary">대표가 직접 찾아갑니다!</span>"
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                신청하시면 리웨이브온 김상희 대표가 직접 매장으로 방문하여 <strong>메뉴판 사진 등록, 코팅 테이블 QR 스티커 부착, 주문 접수 교육</strong>까지 1:1로 원스톱 무료 세팅해 드립니다. 사장님은 평소처럼 장사만 하시면 됩니다!
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <a
                href="tel:010-3363-7945"
                className="px-5 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 text-xs sm:text-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>대표 직통 방문 요청 (전화)</span>
              </a>
              <a
                href="#contact"
                className="px-5 h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 text-xs sm:text-sm"
              >
                <span>온라인 무료 방문 예약</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 실전 검증 쇼케이스 (60계치킨 영월점) */}
      <section className="py-20 bg-card/40 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              PROVEN CASE STUDY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              말뿐인 IT 회사가 아닙니다.<br className="sm:hidden" />
              <span className="text-emerald-400">실제 매장에서 매일 검증</span>되고 있습니다
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              대표가 직접 운영하는 강원 영월 60계치킨에서 실제 손님들이 매일 QR로 주문하고 포장 할인을 받고 있는 살아있는 실전 모델입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center bg-card border border-border rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                <Store className="w-4 h-4" />
                <span>60계치킨 영월점 실전 적용 공식 전략</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                "배달앱으로 들어오던 손님들을<br />
                <span className="text-primary">자사몰 단독 2,000원 할인</span>으로 단골 전환했습니다"
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>자사몰 단독 파격 혜택:</strong> 포장 2,000원 즉시 할인 + 미니쫀득볼 5개 무료 증정</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>배달 주문 혜택:</strong> 배달 시 미니쫀득볼 10개 무료 증정으로 배달앱 대비 압도적 이점</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>배달 봉투 스티커 2,000장 부착:</strong> 배민 손님을 수수료 0원인 자사몰로 유입시키는 홍보 자동화</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>테이블 QR 스마트오더:</strong> 매장 내 테이블 8개에 QR 부착으로 인건비 절감 & 서빙 집중</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/demo/60gye"
                  className="px-5 h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                >
                  <span>고객용 자사몰 화면 체험하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo/60gye/kitchen"
                  className="px-5 h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <span>주방 실시간 주문 접수 화면 보기</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">rewaveon-mvp.vercel.app/demo/60gye</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">운영 중</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-300">자사몰 단독 특별 혜택</span>
                    <p className="text-xs font-extrabold text-white">포장 2,000원 할인 + 미니쫀득볼 5개 증정</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-1 rounded">적용 중</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[10px]">크크크치킨</p>
                    <p className="font-bold text-white mt-1">22,900원</p>
                    <p className="text-[10px] text-emerald-400 mt-1 font-medium">포장 시 20,900원</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[10px]">호랑이치킨</p>
                    <p className="font-bold text-white mt-1">21,900원</p>
                    <p className="text-[10px] text-emerald-400 mt-1 font-medium">포장 시 19,900원</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-bold text-white text-[11px]">테이블 3번 손님 스마트폰 주문</p>
                      <p className="text-[10px] text-slate-400">앱 설치 없이 카메라 스캔 ➔ 즉시 주문</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary">수수료 0원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 3자 비교 테이블 */}
      <section id="comparison" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              도대체 무엇이 다른가요?<br />
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                기존 배달앱 • 고가 테이블오더 vs 리웨이브온
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              비싼 기기값과 수수료 폭탄의 악순환을 끊어내는 가장 완벽하고 현실적인 대안입니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-slate-400 font-semibold w-1/4">비교 항목</th>
                  <th className="py-4 px-4 text-slate-300 font-bold w-1/4 bg-card/20">기존 배달앱 (배민/요기요)</th>
                  <th className="py-4 px-4 text-slate-300 font-bold w-1/4 bg-card/20">기존 태블릿 테이블오더</th>
                  <th className="py-4 px-4 text-primary font-extrabold w-1/4 bg-primary/10 border-t-2 border-primary rounded-t-xl">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      리웨이브온 모바일 스마트오더
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">중개 수수료</td>
                  <td className="py-4 px-4 text-red-400 font-medium bg-card/10">9.8% ~ 15% (매출 500만 원 시 50만~75만 원 증발)</td>
                  <td className="py-4 px-4 text-slate-300 bg-card/10">0% + 결제 PG 수수료</td>
                  <td className="py-4 px-4 text-emerald-400 font-extrabold bg-primary/5">0% (중개수수료 완전 무료)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">초기 기기/설치비</td>
                  <td className="py-4 px-4 text-slate-300 bg-card/10">0원 (앱 입점)</td>
                  <td className="py-4 px-4 text-red-400 font-medium bg-card/10">기기값 0원 유혹 뒤 3년(36개월) 노예 약정 의무 계약</td>
                  <td className="py-4 px-4 text-emerald-400 font-extrabold bg-primary/5">0원 (손님 스마트폰 활용)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">월 고정 렌탈비</td>
                  <td className="py-4 px-4 text-slate-300 bg-card/10">배민1 강제 전환 (건당 9.8% + 점주 배달비 2,900~3,400원 부담)</td>
                  <td className="py-4 px-4 text-red-400 font-medium bg-card/10">대당 월 1.5만~2.2만 원 (테이블 10개 시 월 15만~22만 원 고정 렌탈료)</td>
                  <td className="py-4 px-4 text-emerald-400 font-extrabold bg-primary/5">월 0원 ~ 29,000원 (치킨 10마리 수수료면 전액 회수)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">의무 약정 & 위약금</td>
                  <td className="py-4 px-4 text-slate-300 bg-card/10">없음</td>
                  <td className="py-4 px-4 text-red-400 font-medium bg-card/10">3년 의무 약정 필수 (해지/폐업 시 잔여 기기값 + 수백만 원 위약금 폭탄)</td>
                  <td className="py-4 px-4 text-emerald-400 font-extrabold bg-primary/5">의무 약정 없음 (위약금 0원)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">고객 단골 데이터 소유</td>
                  <td className="py-4 px-4 text-red-400 font-medium bg-card/10">배달앱 독점 (사장님은 전화번호도 알 수 없음)</td>
                  <td className="py-4 px-4 text-slate-400 bg-card/10">매장 내 주문만 기록</td>
                  <td className="py-4 px-4 text-emerald-400 font-extrabold bg-primary/5">100% 사장님 소유 (카톡 재방문 마케팅 가능)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-white">입점 특전 혜택</td>
                  <td className="py-4 px-4 text-slate-400 bg-card/10">없음</td>
                  <td className="py-4 px-4 text-slate-400 bg-card/10">없음</td>
                  <td className="py-4 px-4 text-amber-300 font-bold bg-primary/5">🎁 30만 원 상당 AI 상권분석 리포트 100% 무료 증정</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. [신규 무기 5] 🎁 30만 원 상당 AI 상권 리포트 실물 샘플 목업 그래픽 포함 */}
      <section id="ai-report" className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-gradient-to-b from-card to-slate-900 border-2 border-amber-500/30 rounded-3xl p-8 sm:p-12 relative shadow-2xl">
            <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black tracking-wider uppercase shadow-md">
              🎁 입점 사장님 100% 무료 제공
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                EXCLUSIVE AI RESEARCH BONUS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                "웹페이지만 만들어주고 끝내지 않습니다"<br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  30만 원 상당의 AI 상권 & 경쟁점 정밀 진단 리포트 무료 증정
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                돈 받고 파는 서비스가 아닙니다. 리웨이브온과 함께하시는 사장님의 확실한 매출 성공을 위해, 최첨단 인공지능이 매장 반경 3km를 샅샅이 분석한 실전 전략서를 100% 무료 선물로 드립니다.
              </p>
            </div>

            {/* 실물 리포트 샘플 목업 카드 */}
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span className="text-xs sm:text-sm font-bold text-white">[실물 샘플] 영월군 영월읍 요식업 상권 AI 정밀 진단서 요약본</span>
                </div>
                <div className="flex items-center gap-2">
  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">12페이지 PDF 제공</span>
  <a 
    href="/sample_ai_report.html" 
    target="_blank"
    className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-md shadow-md transition-all"
  >
    <span>실물 샘플 보고서 열기</span>
    <ArrowRight className="w-3 h-3" />
  </a>
</div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[10px]">반경 3km 경쟁점</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">42개 매장 전수 조사</p>
                  <p className="text-[10px] text-amber-400 mt-1">배달 리뷰 2,410건 감성 분석 완료</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[10px]">주문 피크 시간대</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">금/토 18:30 ~ 21:00</p>
                  <p className="text-[10px] text-emerald-400 mt-1">야간 안주 세트 주문 비중 68%</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[10px]">추천 킬러 세트메뉴</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">치킨 + 치즈볼 24,900원</p>
                  <p className="text-[10px] text-cyan-400 mt-1">객단가 +25% 극대화 최적 가격선</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4" />
                  <h4>반경 3km 경쟁점 가격 및 배달 리뷰 2,000건 분석</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  인근 동종 매장들의 가격대와 손님들의 긍정/부정 리뷰 키워드를 AI가 분석하여, 우리 매장만의 차별화 포인트를 도출합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <h4>객단가를 25% 끌어올리는 킬러 세트메뉴 추천</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  자사몰에서 손님들이 가장 선호할 만한 사이드 조합과 세트 구성, 적정 할인 가격선을 시뮬레이션하여 제안합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  <h4>네이버 스마트플레이스 상위 노출 최적화 전략</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  지역 주민과 관광객이 네이버에서 우리 가게를 검색할 때 1순위로 눈에 띄게 만드는 키워드와 플레이스 세팅 비법을 안내합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <PhoneCall className="w-4 h-4" />
                  <h4>비수기 매출을 즉시 깨우는 카카오 알림톡 실전 문구</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  비 오는 날, 월요일 저녁 등 한가한 시간대에 단골들의 주문을 폭발시키는 카카오톡 재방문 할인 메시지 예시를 바로 제공합니다.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4"
              >
                <span>지금 100일 무료 체험 신청하고 30만 원 상당 AI 리포트 무료 예약하기 →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. 요금제 */}
      <section id="pricing" className="py-20 bg-card/25 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              소상공인 맞춤 현실 요금제
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              수백만 원짜리 태블릿 약정도, 배달앱 수수료도 없습니다. 치킨 10마리 수수료만 아껴도 매달 순이익이 남습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">스타터 (Starter)</h3>
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
              <a
                href="#contact"
                className="mt-8 w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center text-xs transition-colors"
              >
                100일 무료 시작하기
              </a>
            </div>

            <div className="bg-card border-2 border-primary rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black tracking-wider uppercase">
                사장님 강력 추천 ★
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-primary">스탠다드 (Standard)</h3>
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
              <a
                href="#contact"
                className="mt-8 w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl flex items-center justify-center text-xs transition-colors shadow-md shadow-primary/20"
              >
                스탠다드 입점 신청
              </a>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">올인원 파트너</h3>
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
              <a
                href="#contact"
                className="mt-8 w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center text-xs transition-colors"
              >
                전담 파트너 문의
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 11. 도입 상담 및 100일 무료 신청 폼 */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                QUICK INQUIRY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                소상공인 100일 무료 체험 및 방문 신청
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                기기값 0원, 중개수수료 0원! 신청해 주시면 담당 매니저가 24시간 내 친절히 안내해 드립니다.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">무료 입점 및 방문 상담이 정상 접수되었습니다!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  <strong>[{formData.storeName}]</strong> 사장님, 신청해 주셔서 대단히 감사합니다.<br />
                  영월 최고사령부 전담 매니저가 연락처(<strong>{formData.phone}</strong>)로 신속히 연락드려 1:1 방문 세팅 및 30만 원 상당 AI 상권분석 리포트 준비를 진행해 드리겠습니다.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-5 h-9 bg-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                >
                  다른 매장 추가 접수하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">매장 상호명 <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="storeName"
                      required
                      placeholder="예: 60계치킨 영월점, 동강커피"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3.5 bg-slate-900 border border-border rounded-xl text-white focus:outline-none focus:border-primary transition-colors text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">대표자 성함</label>
                    <input
                      type="text"
                      name="ownerName"
                      placeholder="예: 김상희"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3.5 bg-slate-900 border border-border rounded-xl text-white focus:outline-none focus:border-primary transition-colors text-xs"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">휴대폰 번호 <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="예: 010-1234-5678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3.5 bg-slate-900 border border-border rounded-xl text-white focus:outline-none focus:border-primary transition-colors text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">매장 소재지</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3.5 bg-slate-900 border border-border rounded-xl text-white focus:outline-none focus:border-primary transition-colors text-xs"
                    >
                      <option value="영월군">강원특별자치도 영월군 (방문 세팅 가능)</option>
                      <option value="원주시">강원특별자치도 원주시 (방문 세팅 가능)</option>
                      <option value="제천시">충청북도 제천시 (방문 세팅 가능)</option>
                      <option value="기타지역">기타 전국 지역</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">운영 업종</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3.5 bg-slate-900 border border-border rounded-xl text-white focus:outline-none focus:border-primary transition-colors text-xs"
                  >
                    <option value="치킨/피자">치킨 / 피자 / 패스트푸드</option>
                    <option value="카페/베이커리">카페 / 디저트 / 베이커리</option>
                    <option value="한식/고기구이">한식 / 고깃집 / 삼겹살</option>
                    <option value="중식/일식/양식">중식 / 일식 / 양식</option>
                    <option value="펜션/숙박업">펜션 / 캠핑 / 숙박업</option>
                    <option value="기타매장">기타 일반 매장</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">현재 가장 큰 애로사항 / 방문 희망일</label>
                  <textarea
                    name="inquiry"
                    rows={3}
                    placeholder="예: 배달앱 수수료가 너무 부담돼요 / 직접 오셔서 세팅 부탁드립니다 등"
                    value={formData.inquiry}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900 border border-border rounded-xl text-white focus:outline-none focus:border-primary transition-colors text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all text-sm mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>100일 무료 체험 & 30만 원 상당 AI 리포트 신청하기</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 12. 자주 묻는 질문 (FAQ) */}
      <section id="faq" className="py-20 bg-card/25 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">자주 묻는 질문</h2>
            <p className="text-xs sm:text-sm text-slate-400">사장님들께서 가장 궁금해하시는 점들을 모았습니다.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-card border border-border rounded-2xl overflow-hidden transition-colors"
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
      </section>

      {/* 13. 푸터 */}
      <footer className="border-t border-border py-12 bg-background mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                R
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Rewaveon (리웨이브온)
              </span>
              <span className="text-[11px] text-slate-400 border-l border-slate-700 pl-2.5">
                소상공인 무수수료 모바일 스마트오더 & AI 상권분석 솔루션
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <Link href="/demo/60gye" className="text-slate-300 hover:text-primary transition-colors">
                60계치킨 영월점 라이브 데모
              </Link>
              <Link href="/demo/60gye/kitchen" className="text-slate-300 hover:text-primary transition-colors">
                주방 주문 접수 시스템
              </Link>
              <a href="#contact" className="text-slate-300 hover:text-primary transition-colors">
                가맹 및 방문 세팅 문의
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              상호: 리웨이브온 (Rewaveon) | 대표자: 김상희 | 본사: 강원특별자치도 영월군 영월읍 (굽네치킨 2층 최고사령부) | 고객직통: 010-3363-7945
            </p>
            <p>© 2026 Rewaveon. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 14. [신규 무기 4] 📞 우측 하단 상시 고정 플로팅 상담 버튼 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-emerald-500/40 text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold">대표님과 1초 직통 상담 가능!</span>
        </div>

        <div className="flex items-center gap-2.5">
          <a 
            href="tel:010-3363-7945" 
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/30 transition-all transform hover:scale-105"
            title="대표 직통 전화 상담 (010-3363-7945)"
          >
            <PhoneCall className="w-5 h-5 text-slate-950" />
            <span className="text-xs sm:text-sm font-extrabold">전화 상담</span>
          </a>

          <a 
            href="#contact" 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black px-4 py-3 rounded-full shadow-2xl shadow-primary/30 transition-all transform hover:scale-105"
            title="100일 무료 신청 양식으로 이동"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-extrabold">무료 신청</span>
          </a>
        </div>
      </div>

    </div>
  );
}
