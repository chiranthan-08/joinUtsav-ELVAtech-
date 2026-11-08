import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from './ToastContext';
import { FALLBACK_USERS } from '../data/seedFallback';

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = {
  'superadmin@utsavmitra.com': {
    password: 'Super@123',
    user: {
      _id: 'usr_superadmin_01',
      name: 'Vikramaditya Rathore',
      email: 'superadmin@utsavmitra.com',
      role: 'super_admin',
      phone: '+91 98290 12345',
      city: 'New Delhi',
      organization: 'UtsavMitra HQ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'active'
    }
  },
  'admin@utsavmitra.com': {
    password: 'Admin@123',
    user: {
      _id: 'usr_admin_01',
      name: 'Sunita Mehra',
      email: 'admin@utsavmitra.com',
      role: 'admin',
      phone: '+91 98110 54321',
      city: 'Jaipur',
      organization: 'UtsavMitra Regional Operations',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status: 'active'
    }
  },
  'organizer@jaipurfest.com': {
    password: 'Org@123',
    user: {
      _id: 'usr_organizer_01',
      name: 'Rajesh Singhania',
      email: 'organizer@jaipurfest.com',
      role: 'organizer',
      phone: '+91 94140 88776',
      city: 'Jaipur',
      organization: 'Royal Rajputana Weddings & Events',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      status: 'active'
    }
  },
  'aarav.sharma@gmail.com': {
    password: 'User@123',
    user: {
      _id: 'usr_user_01',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      role: 'user',
      phone: '+91 98765 11223',
      city: 'Bengaluru',
      status: 'active'
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('utsavmitra_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('utsavmitra_token') || null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await api.get('/auth/me');
      if (data && data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('utsavmitra_user', JSON.stringify(data.user));
      } else {
        throw new Error('User not returned from session verification');
      }
    } catch (err) {
      // In offline/Netlify mode, check if we have a cached user
      const cached = localStorage.getItem('utsavmitra_user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch (e) {
          logout();
        }
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const normEmail = (email || '').toLowerCase().trim();
    try {
      const data = await api.post('/auth/login', { email: normEmail, password });
      if (data && data.success) {
        localStorage.setItem('utsavmitra_token', data.token);
        localStorage.setItem('utsavmitra_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}! (${data.user.role.toUpperCase()})`);
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Login failed.');
    } catch (err) {
      // Offline / Netlify fallback: check known demo accounts
      const match = DEMO_ACCOUNTS[normEmail];
      if (match && match.password === password) {
        const mockToken = 'mock_jwt_' + match.user.role + '_' + Date.now();
        localStorage.setItem('utsavmitra_token', mockToken);
        localStorage.setItem('utsavmitra_user', JSON.stringify(match.user));
        setToken(mockToken);
        setUser(match.user);
        toast.success(`Welcome back, ${match.user.name}! (${match.user.role.toUpperCase()})`);
        return { success: true, user: match.user };
      }

      toast.error(err.message || 'Invalid email or password.');
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const data = await api.post('/auth/register', formData);
      if (data && data.success) {
        localStorage.setItem('utsavmitra_token', data.token);
        localStorage.setItem('utsavmitra_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Registration successful! Welcome to UtsavMitra.`);
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      // Offline fallback: register locally
      const newUser = {
        _id: 'usr_' + Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role || 'user',
        phone: formData.phone || '+91 98765 43210',
        city: formData.city || 'Jaipur',
        organization: formData.organization || '',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`,
        status: 'active'
      };
      const mockToken = 'mock_jwt_user_' + Date.now();
      localStorage.setItem('utsavmitra_token', mockToken);
      localStorage.setItem('utsavmitra_user', JSON.stringify(newUser));
      setToken(mockToken);
      setUser(newUser);
      toast.success(`Welcome to UtsavMitra, ${newUser.name}!`);
      return { success: true, user: newUser };
    }
  };

  const sendLoginOTP = async (email) => {
    try {
      const data = await api.post('/auth/send-otp', { email });
      if (data.success) {
        toast.success(data.message || 'Verification code sent to your email.');
        return { success: true };
      }
      throw new Error(data.message);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP code.');
      return { success: false, error: err.message };
    }
  };

  const loginWithOTP = async (email, otp) => {
    try {
      const data = await api.post('/auth/verify-otp', { email, otp });
      if (data.success) {
        localStorage.setItem('utsavmitra_token', data.token);
        localStorage.setItem('utsavmitra_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome to UtsavMitra, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
      throw new Error(data.message);
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP.');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('utsavmitra_token');
    localStorage.removeItem('utsavmitra_user');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully.');
  };

  // Demo role switcher: Instant swap into any of the 4 personas
  const switchRolePersona = async (roleName) => {
    try {
      const data = await api.post('/auth/switch-persona', { role: roleName });
      if (data && data.success) {
        localStorage.setItem('utsavmitra_token', data.token);
        localStorage.setItem('utsavmitra_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Switched active view to ${data.user.name} (${roleName.toUpperCase()})`);
        return { success: true, user: data.user };
      }
      throw new Error('Persona switch not acknowledged');
    } catch (err) {
      // Offline fallback switch
      const roleMap = {
        super_admin: DEMO_ACCOUNTS['superadmin@utsavmitra.com'].user,
        admin: DEMO_ACCOUNTS['admin@utsavmitra.com'].user,
        organizer: DEMO_ACCOUNTS['organizer@jaipurfest.com'].user,
        user: DEMO_ACCOUNTS['aarav.sharma@gmail.com'].user
      };
      const fallbackUser = roleMap[roleName];
      if (fallbackUser) {
        const mockToken = 'mock_jwt_' + roleName;
        localStorage.setItem('utsavmitra_token', mockToken);
        localStorage.setItem('utsavmitra_user', JSON.stringify(fallbackUser));
        setToken(mockToken);
        setUser(fallbackUser);
        toast.success(`Switched active view to ${fallbackUser.name} (${roleName.toUpperCase()})`);
        return { success: true, user: fallbackUser };
      }

      toast.error('Failed to switch persona.');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        sendLoginOTP,
        loginWithOTP,
        register,
        logout,
        switchRolePersona,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
