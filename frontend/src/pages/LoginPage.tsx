import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!agreed) {
          setErrorMsg('필수 이용약관에 동의해 주세요.');
          setLoading(false);
          return;
        }

        const res = await api.registerUser(name, email, password);
        setLoading(false);

        if (res.success) {
          setSuccessMsg('회원가입이 완료되었습니다! 가입하신 정보로 로그인해 주세요.');
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setSuccessMsg('');
          }, 1500);
        } else {
          setErrorMsg(res.message || '회원가입에 실패했습니다.');
        }

      } else {
        // Login Mode via Backend REST API
        const res = await api.loginUser(email, password);
        setLoading(false);

        if (res.success && res.user) {
          localStorage.setItem('hoverstay_user', JSON.stringify(res.user));
          if (res.token) {
            localStorage.setItem('hoverstay_auth_token', res.token);
          }
          setSuccessMsg(`${res.user.name}님 환영합니다! 로그인되었습니다.`);
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          setErrorMsg(res.message || '이메일 또는 비밀번호가 일치하지 않습니다.');
        }
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('서버와 통신하는 도중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#fafafa] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center p-2.5 shadow-md group-hover:bg-blue-600 transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-white"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 10a3 3 0 1 1 6 0c0 1.5-1.5 2.5-3 3.5v1.5" />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-900">
              Hover<span className="text-blue-600">Stay</span>
            </span>
          </Link>
          <p className="text-sm text-slate-500 font-semibold">
            {mode === 'login'
              ? 'HoverStay 계정으로 로그인하고 단독 최저가 혜택을 이용하세요'
              : 'HoverStay 회원가입 후 단독 15% 시크릿 할인 쿠폰을 받으세요'}
          </p>
        </div>

        {/* Auth Card (Expanded size & padding) */}
        <div className="bg-white p-10 sm:p-12 rounded-3xl border border-slate-200/90 shadow-md space-y-8">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl text-center">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-3 text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-3 text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">성함 *</label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="성함을 입력하세요 (예: 홍길동)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">이메일 주소 *</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="example@hoverstay.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">비밀번호 *</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="비밀번호를 입력하세요"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-blue-600 rounded w-4 h-4"
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
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                  <span>{mode === 'login' ? '로그인하기' : 'HoverStay 회원가입하기'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
