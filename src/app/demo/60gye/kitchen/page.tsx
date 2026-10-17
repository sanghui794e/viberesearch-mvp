'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Printer, Check, X, ShieldCheck, HelpCircle, Volume2, 
  Clock, ShoppingBag, MapPin, Phone, AlertCircle, ArrowLeft, RefreshCw,
  PauseCircle, Play, AlertTriangle, BarChart3, Users, Settings, Search,
  Download, ChevronRight, Calendar, DollarSign, CheckCircle2, Wine,
  TrendingUp, CheckSquare, Square
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
  cancelReason?: string;
  rewardPoints?: number;
}

export interface BusyConfig {
  takeoutMin: number;
  deliveryMin: number;
}

export interface MenuItemRef {
  id: string;
  name: string;
  category: string;
}

export const ALL_MENU_ITEMS: MenuItemRef[] = [
  { id: 'chamjimal', name: '참지마라치킨', category: '치킨' },
  { id: 'ccc', name: '크크크치킨', category: '치킨' },
  { id: 'crang', name: '크랑이치킨', category: '치킨' },
  { id: 'horang', name: '호랑이치킨', category: '치킨' },
  { id: 'gochu', name: '고추치킨', category: '치킨' },
  { id: 'ganji', name: '간지치킨', category: '치킨' },
  { id: 'fry', name: '후라이드치킨', category: '치킨' },
  { id: 'yangnyeom', name: '옛날양념치킨', category: '치킨' },
  { id: 'more_gochu', name: '더매운고추치킨', category: '치킨' },
  { id: 'hahahat', name: '하하핫치킨', category: '치킨' },
  { id: 'puhahat', name: '푸하핫치킨', category: '치킨' },
  { id: 'zuran', name: '쯔란콤보 / 순살', category: '치킨' },
  { id: 'half_custom', name: '내 맘대로 반반치킨', category: '반반치킨' },
  { id: 'half_fry_yang', name: '후라이드 반 + 양념 반', category: '반반치킨' },
  { id: 'ccc_crang_half', name: '크크크 반 + 크랑이 반', category: '반반치킨' },
  { id: 'set_cheeseball', name: '치즈볼엔 순살', category: '순살세트' },
  { id: 'set_menbosha', name: '멘보샤엔 순살', category: '순살세트' },
  { id: 'set_tteokbokki', name: '떡볶이엔 순살', category: '순살세트' },
  { id: 'part_wing15', name: '윙만 15조각', category: '부분육' },
  { id: 'part_bong15', name: '봉만 15조각', category: '부분육' },
  { id: 'part_leg12', name: '다리 12조각', category: '부분육' },
  { id: 'side_mini_cheeseball', name: '미니 쫀득볼', category: '사이드' },
  { id: 'side_wedge', name: '웨지감자', category: '사이드' },
  { id: 'side_horang_wedge', name: '호랑이 웨지감자', category: '사이드' },
  { id: 'side_cheese_stick', name: '치즈스틱', category: '사이드' },
  { id: 'side_dumpling', name: '튀김만두', category: '사이드' },
  { id: 'side_cheeseball', name: '쫀득 치즈볼', category: '사이드' },
  { id: 'side_tteokbokki', name: '떡볶이', category: '사이드' },
  { id: 'side_jjondog', name: '쫀도그', category: '사이드' },
  { id: 'side_horang_jjondog', name: '호랑이 쫀도그', category: '사이드' },
  { id: 'side_horang_cheeseball', name: '호랑이 치즈볼', category: '사이드' },
  { id: 'side_potato_cheesestick', name: '포테이토 치즈스틱', category: '사이드' },
  { id: 'side_menbosha', name: '멘보샤', category: '사이드' },
  { id: 'side_gizzard', name: '근위튀김 (똥집튀김)', category: '사이드' },
  { id: 'side_spicy_gizzard', name: '아매워 근위튀김', category: '사이드' },
  { id: 'side_yang_gizzard', name: '양념 근위튀김', category: '사이드' },
  { id: 'drink_coke_500', name: '코카콜라 500ml', category: '음료' },
  { id: 'drink_coke_125', name: '코카콜라 1.25L', category: '음료' },
  { id: 'drink_sprite_500', name: '스프라이트 500ml', category: '음료' },
  { id: 'drink_sprite_15', name: '스프라이트 1.5L', category: '음료' },
  { id: 'alcohol_draft_1000', name: '생맥주 1000cc', category: '주류' },
  { id: 'alcohol_chamisul', name: '참이슬', category: '주류' },
  { id: 'alcohol_chumchurum', name: '처음처럼', category: '주류' },
  { id: 'alcohol_jinro', name: '진로이즈백', category: '주류' },
  { id: 'alcohol_saero', name: '새로', category: '주류' },
  { id: 'alcohol_cass', name: '카스 (병맥주)', category: '주류' },
  { id: 'alcohol_terra', name: '테라 (병맥주)', category: '주류' },
];

export const isAlcoholItem = (name: string): boolean => {
  const n = (name || '').toLowerCase();
  return ['생맥주', '소주', '참이슬', '처음처럼', '진로', '새로', '카스', '테라', '맥주', '주류'].some(k => n.includes(k));
};

