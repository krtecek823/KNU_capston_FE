import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Check, ShieldCheck, Users, ArrowRight, BedDouble, Utensils, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { Hotel } from '../types';

export const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number>(0);

  // Gallery Lightbox Modal State
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

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
        <p className="text-sm font-bold text-slate-500">실시간 객실 및 최저가 정보를 확인하는 중...</p>
      </div>
    );
  }

  const discountRate = Math.round(
    ((hotel.originalPrice - hotel.discountPrice) / hotel.originalPrice) * 100
  );

  // Dedicated 1-by-1 Photos matching user's requested 6 categories
  const galleryPhotos = [
    { url: hotel.imageUrl, title: `01. ${hotel.name} 초고층 타워 전경` },
    { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80', title: '02. 프리미엄 트윈 스위트 룸 (Twin Suite)' },
    { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80', title: '03. 시그니처 킹 스위트 룸 (King Suite)' },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80', title: '04. 초고층 실내 인피니티 수영장 (High-rise Pool)' },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80', title: '05. 프라이빗 스파 & 파노라마 라운지 (Private Spa)' },
  ];

  // Agoda-Style Room Options (Each assigned 1 distinct photo)
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
      img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 1,
      name: '이그제큐티브 트윈 스위트 (Executive Twin Suite)',
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
      name: '프리미엄 코너 파노라마 스위트 (Corner Panorama Suite)',
      bed: '그랜드 킹 베드 1개 + 파노라마 전경',
      capacity: '기준 2인 / 최대 4인',
      breakfast: '룸서비스 프리미엄 조식 무료',
      price: Math.round(hotel.discountPrice * 1.7),
      originalPrice: Math.round(hotel.originalPrice * 1.7),
      benefits: ['웰컴 샴페인 제공', '야외 수영장 프리패스', '딥티크 풀세트'],
      img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
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
              HoverStay 단독 최저가 1위
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

      {/* Spacious High-Res Photo Gallery Banner with Lightbox Trigger */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-slate-900 group">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 min-h-[420px] sm:min-h-[480px]">
          {/* Main Large Photo */}
          <div
            onClick={() => {
              setActivePhotoIndex(0);
              setShowGalleryModal(true);
            }}
            className="md:col-span-2 relative h-full min-h-[300px] cursor-pointer overflow-hidden bg-slate-900"
          >
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white space-y-1">
              <span className="text-xs bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full font-extrabold shadow-sm inline-block">
                HoverStay 최저가 보장
              </span>
              <h2 className="text-xl sm:text-3xl font-black">{hotel.name} 대표 화보</h2>
            </div>
          </div>

          {/* Sub Photos Grid */}
          <div className="hidden md:grid grid-rows-2 gap-2 sm:gap-3 h-full">
            <div
              onClick={() => {
                setActivePhotoIndex(1);
                setShowGalleryModal(true);
              }}
              className="relative h-full cursor-pointer overflow-hidden bg-slate-900 group/sub"
            >
              <img
                src={galleryPhotos[1].url}
                alt="Twin room view"
                className="w-full h-full object-cover object-center group-hover/sub:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover/sub:bg-transparent transition-colors"></div>
            </div>

            <div
              onClick={() => {
                setActivePhotoIndex(2);
                setShowGalleryModal(true);
              }}
              className="relative h-full cursor-pointer overflow-hidden bg-slate-900 group/sub"
            >
              <img
                src={galleryPhotos[2].url}
                alt="King room view"
                className="w-full h-full object-cover object-center group-hover/sub:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover/sub:bg-transparent transition-colors"></div>
            </div>
          </div>
        </div>

        {/* Fullscreen Gallery Lightbox Trigger Button */}
        <button
          onClick={() => {
            setActivePhotoIndex(0);
            setShowGalleryModal(true);
          }}
          className="absolute bottom-5 right-5 bg-white/95 hover:bg-white text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border border-white/80 transition-all flex items-center gap-2 cursor-pointer z-10"
        >
          <ImageIcon className="w-4 h-4 text-blue-600" />
          <span>전체 사진 5장 확대 보기</span>
        </button>
      </div>

      {/* Fullscreen Uncropped Lightbox Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 text-white animate-in fade-in">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black">{hotel.name} 전체 사진</h3>
              <p className="text-xs text-slate-400 font-medium">
                {galleryPhotos[activePhotoIndex].title} ({activePhotoIndex + 1} / {galleryPhotos.length})
              </p>
            </div>

            <button
              onClick={() => setShowGalleryModal(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Uncropped Full Image Display */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={() =>
                setActivePhotoIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1))
              }
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors cursor-pointer z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={galleryPhotos[activePhotoIndex].url}
              alt={galleryPhotos[activePhotoIndex].title}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all"
            />

            <button
              onClick={() =>
                setActivePhotoIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors cursor-pointer z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Thumbnails Strip */}
          <div className="flex items-center justify-center gap-3 overflow-x-auto pt-2 border-t border-white/10">
            {galleryPhotos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  activePhotoIndex === idx
                    ? 'border-blue-500 scale-110 shadow-lg'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Agoda-Style Room Type Selection List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
              SELECT ROOM TYPE
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              실시간 객실 타입 및 가격 옵션
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:block">
            아고다 & 야놀자 실시간 최저가 자동 매칭 적용 중
          </span>
        </div>

        {/* Room Selection Cards (Each Card Has Its Own 1 Dedicated Image) */}
        <div className="space-y-4">
          {rooms.map((room) => {
            const isSelected = selectedRoom === room.id;
            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/30 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  <div className="w-full sm:w-32 h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                    <img src={room.img} alt={room.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">{room.name}</h3>
                      {isSelected && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          선택됨
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5 text-slate-400" /> {room.bed}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {room.capacity}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Utensils className="w-3.5 h-3.5" /> {room.breakfast}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {room.benefits.map((b, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                        >
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0 text-right">
                  <div>
                    <span className="text-xs text-slate-400 line-through block font-medium">
                      ₩{room.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      ₩{room.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-medium block">/ 1박</span>
                  </div>

                  <button
                    className={`mt-2 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isSelected ? '선택 완료' : '객실 선택하기'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hotel Description & Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-2">숙소 상세 소개</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {hotel.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">대표 시설 및 어메니티</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instant Booking Action Card */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                100% 최저가 보장제
              </span>
            </div>

            <h3 className="text-2xl font-black text-white leading-snug">
              회원 전용 시크릿 <br />
              추가 15% 할인 적용 중
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              지금 바로 예약하시면 추가 쿠폰 자동 적용 및 체크인 시 웰컴 드링크 혜택을 제공받으실 수 있습니다.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400 font-medium">최종 결제 예상 금액</span>
              <span className="text-2xl font-black text-white">
                ₩{(rooms[selectedRoom].price * 0.85).toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => alert(`${hotel.name} - ${rooms[selectedRoom].name} 예약 단계로 이동합니다.`)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>지금 바로 예약하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
