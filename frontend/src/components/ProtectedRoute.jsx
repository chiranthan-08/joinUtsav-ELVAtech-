import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const toast = useToast();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin can access all routes
  if (user.role === 'super_admin') {
    return children;
  }

  // Admin can access admin, organizer, and user routes
  if (user.role === 'admin' && (allowedRoles.includes('admin') || allowedRoles.includes('organizer') || allowedRoles.includes('user'))) {
    return children;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-4xl">🔒</div>
        <h2 className="text-xl font-bold text-white font-serif">Restricted Interface</h2>
        <p className="text-xs text-slate-400">
          This interface requires <span className="text-saffron-400 font-bold uppercase">{allowedRoles.join(' or ')}</span> privileges.
          Your current active role is <span className="text-white font-bold uppercase">{user.role}</span>.
        </p>
        <p className="text-xs text-slate-500">
          Tip: Use the top <strong>"4 Interface Switcher"</strong> bar to switch roles instantly!
        </p>
      </div>
    );
  }

  return children;
};