export default function KitchenDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'cooking' | 'done' | 'cancelled'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundType, setSoundType] = useState<'baemin' | 'bell' | 'siren' | 'fanfare' | 'voice'>('baemin');
  const [volume, setVolume] = useState<number>(0.8);
  const [repeatPendingAlert, setRepeatPendingAlert] = useState<boolean>(true);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'kds' | 'bluetooth' | 'silent'>('kds');
  // 전광판 화면에서 지운(삭제한) 주문 ID 목록 (부활 방지 블랙리스트)
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // 거절 사유 모달 상태
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState<string>('🍗 재료 소진 / 품절');
  const [customRejectReason, setCustomRejectReason] = useState<string>('');
  const [alsoPauseStoreOnReject, setAlsoPauseStoreOnReject] = useState<boolean>(false);

  // 매장 주문 일시정지 (품절 접수 중단) 상태
  const [isStorePaused, setIsStorePaused] = useState<boolean>(false);
  const [pauseModalOpen, setPauseModalOpen] = useState<boolean>(false);
  const [pauseReasonInput, setPauseReasonInput] = useState<string>('매장 주문 폭주로 인해 잠시 주문 접수를 일시 정지합니다.');

  // 피크타임 및 매장 맞춤 설정 상태
  const [busyLevel, setBusyLevel] = useState<'normal' | 'busy' | 'peak'>('normal');
  const [customTimes, setCustomTimes] = useState<{
    normal: BusyConfig;
    busy: BusyConfig;
    peak: BusyConfig;
  }>({
    normal: { takeoutMin: 20, deliveryMin: 40 },
    busy: { takeoutMin: 35, deliveryMin: 50 },
    peak: { takeoutMin: 50, deliveryMin: 65 },
  });
  const [customNotice, setCustomNotice] = useState<string>('');
  const [soldOutMenuIds, setSoldOutMenuIds] = useState<string[]>([]);

  // 매장 설정 모달 및 편집용 임시 상태
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [settingsModalTab, setSettingsModalTab] = useState<'time' | 'notice' | 'soldout' | 'sound'>('time');
  const [tempCustomTimes, setTempCustomTimes] = useState<{
    normal: BusyConfig;
    busy: BusyConfig;
    peak: BusyConfig;
  }>({
    normal: { takeoutMin: 20, deliveryMin: 40 },
    busy: { takeoutMin: 35, deliveryMin: 50 },
    peak: { takeoutMin: 50, deliveryMin: 65 },
  });
  const [tempCustomNotice, setTempCustomNotice] = useState<string>('');
  const [tempSoldOutMenuIds, setTempSoldOutMenuIds] = useState<string[]>([]);
  const [soldOutCategoryFilter, setSoldOutCategoryFilter] = useState<string>('all');
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState<boolean>(false);

  // 상단 메인 탭 (전광판 / 매출 통계 / 고객 장부)
  const [activeMainTab, setActiveMainTab] = useState<'orders' | 'analytics' | 'crm'>('orders');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'today' | 'month' | 'year' | 'all'>('today');
  const [crmSearchQuery, setCrmSearchQuery] = useState<string>('');
  const [selectedCrmCustomer, setSelectedCrmCustomer] = useState<{ name: string; phone: string } | null>(null);

  // 서버에 매장 설정 실시간 업데이트
  const updateStoreSettingsOnServer = async (partialSettings: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialSettings),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.storeSettings) {
          if (data.storeSettings.busyLevel) setBusyLevel(data.storeSettings.busyLevel);
          if (data.storeSettings.customTimes) {
            setCustomTimes(data.storeSettings.customTimes);
            setTempCustomTimes(data.storeSettings.customTimes);
          }
          if (data.storeSettings.customNotice !== undefined) {
            setCustomNotice(data.storeSettings.customNotice);
            setTempCustomNotice(data.storeSettings.customNotice);
          }
          if (Array.isArray(data.storeSettings.soldOutMenuIds)) {
            setSoldOutMenuIds(data.storeSettings.soldOutMenuIds);
            setTempSoldOutMenuIds(data.storeSettings.soldOutMenuIds);
          }
        }
        return true;
      }
    } catch (err) {
      console.error('Update store settings error:', err);
    }
    return false;
  };

  const prevOrderCountRef = useRef<number>(0);
  const prevOrdersRef = useRef<Order[]>([]);
  const isInitialLoadRef = useRef<boolean>(true);

  // 고객 주문 취소 감지 시 음성 낭독 (경보음 없이 차분하게 "주문이 취소되었습니다."만 방송)
  const playOrderCancelledVoice = () => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance('주문이 취소되었습니다.');
        utter.lang = 'ko-KR';
        utter.volume = Math.min(1, volume * 1.3);
        utter.rate = 1.0;
        utter.pitch = 1.0;
        window.speechSynthesis.speak(utter);
      }
    } catch (e) {
      console.warn('Voice cancel announce error:', e);
    }
  };

  // 로컬 저장소에서 지운 주문 ID 목록 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDismissed = localStorage.getItem('youngwol_dismissed_orders');
        if (savedDismissed) {
          const parsed = JSON.parse(savedDismissed);
          if (Array.isArray(parsed)) setDismissedIds(parsed);
        }
      } catch (e) {}
    }
  }, []);

  // 취소된 주문 카드를 주방 전광판 및 서버에서 즉시 영구 제거 (부활 원천 차단)
  const dismissOrder = async (orderId: string) => {
    // 1. 화면 상태에서 즉시 제거
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);

    // 2. 브라우저 블랙리스트에 등록하여 1.5초 서버 폴링 시에도 절대 재등장하지 못하도록 차단
    const nextDismissed = Array.from(new Set([...dismissedIds, orderId]));
    setDismissedIds(nextDismissed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('youngwol_dismissed_orders', JSON.stringify(nextDismissed));
      localStorage.setItem('youngwol_orders', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }

    // 3. 중앙 클라우드 영구 저장소(Gist)에서도 DELETE API 호출로 영구 삭제
    try {
      await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' });
    } catch (e) {
      console.log('Dismiss order server DELETE error:', e);
    }
  };

  // 중앙 서버 실시간 주문 Polling 및 동기화
  const loadOrders = async () => {
    try {
      const res = await fetch(`/api/orders?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.ok) {
          if (Array.isArray(json.orders)) {
            const serverOrders: Order[] = json.orders;
            
            // 취소된 주문 감지 (이전에는 취소가 아니었는데 이번에 cancelled가 된 경우)
            if (!isInitialLoadRef.current && prevOrdersRef.current.length > 0) {
              const newlyCancelled = serverOrders.find(so => 
                so.status === 'cancelled' && 
                prevOrdersRef.current.some(po => po.id === so.id && po.status !== 'cancelled')
              );
              if (newlyCancelled) {
                playOrderCancelledVoice();
              } else if (serverOrders.length > prevOrderCountRef.current) {
                if (soundEnabled) {
                  playAlertSound();
                }
              }
            }
            prevOrdersRef.current = serverOrders;
            prevOrderCountRef.current = serverOrders.length;
            isInitialLoadRef.current = false;

            // 지운 주문(dismissed)은 서버에서 내려오더라도 화면 표시 및 저장에서 제외
            let currentDismissed: string[] = dismissedIds;
            if (typeof window !== 'undefined') {
              try {
                const storedD = localStorage.getItem('youngwol_dismissed_orders');
                if (storedD) currentDismissed = JSON.parse(storedD);
              } catch (e) {}
            }
            const activeOrders = serverOrders.filter(o => !currentDismissed.includes(o.id));

            setOrders(activeOrders);
            if (typeof window !== 'undefined') {
              localStorage.setItem('youngwol_orders', JSON.stringify(activeOrders));
            }
          }
          if (json.storeSettings) {
            setIsStorePaused(!!json.storeSettings.isPaused);
            if (json.storeSettings.pauseReason) setPauseReasonInput(json.storeSettings.pauseReason);
            if (json.storeSettings.busyLevel) setBusyLevel(json.storeSettings.busyLevel);
            if (json.storeSettings.customTimes) {
              setCustomTimes(json.storeSettings.customTimes);
            }
            if (json.storeSettings.customNotice !== undefined) {
              setCustomNotice(json.storeSettings.customNotice);
            }
            if (Array.isArray(json.storeSettings.soldOutMenuIds)) {
              setSoldOutMenuIds(json.storeSettings.soldOutMenuIds);
            }
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

    // 로컬 저장소에서 사운드 설정 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedType = localStorage.getItem('youngwol_kitchen_sound_type');
        if (savedType && ['baemin', 'bell', 'siren', 'fanfare', 'voice'].includes(savedType)) {
          setSoundType(savedType as any);
        }
        const savedVol = localStorage.getItem('youngwol_kitchen_sound_volume');
        if (savedVol) {
          const v = parseFloat(savedVol);
          if (!isNaN(v) && v >= 0 && v <= 1) setVolume(v);
        }
        const savedRepeat = localStorage.getItem('youngwol_kitchen_repeat_alert');
        if (savedRepeat !== null) {
          setRepeatPendingAlert(savedRepeat === 'true');
        }
      } catch (e) {}
    }
  }, []);

  // 브라우저 오디오 잠금 해제 헬퍼 (첫 클릭 시 자동 활성화)
  const unlockAudioContext = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const tempCtx = new AudioCtx();
        if (tempCtx.state === 'suspended') {
          tempCtx.resume().then(() => {
            setIsAudioUnlocked(true);
          });
        } else {
          setIsAudioUnlocked(true);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handleFirstUserInteraction = () => {
      unlockAudioContext();
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('touchstart', handleFirstUserInteraction);
    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, []);

  // 음원 생성 및 알림음 재생 엔진
  const playAlertSound = (customType?: 'baemin' | 'bell' | 'siren' | 'fanfare' | 'voice', customVol?: number) => {
    if (!soundEnabled) return;
    const typeToPlay = customType || soundType;
    const vol = typeof customVol === 'number' ? customVol : volume;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      setIsAudioUnlocked(true);

      const now = audioCtx.currentTime;

      // 1. 배민 스타일 띵동 (2단 카랑카랑한 차임벨)
      if (typeToPlay === 'baemin') {
        // 첫 번째 톤 (도 C5: 523Hz)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now);
        gain1.gain.setValueAtTime(vol * 0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.45);

        // 두 번째 톤 (솔 G5: 783.99Hz)
        setTimeout(() => {
          try {
            const now2 = audioCtx.currentTime;
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(783.99, now2);
            gain2.gain.setValueAtTime(vol * 0.5, now2);
            gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.7);
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start(now2);
            osc2.stop(now2 + 0.7);
          } catch (e) {}
        }, 160);
      } 
      // 2. 매장 카운터 벨 (땡~~ 맑고 높은 종소리)
      else if (typeToPlay === 'bell') {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(1046.5, now); // C6
        osc2.frequency.setValueAtTime(2093.0, now); // C7 (배음)
        gain.gain.setValueAtTime(vol * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
      }
      // 3. 주방 비상 경보 (삐-삐-삐 3연타)
      else if (typeToPlay === 'siren') {
        [0, 180, 360].forEach((delay) => {
          setTimeout(() => {
            try {
              const nowS = audioCtx.currentTime;
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'square';
              osc.frequency.setValueAtTime(880, nowS); // A5
              gain.gain.setValueAtTime(vol * 0.25, nowS);
              gain.gain.exponentialRampToValueAtTime(0.001, nowS + 0.14);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start(nowS);
              osc.stop(nowS + 0.14);
            } catch (e) {}
          }, delay);
        });
      }
      // 4. 경쾌한 팡파레 멜로디 (도-미-솔-도)
      else if (typeToPlay === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          setTimeout(() => {
            try {
              const nowF = audioCtx.currentTime;
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, nowF);
              gain.gain.setValueAtTime(vol * 0.35, nowF);
              gain.gain.exponentialRampToValueAtTime(0.001, nowF + (idx === 3 ? 0.6 : 0.2));
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start(nowF);
              osc.stop(nowF + (idx === 3 ? 0.6 : 0.2));
            } catch (e) {}
          }, idx * 130);
        });
      }
      // 5. 한국어 음성 안내 (TTS)
      else if (typeToPlay === 'voice') {
        // 먼저 경쾌한 띵동 효과음
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(659.25, now);
        gain.gain.setValueAtTime(vol * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance('60계치킨, 새로운 주문이 접수되었습니다! 주방 화면을 확인해 주세요.');
          utter.lang = 'ko-KR';
          utter.volume = Math.min(1, vol * 1.2);
          utter.rate = 1.05;
          window.speechSynthesis.speak(utter);
        }
      }
    } catch (e) {
      console.warn('Audio Context error or blocked:', e);
    }
  };

  // 미승인(대기 중) 주문이 있을 때 15초마다 재알림 반복 타이머
  useEffect(() => {
    if (!soundEnabled || !repeatPendingAlert) return;

    const interval = setInterval(() => {
      const hasPending = orders.some(o => o.status === 'pending');
      if (hasPending) {
        playAlertSound();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [orders, soundEnabled, repeatPendingAlert, soundType, volume]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status'], cancelReason?: string) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { 
          ...ord, 
          status: newStatus,
          ...(cancelReason ? { cancelReason } : {})
        };
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
        body: JSON.stringify({ 
          id: orderId, 
          status: newStatus,
          cancelReason 
        })
      });
    } catch (e) {
      console.log('Central Server PATCH error:', e);
    }
  };

  // 매장 주문 일시정지 모드 토글
  const toggleStorePause = async (pause: boolean, reason?: string) => {
    setIsStorePaused(pause);
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isStorePaused: pause,
          pauseReason: reason || (pause ? '현재 매장 주문 폭주로 인해 잠시 주문 접수를 일시 정지합니다.' : '')
        })
      });
    } catch (e) {
      console.log('Store pause toggle error:', e);
    }
  };

  // 거절 버튼 클릭 시 모달 열기
  const handleRejectClick = (order: Order) => {
    setRejectModalOrder(order);
    setSelectedRejectReason('🍗 재료 소진 / 품절');
    setCustomRejectReason('');
    setAlsoPauseStoreOnReject(false);
  };

  // 거절 모달에서 사유 선택 후 최종 전송
  const confirmRejectOrder = async () => {
    if (!rejectModalOrder) return;
    const finalReason = selectedRejectReason === 'custom'
      ? (customRejectReason.trim() || '매장 사정으로 인한 주문 취소')
      : selectedRejectReason;

    await updateOrderStatus(rejectModalOrder.id, 'cancelled', finalReason);

    if (alsoPauseStoreOnReject) {
      await toggleStorePause(true, finalReason);
    }

    setRejectModalOrder(null);
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
      case 'bank_transfer': return '신한은행 계좌이체 (예금주: 박종숙)';
      default: return '기타문의';
    }
  };

  // 매출 분석 데이터 필터링 및 집계
  const getAnalyticsFilteredOrders = () => {
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    if (analyticsPeriod === 'all') return validOrders;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisYearStr = `${now.getFullYear()}`;

    return validOrders.filter(o => {
      const ts = o.timestamp || '';
      if (analyticsPeriod === 'today') {
        return ts.includes(todayStr) || ts.includes(`${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`);
      }
      if (analyticsPeriod === 'month') {
        return ts.includes(thisMonthStr) || ts.includes(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
      }
      if (analyticsPeriod === 'year') {
        return ts.includes(thisYearStr);
      }
      return true;
    });
  };

  const calculateSalesSummary = () => {
    const filtered = getAnalyticsFilteredOrders();
    const totalRevenue = filtered.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = filtered.length;
    const takeoutOrders = filtered.filter(o => o.orderType === 'takeout');
    const deliveryOrders = filtered.filter(o => o.orderType === 'delivery');
    const takeoutRevenue = takeoutOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const deliveryRevenue = deliveryOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // 메뉴별 집계
    const menuMap: { [key: string]: { name: string; category: string; quantity: number; revenue: number } } = {};
    filtered.forEach(o => {
      (o.items || []).forEach(item => {
        if (item.price === 0 || item.name?.includes('덤') || item.name?.includes('선물')) return;
        const key = item.name;
        if (!menuMap[key]) {
          const ref = ALL_MENU_ITEMS.find(m => m.name === item.name);
          menuMap[key] = {
            name: item.name,
            category: ref ? ref.category : (item.type || '치킨/사이드'),
            quantity: 0,
            revenue: 0,
          };
        }
        menuMap[key].quantity += item.quantity || 1;
        menuMap[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const menuList = Object.values(menuMap).sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue);

    return {
      totalRevenue,
      totalOrders,
      takeoutCount: takeoutOrders.length,
      deliveryCount: deliveryOrders.length,
      takeoutRevenue,
      deliveryRevenue,
      avgOrderValue,
      menuList,
    };
  };

  // CSV 다운로드 헬퍼 (UTF-8 BOM 포함하여 엑셀에서 한글 깨짐 원천 방지)
  const downloadSalesCsv = () => {
    const summary = calculateSalesSummary();
    const periodLabel = analyticsPeriod === 'today' ? '일간(오늘)' : analyticsPeriod === 'month' ? '월간(이번달)' : analyticsPeriod === 'year' ? '연간(올해)' : '전체기간';
    
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += `[60계치킨 영월점] 매출 통계 보고서 (${periodLabel})\n`;
    csvContent += `총 매출액,${summary.totalRevenue.toLocaleString()}원,총 주문건수,${summary.totalOrders}건\n`;
    csvContent += `방문포장 매출,${summary.takeoutRevenue.toLocaleString()}원 (${summary.takeoutCount}건),배달 매출,${summary.deliveryRevenue.toLocaleString()}원 (${summary.deliveryCount}건)\n\n`;
    csvContent += `순위,메뉴명,카테고리,판매수량(개),총매출액(원),매출비중(%)\n`;

    summary.menuList.forEach((m, idx) => {
      const share = summary.totalRevenue > 0 ? ((m.revenue / summary.totalRevenue) * 100).toFixed(1) : '0';
      csvContent += `${idx + 1},"${m.name.replace(/"/g, '""')}","${m.category}",${m.quantity},${m.revenue},${share}%\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `60계치킨_영월점_매출통계_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 고객 장부 (CRM) 집계
  const calculateCrmCustomers = () => {
    const customerMap: {
      [phone: string]: {
        name: string;
        phone: string;
        orderCount: number;
        totalSpent: number;
        totalPoints: number;
        lastOrderDate: string;
        orders: Order[];
      };
    } = {};

    orders.forEach(o => {
      if (!o.phone) return;
      if (!customerMap[o.phone]) {
        customerMap[o.phone] = {
          name: o.name || '고객',
          phone: o.phone,
          orderCount: 0,
          totalSpent: 0,
          totalPoints: 0,
          lastOrderDate: o.timestamp || '',
          orders: [],
        };
      }
      customerMap[o.phone].orders.push(o);
      if (o.status !== 'cancelled') {
        customerMap[o.phone].orderCount += 1;
        customerMap[o.phone].totalSpent += o.total || 0;
        customerMap[o.phone].totalPoints += (o.rewardPoints || Math.round((o.total || 0) * 0.02));
      }
      if (o.timestamp && (!customerMap[o.phone].lastOrderDate || o.timestamp > customerMap[o.phone].lastOrderDate)) {
        customerMap[o.phone].lastOrderDate = o.timestamp;
      }
      if (o.name && o.name !== '고객') {
        customerMap[o.phone].name = o.name;
      }
    });

    const list = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent || b.orderCount - a.orderCount);

    if (!crmSearchQuery.trim()) return list;
    const q = crmSearchQuery.trim().toLowerCase();
    return list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  };

  const downloadCrmCsv = () => {
    const customers = calculateCrmCustomers();
    let csvContent = '\uFEFF';
    csvContent += `[60계치킨 영월점] 단골 고객 포인트 및 주문 관리 장부\n`;
    csvContent += `순번,고객명,전화번호,총주문횟수,총누적결제액(원),누적보유포인트(P),최근주문일시\n`;

    customers.forEach((c, idx) => {
      csvContent += `${idx + 1},"${c.name.replace(/"/g, '""')}","${c.phone}",${c.orderCount},${c.totalSpent},${c.totalPoints},"${c.lastOrderDate}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `60계치킨_영월점_고객포인트장부_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <div className="font-bold">배달 주소: {selectedOrderForPrint.address}</div>
            )}
            {selectedOrderForPrint.requestText && (
              <div className="bg-slate-100 p-1 rounded font-bold border border-slate-300">
                요청: {selectedOrderForPrint.requestText}
              </div>
            )}
          </div>

          <div className="border-b border-black pb-2 mb-2">
            <div className="font-bold border-b border-slate-200 pb-1 mb-1 flex justify-between">
              <span>품명 [부위]</span>
              <span>수량</span>
            </div>
            {selectedOrderForPrint.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-0.5 font-bold">
                <span>{item.name} [{item.type}]</span>
                <span>{item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="text-right space-y-0.5 text-[11px]">
            <div>주문 금액: {selectedOrderForPrint.subtotal.toLocaleString()}원</div>
            {selectedOrderForPrint.discount > 0 && (
              <div>할인 (포장 혜택): -{selectedOrderForPrint.discount.toLocaleString()}원</div>
            )}
            {selectedOrderForPrint.deliveryFee > 0 && (
              <div>배달 요금: +{selectedOrderForPrint.deliveryFee.toLocaleString()}원</div>
            )}
            <div className="text-sm font-black border-t border-black pt-1 mt-1">
              최종 결제: {selectedOrderForPrint.total.toLocaleString()}원
            </div>
            {selectedOrderForPrint.rewardPoints && selectedOrderForPrint.rewardPoints > 0 && (
              <div className="text-[10px] font-bold text-black">적립 포인트 (2%): +{selectedOrderForPrint.rewardPoints.toLocaleString()}P</div>
            )}
            <div className="text-[10px] text-slate-600">결제 방식: {getPaymentLabel(selectedOrderForPrint.paymentMethod)}</div>
          </div>

          {selectedOrderForPrint.items.some(i => isAlcoholItem(i.name)) && (
            <div className="border-2 border-black p-1.5 my-2 text-center text-[10px] font-black bg-slate-100 leading-tight">
              🚨 [청소년보호법 제28조 준수의무]<br/>
              본 주문은 주류(생맥주/소주)가 포함되어 있습니다.<br/>
              수령 시 성인 실물 신분증 대면 검사 필수!
            </div>
          )}

          <div className="text-center text-[10px] mt-4 border-t border-dashed border-black pt-2">
            매일 새 기름(기름 한 통으로 60마리만!)<br/>
            맛있고 정직하게 튀겼습니다. 감사합니다!
          </div>
        </div>
      )}

      {/* Screen Header Bar */}
      <header className="bg-[#140e0c] border-b border-[#2d1d19] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link 
            href="/demo/60gye"
            className="p-2 bg-[#1f1715] hover:bg-[#2b1f1c] rounded-xl text-slate-400 hover:text-white transition-colors"
            title="고객 주문앱으로 돌아가기"
          >
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

        <div className="flex items-center gap-2 flex-wrap">
          {/* 피크타임 3단계 원터치 제어 버튼 */}
          <div className="flex items-center gap-1 bg-[#1c1310] border border-[#3d2c27] rounded-xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => updateStoreSettingsOnServer({ busyLevel: 'normal' })}
              className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                busyLevel === 'normal'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-emerald-400 hover:bg-[#251814]'
              }`}
              title={`여유 모드: 포장 ${customTimes.normal.takeoutMin}분 / 배달 ${customTimes.normal.deliveryMin}분`}
            >
              <span>🟢 여유</span>
              <span className="text-[10px] font-normal opacity-75 hidden xl:inline">({customTimes.normal.takeoutMin}분/{customTimes.normal.deliveryMin}분)</span>
            </button>
            <button
              type="button"
              onClick={() => updateStoreSettingsOnServer({ busyLevel: 'busy' })}
              className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                busyLevel === 'busy'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-amber-400 hover:bg-[#251814]'
              }`}
              title={`혼잡 모드: 포장 ${customTimes.busy.takeoutMin}분 / 배달 ${customTimes.busy.deliveryMin}분`}
            >
              <span>🟡 혼잡</span>
              <span className="text-[10px] font-normal opacity-75 hidden xl:inline">({customTimes.busy.takeoutMin}분/{customTimes.busy.deliveryMin}분)</span>
            </button>
            <button
              type="button"
              onClick={() => updateStoreSettingsOnServer({ busyLevel: 'peak' })}
              className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                busyLevel === 'peak'
                  ? 'bg-rose-600 text-white shadow animate-pulse'
                  : 'text-rose-400 hover:bg-[#251814]'
              }`}
              title={`피크 모드: 포장 ${customTimes.peak.takeoutMin}분 / 배달 ${customTimes.peak.deliveryMin}분`}
            >
              <span>🔴 피크</span>
              <span className="text-[10px] font-normal opacity-75 hidden xl:inline">({customTimes.peak.takeoutMin}분/{customTimes.peak.deliveryMin}분)</span>
            </button>
          </div>

          {/* ⚙️ 매장 설정 모달 열기 버튼 */}
          <button
            type="button"
            onClick={() => {
              setTempCustomTimes({ ...customTimes });
              setTempCustomNotice(customNotice);
              setTempSoldOutMenuIds([...soldOutMenuIds]);
              setSettingsModalOpen(true);
            }}
            className="h-9 px-3 bg-[#241712] hover:bg-[#32201a] border border-[#f39c12]/40 text-[#f39c12] text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            title="피크타임 조리시간 직접입력, 공지문구, 품절메뉴 설정"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>⚙️ 매장 설정</span>
          </button>

          {/* 매장 주문 일시정지 (품절 접수 중단) 스위치 */}
          <button
            type="button"
            onClick={() => {
              if (isStorePaused) {
                toggleStorePause(false);
              } else {
                setPauseModalOpen(true);
              }
            }}
            className={`h-9 px-3.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
              isStorePaused
                ? 'bg-red-600 hover:bg-red-500 border-red-400 text-white animate-pulse'
                : 'bg-amber-950/30 hover:bg-amber-900/50 border-amber-600/40 text-amber-300'
            }`}
            title="주문 폭주 또는 재료 준비 시 모바일 주문 일시정지"
          >
            <PauseCircle className="w-4 h-4" />
            <span>{isStorePaused ? '⚠️ [영업 일시정지 중] 해제' : '⏸️ 주문 일시정지 (품절)'}</span>
          </button>

          {/* 사운드 & 볼륨 종합 컨트롤 패널 */}
          <div className="flex items-center gap-2 bg-[#1c1310] border border-[#3d2c27] rounded-xl px-2.5 py-1">
            
            {/* 사운드 ON/OFF 버튼 */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) unlockAudioContext();
              }}
              className={`h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                soundEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' 
                  : 'bg-slate-900 text-slate-500 border border-slate-700'
              }`}
              title="주방 알림음 켜기/끄기"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{soundEnabled ? '소리 ON' : '소리 OFF'}</span>
            </button>

            {/* 알림음 종류 선택 드롭다운 */}
            <select
              value={soundType}
              disabled={!soundEnabled}
              onChange={(e) => {
                const newType = e.target.value as any;
                setSoundType(newType);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('youngwol_kitchen_sound_type', newType);
                }
                playAlertSound(newType, volume);
              }}
              className="h-8 bg-[#0d0908] border border-[#3d2c27] text-slate-200 text-xs font-bold rounded-lg px-2 focus:outline-none focus:border-[#f39c12] disabled:opacity-40"
              title="알림음 종류 선택"
            >
              <option value="baemin">🔔 배민 스타일 띵동</option>
              <option value="bell">🛎️ 매장 카운터 벨 (땡~~)</option>
              <option value="siren">🚨 주방 비상 경보 (삐-삐-삐)</option>
              <option value="fanfare">🎺 신나는 팡파레 멜로디</option>
              <option value="voice">🗣️ 한국어 음성 안내 (TTS)</option>
            </select>

            {/* 볼륨 슬라이더 (0~100%) */}
            <div className="flex items-center gap-1.5 px-1" title={`음량 조절: ${Math.round(volume * 100)}%`}>
              <span className="text-[10px] text-slate-400 font-mono font-bold">{Math.round(volume * 100)}%</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                disabled={!soundEnabled}
                value={volume}
                onChange={(e) => {
                  const newVol = parseFloat(e.target.value);
                  setVolume(newVol);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('youngwol_kitchen_sound_volume', String(newVol));
                  }
                }}
                className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#f39c12] disabled:opacity-40"
              />
            </div>

            {/* 소리 테스트 및 브라우저 잠금 해제 버튼 */}
            <button
              type="button"
              onClick={() => {
                unlockAudioContext();
                playAlertSound(soundType, volume);
              }}
              className="h-8 px-2.5 bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] font-black text-xs rounded-lg transition-all shadow active:scale-95 flex items-center gap-1 shrink-0"
              title="선택한 알림음과 볼륨으로 소리 테스트하기"
            >
              <span>🎵 테스트</span>
            </button>

            {/* 15초 미승인 반복 알림 스위치 */}
            <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer pl-1 shrink-0" title="주문을 승인할 때까지 15초마다 알림음을 반복합니다.">
              <input
                type="checkbox"
                checked={repeatPendingAlert}
                onChange={(e) => {
                  setRepeatPendingAlert(e.target.checked);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('youngwol_kitchen_repeat_alert', String(e.target.checked));
                  }
                }}
                className="rounded border-[#3d2c27] text-[#f39c12] focus:ring-0 accent-[#f39c12]"
              />
              <span className="hidden xl:inline text-[10px] font-semibold">15초 재알림</span>
            </label>

          </div>

          <button
            onClick={clearAllOrders}
            className="h-9 px-3 bg-red-950/20 border border-red-900/50 hover:bg-red-900 hover:text-white text-red-400 text-xs font-bold rounded-xl transition-all"
          >
            주문 리셋
          </button>
        </div>
      </header>

      {/* 3대 통합 모드 탭 바 (주문 전광판 / 매출 통계 & 분석 / 고객 장부 & CRM) */}
      <div className="bg-[#140e0c]/90 border-b border-[#2d1d19] px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap print:hidden">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveMainTab('orders')}
            className={`h-9 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shrink-0 ${
              activeMainTab === 'orders'
                ? 'bg-[#f39c12] text-[#1a1210] shadow-md shadow-[#f39c12]/20'
                : 'bg-[#1c1310] text-slate-400 hover:text-white border border-[#3d2c27]'
            }`}
          >
            <span>📋 실시간 주문 전광판</span>
            <span className="bg-black/30 text-current text-[11px] px-2 py-0.5 rounded-full font-bold">
              {orders.filter(o => o.status === 'pending' || o.status === 'cooking').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('analytics')}
            className={`h-9 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shrink-0 ${
              activeMainTab === 'analytics'
                ? 'bg-[#f39c12] text-[#1a1210] shadow-md shadow-[#f39c12]/20'
                : 'bg-[#1c1310] text-slate-400 hover:text-white border border-[#3d2c27]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 매출 통계 & 분석</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('crm')}
            className={`h-9 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shrink-0 ${
              activeMainTab === 'crm'
                ? 'bg-[#f39c12] text-[#1a1210] shadow-md shadow-[#f39c12]/20'
                : 'bg-[#1c1310] text-slate-400 hover:text-white border border-[#3d2c27]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 고객 장부 & CRM</span>
          </button>
        </div>

        {/* 현재 피크타임 모드 및 공지 요약 뱃지 */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 border ${
            busyLevel === 'normal' 
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50'
              : busyLevel === 'busy'
                ? 'bg-amber-950/40 text-amber-300 border-amber-700/50'
                : 'bg-rose-950/40 text-rose-300 border-rose-700/50 animate-pulse'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>
              {busyLevel === 'normal' ? '🟢 여유 모드' : busyLevel === 'busy' ? '🟡 혼잡 모드' : '🔴 피크타임'}
            </span>
            <span className="text-[10px] opacity-75 font-mono">
              (포장 {busyLevel === 'normal' ? customTimes.normal.takeoutMin : busyLevel === 'busy' ? customTimes.busy.takeoutMin : customTimes.peak.takeoutMin}분 / 
               배달 {busyLevel === 'normal' ? customTimes.normal.deliveryMin : busyLevel === 'busy' ? customTimes.busy.deliveryMin : customTimes.peak.deliveryMin}분)
            </span>
          </div>

          {soldOutMenuIds.length > 0 && (
            <span className="bg-rose-950/60 border border-rose-700/50 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-bold">
              🚫 품절 {soldOutMenuIds.length}개
            </span>
          )}
        </div>
      </div>

      {/* Main Layout Content */}
      {activeMainTab === 'orders' && (
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        
        {/* Left 2 Cols: Orders Board */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Header & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2d1d19] pb-3 gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  filterTab === 'all'
                    ? 'bg-[#f39c12] text-[#1a1210] shadow'
                    : 'bg-[#1c1310] text-slate-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                전체 ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  filterTab === 'pending'
                    ? 'bg-amber-500 text-[#1a1210] shadow'
                    : 'bg-[#1c1310] text-amber-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                <span>대기 🔔</span>
                <span>({orders.filter(o => o.status === 'pending').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('cooking')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  filterTab === 'cooking'
                    ? 'bg-orange-500 text-white shadow'
                    : 'bg-[#1c1310] text-orange-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                <span>조리 중 🔥</span>
                <span>({orders.filter(o => o.status === 'cooking').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('done')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  filterTab === 'done'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'bg-[#1c1310] text-emerald-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                <span>완료 🛍️</span>
                <span>({orders.filter(o => o.status === 'done').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('cancelled')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                  filterTab === 'cancelled'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-[#1c1310] text-red-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                <span>거절/취소 🚫</span>
                <span>({orders.filter(o => o.status === 'cancelled').length})</span>
              </button>
            </div>

            <button 
              onClick={loadOrders}
              className="text-xs text-[#f39c12] hover:underline font-semibold flex items-center gap-1 shrink-0 self-end sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>새로고침</span>
            </button>
          </div>

          {/* Filtered Orders List */}
          {(() => {
            const filteredOrders = orders.filter(o => {
              if (filterTab === 'all') return true;
              return o.status === filterTab;
            });

            if (filteredOrders.length === 0) {
              return (
                <div className="bg-[#1c1310] border border-[#3d2c27] rounded-3xl p-12 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                  <h3 className="text-sm font-bold text-white">
                    {filterTab === 'all' 
                      ? '접수된 주문이 없습니다.' 
                      : filterTab === 'pending' 
                        ? '대기 중인 신규 주문이 없습니다.'
                        : filterTab === 'cooking'
                          ? '현재 조리 중인 치킨이 없습니다.'
                          : filterTab === 'done'
                            ? '완료된 주문이 없습니다.'
                            : '취소/거절된 주문이 없습니다.'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    손님이 스마트폰 주문앱에서 주문을 완료하면 실시간으로 띵동 소리와 함께 이곳에 주문 카드가 똬악 뜹니다!
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    className={`bg-[#1c1310] border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                      order.status === 'pending' 
                        ? 'border-[#f39c12] shadow-lg shadow-[#f39c12]/15 ring-2 ring-[#f39c12]/40' 
                        : order.status === 'cooking'
                          ? 'border-orange-500/70 shadow-lg shadow-orange-500/10'
                          : order.status === 'done'
                            ? 'border-emerald-500/40 bg-[#161412]'
                            : 'border-red-600/50 bg-[#190d0b]'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header line */}
                      <div className="flex justify-between items-start border-b border-[#2d1d19] pb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 font-mono">#{order.id.slice(-6)}</span>
                            <span className="text-[10px] text-slate-400">• {order.timestamp}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-white mt-0.5">{order.name} 님</h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                            order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                              : order.status === 'cooking'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                                : order.status === 'done'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}>
                            {order.status === 'pending' 
                              ? '⏳ 승인 대기' 
                              : order.status === 'cooking' 
                                ? '🔥 조리 중' 
                                : order.status === 'done'
                                  ? '🛍️ 준비 완료'
                                  : '🚫 주문 거절됨'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            order.orderType === 'takeout' 
                              ? 'bg-[#f39c12]/15 text-[#f39c12] border border-[#f39c12]/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {order.orderType === 'takeout' ? '방문 포장' : '배달'}
                          </span>
                          {/* 동일 고객 다중 주문 감지 뱃지 */}
                          {orders.filter(o => o.id !== order.id && o.phone === order.phone && o.status !== 'cancelled').length > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                              ⚡ 동일고객 추가주문
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 거절된 주문인 경우 사유 표시 */}
                      {order.status === 'cancelled' && (
                        <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-2.5 text-xs text-red-350 space-y-1">
                          <div className="font-bold text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>고객에게 전송된 거절 사유</span>
                          </div>
                          <p className="text-[11px] text-slate-200 pl-4 border-l border-red-500/40">
                            {order.cancelReason || '🍗 재료 소진 / 품절'}
                          </p>
                        </div>
                      )}

                      {/* 대형 조리/방문 완료 목표 시간 뱃지 */}
                      {order.status !== 'cancelled' && (
                        <div className="bg-[#241712] border border-[#f39c12]/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold text-slate-400">조리/방문 목표</span>
                          <span className="text-sm font-black text-[#f39c12] flex items-center gap-1">
                            <Clock className="w-4 h-4 text-[#f39c12]" />
                            <span>{order.targetPickupTime || '18:10'} 완료</span>
                            <span className="text-[9px] text-slate-400 font-normal">({order.pickupTime || '45분 뒤'})</span>
                          </span>
                        </div>
                      )}

                      {/* 주류 포함 주문 미성년자 신분증 대면 검사 경고 뱃지 */}
                      {order.items.some(i => isAlcoholItem(i.name)) && (
                        <div className="bg-rose-950/60 border border-rose-500/80 rounded-xl p-2.5 flex items-center gap-2 text-rose-200 text-xs font-bold shadow-sm animate-pulse">
                          <Wine className="w-4 h-4 text-rose-400 shrink-0" />
                          <div className="leading-tight">
                            <span className="text-rose-300 font-black">🚨 [주류 포함]</span> 수령 시 성인 신분증 대면 검사 필수!
                            <span className="block text-[10px] text-rose-400 font-normal mt-0.5">청소년보호법 제28조 신분증 대면 확인 의무</span>
                          </div>
                        </div>
                      )}

                      {/* Order Details */}
                      <div className="space-y-1 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="font-mono">{order.phone}</span>
                        </div>
                        {order.orderType === 'delivery' && (
                          <div className="flex items-start gap-1.5 text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />
                            <span className="leading-tight">{order.address || '주소 정보 없음'}</span>
                          </div>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="bg-[#0e0908] border border-[#2b1d19] rounded-xl p-3 space-y-2">
                        <h5 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">주문 제품</h5>
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => {
                            const isFreeGift = item.price === 0 || item.name?.includes('선물') || item.name?.includes('서비스');
                            return (
                              <div 
                                key={idx} 
                                className={`flex justify-between items-center text-xs p-1.5 rounded-lg transition-all ${
                                  isFreeGift 
                                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200 shadow-sm' 
                                    : ''
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <span className={`font-bold ${isFreeGift ? 'text-amber-200 font-black' : 'text-white'}`}>
                                    {item.name} 
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded ml-1.5 font-bold ${
                                      isFreeGift 
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                        : 'bg-[#f39c12]/10 text-[#f39c12]'
                                    }`}>
                                      {item.type}
                                    </span>
                                    {item.isCustom && item.customDetails && (
                                      <span className="block text-[9px] text-red-400 mt-0.5 font-normal italic">*요구사항: {item.customDetails}</span>
                                    )}
                                    {isFreeGift && (
                                      <span className="block text-[9px] text-amber-300 font-black mt-0.5 animate-pulse">
                                        ⚡ [자사몰 덤 서비스] 튀김 포장백 동봉 필수!
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <span className={`font-black shrink-0 ${isFreeGift ? 'text-amber-300 text-sm' : 'text-slate-400'}`}>
                                  {item.quantity}개
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Request text */}
                      {order.requestText && (
                        <div className="text-[11px] bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl text-amber-300 italic leading-snug">
                          <strong>요청:</strong> "{order.requestText}"
                        </div>
                      )}
                    </div>

                    {/* Actions & Price */}
                    <div className="border-t border-[#2d1d19] pt-3 mt-4 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] text-slate-500 block">결제: {getPaymentLabel(order.paymentMethod)}</span>
                        <span className="text-sm font-black text-white">{order.total.toLocaleString()}원</span>
                      </div>

                      {/* Action Buttons by Status */}
                      <div className="flex gap-1.5 items-center">
                        <button
                          type="button"
                          onClick={() => handlePrintClick(order)}
                          title="영수증 인쇄"
                          className="h-8 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#3d2c27] hover:border-[#f39c12] text-slate-300 flex items-center gap-1 transition-all text-xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-400" />
                          <span className="hidden sm:inline text-[10px]">인쇄</span>
                        </button>

                        {order.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRejectClick(order)}
                              title="주문 거절 및 사유 선택"
                              className="h-8 px-3 rounded-xl bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-400 hover:text-white flex items-center gap-1 transition-colors text-xs font-bold active:scale-95"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>거절</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'cooking')}
                              className="h-8 px-3.5 bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] font-black rounded-xl text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
                            >
                              <span>🔥 조리 시작</span>
                            </button>
                          </>
                        )}

                        {order.status === 'cooking' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'done')}
                            className="h-8 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs flex items-center gap-1 transition-all shadow-md active:scale-95 animate-pulse"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>🛍️ 조리 완료</span>
                          </button>
                        )}

                        {order.status === 'done' && (
                          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2.5 py-1.5 rounded-xl">
                            완료 처리됨 ✅
                          </span>
                        )}

                        {order.status === 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => dismissOrder(order.id)}
                            className="h-9 px-4 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-lg flex items-center gap-1.5 animate-pulse"
                            title="이 취소 주문을 확인하고 주방 화면에서 즉시 지웁니다."
                          >
                            <span>🗑️ 거절/취소 확인 (화면에서 지우기 ✕)</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            );
          })()}
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
      )}

      {/* 2. 매출 분석 탭 뷰 */}
      {activeMainTab === 'analytics' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6 print:hidden">
          {/* 상단 필터 및 다운로드 바 */}
          <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#f39c12]" />
                <span>60계치킨 영월점 매출 통계 및 판매 분석</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                실제 접수 및 완료된 주문 데이터 기반 실시간 집계 (취소/거절 주문 자동 제외)
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* 기간 선택 탭 */}
              <div className="flex items-center bg-[#140b09] border border-[#3d2c27] rounded-xl p-1">
                {(['today', 'month', 'year', 'all'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setAnalyticsPeriod(period)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      analyticsPeriod === period
                        ? 'bg-[#f39c12] text-[#1a1210] shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {period === 'today' ? '오늘 (일간)' : period === 'month' ? '이번달 (월간)' : period === 'year' ? '올해 (연간)' : '전체'}
                  </button>
                ))}
              </div>

              {/* 엑셀 다운로드 버튼 */}
              <button
                type="button"
                onClick={downloadSalesCsv}
                className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                title="엑셀(CSV) 파일로 저장하여 세무/회계 장부로 활용"
              >
                <Download className="w-4 h-4" />
                <span>엑셀(CSV) 다운로드</span>
              </button>
            </div>
          </div>

          {/* 매출 요약 카드 4종 */}
          {(() => {
            const summary = calculateSalesSummary();
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#f39c12]" /> 총 매출액 ({analyticsPeriod === 'today' ? '오늘' : analyticsPeriod === 'month' ? '이번달' : analyticsPeriod === 'year' ? '올해' : '전체'})
                    </span>
                    <div className="text-2xl font-black text-[#f39c12]">
                      {summary.totalRevenue.toLocaleString()} <span className="text-sm font-normal text-slate-300">원</span>
                    </div>
                    <div className="text-[10px] text-slate-500">실 결제 금액 합산 (포장할인 반영)</div>
                  </div>

                  <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> 총 주문 건수
                    </span>
                    <div className="text-2xl font-black text-white">
                      {summary.totalOrders} <span className="text-sm font-normal text-slate-300">건</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold">
                      포장 {summary.takeoutCount}건 / 배달 {summary.deliveryCount}건
                    </div>
                  </div>

                  <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> 평균 객단가
                    </span>
                    <div className="text-2xl font-black text-white">
                      {summary.avgOrderValue.toLocaleString()} <span className="text-sm font-normal text-slate-300">원</span>
                    </div>
                    <div className="text-[10px] text-slate-500">주문 1건당 평균 결제금액</div>
                  </div>

                  <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" /> 포장 vs 배달 비율
                    </span>
                    <div className="text-sm font-black text-slate-200 pt-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-amber-400">🛍️ 포장: {summary.totalRevenue > 0 ? ((summary.takeoutRevenue / summary.totalRevenue) * 100).toFixed(0) : 0}%</span>
                        <span className="text-emerald-400">🛵 배달: {summary.totalRevenue > 0 ? ((summary.deliveryRevenue / summary.totalRevenue) * 100).toFixed(0) : 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-[#f39c12] h-full" 
                          style={{ width: `${summary.totalRevenue > 0 ? (summary.takeoutRevenue / summary.totalRevenue) * 100 : 50}%` }}
                        />
                        <div 
                          className="bg-emerald-500 h-full" 
                          style={{ width: `${summary.totalRevenue > 0 ? (summary.deliveryRevenue / summary.totalRevenue) * 100 : 50}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 메뉴별 판매 수량 및 매출 순위 랭킹 표 */}
                <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 border-b border-[#2d1d19] flex justify-between items-center bg-[#140b09]">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>🍗 메뉴별 판매 순위 및 매출 기여도 랭킹</span>
                      <span className="text-xs text-slate-500 font-normal">({summary.menuList.length}개 메뉴 판매됨)</span>
                    </h3>
                  </div>

                  {summary.menuList.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">
                      선택한 기간 동안 판매된 메뉴 데이터가 없습니다.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#190d0b] text-slate-400 border-b border-[#2d1d19]">
                          <tr>
                            <th className="py-3 px-4 font-bold text-center w-16">순위</th>
                            <th className="py-3 px-4 font-bold">메뉴명</th>
                            <th className="py-3 px-4 font-bold">카테고리</th>
                            <th className="py-3 px-4 font-bold text-right">판매 수량</th>
                            <th className="py-3 px-4 font-bold text-right">총 판매 금액</th>
                            <th className="py-3 px-4 font-bold text-right">매출 비중</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d1d19]">
                          {summary.menuList.map((m, idx) => {
                            const share = summary.totalRevenue > 0 ? ((m.revenue / summary.totalRevenue) * 100).toFixed(1) : '0';
                            return (
                              <tr key={idx} className="hover:bg-[#251814] transition-colors">
                                <td className="py-3 px-4 text-center font-bold">
                                  {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `${idx + 1}`}
                                </td>
                                <td className="py-3 px-4 font-extrabold text-white">
                                  {m.name}
                                </td>
                                <td className="py-3 px-4 text-slate-400">
                                  <span className="bg-[#140b09] px-2 py-0.5 rounded border border-[#3d2c27] text-[10px]">
                                    {m.category}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-amber-300">
                                  {m.quantity.toLocaleString()} 개
                                </td>
                                <td className="py-3 px-4 text-right font-black text-white">
                                  {m.revenue.toLocaleString()} 원
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-bold text-slate-400">
                                  {share}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </main>
      )}

      {/* 3. 고객 장부 & CRM 탭 뷰 */}
      {activeMainTab === 'crm' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6 print:hidden">
          {/* 상단 헤더 & 검색 & 다운로드 */}
          <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#f39c12]" />
                <span>단골 고객 포인트 장부 & 주문 이력 관리 (CRM)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                전화번호별 누적 포인트, 주문 횟수, 총 결제액 및 과거 주문 내역 상세 조회
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* 고객 검색창 */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={crmSearchQuery}
                  onChange={(e) => setCrmSearchQuery(e.target.value)}
                  placeholder="고객명 또는 전화번호 검색..."
                  className="h-9 bg-[#140b09] border border-[#3d2c27] focus:border-[#f39c12] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none w-52"
                />
              </div>

              {/* 엑셀 다운로드 버튼 */}
              <button
                type="button"
                onClick={downloadCrmCsv}
                className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                title="고객 명부 및 포인트 장부 엑셀(CSV) 다운로드"
              >
                <Download className="w-4 h-4" />
                <span>고객장부 엑셀 다운로드</span>
              </button>
            </div>
          </div>

          {/* CRM 통계 카드 */}
          {(() => {
            const customers = calculateCrmCustomers();
            const totalCustomers = customers.length;
            const totalPointsSum = customers.reduce((s, c) => s + c.totalPoints, 0);
            const repeatCustomers = customers.filter(c => c.orderCount >= 2).length;

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#f39c12]" /> 등록 단골 고객 수
                    </span>
                    <div className="text-2xl font-black text-white">
                      {totalCustomers} <span className="text-sm font-normal text-slate-300">명</span>
                    </div>
                    <div className="text-[10px] text-slate-500">자사몰 주문 기록 보유 고객</div>
                  </div>

                  <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" /> 총 누적 포인트 잔액
                    </span>
                    <div className="text-2xl font-black text-[#f39c12]">
                      {totalPointsSum.toLocaleString()} <span className="text-sm font-normal text-slate-300">P</span>
                    </div>
                    <div className="text-[10px] text-slate-500">고객들에게 적립된 총 포인트 (2%)</div>
                  </div>

                  <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl p-5 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> 재주문 단골 고객 (2회 이상)
                    </span>
                    <div className="text-2xl font-black text-emerald-400">
                      {repeatCustomers} <span className="text-sm font-normal text-slate-300">명</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      재주문율: {totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>

                {/* 고객 목록 테이블 */}
                <div className="bg-[#1c1310] border border-[#3d2c27] rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 border-b border-[#2d1d19] flex justify-between items-center bg-[#140b09]">
                    <h3 className="text-sm font-black text-white">
                      고객별 누적 포인트 및 주문 집계 명부
                    </h3>
                  </div>

                  {customers.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">
                      검색 조건에 맞는 고객 정보가 없습니다.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#190d0b] text-slate-400 border-b border-[#2d1d19]">
                          <tr>
                            <th className="py-3 px-4 font-bold">고객명</th>
                            <th className="py-3 px-4 font-bold">전화번호</th>
                            <th className="py-3 px-4 font-bold text-center">주문 횟수</th>
                            <th className="py-3 px-4 font-bold text-right">총 누적 결제액</th>
                            <th className="py-3 px-4 font-bold text-right">누적 포인트 (2%)</th>
                            <th className="py-3 px-4 font-bold">최근 주문 일시</th>
                            <th className="py-3 px-4 font-bold text-center">상세 이력</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d1d19]">
                          {customers.map((c, idx) => (
                            <tr key={idx} className="hover:bg-[#251814] transition-colors">
                              <td className="py-3 px-4 font-extrabold text-white">
                                {c.name} 님
                              </td>
                              <td className="py-3 px-4 font-mono text-slate-300">
                                {c.phone}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.orderCount >= 3 
                                    ? 'bg-purple-950/60 text-purple-300 border border-purple-700/60' 
                                    : c.orderCount >= 2
                                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60'
                                      : 'bg-slate-900 text-slate-400 border border-slate-700'
                                }`}>
                                  {c.orderCount} 회 {c.orderCount >= 3 && '👑 VIP'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-extrabold text-white">
                                {c.totalSpent.toLocaleString()} 원
                              </td>
                              <td className="py-3 px-4 text-right font-black text-[#f39c12]">
                                +{c.totalPoints.toLocaleString()} P
                              </td>
                              <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                                {c.lastOrderDate || '-'}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => setSelectedCrmCustomer({ name: c.name, phone: c.phone })}
                                  className="px-2.5 py-1 bg-[#241712] hover:bg-[#32201a] border border-[#f39c12]/40 text-[#f39c12] text-[11px] font-bold rounded-lg transition-all"
                                >
                                  🔍 주문 이력 ({c.orders.length})
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </main>
      )}

      {/* REJECTION REASON MODAL DIALOG */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1310] border-2 border-red-500/60 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setRejectModalOrder(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white text-lg font-bold"
            >
              ×
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-800 inline-block">
                주문 취소 및 거절 사유 선택
              </span>
              <h3 className="text-base font-black text-white">
                {rejectModalOrder.name} 님의 주문을 거절하시겠습니까?
              </h3>
              <p className="text-xs text-slate-400">
                선택하신 사유는 고객님의 스마트폰 화면에 즉시 정중한 안내문으로 표시됩니다.
              </p>
            </div>

            {/* Quick Reason Buttons */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-350 block">거절 사유 선택</label>
              {[
                { id: '🍗 재료 소진 / 품절', text: '🍗 [재료 소진/품절] 주문하신 치킨 재료가 모두 소진되었습니다.' },
                { id: '🔥 매장 주문 폭주 / 조리 지연', text: '🔥 [매장 주문 폭주] 현재 주문 폭주로 추가 조리가 어렵습니다.' },
                { id: '🌙 영업 마감 (주문 조기 마감)', text: '🌙 [영업 마감] 금일 매장 영업 및 주문 접수가 마감되었습니다.' },
                { id: '🛵 배달 불가 지역 / 기상 악화', text: '🛵 [배달 불가] 기상 악화 또는 배달 불가 지역입니다.' },
                { id: '📞 고객 요청에 의한 취소', text: '📞 [고객 요청] 고객님의 유선 요청으로 주문을 취소합니다.' },
                { id: 'custom', text: '✍️ 직접 사유 입력하기' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedRejectReason(item.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all border ${
                    selectedRejectReason === item.id
                      ? 'bg-red-950/60 border-red-500 text-white shadow-md'
                      : 'bg-[#140b09] border-[#3d2c27] text-slate-300 hover:border-red-900'
                  }`}
                >
                  {item.text}
                </button>
              ))}

              {selectedRejectReason === 'custom' && (
                <textarea
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  placeholder="고객님께 전달할 정중한 취소 사유를 입력해 주세요."
                  className="w-full h-20 bg-[#140b09] border border-[#3d2c27] focus:border-red-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              )}
            </div>

            {/* Also Pause Store Checkbox */}
            <label className="flex items-center gap-2 p-3 bg-[#140b09] border border-[#3d2c27] rounded-xl cursor-pointer hover:border-amber-700/50">
              <input
                type="checkbox"
                checked={alsoPauseStoreOnReject}
                onChange={(e) => setAlsoPauseStoreOnReject(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-amber-300">
                ⚠️ 거절과 함께 [매장 주문 일시정지 (품절)]를 즉시 켜기
              </span>
            </label>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="flex-1 h-11 bg-slate-900 border border-[#3d2c27] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-colors"
              >
                닫기 (취소)
              </button>
              <button
                type="button"
                onClick={confirmRejectOrder}
                className="flex-1 h-11 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
              >
                <X className="w-4 h-4" />
                <span>🚨 고객에게 거절 및 사유 전송</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STORE PAUSE / RESUME MODAL DIALOG */}
      {pauseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1310] border-2 border-amber-500/60 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setPauseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white text-lg font-bold"
            >
              ×
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800 inline-block">
                매장 모바일 주문 일시정지
              </span>
              <h3 className="text-base font-black text-white">
                신규 모바일 주문 접수를 일시정지하시겠습니까?
              </h3>
              <p className="text-xs text-slate-400">
                일시정지를 켜면 고객 주문앱 화면 상단에 경고 배너가 표시되며 신규 주문 접수가 안전하게 차단됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-350 block">고객 안내 사유 문구</label>
              <input
                type="text"
                value={pauseReasonInput}
                onChange={(e) => setPauseReasonInput(e.target.value)}
                placeholder="예: 매장 주문 폭주로 인해 잠시 주문 접수를 일시 정지합니다."
                className="w-full h-10 bg-[#140b09] border border-[#3d2c27] focus:border-amber-500 rounded-xl px-3 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPauseModalOpen(false)}
                className="flex-1 h-11 bg-slate-900 border border-[#3d2c27] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-colors"
              >
                닫기 (취소)
              </button>
              <button
                type="button"
                onClick={async () => {
                  await toggleStorePause(true, pauseReasonInput);
                  setPauseModalOpen(false);
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg"
              >
                <PauseCircle className="w-4 h-4" />
                <span>일시정지 가동하기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚙️ 주방 KDS 담당자 맞춤 설정 모달 (Manager Settings) */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1310] border-2 border-[#f39c12]/70 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col space-y-4 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>

            {/* 헤더 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#1a1210] bg-[#f39c12] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Manager Settings
                </span>
                <span className="text-xs text-slate-400">60계치킨 강원영월점</span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#f39c12]" />
                <span>주방 KDS 담당자 맞춤 운영 설정</span>
              </h3>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex items-center gap-1 border-b border-[#2d1d19] pb-2 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setSettingsModalTab('time')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  settingsModalTab === 'time'
                    ? 'bg-[#f39c12] text-[#1a1210]'
                    : 'bg-[#140b09] text-slate-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                ⏱️ 조리/배달 시간 직접 설정
              </button>
              <button
                type="button"
                onClick={() => setSettingsModalTab('notice')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  settingsModalTab === 'notice'
                    ? 'bg-[#f39c12] text-[#1a1210]'
                    : 'bg-[#140b09] text-slate-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                📢 실시간 고객 공지 문구
              </button>
              <button
                type="button"
                onClick={() => setSettingsModalTab('soldout')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  settingsModalTab === 'soldout'
                    ? 'bg-[#f39c12] text-[#1a1210]'
                    : 'bg-[#140b09] text-slate-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                🍗 메뉴 품절 제어 ({tempSoldOutMenuIds.length})
              </button>
              <button
                type="button"
                onClick={() => setSettingsModalTab('sound')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  settingsModalTab === 'sound'
                    ? 'bg-[#f39c12] text-[#1a1210]'
                    : 'bg-[#140b09] text-slate-400 hover:text-white border border-[#3d2c27]'
                }`}
              >
                🔊 주방 알림음 설정
              </button>
            </div>

            {/* 탭 본문 내용 (스크롤 가능) */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* 1. 시간 설정 */}
              {settingsModalTab === 'time' && (
                <div className="space-y-4">
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    여유 / 혼잡 / 피크 각 단계별로 고객 자사몰에 표시될 예상 포장 및 배달 소요 시간(분)을 담당자가 직접 숫자로 입력하여 조정할 수 있습니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* 여유 모드 */}
                    <div className="bg-[#140b09] border border-emerald-500/40 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        <span>🟢 여유 모드</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">포장 대기 (분)</label>
                          <input
                            type="number"
                            min="5"
                            max="120"
                            value={tempCustomTimes.normal.takeoutMin}
                            onChange={(e) => setTempCustomTimes({
                              ...tempCustomTimes,
                              normal: { ...tempCustomTimes.normal, takeoutMin: parseInt(e.target.value) || 20 }
                            })}
                            className="w-full h-8 bg-[#1c1310] border border-[#3d2c27] focus:border-emerald-500 rounded-lg px-2 font-mono text-center text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">배달 대기 (분)</label>
                          <input
                            type="number"
                            min="10"
                            max="150"
                            value={tempCustomTimes.normal.deliveryMin}
                            onChange={(e) => setTempCustomTimes({
                              ...tempCustomTimes,
                              normal: { ...tempCustomTimes.normal, deliveryMin: parseInt(e.target.value) || 40 }
                            })}
                            className="w-full h-8 bg-[#1c1310] border border-[#3d2c27] focus:border-emerald-500 rounded-lg px-2 font-mono text-center text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 혼잡 모드 */}
                    <div className="bg-[#140b09] border border-amber-500/40 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-black">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        <span>🟡 혼잡 모드</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">포장 대기 (분)</label>
                          <input
                            type="number"
                            min="5"
                            max="120"
                            value={tempCustomTimes.busy.takeoutMin}
                            onChange={(e) => setTempCustomTimes({
                              ...tempCustomTimes,
                              busy: { ...tempCustomTimes.busy, takeoutMin: parseInt(e.target.value) || 35 }
                            })}
                            className="w-full h-8 bg-[#1c1310] border border-[#3d2c27] focus:border-amber-500 rounded-lg px-2 font-mono text-center text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">배달 대기 (분)</label>
                          <input
                            type="number"
                            min="10"
                            max="150"
                            value={tempCustomTimes.busy.deliveryMin}
                            onChange={(e) => setTempCustomTimes({
                              ...tempCustomTimes,
                              busy: { ...tempCustomTimes.busy, deliveryMin: parseInt(e.target.value) || 50 }
                            })}
                            className="w-full h-8 bg-[#1c1310] border border-[#3d2c27] focus:border-amber-500 rounded-lg px-2 font-mono text-center text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 피크 모드 */}
                    <div className="bg-[#140b09] border border-rose-500/40 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-rose-400 font-black">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                        <span>🔴 피크 모드</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">포장 대기 (분)</label>
                          <input
                            type="number"
                            min="5"
                            max="120"
                            value={tempCustomTimes.peak.takeoutMin}
                            onChange={(e) => setTempCustomTimes({
                              ...tempCustomTimes,
                              peak: { ...tempCustomTimes.peak, takeoutMin: parseInt(e.target.value) || 50 }
                            })}
                            className="w-full h-8 bg-[#1c1310] border border-[#3d2c27] focus:border-rose-500 rounded-lg px-2 font-mono text-center text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">배달 대기 (분)</label>
                          <input
                            type="number"
                            min="10"
                            max="150"
                            value={tempCustomTimes.peak.deliveryMin}
                            onChange={(e) => setTempCustomTimes({
                              ...tempCustomTimes,
                              peak: { ...tempCustomTimes.peak, deliveryMin: parseInt(e.target.value) || 65 }
                            })}
                            className="w-full h-8 bg-[#1c1310] border border-[#3d2c27] focus:border-rose-500 rounded-lg px-2 font-mono text-center text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 공지 문구 설정 */}
              {settingsModalTab === 'notice' && (
                <div className="space-y-3">
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    고객 주문앱 상단에 굵게 노출될 실시간 긴급 공지 문구입니다. (비/눈, 폭설, 경기 당일 단체 주문, 조기 마감 등)
                  </p>
                  <div>
                    <input
                      type="text"
                      value={tempCustomNotice}
                      onChange={(e) => setTempCustomNotice(e.target.value)}
                      placeholder="예: 폭설로 인해 배달 대행 기사님 배차가 평소보다 지연되고 있습니다."
                      className="w-full h-11 bg-[#140b09] border border-[#3d2c27] focus:border-[#f39c12] rounded-xl px-3 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400">💡 자주 쓰는 빠른 템플릿 클릭</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '🌧️ 비가 내려 안전 배달을 위해 평소보다 15~20분 지연될 수 있습니다.',
                        '❄️ 영월 지역 대설로 인해 배달이 지연되고 있으니 양해 부탁드립니다.',
                        '🍗 금일 단체 주문 폭주로 포장 조리에 40분 이상 소요됩니다.',
                        '⚽ 축구 경기 당일로 주문량이 많아 순차적으로 정성껏 조리 중입니다.',
                        '🔴 금일 준비된 신선육(60마리) 소진으로 조기 마감 예정입니다.',
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTempCustomNotice(preset)}
                          className="text-[10px] bg-[#140b09] hover:bg-[#251814] text-slate-300 border border-[#3d2c27] rounded-lg px-2 py-1 transition-colors text-left"
                        >
                          {preset}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setTempCustomNotice('')}
                        className="text-[10px] bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 rounded-lg px-2 py-1 transition-colors"
                      >
                        🧹 공지 지우기 (초기화)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 메뉴 품절 제어 */}
              {settingsModalTab === 'soldout' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-slate-400 text-[11px]">
                      스위치를 누르면 고객 자사몰에 즉시 [품절] 뱃지가 붙고 담기가 차단됩니다.
                    </p>
                    <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                      {['all', '치킨', '반반치킨', '순살세트', '부분육', '사이드', '주류', '음료'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSoldOutCategoryFilter(cat)}
                          className={`px-2 py-1 rounded-md font-bold transition-all ${
                            soldOutCategoryFilter === cat
                              ? 'bg-[#f39c12] text-[#1a1210]'
                              : 'bg-[#140b09] text-slate-400 border border-[#3d2c27]'
                          }`}
                        >
                          {cat === 'all' ? '전체' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-[#2d1d19] border border-[#3d2c27] rounded-xl bg-[#140b09]">
                    {ALL_MENU_ITEMS
                      .filter(m => soldOutCategoryFilter === 'all' || m.category === soldOutCategoryFilter)
                      .map((menu) => {
                        const isSoldOut = tempSoldOutMenuIds.includes(menu.id);
                        return (
                          <div key={menu.id} className="p-2.5 flex items-center justify-between hover:bg-[#1f1715] transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-[#1c1310] px-1.5 py-0.5 rounded border border-[#3d2c27] text-slate-400">
                                {menu.category}
                              </span>
                              <span className={`font-bold ${isSoldOut ? 'line-through text-slate-500' : 'text-white'}`}>
                                {menu.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (isSoldOut) {
                                  setTempSoldOutMenuIds(tempSoldOutMenuIds.filter(id => id !== menu.id));
                                } else {
                                  setTempSoldOutMenuIds([...tempSoldOutMenuIds, menu.id]);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                                isSoldOut
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow'
                                  : 'bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300'
                              }`}
                            >
                              {isSoldOut ? '🔴 품절 중' : '🟢 판매 중'}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* 4. 사운드 설정 */}
              {settingsModalTab === 'sound' && (
                <div className="space-y-3 bg-[#140b09] border border-[#3d2c27] rounded-2xl p-4">
                  <p className="text-slate-400 text-[11px]">
                    주방 환경 소음에 맞춰 알림음 종류와 볼륨을 조정할 수 있습니다.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-350 block mb-1">알림음 종류</label>
                      <select
                        value={soundType}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setSoundType(val);
                          if (typeof window !== 'undefined') localStorage.setItem('youngwol_kitchen_sound_type', val);
                          playAlertSound(val, volume);
                        }}
                        className="w-full h-9 bg-[#1c1310] border border-[#3d2c27] text-slate-200 text-xs font-bold rounded-xl px-3"
                      >
                        <option value="baemin">🔔 배민 스타일 띵동</option>
                        <option value="bell">🛎️ 매장 카운터 벨 (땡~~)</option>
                        <option value="siren">🚨 주방 비상 경보 (삐-삐-삐)</option>
                        <option value="fanfare">🎺 신나는 팡파레 멜로디</option>
                        <option value="voice">🗣️ 한국어 음성 안내 (TTS)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>음량 조절</span>
                        <span className="font-mono font-bold text-[#f39c12]">{Math.round(volume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={volume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setVolume(val);
                          if (typeof window !== 'undefined') localStorage.setItem('youngwol_kitchen_sound_volume', String(val));
                        }}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#f39c12]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 모달 액션 버튼 */}
            <div className="border-t border-[#2d1d19] pt-3 flex items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-400 font-bold">
                {settingsSaveSuccess ? '✅ 설정이 저장되고 자사몰에 전파되었습니다!' : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-4 h-10 bg-slate-900 border border-[#3d2c27] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await updateStoreSettingsOnServer({
                      customTimes: tempCustomTimes,
                      customNotice: tempCustomNotice,
                      soldOutMenuIds: tempSoldOutMenuIds,
                    });
                    if (ok) {
                      setSettingsSaveSuccess(true);
                      setTimeout(() => setSettingsSaveSuccess(false), 2500);
                    }
                  }}
                  className="px-5 h-10 bg-[#f39c12] hover:bg-[#e67e22] text-[#1a1210] font-black rounded-xl text-xs shadow-lg active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>💾 설정 저장 및 자사몰 실시간 적용</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 단골 고객 과거 주문 이력 상세 모달 (CRM Customer Modal) */}
      {selectedCrmCustomer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1310] border-2 border-[#f39c12]/60 rounded-3xl p-6 w-full max-w-lg max-h-[85vh] flex flex-col space-y-4 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setSelectedCrmCustomer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>

            <div>
              <span className="text-[10px] font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                Customer Order History
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">
                {selectedCrmCustomer.name} 님의 과거 주문 전체 내역
              </h3>
              <p className="text-xs font-mono text-slate-400">
                전화번호: {selectedCrmCustomer.phone}
              </p>
            </div>

            {/* 주문 이력 목록 */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {orders
                .filter(o => o.phone === selectedCrmCustomer.phone)
                .map((o, idx) => (
                  <div key={idx} className="bg-[#140b09] border border-[#3d2c27] rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between items-center border-b border-[#2d1d19] pb-2 text-[11px]">
                      <span className="font-mono text-slate-400">#{o.id.slice(-6)} • {o.timestamp}</span>
                      <div className="flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          o.orderType === 'takeout' ? 'bg-[#f39c12]/20 text-[#f39c12]' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {o.orderType === 'takeout' ? '포장' : '배달'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          o.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : o.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {o.status === 'done' ? '완료' : o.status === 'cancelled' ? '거절' : '조리/대기'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {o.items.map((it, iIdx) => (
                        <div key={iIdx} className="flex justify-between text-slate-200 text-xs">
                          <span>{it.name} [{it.type}]</span>
                          <span className="font-mono">{it.quantity}개 ({(it.price * it.quantity).toLocaleString()}원)</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#2d1d19] pt-1.5 flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">결제 금액 (적립)</span>
                      <span className="text-white">
                        {o.total.toLocaleString()}원 <span className="text-[#f39c12] text-[10px] font-black">(+{o.rewardPoints || Math.round(o.total * 0.02)}P)</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedCrmCustomer(null)}
                className="w-full h-10 bg-slate-900 border border-[#3d2c27] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
