import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ShieldCheck, Star, ArrowUpRight, X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useHotels } from '../hooks/useHotelQueries';
import { HotelCardSkeleton } from '../components/HotelCardSkeleton';

export const HomePage: React.FC = () => {
  const { data: hotels = [], isLoading } = useHotels();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedCategory] = useState('전체');

  // Dynamic Date States for Visual Calendar
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);

  const [checkIn, setCheckIn] = useState<Date>(today);
  const [checkOut, setCheckOut] = useState<Date | null>(tomorrow);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Month navigation in calendar
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  const curations = [
    { id: '전체', label: '전체 스테이' },
    { id: '럭셔리', label: '5성급 럭셔리' },
    { id: '한강뷰', label: '한강 & 오션뷰' },
    { id: '독채', label: '프라이빗 독채' },
    { id: '스파', label: '힐링 스파' },
  ];

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
      if (hoverDate && hoverDate.getTime() > checkIn.getTime()) {
        const diff = Math.round((hoverDate.getTime() - checkIn.getTime()) / 86400000);
        return `${format(checkIn)} ~ ${format(hoverDate)} (${diff}박 선택 중)`;
      }
      return `${format(checkIn)} ~ 체크아웃 날짜 선택`;
    }

    const diffTime = Math.max(86400000, checkOut.getTime() - checkIn.getTime());
    const nights = Math.round(diffTime / 86400000);

    return `${format(checkIn)} ~ ${format(checkOut)} (${nights}박)`;
  };

  const resetSelection = () => {
    const now = new Date();
    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = new Date(d1.getTime() + 86400000);
    setCheckIn(d1);
    setCheckOut(d2);
    setIsSelectingCheckOut(false);
    setHoverDate(null);
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
      setCheckIn(dayDate);
      setCheckOut(null);
      setIsSelectingCheckOut(true);
    } else {
      if (dayDate.getTime() > checkIn.getTime()) {
        setCheckOut(dayDate);
        setIsSelectingCheckOut(false);
      } else {
        setCheckIn(dayDate);
        setCheckOut(null);
        setIsSelectingCheckOut(true);
      }
    }
  };

  const renderMonthGrid = (year: number, month: number) => {
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfWeek(year, month);

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(year, month, d);
      const dayTime = dayDate.getTime();
      const inTime = checkIn.getTime();
      const outTime = checkOut ? checkOut.getTime() : hoverDate ? hoverDate.getTime() : null;

      const isToday = dayDate.toDateString() === today.toDateString();
      const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const isStart = dayTime === inTime;
      const isEnd = checkOut ? dayTime === checkOut.getTime() : false;
      const isInRange = outTime && dayTime > inTime && dayTime < outTime;

      let btnStyle = 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium';
      if (isPast) {
        btnStyle = 'text-slate-300 cursor-not-allowed';
      } else if (isStart || isEnd) {
        btnStyle = 'bg-blue-600 text-white font-black shadow-md rounded-xl';
      } else if (isInRange) {
        btnStyle = 'bg-blue-100 text-blue-800 font-bold rounded-none';
      } else if (isToday) {
        btnStyle = 'border border-blue-500 text-blue-600 font-bold';
      }

      days.push(
        <button
          key={d}
          disabled={isPast}
          onClick={() => handleDateClick(dayDate)}
          onMouseEnter={() => {
            if (isSelectingCheckOut) setHoverDate(dayDate);
          }}
          className={`h-10 text-xs sm:text-sm flex items-center justify-center transition-all ${btnStyle}`}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-center font-black text-slate-800 text-sm">
          {year}년 {monthNames[month]}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold text-slate-400">
          <span className="text-rose-500">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-blue-500">토</span>
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Search Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-4 py-1.5 rounded-full text-xs font-extrabold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> 국내 단독 최저가 프리미엄 스테이
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            당신의 특별한 날을 완성하는 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">
              단 하나의 프라이빗 공간
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            엄선된 국내 최상급 호텔과 리조트. 회원 전용 단독 최저가 혜택으로 지금 떠나보세요.
          </p>

          {/* Interactive Search Dock */}
          <div className="pt-6">
            <div className="bg-white/95 backdrop-blur-xl p-3 rounded-2xl sm:rounded-full shadow-2xl border border-white/20 text-slate-900 max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <input
                  type="text"
                  placeholder="어디로 떠나시나요? (예: 광진구, 워커힐, 해운대, 북촌)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-hidden placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Dynamic Range Trigger */}
              <button
                onClick={() => setShowCalendarModal(true)}
                className="flex items-center gap-3 px-4 py-2 text-left border-b sm:border-b-0 border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    CHECK-IN / OUT
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                    {getFormattedDates()}
                  </span>
                </div>
              </button>

              <Link
                to={`/search?q=${encodeURIComponent(searchQuery)}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-xl sm:rounded-full flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">검색</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Multi-Night Range Picker Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> 체크인 / 체크아웃 날짜 선택
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  원하시는 체크인 날짜와 체크아웃 날짜를 순서대로 클릭해 주세요.
                </p>
              </div>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Range Display Bar */}
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">선택된 일정:</span>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
                  {getFormattedDates()}
                </span>
              </div>

              <button
                onClick={resetSelection}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 초기화
              </button>
            </div>

            {/* Dual Month Calendar View */}
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
                선택 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Recommended Stays */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
              WEEKLY BEST SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              이번 주 가장 사랑받은 호캉스 스테이
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs font-extrabold text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            전체보기 <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stays Grid with TanStack Query Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading
            ? [1, 2, 3].map((n) => <HotelCardSkeleton key={n} />)
            : recommendedStays.map((stay) => (
                <div
                  key={stay.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={stay.imageUrl}
                      alt={stay.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1.5 rounded-full">
                      {stay.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-white" /> {stay.rating}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {stay.location}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                        {stay.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
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

        {/* All Stays Grid with Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? [1, 2, 3, 4, 5, 6].map((n) => <HotelCardSkeleton key={n} />)
            : filteredHotels.map((hotel) => (
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
