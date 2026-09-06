import React from 'react';
import { X, Gift, ArrowRight, Smartphone, Monitor } from 'lucide-react';
import { DecisionResponse } from '../types';

interface CouponModalProps {
  data: DecisionResponse;
  triggerDevice?: 'desktop' | 'mobile';
  onClose: () => void;
  onAccept: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  data,
  triggerDevice = 'desktop',
  onClose,
  onAccept,
}) => {
  const discountPercent = data.context?.discount_percent || 15;
  const hotelName = data.context?.hotel_name || '프리미엄 인기 객실';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 transform transition-all scale-100">
        {/* Top Header - Solid Dark Navy */}
        <div className="bg-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dynamic Cross-Device Badge */}
          <div className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3.5 py-1 rounded-full text-xs font-bold mb-3 text-blue-300 shadow-inner">
            {triggerDevice === 'mobile' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>📱 모바일 이탈 감지 엔진 가동중</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>💻 데스크톱 마우스 궤적 감지</span>
              </>
            )}
          </div>

          <h2 className="text-2xl font-black tracking-tight mb-1">
            잠깐만요! 그냥 나가시게요? 🎁
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            지금 이탈하시면 오늘만 제공되는 전용 시크릿 할인 쿠폰이 사라집니다.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100 mb-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Gift className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 mb-1">{hotelName}</p>
            <div className="text-4xl font-black text-blue-600 tracking-tight my-1">
              {discountPercent}% 즉시 할인
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {data.context?.message || '오늘 단 하루 적용 가능한 서프라이즈 쿠폰'}
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={onAccept}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>15% 할인쿠폰 받아두기</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              괜찮습니다, 혜택 없이 둘러볼게요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
