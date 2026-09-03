import React from 'react';
import { ShieldCheck, Zap, LineChart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                H
              </div>
              <span className="text-xl font-bold text-white tracking-tight">HoverStay</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed font-medium">
              프리미엄 숙소 예약 플랫폼 & 실시간 마케팅 테크 엔진.
              사용자의 이탈 의도를 실시간 감지하여 최적의 쿠폰과 최저가 혜택을 다이내믹하게 제공합니다.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">HoverStay Engine</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li className="flex items-center gap-1.5 text-gray-400">
                <Zap className="w-4 h-4 text-amber-400" /> Exit-Intent Detection
              </li>
              <li className="flex items-center gap-1.5 text-gray-400">
                <LineChart className="w-4 h-4 text-emerald-400" /> Event Stream Analytics
              </li>
              <li className="flex items-center gap-1.5 text-gray-400">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Lowest Price Guarantee
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">프로젝트 정보</h4>
            <p className="text-xs text-gray-400 leading-normal font-medium">
              이 프로젝트는 KNU Capstone Design 프론트엔드를 React 18 + TypeScript + Tailwind CSS로 업그레이드한 프리미엄 포트폴리오입니다.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© 2026 HoverStay. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">이용약관</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">개인정보처리방침</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">개발자 포트폴리오</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
