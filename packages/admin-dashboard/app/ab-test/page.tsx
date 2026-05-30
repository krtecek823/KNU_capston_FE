'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchAbResults, type AbResults } from '../lib/api';

const fallback: AbResults = {
  control: { count: 100, converted: 12, cr: 0.124 },
  treatment: { count: 100, converted: 25, cr: 0.248 },
  p_value: 0.042,
  significant: true,
};

export default function ABTestPage() {
  const [results, setResults] = useState(fallback);

  useEffect(() => {
    fetchAbResults(fallback).then(setResults);
  }, []);

  const chartData = [
    { name: '통제군', 전환율: Number((results.control.cr * 100).toFixed(1)) },
    { name: '개입군', 전환율: Number((results.treatment.cr * 100).toFixed(1)) },
  ];
  const lift = ((results.treatment.cr - results.control.cr) * 100).toFixed(1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">A/B Test 화면</h1>
        <p className="text-slate-500 mt-1">개입군과 통제군의 전환율 차이를 통계 그래프로 비교합니다.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 p-6 rounded-lg text-white shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold opacity-90">실험 요약</h2>
            <p className="text-xs opacity-70 mt-1">S1/S2 성능 검증용 대조군 테스트</p>
          </div>
          <div className="my-6">
            <span className="text-xs opacity-80 block">전환율 향상 폭</span>
            <span className="text-4xl font-black">+{lift}%p</span>
            <span className="text-xs block mt-1 text-emerald-300">
              p-value {results.p_value}; {results.significant ? '통계적 유의성 확보' : '추가 샘플 필요'}
            </span>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">최종 행동 전환율 비교</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 50]} stroke="#64748B" />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="전환율" fill="#2563EB" radius={[0, 4, 4, 0]} name="전환율 (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
