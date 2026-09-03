import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Sparkles, CreditCard, ShieldCheck, MapPin, ArrowLeft, QrCode } from 'lucide-react';
import { MOCK_HOTELS, MOCK_COUPONS } from '../services/mockData';
import { BookingRecord } from './MyBookingsPage';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hotelId = searchParams.get('hotelId') || 'signiel-seoul';
  const roomId = parseInt(searchParams.get('roomId') || '0', 10);

  const hotel = MOCK_HOTELS.find((h) => h.id === hotelId) || MOCK_HOTELS[0];

  const roomNames = [
    '디럭스 킹룸 (Deluxe King Room)',
    '이그제큐티브 트윈 스위트 (Executive Twin Suite)',
    '프리미엄 코너 파노라마 스위트 (Corner Panorama Suite)',
  ];

  const roomPrices = [
    hotel.discountPrice,
    Math.round(hotel.discountPrice * 1.35),
    Math.round(hotel.discountPrice * 1.7),
  ];

  const selectedRoomName = roomNames[roomId] || roomNames[0];
  const selectedRoomPrice = roomPrices[roomId] || roomPrices[0];

  // User & Date State
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState<string>('special-15');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'KAKAO' | 'TOSS'>('CARD');

  // Dates
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  const formatDateStr = (d: Date) => {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}.${m}.${day}`;
  };

  const checkInStr = formatDateStr(today);
  const checkOutStr = formatDateStr(tomorrow);
  const [createdBooking, setCreatedBooking] = useState<BookingRecord | null>(null);

  const activeCouponObj = MOCK_COUPONS.find((c) => c.id === selectedCoupon);
  const discountRate = activeCouponObj ? activeCouponObj.discountPercent : 0;

  const discountAmount = Math.round((selectedRoomPrice * discountRate) / 100);
  const finalPayAmount = selectedRoomPrice - discountAmount;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone) {
      alert('예약자 성함과 휴대폰 번호를 정확히 입력해 주세요.');
      return;
    }

    const bookingId = `HSV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingRecord = {
      id: bookingId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelLocation: hotel.location,
      hotelImage: hotel.imageUrl,
      roomName: selectedRoomName,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      nights: 1,
      userName,
      userPhone,
      userEmail: userEmail || 'guest@hoverstay.com',
      paymentMethod: paymentMethod === 'CARD' ? '신용/체크카드' : paymentMethod === 'KAKAO' ? '카카오페이' : '토스페이',
      totalPrice: finalPayAmount,
      createdAt: new Date().toLocaleDateString(),
      status: 'COMPLETED',
    };

    // Save to LocalStorage
    const existing = localStorage.getItem('hoverstay_bookings');
    let bookingsArr: BookingRecord[] = [];
    if (existing) {
      try {
        bookingsArr = JSON.parse(existing);
      } catch {
        bookingsArr = [];
      }
    }
    bookingsArr.unshift(newBooking);
    localStorage.setItem('hoverstay_bookings', JSON.stringify(bookingsArr));

    setCreatedBooking(newBooking);
  };

  if (createdBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 bg-white rounded-3xl border border-slate-200 shadow-lg my-10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            예약 번호: {createdBooking.id}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
            예약 및 결제가 정상 완료되었습니다! 🎉
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            <span className="font-extrabold text-slate-900">{createdBooking.userName}</span>님, {createdBooking.hotelName} 확정 안내 문자가 <span className="font-extrabold text-slate-900">{createdBooking.userPhone}</span>(으)로 즉시 발송되었습니다.
          </p>
        </div>

        {/* E-Voucher Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3">
          <div className="flex justify-between text-xs py-1 border-b border-slate-200/80 pb-2">
            <span className="text-slate-400 font-bold">숙소명</span>
            <span className="font-black text-slate-900">{createdBooking.hotelName}</span>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span className="text-slate-400 font-bold">객실 타입</span>
            <span className="font-bold text-slate-800">{createdBooking.roomName}</span>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span className="text-slate-400 font-bold">숙박 기간</span>
            <span className="font-bold text-blue-600">{createdBooking.checkIn} ~ {createdBooking.checkOut} (1박)</span>
          </div>
          <div className="flex justify-between text-xs py-1 border-t border-slate-200/80 pt-2 text-sm font-black">
            <span className="text-slate-900">최종 결제 금액</span>
            <span className="text-blue-600 text-lg">₩{createdBooking.totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/my-bookings')}
            className="w-full sm:w-auto bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> 내 예약 내역 확인하기
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-8 py-3.5 rounded-xl transition-colors"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#fafafa]">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
            CHECKOUT & BOOKING
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            안심 예약 및 결제
          </h1>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-xs font-extrabold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> 이전 화면
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Column */}
        <form onSubmit={handleBookingSubmit} className="lg:col-span-2 space-y-6">
          
          {/* Selected Hotel & Room Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> 예약 숙소 및 객실 정보
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={hotel.imageUrl}
                alt={hotel.name}
                className="w-full sm:w-32 h-24 rounded-2xl object-cover shrink-0 border border-slate-100"
              />
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {hotel.category}
                </span>
                <h2 className="text-lg font-black text-slate-900">{hotel.name}</h2>
                <p className="text-xs font-bold text-slate-700">{selectedRoomName}</p>
                <p className="text-xs text-slate-400 font-medium">{hotel.location}</p>
              </div>
            </div>
          </div>

          {/* Reservation Guest Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              예약자 기본 정보
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">예약자 성함 *</label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-600"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">휴대폰 번호 *</label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-600"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-600 block mb-1">이메일 주소 (e-티켓 수신)</label>
                <input
                  type="email"
                  placeholder="example@hoverstay.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-600"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Coupon Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-500" /> 회원 단독 쿠폰 할인
            </h3>

            <div className="space-y-3">
              {MOCK_COUPONS.map((coupon) => (
                <label
                  key={coupon.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedCoupon === coupon.id
                      ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="coupon"
                      checked={selectedCoupon === coupon.id}
                      onChange={() => setSelectedCoupon(coupon.id)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{coupon.title}</p>
                      <span className="text-[11px] text-slate-400 font-mono">쿠폰코드: {coupon.code}</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-amber-600">
                    -{coupon.discountPercent}%
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> 결제 수단 선택
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`py-3.5 px-3 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer ${
                  paymentMethod === 'CARD'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                신용/체크카드
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('KAKAO')}
                className={`py-3.5 px-3 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer ${
                  paymentMethod === 'KAKAO'
                    ? 'border-amber-400 bg-amber-50/50 text-amber-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                카카오페이
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('TOSS')}
                className={`py-3.5 px-3 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer ${
                  paymentMethod === 'TOSS'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                토스페이
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-black text-base rounded-2xl shadow-xl transition-all cursor-pointer"
          >
            ₩{finalPayAmount.toLocaleString()} 결제 및 예약 확정하기
          </button>
        </form>

        {/* Right Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              결제 금액 요약
            </h3>

            <div className="space-y-2.5 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>객실 선택 금액</span>
                <span className="font-bold text-slate-900">₩{selectedRoomPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-amber-600 font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 쿠폰 할인 ({discountRate}%)
                </span>
                <span>-₩{discountAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-emerald-600 font-bold">
                <span>세금 및 봉사료</span>
                <span>무료 (0원)</span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>최종 결제 금액</span>
                <span className="text-blue-600 text-xl font-black">
                  ₩{finalPayAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-2xl flex items-center gap-2 text-[11px] text-emerald-800 font-bold border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              100% 최저가 보장제 및 체크인 전 당일 무료 취소 가능
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
