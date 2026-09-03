import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Sparkles, TrendingUp, ShieldCheck, Tag } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { api } from '../services/api';
import { Hotel } from '../types';

export const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', '서울 인기', '5성급 럭셔리', '한강/오션뷰', '감성 독채', '특가 딜'];

  useEffect(() => {
    api.getHotels().then(setHotels);
  }, []);

  const filteredHotels = hotels.filter((h) => {
    if (selectedCategory === '전체') return true;
    if (selectedCategory === '5성급 럭셔리') return h.tags.includes('5성급') || h.tags.includes('럭셔리');
    if (selectedCategory === '한강/오션뷰') return h.tags.includes('한강뷰') || h.tags.includes('오션뷰');
    if (selectedCategory === '감성 독채') return h.tags.includes('독채') || h.tags.includes('인피니티풀');
    if (selectedCategory === '특가 딜') return ((h.originalPrice - h.discountPrice) / h.originalPrice) >= 0.1;
    return true;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary to-blue-950 text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[2.5rem] shadow-2xl">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight pt-4">
            완벽한 휴식을 선사하는 <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400">
              HoverStay 프리미엄 스테이
            </span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            최적의 가격과 서프라이즈 혜택을 실시간으로 제안합니다. 지금 바로 나만을 위한 추천 객실을 확인해 보세요.
          </p>

          {/* Search Card Box */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl text-gray-900 max-w-4xl mx-auto border border-white/60 mt-8 transition-all hover:shadow-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-left">
              <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-gray-200/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  지역 또는 숙소명
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="text"
                    placeholder="어디로 떠나시나요? (예: 광진구, 마포구, 워커힐)"
                    className="w-full bg-transparent text-sm font-bold text-gray-900 focus:outline-none placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200/80">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  일정
                </label>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>오늘 ~ 내일 (1박)</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200/80">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  인원
                </label>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Users className="w-4 h-4 text-primary shrink-0" />
                  <span>성인 2명</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-500">
                <Tag className="w-3.5 h-3.5 text-primary" /> 인기 검색: 광진구 워커힐, 마포 한강뷰, 구로 신도림
              </div>
              <Link
                to={`/search?q=${encodeURIComponent(searchQuery)}`}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold text-xl group-hover:bg-primary group-hover:text-white transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-1">실시간 이탈 감지 혜택</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                고객의 이탈 의도를 실시간 감지하여 단 한 번의 시크릿 할인 쿠폰을 자동 제공합니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-1">100% 최저가 보장제</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                동일 조건 객실이 타사에서 더 저렴할 경우 차액의 100%를 보상해 드립니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-1">프리미엄 맞춤 큐레이션</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                평점과 만족도가 높은 검증된 럭셔리 스테이만을 엄선하여 실시간 제안해 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
            className="text-sm font-bold text-primary hover:text-primary-container flex items-center gap-1 self-start sm:self-auto"
          >
            전체보기 →
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
};
