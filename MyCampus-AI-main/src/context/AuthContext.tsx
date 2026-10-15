import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DemoUser } from '../types';
import { api, setAuthToken, getAuthToken } from '../lib/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: DemoUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  currentRoute: string;
  navigate: (route: string) => void;
  login: (email: string, password: string) => Promise<DemoUser>;
  logout: () => void;
  switchDemoUser: (email: string) => Promise<DemoUser>;
  resetDemoData: () => Promise<void>;
  isSupabaseActive: boolean;
  signInWithSupabase?: (email: string, password: string) => Promise<any>;
  signUpWithSupabase?: (email: string, password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [user, setUser] = useState<DemoUser | null>(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('mycampus_demo_user') : null;
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      return p === '' ? '/' : p;
    }
    return '/';
  });

  const navigate = useCallback((route: string) => {
    if (typeof window !== 'undefined') {
      setCurrentRoute((prev) => {
        if (prev === route && window.location.pathname === route) {
          return prev;
        }
        if (window.location.pathname !== route) {
          window.history.pushState(null, '', route);
        }
        return route;
      });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Validate session on app initialization
  useEffect(() => {
    const initSession = async () => {
      const existingToken = getAuthToken();
      if (!existingToken) {
        setUser(null);
        setIsLoadingAuth(false);
        return;
      }

      try {
        const verifiedUser = await api.auth.getMe();
        setUser(verifiedUser);
        localStorage.setItem('mycampus_demo_user', JSON.stringify(verifiedUser));
      } catch (err) {
        console.warn('Existing session invalid or expired:', err);
        setAuthToken(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem('mycampus_demo_user');
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<DemoUser> => {
    setIsLoadingAuth(true);
    try {
      const res = await api.auth.demoLogin(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('mycampus_demo_user', JSON.stringify(res.user));
      navigate('/dashboard');
      return res.user;
    } finally {
      setIsLoadingAuth(false);
    }
  }, [navigate]);

  const isSupabaseActive = isSupabaseConfigured();

  const logout = useCallback(async () => {
    if (isSupabaseActive && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    setAuthToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem('mycampus_demo_user');
    navigate('/login');
  }, [navigate, isSupabaseActive]);

  const signInWithSupabase = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client not configured.');
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) {
        const u: DemoUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'explorer',
          role_title: 'Student Explorer',
          department: 'General Studies',
          year_of_study: '1st Year',
          student_id: data.user.id.slice(0, 8).toUpperCase(),
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          is_admin: false,
        };
        setAuthToken(data.session.access_token);
        setToken(data.session.access_token);
        setUser(u);
        localStorage.setItem('mycampus_demo_user', JSON.stringify(u));
        navigate('/dashboard');
        return data;
      }
    } finally {
      setIsLoadingAuth(false);
    }
  }, [navigate]);

  const signUpWithSupabase = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client not configured.');
    setIsLoadingAuth(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const switchDemoUser = useCallback(async (email: string): Promise<DemoUser> => {
    return await login(email, 'demo123');
  }, [login]);

  const resetDemoData = useCallback(async () => {
    await api.auth.resetDemoData();
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoadingAuth,
        currentRoute,
        navigate,
        login,
        logout,
        switchDemoUser,
        resetDemoData,
        isSupabaseActive,
        signInWithSupabase,
        signUpWithSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
