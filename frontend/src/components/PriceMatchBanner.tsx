import React from 'react';
import { ShieldCheck, X, Zap } from 'lucide-react';
import { DecisionResponse } from '../types';

interface PriceMatchBannerProps {
  data: DecisionResponse;
  onClose: () => void;
}

export const PriceMatchBanner: React.FC<PriceMatchBannerProps> = ({ data, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-primary to-blue-800 text-white py-3 px-4 shadow-md sticky top-16 z-30 animate-slide-down">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-blue-950 font-black px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
            <Zap className="w-3 h-3 fill-blue-950" /> 최저가 보장
          </span>
          <span className="font-medium text-blue-50">
            {data.context?.message || '다른 사이트에서 더 저렴한 금액을 발견하면 차액의 100%를 즉시 보상해 드립니다.'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-amber-300 font-bold">
            <ShieldCheck className="w-4 h-4" /> HoverStay Guarantee Active
          </span>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
