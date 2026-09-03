import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ShieldCheck, Star, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { Hotel } from '../types';

export const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedCategory] = useState('전체');

  // Dynamic Date Formatter (e.g. 09.03(목) ~ 09.04(금) (1박))
  const getFormattedDates = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date();
    const tomorrow = new Date(Date.now() + 86400000);

    const format = (d: Date) => {
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dayName = days[d.getDay()];
      return `${m}.${date}(${dayName})`;
    };

    return `${format(today)} ~ ${format(tomorrow)} (1박)`;
  };

  const dateString = getFormattedDates();

  const curations = [
    { id: '전체', label: '전체 스테이' },
    { id: '럭셔리', label: '5성급 럭셔리' },
    { id: '한강뷰', label: '한강 & 오션뷰' },
    { id: '독채', label: '프라이빗 독채' },
    { id: '스파', label: '힐링 스파' },
  ];

  useEffect(() => {
    api.getHotels().then(setHotels);
  }, []);

  const filteredHotels = hotels.filter((h) => {
    if (selectedTag === '전체') return true;
    if (selectedTag === '럭셔리') return h.tags.includes('5성급') || h.tags.includes('럭셔리');
    if (selectedTag === '한강뷰') return h.tags.includes('한강뷰') || h.tags.includes('오션뷰');
    if (selectedTag === '독채') return h.tags.includes('독채') || h.tags.includes('인피니티풀');
    if (selectedTag === '스파') return h.features.some(f => f.includes('스파') || f.includes('수영장'));
    return true;
  });

  const featuredMagazineStay = hotels[0];
  const editorialCollection = hotels.slice(1, 4);

  return (
    <div className="space-y-20 pb-28 bg-[#fafafa]">
      
      {/* 1. Full-bleed Stayfolio Curation Hero with Floating Glass Dock */}
      <section className="relative h-[540px] sm:h-[600px] w-full overflow-hidden bg-slate-950 flex flex-col justify-center p-6 sm:p-12 text-white">
        {/* Background Curated Image */}
        {featuredMagazineStay && (
          <img
            src={featuredMagazineStay.imageUrl}
            alt="Hero Stay"
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30"></div>

        {/* Center Editorial Magazine Title */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 my-auto">
          <p className="text-xs sm:text-sm font-extrabold text-blue-300 tracking-widest">
            비일상의 온전한 휴식
          </p>
          <h1 className="text-3xl sm:text-5xl sm:leading-tight font-black tracking-tight text-white">
            당신의 특별한 날을 완성하는 <br />
            단 하나의 프라이빗 공간
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mx-auto">
            엄선된 국내 최상급 호텔과 리조트. 회원 전용 단독 최저가 혜택으로 지금 떠나보세요.
          </p>
        </div>

        {/* Floating Minimal Search Dock */}
        <div className="relative z-10 max-w-3xl mx-auto w-full mt-6">
          <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl sm:rounded-full shadow-2xl border border-white/80 text-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
              }}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 bg-slate-50/80 sm:bg-transparent rounded-xl">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <input
                  type="text"
                  placeholder="어디로 떠나시나요? (예: 광진구, 워커힐, 한강뷰)"
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Dynamic Real Date Range Display */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 border-l border-slate-200 text-xs font-extrabold text-slate-800 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{dateString}</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs px-7 py-3 rounded-xl sm:rounded-full shadow-md transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>검색</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Magazine Editorial Collection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
              CURATED STAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              이번 주 매거진 추천 컬렉션 🌿
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium max-w-xs">
            공간의 미학, 최고급 편의시설, 그리고 단독 최저가 혜택을 갖춘 공간만을 매주 엄선합니다.
          </p>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {editorialCollection.map((stay, index) => (
            <div
              key={stay.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={stay.imageUrl}
                  alt={stay.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>추천 스테이 0{index + 1}</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black px-3 py-1.5 rounded-xl shadow-sm">
                  100% 최저가 보장
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{stay.rating}</span>
                    <span className="text-slate-400 font-normal">({stay.reviewCount} 리뷰)</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {stay.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {stay.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through block font-medium">
                      ₩{stay.originalPrice.toLocaleString()}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-900">
                        ₩{stay.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ 1박</span>
                    </div>
                  </div>

                  <Link
                    to={`/hotels/${stay.id}`}
                    className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-xs"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Filtered Stay Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
              ALL STAYS
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              전체 큐레이션 공간 탐색
            </h2>
          </div>

          {/* Minimal Tag Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {curations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedTag === c.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* All Stays Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {hotel.category}
                </div>
                <div className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  최저가 보장
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{hotel.rating}</span>
                    <span className="text-slate-400 font-normal">({hotel.reviewCount}개 평가)</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {hotel.name}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {hotel.location}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through block font-medium">
                      ₩{hotel.originalPrice.toLocaleString()}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-900">
                        ₩{hotel.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ 1박</span>
                    </div>
                  </div>

                  <Link
                    to={`/hotels/${hotel.id}`}
                    className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    상세보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
