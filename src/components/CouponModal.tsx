import React from 'react';
import { Sparkles, X, Gift, ArrowRight } from 'lucide-react';
import { DecisionResponse } from '../types';

interface CouponModalProps {
  data: DecisionResponse;
  onClose: () => void;
  onAccept: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ data, onClose, onAccept }) => {
  const discountPercent = data.context?.discount_percent || 15;
  const hotelName = data.context?.hotel_name || '프리미엄 인기 객실';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 transform transition-all scale-100">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white text-center relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" /> HoverStay 특별 혜택
          </div>

          <h2 className="text-2xl font-black tracking-tight mb-1">
            잠깐만요! 그냥 나가시게요? 🎁
          </h2>
          <p className="text-xs text-amber-100 font-medium">
            지금 떠나시면 오늘만 제공되는 전용 시크릿 할인 쿠폰이 사라집니다.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/60 mb-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Gift className="w-7 h-7" />
              </div>
            </div>
            <p className="text-xs font-semibold text-amber-800 mb-1">{hotelName}</p>
            <div className="text-4xl font-black text-amber-600 tracking-tight my-1">
              {discountPercent}% 추가 할인
            </div>
            <p className="text-xs text-amber-700">
              {data.context?.message || '오늘 단 하루 적용 가능한 서프라이즈 쿠폰'}
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={onAccept}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>15% 할인쿠폰 즉시 받고 계속하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              괜찮습니다, 혜택 없이 둘러볼게요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
