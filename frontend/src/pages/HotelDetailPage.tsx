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
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-sm font-bold text-gray-500">객실 및 최저가 혜택 정보를 확인하는 중...</p>
      </div>
    );
  }

  const discountRate = Math.round(
    ((hotel.originalPrice - hotel.discountPrice) / hotel.originalPrice) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hotel Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {hotel.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{hotel.rating}</span>
              <span className="text-gray-400">({hotel.reviewCount} 리뷰)</span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{hotel.name}</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            {hotel.address}
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs text-gray-400 line-through block">
            정가 ₩{hotel.originalPrice.toLocaleString()}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xs bg-red-100 text-red-600 font-black px-2 py-0.5 rounded">
              {discountRate}% 특가
            </span>
            <span className="text-3xl font-black text-gray-900">
              ₩{hotel.discountPrice.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">/ 1박</span>
          </div>
        </div>
      </div>

      {/* Main Image Banner */}
      <div className="relative h-[360px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg">
        <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
          <div>
            <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold">
              HoverStay Verified
            </span>
            <h2 className="text-xl font-bold mt-2">{hotel.name} 스탠다드 디럭스 룸</h2>
          </div>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              숙소 소개
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{hotel.description}</p>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                대표 키워드
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {hotel.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-primary text-xs font-semibold px-3 py-1 rounded-lg border border-blue-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              제공 편의시설 및 서비스
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {hotel.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
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
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> HoverStay 최저가 보장 객실
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-4 h-4 text-gray-400" /> 체크인 / 체크아웃
                </span>
                <span className="font-bold text-gray-900">15:00 / 11:00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Users className="w-4 h-4 text-gray-400" /> 기준 인원
                </span>
                <span className="font-bold text-gray-900">성인 2인</span>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/60">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" /> 이탈 방지 시크릿 혜택 적용 대상
              </div>
              <p className="text-[11px] text-amber-700 leading-normal">
                지금 예약 페이지로 이동하면 회원 전용 10~15% 추가 할인쿠폰을 즉시 적용할 수 있습니다.
              </p>
            </div>

            <Link
              to={`/booking?hotelId=${hotel.id}`}
              className="w-full py-4 bg-primary hover:bg-primary-container text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>이 금액으로 즉시 예약하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
