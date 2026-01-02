import React, { useState } from 'react';
import { Sprout, Mail, Lock, Check } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface LoginProps {
  language: Language;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ language, onLoginSuccess }) => {
  const t = TRANSLATIONS[language];
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate OAuth delay
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FCFCF9] flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-embrapa-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-embrapa-water/5 rounded-full blur-3xl"></div>

      {/* Brand Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="w-20 h-20 bg-embrapa-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-embrapa-green/20">
          <Sprout size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{t.loginTitle}</h1>
        <p className="text-gray-500 text-sm mt-1">{t.loginSubtitle}</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative z-10">
        
        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all active:scale-95 mb-6 shadow-sm"
        >
          {loading ? (
             <span className="w-5 h-5 border-2 border-gray-300 border-t-embrapa-green rounded-full animate-spin"></span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t.signInGoogle}
            </>
          )}
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink-0 mx-4 text-gray-300 text-xs font-bold uppercase">Or</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-embrapa-green/20 focus:border-embrapa-green transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-embrapa-green/20 focus:border-embrapa-green transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-embrapa-green text-white font-bold py-3 rounded-xl shadow-lg shadow-embrapa-green/30 hover:bg-[#1a7a72] transition-all active:scale-95"
          >
            {loading ? '...' : t.signInEmail}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
           <button className="text-xs text-gray-500 hover:text-embrapa-green font-medium">{t.forgotPassword}</button>
           <p className="text-sm text-gray-600">
             Don't have an account? <button className="text-embrapa-green font-bold hover:underline">{t.createAccount}</button>
           </p>
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-8 text-xs text-gray-400 text-center max-w-xs leading-relaxed">
        By continuing, you agree to Sisteminha EcoFarm's <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default Login;