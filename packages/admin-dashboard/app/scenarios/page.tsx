'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchScenarioFirings } from '../lib/api';

const fallback = {
  hourly: [
    { time: '09:00', S1: 45, S2: 28 },
    { time: '11:00', S1: 80, S2: 55 },
    { time: '13:00', S1: 65, S2: 72 },
    { time: '15:00', S1: 120, S2: 95 },
    { time: '17:00', S1: 140, S2: 110 },
  ],
};

export default function ScenariosPage() {
  const [data, setData] = useState(fallback.hourly);

  useEffect(() => {
    fetchScenarioFirings(fallback).then((result) => setData(result.hourly || fallback.hourly));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Scenarios 화면</h1>
        <p className="text-slate-500 mt-1">S1, S2 개입이 발생한 횟수를 시간대별 차트로 시각화합니다.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-slate-800 mb-6">시간대별 S1 / S2 개입 건수 트렌드</h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="S1" fill="#2563EB" radius={[4, 4, 0, 0]} name="S1 쿠폰 모달" />
              <Bar dataKey="S2" fill="#059669" radius={[4, 4, 0, 0]} name="S2 최저가 배너" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
