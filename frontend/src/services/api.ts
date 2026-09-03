import { Hotel, Coupon, DecisionResponse, TrackingEvent } from '../types';
import { MOCK_HOTELS, MOCK_COUPONS } from './mockData';

// API Base URLs with fallbacks
const INGESTION_API_URL = import.meta.env.VITE_INGESTION_API || 'http://localhost:4000';
const DECISION_API_URL = import.meta.env.VITE_DECISION_API || 'http://localhost:4001';

// Helper for artificial delay in mock mode
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // 1. Hotel List (supports keyword filter & tag filtering)
  async getHotels(query?: string): Promise<Hotel[]> {
    await delay(150);
    if (!query) return MOCK_HOTELS;
    const lower = query.toLowerCase();
    return MOCK_HOTELS.filter(
      (h) =>
        h.name.toLowerCase().includes(lower) ||
        h.location.toLowerCase().includes(lower) ||
        h.tags.some((t) => t.toLowerCase().includes(lower))
    );
  },

  // 2. Hotel Detail
  async getHotelById(id: string): Promise<Hotel | undefined> {
    await delay(100);
    return MOCK_HOTELS.find((h) => h.id === id);
  },

  // 3. Coupon Wallet
  async getCoupons(): Promise<Coupon[]> {
    await delay(100);
    return MOCK_COUPONS;
  },

  // 4. Send Event Streams to Real Ingestion API (:4000) with Fallback
  async sendIngestionEvents(events: TrackingEvent[]): Promise<boolean> {
    const sessionId = localStorage.getItem('hoverstay_session_id') || 'session_demo_101';
    const payload = {
      session_id: sessionId,
      device: 'desktop',
      user_id: 'user_demo_77',
      events: events.map((e) => ({
        event_id: e.event_id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ts: e.ts || Date.now(),
        type: e.type,
        payload: e.payload || {},
        page_url: e.page_url || window.location.href,
        referrer: document.referrer || '',
      })),
    };

    try {
      const response = await fetch(`${INGESTION_API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('[Real Ingestion API :4000] Ingested events:', events);
        return true;
      }
    } catch (err) {
      console.warn('[Ingestion API Offline Mode] Logging events locally:', events);
    }
    return true;
  },

  // 5. Query Real Decision API (:4001) for Realtime Interventions with Fallback
  async checkDecision(sessionId: string, triggerReason?: string): Promise<DecisionResponse> {
    try {
      const response = await fetch(`${DECISION_API_URL}/decision/${sessionId}`);
      if (response.status === 200) {
        const data = await response.json();
        console.log('[Real Decision API :4001] Received real decision:', data);
        return {
          ab_group: data.ab_group || 'variant_a',
          component: data.component || 'coupon_modal',
          context: data.context || {
            discount_percent: 15,
            message: data.copy || '지금 예약하시면 서프라이즈 할인이 적용됩니다!',
          },
        };
      }
    } catch (err) {
      console.warn('[Decision API Offline Mode] Utilizing client-side rule fallback for:', triggerReason);
    }

    // Client-side Rule Engine Fallback
    await delay(100);

    // 1. Mouse Exit Intent Trigger
    if (triggerReason === 'exit_intent') {
      return {
        ab_group: 'variant_a',
        component: 'coupon_modal',
        context: {
          discount_percent: 15,
          hotel_name: '선택하신 인기 프리미엄 객실',
          message: '다른 사이트로 이동하기 전! 15% 시크릿 할인 쿠폰이 발급되었습니다.',
        },
      };
    }

    // 2. Text Copy / Price Search Intent Trigger
    if (triggerReason === 'copy_intent' || triggerReason === 'clipboard_copy') {
      return {
        ab_group: 'variant_b',
        component: 'price_match_banner',
        context: {
          message: '🔍 타 사이트 가격 비교 중이신가요? HoverStay는 100% 최저가를 보장하며, 결제 시 10,000원 추가 할인이 자동 적용됩니다!',
        },
      };
    }

    // 3. Tab Return / Long View Duration Trigger
    if (triggerReason === 'price_view_duration' || triggerReason === 'tab_return') {
      return {
        ab_group: 'variant_b',
        component: 'price_match_banner',
        context: {
          message: '⚡ [최저가 보장 안내] 타사에서 더 저렴한 가격 발견 시 차액 100% 보상 + 시크릿 쿠폰이 적용됩니다.',
        },
      };
    }

    return {
      ab_group: 'control',
      component: null,
    };
  },
};
