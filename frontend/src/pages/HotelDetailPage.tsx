import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Check, ShieldCheck, Calendar, Users, ArrowRight, BedDouble, Utensils } from 'lucide-react';
import { api } from '../services/api';
import { Hotel } from '../types';

export const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number>(0);

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
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-sm font-bold text-slate-500">실시간 객실 및 아고다 비교 최저가 정보를 확인하는 중...</p>
      </div>
    );
  }

  const discountRate = Math.round(
    ((hotel.originalPrice - hotel.discountPrice) / hotel.originalPrice) * 100
  );

  // Agoda-Style Room Options
  const rooms = [
    {
      id: 0,
      name: '디럭스 킹룸 (Deluxe King Room)',
      bed: '킹 베드 1개',
      capacity: '기준 2인 / 최대 2인',
      breakfast: '조식 포함 가능 (+30,000원)',
      price: hotel.discountPrice,
      originalPrice: hotel.originalPrice,
      benefits: ['무료 Wi-Fi', '전용 욕조', '무료 미니바'],
      img: hotel.imageUrl,
    },
    {
      id: 1,
      name: '이그제큐티브 오션/시티 스위트 (Executive Suite)',
      bed: '킹 베드 1개 + 라운지 혜택',
      capacity: '기준 2인 / 최대 3인',
      breakfast: '이그제큐티브 라운지 조식 포함',
      price: Math.round(hotel.discountPrice * 1.35),
      originalPrice: Math.round(hotel.originalPrice * 1.35),
      benefits: ['해피아워 주류 무료', '체크아웃 14:00 연장', '무료 발렛파킹'],
      img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name: '프리미엄 코너 스위트 (Corner Panorama Suite)',
      bed: '킹 베드 1개 + 파노라마 전경',
      capacity: '기준 2인 / 최대 4인',
      breakfast: '룸서비스 프리미엄 조식 무료',
      price: Math.round(hotel.discountPrice * 1.7),
      originalPrice: Math.round(hotel.originalPrice * 1.7),
      benefits: ['웰컴 샴페인 제공', '야외 수영장 프리패스', '딥티크 풀세트'],
      img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    },
  ];

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
              <span className="text-slate-400 font-normal">({hotel.reviewCount}개 평가)</span>
            </div>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              아고다 실시간 비교 1위
            </span>
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
            <span className="text-xs text-slate-500 font-medium">/ 1박부터</span>
          </div>
        </div>
      </div>

      {/* Agoda Photo Gallery Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[380px] sm:h-[450px] rounded-3xl overflow-hidden shadow-md bg-slate-100">
        <div className="md:col-span-2 relative h-full">
          <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold">
              HoverStay 최저가 보장
            </span>
            <h2 className="text-2xl font-black mt-2">{hotel.name} 대표 전경</h2>
          </div>
        </div>

        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          <div className="relative h-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
              alt="Room view"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative h-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
              alt="Pool view"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Agoda-Style Room Type Selection List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
              SELECT ROOM TYPE
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              원하시는 객실 타입을 선택하세요
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            잔여 객실 마감 임박 🔥
          </span>
        </div>

        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                selectedRoom === room.id
                  ? 'border-blue-600 bg-blue-50/30 shadow-md ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={room.img}
                  alt={room.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {room.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-blue-600" />
                      {room.bed}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {room.capacity}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                      {room.breakfast}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.benefits.map((b, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                      >
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through block font-medium">
                    ₩{room.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    ₩{room.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block font-medium">1박 세금/봉사료 포함</span>
                </div>

                <Link
                  to={`/booking?hotelId=${hotel.id}&roomId=${room.id}`}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>예약하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities & Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              숙소 상세 소개
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{hotel.description}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              주요 편의시설 및 서비스
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

        {/* Right Sticky Summary Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-6 sticky top-24">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> 100% 아고다 대비 최저가 보장제
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
                  <Users className="w-4 h-4 text-slate-400" /> 선택된 객실
                </span>
                <span className="font-bold text-blue-600">{rooms[selectedRoom].name.split('(')[0]}</span>
              </div>
            </div>

            <Link
              to={`/booking?hotelId=${hotel.id}&roomId=${selectedRoom}`}
              className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>선택된 객실 예약 진행하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
