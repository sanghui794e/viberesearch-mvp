'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Phone, MapPin, Clock, ShieldCheck, Sparkles, 
  ChevronRight, ArrowLeft, Plus, Minus, Trash2, Send, Check, AlertCircle, RefreshCw, X, HelpCircle,
  Beer, Flame, Heart, Utensils, Wine
} from 'lucide-react';

export const isAlcoholItem = (name: string): boolean => {
  const n = (name || '').toLowerCase();
  return ['생맥주', '소주', '참이슬', '처음처럼', '진로', '새로', '카스', '테라', '맥주', '주류'].some(k => n.includes(k));
};

export interface MenuPrice {
  type: string;
  price: number;
}

export interface Menu {
  id: string;
  name: string;
  category: '치킨' | '반반치킨' | '순살세트' | '부분육' | '사이드' | '음료' | '소스' | '주류' | '기타 직접입력';
  description: string;
  image: string;
  tag?: string;
  spicy: number;
  prices: MenuPrice[];
  isCustom?: boolean;
  isHalfAndHalf?: boolean; // 반반치킨 여부
  isBonelessSet?: boolean; // 순살세트 여부
  availableFlavors?: string[]; // 순살세트 맛 변경 옵션
}

export interface CartItem {
  menu: Menu;
  selectedType: string;
  selectedPrice: number;
  quantity: number;
  customDetails?: string; // 직접 입력 메뉴의 세부사항 또는 반반치킨 맛 조합 / 순살세트 맛
}

