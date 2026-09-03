import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && !agreed) {
      alert('필수 이용약관에 동의해 주세요.');
      return;
    }

    if (mode === 'register') {
      setSuccessMsg('회원가입이 완료되었습니다! 신규가입 15% 시크릿 쿠폰이 발급되었습니다.');
      setTimeout(() => {
        setMode('login');
        setSuccessMsg('');
      }, 1500);
    } else {
      localStorage.setItem('hoverstay_user', JSON.stringify({ email, name: name || '회원' }));
      setSuccessMsg('로그인되었습니다. 환영합니다!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#fafafa] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center p-2 shadow-xs group-hover:bg-blue-600 transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 10a3 3 0 1 1 6 0c0 1.5-1.5 2.5-3 3.5v1.5" />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Hover<span className="text-blue-600">Stay</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-medium">
            {mode === 'login'
              ? '회원 전용 단독 최저가와 시크릿 혜택을 확인하세요'
              : '지금 가입하고 단독 15% 시크릿 할인 쿠폰을 받으세요'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-center">
            <button
              onClick={() => setMode('login')}
              className={`py-2.5 text-xs font-extrabold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setMode('register')}
              className={`py-2.5 text-xs font-extrabold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">이름</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="성함을 입력하세요"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">이메일 주소</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="example@hoverstay.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">비밀번호</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="비밀번호를 입력하세요"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer text-xs font-medium text-slate-600">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-blue-600 rounded"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>
                    [필수] HoverStay 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'login' ? '로그인하기' : '신규 회원가입 및 혜택 받기'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Quick Auth Options */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
              간편 SNS 계정으로 시작하기
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  localStorage.setItem('hoverstay_user', JSON.stringify({ email: 'kakao@hoverstay.com', name: '카카오 회원' }));
                  navigate('/');
                }}
                className="w-full py-2.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>카카오로 3초 만에 시작하기</span>
              </button>

              <button
                onClick={() => {
                  localStorage.setItem('hoverstay_user', JSON.stringify({ email: 'naver@hoverstay.com', name: '네이버 회원' }));
                  navigate('/');
                }}
                className="w-full py-2.5 bg-[#03C75A] hover:bg-[#02B351] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>네이버로 시작하기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Member Perk Banner */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 text-xs text-blue-900 font-semibold">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <p>
            HoverStay 회원 가입 시 <strong className="font-extrabold">100% 최저가 보장</strong> 및 <strong className="font-extrabold">단독 15% 시크릿 쿠폰</strong>이 자동 적용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
