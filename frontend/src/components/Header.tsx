import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Search, Ticket, User, Globe, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Custom SVG Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center p-2 shadow-md shadow-slate-900/10 group-hover:bg-primary transition-all duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-white"
            >
              {/* Hotel Building + Crown Keyhole Icon */}
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 10a3 3 0 1 1 6 0c0 1.5-1.5 2.5-3 3.5v1.5" />
              <circle cx="12" cy="18" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                Hover<span className="text-primary">Stay</span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase -mt-1">
              Luxury & Best Rate
            </span>
          </div>
        </Link>

        {/* Navigation Bar - Agoda / Booking style */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-gray-100">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive('/')
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" /> 홈
            </span>
          </Link>
          <Link
            to="/search"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive('/search')
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4 text-primary" /> 숙소 검색
            </span>
          </Link>
          <Link
            to="/coupons"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive('/coupons')
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-amber-500" /> 쿠폰함
            </span>
          </Link>
        </nav>

        {/* Right Utility Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-gray-600 border-r border-gray-200 pr-3">
            <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
              <Globe className="w-3.5 h-3.5 text-gray-400" /> KO <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
              ₩ KRW
            </button>
          </div>

          <button className="flex items-center gap-2 p-1.5 pr-3.5 text-slate-800 hover:text-primary hover:bg-blue-50/60 rounded-full border border-gray-200/80 shadow-xs transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold hidden sm:inline">내 예약</span>
          </button>
        </div>
      </div>
    </header>
  );
};