// 60계치킨 강원영월점 실제 공식 홈페이지(youngwol-chicken.co.kr) 실제 업로드 이미지 100% 매핑
// ※ 웨지감자 이미지는 오직 웨지감자 단품에만 사용하며, 음료/주류/사이드/부분육/세트는 전용 이미지 적용
const menuList: Menu[] = [
  // 1. 치킨 단품 (뼈, 순살, 윙봉, 콤보)
  {
    id: 'chamji_mara',
    name: '참지마라치킨',
    category: '치킨',
    description: '마라치킨의 끝판왕! 얼얼한 마라에 침샘 폭발~ 참을 수 없는 참지마라치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260701120437_6e78ec01.jpg',
    tag: 'NEW 신메뉴',
    spicy: 3,
    prices: [
      { type: '뼈', price: 24900 },
      { type: '순살', price: 25900 },
      { type: '윙봉', price: 26500 },
      { type: '콤보', price: 26500 }
    ]
  },
  {
    id: 'ccc',
    name: '크크크치킨',
    category: '치킨',
    description: '크리스피! 크런치! 크림볼! 맛있어서 ㅋㅋㅋ 웃음 나는 바삭함 끝판왕 치킨 (크크크소스 3종 포함)',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165659_ecc44df3.png',
    tag: '베스트 1위',
    spicy: 0,
    prices: [
      { type: '뼈', price: 23900 },
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },
  {
    id: 'crang',
    name: '크랑이치킨',
    category: '치킨',
    description: '바삭바삭한 크크크치킨과 고소하고 알싸매콤한 호랑이 시즈닝의 빠삭한 만남!',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611113738_a67b2cfe.png',
    tag: '인기 폭발',
    spicy: 1,
    prices: [
      { type: '뼈', price: 23900 },
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },
  {
    id: 'horang',
    name: '호랑이치킨',
    category: '치킨',
    description: '알싸한 갈릭 파우더와 달콤한 콘후레이크의 범상치 않은 단짠 마성의 맛!',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165804_e0c36557.png',
    tag: '단짠 명작',
    spicy: 1,
    prices: [
      { type: '뼈', price: 22900 },
      { type: '순살', price: 23900 },
      { type: '윙봉', price: 24500 },
      { type: '콤보', price: 24500 }
    ]
  },
  {
    id: 'gochu',
    name: '고추치킨',
    category: '치킨',
    description: '특제 간장소스에 맵지 않은 고추로 버무려 담백하고 깔끔한 영월점 베스트셀러',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165451_aec718de.jpg',
    tag: '깔끔 매콤',
    spicy: 2,
    prices: [
      { type: '뼈', price: 22900 },
      { type: '순살', price: 23900 },
      { type: '윙봉', price: 24500 },
      { type: '콤보', price: 24500 }
    ]
  },
  {
    id: 'ganji',
    name: '간지치킨',
    category: '치킨',
    description: '특제 간장소스와 누룽지의 조화, 담백하고 고소한 풍미가 가득해 남녀노소 1위 치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165421_50e38d25.jpg',
    tag: '남녀노소 1위',
    spicy: 0,
    prices: [
      { type: '뼈', price: 22900 },
      { type: '순살', price: 23900 },
      { type: '윙봉', price: 24500 },
      { type: '콤보', price: 24500 }
    ]
  },
  {
    id: 'fry',
    name: '후라이드치킨',
    category: '치킨',
    description: '매일 새 기름으로 튀겨 겉은 바삭하고 속은 담백한 가장 순수하고 깨끗한 기본 치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165830_caee4102.jpg',
    tag: '기본에 충실',
    spicy: 0,
    prices: [
      { type: '뼈', price: 19900 },
      { type: '순살', price: 20900 },
      { type: '윙봉', price: 22500 },
      { type: '콤보', price: 22500 }
    ]
  },
  {
    id: 'yangnyeom',
    name: '옛날양념치킨',
    category: '치킨',
    description: '추억의 맛 그대로! 매콤달콤 감칠맛 넘치는 60계 비법 전통 양념치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165615_bbc23d56.jpg',
    tag: '달콤 촉촉',
    spicy: 1,
    prices: [
      { type: '뼈', price: 22900 },
      { type: '순살', price: 23900 },
      { type: '윙봉', price: 24500 },
      { type: '콤보', price: 24500 }
    ]
  },
  {
    id: 'more_gochu',
    name: '더매운고추치킨',
    category: '치킨',
    description: '인기 메뉴 고추치킨보다 더 맵고 더 맛있다! 화끈한 스트레스 타파 치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165600_3e503d96.png',
    tag: '화끈 매운맛',
    spicy: 3,
    prices: [
      { type: '뼈', price: 23900 },
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },
  {
    id: 'hahahat',
    name: '하하핫치킨',
    category: '치킨',
    description: '제일 핫한 치킨! 기분 좋은 매콤함으로 입이 신난다~ 하하핫치킨!',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165745_f342947e.png',
    tag: '매콤 알싸',
    spicy: 3,
    prices: [
      { type: '뼈', price: 23900 },
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },
  {
    id: 'puhahat',
    name: '푸하핫치킨',
    category: '치킨',
    description: '하하핫치킨을 더욱 핫하게! 푸하핫 웃음이 절로 나오는 중독성 최강의 불맛 매운맛 치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165723_2aa0f368.png',
    tag: '강렬 불맛',
    spicy: 3,
    prices: [
      { type: '뼈', price: 23900 },
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },
  {
    id: 'zuran',
    name: '쯔란콤보 / 순살',
    category: '치킨',
    description: '바삭한 치킨에 이국적인 쯔란 스파이스 범벅! (※ 뼈는 없으며 순살/윙봉/콤보 전용)',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165635_7b6f044b.png',
    tag: '이국적 풍미',
    spicy: 1,
    prices: [
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },

  // 2. 반반치킨 (대표님 공식 룰 100% 반영)
  {
    id: 'half_custom',
    name: '내 맘대로 반반치킨 (맛 선택)',
    category: '반반치킨',
    description: '내가 원하는 2가지 맛을 반반씩 조합! (※ 쯔란, 크크크, 크랑이, 참지마라는 조리법상 일반 반반 제외)',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165830_caee4102.jpg',
    tag: '자유 조합',
    spicy: 1,
    isHalfAndHalf: true,
    prices: [
      { type: '뼈', price: 23900 },
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },
  {
    id: 'half_fry_yang',
    name: '후라이드 반 + 양념 반',
    category: '반반치킨',
    description: '치킨의 영원한 정석! 겉바속촉 고소한 후라이드 반과 달콤매콤한 옛날양념 반의 완벽한 조화',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165615_bbc23d56.jpg',
    tag: '영원한 정석',
    spicy: 1,
    prices: [
      { type: '뼈', price: 23900 },
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },
  {
    id: 'ccc_crang_half',
    name: '크크크 반 + 크랑이 반',
    category: '반반치킨',
    description: '★단독 공식 반반★ 극강의 바삭함 크크크 반 + 매콤달콤 알싸한 크랑이 반! (두 메뉴 전용 반반)',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165659_ecc44df3.png',
    tag: '공식 반반',
    spicy: 1,
    prices: [
      { type: '뼈', price: 26900 },
      { type: '순살', price: 27900 },
      { type: '윙봉', price: 28500 },
      { type: '콤보', price: 28500 }
    ]
  },

  // 3. 순살 세트 (순살 한 마리 + 사이드 결합 & 홈페이지 실제 사진 연동)
  {
    id: 'set_cheeseball',
    name: '치즈볼엔 순살',
    category: '순살세트',
    description: '후라이드 순살 한 마리 + 쫀득 치즈볼 3개 + 콜라 1.25L 세트 (맛 변경 옵션 가능)',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115419_3bda53b5.jpg',
    tag: '세트 1위',
    spicy: 0,
    isBonelessSet: true,
    prices: [
      { type: '후라이드 기본', price: 25500 }
    ]
  },
  {
    id: 'set_menbosha',
    name: '멘보샤엔 순살',
    category: '순살세트',
    description: '후라이드 순살 한 마리 + 바삭 촉촉 멘보샤 5개 + 콜라 1.25L 세트',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115445_d3a59082.png',
    tag: '가성비 세트',
    spicy: 0,
    isBonelessSet: true,
    prices: [
      { type: '후라이드 기본', price: 26900 }
    ]
  },
  {
    id: 'set_tteokbokki',
    name: '떡볶이엔 순살',
    category: '순살세트',
    description: '후라이드 순살 한 마리 + 매콤달콤 떡볶이 + 콜라 1.25L 세트',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115433_f1067aa2.png',
    tag: '푸짐 세트',
    spicy: 1,
    isBonelessSet: true,
    prices: [
      { type: '후라이드 기본', price: 27500 }
    ]
  },

  // 4. 부분육 단품 (홈페이지 실제 업로드 전용 사진 연동)
  {
    id: 'part_wing15',
    name: '윙만 15조각',
    category: '부분육',
    description: '윙만 15조각으로 즐기는 단품 메뉴입니다. (단품은 포장 2,000원 할인 대상이 아닙니다)',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165533_706ab6ea.jpg',
    tag: '날개 매니아',
    spicy: 0,
    prices: [
      { type: '후라이드', price: 12800 },
      { type: '양념/호랑이/고추/간지', price: 13800 },
      { type: '크크크/크랑이/매운맛', price: 14800 }
    ]
  },
  {
    id: 'part_bong15',
    name: '봉만 15조각',
    category: '부분육',
    description: '봉만 15조각으로 즐기는 단품 메뉴입니다. (단품은 포장 2,000원 할인 대상이 아닙니다)',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165523_af912931.jpg',
    tag: '닭봉 매니아',
    spicy: 0,
    prices: [
      { type: '후라이드', price: 12800 },
      { type: '양념/호랑이/고추/간지', price: 13800 },
      { type: '크크크/크랑이/매운맛', price: 14800 }
    ]
  },
  {
    id: 'part_leg12',
    name: '다리 12조각 (2분의 1컷)',
    category: '부분육',
    description: '다리 6조각을 2분의 1 컷으로 나누어 12조각으로 제공하는 단품 메뉴입니다.',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165509_fa1bdf19.jpg',
    tag: '닭다리 매니아',
    spicy: 0,
    prices: [
      { type: '후라이드', price: 12800 },
      { type: '양념/호랑이/고추/간지', price: 13800 },
      { type: '크크크/크랑이/매운맛', price: 14800 }
    ]
  },

  // 5. 사이드 메뉴 15종 (홈페이지 실제 업로드 사진 100% 매핑)
  {
    id: 'side_mini_cheeseball',
    name: '미니 쫀득볼',
    category: '사이드',
    description: '한입에 쏙 들어가는 귀엽고 쫄깃쫄깃한 미니 쫀득볼',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115454_0c48d598.png',
    tag: '인기',
    spicy: 0,
    prices: [{ type: '단품', price: 2700 }]
  },
  {
    id: 'side_wedge',
    name: '웨지감자',
    category: '사이드',
    description: '겉은 바삭하고 속은 포슬포슬 촉촉한 리얼 포테이토 웨지 감자튀김',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115406_d9350ea5.png',
    spicy: 0,
    prices: [{ type: '단품', price: 3000 }]
  },
  {
    id: 'side_horang_wedge',
    name: '호랑이 웨지감자',
    category: '사이드',
    description: '바삭한 웨지감자에 달콤짭조름 갈릭 호랑이 시즈닝을 듬뿍 버무린 감자튀김',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115537_b80bf0bc.png',
    tag: '단짠 별미',
    spicy: 1,
    prices: [{ type: '단품', price: 4000 }]
  },
  {
    id: 'side_cheese_stick',
    name: '치즈스틱',
    category: '사이드',
    description: '고소한 자연산 모짜렐라 치즈가 길게 쭉 늘어나는 바삭한 치즈스틱',
    image: '',
    spicy: 0,
    prices: [{ type: '단품', price: 4000 }]
  },
  {
    id: 'side_dumpling',
    name: '튀김만두',
    category: '사이드',
    description: '바삭하게 튀겨내어 속이 꽉 찬 고소하고 담백한 별미 튀김만두',
    image: '',
    spicy: 0,
    prices: [{ type: '단품', price: 4000 }]
  },
  {
    id: 'side_cheeseball',
    name: '쫀득 치즈볼',
    category: '사이드',
    description: '달콤 짭조름한 치즈가 꽉 차서 입안 가득 행복한 60계의 전설적 사이드',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115419_3bda53b5.jpg',
    tag: '사이드 1위',
    spicy: 0,
    prices: [{ type: '단품', price: 5000 }]
  },
  {
    id: 'side_tteokbokki',
    name: '떡볶이',
    category: '사이드',
    description: '학창 시절 추억의 맛! 매콤달콤 자작한 국물이 치킨과 환상 궁합',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115433_f1067aa2.png',
    tag: '국물 별미',
    spicy: 1,
    prices: [{ type: '단품', price: 5000 }]
  },
  {
    id: 'side_jjondog',
    name: '쫀도그',
    category: '사이드',
    description: '쫄깃한 찹쌀 반죽 속에 탱글탱글 소시지가 쏙 들어간 인기 미니 핫도그',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115516_2d77a7c8.jpg',
    tag: '인기',
    spicy: 0,
    prices: [{ type: '단품', price: 5000 }]
  },
  {
    id: 'side_horang_jjondog',
    name: '호랑이 쫀도그',
    category: '사이드',
    description: '쫄깃한 쫀도그에 단짠 알싸 호랑이 콘후레이크 시즈닝을 아낌없이 뿌린 핫도그',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115639_11bb10d0.png',
    spicy: 1,
    prices: [{ type: '단품', price: 6000 }]
  },
  {
    id: 'side_horang_cheeseball',
    name: '호랑이 치즈볼',
    category: '사이드',
    description: '치즈가 쭉 늘어나는 쫀득 치즈볼에 호랑이 단짠 시즈닝을 입혀 중독성 최강',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115709_62428f06.png',
    spicy: 1,
    prices: [{ type: '단품', price: 6000 }]
  },
  {
    id: 'side_potato_cheesestick',
    name: '포테이토 치즈스틱',
    category: '사이드',
    description: '바삭한 감자 큐브가 콕콕 박혀 더욱 바삭하고 고소한 프리미엄 치즈스틱',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115630_1a2b35b1.jpg',
    spicy: 0,
    prices: [{ type: '단품', price: 6000 }]
  },
  {
    id: 'side_menbosha',
    name: '멘보샤',
    category: '사이드',
    description: '겉은 바삭 속은 촉촉 탱글한 통새우 살이 듬뿍 들어간 고급 수제 멘보샤',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115445_d3a59082.png',
    spicy: 0,
    prices: [{ type: '단품', price: 8900 }]
  },
  {
    id: 'side_gizzard',
    name: '근위튀김 (똥집튀김)',
    category: '사이드',
    description: '쫄깃쫄깃 오독오독 씹는 맛이 최고인 깨끗한 새 기름으로 튀긴 닭똥집 튀김',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115552_c05717fb.png',
    tag: '술안주 추천',
    spicy: 0,
    prices: [{ type: '단품', price: 10000 }]
  },
  {
    id: 'side_spicy_gizzard',
    name: '아매워 근위튀김',
    category: '사이드',
    description: '매콤하고 알싸한 화끈 특제 소스를 버무려 맥주를 부르는 매운 똥집튀김',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115552_c05717fb.png',
    spicy: 3,
    prices: [{ type: '단품', price: 11000 }]
  },
  {
    id: 'side_yang_gizzard',
    name: '양념 근위튀김',
    category: '사이드',
    description: '매콤달콤 감칠맛 나는 60계 특제 양념소스를 듬뿍 버무린 쫄깃한 똥집튀김',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115552_c05717fb.png',
    spicy: 1,
    prices: [{ type: '단품', price: 11000 }]
  },

  // 6. 음료수 (웨지감자 전면 제거 & 전용 고화질 이미지 연동)
  {
    id: 'drink_coke_500',
    name: '코카콜라 500ml',
    category: '음료',
    description: '시원하고 톡 쏘는 오리지널 코카콜라 페트 500ml',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
    spicy: 0,
    prices: [{ type: '500ml', price: 2000 }]
  },
  {
    id: 'drink_coke_125',
    name: '코카콜라 1.25L',
    category: '음료',
    description: '가족, 친구들과 넉넉하게 마시는 대용량 코카콜라 1.25L',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
    spicy: 0,
    prices: [{ type: '1.25L', price: 3000 }]
  },
  {
    id: 'drink_sprite_500',
    name: '스프라이트 500ml',
    category: '음료',
    description: '상쾌한 청량감 가득한 사이다 스프라이트 페트 500ml',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    spicy: 0,
    prices: [{ type: '500ml', price: 2000 }]
  },
  {
    id: 'drink_sprite_15',
    name: '스프라이트 1.5L',
    category: '음료',
    description: '시원하게 톡 쏘는 상쾌한 스프라이트 대용량 1.5L',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    spicy: 0,
    prices: [{ type: '1.5L', price: 3000 }]
  },

  // 7. 소스 & 무
  {
    id: 'sauce_radish',
    name: '치킨무 추가',
    category: '소스',
    description: '아삭아삭 새콤달콤 시원한 60계 전용 치킨무 1팩',
    image: '',
    spicy: 0,
    prices: [{ type: '1팩', price: 500 }]
  },
  {
    id: 'sauce_yang',
    name: '치킨양념소스',
    category: '소스',
    description: '후라이드에 찍어 먹으면 딱 좋은 달콤매콤 비법 양념소스',
    image: '',
    spicy: 1,
    prices: [{ type: '1개', price: 500 }]
  },
  {
    id: 'sauce_deli',
    name: '델리소스',
    category: '소스',
    description: '감칠맛 가득 달콤 짭조름한 60계 특제 델리 간장소스',
    image: '',
    spicy: 0,
    prices: [{ type: '1개', price: 500 }]
  },
  {
    id: 'sauce_mayo',
    name: '마요네즈',
    category: '소스',
    description: '고소하고 부드러운 고품질 마요네즈 소스',
    image: '',
    spicy: 0,
    prices: [{ type: '1개', price: 500 }]
  },
  {
    id: 'sauce_cheongyang',
    name: '청양마요소스',
    category: '소스',
    description: '알싸한 청양고추와 고소한 마요네즈의 깔끔한 만남',
    image: '',
    spicy: 2,
    prices: [{ type: '1개', price: 800 }]
  },
  {
    id: 'sauce_hot_ccc',
    name: 'HOT 크크크소스',
    category: '소스',
    description: '바삭한 치킨에 화끈함을 더해주는 매콤 칼칼 HOT 크크크 소스',
    image: '',
    spicy: 2,
    prices: [{ type: '1개', price: 1000 }]
  },
  {
    id: 'sauce_chibob',
    name: '뿌리고 치밥고',
    category: '소스',
    description: '치킨 살을 찢어 밥과 함께 비벼 먹을 때 최고인 특제 치밥 시즈닝',
    image: '',
    spicy: 0,
    prices: [{ type: '1개', price: 1000 }]
  },
  {
    id: 'sauce_corn_mayo',
    name: '콘마요소스',
    category: '소스',
    description: '옥수수의 달콤 고소함이 입안 가득 퍼지는 부드러운 콘마요 소스',
    image: '',
    spicy: 0,
    prices: [{ type: '1개', price: 1000 }]
  },
  {
    id: 'sauce_ccc',
    name: '크크크소스',
    category: '소스',
    description: '크크크치킨의 맛을 완성하는 상큼하고 달콤한 오리지널 마늘 크크크 소스',
    image: '',
    spicy: 0,
    prices: [{ type: '1개', price: 1500 }]
  },
  {
    id: 'sauce_spicy',
    name: '아매워소스',
    category: '소스',
    description: '한 방울울 찍어 먹어도 땀이 쏙 나는 극강의 화끈 매운맛 디핑소스',
    image: '',
    spicy: 3,
    prices: [{ type: '1개', price: 1500 }]
  },

  // 8. 주류
  {
    id: 'alcohol_draft_1000',
    name: '생맥주(포장/배달) 1000cc',
    category: '주류',
    description: '치킨엔 역시 시원한 생맥주! 매장에서 바로 전용 용기에 담아 탄산과 시원함을 그대로 배달/포장',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
    tag: '치맥 필수',
    spicy: 0,
    prices: [{ type: '1000cc', price: 7000 }]
  },
  {
    id: 'alcohol_chamisul',
    name: '참이슬',
    category: '주류',
    description: '깨끗하고 부드러운 이슬 같은 대한민국 대표 소주 (360ml)',
    image: '',
    spicy: 0,
    prices: [{ type: '1병', price: 4000 }]
  },
  {
    id: 'alcohol_chumchurum',
    name: '처음처럼',
    category: '주류',
    description: '대관령 암반수로 만든 부드러운 목넘김의 소주 (360ml)',
    image: '',
    spicy: 0,
    prices: [{ type: '1병', price: 4000 }]
  },
  {
    id: 'alcohol_jinro',
    name: '진로이즈백',
    category: '주류',
    description: '초깔끔한 맛과 레트로 감성의 하늘색 병 진로 소주 (360ml)',
    image: '',
    spicy: 0,
    prices: [{ type: '1병', price: 4000 }]
  },
  {
    id: 'alcohol_saero',
    name: '새로',
    category: '주류',
    description: '과당을 쏙 빼서 산뜻하고 부드러운 인기 소주 (360ml)',
    image: '',
    spicy: 0,
    prices: [{ type: '1병', price: 4000 }]
  },
  {
    id: 'alcohol_cass',
    name: '카스 (병맥주)',
    category: '주류',
    description: '짜릿하고 톡 쏘는 상쾌함 끝판왕 카스 맥주',
    image: '',
    spicy: 0,
    prices: [{ type: '1병', price: 4000 }]
  },
  {
    id: 'alcohol_terra',
    name: '테라 (병맥주)',
    category: '주류',
    description: '청정 라거 100% 리얼 탄산의 시원한 테라 맥주',
    image: '',
    spicy: 0,
    prices: [{ type: '1병', price: 4000 }]
  }
];

export default function G60gyeDemoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'takeout' | 'delivery'>('takeout');
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Menu, 2: Checkout, 3: Tracking
  const [showCartSheet, setShowCartSheet] = useState<boolean>(false);

  // 카테고리 탭 필터 상태
  const [activeCategory, setActiveCategory] = useState<string>('전체');

  // 부위 옵션 선택 상태 (메뉴 ID별)
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});

  // 순살 세트 맛 변경 선택 상태 (세트 ID별)
  const [selectedSetFlavors, setSelectedSetFlavors] = useState<Record<string, string>>({
    set_cheeseball: '후라이드 기본',
    set_menbosha: '후라이드 기본',
    set_tteokbokki: '후라이드 기본'
  });

  // 내 맘대로 반반치킨 모달 상태
  const [showHalfModal, setShowHalfModal] = useState<boolean>(false);
  const [halfFlavor1, setHalfFlavor1] = useState<string>('후라이드');
  const [halfFlavor2, setHalfFlavor2] = useState<string>('양념');
  const [halfType, setHalfType] = useState<string>('뼈');

  // 주문 폼 상태
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('30분 뒤 방문');
  const [paymentMethod, setPaymentMethod] = useState<string>('store_payment');
  const [requestText, setRequestText] = useState<string>('');

  // 포인트 사용 및 공지 모달 상태 (대표님 최종 마진 방어 룰 100% 반영)
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [userAvailablePoints, setUserAvailablePoints] = useState<number>(0);
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);

  // 기타 직접 입력 모달 상태
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customMenuName, setCustomMenuName] = useState<string>('');
  const [customMenuPrice, setCustomMenuPrice] = useState<string>('5000');
  const [customMenuQty, setCustomMenuQty] = useState<number>(1);
  const [customMenuDesc, setCustomMenuDesc] = useState<string>('');

  // AI 큐레이터 상태
  const [aiInput, setAiInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<{ text: string; recommendedSpecs: { id: string; type: string; details?: string }[] } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // 트래킹 상태
  const [trackStep, setTrackStep] = useState<number>(1);

  // 메뉴 기본 타입 초기화
  useEffect(() => {
    const defaults: Record<string, string> = {};
    menuList.forEach(menu => {
      defaults[menu.id] = menu.prices[0].type;
    });
    setSelectedTypes(defaults);

    // 보유 포인트 로드 (로컬스토리지)
    if (typeof window !== 'undefined') {
      try {
        const savedPts = localStorage.getItem('youngwol_user_points');
        setUserAvailablePoints(savedPts ? parseInt(savedPts, 10) || 0 : 0);
      } catch (e) {}
    }
  }, []);

  // 반반치킨 가격 계산 헬퍼 (대표님 공식 룰 100% 매핑)
  const calculateHalfPrice = (f1: string, f2: string, part: string): number => {
    const getLevel = (f: string) => {
      if (f === '후라이드' || f === '양념' || f === '옛날양념') return 0;
      if (f === '간지' || f === '고추' || f === '호랑이') return 1;
      if (f === '하하핫' || f === '푸하핫' || f === '더매운고추' || f === '더매운') return 2;
      return 1;
    };
    const l1 = getLevel(f1);
    const l2 = getLevel(f2);
    const minL = Math.min(l1, l2);
    const maxL = Math.max(l1, l2);

    let base = 23900;
    if (minL === 0 && maxL === 0) base = 23900; // 후라이드 반 + 양념 반
    else if (minL === 0 && maxL === 1) base = 23900; // 후라이드 반 + 간지/고추/호랑이
    else if (minL === 0 && maxL === 2) base = 24900; // 후라이드 반 + 하하핫/푸하핫/더매운
    else if (minL === 1 && maxL === 1) base = 24900; // 간지/고추/호랑이 중 택2
    else if (minL === 1 && maxL === 2) base = 25900; // 간지/고추/호랑이 + 하하핫/푸하핫/더매운
    else if (minL === 2 && maxL === 2) base = 26900; // 하하핫/푸하핫/더매운 중 택2

    let extra = 0;
    if (part === '순살') extra = 1000;
    else if (part === '윙봉' || part === '콤보') extra = 1600;

    return base + extra;
  };

  // 순살 세트 가격 계산 헬퍼 (대표님 공식 룰 100% 매핑)
  const calculateSetPrice = (menuId: string, flavor: string): number => {
    let base = 25500;
    if (menuId === 'set_cheeseball') base = 25500;
    else if (menuId === 'set_menbosha') base = 26900;
    else if (menuId === 'set_tteokbokki') base = 27500;

    if (flavor === '후라이드 기본' || flavor === '후라이드') return base;
    if (['호랑이', '고추', '간지', '양념'].includes(flavor)) return base + 1000;
    if (['크크크', '크랑이', '더매운', '푸하핫', '하하핫'].includes(flavor)) return base + 2000;
    if (['쯔란', '참지마라'].includes(flavor)) return base + 3000;
    return base;
  };

  // 대표님 지정 "무엇을 먹을지 고민되시나요?" 6가지 추천 칩스
  const aiChips = [
    "👴 어르신 입맛 저격! (단짠, 담백고소, 거의 맵지 않은)",
    "🧒 아이들이 제일 좋아하는 (바삭, 달콤, 단짠)",
    "🔥 앗! 화끈하게 매운맛 (푸하핫, 더매운)",
    "🍯 단짠단짠 마성의 조화 (호랑이치킨, 크랑이치킨)",
    "🔄 내 맘대로 반반치킨 (맛 선택)",
    "🍱 푸짐한 순살 세트 (치즈볼/멘보샤/떡볶이)"
  ];

  const handleAiRecommend = (query: string) => {
    setIsAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      let text = '';
      let recommendedSpecs: { id: string; type: string; details?: string }[] = [];

      if (query.includes("어르신") || query.includes("담백고소")) {
        text = "👴 부모님과 어르신들이 가장 좋아하시는 담백하고 자극 없는 조합입니다!\n씹는 맛이 일품인 '뼈 치킨'으로 간지치킨, 후라이드치킨, 깔끔한 고추치킨을 추천해 드려요.";
        recommendedSpecs = [
          { id: 'ganji', type: '뼈' },
          { id: 'fry', type: '뼈' },
          { id: 'gochu', type: '뼈' }
        ];
      } else if (query.includes("아이") || query.includes("바삭, 달콤, 단짠")) {
        text = "🧒 아이들이 한입에 쏙 먹기 편한 순살 치킨 베스트 3!\n바삭함 1위 크크크치킨(순살), 달콤한 옛날양념치킨(순살), 고소한 간지치킨(순살)을 추천합니다.";
        recommendedSpecs = [
          { id: 'ccc', type: '순살' },
          { id: 'yangnyeom', type: '순살' },
          { id: 'ganji', type: '순살' }
        ];
      } else if (query.includes("매운") || query.includes("화끈하게")) {
        text = "🔥 매운맛 마니아를 위한 화끈한 불맛 조합!\n맛있는 날개와 닭다리만 쏙쏙 골라 튀긴 '콤보'로 푸하핫치킨(콤보)과 더매운고추치킨(콤보)을 추천합니다.";
        recommendedSpecs = [
          { id: 'puhahat', type: '콤보' },
          { id: 'more_gochu', type: '콤보' }
        ];
      } else if (query.includes("단짠") || query.includes("호랑이")) {
        text = "🍯 단짠의 최고봉! 멈출 수 없는 바삭함의 향연!\n갈릭 콘후레이크의 호랑이치킨(뼈)과 바삭함 끝판왕 크랑이치킨(뼈) 조합을 추천합니다.";
        recommendedSpecs = [
          { id: 'horang', type: '뼈' },
          { id: 'crang', type: '뼈' }
        ];
      } else if (query.includes("반반")) {
        text = "🔄 두 가지 맛을 한 번에! '내 맘대로 반반치킨' 혹은 '후라이드 반 + 양념 반'을 만나보세요!\n(※ 크크크와 크랑이는 조리법상 서로하고만 반반이 가능하여 단독 메뉴 '크크크 반 + 크랑이 반'으로 준비되어 있습니다)";
        recommendedSpecs = [
          { id: 'half_fry_yang', type: '뼈' },
          { id: 'ccc_crang_half', type: '뼈' }
        ];
      } else if (query.includes("세트") || query.includes("순살 세트") || query.includes("순살세트")) {
        text = "🍱 치킨과 인기 사이드를 한 번에! 가성비 최고의 '순살 세트 3종'!\n쫀득 치즈볼이 함께하는 '치즈볼엔 순살', 바삭한 '멘보샤엔 순살', 매콤달콤 '떡볶이엔 순살' 세트 중 원하시는 구성을 선택해 보세요.";
        recommendedSpecs = [
          { id: 'set_cheeseball', type: '후라이드 기본' },
          { id: 'set_menbosha', type: '후라이드 기본' },
          { id: 'set_tteokbokki', type: '후라이드 기본' }
        ];
      } else {
        text = "💡 영월점 대표 추천 조합! 바삭함 1위 '크크크치킨(순살)'과 매콤달콤 '호랑이치킨(뼈)'을 추천합니다!";
        recommendedSpecs = [
          { id: 'ccc', type: '순살' },
          { id: 'horang', type: '뼈' }
        ];
      }

      setAiResponse({ text, recommendedSpecs });
      setIsAiLoading(false);
    }, 1200);
  };

  const addRecommendedToCart = (specs: { id: string; type: string; details?: string }[]) => {
    const updatedCart = [...cart];
    specs.forEach(spec => {
      const menu = menuList.find(m => m.id === spec.id);
      if (menu) {
        let price = menu.prices[0]?.price || 23900;
        if (menu.isBonelessSet) {
          price = calculateSetPrice(menu.id, spec.type);
        } else {
          const priceOpt = menu.prices.find(p => p.type === spec.type);
          if (priceOpt) price = priceOpt.price;
        }

        const detailStr = menu.isBonelessSet 
          ? (spec.type === '후라이드 기본' ? '기본 후라이드 순살' : `맛 변경: ${spec.type} 순살`)
          : spec.details;

        const existingIdx = updatedCart.findIndex(item => 
          item.menu.id === spec.id && item.selectedType === spec.type && item.customDetails === detailStr
        );
        
        if (existingIdx > -1) {
          updatedCart[existingIdx].quantity += 1;
        } else {
          updatedCart.push({ 
            menu, 
            selectedType: spec.type, 
            selectedPrice: price, 
            quantity: 1,
            customDetails: detailStr
          });
        }
      }
    });
    setCart(updatedCart);
    setShowCartSheet(true);
  };

  const addSingleRecommendedToCart = (spec: { id: string; type: string; details?: string }) => {
    addRecommendedToCart([spec]);
  };

  // 일반 치킨 장바구니 추가
  const addMenuToCart = (menu: Menu) => {
    if (menu.isHalfAndHalf) {
      setShowHalfModal(true);
      return;
    }

    if (menu.isBonelessSet) {
      const selectedFlavor = selectedSetFlavors[menu.id] || '후라이드 기본';
      const price = calculateSetPrice(menu.id, selectedFlavor);
      const detailStr = selectedFlavor === '후라이드 기본' ? '기본 후라이드 순살' : `맛 변경: ${selectedFlavor} 순살`;

      const updatedCart = [...cart];
      const existingIdx = updatedCart.findIndex(item => 
        item.menu.id === menu.id && item.customDetails === detailStr
      );

      if (existingIdx > -1) {
        updatedCart[existingIdx].quantity += 1;
      } else {
        updatedCart.push({
          menu,
          selectedType: selectedFlavor,
          selectedPrice: price,
          quantity: 1,
          customDetails: detailStr
        });
      }
      setCart(updatedCart);
      setShowCartSheet(true);
      return;
    }

    const activeType = selectedTypes[menu.id] || menu.prices[0].type;
    const priceOpt = menu.prices.find(p => p.type === activeType) || menu.prices[0];
    
    const updatedCart = [...cart];
    const existingIdx = updatedCart.findIndex(item => 
      item.menu.id === menu.id && item.selectedType === activeType
    );

    if (existingIdx > -1) {
      updatedCart[existingIdx].quantity += 1;
    } else {
      updatedCart.push({
        menu,
        selectedType: activeType,
        selectedPrice: priceOpt.price,
        quantity: 1
      });
    }
    setCart(updatedCart);
    setShowCartSheet(true);
  };

  // 내 맘대로 반반치킨 모달에서 장바구니 담기
  const handleAddHalfToCart = () => {
    const halfMenu = menuList.find(m => m.id === 'half_custom')!;
    const price = calculateHalfPrice(halfFlavor1, halfFlavor2, halfType);
    const detailStr = `[반반] ${halfFlavor1} 반 + ${halfFlavor2} 반 (${halfType})`;

    const updatedCart = [...cart];
    const existingIdx = updatedCart.findIndex(item => 
      item.menu.id === 'half_custom' && item.selectedType === halfType && item.customDetails === detailStr
    );

    if (existingIdx > -1) {
      updatedCart[existingIdx].quantity += 1;
    } else {
      updatedCart.push({
        menu: halfMenu,
        selectedType: halfType,
        selectedPrice: price,
        quantity: 1,
        customDetails: detailStr
      });
    }

    setCart(updatedCart);
    setShowHalfModal(false);
    setShowCartSheet(true);
  };

  // 기타 직접 입력 메뉴 장바구니 담기
  const handleAddCustomMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMenuName) return;

    const price = Number(customMenuPrice) || 0;
    const customMenuObj: Menu = {
      id: `custom-${Date.now()}`,
      name: customMenuName,
      category: '기타 직접입력',
      description: customMenuDesc || '고객이 직접 작성한 개별 요청 메뉴',
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=400',
      spicy: 0,
      prices: [{ type: '기본', price }],
      isCustom: true
    };

    setCart([
      ...cart,
      {
        menu: customMenuObj,
        selectedType: '기본',
        selectedPrice: price,
        quantity: customMenuQty,
        customDetails: customMenuDesc
      }
    ]);

    setCustomMenuName('');
    setCustomMenuDesc('');
    setCustomMenuQty(1);
    setCustomMenuPrice('5000');
    setShowCustomModal(false);
    setShowCartSheet(true);
  };

  const updateCartQty = (menuId: string, type: string, delta: number, customDetails?: string) => {
    const updated = cart.map(item => {
      const isMatch = item.menu.id === menuId && item.selectedType === type && item.customDetails === customDetails;
      if (isMatch) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];
    setCart(updated);
  };

  const removeFromCart = (menuId: string, type: string, customDetails?: string) => {
    setCart(cart.filter(item => !(item.menu.id === menuId && item.selectedType === type && item.customDetails === customDetails)));
  };

  // 한 마리당 포장 할인 계산 로직 (대표님 공식 룰 100% 반영)
  // - 포장 할인 적용 대상: 일반 치킨 및 반반치킨 중 '뼈' 또는 '순살'
  // - 포장 할인 제외 대상: 윙봉, 콤보 (반반 윙봉/콤보 포함), 순살세트 3종, 부분육 단품(윙/봉/다리), 사이드 전체, 음료/소스/주류 전체
  const isEligibleForTakeoutDiscount = (item: CartItem) => {
    if (item.menu.category !== '치킨' && item.menu.category !== '반반치킨') {
      return false;
    }
    if (item.selectedType === '윙봉' || item.selectedType === '콤보') {
      return false;
    }
    if (item.selectedType === '뼈' || item.selectedType === '순살') {
      return true;
    }
    return false;
  };

  const getTakeoutDiscountEligibleCount = () => {
    if (orderType !== 'takeout') return 0;
    return cart.reduce((count, item) => {
      if (isEligibleForTakeoutDiscount(item)) {
        return count + item.quantity;
      }
      return count;
    }, 0);
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.selectedPrice * item.quantity), 0);
  const getDiscount = () => (orderType === 'takeout') ? (getTakeoutDiscountEligibleCount() * 2000) : 0;
  const getDeliveryFee = () => (orderType === 'delivery' && getSubtotal() > 0) ? 3000 : 0;
  const getTotalPrice = () => Math.max(0, getSubtotal() - getDiscount() + getDeliveryFee() - usedPoints);

  // 포인트 적립 계산 로직 (대표님 최종 마진 방어 룰 100% 반영)
  // - 뼈 / 순살 (단품 및 반반): 포장 500P 적립 / 배달 1,500P 적립
  // - 콤보 / 윙봉 (단품 및 반반): 포장할인 없음 + 포장 1,500P 적립 / 배달 1,500P 적립
  // - 순살세트: 포장할인 없음 + 포장 1,000P 적립 / 배달 1,500P 적립 (대용량 콜라 1.5L 기본 제공)
  // - 단품(윙/봉/다리 부분육), 사이드, 음료, 주류, 소스, 기타: 적립 제외 (0P)
  const getRewardPoints = () => {
    return cart.reduce((total, item) => {
      const cat = item.menu.category;
      const type = item.selectedType;
      const qty = item.quantity;

      // 단품(부분육 윙/봉/다리), 사이드, 음료, 소스, 주류, 기타: 적립 제외 (0P)
      if (cat === '부분육' || cat === '사이드' || cat === '음료' || cat === '소스' || cat === '주류' || cat === '기타 직접입력') {
        return total;
      }

      // 순살세트: 포장 1,000P / 배달 1,500P
      if (cat === '순살세트') {
        return total + ((orderType === 'takeout' ? 1000 : 1500) * qty);
      }

      // 치킨 및 반반치킨
      if (cat === '치킨' || cat === '반반치킨') {
        if (type === '콤보' || type === '윙봉') {
          // 콤보, 윙봉: 포장 1,500P / 배달 1,500P
          return total + (1500 * qty);
        } else if (type === '뼈' || type === '순살') {
          // 뼈, 순살: 포장 500P (2,000원 할인 포함) / 배달 1,500P
          return total + ((orderType === 'takeout' ? 500 : 1500) * qty);
        }
      }

      return total;
    }, 0);
  };

  // 픽업/완료 목표 시각까지 남은 분(Minutes) 계산 헬퍼
  const getRemainingMinutes = () => {
    try {
      const orderIdStr = currentOrderId || currentOrderState?.id || '';
      if (orderIdStr.startsWith('ord-')) {
        const createdMs = parseInt(orderIdStr.replace('ord-', ''), 10);
        if (!isNaN(createdMs)) {
          const totalDuration = currentOrderState?.minutesToAdd || 30;
          const passedMin = (Date.now() - createdMs) / 60000;
          return Math.max(0, Math.floor(totalDuration - passedMin));
        }
      }
      const targetStr = currentOrderState?.targetPickupTime;
      if (targetStr && targetStr.includes(':')) {
        const [h, m] = targetStr.split(':').map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(h, m, 0, 0);
        return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 60000));
      }
    } catch (e) {}
    return 30;
  };

  const getTargetPickupTime = (type: 'takeout' | 'delivery', selectedPickupStr: string) => {
    const now = new Date();
    let minutesToAdd = 30;
    if (type === 'delivery') {
      minutesToAdd = 40;
    } else {
      if (selectedPickupStr.includes('20분')) minutesToAdd = 20;
      else if (selectedPickupStr.includes('30분')) minutesToAdd = 30;
      else if (selectedPickupStr.includes('45분')) minutesToAdd = 45;
      else if (selectedPickupStr.includes('60분')) minutesToAdd = 60;
    }
    const targetDate = new Date(now.getTime() + minutesToAdd * 60000);
    const hours = String(targetDate.getHours()).padStart(2, '0');
    const minutes = String(targetDate.getMinutes()).padStart(2, '0');
    return {
      targetFormatted: `${hours}:${minutes}`,
      minutesToAdd
    };
  };

  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [currentOrderState, setCurrentOrderState] = useState<any | null>(null);
  const [recentOrder, setRecentOrder] = useState<any | null>(null);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  interface MallStoreSettings {
    isPaused: boolean;
    pauseReason: string;
    busyLevel?: 'normal' | 'busy' | 'peak';
    customTimes?: {
      normal: { takeoutMin: number; deliveryMin: number };
      busy: { takeoutMin: number; deliveryMin: number };
      peak: { takeoutMin: number; deliveryMin: number };
    };
    customNotice?: string;
    soldOutMenuIds?: string[];
  }

  const [storeSettings, setStoreSettings] = useState<MallStoreSettings>({
    isPaused: false,
    pauseReason: '',
    busyLevel: 'normal',
    customTimes: {
      normal: { takeoutMin: 20, deliveryMin: 40 },
      busy: { takeoutMin: 35, deliveryMin: 50 },
      peak: { takeoutMin: 50, deliveryMin: 65 },
    },
    customNotice: '',
    soldOutMenuIds: [],
  });
  const [alcoholAgeConfirmed, setAlcoholAgeConfirmed] = useState<boolean>(false);
  const [myPointsModalOpen, setMyPointsModalOpen] = useState<boolean>(false);
  const [pointsQueryPhone, setPointsQueryPhone] = useState<string>('');

  useEffect(() => {
    const fetchSettings = () => {
      fetch(`/api/orders?mode=demo&t=${Date.now()}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => {
          if (d && d.storeSettings) {
            setStoreSettings(d.storeSettings);
          }
        })
        .catch(() => {});
    };
    fetchSettings();
    const interval = setInterval(fetchSettings, 2000);
    return () => clearInterval(interval);
  }, []);

  // 고객 직접 주문 취소 모달 상태
  const [showCustomerCancelModal, setShowCustomerCancelModal] = useState<boolean>(false);
  const [customerCancelReason, setCustomerCancelReason] = useState<string>('메뉴 변경 또는 결제/픽업 시간 재설정');
  const [customerCancelCustom, setCustomerCancelCustom] = useState<string>('');

  const handleCustomerCancelOrder = async () => {
    const orderIdToCancel = currentOrderId || recentOrder?.id || (typeof window !== 'undefined' ? localStorage.getItem('youngwol_latest_order_id') : '');
    if (!orderIdToCancel) return;

    const finalReason = customerCancelReason === 'custom' 
      ? `[고객 직접 취소] ${customerCancelCustom.trim() || '고객 요청에 의한 취소'}`
      : `[고객 직접 취소] ${customerCancelReason}`;

    try {
      await fetch('/api/orders?mode=demo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderIdToCancel,
          status: 'cancelled',
          cancelReason: finalReason
        })
      });

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('youngwol_orders');
        if (stored) {
          const list = JSON.parse(stored);
          const updated = list.map((o: any) => o.id === orderIdToCancel ? { ...o, status: 'cancelled', cancelReason: finalReason } : o);
          localStorage.setItem('youngwol_orders', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        }
      }

      setCurrentOrderState((prev: any) => ({ ...prev, status: 'cancelled', cancelReason: finalReason }));
      setTrackStep(-1);
      setShowCustomerCancelModal(false);
    } catch (e) {
      alert("주문 취소 처리 중 오류가 발생했습니다. 매장(033-374-6660)으로 문의해 주세요.");
    }
  };

  // 로컬스토리지에서 최근 주문을 불러오는 로직 (지워진 주문 영구 방어)
  const loadRecentOrder = () => {
    if (typeof window !== 'undefined') {
      try {
        const dismissed: string[] = JSON.parse(localStorage.getItem('youngwol_dismissed_orders') || '[]');
        const ordersData = localStorage.getItem('youngwol_orders');
        if (ordersData) {
          const list = JSON.parse(ordersData);
          if (Array.isArray(list) && list.length > 0) {
            // 사용자가 영수증 지우기한 주문은 목록에서 완전 제외
            const validOrders = list.filter((o: any) => !dismissed.includes(o.id));
            setMyOrders(validOrders);

            const latestId = localStorage.getItem('youngwol_latest_order_id');
            if (latestId && !dismissed.includes(latestId)) {
              const found = validOrders.find((o: any) => o.id === latestId);
              if (found) {
                setRecentOrder(found);
                if (!currentOrderId) {
                  setCurrentOrderId(found.id);
                  setCurrentOrderState(found);
                }
                return;
              }
            } else {
              // latestId가 없을 때는 취소된 주문을 띄우지 않고,
              // 오직 활성 진행 중인 주문(대기/조리/완료)만 가져옴
              const activeOrder = validOrders.find((o: any) => o.status !== 'cancelled');
              if (activeOrder) {
                setRecentOrder(activeOrder);
                if (!currentOrderId) {
                  setCurrentOrderId(activeOrder.id);
                  setCurrentOrderState(activeOrder);
                }
                return;
              }
            }
          }
        }
        setMyOrders([]);
        setRecentOrder(null);
      } catch (e) {
        console.error('loadRecentOrder error:', e);
      }
    }
  };

  // 주문 영수증 및 활성 주문 완전 초기화 (새로고침 시 취소 주문 영구 소멸)
  const resetAndClearOrder = (orderIdToDelete?: string) => {
    if (typeof window !== 'undefined') {
      try {
        const targetId = orderIdToDelete || currentOrderId || recentOrder?.id || localStorage.getItem('youngwol_latest_order_id') || '';
        
        // 1. latestId 스토리지 키 삭제
        localStorage.removeItem('youngwol_latest_order_id');

        // 2. 영수증 목록에서 완전히 영구 삭제
        const stored = localStorage.getItem('youngwol_orders');
        if (stored) {
          const list = JSON.parse(stored);
          const updated = list.filter((o: any) => o.id !== targetId && (targetId ? true : o.status !== 'cancelled'));
          localStorage.setItem('youngwol_orders', JSON.stringify(updated));
          setMyOrders(updated);
        }

        // 3. 차단 목록에 등록하여 새로고침해도 절대 다시 나타나지 않도록 방어
        if (targetId) {
          const dismissed: string[] = JSON.parse(localStorage.getItem('youngwol_dismissed_orders') || '[]');
          if (!dismissed.includes(targetId)) {
            dismissed.push(targetId);
            localStorage.setItem('youngwol_dismissed_orders', JSON.stringify(dismissed));
          }
        }

        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error('resetAndClearOrder error:', e);
      }
    }
    setCurrentOrderId('');
    setCurrentOrderState(null);
    setRecentOrder(null);
    setCart([]);
    setCurrentStep(1);
    setTrackStep(1);
  };

  useEffect(() => {
    loadRecentOrder();
    window.addEventListener('storage', loadRecentOrder);
    return () => window.removeEventListener('storage', loadRecentOrder);
  }, []);

  const playOrderSuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      setTimeout(() => {
        try {
          const now2 = audioCtx.currentTime;
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(1046.5, now2);
          gain2.gain.setValueAtTime(0.4, now2);
          gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.6);
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.start(now2);
          osc2.stop(now2 + 0.6);
        } catch (e) {}
      }, 140);
    } catch (e) {
      console.log('Order success sound error:', e);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (storeSettings.isPaused) {
      alert(`⚠️ 현재 60계치킨 영월점은 주문 폭주(또는 재료 준비)로 인해 주문 접수가 일시 정지되었습니다.\n\n사유: ${storeSettings.pauseReason || '매장 사정'}\n\n매장 직통 전화(033-374-6660)로 직접 문의해 주시기 바랍니다.`);
      return;
    }

    if (!name || !phone || (orderType === 'delivery' && !address)) {
      alert("필수 주문 정보를 모두 입력해 주세요.");
      return;
    }

    // 주류(생맥주/소주 등) 포함 시 만 19세 성인 인증 동의 필수 검증
    const hasAlcohol = cart.some(item => isAlcoholItem(item.menu.name));
    if (hasAlcohol && !alcoholAgeConfirmed) {
      alert("🚨 [만 19세 미만 주류 판매 불가]\n\n주류(생맥주/소주 등)가 포함된 주문은 청소년보호법 제28조에 따라 상품 수령 시 성인 실물 신분증 대면 제시 필수 동의 체크박스에 체크해 주셔야 주문 접수가 가능합니다.");
      return;
    }

    const { targetFormatted, minutesToAdd } = getTargetPickupTime(orderType, pickupTime);
    const orderId = `ord-${Date.now()}`;
    setCurrentOrderId(orderId);

    // 이달 미니쫀득볼 증정 횟수 체크 (매월 최대 5회 한정)
    const currentMonthKey = `youngwol_gift_count_${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
    let currentGiftCount = 0;
    if (typeof window !== 'undefined') {
      try {
        currentGiftCount = parseInt(localStorage.getItem(currentMonthKey) || '0', 10);
      } catch (e) {}
    }
    const isGiftEligible = currentGiftCount < 5;

    // 모바일 자사몰 단독 고객 감사 덤 서비스 아이템 자동 추가 (월 5회 제한, 포장/배달 5개)
    const serviceGiftItem = isGiftEligible ? {
      name: `🎁 [자사몰 선물] 미니 쫀득볼 5개 (이달 ${currentGiftCount + 1}/5회)`,
      type: '무료 덤',
      price: 0,
      quantity: 5,
      isCustom: false,
      customDetails: '배달/포장 고객 감사 무료 덤 5개 (매월 최대 5회 한정)'
    } : null;

    const earnedPoints = getRewardPoints();

    const orderData = {
      id: orderId,
      name,
      phone,
      orderType,
      address: orderType === 'delivery' ? address : '',
      pickupTime: orderType === 'takeout' ? pickupTime : '',
      targetPickupTime: targetFormatted,
      minutesToAdd,
      paymentMethod,
      requestText,
      items: [
        ...cart.map(item => ({
          name: item.menu.name,
          type: item.selectedType,
          price: item.selectedPrice,
          quantity: item.quantity,
          isCustom: item.menu.isCustom,
          customDetails: item.customDetails
        })),
        ...(serviceGiftItem ? [serviceGiftItem] : [])
      ],
      subtotal: getSubtotal(),
      discount: getDiscount(),
      deliveryFee: getDeliveryFee(),
      usedPoints: usedPoints,
      total: getTotalPrice(),
      rewardPoints: earnedPoints,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    // 포인트 누적 및 사용 업데이트 (로컬스토리지 영구 보존)
    if (typeof window !== 'undefined') {
      try {
        const savedPts = parseInt(localStorage.getItem('youngwol_user_points') || '0', 10);
        const nextPts = Math.max(0, savedPts - usedPoints + earnedPoints);
        localStorage.setItem('youngwol_user_points', String(nextPts));
        setUserAvailablePoints(nextPts);

        if (isGiftEligible) {
          localStorage.setItem(currentMonthKey, String(currentGiftCount + 1));
        }
      } catch (e) {}
    }

    const existingOrders = JSON.parse(localStorage.getItem('youngwol_orders') || '[]');
    const updatedOrderList = [orderData, ...existingOrders];
    localStorage.setItem('youngwol_orders', JSON.stringify(updatedOrderList));
    localStorage.setItem('youngwol_latest_order_id', orderId);
    setMyOrders(updatedOrderList);
    setRecentOrder(orderData);
    
    try {
      await fetch('/api/orders?mode=demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
    } catch (err) {
      console.log('Central Server Order API error:', err);
    }

    fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).catch(err => console.log('Telegram API error:', err));

    window.dispatchEvent(new Event('storage'));

    setCurrentOrderState(orderData);
    setCurrentStep(3);
    setTrackStep(1);
    playOrderSuccessSound();
  };

  useEffect(() => {
    if (currentStep === 3) {
      const syncStatus = async () => {
        const orderIdToFind = currentOrderId || recentOrder?.id || (typeof window !== 'undefined' ? localStorage.getItem('youngwol_latest_order_id') : '');
        if (!orderIdToFind) return;

        try {
          const res = await fetch(`/api/orders?mode=demo&t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (json.ok && Array.isArray(json.orders)) {
              const dismissed: string[] = JSON.parse(localStorage.getItem('youngwol_dismissed_orders') || '[]');

              setMyOrders(prevList => {
                return prevList
                  .filter(localOrd => !dismissed.includes(localOrd.id))
                  .map(localOrd => {
                    const serverMatch = json.orders.find((so: any) => so.id === localOrd.id);
                    return serverMatch ? { ...localOrd, ...serverMatch } : localOrd;
                  });
              });

              if (dismissed.includes(orderIdToFind)) return;

              const found = json.orders.find((o: any) => o.id === orderIdToFind);
              if (found) {
                setCurrentOrderState(found);
                setRecentOrder(found);
                if (found.status === 'cancelled') {
                  setTrackStep(-1);
                } else if (found.status === 'cooking') {
                  setTrackStep(3);
                } else if (found.status === 'done') {
                  setTrackStep(4);
                } else if (found.status === 'accepted') {
                  setTrackStep(2);
                } else {
                  setTrackStep(1);
                }
                return;
              }
            }
          }
        } catch (e) {
          console.log('Customer syncStatus API error:', e);
        }
      };

      syncStatus();
      window.addEventListener('storage', syncStatus);
      const interval = setInterval(syncStatus, 1500);
      return () => {
        window.removeEventListener('storage', syncStatus);
        clearInterval(interval);
      };
    }
  }, [currentStep, currentOrderId, recentOrder]);

  // 카테고리별 필터링
  const categories = ['전체', '🍗 치킨', '🔄 반반치킨', '🍱 순살세트', '🍗 부분육', '🍟 사이드', '🥤 음료/소스', '🍺 주류'];
  
  const filteredMenuList = menuList.filter(m => {
    if (activeCategory === '전체') return true;
    if (activeCategory === '🍗 치킨') return m.category === '치킨';
    if (activeCategory === '🔄 반반치킨') return m.category === '반반치킨';
    if (activeCategory === '🍱 순살세트') return m.category === '순살세트';
    if (activeCategory === '🍗 부분육') return m.category === '부분육';
    if (activeCategory === '🍟 사이드') return m.category === '사이드';
    if (activeCategory === '🥤 음료/소스') return m.category === '음료' || m.category === '소스';
    if (activeCategory === '🍺 주류') return m.category === '주류';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0e0a09] text-slate-100 flex flex-col font-sans selection:bg-[#f39c12]/30 selection:text-white pb-24">
      
      {/* Mobile Top Header */}
      <header className="border-b border-[#32231e] bg-[#1a1210]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="p-1.5 rounded-xl bg-[#1f1715] hover:bg-[#2b1f1c] text-slate-400 hover:text-white transition-colors flex items-center justify-center"
              title="메뉴 선택 화면으로 돌아가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div 
              className="w-8 h-8 rounded-full bg-[#1c1310] border border-[#3d2c27] flex items-center justify-center text-sm shadow-inner"
              title="60계치킨 강원영월점"
            >
              🍗
            </div>
          )}
          <div className="text-center">
            <h1 className="text-sm font-black text-[#f39c12] tracking-wide flex items-center justify-center gap-1">
              <span>60계치킨</span>
              <span className="bg-[#f39c12] text-[#1a1210] text-[9px] font-extrabold px-1 rounded">강원영월점</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">영월읍 관풍헌길 35 • 033-374-6660</p>
          </div>
          <div className="flex items-center gap-1.5">
            {/* 🪙 내 포인트 조회 버튼 */}
            <button
              type="button"
              onClick={() => {
                if (phone) setPointsQueryPhone(phone);
                setMyPointsModalOpen(true);
              }}
              className="h-8 px-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-black flex items-center gap-1 transition-all shadow-sm shrink-0"
              title="내 적립 포인트 및 적립 이력 확인"
            >
              <span>🪙 포인트</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const target = currentOrderState || recentOrder;
                if (target) {
                  setCurrentOrderId(target.id);
                  setCurrentOrderState(target);
                  setCurrentStep(3);
                } else {
                  alert('아직 접수된 주문 내역이 없습니다. 메뉴를 선택하신 후 주문해 주세요! 😊');
                }
              }}
              className="h-8 px-2.5 rounded-full bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] text-[11px] font-black flex items-center gap-1 transition-all shadow-md active:scale-95 shrink-0"
            >
              <span>🧾 내 주문</span>
            </button>
            <a href="tel:033-374-6660" className="w-8 h-8 rounded-full bg-[#f39c12]/15 hover:bg-[#f39c12]/20 text-[#f39c12] flex items-center justify-center transition-colors shrink-0">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Store Pause Alert Banner */}
      {storeSettings.isPaused && (
        <div className="bg-red-950/90 border-b border-red-500/60 px-4 py-2.5 text-center text-xs font-bold text-red-200 flex items-center justify-center gap-2 sticky top-14 z-30 shadow-lg">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
          <span>⚠️ {storeSettings.pauseReason || '현재 매장 주문 폭주로 인해 모바일 주문이 잠시 일시 정지되었습니다.'} (문의: 033-374-6660)</span>
        </div>
      )}

      {/* Real-time Busy / Notice Banner */}
      {!storeSettings.isPaused && (storeSettings.busyLevel === 'busy' || storeSettings.busyLevel === 'peak' || storeSettings.customNotice) && (
        <div className={`px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 sticky top-14 z-30 shadow-md ${
          storeSettings.busyLevel === 'peak'
            ? 'bg-rose-950/90 border-b border-rose-500/60 text-rose-200 animate-pulse'
            : 'bg-amber-950/90 border-b border-amber-500/60 text-amber-200'
        }`}>
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-center leading-snug">
            {storeSettings.busyLevel === 'peak' && (
              <span className="font-black text-rose-400 mr-1.5">🔴 [주문 폭주 피크타임]</span>
            )}
            {storeSettings.busyLevel === 'busy' && (
              <span className="font-black text-amber-400 mr-1.5">🟡 [주문 혼잡 안내]</span>
            )}
            <span>
              현재 조리 대기 발생 중 (포장 약 {
                storeSettings.busyLevel === 'peak' 
                  ? (storeSettings.customTimes?.peak.takeoutMin || 50)
                  : (storeSettings.customTimes?.busy.takeoutMin || 35)
              }분 / 배달 약 {
                storeSettings.busyLevel === 'peak'
                  ? (storeSettings.customTimes?.peak.deliveryMin || 65)
                  : (storeSettings.customTimes?.busy.deliveryMin || 50)
              }분 소요)
            </span>
            {storeSettings.customNotice && (
              <div className="text-[11px] text-white font-extrabold mt-0.5">
                📢 {storeSettings.customNotice}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Constraints container */}
      <div className="w-full max-w-md mx-auto px-4 py-4 flex-1 flex flex-col gap-5">
        
        {/* Step Header */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-extrabold text-slate-500 border-b border-[#2a1d19] pb-3">
          <button 
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`pb-1 transition-all ${currentStep === 1 ? 'text-[#f39c12] border-b-2 border-[#f39c12] font-black' : 'hover:text-slate-300'}`}
          >
            1. 메뉴 선택
          </button>
          <button 
            type="button"
            onClick={() => {
              if (cart.length > 0) {
                setCurrentStep(2);
              } else {
                alert('장바구니에 담긴 메뉴가 없습니다. 먼저 메뉴를 담아주세요!');
              }
            }}
            className={`pb-1 transition-all ${currentStep === 2 ? 'text-[#f39c12] border-b-2 border-[#f39c12] font-black' : 'hover:text-slate-300'}`}
          >
            2. 주문서 작성 {cart.length > 0 && `(${cart.reduce((a, b) => a + b.quantity, 0)})`}
          </button>
          <button 
            type="button"
            onClick={() => {
              const target = currentOrderState || recentOrder;
              if (target) {
                setCurrentOrderId(target.id);
                setCurrentOrderState(target);
                setCurrentStep(3);
              } else {
                alert('아직 접수된 주문 내역이 없습니다. 먼저 메뉴를 주문해 주세요!');
              }
            }}
            className={`pb-1 transition-all flex items-center justify-center gap-1 ${currentStep === 3 ? 'text-[#f39c12] border-b-2 border-[#f39c12] font-black' : (recentOrder && recentOrder.status !== 'cancelled' ? 'text-amber-400 font-bold hover:text-white' : (recentOrder && recentOrder.status === 'cancelled' ? 'text-red-400/80 hover:text-red-300' : 'hover:text-slate-300'))}`}
          >
            <span>3. 실시간 대기</span>
            {recentOrder && recentOrder.status !== 'cancelled' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            )}
            {recentOrder && recentOrder.status === 'cancelled' && (
              <span className="text-[9px] bg-red-950 text-red-400 border border-red-700/60 px-1 rounded font-bold">취소</span>
            )}
          </button>
        </div>

        {/* STEP 1: MENU SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            
            {/* 최근 주문 영수증 배너 */}
            {recentOrder && recentOrder.status !== 'cancelled' ? (
              <div 
                onClick={() => {
                  setCurrentOrderId(recentOrder.id);
                  setCurrentOrderState(recentOrder);
                  setCurrentStep(3);
                }}
                className="cursor-pointer bg-gradient-to-r from-[#2c1d18] via-[#3a2219] to-[#201410] border-2 border-[#f39c12] rounded-2xl p-3.5 shadow-xl shadow-[#f39c12]/15 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between gap-3 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f39c12] text-[#1a1210] flex items-center justify-center text-lg shadow-md shrink-0 font-black">
                    🧾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#f39c12]">
                        {myOrders.length > 1 ? `총 ${myOrders.length}건의 주문 내역이 있습니다!` : '방금 주문하신 내역이 있습니다!'}
                      </span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-extrabold">
                        {recentOrder.status === 'cooking' ? '🔥 맛있게 조리 중' : recentOrder.status === 'done' ? '🛍️ 준비 완료' : '접수 완료'}
                      </span>
                    </div>
                    <p className="text-[11px] text-white font-bold mt-0.5 line-clamp-1">
                      {recentOrder.items?.[0]?.name} {recentOrder.items?.length > 1 ? `외 ${recentOrder.items.length - 1}건` : ''} • {recentOrder.total?.toLocaleString()}원
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      👉 터치하시면 <strong>상세 영수증 & 조리 진행</strong>을 바로 확인하실 수 있습니다.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black text-[#1a1210] bg-[#f39c12] hover:bg-[#e67e22] px-3 py-2 rounded-xl shrink-0 transition-colors shadow">
                  영수증 보기
                </span>
              </div>
            ) : recentOrder && recentOrder.status === 'cancelled' ? (
              <div className="bg-red-950/30 border border-red-500/50 rounded-2xl p-3.5 flex items-center justify-between gap-2 animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center text-base shrink-0">
                    🚫
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-red-300">최근 주문이 취소되었습니다</span>
                      <span className="text-[9px] bg-red-900/60 text-red-200 border border-red-600 px-1 rounded font-bold">취소 완료</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {recentOrder.cancelReason || '매장 사정 또는 고객 요청에 의해 취소되었습니다.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentOrderId(recentOrder.id);
                      setCurrentOrderState(recentOrder);
                      setCurrentStep(3);
                    }}
                    className="text-[10px] font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-[#3d2c27] px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    사유 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => resetAndClearOrder(recentOrder.id)}
                    className="text-[10px] font-extrabold text-red-300 hover:text-white bg-red-950/80 hover:bg-red-900 border border-red-700 px-2.5 py-1.5 rounded-lg transition-colors shadow"
                  >
                    영수증 지우기 ✕
                  </button>
                </div>
              </div>
            ) : null}

            {/* 사장님 공식 공지문 배너 (대표님 요청 100% 반영) */}
            <div 
              onClick={() => setShowNoticeModal(true)}
              className="cursor-pointer bg-gradient-to-r from-[#2c1d18] via-[#3a2219] to-[#201410] border-2 border-amber-500/70 hover:border-amber-400 rounded-2xl p-3.5 shadow-lg flex items-center justify-between gap-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl shrink-0">📢</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-300">[사장님 공지] 자사몰 혜택 및 이용 수칙</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded font-extrabold">필독</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">
                    포장 2,000원 할인·포인트 1,500P 적립·매장 쿠폰 안내 (터치하여 전체보기)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg shrink-0">
                공지 확인 ➔
              </span>
            </div>

            {/* Live Store status */}
            <div className="bg-[#1c1310] border border-[#3d2c27] rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-emerald-450 tracking-wider block">LIVE KITCHEN STATUS</span>
                <h4 className="text-xs font-bold text-white mt-0.5">현재 주문 대기: <span className="text-[#f39c12]">보통</span></h4>
                <p className="text-[10px] text-slate-400 mt-0.5">포장 조리 완료까지 약 25분 소요 예정</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/25">전화 연결 원활</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/25">🎁 포장 2,000원 할인</span>
              </div>
            </div>

            {/* AI Assistant & 무엇을 먹을지 고민되시나요? */}
            <div className="bg-gradient-to-r from-[#201511] via-[#2d1b14] to-[#3a1f14] border border-[#f39c12]/30 rounded-2xl p-4 space-y-3.5 shadow-lg shadow-[#f39c12]/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#f39c12]/20 border border-[#f39c12]/40 flex items-center justify-center text-[#f39c12]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>무엇을 먹을지 고민되시나요?</span>
                    <span className="text-[9px] text-[#f39c12] bg-[#f39c12]/15 px-1.5 py-0.5 rounded font-extrabold">AI 큐레이터</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">대표 추천 메뉴를 눌러보시면 맞춤 조합을 안내해 드려요!</p>
                </div>
              </div>

              {/* Chat chips (대표님 확정 6대 칩스) */}
              <div className="grid grid-cols-1 gap-1.5">
                {aiChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (chip.includes("반반")) {
                        setShowHalfModal(true);
                      } else if (chip.includes("순살 세트")) {
                        setActiveCategory('🍱 순살세트');
                      }
                      handleAiRecommend(chip);
                    }}
                    className="text-[11px] font-bold bg-[#261713] hover:bg-[#3d2720] border border-[#442c23] hover:border-[#f39c12]/50 text-slate-200 hover:text-white px-3 py-2 rounded-xl transition-all text-left flex items-center justify-between"
                  >
                    <span>{chip}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#f39c12] shrink-0" />
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="예: 어르신이랑 먹을 안 매운 치킨 추천해줘 🍗"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAiRecommend(aiInput);
                  }}
                  className="flex-1 h-9 px-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors"
                />
                <button
                  onClick={() => handleAiRecommend(aiInput)}
                  disabled={!aiInput || isAiLoading}
                  className="w-9 h-9 bg-[#f39c12] hover:bg-[#f39c12]/95 disabled:bg-[#f39c12]/50 text-[#1a1210] rounded-xl flex items-center justify-center transition-colors shrink-0 font-bold"
                >
                  {isAiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* AI Recommendation Result Panel (3가지 모두 정확히 노출 & 개별 담기 지원) */}
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[#0e0908] border-2 border-[#f39c12]/50 rounded-2xl p-4 space-y-3.5 overflow-hidden shadow-2xl"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#261915] pb-2.5">
                      <p className="text-xs text-slate-200 leading-relaxed font-medium whitespace-pre-line flex-1">
                        {aiResponse.text}
                      </p>
                      <button
                        type="button"
                        onClick={() => setAiResponse(null)}
                        className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded-lg bg-[#1c1310] border border-[#3d2720] shrink-0"
                      >
                        닫기 ✕
                      </button>
                    </div>

                    {/* 추천된 개별 메뉴 카드 리스트 (개별 담기 단추 완비) */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-[#f39c12] uppercase tracking-wider flex items-center justify-between">
                        <span>🍗 맞춤 추천 메뉴 ({aiResponse.recommendedSpecs.length}가지)</span>
                        <span className="text-slate-400 font-bold text-[9px]">원하는 메뉴를 쏙 담아보세요!</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {aiResponse.recommendedSpecs.map(spec => {
                          const item = menuList.find(m => m.id === spec.id);
                          if (!item) return null;
                          const priceOpt = item.prices.find(p => p.type === spec.type) || item.prices[0];
                          const price = item.isBonelessSet ? calculateSetPrice(item.id, spec.type) : priceOpt.price;

                          return (
                            <div 
                              key={`${spec.id}-${spec.type}`}
                              className="bg-[#170e0b] border border-[#3d2720] rounded-xl p-2.5 flex items-center justify-between gap-2.5 hover:border-[#f39c12]/50 transition-colors shadow-sm"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-11 h-11 rounded-lg object-cover bg-slate-900 shrink-0 border border-[#2a1b16]" 
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h5 className="text-xs font-black text-white truncate">{item.name}</h5>
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#2a1712] text-[#f39c12] border border-[#f39c12]/30 shrink-0">
                                      {spec.type}
                                    </span>
                                  </div>
                                  <p className="text-xs font-black text-amber-400 mt-0.5">
                                    {price.toLocaleString()}원
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => addSingleRecommendedToCart(spec)}
                                className="h-8 px-3 rounded-lg bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] font-black text-xs flex items-center gap-1 transition-all shrink-0 active:scale-95 shadow"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>담기</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 추천 조합 전체 한 번에 담기 버튼 */}
                    {aiResponse.recommendedSpecs.length > 1 && (
                      <div className="border-t border-[#261915] pt-2.5 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">
                          추천 {aiResponse.recommendedSpecs.length}가지 모두 주문하시겠어요?
                        </span>
                        <button
                          type="button"
                          onClick={() => addRecommendedToCart(aiResponse.recommendedSpecs)}
                          className="text-xs font-black bg-[#2a1712] hover:bg-[#3d2720] border border-[#f39c12]/50 text-[#f39c12] hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 shadow active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>전체 함께 담기</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Navigation Tabs */}
            <div className="sticky top-14 z-30 bg-[#0e0a09]/95 backdrop-blur-md pt-1 pb-2 border-b border-[#2a1d19]">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all whitespace-nowrap shrink-0 border ${
                      activeCategory === cat
                        ? 'bg-[#f39c12] text-[#1a1210] border-[#f39c12] shadow-md shadow-[#f39c12]/20'
                        : 'bg-[#1c1310] text-slate-300 border-[#3d2c27] hover:border-[#f39c12]/50 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 주류 카테고리 선택 시 19세 성인 인증 배너 */}
            {activeCategory === '🍺 주류' && (
              <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-3 text-xs text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>※ 19세 미만 청소년에게는 주류를 판매하지 않습니다. 픽업/배달 수령 시 신분증 확인이 진행됩니다.</span>
              </div>
            )}

            {/* Menu List Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {activeCategory === '전체' ? '영월점 전체 공식 메뉴' : activeCategory} ({filteredMenuList.length}개)
                </h3>
                <span className="text-[9px] font-semibold text-slate-500">* 매장 실제 사진 및 가격 100% 매핑</span>
              </div>

              {/* Menu Cards */}
              <div className="space-y-4">
                {filteredMenuList.map((menu) => {
                  const isSoldOut = storeSettings.soldOutMenuIds?.includes(menu.id);
                  const activeType = selectedTypes[menu.id] || menu.prices[0].type;
                  let activePrice = menu.prices.find(p => p.type === activeType)?.price || menu.prices[0].price;

                  if (menu.isBonelessSet) {
                    const chosenFlavor = selectedSetFlavors[menu.id] || '후라이드 기본';
                    activePrice = calculateSetPrice(menu.id, chosenFlavor);
                  }

                  const cartItem = cart.find(item => item.menu.id === menu.id && item.selectedType === activeType);

                  return (
                    <div 
                      key={menu.id}
                      className={`bg-[#1c1310] border rounded-2xl overflow-hidden flex flex-col transition-all shadow-md animate-fade-in relative ${
                        isSoldOut ? 'border-rose-900/60 opacity-60 grayscale' : 'border-[#3d2c27] hover:border-[#f39c12]/50'
                      }`}
                    >
                      {/* Top Horizontal Row */}
                      <div className="flex">
                        {/* Image Block */}
                        {menu.image ? (
                          <div className="w-28 h-28 shrink-0 relative bg-slate-900">
                            <img 
                              src={menu.image} 
                              alt={menu.name}
                              className="w-full h-full object-cover"
                            />
                            {isSoldOut && (
                              <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-20">
                                <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-1 rounded-lg border border-rose-400 shadow">
                                  🔴 품절
                                </span>
                              </div>
                            )}
                            {menu.tag && !isSoldOut && (
                              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#f39c12] text-[#1a1210] text-[8px] font-black uppercase tracking-wider">
                                {menu.tag}
                              </span>
                            )}
                          </div>
                        ) : null}

                        {/* Content Block */}
                        <div className="flex-1 p-3.5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-sm font-extrabold text-white leading-tight flex items-center gap-1.5">
                                <span>{menu.name}</span>
                                {isSoldOut && (
                                  <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-700 px-1.5 py-0.2 rounded font-black">
                                    품절
                                  </span>
                                )}
                              </h4>
                              <span className="text-xs font-black text-[#f39c12] shrink-0">{activePrice.toLocaleString()}원</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                              {menu.description}
                            </p>
                          </div>

                          {/* Cart Add/Remove Buttons */}
                          <div className="flex justify-end items-center mt-2">
                            {isSoldOut ? (
                              <span className="h-8 px-3 bg-rose-950/60 border border-rose-800/80 text-rose-300 font-bold rounded-xl flex items-center text-[10px]">
                                🚫 재료소진 품절
                              </span>
                            ) : menu.isHalfAndHalf ? (
                              <button
                                onClick={() => setShowHalfModal(true)}
                                className="h-8 px-3.5 bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] font-black rounded-xl flex items-center gap-1 transition-all text-[11px] shadow"
                              >
                                <span>맛 선택 & 담기 🔄</span>
                              </button>
                            ) : cartItem ? (
                              <div className="flex items-center bg-[#0d0908] border border-[#3d2c27] rounded-xl h-8 px-1">
                                <button 
                                  onClick={() => updateCartQty(menu.id, activeType, -1, cartItem.customDetails)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center text-xs font-bold text-white">{cartItem.quantity}</span>
                                <button 
                                  onClick={() => updateCartQty(menu.id, activeType, 1, cartItem.customDetails)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addMenuToCart(menu)}
                                className="h-8 px-3.5 bg-[#f39c12]/10 hover:bg-[#f39c12] text-[#f39c12] hover:text-[#1a1210] border border-[#f39c12]/20 font-bold rounded-xl flex items-center gap-1 transition-all text-[11px]"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>장바구니 담기</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 타원형 알약 옵션 선택 버튼 UI (뼈, 순살, 윙봉, 콤보) */}
                      {menu.prices.length > 1 && !menu.isHalfAndHalf && !menu.isBonelessSet && (
                        <div className="px-3.5 pb-2.5 pt-2 bg-[#170f0d] border-t border-[#291b17] flex items-center gap-2 overflow-x-auto scrollbar-none">
                          <span className="text-[11px] font-extrabold text-sky-400 uppercase tracking-wider shrink-0 mr-1">
                            옵션 선택:
                          </span>
                          <div className="flex gap-1.5">
                            {menu.prices.map((opt) => {
                              const isSelected = activeType === opt.type;
                              const diff = opt.price - menu.prices[0].price;
                              return (
                                <button
                                  key={opt.type}
                                  type="button"
                                  onClick={() => setSelectedTypes(prev => ({ ...prev, [menu.id]: opt.type }))}
                                  className={`px-3 py-1 rounded-full text-[11px] font-black transition-all border shrink-0 ${
                                    isSelected
                                      ? 'border-[#f39c12] text-[#f39c12] bg-[#f39c12]/15 shadow-sm'
                                      : 'border-[#3d2c27] bg-[#161211] text-slate-200 hover:border-slate-600'
                                  }`}
                                >
                                  {opt.type} (+{diff.toLocaleString()}원)
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 순살 세트 전용 맛 변경 옵션 선택기 */}
                      {menu.isBonelessSet && (
                        <div className="px-3.5 pb-2.5 pt-2 bg-[#170f0d] border-t border-[#291b17] flex items-center gap-2 overflow-x-auto scrollbar-none">
                          <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider shrink-0 mr-1">
                            맛 변경 옵션:
                          </span>
                          <div className="flex gap-1.5">
                            {[
                              { label: '후라이드 기본 (+0원)', val: '후라이드 기본' },
                              { label: '호랑이/고추/간지/양념 (+1,000원)', val: '호랑이' },
                              { label: '크크크/크랑이/더매운 (+2,000원)', val: '크크크' },
                              { label: '쯔란/참지마라 (+3,000원)', val: '쯔란' }
                            ].map((flavorOpt) => {
                              const currentVal = selectedSetFlavors[menu.id] || '후라이드 기본';
                              const isSelected = currentVal === flavorOpt.val;
                              return (
                                <button
                                  key={flavorOpt.val}
                                  type="button"
                                  onClick={() => setSelectedSetFlavors(prev => ({ ...prev, [menu.id]: flavorOpt.val }))}
                                  className={`px-3 py-1 rounded-full text-[11px] font-black transition-all border shrink-0 ${
                                    isSelected
                                      ? 'border-[#f39c12] text-[#f39c12] bg-[#f39c12]/15 shadow-sm'
                                      : 'border-[#3d2c27] bg-[#161211] text-slate-200 hover:border-slate-600'
                                  }`}
                                >
                                  {flavorOpt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom/Other Order Request Block */}
            <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black text-[#f39c12] tracking-wider uppercase">이외에 다른 메뉴 주문하기 ➕</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                메뉴판에 없는 추가 구성이나 특별한 요청 메뉴를 직접 작성해 장바구니에 담을 수 있습니다.
              </p>
              <button
                type="button"
                onClick={() => setShowCustomModal(true)}
                className="w-full h-10 bg-[#f39c12]/10 hover:bg-[#f39c12] text-[#f39c12] hover:text-[#1a1210] border border-[#f39c12]/20 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs"
              >
                <span>다른 메뉴 직접 적어서 장바구니 담기</span>
              </button>
            </div>

            {/* Direct Call Center Section */}
            <div className="bg-[#170f0d] border border-[#f39c12]/10 rounded-2xl p-4 text-center space-y-2.5">
              <p className="text-[10px] text-slate-450 font-medium">원하는 메뉴 조합이나 구성이 너무 복잡하여 주문서 작성이 힘드신가요?</p>
              <a 
                href="tel:033-374-6660" 
                className="inline-flex h-9 bg-slate-900 border border-[#3d2c27] hover:border-[#f39c12]/50 text-white font-bold rounded-xl text-xs items-center justify-center px-5 gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#f39c12]" />
                <span>영월점 전화로 바로 주문하기 (033-374-6660)</span>
              </a>
            </div>

          </div>
        )}

        {/* STEP 2: CHECKOUT & INFO */}
        {currentStep === 2 && (
          <form onSubmit={handleOrderSubmit} className="space-y-5 animate-fade-in">
            
            {/* Takeout/Delivery Toggle */}
            <div className="bg-[#1c1310] border border-[#3d2c27] p-1.5 rounded-xl grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setOrderType('takeout')}
                className={`py-2 px-1 rounded-lg text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  orderType === 'takeout' 
                    ? 'bg-[#f39c12] text-[#1a1210] shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🚴 포장 요청 (마리당 -2,000원)</span>
                <span className={`text-[9px] font-black ${orderType === 'takeout' ? 'text-[#1a1210]/80' : 'text-emerald-400'}`}>
                  + 미니 쫀득볼 5개 덤 🎁
                </span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 px-1 rounded-lg text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  orderType === 'delivery' 
                    ? 'bg-[#f39c12] text-[#1a1210] shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🏠 배달 주문 (+3,000원)</span>
                <span className={`text-[9px] font-black ${orderType === 'delivery' ? 'text-[#1a1210]/80' : 'text-amber-400'}`}>
                  + 미니 쫀득볼 10개 덤 🎁
                </span>
              </button>
            </div>

            {/* Customer Info */}
            <div className="space-y-4 bg-[#1c1310] border border-[#3d2c27] p-4 rounded-2xl">
              <h4 className="text-xs font-black text-[#f39c12] tracking-wider uppercase">주문 고객 정보</h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">성함 (필수)</label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">연락처 (필수)</label>
                  <input
                    type="tel"
                    required
                    placeholder="01012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors"
                  />
                </div>

                {orderType === 'delivery' ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">배달 주소 (필수)</label>
                    <input
                      type="text"
                      required
                      placeholder="강원특별자치도 영월군 영월읍..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-10 px-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">포장 방문 예정 시간</label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full h-10 px-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors"
                    >
                      <option value="20분 뒤 방문" disabled={storeSettings.busyLevel === 'busy' || storeSettings.busyLevel === 'peak'}>
                        20분 뒤 방문 {storeSettings.busyLevel === 'busy' || storeSettings.busyLevel === 'peak' ? '(혼잡 조리 지연 🚫)' : ''}
                      </option>
                      <option value="30분 뒤 방문" disabled={storeSettings.busyLevel === 'peak'}>
                        30분 뒤 방문 {storeSettings.busyLevel === 'peak' ? '(피크타임 선택불가 🚫)' : ''}
                      </option>
                      <option value="45분 뒤 방문">45분 뒤 방문</option>
                      <option value="60분 뒤 방문">60분 뒤 방문</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* 주문 품목 및 결제 금액 확인 */}
            <div className="space-y-4 bg-[#1c1310] border border-[#f39c12]/30 p-4 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between border-b border-[#3d2c27] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#f39c12] tracking-wider uppercase">
                    🧾 주문 품목 및 금액 확인
                  </span>
                  <span className="text-[9px] bg-[#f39c12]/20 text-[#f39c12] border border-[#f39c12]/40 px-2 py-0.5 rounded font-extrabold">
                    {orderType === 'takeout' ? '방문 포장' : '안전 배달'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-[10px] text-slate-400 hover:text-[#f39c12] transition-colors flex items-center gap-0.5 font-bold"
                >
                  <Plus className="w-3 h-3" />
                  <span>메뉴 추가/변경</span>
                </button>
              </div>

              {/* 담긴 메뉴 리스트 */}
              <div className="space-y-2.5">
                {cart.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 text-xs">
                    장바구니에 담긴 메뉴가 없습니다.
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    const isDiscountItem = orderType === 'takeout' && isEligibleForTakeoutDiscount(item);
                    return (
                      <div key={idx} className="bg-[#140d0b] border border-[#2e201c] rounded-xl p-3 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-xs font-extrabold text-white truncate">{item.menu.name}</h5>
                            <span className="text-[9px] font-bold text-[#f39c12] bg-[#2a1b16] px-1.5 py-0.5 rounded border border-[#442c23]">
                              {item.selectedType}
                            </span>
                            {orderType === 'takeout' && (
                              isDiscountItem ? (
                                <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                                  포장할인 적용 (-{(item.quantity * 2000).toLocaleString()}원)
                                </span>
                              ) : (
                                <span className="text-[8px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
                                  포장할인 제외 (윙봉/콤보/세트/단품)
                                </span>
                              )
                            )}
                          </div>
                          {item.customDetails && (
                            <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{item.customDetails}</p>
                          )}
                          <p className="text-[11px] font-black text-slate-300 mt-1">
                            {(item.selectedPrice * item.quantity).toLocaleString()}원
                            <span className="text-[9px] text-slate-500 font-normal ml-1">
                              ({item.selectedPrice.toLocaleString()}원 × {item.quantity})
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center bg-[#0d0908] border border-[#3d2c27] rounded-xl h-8 px-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.menu.id, item.selectedType, -1, item.customDetails)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.menu.id, item.selectedType, 1, item.customDetails)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* 모바일 자사몰 단독 고객 감사 덤 서비스 카드 */}
                <div className="bg-gradient-to-r from-amber-950/40 via-[#261712] to-amber-950/40 border border-amber-500/50 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md animate-fade-in">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg shrink-0">
                      🎁
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="text-xs font-black text-amber-200">
                          [자사몰 단독 선물] 미니 쫀득볼 {orderType === 'takeout' ? '5개' : '10개'}
                        </h5>
                        <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded-full">
                          무료 증정
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {orderType === 'takeout' ? '방문 포장 고객 감사 무료 덤 5개' : '배달 주문 고객 감사 무료 덤 10개'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-400">0원 (덤)</span>
                  </div>
                </div>

              </div>

              {/* 금액 정산 요약표 */}
              <div className="border-t border-[#2d1f1b] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>주문 금액 합계</span>
                  <span className="text-slate-200 font-bold">{getSubtotal().toLocaleString()}원</span>
                </div>

                {orderType === 'takeout' && (
                  <div className="flex justify-between text-emerald-450 font-bold">
                    <span>
                      🎁 방문 포장 할인
                      {getTakeoutDiscountEligibleCount() > 0 ? (
                        <span className="text-[10px] text-emerald-300 ml-1 font-normal">
                          (-2,000원 × {getTakeoutDiscountEligibleCount()}마리)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 ml-1 font-normal">
                          (윙봉/콤보/단품/사이드 제외)
                        </span>
                      )}
                    </span>
                    <span>-{getDiscount().toLocaleString()}원</span>
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-blue-400 font-bold">
                    <span>🛵 배달 요금</span>
                    <span>+3,000원</span>
                  </div>
                )}

                {usedPoints > 0 && (
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>💰 포인트 사용 차감</span>
                    <span>-{usedPoints.toLocaleString()}원</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-[#3d2c27] pt-2.5 text-sm font-black">
                  <span className="text-white">최종 결제 예정 금액</span>
                  <span className="text-[#f39c12] text-base">
                    {getTotalPrice().toLocaleString()}원
                  </span>
                </div>

                {/* 포인트 적립 안내 카드 */}
                <div className="bg-[#140b09] border border-amber-500/30 rounded-xl p-2.5 mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-200">
                    <span className="text-sm">🪙</span>
                    <span>적립 예정 포인트</span>
                  </div>
                  <span className="font-mono font-black text-amber-400 text-sm">
                    +{getRewardPoints().toLocaleString()} P
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 pl-1 leading-snug">
                  * 뼈/순살/콤보/윙봉/순살세트 배달 1,500P 적립 (포장 뼈/순살 500P, 순살세트 1,000P, 콤보/윙봉 1,500P / 단품·사이드 제외)
                </p>

                {/* 포인트 사용 UI (2,000P 이상 시 사용 가능, 1회 최대 5,000P) */}
                <div className="bg-[#180e0b] border border-amber-600/40 rounded-xl p-3 mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                      <span>💰 포인트 사용</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        (보유: <strong className="text-amber-400 font-mono">{userAvailablePoints.toLocaleString()}P</strong>)
                      </span>
                    </div>
                    {usedPoints > 0 && (
                      <span className="text-xs font-mono font-black text-rose-400">
                        -{usedPoints.toLocaleString()} P 적용
                      </span>
                    )}
                  </div>

                  {userAvailablePoints < 2000 ? (
                    <div className="text-[10px] text-slate-500 bg-[#120907] p-2 rounded-lg border border-[#2d1b15]">
                      ℹ️ 포인트는 <strong>2,000P 이상</strong> 보유 시 1회 최대 5,000P까지 현금처럼 사용 가능합니다.
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step={1000}
                          min={2000}
                          max={Math.min(5000, userAvailablePoints, getSubtotal() - getDiscount() + getDeliveryFee())}
                          value={usedPoints || ''}
                          placeholder="사용할 포인트 (1,000P 단위)"
                          onChange={(e) => {
                            const val = parseInt(e.target.value || '0', 10);
                            const maxAllowed = Math.min(5000, userAvailablePoints, getSubtotal() - getDiscount() + getDeliveryFee());
                            if (val > maxAllowed) {
                              setUsedPoints(Math.floor(maxAllowed / 1000) * 1000);
                            } else {
                              setUsedPoints(Math.max(0, Math.floor(val / 1000) * 1000));
                            }
                          }}
                          className="flex-1 bg-[#120907] border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                        {usedPoints > 0 && (
                          <button
                            type="button"
                            onClick={() => setUsedPoints(0)}
                            className="text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800 px-2 py-1.5 rounded-lg"
                          >
                            취소
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[2000, 3000, 5000].map(amt => {
                          const maxLimit = Math.min(5000, userAvailablePoints, getSubtotal() - getDiscount() + getDeliveryFee());
                          const isPossible = amt <= maxLimit;
                          return (
                            <button
                              key={amt}
                              type="button"
                              disabled={!isPossible}
                              onClick={() => setUsedPoints(amt)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                                usedPoints === amt
                                  ? 'bg-amber-500 text-black border-amber-400 font-black'
                                  : isPossible
                                  ? 'bg-[#251511] text-amber-200 border-amber-500/30 hover:border-amber-400'
                                  : 'bg-[#150d0a] text-slate-600 border-slate-800 cursor-not-allowed'
                              }`}
                            >
                              {amt.toLocaleString()}P 사용
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 매장 쿠폰 및 미니쫀득볼 사장님 공지 카드 */}
                <div className="bg-[#120907] border border-amber-500/30 rounded-xl p-2.5 mt-2 space-y-1 text-[10px] text-slate-300">
                  <div className="text-amber-300 font-bold flex items-center gap-1">
                    <span>📢 사장님 공식 안내</span>
                  </div>
                  <p className="text-amber-200 font-bold">• ※ 자사몰에서는 매장 쿠폰이 지급되지 않습니다.</p>
                  <p className="text-slate-400 pl-2 leading-tight">
                    (자사몰 주문은 모바일 포인트가 즉시 자동 적립되므로 종이 쿠폰은 중복 지급되지 않습니다)
                  </p>
                  <p className="text-slate-300 pt-0.5">• 🍡 미니쫀득볼 덤은 매월 최대 5회까지 무료 제공됩니다.</p>
                </div>
              </div>
            </div>

            {/* Payment & Options */}
            <div className="space-y-4 bg-[#1c1310] border border-[#3d2c27] p-4 rounded-2xl">
              <h4 className="text-xs font-black text-[#f39c12] tracking-wider uppercase">결제 및 요청사항</h4>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block">결제 수단</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: 'store_payment', label: '💳 카드/매장결제' },
                      { val: 'pay_on_delivery', label: '💵 만나서 현금결제' },
                      { val: 'bank_transfer', label: '🏦 신한은행 계좌이체' },
                      { val: 'ask', label: '📞 기타 문의' }
                    ].map(pay => (
                      <label 
                        key={pay.val}
                        className={`border rounded-xl p-2.5 flex items-center justify-center cursor-pointer transition-colors text-[10px] font-bold ${
                          paymentMethod === pay.val 
                            ? 'bg-[#f39c12]/10 border-[#f39c12] text-[#f39c12]' 
                            : 'border-[#3d2c27] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pay.val}
                          checked={paymentMethod === pay.val}
                          onChange={() => setPaymentMethod(pay.val)}
                          className="sr-only"
                        />
                        {pay.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 신한은행 계좌이체 정보 안내 카드 */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="bg-[#140c0a] border-2 border-[#f39c12]/60 rounded-2xl p-3.5 space-y-3 animate-fade-in shadow-lg">
                    <div className="flex items-center justify-between border-b border-[#2d1d19] pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black">
                          🏦
                        </span>
                        <span className="text-xs font-black text-white">신한은행 계좌이체 안내</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-extrabold">
                        원터치 복사 지원
                      </span>
                    </div>

                    <div className="bg-[#0e0705] border border-[#3d2720] rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">입금 은행</span>
                        <span className="text-white font-black flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                          신한은행
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">계좌번호</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-[#f39c12] text-sm tracking-wider">
                            110-189-261588
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText('110189261588');
                                alert('📋 신한은행 계좌번호(110-189-261588)가 복사되었습니다!\n은행 앱에 붙여넣기 하여 바로 송금해 주시면 됩니다. 😊');
                              } else {
                                alert('계좌번호: 신한은행 110-189-261588 (예금주: 박종숙)');
                              }
                            }}
                            className="text-[10px] font-extrabold bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] px-2 py-1 rounded-lg transition-all shadow active:scale-95 flex items-center gap-1"
                          >
                            <span>복사 📋</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">예금주</span>
                        <strong className="text-white font-black">박종숙 (60계치킨 영월점)</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-[#261510] pt-2">
                        <span className="text-slate-400 font-semibold">입금하실 금액</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-emerald-400 font-black text-sm">
                            {getTotalPrice().toLocaleString()}원
                          </strong>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(String(getTotalPrice()));
                                alert(`📋 입금 금액(${getTotalPrice().toLocaleString()}원)이 복사되었습니다!`);
                              }
                            }}
                            className="text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded transition-all"
                          >
                            금액 복사
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      💡 <strong>입금자명</strong>이 주문자명과 다를 경우 아래 요청사항에 기재해 주시면 신속하게 조리가 시작됩니다.
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">가게 사장님께 요청사항</label>
                  <textarea
                    rows={2}
                    placeholder="예: 덜 맵게 해주세요, 치킨무 많이 주세요"
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    className="w-full p-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors resize-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {["치킨무 빼주세요 ❌", "벨 누르지 말아주세요 🤫", "소스 많이 챙겨주세요 🧂"].map((chip, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setRequestText(prev => prev ? `${prev}, ${chip.slice(0,-2)}` : chip.slice(0,-2))}
                        className="text-[8px] font-extrabold bg-[#2a1b16] border border-[#442c23] text-slate-450 px-2 py-1 rounded-md hover:bg-[#3d2720] transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 주류 포함 시 만 19세 성인 인증 의무 동의 체크박스 */}
            {cart.some(item => isAlcoholItem(item.menu.name)) && (
              <div className="bg-rose-950/70 border-2 border-rose-500/80 rounded-2xl p-4 space-y-2.5 text-left shadow-lg">
                <div className="flex items-center gap-2 text-rose-300 font-extrabold text-xs">
                  <Wine className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>[만 19세 미만 주류 구매 불가] 성인 인증 확인 의무</span>
                </div>
                <p className="text-[11px] text-rose-200/90 leading-relaxed">
                  청소년보호법 제28조에 의거하여 미성년자에게는 주류 판매가 엄격히 금지됩니다. 
                  상품 수령(방문 포장 및 배달) 시 <strong>주민등록증, 운전면허증, 모바일 신분증</strong> 등 실물 신분증을 반드시 대면 확인합니다.
                </p>
                <label className="flex items-center gap-2.5 text-xs font-black text-rose-200 cursor-pointer pt-1 bg-rose-900/50 p-2.5 rounded-xl border border-rose-400">
                  <input
                    type="checkbox"
                    checked={alcoholAgeConfirmed}
                    onChange={(e) => setAlcoholAgeConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
                  />
                  <span>[필수] 본인은 만 19세 이상 성인이며, 상품 수령 시 실물 신분증을 제시하겠습니다.</span>
                </label>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 h-12 bg-slate-900 border border-[#3d2c27] text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
              >
                메뉴 추가하기
              </button>
              <button
                type="submit"
                className="flex-[2] h-12 bg-[#f39c12] hover:bg-[#f39c12]/95 text-[#1a1210] font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#f39c12]/20 transition-all transform active:scale-95"
              >
                <span>{getTotalPrice().toLocaleString()}원 주문 요청하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: ORDER TRACKING SIMULATOR */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in text-center py-4">

            {/* 복수 주문 전환 탭 바 (동일 고객 다중 주문 완벽 지원) */}
            {myOrders.length > 1 && (
              <div className="bg-[#18100e] border-2 border-[#f39c12]/60 rounded-2xl p-3 max-w-sm mx-auto shadow-2xl space-y-2 text-left animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#2d1f1b] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">📋</span>
                    <span className="text-xs font-black text-white">내가 주문한 내역 (총 {myOrders.length}건)</span>
                  </div>
                  <span className="text-[10px] text-[#f39c12] font-black bg-[#f39c12]/15 px-2 py-0.5 rounded-full border border-[#f39c12]/30">
                    탭하여 이전 주문 전환
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {myOrders.map((ord, idx) => {
                    const isSelected = ord.id === (currentOrderId || currentOrderState?.id);
                    return (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => {
                          setCurrentOrderId(ord.id);
                          setCurrentOrderState(ord);
                          if (ord.status === 'cancelled') setTrackStep(-1);
                          else if (ord.status === 'cooking') setTrackStep(3);
                          else if (ord.status === 'done') setTrackStep(4);
                          else if (ord.status === 'accepted') setTrackStep(2);
                          else setTrackStep(1);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-[#f39c12] text-[#1a1210] border-[#f39c12] font-black shadow-lg scale-[1.02]'
                            : 'bg-[#0d0705] text-slate-300 border-[#3d2720] hover:border-[#f39c12]/50 font-bold'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className={isSelected ? 'text-[#1a1210] font-black' : 'text-[#f39c12]'}>
                            {idx === 0 ? '최신 주문' : `이전 주문 #${myOrders.length - idx}`}
                          </span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${
                            isSelected 
                              ? 'bg-[#1a1210] text-white' 
                              : (ord.status === 'cooking' ? 'bg-orange-500/20 text-orange-400' : ord.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : ord.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300')
                          }`}>
                            {ord.status === 'cooking' ? '조리중' : ord.status === 'done' ? '완료' : ord.status === 'cancelled' ? '취소' : '대기중'}
                          </span>
                        </div>
                        <div className="text-xs truncate font-bold">
                          {ord.items?.[0]?.name} {ord.items?.length > 1 ? `외 ${ord.items.length - 1}건` : ''}
                        </div>
                        <div className={`text-[10px] mt-1 flex justify-between items-center ${isSelected ? 'text-[#1a1210]/80 font-bold' : 'text-slate-400'}`}>
                          <span>{ord.total?.toLocaleString()}원</span>
                          <span className="font-mono text-[9px]">{ord.targetPickupTime || ord.timestamp}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* CANCELLATION STATE VIEW */}
            {currentOrderState?.status === 'cancelled' || trackStep === -1 ? (
              <div className="space-y-6 animate-fade-in text-center py-4">
                <div className="bg-red-950/40 border-2 border-red-500/70 rounded-3xl p-6 text-center space-y-4 shadow-2xl shadow-red-950/60 max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto text-3xl">
                    🚫
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black text-red-300 bg-red-900/60 px-3 py-1 rounded-full border border-red-600 inline-block">
                      주문 접수 취소 / 거절
                    </span>
                    <h2 className="text-base font-black text-white pt-1">
                      매장 사정으로 주문이 접수되지 못했습니다
                    </h2>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      이용에 큰 불편을 드려 진심으로 사과드립니다.<br />
                      결제는 청구되지 않았으며, 안전하게 취소되었습니다.
                    </p>
                  </div>

                  {/* 사장님 안내 사유 박스 */}
                  <div className="bg-[#140b09] border border-red-500/40 rounded-2xl p-4 text-left space-y-1.5">
                    <div className="text-[11px] font-extrabold text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>사장님의 정중한 취소 사유 안내</span>
                    </div>
                    <p className="text-sm font-black text-white pl-3 border-l-2 border-red-500 py-0.5 leading-snug">
                      {currentOrderState?.cancelReason || '🍗 재료 소진 / 품절: 주문하신 메뉴의 재료가 모두 소진되어 부득이하게 취소되었습니다.'}
                    </p>
                  </div>

                  {/* Direct Contact & Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <a
                      href="tel:033-374-6660"
                      className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      <span>매장 직통 전화 문의하기 (033-374-6660)</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => resetAndClearOrder(currentOrderState?.id || currentOrderId)}
                      className="w-full h-11 bg-[#1f1715] hover:bg-[#2b1f1c] border border-[#442c23] text-slate-200 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>🍗 취소 확인 및 영수증 영구 정리 (새로고침 방어)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#f39c12]/5 border border-[#f39c12]/20 animate-ping" />
                  <div className="absolute w-24 h-24 rounded-full bg-[#f39c12]/10 flex items-center justify-center border border-[#f39c12]/30">
                    <ShoppingBag className="w-10 h-10 text-[#f39c12] animate-bounce" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-black text-white">주문이 성공적으로 접수되었습니다!</h2>
                  
                  <div className="py-1">
                    {currentOrderState?.status === 'cooking' ? (
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 py-1.5 px-4 rounded-full inline-block">
                        👍 사장님 접수 완료! 🔥 조리 진행 중 [{currentOrderState.targetPickupTime || '18:10'} 픽업/완료 예정]
                      </span>
                    ) : currentOrderState?.status === 'done' ? (
                      <span className="text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/30 py-1.5 px-4 rounded-full inline-block">
                        🛍️ 조리 완료! [{currentOrderState.targetPickupTime || '18:10'} 방문 가능]
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#f39c12] font-semibold bg-[#f39c12]/10 border border-[#f39c12]/25 py-1 px-3 rounded-full inline-block animate-pulse">
                        ⏳ 사장님 주문 승인 대기 상태
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    {currentOrderState?.status === 'cooking' 
                      ? `사장님이 주문을 확인했습니다! ${currentOrderState.targetPickupTime || '18:10'}분까지 따뜻하게 조리하여 준비해 두겠습니다.`
                      : '60계치킨 강원영월점 주방으로 고객님의 주문서가 전송되었습니다. 사장님의 접수 승인을 잠시만 기다려 주세요!'}
                  </p>
                </div>

                {/* Step Timeline */}
                <div className="bg-[#1c1310] border border-[#3d2c27] p-5 rounded-2xl text-left space-y-4 max-w-sm mx-auto">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">실시간 접수 현황</h4>
                  
                  <div className="space-y-4 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#3d2c27]">
                    
                    {/* Step 1 */}
                    <div className="flex items-start gap-3 relative">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black z-10 -ml-5 ${
                        trackStep >= 1 ? 'bg-[#f39c12] text-[#1a1210]' : 'bg-[#3d2c27] text-slate-500'
                      }`}>
                        {trackStep > 1 ? <Check className="w-2.5 h-2.5" /> : "1"}
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${trackStep >= 1 ? 'text-white' : 'text-slate-500'}`}>주문 요청 접수</h5>
                        <p className="text-[9px] text-slate-550">가게로 주문이 접수되었습니다.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 relative">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black z-10 -ml-5 ${
                        trackStep >= 2 ? 'bg-[#f39c12] text-[#1a1210]' : 'bg-[#3d2c27] text-slate-500'
                      }`}>
                        {trackStep > 2 ? <Check className="w-2.5 h-2.5" /> : "2"}
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${trackStep >= 2 ? 'text-white' : 'text-slate-500'}`}>
                          {trackStep >= 2 ? '👍 주문 승인 완료' : '사장님 주문 검토'}
                        </h5>
                        <p className="text-[9px] text-slate-550">매장 접수 완료 및 예정 시간 확정</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3 relative">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black z-10 -ml-5 ${
                        trackStep >= 3 ? 'bg-[#f39c12] text-[#1a1210]' : 'bg-[#3d2c27] text-slate-500'
                      }`}>
                        {trackStep > 3 ? <Check className="w-2.5 h-2.5" /> : "3"}
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${trackStep >= 3 ? 'text-[#f39c12]' : 'text-slate-500'}`}>
                          {trackStep >= 3 ? '🔥 맛있게 치킨 조리 중!' : '주방 조리 대기'}
                        </h5>
                        <p className="text-[9px] text-slate-550">60계 깨끗한 새 기름으로 튀기는 중</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3 relative">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black z-10 -ml-5 ${
                        trackStep >= 4 ? 'bg-emerald-500 text-white' : 'bg-[#3d2c27] text-slate-500'
                      }`}>
                        {trackStep > 4 ? <Check className="w-2.5 h-2.5" /> : "4"}
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${trackStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {orderType === 'takeout' ? '🛍️ 포장 준비 완료!' : '🛵 배달 출발!'}
                        </h5>
                        <p className="text-[9px] text-slate-550">따뜻하게 튀겨내어 대기 완료되었습니다.</p>
                      </div>
                    </div>

                  </div>
                </div>
              </>
            )}

            {/* 계좌이체 주문인 경우 영수증 상단 입금 계좌 바로가기 카드 */}
            {(currentOrderState?.paymentMethod === 'bank_transfer' || paymentMethod === 'bank_transfer') && (
              <div className="bg-gradient-to-r from-[#1f1511] via-[#2c1d18] to-[#1a110e] border-2 border-[#f39c12] rounded-2xl p-4 text-left space-y-2.5 max-w-sm mx-auto shadow-xl">
                <div className="flex items-center justify-between border-b border-[#3d2720] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🏦</span>
                    <h4 className="text-xs font-black text-[#f39c12]">신한은행 계좌이체 입금 안내</h4>
                  </div>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    입금 대기 중
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">입금 계좌:</span>
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span className="font-mono text-[#f39c12]">신한 110-189-261588</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText('110189261588');
                            alert('📋 신한은행 110-189-261588 계좌번호가 복사되었습니다!');
                          }
                        }}
                        className="text-[9px] bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] font-black px-1.5 py-0.5 rounded shadow active:scale-95"
                      >
                        복사 📋
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">예금주:</span>
                    <strong className="text-white">박종숙 (60계치킨 영월점)</strong>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#261510] pt-1">
                    <span className="text-slate-400 font-semibold">입금하실 금액:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-emerald-400 font-black text-sm">
                        {(currentOrderState?.total || getTotalPrice()).toLocaleString()}원
                      </strong>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(String(currentOrderState?.total || getTotalPrice()));
                            alert(`📋 입금 금액(${(currentOrderState?.total || getTotalPrice()).toLocaleString()}원)이 복사되었습니다!`);
                          }
                        }}
                        className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1 py-0.5 rounded"
                      >
                        복사
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 border-t border-[#2d1f1b] pt-1.5">
                  👉 입금이 확인되면 사장님이 바로 치킨 조리를 시작합니다.
                </p>
              </div>
            )}

            {/* 내가 주문한 상세 내역서 (영수증 카드) */}
            <div className="bg-[#1c1310] border border-[#f39c12]/30 p-5 rounded-2xl text-left space-y-4 max-w-sm mx-auto shadow-xl">
              <div className="flex items-center justify-between border-b border-[#3d2c27] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#f39c12] text-sm font-black">🧾 주문 내역서</span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-[#f39c12]/15 text-[#f39c12] border border-[#f39c12]/30">
                    {orderType === 'takeout' ? '방문 포장' : '안전 배달'}
                  </span>
                  {(currentOrderState?.status === 'cancelled' || recentOrder?.status === 'cancelled') && (
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">
                      취소됨
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500 font-mono">
                    {currentOrderId ? `#${currentOrderId.slice(-6)}` : ''}
                  </span>
                  {(currentOrderState?.status === 'cancelled' || recentOrder?.status === 'cancelled') && (
                    <button
                      type="button"
                      onClick={() => resetAndClearOrder(currentOrderState?.id || currentOrderId)}
                      className="text-[9px] text-red-300 hover:text-white bg-red-950/80 hover:bg-red-900 border border-red-700 px-2 py-1 rounded-md transition-colors font-bold"
                    >
                      영수증 지우기 ✕
                    </button>
                  )}
                </div>
              </div>

              {/* 주문 품목 리스트 */}
              <div className="space-y-2.5">
                {(currentOrderState?.items || cart).map((item: any, idx: number) => {
                  const isFreeGift = item.price === 0 || item.name?.includes('선물') || item.name?.includes('서비스');
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start justify-between text-xs p-2 rounded-xl transition-all ${
                        isFreeGift 
                          ? 'bg-amber-950/25 border border-amber-500/40 shadow-sm' 
                          : 'bg-[#140b09]/50 border border-transparent'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                          <span className={isFreeGift ? 'text-amber-200' : 'text-white'}>{item.name}</span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                            isFreeGift 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-black' 
                              : 'bg-[#2a1b16] text-[#f39c12] border-[#442c23]'
                          }`}>
                            {item.type || '기본'}
                          </span>
                        </div>
                        {item.customDetails && (
                          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{item.customDetails}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-slate-400 font-medium">{item.quantity}개</span>
                        <span className={`font-bold ml-2 ${isFreeGift ? 'text-emerald-400 font-black' : 'text-white'}`}>
                          {isFreeGift ? '무료 (덤)' : `${((item.price || item.selectedPrice || 0) * item.quantity).toLocaleString()}원`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 금액 정산 표 */}
              <div className="border-t border-[#2d1f1b] pt-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>주문 금액</span>
                  <span>{(currentOrderState?.subtotal || getSubtotal()).toLocaleString()}원</span>
                </div>
                {orderType === 'takeout' && (
                  <div className="flex justify-between text-emerald-450 font-bold">
                    <span>
                      🎁 방문 포장 할인
                      {(currentOrderState?.discount !== undefined ? currentOrderState.discount : getDiscount()) > 0 ? (
                        <span className="text-[10px] text-emerald-300 ml-1 font-normal">
                          (-2,000원 × {getTakeoutDiscountEligibleCount()}마리)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 ml-1 font-normal">
                          (윙봉/콤보/단품/사이드 제외)
                        </span>
                      )}
                    </span>
                    <span>-{(currentOrderState?.discount !== undefined ? currentOrderState.discount : getDiscount()).toLocaleString()}원</span>
                  </div>
                )}
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-blue-400 font-bold">
                    <span>🛵 배달 요금</span>
                    <span>+{(currentOrderState?.deliveryFee || getDeliveryFee()).toLocaleString()}원</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-[#3d2c27] pt-2 text-sm font-black">
                  <span className="text-white">최종 결제 금액</span>
                  <span className="text-[#f39c12] text-base">
                    {(currentOrderState?.total || getTotalPrice()).toLocaleString()}원
                  </span>
                </div>

                {/* 포인트 적립 결과 표시 */}
                <div className="flex justify-between items-center bg-[#15100e] border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200 font-bold mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">🪙</span>
                    <span>이번 주문 적립 포인트</span>
                  </span>
                  <span className="font-mono font-black text-amber-400 text-xs">
                    +{(currentOrderState?.rewardPoints !== undefined ? currentOrderState.rewardPoints : getRewardPoints()).toLocaleString()} P
                  </span>
                </div>
              </div>

              {/* 주문자 & 픽업 정보 */}
              <div className="border-t border-[#2d1f1b] pt-3 space-y-1 text-[10px] text-slate-400">
                <div>• 주문자: <strong className="text-slate-200">{name || currentOrderState?.name}</strong> ({phone || currentOrderState?.phone})</div>
                {orderType === 'takeout' ? (
                  <div>• 포장 픽업 예정: <strong className="text-[#f39c12]">{currentOrderState?.targetPickupTime || pickupTime}</strong></div>
                ) : (
                  <div>• 배달 주소: <strong className="text-slate-200">{address || currentOrderState?.address}</strong></div>
                )}
                {(requestText || currentOrderState?.requestText) && (
                  <div>• 요청사항: <span className="text-slate-200">"{requestText || currentOrderState?.requestText}"</span></div>
                )}
              </div>

              {/* 매장 전화 바로걸기 */}
              <a 
                href="tel:033-374-6660" 
                className="w-full h-9 bg-[#2a1b16] hover:bg-[#3d2720] border border-[#442c23] text-slate-300 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#f39c12]" />
                <span>주문 문의 / 변경 전화하기 (033-374-6660)</span>
              </a>
            </div>

            {/* [방어선 1] 사장님이 이미 조리 시작(cooking) 또는 완료(done)한 경우 */}
            {(currentOrderState?.status === 'cooking' || currentOrderState?.status === 'done') && (
              <div className="pt-1 max-w-sm mx-auto space-y-1.5 animate-fade-in">
                <div className="bg-orange-950/40 border border-orange-500/50 rounded-2xl p-3.5 text-left space-y-1 shadow-lg">
                  <div className="flex items-center gap-1.5 text-xs font-black text-orange-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>🔥 치킨 조리 진행 중 (앱 직접 취소 마감)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    주방에서 깨끗한 새 기름으로 치킨을 이미 튀기는 중이므로 앱 직접 취소가 마감되었습니다. 급한 일정 변경이나 취소 문의는 매장 직통 전화(033-374-6660)로 직접 문의해 주시기 바랍니다.
                  </p>
                </div>
              </div>
            )}

            {/* [방어선 2] 조리 시작 전(pending)이지만, 남은 시간이 20분 이내로 진입한 경우 */}
            {currentOrderState?.status === 'pending' && getRemainingMinutes() <= 20 && (
              <div className="pt-1 max-w-sm mx-auto space-y-1.5 animate-fade-in">
                <div className="bg-amber-950/40 border border-amber-500/60 rounded-2xl p-3.5 text-left space-y-1.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                      <Clock className="w-4 h-4" />
                      <span>조리 준비 골든타임 진입 (남은 시간 20분 이내)</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                      남은 시간 {getRemainingMinutes()}분
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    조리 완료 20분 전부터는 식재료 반죽 및 튀김 준비에 들어가므로 앱 직접 취소가 마감되었습니다. 부득이한 취소나 요청은 매장(033-374-6660)으로 직접 전화 주세요.
                  </p>
                </div>
              </div>
            )}

            {/* [방어선 3] 조리 시작 전(pending)이고 남은 시간이 20분 초과인 경우 (즉시 직접 취소 가능) */}
            {currentOrderState?.status === 'pending' && getRemainingMinutes() > 20 && (
              <div className="pt-1 max-w-sm mx-auto space-y-1.5 animate-fade-in">
                <button
                  type="button"
                  onClick={() => setShowCustomerCancelModal(true)}
                  className="w-full h-11 bg-red-950/40 hover:bg-red-900/60 border border-red-700/70 text-red-300 hover:text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <X className="w-4 h-4" />
                  <span>주문 취소하기 (조리 전 즉시 취소)</span>
                </button>
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>*조리 시작 전 및 남은 시간 20분 전까지만 즉시 취소 가능</span>
                  <span className="text-amber-400 font-bold">취소 가능 잔여: 약 {getRemainingMinutes() - 20}분</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => resetAndClearOrder(currentOrderState?.id || currentOrderId)}
                className="h-11 px-6 bg-slate-900 border border-[#3d2c27] hover:bg-slate-800 text-slate-350 hover:text-white font-bold rounded-xl text-xs transition-colors"
              >
                신규 주문으로 돌아가기 (영수증 정리)
              </button>
            </div>

          </div>
        )}

      </div>

      {/* FLOAT BOTTOM SLIDING CART SHEET */}
      {currentStep === 1 && cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#3d2c27] bg-[#1a1210] shadow-2xl animate-fade-in">
          <div className="max-w-md mx-auto px-4 py-3">
            
            <div 
              onClick={() => setShowCartSheet(!showCartSheet)}
              className="flex justify-between items-center cursor-pointer py-1.5"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-[#f39c12]" />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#f39c12] text-[#1a1210] text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#1a1210]">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <span className="text-xs font-bold text-white">담은 치킨 내역</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#f39c12]">총 {getTotalPrice().toLocaleString()}원</span>
                <span className="text-[10px] text-slate-400 font-semibold">{showCartSheet ? '접기 ▲' : '자세히 보기 ▼'}</span>
              </div>
            </div>

            <AnimatePresence>
              {showCartSheet && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-[#261915] mt-3 pt-3 space-y-4 max-h-60 overflow-y-auto"
                >
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center animate-fade-in">
                        <div className="flex-1 min-w-0 pr-2">
                          <h5 className="text-xs font-extrabold text-white truncate">
                            {item.menu.name} <span className="text-[#f39c12] text-[9px] bg-[#f39c12]/10 px-1 rounded ml-1">{item.selectedType}</span>
                          </h5>
                          {item.customDetails && (
                            <p className="text-[9px] text-slate-400 mt-0.5 leading-snug truncate">{item.customDetails}</p>
                          )}
                          <span className="text-[10px] text-slate-500 font-semibold">{item.selectedPrice.toLocaleString()}원</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center bg-[#0d0908] border border-[#3d2c27] rounded-lg h-7 px-1">
                            <button 
                              onClick={() => updateCartQty(item.menu.id, item.selectedType, -1, item.customDetails)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 rounded-md"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQty(item.menu.id, item.selectedType, 1, item.customDetails)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 rounded-md"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.menu.id, item.selectedType, item.customDetails)}
                            className="text-slate-550 hover:text-red-450 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#261915] pt-3 text-[10px] font-bold text-slate-400 space-y-1.5">
                    <div className="flex justify-between">
                      <span>선택 메뉴 합계</span>
                      <span className="text-slate-200">{getSubtotal().toLocaleString()}원</span>
                    </div>
                    {getDiscount() > 0 ? (
                      <div className="flex justify-between text-emerald-400">
                        <span>포장 할인 (-2,000원 × {getTakeoutDiscountEligibleCount()}마리)</span>
                        <span>-{getDiscount().toLocaleString()}원</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-slate-500">
                        <span>포장 할인 (윙봉/콤보/단품/사이드 제외)</span>
                        <span>0원</span>
                      </div>
                    )}
                    <div className="flex justify-between text-amber-300">
                      <span>🎁 [자사몰 선물] 미니 쫀득볼 5개 (월 5회 한정)</span>
                      <span className="text-emerald-400 font-black">무료 증정</span>
                    </div>
                    <div className="flex justify-between text-amber-400/90 pt-0.5">
                      <span>🪙 적립 예정 포인트</span>
                      <span className="font-mono">+{getRewardPoints().toLocaleString()}P</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-3">
              <button
                onClick={() => {
                  setShowCartSheet(false);
                  setCurrentStep(2);
                }}
                className="w-full h-11 bg-[#f39c12] hover:bg-[#f39c12]/95 text-[#1a1210] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>주문서 작성하러 가기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 사장님 공식 공지문 팝업 모달 (대표님 확정안 100% 반영) */}
      <AnimatePresence>
        {showNoticeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c1310] border-2 border-amber-500/70 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-7 h-7 rounded-full bg-[#261713] flex items-center justify-center transition-colors"
              >
                ×
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 inline-block">
                  CEO NOTICE
                </span>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>📢 60계치킨 영월점 자사몰 안내</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-200 leading-relaxed">
                <p className="text-amber-200/90 font-medium bg-[#140b08] p-2.5 rounded-xl border border-amber-500/20">
                  항상 저희 60계치킨 강원영월점을 찾아주시는 고객님께 감사드립니다! 배달앱보다 더 큰 실질적인 혜택을 돌려드리고자 아래와 같이 운영합니다.
                </p>

                <div className="bg-[#140b08] p-3 rounded-xl border border-[#3d2720] space-y-1.5">
                  <h5 className="font-black text-amber-400 text-xs">
                    1. 🎁 포장 주문 혜택
                  </h5>
                  <p className="text-[11px] text-slate-300 pl-1 leading-normal">
                    • <strong>2,000원 즉시 할인 + 500P 적립</strong> (뼈, 순살 한정 - 반반 포함)<br/>
                    • 콤보, 윙봉, 단품, 순살세트 메뉴는 포장 할인 대상에서 제외됩니다. (순살세트 1,000P 적립, 콤보/윙봉 1,500P 적립)
                  </p>
                </div>

                <div className="bg-[#140b08] p-3 rounded-xl border border-[#3d2720] space-y-1.5">
                  <h5 className="font-black text-amber-400 text-xs">
                    2. 🚀 배달 주문 포인트 적립
                  </h5>
                  <p className="text-[11px] text-slate-300 pl-1 leading-normal">
                    • <strong>뼈 / 콤보, 윙봉 / 순살 / 순살세트</strong> : <strong>1,500P 적립</strong><br/>
                    • 단품(윙/봉/다리) 메뉴는 포인트 적립에서 제외됩니다.
                  </p>
                </div>

                <div className="bg-[#2a0e08] p-3 rounded-xl border border-rose-500/50 space-y-1">
                  <h5 className="font-black text-rose-300 text-xs">
                    3. 🎫 매장 쿠폰 관련 필수 안내
                  </h5>
                  <p className="text-[11px] text-rose-200 font-bold pl-1">
                    • ※ 자사몰에서는 매장 쿠폰이 지급되지 않습니다.
                  </p>
                  <p className="text-[10px] text-slate-400 pl-1">
                    (자사몰 주문은 모바일 포인트가 즉시 자동 적립되므로 종이 쿠폰은 중복 지급되지 않습니다)
                  </p>
                </div>

                <div className="bg-[#140b08] p-3 rounded-xl border border-[#3d2720] space-y-1">
                  <h5 className="font-black text-amber-400 text-xs">
                    4. 🍡 자사몰 단골 전용 '미니쫀득볼' 서비스
                  </h5>
                  <p className="text-[11px] text-slate-300 pl-1">
                    • 미니쫀득볼은 더 많은 단골분들께 골고루 혜택을 드리고자 <strong>[배달 / 포장 포함 매달 최대 5회까지만]</strong> 무료 제공됩니다.
                  </p>
                </div>

                <div className="bg-[#140b08] p-3 rounded-xl border border-[#3d2720] space-y-1">
                  <h5 className="font-black text-amber-400 text-xs">
                    5. 💰 포인트 사용 조건
                  </h5>
                  <p className="text-[11px] text-slate-300 pl-1">
                    • 적립된 포인트는 <strong>2,000P부터 (1회 최대 5,000P까지)</strong> 현금처럼 차감 사용 가능합니다.
                  </p>
                </div>

                <p className="text-[10px] text-center text-slate-400 pt-1">
                  매일 새 기름으로 60마리만 정직하게 조리하겠습니다. 감사합니다!<br/>
                  <strong className="text-amber-300">- 60계치킨 강원영월점 대표 올림 -</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] font-black text-xs shadow-lg transition-all active:scale-[0.98]"
              >
                확인했습니다 👍
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 내 맘대로 반반치킨 선택 모달 (대표님 공식 룰 100% 반영) */}
      <AnimatePresence>
        {showHalfModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c1310] border-2 border-[#f39c12]/60 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowHalfModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-7 h-7 rounded-full bg-[#261713] flex items-center justify-center"
              >
                ×
              </button>
              
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold text-[#f39c12] bg-[#f39c12]/15 px-2 py-0.5 rounded-full border border-[#f39c12]/30 inline-block">
                  60계치킨 공식 반반 조합기
                </span>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>🔄 내 맘대로 반반치킨 만들기</span>
                </h3>
                <p className="text-[10px] text-slate-400 leading-snug">
                  ※ 쯔란, 크크크, 크랑이, 참지마라는 조리법상 일반 반반에 포함되지 않습니다.<br />
                  (크크크와 크랑이는 전용 메뉴인 <strong>'크크크 반 + 크랑이 반'</strong>을 이용해 주세요)
                </p>
              </div>

              {/* 1. 첫 번째 맛 선택 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-amber-400 block">
                  1. 첫 번째 맛 선택 (반 마리)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['후라이드', '양념', '간지', '고추', '호랑이', '하하핫', '푸하핫', '더매운고추'].map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setHalfFlavor1(f)}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all border text-center ${
                        halfFlavor1 === f
                          ? 'bg-[#f39c12] text-[#1a1210] border-[#f39c12] shadow'
                          : 'bg-[#140b09] text-slate-300 border-[#3d2c27] hover:border-slate-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. 두 번째 맛 선택 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-amber-400 block">
                  2. 두 번째 맛 선택 (반 마리)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['후라이드', '양념', '간지', '고추', '호랑이', '하하핫', '푸하핫', '더매운고추'].map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setHalfFlavor2(f)}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all border text-center ${
                        halfFlavor2 === f
                          ? 'bg-[#f39c12] text-[#1a1210] border-[#f39c12] shadow'
                          : 'bg-[#140b09] text-slate-300 border-[#3d2c27] hover:border-slate-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. 부위 선택 (타원형 알약 형태) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-sky-400 block">
                  3. 부위 선택
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { type: '뼈', diff: '+0원' },
                    { type: '순살', diff: '+1,000원' },
                    { type: '윙봉', diff: '+1,600원' },
                    { type: '콤보', diff: '+1,600원' }
                  ].map(p => (
                    <button
                      key={p.type}
                      type="button"
                      onClick={() => setHalfType(p.type)}
                      className={`py-1.5 px-1 rounded-full text-[10px] font-black transition-all border text-center ${
                        halfType === p.type
                          ? 'bg-[#f39c12]/20 border-[#f39c12] text-[#f39c12] shadow'
                          : 'bg-[#140b09] text-slate-300 border-[#3d2c27] hover:border-slate-600'
                      }`}
                    >
                      {p.type} ({p.diff})
                    </button>
                  ))}
                </div>
              </div>

              {/* 실시간 가격 안내 박스 */}
              <div className="bg-[#120806] border border-[#f39c12]/30 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">선택한 반반 조합</span>
                  <strong className="text-xs text-white font-extrabold">
                    {halfFlavor1} 반 + {halfFlavor2} 반 ({halfType})
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block">정상 판매가</span>
                  <strong className="text-base font-black text-[#f39c12]">
                    {calculateHalfPrice(halfFlavor1, halfFlavor2, halfType).toLocaleString()}원
                  </strong>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowHalfModal(false)}
                  className="flex-1 h-11 bg-slate-900 border border-[#3d2c27] text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAddHalfToCart}
                  className="flex-[2] h-11 bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg transition-transform active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{calculateHalfPrice(halfFlavor1, halfFlavor2, halfType).toLocaleString()}원에 담기</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM MENU INPUT DIALOG MODAL */}
      <AnimatePresence>
        {showCustomModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c1310] border border-[#3d2c27] rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white text-lg font-bold"
              >
                ×
              </button>
              
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#f39c12]" />
                  <span>기타 주문 직접 입력</span>
                </h3>
                <p className="text-[10px] text-slate-500 leading-snug">
                  메뉴판에 기재되지 않은 매장용 세부 메뉴나 사이드 메뉴를 직접 기입합니다.
                </p>
              </div>

              <form onSubmit={handleAddCustomMenu} className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 block uppercase">메뉴 이름 (필수)</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 쫀득 치즈볼 5개"
                    value={customMenuName}
                    onChange={(e) => setCustomMenuName(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase">예상 금액 (원)</label>
                    <input
                      type="number"
                      required
                      placeholder="5000"
                      value={customMenuPrice}
                      onChange={(e) => setCustomMenuPrice(e.target.value)}
                      className="w-full h-10 px-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase">수량</label>
                    <div className="flex items-center bg-[#0d0908] border border-[#3d2c27] rounded-xl h-10 px-1">
                      <button 
                        type="button"
                        onClick={() => setCustomMenuQty(q => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center text-xs font-bold text-white">{customMenuQty}</span>
                      <button 
                        type="button"
                        onClick={() => setCustomMenuQty(q => q + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 block uppercase">세부 요청 (선택)</label>
                  <input
                    type="text"
                    placeholder="예: 설탕 듬뿍 뿌려주세요"
                    value={customMenuDesc}
                    onChange={(e) => setCustomMenuDesc(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0d0908] border border-[#3d2c27] text-slate-100 rounded-xl text-xs focus:outline-none focus:border-[#f39c12] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#f39c12] hover:bg-[#f39c12]/90 text-[#1a1210] font-black rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>장바구니 담기</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOMER SELF CANCEL MODAL */}
      <AnimatePresence>
        {showCustomerCancelModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c1310] border-2 border-red-500/60 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setShowCustomerCancelModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white text-lg font-bold"
              >
                ×
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-800 inline-block">
                  주문 취소 신청
                </span>
                <h3 className="text-base font-black text-white">
                  주문을 정말로 취소하시겠습니까?
                </h3>
                <p className="text-xs text-slate-400">
                  아직 주방에서 치킨을 튀기기 전이므로 즉시 취소 처리됩니다.
                </p>
              </div>

              {/* Quick Reason Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-350 block">취소 사유 선택</label>
                {[
                  '메뉴 변경 또는 결제/픽업 시간 재설정',
                  '대기 시간 초과 / 급한 일정 발생',
                  '단순 변심 / 실수로 잘못 주문함',
                  'custom'
                ].map((reasonKey) => (
                  <button
                    key={reasonKey}
                    type="button"
                    onClick={() => setCustomerCancelReason(reasonKey)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all border ${
                      customerCancelReason === reasonKey
                        ? 'bg-red-950/60 border-red-500 text-white shadow-md'
                        : 'bg-[#140b09] border-[#3d2c27] text-slate-300 hover:border-red-900'
                    }`}
                  >
                    {reasonKey === 'custom' ? '✍️ 직접 사유 입력하기' : `• ${reasonKey}`}
                  </button>
                ))}

                {customerCancelReason === 'custom' && (
                  <input
                    type="text"
                    value={customerCancelCustom}
                    onChange={(e) => setCustomerCancelCustom(e.target.value)}
                    placeholder="취소 사유를 입력해 주세요."
                    className="w-full h-10 bg-[#140b09] border border-[#3d2c27] focus:border-red-500 rounded-xl px-3 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomerCancelModal(false)}
                  className="flex-1 h-11 bg-slate-900 border border-[#3d2c27] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  주문 유지하기
                </button>
                <button
                  type="button"
                  onClick={handleCustomerCancelOrder}
                  className="flex-1 h-11 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
                >
                  <X className="w-4 h-4" />
                  <span>주문 취소 확정</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🪙 내 포인트 조회 및 적립 내역 모달 */}
      <AnimatePresence>
        {myPointsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c1310] border-2 border-amber-500/70 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setMyPointsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#1a1210] bg-[#f39c12] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  60gye Points
                </span>
                <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                  <span>🪙 내 포인트 및 적립 내역</span>
                </h3>
                <p className="text-xs text-slate-400">
                  휴대전화 번호 기준으로 자사몰 포인트가 자동 누적됩니다.
                </p>
              </div>

              {/* 전화번호 입력/확인 */}
              <div className="space-y-1.5 bg-[#140b09] border border-[#3d2c27] p-3 rounded-2xl">
                <label className="text-[10px] font-bold text-slate-400 block">조회할 전화번호</label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={pointsQueryPhone}
                  onChange={(e) => setPointsQueryPhone(e.target.value)}
                  className="w-full h-9 bg-[#1c1310] border border-[#3d2c27] focus:border-[#f39c12] rounded-xl px-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* 포인트 조회 결과 */}
              {(() => {
                const qPhone = pointsQueryPhone.trim();
                const matchedOrders = myOrders.filter(o => 
                  o.status !== 'cancelled' && 
                  (qPhone ? o.phone === qPhone : true)
                );
                
                // 로컬스토리지 누적 포인트
                let totalPts = 0;
                if (typeof window !== 'undefined') {
                  try {
                    const savedPts = localStorage.getItem('youngwol_user_points');
                    if (savedPts) totalPts = parseInt(savedPts, 10) || 0;
                  } catch (e) {}
                }
                // 주문별 포인트 합산
                const orderPtsSum = matchedOrders.reduce((sum, o) => sum + (o.rewardPoints || Math.round(o.total * 0.02)), 0);
                const finalPts = Math.max(totalPts, orderPtsSum);

                return (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-amber-950/50 to-orange-950/40 border border-amber-500/50 rounded-2xl p-4 text-center space-y-1 shadow-inner">
                      <span className="text-[11px] text-amber-200 font-bold block">현재 사용 가능한 총 포인트</span>
                      <div className="text-3xl font-black text-[#f39c12] font-mono tracking-tight">
                        {finalPts.toLocaleString()} <span className="text-sm font-normal text-slate-300">P</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        (주문 결제 시 현금처럼 1,000P 단위로 사용 가능)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold px-1">
                        <span>최근 적립 내역</span>
                        <span>{matchedOrders.length}건</span>
                      </div>

                      <div className="max-h-40 overflow-y-auto space-y-1.5 divide-y divide-[#2d1d19] border border-[#3d2c27] rounded-xl p-2 bg-[#140b09] text-xs">
                        {matchedOrders.length === 0 ? (
                          <div className="text-center text-slate-500 text-[11px] py-4">
                            적립된 주문 내역이 없습니다.<br/>자사몰 주문 시 혜택별 포인트가 자동 적립됩니다!
                          </div>
                        ) : (
                          matchedOrders.map((o, idx) => (
                            <div key={idx} className="pt-1.5 first:pt-0 flex justify-between items-center text-[11px]">
                              <div>
                                <span className="text-white font-bold block">{o.name || '방문/배달 주문'}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{o.timestamp}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono text-amber-400 font-black">
                                  +{o.rewardPoints || Math.round(o.total * 0.02)}P
                                </span>
                                <span className="text-[9px] text-slate-400 block">({o.total.toLocaleString()}원)</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setMyPointsModalOpen(false)}
                  className="w-full h-11 bg-slate-900 border border-[#3d2c27] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  확인 (닫기)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
