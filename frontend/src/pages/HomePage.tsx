import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ShieldCheck, Star, ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { Hotel } from '../types';

export const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedCategory] = useState('전체');

  // Dynamic Date States for Visual Calendar
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);

  const [checkIn, setCheckIn] = useState<Date>(today);
  const [checkOut, setCheckOut] = useState<Date | null>(tomorrow);
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Month navigation in calendar
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed (8 = Sep)

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

  const recommendedStays = hotels.slice(1, 4);

  // Calculate Night & Format String
  const getFormattedDates = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    const format = (d: Date) => {
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dayName = days[d.getDay()];
      return `${m}.${date}(${dayName})`;
    };

    if (!checkOut) {
      return `${format(checkIn)} ~ 체크아웃 날짜 선택`;
    }

    const diffTime = Math.max(86400000, checkOut.getTime() - checkIn.getTime());
    const nights = Math.round(diffTime / 86400000);

    return `${format(checkIn)} ~ ${format(checkOut)} (${nights}박)`;
  };

  // Calendar Helper Functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Interactive Multi-Night Date Click Handler
  const handleDateClick = (dayDate: Date) => {
    if (!isSelectingCheckOut) {
      // First Click: Set Check-In
      setCheckIn(dayDate);
      setCheckOut(null);
      setIsSelectingCheckOut(true);
    } else {
      // Second Click: Set Check-Out
      if (dayDate.getTime() > checkIn.getTime()) {
        setCheckOut(dayDate);
        setIsSelectingCheckOut(false);
      } else {
        // If clicked date is earlier or same, reset Check-In to clicked date
        setCheckIn(dayDate);
        setCheckOut(null);
        setIsSelectingCheckOut(true);
      }
    }
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isInRange = (d: Date) => {
    if (!checkIn || !checkOut) return false;
    return d.getTime() > checkIn.getTime() && d.getTime() < checkOut.getTime();
  };

  const renderMonthGrid = (year: number, month: number) => {
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const weekHeaders = ['일', '월', '화', '수', '목', '금', '토'];

    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      daysArray.push(new Date(year, month, d));
    }

    return (
      <div className="space-y-3">
        <div className="text-center font-extrabold text-sm text-slate-900">
          {year}년 {month + 1}월
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
          {weekHeaders.map((w, idx) => (
            <div key={idx} className={idx === 0 ? 'text-rose-500' : ''}>
              {w}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((d, idx) => {
            if (!d) return <div key={idx} className="h-9"></div>;

            const isStart = isSameDay(d, checkIn);
            const isEnd = isSameDay(d, checkOut);
            const inBetween = isInRange(d);
            const isPast = d.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

            let btnStyle = 'hover:bg-slate-100 text-slate-800 font-bold rounded-xl';
            if (isPast) {
              btnStyle = 'text-slate-300 pointer-events-none';
            } else if (isStart || isEnd) {
              btnStyle = 'bg-blue-600 text-white font-black shadow-sm rounded-xl';
            } else if (inBetween) {
              btnStyle = 'bg-blue-100 text-blue-900 font-extrabold rounded-none';
            }

            return (
              <button
                key={idx}
                disabled={isPast}
                onClick={() => handleDateClick(d)}
                className={`h-9 w-full flex items-center justify-center text-xs transition-all ${btnStyle}`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-20 pb-28 bg-[#fafafa]">
      
      {/* 1. Domestic Luxury Hotel Hero with Interactive Floating Search Dock */}
      <section className="relative h-[540px] sm:h-[600px] w-full bg-slate-950 flex flex-col justify-center p-6 sm:p-12 text-white">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
          alt="Hero Stay Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20"></div>

        {/* Center Title & Subtitle */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 my-auto">
          <p className="text-xs sm:text-sm font-extrabold text-blue-300 tracking-widest">
            국내 단독 최저가 프리미엄 스테이
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
                  placeholder="어디로 떠나시나요? (예: 광진구, 워커힐, 해운대, 북촌)"
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Interactive Real Date Range Button */}
              <button
                type="button"
                onClick={() => setShowCalendarModal(true)}
                className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 bg-slate-100 sm:bg-transparent hover:bg-slate-200/60 rounded-xl sm:rounded-full border-t sm:border-t-0 sm:border-l border-slate-200 text-xs font-extrabold text-slate-800 whitespace-nowrap transition-colors"
              >
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{getFormattedDates()}</span>
              </button>

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

      {/* Real Visual Monthly Calendar Modal Overlay */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> 체크인 & 체크아웃 일정 선택
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  1차 클릭으로 <span className="font-bold text-blue-600">체크인</span>을, 2차 클릭으로 <span className="font-bold text-blue-600">체크아웃</span> 날짜를 자유롭게 지정해 주세요 (2박, 3박, 5박 이상 연박 가능).
                </p>
              </div>

              <button
                onClick={() => setShowCalendarModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Controls & Dual Month View */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={() => {
                    if (viewMonth === 0) {
                      setViewMonth(11);
                      setViewYear(viewYear - 1);
                    } else {
                      setViewMonth(viewMonth - 1);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
                  {getFormattedDates()}
                </span>

                <button
                  onClick={() => {
                    if (viewMonth === 11) {
                      setViewMonth(0);
                      setViewYear(viewYear + 1);
                    } else {
                      setViewMonth(viewMonth + 1);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dual Month Calendar Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                {renderMonthGrid(viewYear, viewMonth)}
                {renderMonthGrid(
                  viewMonth === 11 ? viewYear + 1 : viewYear,
                  viewMonth === 11 ? 0 : viewMonth + 1
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-blue-600 inline-block"></span>
                  <span>체크인/체크아웃</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-blue-100 inline-block"></span>
                  <span>연박 하이라이트</span>
                </div>
              </div>

              <button
                disabled={!checkOut}
                onClick={() => setShowCalendarModal(false)}
                className={`font-extrabold text-xs px-7 py-3 rounded-xl transition-all shadow-md ${
                  checkOut
                    ? 'bg-slate-900 hover:bg-blue-600 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                일정 확정하기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. Recommended Stays Section (Single-Line Description) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
              BEST SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              이번 주 인기 추천 숙소 🔥
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:block">
            뛰어난 만족도, 최고급 시설, 회원 단독 최저가 혜택을 갖춘 인기 숙소를 엄선했습니다.
          </p>
        </div>

        {/* Recommended Hotel Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {recommendedStays.map((stay, index) => (
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
                  <span>인기 추천 0{index + 1}</span>
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
              ALL DOMESTIC STAYS
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              국내 전체 최저가 숙소
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
