'use client';

import { useEffect, useState } from 'react';
import { fetchLiveSignals, type LiveSignal } from './lib/api';

const mockSignalNames = [
  'visibility_change',
  'focus_change',
  'idle_return',
  'scroll_depth',
  'form_dwell',
  'cart_update',
  'clipboard_copy',
  'broadcast_channel',
];

const initialSignals: LiveSignal[] = [
  { id: 'SIG-8812', userId: 'user_77a1', signalName: 'cart_update', pageUrl: '/packages/demo-site/booking.html', device: 'Desktop', timestamp: '23:35:12' },
  { id: 'SIG-8811', userId: 'user_39b2', signalName: 'scroll_depth', pageUrl: '/packages/demo-site/search.html', device: 'Mobile', timestamp: '23:35:01' },
];

function createMockSignal(): LiveSignal {
  const now = new Date();
  return {
    id: 'SIG-' + Math.floor(8000 + Math.random() * 1000),
    userId: 'user_' + Math.random().toString(36).substring(2, 6),
    signalName: mockSignalNames[Math.floor(Math.random() * mockSignalNames.length)],
    pageUrl: ['/index.html', '/search.html', '/booking.html', '/mapo.html'][Math.floor(Math.random() * 4)],
    device: ['Mobile', 'Desktop', 'Tablet'][Math.floor(Math.random() * 3)],
    timestamp: now.toLocaleTimeString('ko-KR', { hour12: false }),
  };
}

export default function Home() {
  const [signals, setSignals] = useState<LiveSignal[]>(initialSignals);

  useEffect(() => {
    fetchLiveSignals(initialSignals).then((data) => {
      if (Array.isArray(data) && data.length) setSignals(data.slice(0, 10));
    });
    const interval = setInterval(() => {
      setSignals((prev) => [createMockSignal(), ...prev.slice(0, 8)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          Live 화면
        </h1>
        <p className="text-slate-500 mt-1">실시간으로 수집되는 유저 행동 신호를 피드 형태로 보여줍니다.</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-slate-600 text-sm font-semibold">
              <th className="p-4 pl-6">신호 ID</th>
              <th className="p-4">유저 식별자</th>
              <th className="p-4">수집 신호</th>
              <th className="p-4">발생 페이지</th>
              <th className="p-4">기기</th>
              <th className="p-4 pr-6">발생 시각</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
            {signals.map((sig) => (
              <tr key={sig.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 pl-6 font-mono font-bold text-slate-900">{sig.id}</td>
                <td className="p-4 font-mono text-indigo-600">{sig.userId}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">{sig.signalName}</span>
                </td>
                <td className="p-4 text-slate-500">{sig.pageUrl}</td>
                <td className="p-4 text-slate-600">{sig.device}</td>
                <td className="p-4 pr-6 font-mono text-xs text-slate-400">{sig.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
