import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '../types';
import { REAL_COUPONS } from '../services/hotelData';

interface CouponState {
  coupons: Coupon[];
  selectedCouponId: string | null;
  addCoupon: (coupon: Coupon) => void;
  selectCoupon: (couponId: string | null) => void;
  useCoupon: (couponId: string) => void;
  getSelectedCoupon: () => Coupon | undefined;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: REAL_COUPONS,
      selectedCouponId: null,
      addCoupon: (coupon) =>
        set((state) => {
          if (state.coupons.some((c) => c.id === coupon.id)) return state;
          return { coupons: [coupon, ...state.coupons], selectedCouponId: coupon.id };
        }),
      selectCoupon: (couponId) => set({ selectedCouponId: couponId }),
      useCoupon: (couponId) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== couponId),
          selectedCouponId: state.selectedCouponId === couponId ? null : state.selectedCouponId,
        })),
      getSelectedCoupon: () => {
        const { coupons, selectedCouponId } = get();
        return coupons.find((c) => c.id === selectedCouponId);
      },
    }),
    {
      name: 'hoverstay-coupon-storage',
    }
  )
);
