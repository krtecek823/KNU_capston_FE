import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Ticket, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';
import { MOCK_HOTELS, MOCK_COUPONS } from '../services/mockData';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hotelId = searchParams.get('hotelId') || 'grand-walkerhill';

  const hotel = MOCK_HOTELS.find((h) => h.id === hotelId) || MOCK_HOTELS[0];

  const [selectedCoupon, setSelectedCoupon] = useState<string>('welcome-10');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const activeCouponObj = MOCK_COUPONS.find((c) => c.id === selectedCoupon);
  const discountRate = activeCouponObj ? activeCouponObj.discountPercent : 0;

  const finalDiscountAmount = Math.round((hotel.discountPrice * discountRate) / 100);
  const finalPayAmount = hotel.discountPrice - finalDiscountAmount;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone) {
      alert('예약자 정보를 입력해주세요.');
      return;
    }
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">예약이 완료되었습니다! 🎉</h1>
        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-900">{userName}</span>님, {hotel.name} 예약이 정상적으로 확정되었습니다.
          확정 안내 문자가 <span className="font-bold text-gray-900">{userPhone}</span>(으)로 발송되었습니다.
        </p>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left space-y-3">
          <div className="flex justify-between text-xs py-1">
            <span className="text-gray-400">예약 숙소</span>
            <span className="font-bold text-gray-800">{hotel.name}</span>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span className="text-gray-400">적용된 쿠폰</span>
            <span className="font-bold text-amber-600">{activeCouponObj?.title}</span>
          </div>
          <div className="flex justify-between text-xs py-1 border-t border-gray-100 pt-2 text-sm font-black">
            <span>최종 결제 금액</span>
            <span className="text-primary">₩{finalPayAmount.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-container text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-colors"
        >
          메인 화면으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">예약 및 결제</h1>
        <p className="text-xs text-gray-500 mt-1">안전하고 빠른 HoverStay 스마트 예약 시스템</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Column */}
        <form onSubmit={handleBookingSubmit} className="lg:col-span-2 space-y-6">
          {/* Reservation Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              예약자 정보
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">예약자 성함</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  required
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-primary"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">휴대폰 번호</label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  required
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-primary"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Coupon Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-500" /> 할인 쿠폰 선택
            </h3>

            <div className="space-y-3">
              {MOCK_COUPONS.map((coupon) => (
                <label
                  key={coupon.id}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedCoupon === coupon.id
                      ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
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
                      <p className="text-xs font-bold text-gray-900">{coupon.title}</p>
                      <span className="text-[11px] text-gray-400">코드: {coupon.code}</span>
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
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> 결제 수단
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-3 px-4 rounded-xl border-2 border-primary bg-blue-50/50 text-primary text-xs font-extrabold flex items-center justify-center gap-2"
              >
                신용/체크카드 결제
              </button>
              <button
                type="button"
                className="py-3 px-4 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                카카오페이 / 네이버페이
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary-container text-white font-extrabold text-base rounded-2xl shadow-xl transition-all"
          >
            ₩{finalPayAmount.toLocaleString()} 결제하기
          </button>
        </form>

        {/* Right Summary Order Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              예약 정보 요약
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={hotel.imageUrl}
                alt={hotel.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div>
                <p className="text-xs font-bold text-gray-900 line-clamp-1">{hotel.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{hotel.category}</p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>객실 기본 금액</span>
                <span>₩{hotel.discountPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-amber-600 font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 쿠폰 할인 ({discountRate}%)
                </span>
                <span>-₩{finalDiscountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>최종 결제 금액</span>
                <span className="text-primary text-lg">₩{finalPayAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl flex items-center gap-2 text-[11px] text-emerald-800 font-medium border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              HoverStay 최저가 보장제 및 즉시 취소 가능 조건 적용
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
