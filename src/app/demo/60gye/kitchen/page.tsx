'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Printer, Check, X, ShieldCheck, HelpCircle, Volume2, 
  Clock, ShoppingBag, MapPin, Phone, AlertCircle, ArrowLeft, RefreshCw
} from 'lucide-react';

interface OrderItem {
  name: string;
  type: string;
  price: number;
  quantity: number;
  isCustom?: boolean;
  customDetails?: string;
}

interface Order {
  id: string;
  name: string;
  phone: string;
  orderType: 'takeout' | 'delivery';
  address?: string;
  pickupTime?: string;
  targetPickupTime?: string;
  minutesToAdd?: number;
  paymentMethod: string;
  requestText?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  timestamp: string;
  status: 'pending' | 'accepted' | 'cooking' | 'done' | 'cancelled';
}

export default function KitchenDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'kds' | 'bluetooth' | 'silent'>('kds');

  const prevOrderCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  // 중앙 서버 실시간 주문 Polling 및 동기화
  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.orders)) {
          const serverOrders: Order[] = json.orders;
          
          // 새 주문 감지 시 띵동 알림음 울리기!
          if (!isInitialLoadRef.current && serverOrders.length > prevOrderCountRef.current) {
            if (soundEnabled) {
              playAlertSound();
            }
          }
          prevOrderCountRef.current = serverOrders.length;
          isInitialLoadRef.current = false;

          setOrders(serverOrders);
          if (typeof window !== 'undefined') {
            localStorage.setItem('youngwol_orders', JSON.stringify(serverOrders));
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Central orders fetch error, fallback to local storage:', e);
    }

    // 서버 조회 실패 시 로컬 스토리지 Fallback
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem('youngwol_orders');
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        }
      } catch (e) {
        console.error('loadOrders fallback error:', e);
      }
    }
  };

  useEffect(() => {
    loadOrders();

    const handleStorageChange = () => {
      loadOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    // 1.5초마다 중앙 서버에서 최신 주문 내역 실시간 동기화
    const interval = setInterval(loadOrders, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [soundEnabled]);

  // Audio API alert sound (띵동 느낌의 비프음 조합)
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // First Tone
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.frequency.value = 523.25; // C5 note (도)
      gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.4);

      // Second Tone (slightly delayed)
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.value = 659.25; // E5 note (미)
        gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc2.start(audioCtx.currentTime);
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 150);
    } catch (e) {
      console.warn('Audio Context is blocked by browser autoplay policy.');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrders(updated);
    localStorage.setItem('youngwol_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    // Sync to Central Server
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
    } catch (e) {
      console.log('Central Server PATCH error:', e);
    }
  };

  const handlePrintClick = (order: Order) => {
    setSelectedOrderForPrint(order);
    // Trigger system print window for 80mm receipt emulation
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const clearAllOrders = async () => {
    if (confirm("모든 주문 내역을 초기화하시겠습니까?")) {
      setOrders([]);
      localStorage.removeItem('youngwol_orders');
      window.dispatchEvent(new Event('storage'));
      try {
        await fetch('/api/orders', { method: 'DELETE' });
      } catch (e) {
        console.log('Central Server DELETE error:', e);
      }
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'store_payment': return '카드/매장결제';
      case 'pay_on_delivery': return '만나서 현금결제';
      case 'bank_transfer': return '계좌이체';
      default: return '기타문의';
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0a09] text-slate-100 flex flex-col font-sans">
      
      {/* Printable Receipt Emulation Area (Hidden on Screen, Visible on Print) */}
      {selectedOrderForPrint && (
        <div className="hidden print:block print:bg-white print:text-black p-4 w-[80mm] text-xs font-mono leading-tight bg-white text-black">
          <div className="text-center font-black text-sm border-b-2 border-black pb-2 mb-2">
            [60계치킨 강원영월점]<br/>
            주문 영수증 (주방용)<br/>
            <span className="text-[10px] font-normal">T: 033-374-6660</span>
          </div>

          {/* 주방 조리 목표 시간 대형 강조 헤더 */}
          <div className="bg-black text-white text-center py-1.5 px-2 my-2 rounded text-sm font-black border border-black">
            ⏰ [조리/방문 완료 목표시각: {selectedOrderForPrint.targetPickupTime || '18:10'}]
            <span className="block text-[10px] font-normal mt-0.5">({selectedOrderForPrint.pickupTime || '45분 뒤 방문'})</span>
          </div>

          <div className="space-y-1 text-[11px] mb-2 border-b border-dashed border-black pb-2">
            <div>주문 번호: {selectedOrderForPrint.id}</div>
            <div>주문 시각: {selectedOrderForPrint.timestamp}</div>
            <div className="font-bold">주문 유형: {selectedOrderForPrint.orderType === 'takeout' ? '🛍️ [포장/테이크아웃]' : '🛵 [배달 주문]'}</div>
            <div>고객 성함: {selectedOrderForPrint.name} 님</div>
            <div>연락처: {selectedOrderForPrint.phone}</div>
            {selectedOrderForPrint.orderType === 'delivery' && (
              <div className="font-bold">주소: {selectedOrderForPrint.address}</div>
            )}
          </div>

          <div className="border-b border-dashed border-black pb-1.5 mb-2">
            <div className="grid grid-cols-12 font-bold mb-1 border-b border-black pb-1">
              <span className="col-span-8">메뉴명 (옵션)</span>
              <span className="col-span-2 text-center">수량</span>
              <span className="col-span-2 text-right">금액</span>
            </div>
            {selectedOrderForPrint.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 mb-1">
                <div className="col-span-8">
                  {item.name}
                  <span className="block text-[10px] text-gray-700">-{item.type}</span>
                  {item.isCustom && item.customDetails && (
                    <span className="block text-[9px] text-red-700">요청: {item.customDetails}</span>
                  )}
                </div>
                <span className="col-span-2 text-center">{item.quantity}</span>
                <span className="col-span-2 text-right">{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-right text-[11px] mb-2 border-b border-dashed border-black pb-2">
            <div>상품 금액: {selectedOrderForPrint.subtotal.toLocaleString()}원</div>
            {selectedOrderForPrint.discount > 0 && <div>포장 할인: -{selectedOrderForPrint.discount.toLocaleString()}원</div>}
            {selectedOrderForPrint.deliveryFee > 0 && <div>배달료: +{selectedOrderForPrint.deliveryFee.toLocaleString()}원</div>}
            <div className="font-extrabold text-sm mt-1">합계 금액: {selectedOrderForPrint.total.toLocaleString()}원</div>
          </div>

          <div className="text-[11px] mb-4">
            <span className="font-bold block">[요청 사항]</span>
            <span className="block italic">{selectedOrderForPrint.requestText || '요청사항 없음'}</span>
          </div>

          <div className="text-center text-[10px] pt-2 border-t border-dashed border-black">
            - 신선한 새 기름으로 60마리만 튀깁니다 -<br/>
            이용해 주셔서 대단히 감사합니다.
          </div>
        </div>
      )}

      {/* Main Dashboard Screen Area */}
      <header className="border-b border-[#32231e] bg-[#1a1210] px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/demo/60gye" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-black text-[#f39c12] flex items-center gap-1.5">
              <span>60계치킨 주방 주문 전광판</span>
              <span className="bg-[#f39c12] text-[#1a1210] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Kitchen Display System</span>
            </h1>
            <p className="text-xs text-slate-500">실시간 주문 데이터 자동 수신 및 영수증 자동 인쇄 시뮬레이터</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`h-9 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              soundEnabled 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                : 'bg-slate-900 border-[#3d2c27] text-slate-500'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>신규 주문 알림음: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={clearAllOrders}
            className="h-9 px-3.5 bg-red-950/20 border border-red-900/50 hover:bg-red-900 hover:text-white text-red-400 text-xs font-bold rounded-xl transition-all"
          >
            모든 주문 리셋
          </button>
        </div>
      </header>

      {/* Main Layout Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        
        {/* Left 2 Cols: Orders Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2d1d19] pb-3">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>실시간 수신 목록</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[10px] px-2 py-0.5 rounded-full font-bold">
                대기 {orders.filter(o => o.status === 'pending').length}건
              </span>
            </h2>
            <button 
              onClick={loadOrders}
              className="text-xs text-[#f39c12] hover:underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>새로고침</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#1c1310] border border-[#3d2c27] rounded-3xl p-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-white">접수된 주문이 없습니다.</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                모바일 주문창([http://localhost:3001/demo/60gye](/demo/60gye))을 새 탭으로 열어 주문을 전송해 보세요! 주방 전광판에 즉시 띵동 소리와 함께 주문이 실시간으로 날아옵니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className={`bg-[#1c1310] border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                    order.status === 'pending' 
                      ? 'border-[#f39c12] shadow-lg shadow-[#f39c12]/5 ring-1 ring-[#f39c12]/30' 
                      : 'border-[#3d2c27]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex justify-between items-start border-b border-[#2d1d19] pb-2">
                      <div>
                        <span className="text-[10px] text-slate-550 block">주문시각 {order.timestamp}</span>
                        <h4 className="text-sm font-extrabold text-white mt-0.5">{order.name} 님</h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        order.orderType === 'takeout' 
                          ? 'bg-[#f39c12]/15 text-[#f39c12] border border-[#f39c12]/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {order.orderType === 'takeout' ? '🛍️ 포장' : '🛵 배달'}
                      </span>
                    </div>

                    {/* 대형 조리/방문 완료 목표 시간 뱃지 */}
                    <div className="bg-[#241712] border border-[#f39c12]/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-slate-400">조리/방문 목표</span>
                      <span className="text-sm font-black text-[#f39c12] flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#f39c12]" />
                        <span>{order.targetPickupTime || '18:10'} 완료</span>
                        <span className="text-[9px] text-slate-400 font-normal">({order.pickupTime || '45분 뒤'})</span>
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="font-semibold">{order.phone}</span>
                      </div>
                      {order.orderType === 'delivery' ? (
                        <div className="flex gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{order.address}</span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span className="text-[#f39c12] font-semibold">{order.pickupTime} 방문</span>
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="bg-[#0e0908] border border-[#2b1d19] rounded-xl p-3 space-y-2">
                      <h5 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">주문 제품</h5>
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-bold text-white">
                              {item.name} 
                              <span className="text-[#f39c12] text-[9px] bg-[#f39c12]/10 px-1.5 py-0.5 rounded ml-1.5">{item.type}</span>
                              {item.isCustom && item.customDetails && (
                                <span className="block text-[9px] text-red-400 mt-0.5 font-normal italic">*요구사항: {item.customDetails}</span>
                              )}
                            </span>
                            <span className="text-slate-400">{item.quantity}개</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Request text */}
                    {order.requestText && (
                      <div className="text-[11px] bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl text-amber-300 italic leading-snug">
                        <strong>요청:</strong> {order.requestText}
                      </div>
                    )}
                  </div>

                  {/* Actions & Price */}
                  <div className="border-t border-[#2d1d19] pt-3 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 block">결제: {getPaymentLabel(order.paymentMethod)}</span>
                      <span className="text-sm font-black text-white">{order.total.toLocaleString()}원</span>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="w-8 h-8 rounded-xl bg-red-950/20 hover:bg-red-900 border border-red-900/50 hover:text-white text-red-400 flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              updateOrderStatus(order.id, 'cooking');
                              handlePrintClick(order);
                            }}
                            className="h-8 px-3 bg-[#f39c12] hover:bg-[#f39c12]/90 text-[#1a1210] font-black rounded-xl text-[11px] flex items-center gap-1 transition-all"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>접수 & 프린트</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest bg-[#2d1d19] py-1 px-2.5 rounded-lg border border-[#3d2c27]">
                            {order.status === 'cooking' ? '🔥 조리 중' : '✅ 완료됨'}
                          </span>
                          <button
                            onClick={() => handlePrintClick(order)}
                            className="w-8 h-8 rounded-xl bg-slate-900 border border-[#3d2c27] hover:border-[#f39c12] text-slate-300 flex items-center justify-center transition-all"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Printer Hardware Connection Guide */}
        <div className="space-y-6">
          <div className="bg-[#1c1310] border border-[#3d2c27] rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#f39c12]" />
              <span>실제 영수증 프린터 연동 기술</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              본 MVP 데모는 `window.print()` 규격을 에뮬레이션하여 임의의 영수증 프린터(80mm) 드라이버를 통해 실제 인쇄할 수 있습니다. 상용 서비스 배포 시 주방에 주문서를 자동으로 출력시키는 실제 하드웨어 인쇄 연동 방식은 다음과 같습니다.
            </p>

            {/* Guide Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#0e0908] p-1 rounded-xl border border-[#2b1d19]">
              {[
                { id: 'kds', label: 'Cloud Print' },
                { id: 'bluetooth', label: '무선 브릿지' },
                { id: 'silent', label: '크롬 무음설정' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGuideTab(tab.id as any)}
                  className={`py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    activeGuideTab === tab.id 
                      ? 'bg-[#f39c12] text-[#1a1210] shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Guide Contents */}
            <div className="bg-[#0e0908] border border-[#2b1d19] p-3.5 rounded-2xl text-[11px] text-slate-350 space-y-3">
              {activeGuideTab === 'kds' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#f39c12]">1. Cloud Web API 중계 방식 (가장 권장)</h4>
                  <p className="leading-relaxed">
                    주문이 서버로 들어오면, 클라우드 프린트 서버에서 주방 IP 프린터의 API로 주문 양식(ESC/POS 바이트 데이터)을 즉시 쏩니다.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500">
                    <li>PC나 포스기가 켜져있지 않아도 즉각 출력.</li>
                    <li>프린터가 인터넷(LAN선)에만 꼽혀있으면 작동.</li>
                  </ul>
                </div>
              )}
              {activeGuideTab === 'bluetooth' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#f39c12]">2. 태블릿 및 전용 앱 연동 (블루투스)</h4>
                  <p className="leading-relaxed">
                    매장 주방에 태블릿이나 POS 기기를 거치해 두고, 웹소켓(WebSocket)으로 실시간 주문 알림을 받으면 기기와 페어링된 블루투스/LAN 영수증 프린터로 인쇄 명령을 내려 출력합니다.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500">
                    <li>비교적 세팅 비용이 저렴하고 무선 연동 편리.</li>
                    <li>접수 전용 안드로이드/iOS 앱 연동에 적합.</li>
                  </ul>
                </div>
              )}
              {activeGuideTab === 'silent' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#f39c12]">3. 크롬 브라우저 자동 무음 인쇄 (Silent Print)</h4>
                  <p className="leading-relaxed">
                    주방에 항시 켜져 있는 주방 전광판 PC 브라우저(Chrome)에 옵션을 추가(예: `--kiosk-printing` 파라미터 실행)하면, 팝업 확인창 없이 버튼 한 번에 주방 프린터로 다이렉트 자동 인쇄됩니다.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500">
                    <li>별도 API 개발 없이 브라우저 단독으로 구현 가능.</li>
                    <li>중소 규모 매장에서 가장 빠르게 도입하는 방식.</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-[#2a1d19]/40 border border-[#f39c12]/20 rounded-xl p-3 text-[10px] text-amber-300/80 leading-relaxed">
              💡 <strong>직접 확인해 보세요!</strong><br/>
              1. PC에서 브라우저 창을 2개 띄워 나란히 배치합니다.<br/>
              2. 한 창은 주문 페이지(`/demo/60gye`), 한 창은 주방 페이지(`/demo/60gye/kitchen`)를 엽니다.<br/>
              3. 주문 페이지에서 주문을 완료하면, 주방 창에 띵동 🔔 소리와 함께 실시간으로 주문서가 들어옵니다!
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
