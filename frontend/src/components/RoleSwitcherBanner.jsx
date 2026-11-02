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

  const handleSwitch = async (r) => {
    if (user?.role === r.role) {
      navigate(r.targetRoute);
      return;
    }
    const res = await switchRolePersona(r.role);
    if (res.success) {
      navigate(r.targetRoute);
    }
  };

  return (
    <aside aria-label="Demo role selector" className="bg-slate-900/90 border-b border-saffron-500/20 backdrop-blur-md px-3 py-2 sticky top-0 z-40 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-saffron-400 animate-pulse" />
          <span className="text-saffron-300 font-semibold">4 Interface Switcher:</span>
          <span className="hidden sm:inline text-slate-400">Click any persona to test interface permissions</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isActive = user?.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => handleSwitch(r)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${r.color} text-white shadow-lg ring-1 ring-white/30 scale-105`
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title={`Switch to ${r.label} as ${r.persona}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{r.label.split(' ')[0]}</span>
                <span className={`text-[10px] hidden md:inline ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                  ({r.persona.split(' ')[0]})
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

