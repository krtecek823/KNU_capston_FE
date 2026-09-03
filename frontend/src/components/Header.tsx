import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Search, User, Ticket } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - 100% Korean Domestic Travel Platform */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center p-2 shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-all duration-200">
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
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Hover<span className="text-indigo-600">Stay</span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 tracking-tight -mt-1">
              국내 단독 최저가 스테이
            </span>
          </div>
        </Link>

        {/* Top Navigation - Coupons removed as requested (accessible via My Page) */}
        <nav className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all duration-200 ${
              isActive('/')
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" /> 홈
            </span>
          </Link>
          <Link
            to="/search"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all duration-200 ${
              isActive('/search')
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4 text-indigo-600" /> 숙소 검색
            </span>
          </Link>
        </nav>

        {/* Right User Navigation */}
        <div className="flex items-center gap-3">
          <Link
            to="/coupons"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Ticket className="w-4 h-4 text-orange-500" />
            <span>내 쿠폰함</span>
          </Link>

          <button className="flex items-center gap-2 p-1.5 pr-3.5 text-slate-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-full border border-slate-200 shadow-xs transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold hidden sm:inline">마이페이지</span>
          </button>
        </div>
      </div>
    </header>
  );
};
