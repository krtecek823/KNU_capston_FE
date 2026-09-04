import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, QrCode, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export interface BookingRecord {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelLocation: string;
  hotelImage: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  paymentMethod: string;
  totalPrice: number;
  createdAt: string;
  status: 'COMPLETED' | 'CANCELLED';
}

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookings = async () => {
    setLoading(true);
    const userStr = localStorage.getItem('hoverstay_user');
    let email = '';
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        email = u.email;
      } catch {}
    }

    const res = await api.getBookings(email);
    setBookings(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('정말 이 예약을 취소하시겠습니까? 백엔드 DB에서 즉시 취소 처리됩니다.')) {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        alert(res.message);
        fetchBookings();
      } else {
        alert('예약 취소 처리에 실패했습니다.');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#fafafa]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
            MY RESERVATIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            내 예약 내역 (HoverStay Backend DB 연동)
          </h1>
        </div>

        <Link
          to="/"
          className="text-xs font-extrabold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> 홈으로 돌아가기
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">백엔드 DB에서 예약 내역을 불러오는 중...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">진행 중인 예약 내역이 없습니다.</h2>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            HoverStay 단독 최저가 혜택으로 원하는 호텔과 리조트를 지금 예약해 보세요!
          </p>
          <Link
            to="/search"
            className="inline-block bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-colors shadow-md mt-2"
          >
            최저가 숙소 보러가기
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 justify-between ${
                booking.status === 'CANCELLED' ? 'opacity-60 border-slate-200' : 'border-slate-200/80 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
                <img
                  src={booking.hotelImage}
                  alt={booking.hotelName}
                  className="w-full sm:w-36 h-32 rounded-2xl object-cover shrink-0 border border-slate-100"
                />

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        booking.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {booking.status === 'COMPLETED' ? '✓ DB 예약 확정' : '예약 취소됨'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">예약번호: {booking.id}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{booking.hotelName}</h3>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {booking.hotelLocation}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {booking.checkIn} ~ {booking.checkOut} ({booking.nights}박)
                    </span>
                    <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      {booking.roomName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 shrink-0 text-right space-y-2">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">총 결제 금액</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₩{booking.totalPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    {booking.paymentMethod}
                  </span>
                </div>

                {booking.status === 'COMPLETED' && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => alert(`[모바일 체크인 QR 코드]\n예약번호: ${booking.id}\n체크인 당일 데스크에 제시해 주세요.`)}
                      className="flex items-center gap-1 text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" /> QR 체크인
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="예약 취소"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
