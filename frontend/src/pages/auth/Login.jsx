import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogIn, Sparkles, User, Calendar, Shield, Crown, ArrowRight } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, switchRolePersona } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showStaffAccess, setShowStaffAccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      if (res.user.role === 'super_admin') navigate('/super-admin/dashboard');
      else if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/user/dashboard');
    }
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

      {/* Normal Login Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
            <span>{submitting ? 'Authenticating...' : 'Sign In to UtsavMitra'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-saffron-400 hover:text-saffron-300 font-semibold">
            Create an Account
          </Link>
        </div>

        {/* Discreet Staff / Executive Access Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 text-center">
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

