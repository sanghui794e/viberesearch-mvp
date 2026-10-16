'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Phone, MapPin, Clock, ShieldCheck, Sparkles, 
  ChevronRight, ArrowLeft, Plus, Minus, Trash2, Send, Check, AlertCircle, RefreshCw
} from 'lucide-react';

interface MenuPrice {
  type: string;
  price: number;
}

interface Menu {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  tag?: string;
  spicy: number;
  prices: MenuPrice[];
  isCustom?: boolean;
}

interface CartItem {
  menu: Menu;
  selectedType: string;
  selectedPrice: number;
  quantity: number;
  customDetails?: string; // 직접 입력 메뉴의 세부사항
}

// 60계치킨 강원영월점 실제 홈페이지(youngwol-chicken.co.kr)의 업로드 이미지 파일명을 100% 매핑
const menuList: Menu[] = [
  {
    id: 'chamji_mara',
    name: '참지마라치킨',
    category: '치킨',
    description: '알싸하고 화끈한 마라 시즈닝에 고추와 대파를 송송 뿌려 마라 덕후들의 입맛을 사로잡는 마성의 마라 치킨',
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
    description: '크리스피! 크런치! 크림볼! 웃음이 절로 나는 바삭함 끝판왕 인기 메뉴 (크크크소스 3종 포함)',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165659_ecc44df3.png',
    tag: '인기',
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
    description: '바삭바삭한 크크크치킨과 고소하고 알싸매콤한 호랑이 시즈닝이 만난 신개념 중독성 치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611113738_a67b2cfe.png',
    tag: '인기',
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
    name: '크크크 + 크랑이 반반',
    category: '치킨',
    description: '★공식 반반 조합★ 고소바삭 크크크 반 + 매콤바삭 크랑이 반을 한 번에! (※ 두 메뉴는 서로하고만 반반 주문이 가능합니다)',
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
  {
    id: 'zuran',
    name: '쯔란콤보',
    category: '치킨',
    description: '쯔란 스파이스를 입혀 이국적이고 매콤 짭조름한 풍미가 콤보 전체에 진하게 퍼지는 별미 치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165635_7b6f044b.png',
    tag: 'NEW',
    spicy: 1,
    prices: [
      { type: '순살', price: 24900 },
      { type: '윙봉', price: 25500 },
      { type: '콤보', price: 25500 }
    ]
  },
  {
    id: 'horang',
    name: '호랑이치킨',
    category: '치킨',
    description: '알싸한 갈릭 파우더와 달콤바삭 콘후레이크가 버무려져 매콤달콤 마성의 단짠을 선사하는 치킨',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165804_e0c36557.png',
    tag: '인기',
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
    description: '특제 간장소스에 알싸하고 맵지 않은 청양고추가 송송 뿌려져 깔끔하고 매콤한 베스트셀러',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165451_aec718de.jpg',
    tag: '인기',
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
    description: '특제 간장소스와 누룽지의 조화, 고소하고 담백한 풍미가 가득해 아이들도 잘 먹는 60계 별미',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165421_50e38d25.jpg',
    tag: '단짠',
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
    description: '겉은 크리스피하고 속은 육즙 가득 부드럽고 담백하여 남녀노소 사랑받는 기본 후라이드',
    image: 'https://youngwol-chicken.co.kr/uploads/20260606165830_caee4102.jpg',
    tag: '',
    spicy: 0,
    prices: [
      { type: '뼈', price: 19900 },
      { type: '순살', price: 20900 },
      { type: '윙봉', price: 22500 },
      { type: '콤보', price: 22500 }
    ]
  },
  {
    id: 'wedge',
    name: '웨지감자',
    category: '사이드',
    description: '겉은 바삭하고 속은 촉촉한 리얼 포테이토 웨지 감자튀김',
    image: 'https://youngwol-chicken.co.kr/uploads/20260611115406_d9350ea5.png',
    tag: '',
    spicy: 0,
    prices: [{ type: '단품', price: 3000 }]
  }
];

export default function G60gyeDemoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'takeout' | 'delivery'>('takeout');
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Menu, 2: Checkout, 3: Tracking
  const [showCartSheet, setShowCartSheet] = useState<boolean>(false);

  // Active Type Selection per Menu ID
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});

  // Form Inputs
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('30분 뒤 방문');
  const [paymentMethod, setPaymentMethod] = useState<string>('store_payment');
  const [requestText, setRequestText] = useState<string>('');

  // Custom (Other) Menu Order States
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customMenuName, setCustomMenuName] = useState<string>('');
  const [customMenuPrice, setCustomMenuPrice] = useState<string>('5000'); // 기본 예치금 5000원
  const [customMenuQty, setCustomMenuQty] = useState<number>(1);
  const [customMenuDesc, setCustomMenuDesc] = useState<string>('');

  // AI Assistant States
  const [aiInput, setAiInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<{ text: string; recommendedSpecs: { id: string; type: string }[] } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Tracking Simulator States
  const [trackStep, setTrackStep] = useState<number>(1);

  // Initialize default menu type selections
  useEffect(() => {
    const defaults: Record<string, string> = {};
    menuList.forEach(menu => {
      defaults[menu.id] = menu.prices[0].type;
    });
    setSelectedTypes(defaults);
  }, []);

  const aiChips = [
    "화끈하게 매운 참지마라치킨 🌶️",
    "아이랑 같이 먹을 안 매운 순살 🧒",
    "맥주랑 먹기 딱 좋은 바삭알싸 콤보 🍺",
    "크크크치킨 반반 주문 방법은? 🔄"
  ];

  const handleAiRecommend = (query: string) => {
    setIsAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      let text = '';
      let recommendedSpecs: { id: string; type: string }[] = [];

      // 60계치킨 반반 주문 룰 체크 (크크크/크랑이는 서로하고만 가능)
      if (query.includes("반반") || query.includes("반반치킨") || query.includes("크크크 반반")) {
        if (query.includes("고추") || query.includes("간지") || query.includes("매운") || query.includes("단짠") || query.includes("호랑이") || query.includes("참지마라")) {
          text = "⚠️ 아쉽게도 60계치킨의 공식 조리 룰에 따라, '크크크치킨'과 '크랑이치킨'은 전용 파우더 특성으로 인해 오직 서로하고만 반반 주문이 가능합니다. 😭 고추치킨, 참지마라치킨 등 다른 메뉴와는 반반 구성이 불가능합니다.\n\n대신 바삭한 고소함과 매콤함이 환상적인 '크크크 + 크랑이 반반' 메뉴를 추천해 드릴게요! 순살로 장바구니에 담아드릴까요?";
          recommendedSpecs = [{ id: 'ccc_crang_half', type: '순살' }];
        } else {
          text = "💡 크크크치킨과 크랑이치킨은 서로하고만 반반이 가능합니다! 고소하고 바삭한 크크크 반, 매콤 달콤한 크랑이 반을 모두 맛볼 수 있는 공식 '크크크 + 크랑이 반반' 메뉴를 추천드립니다. 가장 인기 있는 순살 옵션으로 바로 담으실 수 있습니다.";
          recommendedSpecs = [{ id: 'ccc_crang_half', type: '순살' }];
        }
      } else if (query.includes("매운") || query.includes("마라") || query.includes("참지마라")) {
        text = "🌶️ 화끈하고 알싸한 매운맛을 찾으신다면, 마라 덕후들을 위해 출시된 대세 신메뉴 '참지마라치킨'을 강력 추천합니다! 60계의 바삭한 식감에 알싸한 마라 양념과 고추, 대파 슬라이스가 가득 올라가 스트레스가 싹 날아갑니다. 뼈(24,900원) 혹은 순살(25,900원) 중 무엇으로 담아드릴까요?";
        recommendedSpecs = [{ id: 'chamji_mara', type: '뼈' }];
      } else if (query.includes("아이") || query.includes("안 매운")) {
        text = "💡 아이들과 먹기 편한 맵지 않고 달콤바삭한 조합입니다! 뼈가 없어 안심하고 먹을 수 있는 순살 '크크크치킨'과 누룽지 가루가 고소한 순살 '호랑이치킨'을 추천합니다.";
        recommendedSpecs = [
          { id: 'ccc', type: '순살' },
          { id: 'horang', type: '순살' }
        ];
      } else if (query.includes("맥주") || query.includes("바삭") || query.includes("알싸") || query.includes("콤보")) {
        text = "💡 치맥 라이프를 위해 맛있는 부위(날개+봉+다리)만 모아 쯔란 향을 진하게 입힌 '쯔란콤보'와, 바삭함의 끝판왕이자 매콤달콤한 '크랑이치킨 콤보' 구성을 강추합니다!";
        recommendedSpecs = [
          { id: 'zuran', type: '콤보' },
          { id: 'crang', type: '콤보' }
        ];
      } else if (query.includes("단짠")) {
        text = "💡 입에 착 달라붙는 단짠 치킨의 끝판왕! 갈릭과 콘후레이크가 만난 '호랑이치킨'과, 가장 정석적인 고소함을 자랑하는 '후라이드치킨'의 바삭 콤보 세트를 드셔보세요.";
        recommendedSpecs = [
          { id: 'horang', type: '뼈' },
          { id: 'fry', type: '뼈' }
        ];
      } else {
        text = "💡 60계치킨 강원영월점의 시그니처 1위인 '크크크치킨(순살)'과 매콤달콤 중독성 최강인 신메뉴 '크랑이치킨(뼈)'을 추천합니다! 매장에서 매일 60마리씩 새 기름으로 튀겨 극강의 고소함을 보여줍니다.";
        recommendedSpecs = [
          { id: 'ccc', type: '순살' },
          { id: 'crang', type: '뼈' }
        ];
      }

      setAiResponse({ text, recommendedSpecs });
      setIsAiLoading(false);
    }, 1500);
  };

  const addRecommendedToCart = (specs: { id: string; type: string }[]) => {
    const updatedCart = [...cart];
    specs.forEach(spec => {
      const menu = menuList.find(m => m.id === spec.id);
      if (menu) {
        const priceOpt = menu.prices.find(p => p.type === spec.type) || menu.prices[0];
        const existingIdx = updatedCart.findIndex(item => 
          item.menu.id === spec.id && item.selectedType === spec.type
        );
        
        if (existingIdx > -1) {
          updatedCart[existingIdx].quantity += 1;
        } else {
          updatedCart.push({ 
            menu, 
            selectedType: spec.type, 
            selectedPrice: priceOpt.price, 
            quantity: 1 
          });
        }
      }
    });
    setCart(updatedCart);
    setAiResponse(null);
    setAiInput('');
    setShowCartSheet(true);
  };

  const addMenuToCart = (menu: Menu) => {
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

  // 직접 다른 메뉴를 입력해서 장바구니에 담는 기능
  const handleAddCustomMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMenuName) return;

    const price = Number(customMenuPrice) || 0;
    const customMenuObj: Menu = {
      id: `custom-${Date.now()}`,
      name: customMenuName,
      category: '기타 직접입력',
      description: customMenuDesc || '고객이 직접 작성한 개별 요청 메뉴',
      image: 'https://youngwol-chicken.co.kr/uploads/20260611115406_d9350ea5.png', // 기본 사이드 이미지 사용
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

    // Reset Form & Close Modal
    setCustomMenuName('');
    setCustomMenuDesc('');
    setCustomMenuQty(1);
    setCustomMenuPrice('5000');
    setShowCustomModal(false);
    setShowCartSheet(true);
  };

  const updateCartQty = (menuId: string, type: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.menu.id === menuId && item.selectedType === type) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];
    setCart(updated);
  };

  const removeFromCart = (menuId: string, type: string) => {
    setCart(cart.filter(item => !(item.menu.id === menuId && item.selectedType === type)));
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.selectedPrice * item.quantity), 0);
  const getDiscount = () => (orderType === 'takeout' && getSubtotal() > 0) ? 2000 : 0;
  const getDeliveryFee = () => (orderType === 'delivery' && getSubtotal() > 0) ? 3000 : 0;
  const getTotalPrice = () => getSubtotal() - getDiscount() + getDeliveryFee();

  // 픽업/배달 완료 목표 시각 계산 헬퍼
  const getTargetPickupTime = (type: 'takeout' | 'delivery', selectedPickupStr: string) => {
    const now = new Date();
    let minutesToAdd = 30; // 기본 30분
    if (type === 'delivery') {
      minutesToAdd = 40; // 배달 기본 40분
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

  // 로컬스토리지에서 최근 주문을 실시간 감지하여 불러오는 함수
  const loadRecentOrder = () => {
    if (typeof window !== 'undefined') {
      try {
        const latestId = localStorage.getItem('youngwol_latest_order_id');
        const ordersData = localStorage.getItem('youngwol_orders');
        if (ordersData) {
          const list = JSON.parse(ordersData);
          if (Array.isArray(list) && list.length > 0) {
            const found = latestId ? list.find((o: any) => o.id === latestId) : list[0];
            if (found) {
              setRecentOrder(found);
              if (!currentOrderId && found.id) {
                setCurrentOrderId(found.id);
                setCurrentOrderState(found);
              }
            }
          }
        }
      } catch (e) {
        console.error('loadRecentOrder error:', e);
      }
    }
  };

  useEffect(() => {
    loadRecentOrder();
    window.addEventListener('storage', loadRecentOrder);
    return () => window.removeEventListener('storage', loadRecentOrder);
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || (orderType === 'delivery' && !address)) {
      alert("필수 주문 정보를 모두 입력해 주세요.");
      return;
    }

    const { targetFormatted, minutesToAdd } = getTargetPickupTime(orderType, pickupTime);
    const orderId = `ord-${Date.now()}`;
    setCurrentOrderId(orderId);

    // 주방 대시보드 실시간 주문 연동용 데이터 구성
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
      items: cart.map(item => ({
        name: item.menu.name,
        type: item.selectedType,
        price: item.selectedPrice,
        quantity: item.quantity,
        isCustom: item.menu.isCustom,
        customDetails: item.customDetails
      })),
      subtotal: getSubtotal(),
      discount: getDiscount(),
      deliveryFee: getDeliveryFee(),
      total: getTotalPrice(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    const existingOrders = JSON.parse(localStorage.getItem('youngwol_orders') || '[]');
    localStorage.setItem('youngwol_orders', JSON.stringify([orderData, ...existingOrders]));
    localStorage.setItem('youngwol_latest_order_id', orderId);
    setRecentOrder(orderData);
    
    // 중앙 서버 주문 동기화 API 호출 (다중 기기 동기화용)
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
    } catch (err) {
      console.log('Central Server Order API error:', err);
    }

    // 텔레그램 실시간 알림 API 호출
    fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).catch(err => console.log('Telegram API error:', err));

    // 타 브라우저 탭에 실시간 storage 업데이트 노티 전송
    window.dispatchEvent(new Event('storage'));

    setCurrentOrderState(orderData);
    setCurrentStep(3);
    setTrackStep(1);
  };

  // 주방 상태와 실시간 100% 동기화 렌더링
  useEffect(() => {
    if (currentStep === 3) {
      const syncStatus = async () => {
        const orderIdToFind = currentOrderId || recentOrder?.id || (typeof window !== 'undefined' ? localStorage.getItem('youngwol_latest_order_id') : '');
        if (!orderIdToFind) return;

        try {
          const res = await fetch(`/api/orders?t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (json.ok && Array.isArray(json.orders)) {
              const found = json.orders.find((o: any) => o.id === orderIdToFind);
              if (found) {
                setCurrentOrderState(found);
                setRecentOrder(found);
                if (found.status === 'cooking') setTrackStep(3);
                else if (found.status === 'done') setTrackStep(4);
                else if (found.status === 'accepted') setTrackStep(2);
                else setTrackStep(1);
                return;
              }
            }
          }
        } catch (e) {
          console.log('Customer syncStatus API error:', e);
        }

        // 로컬 스토리지 Fallback
        if (typeof window !== 'undefined') {
          const data = localStorage.getItem('youngwol_orders');
          if (data) {
            const list = JSON.parse(data);
            const found = list.find((o: any) => o.id === orderIdToFind);
            if (found) {
              setCurrentOrderState(found);
              setRecentOrder(found);
              if (found.status === 'cooking') setTrackStep(3);
              else if (found.status === 'done') setTrackStep(4);
              else if (found.status === 'accepted') setTrackStep(2);
              else setTrackStep(1);
            }
          }
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

  return (
    <div className="min-h-screen bg-[#0e0a09] text-slate-100 flex flex-col font-sans selection:bg-[#f39c12]/30 selection:text-white pb-20">
      
      {/* Mobile Top Header */}
      <header className="border-b border-[#32231e] bg-[#1a1210]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-black text-[#f39c12] tracking-wide flex items-center justify-center gap-1">
              <span>60계치킨</span>
              <span className="bg-[#f39c12] text-[#1a1210] text-[9px] font-extrabold px-1 rounded">강원영월점</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">영월읍 관풍헌길 35 • 033-374-6660</p>
          </div>
          <div className="flex items-center gap-2">
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

      {/* Constraints container */}
      <div className="w-full max-w-md mx-auto px-4 py-6 flex-1 flex flex-col gap-6">
        
        {/* Step Header (클릭 가능한 네비게이션) */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-extrabold text-slate-500 border-b border-[#2a1d19] pb-4">
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
            className={`pb-1 transition-all flex items-center justify-center gap-1 ${currentStep === 3 ? 'text-[#f39c12] border-b-2 border-[#f39c12] font-black' : (recentOrder ? 'text-amber-400 font-bold hover:text-white' : 'hover:text-slate-300')}`}
          >
            <span>3. 실시간 대기</span>
            {recentOrder && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>}
          </button>
        </div>

        {/* STEP 1: MENU SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            
            {/* 최근 주문이 있을 경우 최상단에 노출되는 직통 영수증 배너 */}
            {recentOrder ? (
              <div 
                onClick={() => {
                  setCurrentOrderId(recentOrder.id);
                  setCurrentOrderState(recentOrder);
                  setCurrentStep(3);
                }}
                className="cursor-pointer bg-gradient-to-r from-[#2c1d18] via-[#3a2219] to-[#201410] border-2 border-[#f39c12] rounded-2xl p-4 shadow-xl shadow-[#f39c12]/15 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between gap-3 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f39c12] text-[#1a1210] flex items-center justify-center text-lg shadow-md shrink-0 font-black">
                    🧾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#f39c12]">방금 주문하신 내역이 있습니다!</span>
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
            ) : (
              <div 
                onClick={() => {
                  alert('아직 접수된 주문 내역이 없습니다. 아래 메뉴판에서 원하시는 치킨을 장바구니에 담아 주문해 보세요! 🍗');
                }}
                className="cursor-pointer bg-[#1c1310] border border-[#3d2c27] hover:border-[#f39c12]/50 rounded-xl p-3 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🧾</span>
                  <span className="text-xs font-bold text-slate-300">내가 주문한 내역이 궁금하신가요?</span>
                </div>
                <span className="text-[10px] text-[#f39c12] font-extrabold bg-[#f39c12]/10 px-2 py-1 rounded-lg border border-[#f39c12]/20">
                  주문 내역 조회 &gt;
                </span>
              </div>
            )}

            {/* Live Store status */}
            <div className="bg-[#1c1310] border border-[#3d2c27] rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-emerald-450 tracking-wider block">LIVE KITCHEN STATUS</span>
                <h4 className="text-xs font-bold text-white mt-0.5">현재 주문 대기 상태: <span className="text-[#f39c12]">보통</span></h4>
                <p className="text-[10px] text-slate-400 mt-1">포장 조리 완료까지 약 25분 소요 예정</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/25">전화 연결 원활</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/25">포장 2,000원 할인</span>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-r from-[#201511] to-[#3a1f14] border border-[#f39c12]/20 rounded-2xl p-4 space-y-3 shadow-lg shadow-[#f39c12]/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#f39c12]/15 flex items-center justify-center text-[#f39c12]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white">무엇을 먹을지 고민되시나요?</h3>
                  <p className="text-[10px] text-slate-400">AI 치킨 큐레이터에게 물어보세요!</p>
                </div>
              </div>

              {/* Chat chips */}
              <div className="flex flex-wrap gap-1.5">
                {aiChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAiRecommend(chip)}
                    className="text-[9px] font-semibold bg-[#2a1b16] hover:bg-[#3d2720] border border-[#442c23] text-slate-300 px-2.5 py-1.5 rounded-lg transition-colors text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="예: 매운 치킨 추천해줘 🌶️"
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
                  className="w-9 h-9 bg-[#f39c12] hover:bg-[#f39c12]/95 disabled:bg-[#f39c12]/50 text-[#1a1210] rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  {isAiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* AI Recommendation Result Panel */}
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[#0e0908] border border-[#f39c12]/20 rounded-xl p-3.5 space-y-3 overflow-hidden"
                  >
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                      {aiResponse.text}
                    </p>
                    <div className="flex items-center justify-between border-t border-[#261915] pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {aiResponse.recommendedSpecs.map(spec => {
                          const item = menuList.find(m => m.id === spec.id);
                          return (
                            <span key={spec.id} className="text-[8px] font-extrabold bg-[#261915] text-[#f39c12] px-2 py-0.5 rounded border border-[#f39c12]/20">
                              {item?.name} ({spec.type})
                            </span>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => addRecommendedToCart(aiResponse.recommendedSpecs)}
                        className="text-[9px] font-black bg-[#f39c12] text-[#1a1210] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#f39c12]/90 transition-colors shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                        <span>추천 조합 담기</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu List Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">강원영월점 공식 메뉴판</h3>
                <span className="text-[9px] font-semibold text-slate-500">* 홈페이지의 실제 사진과 100% 동일</span>
              </div>

              {/* Menu Cards */}
              <div className="space-y-4">
                {menuList.map((menu) => {
                  const activeType = selectedTypes[menu.id] || menu.prices[0].type;
                  const activePrice = menu.prices.find(p => p.type === activeType)?.price || menu.prices[0].price;
                  const cartItem = cart.find(item => item.menu.id === menu.id && item.selectedType === activeType);

                  return (
                    <div 
                      key={menu.id}
                      className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl overflow-hidden flex flex-col transition-all hover:border-[#f39c12]/50 shadow-md animate-fade-in"
                    >
                      {/* Top Horizontal Row */}
                      <div className="flex">
                        {/* Image Block */}
                        <div className="w-28 h-28 shrink-0 relative bg-slate-900">
                          <img 
                            src={menu.image} 
                            alt={menu.name}
                            className="w-full h-full object-cover"
                          />
                          {menu.tag && (
                            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#f39c12] text-[#1a1210] text-[8px] font-black uppercase tracking-wider">
                              {menu.tag}
                            </span>
                          )}
                        </div>

                        {/* Content Block */}
                        <div className="flex-1 p-3.5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-extrabold text-white">{menu.name}</h4>
                              <span className="text-xs font-black text-[#f39c12]">{activePrice.toLocaleString()}원</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                              {menu.description}
                            </p>
                          </div>

                          {/* Cart Add/Remove Buttons */}
                          <div className="flex justify-end items-center mt-2">
                            {cartItem ? (
                              <div className="flex items-center bg-[#0d0908] border border-[#3d2c27] rounded-xl h-8 px-1">
                                <button 
                                  onClick={() => updateCartQty(menu.id, activeType, -1)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center text-xs font-bold text-white">{cartItem.quantity}</span>
                                <button 
                                  onClick={() => updateCartQty(menu.id, activeType, 1)}
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

                      {/* Bottom Options Selector Row */}
                      {menu.prices.length > 1 && (
                        <div className="px-3.5 pb-3 pt-2 bg-[#170f0d] border-t border-[#291b17] flex items-center gap-2 overflow-x-auto scrollbar-none">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider shrink-0 mr-1">옵션 선택:</span>
                          <div className="flex gap-1">
                            {menu.prices.map((opt) => (
                              <button
                                key={opt.type}
                                onClick={() => setSelectedTypes(prev => ({ ...prev, [menu.id]: opt.type }))}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold transition-all border shrink-0 ${
                                  activeType === opt.type
                                    ? 'bg-[#f39c12]/10 border-[#f39c12] text-[#f39c12]'
                                    : 'bg-[#0d0908] border-[#2c1d1a] text-slate-450 hover:text-slate-200'
                                }`}
                              >
                                {opt.type} (+{(opt.price - menu.prices[0].price).toLocaleString()}원)
                              </button>
                            ))}
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
                메뉴판에 없는 사이드 메뉴(예: 쫀득 치즈볼, 미니쫀득볼 등)나 세트 구성을 직접 작성해 장바구니에 담을 수 있습니다.
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
                <span>영월점 전화로 바로 주문하기</span>
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
                className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                  orderType === 'takeout' 
                    ? 'bg-[#f39c12] text-[#1a1210] shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚴 포장 요청 (-2,000원)
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                  orderType === 'delivery' 
                    ? 'bg-[#f39c12] text-[#1a1210] shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏠 배달 주문 (+3,000원)
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
                      <option value="20분 뒤 방문">20분 뒤 방문</option>
                      <option value="30분 뒤 방문">30분 뒤 방문</option>
                      <option value="45분 뒤 방문">45분 뒤 방문</option>
                      <option value="60분 뒤 방문">60분 뒤 방문</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* 주문 품목 및 결제 금액 확인 (주문 고객 정보와 결제 및 요청사항 사이) */}
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
                  cart.map((item, idx) => (
                    <div key={idx} className="bg-[#140d0b] border border-[#2e201c] rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs font-extrabold text-white truncate">{item.menu.name}</h5>
                          <span className="text-[9px] font-bold text-[#f39c12] bg-[#2a1b16] px-1.5 py-0.5 rounded border border-[#442c23]">
                            {item.selectedType}
                          </span>
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

                      {/* 수량 변경 (+ / -) 버튼 */}
                      <div className="flex items-center bg-[#0d0908] border border-[#3d2c27] rounded-xl h-8 px-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.menu.id, item.selectedType, -1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.menu.id, item.selectedType, 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 금액 정산 요약표 */}
              <div className="border-t border-[#2d1f1b] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>주문 금액 합계</span>
                  <span className="text-slate-200 font-bold">{getSubtotal().toLocaleString()}원</span>
                </div>

                {orderType === 'takeout' && (
                  <div className="flex justify-between text-emerald-450 font-bold">
                    <span>🎁 포장 방문 할인</span>
                    <span>-2,000원</span>
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-blue-400 font-bold">
                    <span>🛵 배달 요금</span>
                    <span>+3,000원</span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-[#3d2c27] pt-2.5 text-sm font-black">
                  <span className="text-white">최종 결제 예정 금액</span>
                  <span className="text-[#f39c12] text-base">
                    {getTotalPrice().toLocaleString()}원
                  </span>
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
                      { val: 'bank_transfer', label: '🏦 가상 계좌이체' },
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
          <div className="space-y-6 animate-fade-in text-center py-6">
            
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

            {/* 내가 주문한 상세 내역서 (영수증 카드) */}
            <div className="bg-[#1c1310] border border-[#f39c12]/30 p-5 rounded-2xl text-left space-y-4 max-w-sm mx-auto shadow-xl">
              <div className="flex items-center justify-between border-b border-[#3d2c27] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#f39c12] text-sm font-black">🧾 주문 내역서</span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-[#f39c12]/15 text-[#f39c12] border border-[#f39c12]/30">
                    {orderType === 'takeout' ? '방문 포장' : '안전 배달'}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">
                  {currentOrderId ? `#${currentOrderId.slice(-6)}` : ''}
                </span>
              </div>

              {/* 주문 품목 리스트 */}
              <div className="space-y-2.5">
                {(currentOrderState?.items || cart).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className="text-[9px] font-semibold text-[#f39c12] bg-[#2a1b16] px-1.5 py-0.5 rounded border border-[#442c23]">
                          {item.type || '기본'}
                        </span>
                      </div>
                      {item.customDetails && (
                        <p className="text-[9px] text-slate-400 mt-0.5">{item.customDetails}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-slate-400 font-medium">{item.quantity}개</span>
                      <span className="text-white font-bold ml-2">
                        {((item.price || item.selectedPrice || 0) * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 금액 정산 표 */}
              <div className="border-t border-[#2d1f1b] pt-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>주문 금액</span>
                  <span>{(currentOrderState?.subtotal || getSubtotal()).toLocaleString()}원</span>
                </div>
                {orderType === 'takeout' && (
                  <div className="flex justify-between text-emerald-450 font-bold">
                    <span>🎁 포장 주문 할인</span>
                    <span>-{(currentOrderState?.discount || getDiscount()).toLocaleString()}원</span>
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

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setCart([]);
                  setCurrentStep(1);
                }}
                className="h-11 px-6 bg-slate-900 border border-[#3d2c27] hover:bg-slate-800 text-slate-350 hover:text-white font-bold rounded-xl text-xs transition-colors"
              >
                신규 주문으로 돌아가기
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
                    {cart.map((item) => (
                      <div key={`${item.menu.id}-${item.selectedType}`} className="flex justify-between items-center animate-fade-in">
                        <div>
                          <h5 className="text-xs font-extrabold text-white">
                            {item.menu.name} <span className="text-[#f39c12] text-[9px] bg-[#f39c12]/10 px-1 rounded ml-1">{item.selectedType}</span>
                          </h5>
                          {item.menu.isCustom && (
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-snug">{item.customDetails}</p>
                          )}
                          <span className="text-[10px] text-slate-500">{item.selectedPrice.toLocaleString()}원</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-[#0d0908] border border-[#3d2c27] rounded-lg h-7 px-1">
                            <button 
                              onClick={() => updateCartQty(item.menu.id, item.selectedType, -1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 rounded-md"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQty(item.menu.id, item.selectedType, 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-[#3d2c27] text-slate-400 rounded-md"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.menu.id, item.selectedType)}
                            className="text-slate-550 hover:text-red-450 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#261915] pt-3 text-[10px] font-bold text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>선택 메뉴 합계</span>
                      <span>{getSubtotal().toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>주문 혜택 (포장 기본 선택)</span>
                      <span>-2,000원</span>
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

    </div>
  );
}
