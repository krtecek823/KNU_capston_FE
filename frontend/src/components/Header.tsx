import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Search, Ticket, Sparkles, User } from 'lucide-react';

interface HeaderProps {
  onTriggerDemoModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onTriggerDemoModal }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-primary-container transition-colors">
            H
          </div>
          <div>
            <span className="text-xl font-extrabold text-primary tracking-tight">HoverStay</span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-primary font-semibold border border-blue-100">
              AI Smart Care
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isActive('/') ? 'bg-primary-fixed text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> 홈
            </span>
          </Link>
          <Link
            to="/search"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isActive('/search') ? 'bg-primary-fixed text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4" /> 숙소 검색
            </span>
          </Link>
          <Link
            to="/coupons"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isActive('/coupons') ? 'bg-primary-fixed text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Ticket className="w-4 h-4" /> 쿠폰함
            </span>
          </Link>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {onTriggerDemoModal && (
            <button
              onClick={onTriggerDemoModal}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
              title="이탈 감지 쿠폰 모달 수동 테스트"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 이탈감지 시뮬레이션
            </button>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
