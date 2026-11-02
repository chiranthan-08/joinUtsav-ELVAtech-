import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Mail, 
  Ticket, 
  QrCode, 
  ShieldCheck, 
  Crown, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  Compass,
  LayoutDashboard
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/90 border-b border-slate-800 sticky top-9 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 via-rose-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-saffron-500/20 group-hover:scale-105 transition-transform">
              🪔
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight bg-gradient-to-r from-saffron-400 via-rose-300 to-amber-300 bg-clip-text text-transparent flex items-center gap-1.5 font-serif">
                UtsavMitra
                <span className="text-[10px] font-sans font-normal px-1.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                  AI
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                उत्सवमित्र • Event Platform
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/events"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events')
                  ? 'bg-saffron-500/10 text-saffron-400 border border-saffron-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-saffron-400" />
              <span>Explore Events</span>
            </Link>

            <Link
              to="/ai-planner"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/ai-planner')
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>AI Planner</span>
            </Link>

            <Link
              to="/invitations"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/invitations')
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Digital E-Invites</span>
            </Link>

            <Link
              to="/venues"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/venues')
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Venues</span>
            </Link>
          </div>

          {/* Right Action / Role Specific Badges */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Role Specific Shortcuts */}
                {user.role === 'organizer' && (
                  <>
                    <Link
                      to="/organizer/scanner"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      QR Scanner
                    </Link>
                    <Link
                      to="/organizer/dashboard"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Organizer Desk
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Admin Console
                  </Link>
                )}

                {user.role === 'super_admin' && (
                  <Link
                    to="/super-admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-sm"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Super Admin HQ
                  </Link>
                )}

                {user.role === 'user' && (
                  <Link
                    to="/user/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-saffron-500/10 text-saffron-300 border border-saffron-500/30 hover:bg-saffron-500/20 transition-all"
                  >
                    <Ticket className="w-3.5 h-3.5 text-saffron-400" />
                    My Passes
                  </Link>
                )}

                {/* Profile Pill & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                    <div className="text-[10px] uppercase font-bold text-saffron-400 tracking-wider">
                      {user.role.replace('_', ' ')}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-md shadow-saffron-500/20 transition-all"
                >
                  Join UtsavMitra
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white font-medium"
          >
            Explore Events
          </Link>
          <Link
            to="/ai-planner"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-rose-400 font-medium"
          >
            AI Planner
          </Link>
          <Link
            to="/invitations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white font-medium"
          >
            Digital E-Invites
          </Link>
          <Link
            to="/venues"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white font-medium"
          >
            Venues
          </Link>

          {user ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">Signed in as <span className="text-white font-bold">{user.name}</span> ({user.role})</div>
              {user.role === 'user' && (
                <Link to="/user/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-saffron-400 font-semibold">
                  My Bookings & QR Passes
                </Link>
              )}
              {user.role === 'organizer' && (
                <>
                  <Link to="/organizer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-rose-400 font-semibold">
                    Organizer Dashboard
                  </Link>
                  <Link to="/organizer/scanner" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-emerald-400 font-semibold">
                    Live QR Pass Scanner
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-indigo-400 font-semibold">
                  Admin Platform Dashboard
                </Link>
              )}
              {user.role === 'super_admin' && (
                <Link to="/super-admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-amber-400 font-semibold">
                  Super Admin HQ Console
                </Link>
              )}
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-rose-400 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2 text-center rounded-lg bg-slate-800 text-white font-medium text-sm">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2 text-center rounded-lg bg-saffron-600 text-white font-medium text-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
