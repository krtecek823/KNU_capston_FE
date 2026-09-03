import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { api } from '../services/api';
import { Hotel } from '../types';

export const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getHotels().then(setHotels);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-container to-blue-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent opacity-70"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-blue-100 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" /> AI 행동 분석 기반 프리미엄 숙소 케어
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            완벽한 휴식을 선사하는 <br />
            <span className="text-amber-300">HoverStay 프리미엄 스테이</span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto font-medium">
            최적의 가격과 서프라이즈 혜택을 실시간으로 제안합니다. 지금 바로 나만을 위한 추천 객실을 확인해 보세요.
          </p>

          {/* Search Card Box */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-gray-900 max-w-4xl mx-auto border border-gray-100 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-left">
              <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-gray-200">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  지역 또는 숙소명
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <input
                    type="text"
                    placeholder="어디로 떠나시나요? (예: 광진구, 마포구, 워커힐)"
                    className="w-full bg-transparent text-sm font-bold text-gray-900 focus:outline-none placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  일정
                </label>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>오늘 ~ 내일 (1박)</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  인원
                </label>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Users className="w-4 h-4 text-primary" />
                  <span>성인 2명</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                to={`/search?q=${encodeURIComponent(searchQuery)}`}
                className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>최저가 숙소 검색하기</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold text-xl">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-1">실시간 이탈 감지 혜택</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                고객의 이탈 의도를 AI 엔진이 감지하여 단 한 번의 시크릿 할인 쿠폰을 자동 제공합니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-1">100% 최저가 보장제</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                동일 조건 객실이 타사에서 더 저렴할 경우 차액의 100%를 보상해 드립니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-1">스마트 AI 맞춤 추천</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                평점과 만족도가 높은 인증된 럭셔리 스테이만을 엄선하여 실시간 매칭해 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              PROMOTION HOTELS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              이번 주 인기 특가 스테이 🔥
            </h2>
          </div>
          <Link
            to="/search"
            className="text-sm font-bold text-primary hover:text-primary-container flex items-center gap-1"
          >
            전체보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
};
