import { Hotel, Coupon, DecisionResponse, TrackingEvent } from '../types';
import { MOCK_HOTELS, MOCK_COUPONS } from './mockData';

// API Base URLs with fallbacks
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API || 'http://localhost:5001';
const INGESTION_API_URL = import.meta.env.VITE_INGESTION_API || 'http://localhost:4000';
const DECISION_API_URL = import.meta.env.VITE_DECISION_API || 'http://localhost:4001';

// Helper for artificial delay in mock mode
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // 1. Backend Auth: Register
  async registerUser(name: string, email: string, password: string): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('[Backend Server Offline Fallback]', err);
      return { success: true, message: '회원가입이 완료되었습니다 (오프라인 가입)', user: { name, email } };
    }
  },

  // 2. Backend Auth: Login
  async loginUser(email: string, password: string): Promise<{ success: boolean; message?: string; user?: any; token?: string }> {
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('[Backend Server Offline Fallback]', err);
      return { success: true, user: { name: email.split('@')[0], email } };
    }
  },

  // 3. Backend Booking: Create Reservation
  async createBooking(bookingPayload: any): Promise<{ success: boolean; booking?: any; message?: string }> {
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('[Backend Server Offline Fallback]', err);
      return { success: true, booking: { ...bookingPayload, id: `HSV-${Date.now()}`, status: 'COMPLETED' } };
    }
  },

  // 4. Backend Booking: Get User Bookings
  async getBookings(email?: string): Promise<any[]> {
    try {
      const url = email ? `${BACKEND_API_URL}/api/bookings?email=${encodeURIComponent(email)}` : `${BACKEND_API_URL}/api/bookings`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        return data.bookings;
      }
    } catch (err: any) {
      console.warn('[Backend Server Offline Fallback]', err);
    }
    return [];
  },

  // 5. Backend Booking: Cancel Reservation
  async cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/bookings/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: true, message: '예약이 취소되었습니다.' };
    }
  },

  // 6. Hotel List (fetches from Backend API or fallback)
  async getHotels(query?: string): Promise<Hotel[]> {
    try {
      const url = query ? `${BACKEND_API_URL}/api/hotels?q=${encodeURIComponent(query)}` : `${BACKEND_API_URL}/api/hotels`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.hotels) && data.hotels.length > 0) {
        return data.hotels;
      }
    } catch (err) {
      console.warn('[Backend Hotels Fallback]', err);
    }
    await delay(100);
    if (!query) return MOCK_HOTELS;
    const lower = query.toLowerCase();
    return MOCK_HOTELS.filter(
      (h) =>
        h.name.toLowerCase().includes(lower) ||
        h.location.toLowerCase().includes(lower) ||
        h.tags.some((t) => t.toLowerCase().includes(lower))
    );
  },

  // 7. Hotel Detail (fetches from Backend API or fallback)
  async getHotelById(id: string): Promise<Hotel | undefined> {
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/hotels/${id}`);
      const data = await res.json();
      if (data.success && data.hotel) {
        return data.hotel;
      }
    } catch (err) {
      console.warn('[Backend Hotel Detail Fallback]', err);
    }
    await delay(100);
    return MOCK_HOTELS.find((h) => h.id === id);
  },

  // 8. Coupon Wallet
  async getCoupons(): Promise<Coupon[]> {
    await delay(100);
    return MOCK_COUPONS;
  },

  // 9. Send Event Streams to Real Ingestion API (:4000)
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
        return true;
      }
    } catch (err) {
      console.warn('[Ingestion API Offline Mode] Logging events locally:', events);
    }
    return true;
  },

  // 10. Query Real Decision API (:4001) for Realtime Interventions
  async checkDecision(sessionId: string, triggerReason?: string): Promise<DecisionResponse> {
    try {
      const response = await fetch(`${DECISION_API_URL}/decision/${sessionId}`);
      if (response.status === 200) {
        const data = await response.json();
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

    await delay(100);

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

    if (triggerReason === 'copy_intent' || triggerReason === 'clipboard_copy') {
      return {
        ab_group: 'variant_b',
        component: 'price_match_banner',
        context: {
          message: '🔍 타 사이트 가격 비교 중이신가요? HoverStay는 100% 최저가를 보장하며, 결제 시 10,000원 추가 할인이 자동 적용됩니다!',
        },
      };
    }

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
