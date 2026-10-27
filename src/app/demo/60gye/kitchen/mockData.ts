export interface OrderItem {
  name: string;
  type: string;
  price: number;
  quantity: number;
  isCustom?: boolean;
  customDetails?: string;
}

export interface Order {
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
  usedPoints?: number;
  total: number;
  timestamp: string;
  status: 'pending' | 'accepted' | 'cooking' | 'done' | 'cancelled';
  cancelReason?: string;
  rewardPoints?: number;
}

export const INITIAL_MOCK_ORDERS: Order[] = [
  {
    "id": "ORD-20261027-0101",
    "name": "김민준",
    "phone": "010-3342-8812",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "17:10",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "치킨 바삭하게 부탁드립니다~ 쫀득볼 서비스 감사합니다!",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 20900,
    "timestamp": "2026-10-27 16:50:12",
    "status": "pending",
    "rewardPoints": 418
  },
  {
    "id": "ORD-20261027-0102",
    "name": "박서윤",
    "phone": "010-9182-4421",
    "orderType": "delivery",
    "address": "영월읍 영흥리 주공아파트 102동 405호",
    "targetPickupTime": "17:35",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문 앞에 두고 벨 눌러주세요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-27 16:35:04",
    "status": "cooking",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261027-0103",
    "name": "이도현",
    "phone": "010-4491-1209",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "17:10",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "군청에서 퇴근길에 찾으러 갑니다",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-27 16:22:15",
    "status": "cooking",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261027-0104",
    "name": "최지우",
    "phone": "010-7721-3904",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "17:10",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "항상 맛있게 먹고 있어요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 20900,
    "timestamp": "2026-10-27 14:15:00",
    "status": "done",
    "rewardPoints": 418
  },
  {
    "id": "ORD-20261027-0105",
    "name": "정예준",
    "phone": "010-2384-9912",
    "orderType": "delivery",
    "address": "영월읍 하송로 스포츠파크길 12",
    "targetPickupTime": "17:35",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "출입문 비번 1234*",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-27 13:40:22",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261027-0106",
    "name": "강시우",
    "phone": "010-5512-3049",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "17:10",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "점심 회식 포장",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 20900,
    "timestamp": "2026-10-27 12:55:10",
    "status": "done",
    "rewardPoints": 418
  },
  {
    "id": "ORD-20261027-0107",
    "name": "조하은",
    "phone": "010-8841-2931",
    "orderType": "delivery",
    "address": "영월의료원 간호본부 5병동",
    "targetPickupTime": "17:35",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "병원 로비에서 수령할게요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-27 12:10:45",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261027-0108",
    "name": "윤지호",
    "phone": "010-6623-1094",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "17:10",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "후라이드 바삭하게",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 16900,
    "timestamp": "2026-10-27 11:30:00",
    "status": "done",
    "rewardPoints": 338
  },
  {
    "id": "ORD-20261026-0109",
    "name": "최지우",
    "phone": "010-7721-3904",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-26 18:02:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261026-0110",
    "name": "장서진",
    "phone": "010-3129-8874",
    "orderType": "delivery",
    "address": "영월세무서 앞 금강상가 2층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 28900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 31900,
    "timestamp": "2026-10-26 20:15:00",
    "status": "done",
    "rewardPoints": 638
  },
  {
    "id": "ORD-20261026-0111",
    "name": "배소율",
    "phone": "010-6671-8823",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-26 17:28:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261025-0112",
    "name": "김민준",
    "phone": "010-3342-8812",
    "orderType": "delivery",
    "address": "영월읍 하송리 214-3",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-25 17:55:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261025-0113",
    "name": "강시우",
    "phone": "010-5512-3049",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-10-25 19:08:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20261024-0114",
    "name": "문채원",
    "phone": "010-8899-3344",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-10-24 21:48:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20261024-0115",
    "name": "이도현",
    "phone": "010-4491-1209",
    "orderType": "delivery",
    "address": "영월군청 기획감사실 3층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 25900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 28900,
    "timestamp": "2026-10-24 18:01:00",
    "status": "done",
    "rewardPoints": 578
  },
  {
    "id": "ORD-20261024-0116",
    "name": "윤지호",
    "phone": "010-6623-1094",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-10-24 20:14:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20261024-0117",
    "name": "송건우",
    "phone": "010-4412-9018",
    "orderType": "delivery",
    "address": "영월공고 삼거리 원룸 202호",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-24 17:27:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261023-0118",
    "name": "황은우",
    "phone": "010-4482-1192",
    "orderType": "delivery",
    "address": "영월읍 중앙로 베이커리 2층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-10-23 20:41:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20261023-0119",
    "name": "진수빈",
    "phone": "010-9988-4455",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 27900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 25900,
    "timestamp": "2026-10-23 17:54:00",
    "status": "done",
    "rewardPoints": 518
  },
  {
    "id": "ORD-20261022-0120",
    "name": "유승호",
    "phone": "010-8812-7722",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-22 19:34:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261022-0121",
    "name": "류태양",
    "phone": "010-5544-2211",
    "orderType": "delivery",
    "address": "영월읍 단종로 55",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 26900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 29900,
    "timestamp": "2026-10-22 21:47:00",
    "status": "done",
    "rewardPoints": 598
  },
  {
    "id": "ORD-20261022-0122",
    "name": "박서윤",
    "phone": "010-9182-4421",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-10-22 18:00:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20261021-0123",
    "name": "배소율",
    "phone": "010-6671-8823",
    "orderType": "delivery",
    "address": "청령포 인근 펜션타운 A동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 25900,
    "timestamp": "2026-10-21 18:27:00",
    "status": "done",
    "rewardPoints": 518
  },
  {
    "id": "ORD-20261021-0124",
    "name": "권민서",
    "phone": "010-9912-8834",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 25900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-21 20:40:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261020-0125",
    "name": "한태민",
    "phone": "010-7182-5503",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-10-20 17:20:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20261020-0126",
    "name": "홍다은",
    "phone": "010-3321-4499",
    "orderType": "delivery",
    "address": "영월소방서 인근 덕포시장길 15",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 26900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 29900,
    "timestamp": "2026-10-20 19:33:00",
    "status": "done",
    "rewardPoints": 598
  },
  {
    "id": "ORD-20261020-0127",
    "name": "안서현",
    "phone": "010-7733-9120",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 16900,
    "timestamp": "2026-10-20 21:46:00",
    "status": "done",
    "rewardPoints": 338
  },
  {
    "id": "ORD-20261020-0128",
    "name": "김민준",
    "phone": "010-3342-8812",
    "orderType": "delivery",
    "address": "영월읍 하송리 214-3",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 25900,
    "timestamp": "2026-10-20 18:59:00",
    "status": "done",
    "rewardPoints": 518
  },
  {
    "id": "ORD-20261019-0129",
    "name": "윤지호",
    "phone": "010-6623-1094",
    "orderType": "delivery",
    "address": "주천면 주천로 102-4",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-19 21:13:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261019-0130",
    "name": "송건우",
    "phone": "010-4412-9018",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 28900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-10-19 18:26:00",
    "status": "done",
    "rewardPoints": 538
  },
  {
    "id": "ORD-20261018-0131",
    "name": "정예준",
    "phone": "010-2384-9912",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-10-18 20:06:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20261018-0132",
    "name": "임수아",
    "phone": "010-9941-2305",
    "orderType": "delivery",
    "address": "단종역사관 인근 청령포로 33",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-10-18 17:19:00",
    "status": "done",
    "rewardPoints": 538
  },
  {
    "id": "ORD-20261018-0133",
    "name": "신재원",
    "phone": "010-5591-2301",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 20900,
    "timestamp": "2026-10-18 19:32:00",
    "status": "done",
    "rewardPoints": 418
  },
  {
    "id": "ORD-20261017-0134",
    "name": "박서윤",
    "phone": "010-9182-4421",
    "orderType": "delivery",
    "address": "영월읍 영흥리 주공아파트 102동 405호",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-10-17 19:59:00",
    "status": "done",
    "rewardPoints": 538
  },
  {
    "id": "ORD-20261017-0135",
    "name": "조하은",
    "phone": "010-8841-2931",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 25900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-17 21:12:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261016-0136",
    "name": "서동건",
    "phone": "010-1122-6677",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 16900,
    "timestamp": "2026-10-16 18:52:00",
    "status": "done",
    "rewardPoints": 338
  },
  {
    "id": "ORD-20261016-0137",
    "name": "최지우",
    "phone": "010-7721-3904",
    "orderType": "delivery",
    "address": "영월읍 덕포리 중앙로 45",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 27900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 30900,
    "timestamp": "2026-10-16 20:05:00",
    "status": "done",
    "rewardPoints": 618
  },
  {
    "id": "ORD-20261016-0138",
    "name": "장서진",
    "phone": "010-3129-8874",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-16 17:18:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261016-0139",
    "name": "배소율",
    "phone": "010-6671-8823",
    "orderType": "delivery",
    "address": "청령포 인근 펜션타운 A동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-10-16 19:31:00",
    "status": "done",
    "rewardPoints": 538
  },
  {
    "id": "ORD-20261015-0140",
    "name": "안서현",
    "phone": "010-7733-9120",
    "orderType": "delivery",
    "address": "영월읍 하송리 삼익아파트 103동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-15 17:45:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261015-0141",
    "name": "김민준",
    "phone": "010-3342-8812",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 26900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-15 19:58:00",
    "status": "cancelled",
    "cancelReason": "고객 주문 번호 입력 오류로 즉시 재주문",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261014-0142",
    "name": "백지율",
    "phone": "010-2291-3384",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 20900,
    "timestamp": "2026-10-14 21:38:00",
    "status": "done",
    "rewardPoints": 418
  },
  {
    "id": "ORD-20261014-0143",
    "name": "문채원",
    "phone": "010-8899-3344",
    "orderType": "delivery",
    "address": "영월경찰서 앞 행복주택 301호",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 25900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 28900,
    "timestamp": "2026-10-14 18:51:00",
    "status": "done",
    "rewardPoints": 578
  },
  {
    "id": "ORD-20261014-0144",
    "name": "이도현",
    "phone": "010-4491-1209",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-10-14 20:04:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20261013-0145",
    "name": "신재원",
    "phone": "010-5591-2301",
    "orderType": "delivery",
    "address": "영월읍 하송리 현대아파트 101동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-13 20:31:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261013-0146",
    "name": "황은우",
    "phone": "010-4482-1192",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 26900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-13 17:44:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261012-0147",
    "name": "오유진",
    "phone": "010-8291-3482",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-12 19:24:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261012-0148",
    "name": "유승호",
    "phone": "010-8812-7722",
    "orderType": "delivery",
    "address": "영월군 농업기술센터 2층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 28900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 31900,
    "timestamp": "2026-10-12 21:37:00",
    "status": "done",
    "rewardPoints": 638
  },
  {
    "id": "ORD-20261012-0149",
    "name": "류태양",
    "phone": "010-5544-2211",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-12 18:50:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261012-0150",
    "name": "박서윤",
    "phone": "010-9182-4421",
    "orderType": "delivery",
    "address": "영월읍 영흥리 주공아파트 102동 405호",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-12 20:03:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261011-0151",
    "name": "장서진",
    "phone": "010-3129-8874",
    "orderType": "delivery",
    "address": "영월세무서 앞 금강상가 2층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-11 18:17:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20261011-0152",
    "name": "배소율",
    "phone": "010-6671-8823",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-10-11 20:30:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20261010-0153",
    "name": "강시우",
    "phone": "010-5512-3049",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-10-10 17:10:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20261010-0154",
    "name": "한태민",
    "phone": "010-7182-5503",
    "orderType": "delivery",
    "address": "동강시스타 리조트 빌리지 201호",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 25900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 28900,
    "timestamp": "2026-10-10 19:23:00",
    "status": "done",
    "rewardPoints": 578
  },
  {
    "id": "ORD-20261010-0155",
    "name": "홍다은",
    "phone": "010-3321-4499",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-10-10 21:36:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20261009-0156",
    "name": "이도현",
    "phone": "010-4491-1209",
    "orderType": "delivery",
    "address": "영월군청 기획감사실 3층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-10-09 21:03:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20261009-0157",
    "name": "윤지호",
    "phone": "010-6623-1094",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 27900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 25900,
    "timestamp": "2026-10-09 18:16:00",
    "status": "done",
    "rewardPoints": 518
  },
  {
    "id": "ORD-20261008-0158",
    "name": "진수빈",
    "phone": "010-9988-4455",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-08 20:56:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261008-0159",
    "name": "정예준",
    "phone": "010-2384-9912",
    "orderType": "delivery",
    "address": "영월읍 하송로 스포츠파크길 12",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 26900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 29900,
    "timestamp": "2026-10-08 17:09:00",
    "status": "done",
    "rewardPoints": 598
  },
  {
    "id": "ORD-20261008-0160",
    "name": "임수아",
    "phone": "010-9941-2305",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-10-08 19:22:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20261008-0161",
    "name": "신재원",
    "phone": "010-5591-2301",
    "orderType": "delivery",
    "address": "영월읍 하송리 현대아파트 101동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-10-08 21:35:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20261007-0162",
    "name": "류태양",
    "phone": "010-5544-2211",
    "orderType": "delivery",
    "address": "영월읍 단종로 55",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 25900,
    "timestamp": "2026-10-07 19:49:00",
    "status": "done",
    "rewardPoints": 518
  },
  {
    "id": "ORD-20261007-0163",
    "name": "박서윤",
    "phone": "010-9182-4421",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 25900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-07 21:02:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261006-0164",
    "name": "권민서",
    "phone": "010-9912-8834",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-10-06 18:42:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20261006-0165",
    "name": "서동건",
    "phone": "010-1122-6677",
    "orderType": "delivery",
    "address": "영월우체국 2층 총무과",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 26900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 29900,
    "timestamp": "2026-10-06 20:55:00",
    "status": "done",
    "rewardPoints": 598
  },
  {
    "id": "ORD-20261006-0166",
    "name": "최지우",
    "phone": "010-7721-3904",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 16900,
    "timestamp": "2026-10-06 17:08:00",
    "status": "done",
    "rewardPoints": 338
  },
  {
    "id": "ORD-20261005-0167",
    "name": "홍다은",
    "phone": "010-3321-4499",
    "orderType": "delivery",
    "address": "영월소방서 인근 덕포시장길 15",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-05 17:35:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261005-0168",
    "name": "안서현",
    "phone": "010-7733-9120",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 28900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-10-05 19:48:00",
    "status": "done",
    "rewardPoints": 538
  },
  {
    "id": "ORD-20261004-0169",
    "name": "송건우",
    "phone": "010-4412-9018",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-10-04 21:28:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20261004-0170",
    "name": "백지율",
    "phone": "010-2291-3384",
    "orderType": "delivery",
    "address": "영월읍 영흥리 주공 104동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-10-04 18:41:00",
    "status": "done",
    "rewardPoints": 538
  },
  {
    "id": "ORD-20261004-0171",
    "name": "문채원",
    "phone": "010-8899-3344",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 20900,
    "timestamp": "2026-10-04 20:54:00",
    "status": "done",
    "rewardPoints": 418
  },
  {
    "id": "ORD-20261004-0172",
    "name": "이도현",
    "phone": "010-4491-1209",
    "orderType": "delivery",
    "address": "영월군청 기획감사실 3층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-04 17:07:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261003-0173",
    "name": "임수아",
    "phone": "010-9941-2305",
    "orderType": "delivery",
    "address": "단종역사관 인근 청령포로 33",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-10-03 20:21:00",
    "status": "done",
    "rewardPoints": 538
  },
  {
    "id": "ORD-20261003-0174",
    "name": "신재원",
    "phone": "010-5591-2301",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 25900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-03 17:34:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261002-0175",
    "name": "조하은",
    "phone": "010-8841-2931",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 16900,
    "timestamp": "2026-10-02 19:14:00",
    "status": "done",
    "rewardPoints": 338
  },
  {
    "id": "ORD-20261002-0176",
    "name": "오유진",
    "phone": "010-8291-3482",
    "orderType": "delivery",
    "address": "영월역 앞 영월로 88",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 27900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 30900,
    "timestamp": "2026-10-02 21:27:00",
    "status": "done",
    "rewardPoints": 618
  },
  {
    "id": "ORD-20261002-0177",
    "name": "유승호",
    "phone": "010-8812-7722",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-10-02 18:40:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20261001-0178",
    "name": "최지우",
    "phone": "010-7721-3904",
    "orderType": "delivery",
    "address": "영월읍 덕포리 중앙로 45",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "문앞에 놓아주세요",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-10-01 18:07:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20261001-0179",
    "name": "장서진",
    "phone": "010-3129-8874",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "퇴근길 픽업합니다",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "쫀득치즈볼 (5개)",
        "type": "사이드",
        "price": 5000,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 26900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-10-01 20:20:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20260930-0180",
    "name": "안서현",
    "phone": "010-7733-9120",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-09-30 20:30:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20260930-0181",
    "name": "이도현",
    "phone": "010-4491-1209",
    "orderType": "delivery",
    "address": "영월군청 기획감사실 3층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-09-30 21:47:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20260928-0182",
    "name": "송건우",
    "phone": "010-4412-9018",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 20900,
    "timestamp": "2026-09-28 18:12:00",
    "status": "done",
    "rewardPoints": 418
  },
  {
    "id": "ORD-20260928-0183",
    "name": "황은우",
    "phone": "010-4482-1192",
    "orderType": "delivery",
    "address": "영월읍 중앙로 베이커리 2층",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-09-28 19:29:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20260926-0184",
    "name": "정예준",
    "phone": "010-2384-9912",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-09-26 20:54:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20260926-0185",
    "name": "오유진",
    "phone": "010-8291-3482",
    "orderType": "delivery",
    "address": "영월역 앞 영월로 88",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-09-26 21:11:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20260924-0186",
    "name": "류태양",
    "phone": "010-5544-2211",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-09-24 18:36:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20260924-0187",
    "name": "최지우",
    "phone": "010-7721-3904",
    "orderType": "delivery",
    "address": "영월읍 덕포리 중앙로 45",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-09-24 19:53:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20260922-0188",
    "name": "배소율",
    "phone": "010-6671-8823",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-09-22 20:18:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20260922-0189",
    "name": "안서현",
    "phone": "010-7733-9120",
    "orderType": "delivery",
    "address": "영월읍 하송리 삼익아파트 103동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-09-22 21:35:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20260920-0190",
    "name": "강시우",
    "phone": "010-5512-3049",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 16900,
    "timestamp": "2026-09-20 18:00:00",
    "status": "done",
    "rewardPoints": 338
  },
  {
    "id": "ORD-20260920-0191",
    "name": "송건우",
    "phone": "010-4412-9018",
    "orderType": "delivery",
    "address": "영월공고 삼거리 원룸 202호",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-09-20 19:17:00",
    "status": "done",
    "rewardPoints": 538
  },
  {
    "id": "ORD-20260918-0192",
    "name": "문채원",
    "phone": "010-8899-3344",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-09-18 20:42:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20260918-0193",
    "name": "정예준",
    "phone": "010-2384-9912",
    "orderType": "delivery",
    "address": "영월읍 하송로 스포츠파크길 12",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 25900,
    "timestamp": "2026-09-18 21:59:00",
    "status": "done",
    "rewardPoints": 518
  },
  {
    "id": "ORD-20260916-0194",
    "name": "신재원",
    "phone": "010-5591-2301",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-09-16 18:24:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20260916-0195",
    "name": "류태양",
    "phone": "010-5544-2211",
    "orderType": "delivery",
    "address": "영월읍 단종로 55",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-09-16 19:41:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20260914-0196",
    "name": "조하은",
    "phone": "010-8841-2931",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "크크크치킨",
        "type": "치킨",
        "price": 22900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 22900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 20900,
    "timestamp": "2026-09-14 20:06:00",
    "status": "done",
    "rewardPoints": 418
  },
  {
    "id": "ORD-20260914-0197",
    "name": "배소율",
    "phone": "010-6671-8823",
    "orderType": "delivery",
    "address": "청령포 인근 펜션타운 A동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-09-14 21:23:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20260912-0198",
    "name": "서동건",
    "phone": "010-1122-6677",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "호랑이치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 19900,
    "timestamp": "2026-09-12 18:48:00",
    "status": "done",
    "rewardPoints": 398
  },
  {
    "id": "ORD-20260912-0199",
    "name": "강시우",
    "phone": "010-5512-3049",
    "orderType": "delivery",
    "address": "영월읍 금강정로 18",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 23900,
    "timestamp": "2026-09-12 19:05:00",
    "status": "done",
    "rewardPoints": 478
  },
  {
    "id": "ORD-20260910-0200",
    "name": "홍다은",
    "phone": "010-3321-4499",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "간지치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-09-10 20:30:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20260910-0201",
    "name": "문채원",
    "phone": "010-8899-3344",
    "orderType": "delivery",
    "address": "영월경찰서 앞 행복주택 301호",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 21900,
    "timestamp": "2026-09-10 21:47:00",
    "status": "done",
    "rewardPoints": 438
  },
  {
    "id": "ORD-20260908-0202",
    "name": "윤지호",
    "phone": "010-6623-1094",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "고추치킨",
        "type": "치킨",
        "price": 20900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 20900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 18900,
    "timestamp": "2026-09-08 18:12:00",
    "status": "done",
    "rewardPoints": 378
  },
  {
    "id": "ORD-20260908-0203",
    "name": "신재원",
    "phone": "010-5591-2301",
    "orderType": "delivery",
    "address": "영월읍 하송리 현대아파트 101동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "더매운고추치킨",
        "type": "치킨",
        "price": 21900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 21900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 24900,
    "timestamp": "2026-09-08 19:29:00",
    "status": "done",
    "rewardPoints": 498
  },
  {
    "id": "ORD-20260906-0204",
    "name": "진수빈",
    "phone": "010-9988-4455",
    "orderType": "takeout",
    "pickupTime": "20분 후",
    "targetPickupTime": "19:20",
    "minutesToAdd": 20,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "후라이드치킨",
        "type": "치킨",
        "price": 18900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (5개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 18900,
    "discount": 2000,
    "deliveryFee": 0,
    "usedPoints": 0,
    "total": 16900,
    "timestamp": "2026-09-06 20:54:00",
    "status": "done",
    "rewardPoints": 338
  },
  {
    "id": "ORD-20260906-0205",
    "name": "조하은",
    "phone": "010-8841-2931",
    "orderType": "delivery",
    "address": "영월의료원 간호본부 5병동",
    "targetPickupTime": "19:50",
    "minutesToAdd": 45,
    "paymentMethod": "자사몰 간편결제 (카드)",
    "requestText": "맛있게 부탁드려요",
    "items": [
      {
        "name": "치즈볼엔 순살",
        "type": "순살세트",
        "price": 23900,
        "quantity": 1
      },
      {
        "name": "미니쫀득볼 (10개) [자사몰 증정]",
        "type": "사이드",
        "price": 0,
        "quantity": 1
      }
    ],
    "subtotal": 23900,
    "discount": 0,
    "deliveryFee": 3000,
    "usedPoints": 0,
    "total": 26900,
    "timestamp": "2026-09-06 21:11:00",
    "status": "done",
    "rewardPoints": 538
  }
];
