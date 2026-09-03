import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ShieldCheck, Star, ArrowRight, MousePointer, Copy, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Hotel } from '../types';

export const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [testNotification, setTestNotification] = useState<string | null>(null);

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

  const triggerTestSimulation = (type: 'exit' | 'copy') => {
    if (type === 'exit') {
      setTestNotification('⚡ [실시간 감지 모의 테스트] 마우스 주소창 이동 감지 ➔ 15% 시크릿 쿠폰 모달 작동!');
    } else {
      setTestNotification('🔍 [실시간 감지 모의 테스트] 호텔명 복사 신호 감지 ➔ 100% 최저가 차액 보상 배너 작동!');
    }
    setTimeout(() => setTestNotification(null), 4000);
  };

  const heroHotel = hotels[0];

  return (
    <div className="space-y-16 pb-24 bg-slate-50">
      {/* Test Notification Toast */}
      {testNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{testNotification}</span>
        </div>
      )}

      {/* Asymmetric Editorial Hero Layout */}
      <section className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 rounded-b-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Bold Editorial Messaging */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-800 text-blue-300 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              HoverStay 실시간 감지 파이프라인 가동 중
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              손님이 이탈하기 전 1초, <br />
              <span className="text-blue-400">단 하나의 시크릿 최저가</span>를 <br />
              실시간으로 제안합니다.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-medium leading-relaxed">
              정형화된 예약 사이트를 벗어난 차세대 스마트 스테이 플랫폼. 다른 사이트 검색 및 창 이탈 순간을 포착하여 회원 전용 단독 할인을 즉시 제공합니다.
            </p>

            {/* Compact Search Bar */}
            <div className="bg-white rounded-2xl p-3 text-slate-900 shadow-md border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">여행지/숙소</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="어디로 떠나시나요?"
                      className="w-full bg-transparent text-xs font-bold focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">일정 및 인원</label>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>오늘 ~ 내일 (2명)</span>
                  </div>
                </div>

                <Link
                  to={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>최저가 검색</span>
                </Link>
              </div>
            </div>

            {/* Interactive Simulation Trigger Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold text-[11px]">💡 기능 직접 체험해보기:</span>
              <button
                onClick={() => triggerTestSimulation('exit')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 font-bold flex items-center gap-1.5 transition-colors"
              >
                <MousePointer className="w-3.5 h-3.5 text-amber-400" />
                <span>이탈 감지 모의 테스트</span>
              </button>
              <button
                onClick={() => triggerTestSimulation('copy')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>호텔명 복사 모의 테스트</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Hotel Highlight Box */}
          {heroHotel && (
            <div className="lg:col-span-5 bg-slate-800 rounded-3xl p-5 border border-slate-700 shadow-2xl relative space-y-4">
              <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-900">
                <img src={heroHotel.imageUrl} alt={heroHotel.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  실시간 최저가 1위
                </div>
                <div className="absolute bottom-3 right-3 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-md">
                  15% 시크릿 할인 중
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mb-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{heroHotel.rating}</span>
                  <span className="text-slate-400 font-normal">({heroHotel.reviewCount}개 평가)</span>
                </div>
                <h3 className="text-xl font-black text-white line-clamp-1">{heroHotel.name}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {heroHotel.location}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 line-through block">
                    ₩{heroHotel.originalPrice.toLocaleString()}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">
                      ₩{heroHotel.discountPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">/ 1박</span>
                  </div>
                </div>

                <Link
                  to={`/hotels/${heroHotel.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>즉시 예약</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Storyboard: Why HoverStay is Differentiated */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              DIFFERENTIATED TECHNOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              기존 숙소 예약 사이트와 완전히 다른 3가지 이유
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              HoverStay는 유저의 행동 신호를 실시간 추적하여 구매 전환을 극대화합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                01
              </div>
              <h3 className="font-extrabold text-base text-slate-900">마우스 이탈 즉시 포착</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                고객의 마우스 커서가 주소창이나 탭 닫기 버튼으로 향하는 순간, 단 1회 15% 서프라이즈 시크릿 할인 쿠폰을 팝업합니다.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="font-extrabold text-base text-slate-900">호텔명 복사 신호 감지</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                다른 사이트에서 가격 비교를 하려고 호텔명을 드래그 복사할 때 100% 최저가 차액 보상 및 10,000원 추가 할인 배너를 상단 노출합니다.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                03
              </div>
              <h3 className="font-extrabold text-base text-slate-900">탭 복귀 시 혜택 보장</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                다른 탭을 둘러보다가 다시 돌아온 유저에게 회원 전용 단독 최저가 세션을 유지시켜 결제 이탈을 방지합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stays Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              CURATED SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              이번 주 추천 럭셔리 스테이 🔥
            </h2>
          </div>
          <Link
            to="/search"
            className="text-sm font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto group"
          >
            <span>전체보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {hotel.category}
                </div>
                <div className="absolute top-3 right-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                  최저가 보장
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mb-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{hotel.rating}</span>
                    <span className="text-slate-400 font-normal">({hotel.reviewCount}개 평가)</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
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
