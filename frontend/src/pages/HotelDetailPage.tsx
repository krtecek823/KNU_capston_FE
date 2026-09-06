import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Check, ShieldCheck, Users, ArrowRight, BedDouble, Utensils, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useHotelDetail } from '../hooks/useHotelQueries';

export const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: hotel, isLoading } = useHotelDetail(id || '');
  const [selectedRoom, setSelectedRoom] = useState<number>(0);

  // Gallery Lightbox Modal State
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  if (isLoading || !hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-sm font-bold text-slate-500">실시간 객실 및 최저가 정보를 확인하는 중...</p>
      </div>
    );
  }



  // Dynamic Hotel Specific Gallery Photos
  const galleryPhotos = [
    { url: hotel.imageUrl, title: `01. ${hotel.name} 대표 전경` },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80', title: `02. ${hotel.name} 프리미엄 디럭스 스위트` },
    { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80', title: `03. ${hotel.name} 파노라마 이그제큐티브 스위트` },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80', title: `04. ${hotel.name} 럭셔리 인피니티 수영장 & 라운지` },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80', title: `05. ${hotel.name} 프라이빗 힐링 스파` },
  ];

  // Agoda-Style Room Options tailored to hotel
  const rooms = [
    {
      id: 0,
      name: `${hotel.name.split(' ')[0]} 디럭스 킹룸 (Deluxe King)`,
      bed: '킹 베드 1개',
      capacity: '기준 2인 / 최대 2인',
      breakfast: '조식 포함 옵션 (+30,000원)',
      price: hotel.discountPrice,
      originalPrice: hotel.originalPrice,
      benefits: ['무료 Wi-Fi', '전용 욕조', '무료 미니바 제공'],
      img: hotel.imageUrl,
    },
    {
      id: 1,
      name: `${hotel.name.split(' ')[0]} 이그제큐티브 트윈 스위트 (Executive Twin)`,
      bed: '트윈 베드 2개 + 라운지 혜택',
      capacity: '기준 2인 / 최대 3인',
      breakfast: '이그제큐티브 라운지 조식 포함',
      price: Math.round(hotel.discountPrice * 1.35),
      originalPrice: Math.round(hotel.originalPrice * 1.35),
      benefits: ['해피아워 주류 무료', '체크아웃 14:00 연장', '무료 발렛파킹'],
      img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      name: `${hotel.name.split(' ')[0]} 프리미엄 코너 파노라마 스위트 (Panorama Suite)`,
      bed: '그랜드 킹 베드 1개 + 파노라마 전경',
      capacity: '기준 2인 / 최대 4인',
      breakfast: '룸서비스 프리미엄 조식 무료',
      price: Math.round(hotel.discountPrice * 1.7),
      originalPrice: Math.round(hotel.originalPrice * 1.7),
      benefits: ['웰컴 샴페인 제공', '야외 수영장 프리패스', '프리미엄 어메니티'],
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleBooking = (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    navigate('/booking', {
      state: {
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        hotelImage: hotel.imageUrl,
        roomName: room.name,
        totalPrice: room.price,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Gallery Grid Header */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
              <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {hotel.category}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hotel.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {hotel.name}
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 px-5 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                실제 투숙객 평점
              </span>
              <div className="flex items-center gap-1 text-slate-900 font-black text-lg">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{hotel.rating}</span>
                <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-xs font-extrabold text-blue-600">
              {hotel.reviewCount}개 검증된 후기
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden h-[420px] shadow-sm">
          <div
            onClick={() => {
              setActivePhotoIndex(0);
              setShowGalleryModal(true);
            }}
            className="md:col-span-2 relative h-full group cursor-pointer overflow-hidden bg-slate-100"
          >
            <img
              src={galleryPhotos[0].url}
              alt={galleryPhotos[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="text-white text-xs font-extrabold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> 크게 보기
              </span>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-1 gap-3 h-full">
            <div
              onClick={() => {
                setActivePhotoIndex(1);
                setShowGalleryModal(true);
              }}
              className="relative h-full group cursor-pointer overflow-hidden bg-slate-100 rounded-xl"
            >
              <img
                src={galleryPhotos[1].url}
                alt={galleryPhotos[1].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              onClick={() => {
                setActivePhotoIndex(2);
                setShowGalleryModal(true);
              }}
              className="relative h-full group cursor-pointer overflow-hidden bg-slate-100 rounded-xl"
            >
              <img
                src={galleryPhotos[2].url}
                alt={galleryPhotos[2].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="hidden md:grid grid-cols-1 gap-3 h-full">
            <div
              onClick={() => {
                setActivePhotoIndex(3);
                setShowGalleryModal(true);
              }}
              className="relative h-full group cursor-pointer overflow-hidden bg-slate-100 rounded-xl"
            >
              <img
                src={galleryPhotos[3].url}
                alt={galleryPhotos[3].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              onClick={() => {
                setActivePhotoIndex(4);
                setShowGalleryModal(true);
              }}
              className="relative h-full group cursor-pointer overflow-hidden bg-slate-100 rounded-xl"
            >
              <img
                src={galleryPhotos[4].url}
                alt={galleryPhotos[4].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-xs font-black gap-1 group-hover:bg-slate-900/70 transition-colors">
                <ImageIcon className="w-4 h-4" /> 전체 5개 포토 보기
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setShowGalleryModal(false)}
            className="absolute top-6 right-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full space-y-4">
            <div className="relative aspect-16/9 bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
              <img
                src={galleryPhotos[activePhotoIndex].url}
                alt={galleryPhotos[activePhotoIndex].title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />

              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1))
                }
                className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-between text-white px-2">
              <span className="text-sm font-bold">
                {galleryPhotos[activePhotoIndex].title}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {activePhotoIndex + 1} / {galleryPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hotel Key Amenities & Features */}
      <section className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          숙소 주요 대표 어메니티 & 혜택
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {hotel.features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/60 text-xs font-extrabold text-slate-800 flex items-center gap-2.5 shadow-2xs"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Agoda-Style Room Selection Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider block">
              ROOM OPTIONS & PRICING
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              객실 선택 및 실시간 예약
            </h2>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
            🔥 오늘 남은 마지막 2개 객실
          </span>
        </div>

        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                selectedRoom === room.id
                  ? 'bg-blue-50/40 border-blue-600 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-5 flex-1">
                <img
                  src={room.img}
                  alt={room.name}
                  className="w-full sm:w-48 h-36 object-cover rounded-2xl shrink-0"
                />

                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-md inline-block">
                    {hotel.category}
                  </span>
                  <h4 className="text-base font-black text-slate-900">{room.name}</h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-4 h-4 text-slate-400" /> {room.bed}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" /> {room.capacity}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                      <Utensils className="w-4 h-4 text-emerald-500" /> {room.breakfast}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {room.benefits.map((b, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-blue-600" /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Booking Trigger */}
              <div className="pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200 flex lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-slate-400 line-through block font-medium">
                    ₩{room.originalPrice.toLocaleString()}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      ₩{room.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">/ 1박</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-extrabold block mt-0.5">
                    ✓ 세금 및 수수료 모두 포함
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedRoom(room.id);
                    handleBooking(room.id);
                  }}
                  className="bg-slate-900 hover:bg-blue-600 text-white font-black text-xs px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>예약하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Hotel Check-In Policy Notice */}
      <section className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> 호버스테이 체크인 / 체크아웃 단독 안심 규정
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300 font-medium">
          <div className="space-y-1">
            <span className="font-bold text-white block">체크인 시간</span>
            <p>15:00부터 가능 (프론트 24시간 운영)</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white block">체크아웃 시간</span>
            <p>11:00까지 (회원 단독 12:00 레이트 체크아웃)</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white block">취소 및 환불 정책</span>
            <p>체크인 3일 전까지 100% 무료 취소 보장</p>
          </div>
        </div>
      </section>
    </div>
  );
};
