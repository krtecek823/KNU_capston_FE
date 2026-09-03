import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Check, ShieldCheck, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Hotel } from '../types';

export const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    if (id) {
      api.getHotelById(id).then((res) => {
        if (res) setHotel(res);
      });
    }
  }, [id]);

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-sm font-bold text-slate-500">객실 및 최저가 혜택 정보를 확인하는 중...</p>
      </div>
    );
  }

  const discountRate = Math.round(
    ((hotel.originalPrice - hotel.discountPrice) / hotel.originalPrice) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#fafafa]">
      {/* Hotel Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">
              {hotel.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{hotel.rating}</span>
              <span className="text-slate-400 font-normal">({hotel.reviewCount}개 리뷰)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight select-all">
            {hotel.name}
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium select-all">
            <MapPin className="w-4 h-4 text-slate-400" />
            {hotel.address}
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs text-slate-400 line-through block font-medium">
            정가 ₩{hotel.originalPrice.toLocaleString()}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xs bg-rose-100 text-rose-600 font-extrabold px-2 py-0.5 rounded">
              {discountRate}% 할인
            </span>
            <span className="text-3xl font-black text-slate-900">
              ₩{hotel.discountPrice.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 1박</span>
          </div>
        </div>
      </div>

      {/* Main Image Banner */}
      <div className="relative h-[360px] sm:h-[450px] rounded-3xl overflow-hidden shadow-md bg-slate-100">
        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
          <div>
            <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold">
              HoverStay 안심검증 객실
            </span>
            <h2 className="text-xl font-bold mt-2">{hotel.name} 프리미엄 디럭스 룸</h2>
          </div>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              숙소 상세 설명
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{hotel.description}</p>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                대표 키워드
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {hotel.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-lg border border-indigo-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              제공 편의시설 및 서비스
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Checkout Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-6 sticky top-24">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> 100% 최저가 보장제 자동 적용
            </div>

            <div className="space-y-3 text-xs text-slate-600 font-medium">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-4 h-4 text-slate-400" /> 체크인 / 체크아웃
                </span>
                <span className="font-bold text-slate-900">15:00 / 11:00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Users className="w-4 h-4 text-slate-400" /> 기준 인원
                </span>
                <span className="font-bold text-slate-900">성인 2인</span>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200/60">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-800 mb-1">
                <Sparkles className="w-4 h-4 text-orange-600" /> 단독 시크릿 쿠폰 발급 대상
              </div>
              <p className="text-[11px] text-orange-700 font-medium leading-normal">
                다른 사이트 복사 및 이탈 감지 시 단 1회 무료 15% 시크릿 할인 쿠폰이 자동 증정됩니다.
              </p>
            </div>

            <Link
              to={`/booking?hotelId=${hotel.id}`}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
            >
              <span>이 금액으로 예약하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
