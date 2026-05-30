'use client';

import { useEffect, useState } from 'react';
import { fetchSignalsCoverage, type SignalsCoverage } from '../lib/api';

const names = [
  'page_view',
  'visibility_change',
  'focus_change',
  'idle_return',
  'scroll_depth',
  'form_focus',
  'form_dwell',
  'clipboard_copy',
  'broadcast_channel',
  'page_unload',
  'cart_update',
  'widget_action',
];

const fallback: SignalsCoverage = {
  total_signals: 16,
  collected: [1, 2, 3, 4, 7, 12, 14, 15],
  coverage_percent: 50,
};

export default function SignalsPage() {
  const [coverage, setCoverage] = useState(fallback);

  useEffect(() => {
    fetchSignalsCoverage(fallback).then(setCoverage);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Signals 화면</h1>
        <p className="text-slate-500 mt-1">신호가 정상적으로 수집되고 있는지 커버리지를 모니터링합니다.</p>
      </div>
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>전체 커버리지</span>
          <span className="font-bold text-slate-900">{coverage.coverage_percent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${coverage.coverage_percent}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {names.map((name, index) => {
          const collected = coverage.collected.includes(index + 1);
          return (
            <div key={name} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${collected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {collected ? '수집중' : '대기'}
                </span>
                <h3 className="text-sm font-bold font-mono text-slate-800 mt-2 break-all">{name}</h3>
              </div>
              <div className="mt-4 text-xs text-slate-500">P0 signal #{index + 1}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
