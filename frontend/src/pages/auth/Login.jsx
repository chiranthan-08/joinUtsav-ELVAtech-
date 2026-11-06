import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogIn, Sparkles, User, Calendar, Shield, Crown, ArrowRight, Mail, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, sendLoginOTP, loginWithOTP, switchRolePersona } = useAuth();
  const toast = useToast();

  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1 = enter email, 2 = enter otp
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showStaffAccess, setShowStaffAccess] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      redirectUser(res.user);
    }
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    const res = await sendLoginOTP(email);
    setSubmitting(false);
    if (res.success) {
      setOtpStep(2);
      setCountdown(60);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error('Please enter the 6-digit verification code.');
      return;
    }
    setSubmitting(true);
    const res = await loginWithOTP(email, otpCode.trim());
    setSubmitting(false);
    if (res.success) {
      redirectUser(res.user);
    }
  };

  const redirectUser = (u) => {
    if (u.role === 'super_admin') navigate('/super-admin/dashboard');
    else if (u.role === 'admin') navigate('/admin/dashboard');
    else if (u.role === 'organizer') navigate('/organizer/dashboard');
    else navigate('/user/dashboard');
  };

  const handleQuickLogin = async (roleName, targetPath) => {
    const res = await switchRolePersona(roleName);
    if (res.success) {
      navigate(targetPath);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-500 via-rose-500 to-amber-500 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-saffron-500/20">
          🪔
        </div>
        <h1 className="text-3xl font-extrabold text-white font-serif">Welcome to UtsavMitra</h1>
        <p className="text-xs text-slate-400">Sign in to your UtsavMitra account</p>
      </div>

      {/* 1-Click Access for User & Organizer */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-saffron-500/30 space-y-3 shadow-xl">
        <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Sign-In Portals:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickLogin('user', '/user/dashboard')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all"
          >
            <div className="flex items-center gap-1 text-slate-200 font-bold">
              <User className="w-3.5 h-3.5 text-saffron-400" />
              <span>Attendee / User</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Aarav Sharma</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('organizer', '/organizer/dashboard')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all"
          >
            <div className="flex items-center gap-1 text-rose-300 font-bold">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>Event Organizer</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Rajesh Singhania</div>
          </button>
        </div>
      </div>

      {/* Main Authentication Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        {/* Auth Method Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setAuthMode('otp')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'otp'
                ? 'bg-gradient-to-r from-saffron-500 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email OTP Login</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('password')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'password'
                ? 'bg-gradient-to-r from-saffron-500 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Password Sign-In</span>
          </button>
        </div>

        {/* METHOD 1: EMAIL OTP SIGN IN */}
        {authMode === 'otp' && (
          <div className="space-y-4">
            {otpStep === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email to receive 6-digit OTP"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-saffron-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    We will send a secure single-use sign-in code directly to your email inbox.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-xl shadow-saffron-500/20 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>{submitting ? 'Dispatching Verification Code...' : 'Send Sign-In Code'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Code sent to:</span>
                    <div className="font-bold text-white truncate max-w-[200px]">{email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOtpStep(1); setOtpCode(''); }}
                    className="text-saffron-400 hover:text-saffron-300 font-semibold text-[11px]"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Enter 6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="849201"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-center text-xl font-mono tracking-[8px] focus:border-saffron-500 focus:outline-none font-bold"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>Valid for 10 minutes</span>
                    {countdown > 0 ? (
                      <span className="text-slate-500">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={submitting}
                        className="text-saffron-400 hover:text-saffron-300 font-bold"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || otpCode.length !== 6}
                  className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-xl shadow-saffron-500/20 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Verifying Code...' : 'Verify Code & Enter'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* METHOD 2: STANDARD PASSWORD SIGN IN */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. aarav.sharma@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-saffron-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-saffron-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-xl shadow-saffron-500/20 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{submitting ? 'Authenticating...' : 'Sign In with Password'}</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-saffron-400 hover:text-saffron-300 font-semibold">
            Create an Account
          </Link>
        </div>

        {/* Discreet Staff / Executive Access Toggle */}
        <div className="pt-2 border-t border-slate-800/60 text-center">
          <button
            type="button"
            onClick={() => setShowStaffAccess(!showStaffAccess)}
            className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors inline-flex items-center gap-1"
          >
            <Shield className="w-3 h-3 text-slate-500" />
            <span>Staff &amp; Executive Access</span>
          </button>

          {showStaffAccess && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2">
              <div className="text-[11px] font-bold text-slate-400">Authorized Personnel:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', '/admin/dashboard')}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 text-[11px] text-indigo-300 font-semibold text-center"
                >
                  Admin Portal
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('super_admin', '/super-admin/dashboard')}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-[11px] text-amber-300 font-semibold text-center"
                >
                  Super Admin HQ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

