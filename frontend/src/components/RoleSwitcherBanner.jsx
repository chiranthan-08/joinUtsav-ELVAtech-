import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Calendar, Shield, Crown, Sparkles } from 'lucide-react';

const ROLES = [
  {
    role: 'user',
    label: 'User Interface',
    persona: 'Aarav Sharma',
    icon: User,
    color: 'from-amber-500 to-orange-500',
    targetRoute: '/'
  },
  {
    role: 'organizer',
    label: 'Organizer Interface',
    persona: 'Rajesh Singhania',
    icon: Calendar,
    color: 'from-rose-500 to-pink-600',
    targetRoute: '/organizer/dashboard'
  },
  {
    role: 'admin',
    label: 'Admin Interface',
    persona: 'Sunita Mehra',
    icon: Shield,
    color: 'from-indigo-500 to-blue-600',
    targetRoute: '/admin/dashboard'
  },
  {
    role: 'super_admin',
    label: 'Super Admin Interface',
    persona: 'Vikramaditya (HQ)',
    icon: Crown,
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    targetRoute: '/super-admin/dashboard'
  }
];

export const RoleSwitcherBanner = () => {
  const { user, switchRolePersona } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // STRICT REQUIREMENT: Hide 1st navigation bar from regular users and event organizers.
  // No one should know about Admin or Super Admin dashboards except actual Admins and Super Admins.
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null;
  }

  const isSuperAdmin = user.role === 'super_admin';

  return (
    <aside aria-label="Administrative controls" className="bg-slate-950/95 border-b border-indigo-500/30 backdrop-blur-md px-3 py-1.5 text-xs relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px] sm:text-xs">
          {isSuperAdmin ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="text-amber-300 font-bold">Super Admin Master Console</span>
              <span className="hidden sm:inline text-slate-400">({user.name} &bull; UtsavMitra HQ)</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
              <span className="text-indigo-300 font-bold">Administrator Operations Mode</span>
              <span className="hidden sm:inline text-slate-400">({user.name})</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isSuperAdmin && (
            <button
              onClick={() => navigate('/super-admin/dashboard')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                location.pathname === '/super-admin/dashboard'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
              }`}
            >
              <Crown className="w-3 h-3" />
              <span>Super Admin HQ</span>
            </button>
          )}

          <button
            onClick={() => navigate('/admin/dashboard')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
              location.pathname === '/admin/dashboard'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin Console</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all ${
              location.pathname === '/'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-white bg-slate-950/60'
            }`}
          >
            <span>Public View</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

