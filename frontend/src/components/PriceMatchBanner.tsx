import React from 'react';
import { ShieldCheck, X, Zap } from 'lucide-react';
import { DecisionResponse } from '../types';

interface PriceMatchBannerProps {
  data: DecisionResponse;
  onClose: () => void;
}

export const PriceMatchBanner: React.FC<PriceMatchBannerProps> = ({ data, onClose }) => {
  return (
    <div className="bg-slate-900 text-white py-3 px-4 shadow-md sticky top-16 z-30 animate-slide-down border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white font-black px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" /> 최저가 보장
          </span>
          <span className="font-semibold text-slate-100">
            {data.context?.message || '다른 사이트에서 더 저렴한 금액을 발견하면 차액의 100%를 즉시 보상해 드립니다.'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-blue-300 font-bold">
            <ShieldCheck className="w-4 h-4" /> 최저가 보장제 적용 중
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
