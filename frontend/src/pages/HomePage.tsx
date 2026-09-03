import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ShieldCheck, Sparkles, Award, Star, ArrowRight, Flame } from 'lucide-react';
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
    <div className="space-y-12 pb-20 bg-[#fafafa]">
      {/* Dynamic Hero Section with Rich Sunset Orange & Deep Indigo Contrast */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white pt-14 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-xl overflow-hidden">
        {/* Soft Background Accent Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-200 border border-orange-400/30 px-4 py-1.5 rounded-full text-xs font-extrabold backdrop-blur-md">
            <Award className="w-4 h-4 text-orange-400" /> 대한민국 대표 최저가 보장 예약 플랫폼
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            어디로 떠나시나요? <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-amber-200 to-amber-400">
              국내 최고급 호텔 & 리조트 단독 특가
            </span>
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            전국 엄선된 특급 숙소 실시간 비교. 다른 사이트보다 더 저렴한 단독 회원 할인을 경험해 보세요.
          </p>

          {/* Vibrant Search Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-900 max-w-4xl mx-auto border border-white/80 mt-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  여행지 또는 숙소명
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="어디로 떠나시나요? (예: 광진구, 마포구, 워커힐)"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  체크인 ~ 체크아웃
                </label>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>오늘 ~ 내일 (1박)</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  인원 및 객실
                </label>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>성인 2명 · 객실 1개</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>인기 지역: 광진구 워커힐, 마포 한강뷰, 구로 신도림</span>
              </div>

              <Link
                to={`/search?q=${encodeURIComponent(searchQuery)}`}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm px-9 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                <span>최저가 검색</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Differentiated Features Card Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">100% 최저가 보장제</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                동일 조건 객실이 다른 사이트보다 비싸면 차액의 100%를 즉시 보상해 드립니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 font-bold text-xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">실시간 시크릿 할인 쿠폰</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                고객의 이탈 및 검색 신호를 감지하여 지금 결제 시 단독 추가 할인쿠폰을 선물합니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xl">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">검증된 고급 특급 숙소</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                투숙객 평점 9.0 이상의 검증된 럭셔리 숙소만을 큐레이션하여 소개합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              추천 숙소 목록
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              이번 주 가장 인기 있는 숙소 🔥
            </h2>
          </div>
          <Link
            to="/search"
            className="text-sm font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto group"
          >
            <span>전체보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
};
