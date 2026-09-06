import React from 'react';
import { Gift, Sparkles, Copy, Check } from 'lucide-react';
import { useCouponStore } from '../store/useCouponStore';

export const CouponsPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const { coupons } = useCouponStore();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> MY COUPON BOX
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">내 할인 쿠폰함</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          HoverStay 스마트 케어 시스템 및 Zustand 전역 쿠폰 스토어에서 발급받은 전용 시크릿 쿠폰 목록입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-100/50 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Gift className="w-3.5 h-3.5" /> {coupon.discountPercent}% OFF
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  유효기간: {coupon.validUntil}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {coupon.title}
              </h3>

              <p className="text-xs text-slate-500 font-medium">
                ₩{coupon.minSpend.toLocaleString()} 이상 숙소 예약 시 즉시 적용 가능
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-700">
                {coupon.code}
              </div>

              <button
                onClick={() => handleCopyCode(coupon.code)}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-lg border border-blue-100 transition-colors cursor-pointer"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> 복사 완료!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> 쿠폰코드 복사
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
