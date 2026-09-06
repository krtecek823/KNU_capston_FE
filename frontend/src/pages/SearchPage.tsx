import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Check } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { HotelCardSkeleton } from '../components/HotelCardSkeleton';
import { useHotels } from '../hooks/useHotelQueries';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const { data: hotels = [], isLoading } = useHotels(queryParam);

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'rating'>('recommended');

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
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:bg-white focus-within:border-blue-600 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="지역명, 호텔명, 태그로 검색하세요 (예: 마포, 5성급, 한강뷰)"
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-hidden placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            검색
          </button>
        </form>
      </div>

      {/* Main Grid: Filters & Search Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" /> 필터 검색
              </h3>
              <span className="text-xs text-slate-400 font-bold">
                {filteredHotels.length}개 숙소
              </span>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700">1박 최고 가격</span>
                <span className="text-blue-600 font-black">
                  ₩{maxPrice.toLocaleString()} 이하
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="300000"
                step="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">최소 평점</span>
              <div className="grid grid-cols-3 gap-2">
                {[4.0, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all ${
                      minRating === rating
                        ? 'bg-blue-50 border-blue-600 text-blue-600 font-black'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{rating}+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">정렬 기준</span>
              <div className="space-y-1.5">
                {[
                  { id: 'recommended', label: '추천순 (이탈 방지 최저가)' },
                  { id: 'price_asc', label: '낮은 가격순' },
                  { id: 'rating', label: '평점 높은순' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSortBy(item.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                      sortBy === item.id
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {sortBy === item.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Search Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              {queryParam ? `'${queryParam}' 검색 결과` : '전체 추천 숙소'}
            </h2>
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              실시간 100% 최저가 보장
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <HotelCardSkeleton key={n} />
              ))}
            </div>
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">조건에 맞는 숙소가 없습니다.</h3>
              <p className="text-xs text-slate-400">
                필터 가격을 높이거나 다른 지역 검색어를 입력해 보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
