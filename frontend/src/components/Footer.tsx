import React from 'react';
import { ShieldCheck, Zap, LineChart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-gray-300 mt-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2 space-y-3">
            {/* Matching Header Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center p-2 shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V7l7-4 7 4v14" />
                  <path d="M9 10a3 3 0 1 1 6 0c0 1.5-1.5 2.5-3 3.5v1.5" />
                  <circle cx="12" cy="18" r="1" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-none">
                  HoverStay
                </span>
                <span className="text-[10px] font-extrabold text-blue-400 tracking-widest uppercase mt-0.5">
                  Premium Stay
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-medium">
              국내 단독 최저가 프리미엄 호텔 & 한옥 스테이 예약 플랫폼.
              엄선된 최상급 숙소와 회원 전용 단독 할인 혜택으로 감성적인 휴식을 선사합니다.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-white mb-3 tracking-wider uppercase">HOVERSTAY BENEFIT</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" /> 회원 전용 100% 최저가 보장
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <LineChart className="w-4 h-4 text-emerald-400 shrink-0" /> 실시간 최저가 쿠폰 자동 적용
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" /> 프리미엄 안심 숙소 큐레이션
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-white mb-3 tracking-wider uppercase">고객센터 안내</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              고객센터: 1588-0000 (09:00 ~ 18:00)<br />
              이메일: support@hoverstay.co.kr<br />
              서울특별시 종로구 계동길 49-23 HoverStay
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 HoverStay. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">이용약관</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">개인정보처리방침</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">사업자정보확인</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
