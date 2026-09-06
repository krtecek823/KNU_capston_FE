import { describe, it, expect, beforeEach } from 'vitest';
import { useCouponStore } from '../store/useCouponStore';

describe('Zustand useCouponStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCouponStore.setState({
      coupons: [
        {
          id: 'special-15',
          code: 'HOVER15',
          title: '회원 전용 시크릿 15% 할인 쿠폰',
          discountPercent: 15,
          minSpend: 100000,
          validUntil: '2026.12.31',
        },
      ],
      selectedCouponId: 'special-15',
    });
  });

  it('should initialize with default secret coupon', () => {
    const state = useCouponStore.getState();
    expect(state.coupons.length).toBeGreaterThan(0);
    expect(state.selectedCouponId).toBe('special-15');
  });

  it('should allow selecting a coupon', () => {
    useCouponStore.getState().selectCoupon('custom-coupon-id');
    expect(useCouponStore.getState().selectedCouponId).toBe('custom-coupon-id');
  });

  it('should add a new coupon to the store', () => {
    const newCoupon = {
      id: 'welcome-20',
      code: 'WELCOME20',
      title: '신규 가입 20% 할인 쿠폰',
      discountPercent: 20,
      minSpend: 50000,
      validUntil: '2026.12.31',
    };

    useCouponStore.getState().addCoupon(newCoupon);
    const state = useCouponStore.getState();

    expect(state.coupons.length).toBe(2);
    expect(state.coupons.find((c) => c.id === 'welcome-20')).toBeDefined();
  });
});
