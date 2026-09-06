import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Users,
  MousePointerClick,
  CheckCircle2,
  BarChart3,
  Smartphone,
  Monitor,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';

// Mock Performance Time Series Data for Recharts
const dailyData = [
  { date: '09.01', exitTriggers: 180, couponClicks: 120, conversions: 42 },
  { date: '09.02', exitTriggers: 210, couponClicks: 145, conversions: 51 },
  { date: '09.03', exitTriggers: 240, couponClicks: 168, conversions: 60 },
  { date: '09.04', exitTriggers: 195, couponClicks: 132, conversions: 48 },
  { date: '09.05', exitTriggers: 310, couponClicks: 215, conversions: 78 },
  { date: '09.06', exitTriggers: 380, couponClicks: 265, conversions: 96 },
];

// Mock A/B Test Group Performance Comparison
const abTestVariants = [
  { name: 'Control (노출 없음)', cvr: 8.1, ctr: 0, revenue: 14200000 },
  { name: 'Variant A (이탈 쿠폰 팝업)', cvr: 24.2, ctr: 68.5, revenue: 42800000 },
  { name: 'Variant B (최저가 보장 배너)', cvr: 18.5, ctr: 52.1, revenue: 31500000 },
];

// Live Realtime Ingested Events Stream Table
const mockLiveEvents = [
  { id: 'evt-901', time: '방금 전', type: 'exit_intent_detected', device: 'mobile', detail: '모바일 뒤로가기(popstate) 인터셉트' },
  { id: 'evt-902', time: '1분 전', type: 'widget_accepted', device: 'desktop', detail: '15% 시크릿 할인 쿠폰 받기 클릭' },
  { id: 'evt-903', time: '3분 전', type: 'booking_completed', device: 'mobile', detail: '시그니엘 서울 (₩520,000) 결제 완료' },
  { id: 'evt-904', time: '5분 전', type: 'exit_intent_detected', device: 'desktop', detail: '상단 15px 마우스 궤적 이탈 감지' },
  { id: 'evt-905', time: '8분 전', type: 'clipboard_copy', device: 'desktop', detail: '숙소명 복사 (타 사이트 가격 비교 시도)' },
];

export const AdminPage: React.FC = () => {
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'desktop' | 'mobile'>('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> HoverStay 마케팅 애널리틱스 & A/B 엔진
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            이탈 감지 & 실시간 전환율 대시보드
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            실시간 유저 이탈 이벤트 스트림, A/B 테스트 성과 및 시크릿 쿠폰 전환율을 다이나믹 그래프로 시각화합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
              deviceFilter === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            전체 디바이스
          </button>
          <button
            onClick={() => setDeviceFilter('desktop')}
            className={`px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              deviceFilter === 'desktop'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> 데스크톱
          </button>
          <button
            onClick={() => setDeviceFilter('mobile')}
            className={`px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer ${
              deviceFilter === 'mobile'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> 모바일
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-extrabold">총 방문 세션 수</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">12,480회</div>
          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> 전주 대비 +18.4% 상승
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-extrabold">이탈 트리거 포착</span>
            <BarChart3 className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">1,840건</div>
          <p className="text-[11px] font-bold text-amber-600">
            전체 이탈 감지 성공률 98.2%
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-extrabold">쿠폰 수락 클릭률 (CTR)</span>
            <MousePointerClick className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">68.5%</div>
          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> 이탈자 1,260명 혜택 수락
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-extrabold">최종 예약 전환율 (CVR)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-blue-600">24.2%</div>
          <p className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> 대조군 대비 +16.1%p 개선!
          </p>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart: Daily Exit Triggers & Conversions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> 일별 이탈 포착 및 예약 전환 트렌드
            </h3>
            <span className="text-[11px] font-bold text-slate-400">최근 7일 실시간 데이터</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorExit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="exitTriggers" name="이탈 감지 수" stroke="#3b82f6" fillOpacity={1} fill="url(#colorExit)" />
                <Area type="monotone" dataKey="conversions" name="최종 예약 결제 수" stroke="#10b981" fillOpacity={1} fill="url(#colorConv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: A/B Test Group CVR Comparison */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> A/B 테스트 그룹별 전환율 (CVR %) 비교
            </h3>
            <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Variant A 우세 ⭐
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={abTestVariants}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <YAxis tickLine={false} axisLine={false} unit="%" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="cvr" name="예약 전환율 (CVR %)" fill="#3b82f6" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Stream Event Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> 실시간 인제스처 API 수집 이벤트 스트림
          </h3>
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> 실시간 동기화 중
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                <th className="py-3 px-4">이벤트 ID</th>
                <th className="py-3 px-4">시간</th>
                <th className="py-3 px-4">이벤트 타입</th>
                <th className="py-3 px-4">디바이스</th>
                <th className="py-3 px-4">세부 감지 로직</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLiveEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{evt.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-500">{evt.time}</td>
                  <td className="py-3.5 px-4 font-extrabold">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] ${
                        evt.type === 'exit_intent_detected'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : evt.type === 'widget_accepted'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}
                    >
                      {evt.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {evt.device === 'mobile' ? (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Smartphone className="w-3.5 h-3.5" /> 모바일
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Monitor className="w-3.5 h-3.5" /> 데스크톱
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{evt.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
