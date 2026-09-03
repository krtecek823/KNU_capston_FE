import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { api } from '../services/api';
import { Hotel } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Bar Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="지역명, 호텔명, 태그로 검색하세요 (예: 마포, 5성급, 한강뷰)"
              className="w-full bg-transparent text-sm font-bold text-gray-900 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-container text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md transition-colors"
          >
            검색하기
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {queryParam ? `'${queryParam}' 검색 결과` : '전체 추천 숙소 목록'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            총 <span className="font-bold text-primary">{hotels.length}개</span>의 특가 숙소를 찾았습니다.
          </p>
        </div>

        <button className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-sm hover:bg-gray-50">
          <SlidersHorizontal className="w-4 h-4" /> 필터 및 정렬
        </button>
      </div>

      {/* Hotels List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-gray-500">최저가 숙소 정보를 불러오는 중...</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">검색 결과가 없습니다</h3>
          <p className="text-xs text-gray-500">다른 지역명이나 키워드로 검색해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};
