import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Search, Ticket, User, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-primary/20 group-hover:scale-105 transition-all duration-200">
            H
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-primary transition-colors">
              HoverStay
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-primary font-bold border border-blue-100/80">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Verified Stay
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive('/')
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> 홈
            </span>
          </Link>
          <Link
            to="/search"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive('/search')
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4" /> 숙소 검색
            </span>
          </Link>
          <Link
            to="/coupons"
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive('/coupons')
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Ticket className="w-4 h-4" /> 쿠폰함
            </span>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 p-1.5 pr-3 text-gray-700 hover:text-primary hover:bg-blue-50/60 rounded-full border border-gray-200/80 transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold hidden sm:inline">내 예약</span>
          </button>
        </div>
      </div>
    </header>
  );
};
