import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, ShieldCheck, Check } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { api } from '../services/api';
import { Hotel } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'rating'>('recommended');

  useEffect(() => {
    setLoading(true);
    api.getHotels(queryParam).then((res) => {
      setHotels(res);
      setLoading(false);
    });
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  // Filter & Sort
  const filteredHotels = hotels
    .filter((h) => h.discountPrice <= maxPrice && h.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.discountPrice - b.discountPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#f8fafc]">
      {/* Top Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:bg-white focus-within:border-primary transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="지역명, 호텔명, 태그로 검색하세요 (예: 마포, 5성급, 한강뷰)"
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-blue-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md transition-colors"
          >
            검색하기
          </button>
        </form>
      </div>

      {/* Main Search Content Layout (Sidebar + Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Agoda / Booking style Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" /> 필터 검색
            </h3>
            <button
              onClick={() => {
                setMaxPrice(300000);
                setMinRating(4.0);
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              초기화
            </button>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              최대 1박 가격: <span className="text-primary">₩{maxPrice.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="80000"
              max="300000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>8만원</span>
              <span>30만원</span>
            </div>
          </div>

          {/* Min Rating Filter */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-2">최소 평점</label>
            <div className="space-y-1.5">
              {[4.8, 4.5, 4.0].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    minRating === r
                      ? 'bg-blue-50 text-primary border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {r}점 이상
                  </span>
                  {minRating === r && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Value Badges */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% 최저가 보장
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              HoverStay에서 예약 시 타사 대비 차액 100% 보상제가 자동 적용됩니다.
            </p>
          </div>
        </div>

        {/* Results Main Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header & Sort Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h1 className="text-xl font-black text-slate-900">
                {queryParam ? `'${queryParam}' 검색 결과` : '전체 추천 프리미엄 숙소'}
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                총 <span className="text-primary font-bold">{filteredHotels.length}개</span>의 추천 숙소를 찾았습니다.
              </p>
            </div>

            {/* Sort Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSortBy('recommended')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'recommended' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                추천순
              </button>
              <button
                onClick={() => setSortBy('price_asc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'price_asc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                낮은 가격순
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'rating' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                평점 높은순
              </button>
            </div>
          </div>

          {/* Hotels Grid */}
          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm font-semibold text-slate-500">실시간 최저가 정보를 불러오는 중...</p>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">조건에 맞는 숙소가 없습니다</h3>
              <p className="text-xs text-slate-500">필터 가격 범위를 넓히거나 다른 검색어로 조회해 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
