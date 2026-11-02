import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('utsavmitra_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}! (${data.user.role.toUpperCase()})`);
        return { success: true, user: data.user };
      }
    } catch (err) {
      toast.error(err.message || 'Login failed.');
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const data = await api.post('/auth/register', formData);
      if (data.success) {
        localStorage.setItem('utsavmitra_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Registration successful! Welcome to UtsavMitra.`);
        return { success: true, user: data.user };
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('utsavmitra_token');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully.');
  };

  // Demo role switcher: Instant swap into any of the 4 personas without password
  const switchRolePersona = async (roleName) => {
    try {
      const data = await api.post('/auth/switch-persona', { role: roleName });
      if (data.success) {
        localStorage.setItem('utsavmitra_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Switched active view to ${data.user.name} (${roleName.toUpperCase()})`);
        return { success: true, user: data.user };
      }
    } catch (err) {
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
