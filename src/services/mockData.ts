import { Hotel, Coupon } from '../types';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'grand-walkerhill',
    name: '그랜드 워커힐 서울 (Grand Walkerhill)',
    location: '서울 광진구',
    category: '5성급 프리미엄 리조트',
    rating: 4.8,
    reviewCount: 1240,
    originalPrice: 320000,
    discountPrice: 248000,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: '한강이 한눈에 내려다보이는 아차산 자락에 위치한 최고급 힐링 리조트입니다. 실내 수영장과 스파, 정갈한 뷔페 레스토랑을 제공합니다.',
    tags: ['한강뷰', '실내수영장', '럭셔리스파', '무료주차'],
    features: ['킹 베드 1개', '성인 2인 기준', '조식 포함 옵션', '무료 Wi-Fi'],
    address: '서울특별시 광진구 워커힐로 177',
  },
  {
    id: 'mapo-lotte',
    name: '롯데호티 시티 마포 (Lotte City Hotel Mapo)',
    location: '서울 마포구',
    category: '4성급 비즈니스 호텔',
    rating: 4.6,
    reviewCount: 890,
    originalPrice: 190000,
    discountPrice: 139000,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description: '공덕역과 직접 연결되어 여의도 및 홍대 접근성이 뛰어난 비즈니스/여행 최적화 호텔입니다.',
    tags: ['공덕역 직결', '피트니스', '비즈니스센터', '시티뷰'],
    features: ['퀸 베드 1개', '성인 2인 기준', '초고속 인터넷', '룸서비스'],
    address: '서울특별시 마포구 마포대로 109',
  },
  {
    id: 'guro-fourpoints',
    name: '포포인츠 바이 쉐라톤 구로 (Four Points Guro)',
    location: '서울 구로구',
    category: '4성급 럭셔리 스테이',
    rating: 4.5,
    reviewCount: 620,
    originalPrice: 165000,
    discountPrice: 115000,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    description: 'IT 밸리의 중심 구로디지털단지역 인근에 위치하며 모던하고 감각적인 객실과 조식 뷔페가 매력적인 호텔입니다.',
    tags: ['IT밸리 중심', '뷔페 우수', '스마트TV', '레이트체크아웃'],
    features: ['트윈 베드 2개', '성인 2인 기준', '피트니스 무료', '무료 주차'],
    address: '서울특별시 구로구 디지털로32길 72',
  },
  {
    id: 'gangnam-sofitel',
    name: '소피텔 앰배서더 서울 (Sofitel Ambassador)',
    location: '서울 송파구',
    category: '5성급 럭셔리 럭스',
    rating: 4.9,
    reviewCount: 2100,
    originalPrice: 480000,
    discountPrice: 389000,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    description: '석촌호수 조망을 자랑하는 프렌치 럭셔리 호텔입니다. 루프탑 바와 고급 프랑스식 정찬 서비스를 즐겨보세요.',
    tags: ['석촌호수뷰', '루프탑바', '프렌치럭셔리', '실내수영장'],
    features: ['킹 베드 1개', '성인 2인 기준', '에스프레소 머신', '딥티크 어메니티'],
    address: '서울특별시 송파구 잠실로 209',
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'welcome-10',
    code: 'HOVERWELCOME',
    title: '신규 회원 전용 10% 즉시 할인 쿠폰',
    discountPercent: 10,
    minSpend: 100000,
    validUntil: '2026.12.31'
  },
  {
    id: 'exit-special-15',
    code: 'HOVEREXIT15',
    title: '이탈 방지 특별 15% 서프라이즈 쿠폰',
    discountPercent: 15,
    minSpend: 120000,
    validUntil: '오늘 단 하루'
  }
];
