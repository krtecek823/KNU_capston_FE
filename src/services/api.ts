import { Hotel, Coupon, DecisionResponse, TrackingEvent } from '../types';
import { MOCK_HOTELS, MOCK_COUPONS } from './mockData';

// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  async getHotels(query?: string): Promise<Hotel[]> {
    await delay(300);
    if (!query) return MOCK_HOTELS;
    const lower = query.toLowerCase();
    return MOCK_HOTELS.filter(
      (h) =>
        h.name.toLowerCase().includes(lower) ||
        h.location.toLowerCase().includes(lower) ||
        h.tags.some((t) => t.toLowerCase().includes(lower))
    );
  },

  async getHotelById(id: string): Promise<Hotel | undefined> {
    await delay(200);
    return MOCK_HOTELS.find((h) => h.id === id);
  },

  async getCoupons(): Promise<Coupon[]> {
    await delay(200);
    return MOCK_COUPONS;
  },

  async sendIngestionEvents(events: TrackingEvent[]): Promise<boolean> {
    // Console log for transparent tracking in dev
    console.log('[HoverTracker Engine] Ingested events:', events);
    return true;
  },

  async checkDecision(sessionId: string, triggerReason?: string): Promise<DecisionResponse> {
    await delay(150);
    console.log(`[HoverTracker Engine] Checking decision for session: ${sessionId}, reason: ${triggerReason}`);

    if (triggerReason === 'exit_intent') {
      return {
        ab_group: 'variant_a',
        component: 'coupon_modal',
        context: {
          discount_percent: 15,
          hotel_name: '선택하신 감성 객실',
          message: '지금 예약하시면 15% 서프라이즈 할인이 적용됩니다!'
        }
      };
    }

    if (triggerReason === 'price_view_duration') {
      return {
        ab_group: 'variant_b',
        component: 'price_match_banner',
        context: {
          message: '⚡ 최저가 보장제: 다른 곳에서 더 저렴한 가격을 발견하면 차액의 100%를 보상해 드립니다.'
        }
      };
    }

    return {
      ab_group: 'control',
      component: null
    };
  }
};
