import React, { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { auth_me, google_login,logout } from '@/api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { userId, role, companyId }
  const [loading, setLoading] = useState(true);

  // Fetch current user on app load (session persistence)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(auth_me, { withCredentials: true });
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (loading || user) return; 

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, 
        callback: handleCredentialResponse,
        auto_select: false, 
        cancel_on_tap_outside: true, 
      });

      window.google.accounts.id.prompt();
    };

    return () => {
      document.head.removeChild(script);
      if (window.google && window.google.accounts) {
        window.google.accounts.id.cancel(); 
      }
    };
  }, [loading, user]);

  async function handleCredentialResponse(response) {
    try {
      const res = await axios.post(
        google_login,
        { credential: response.credential }, 
        { withCredentials: true }
      );

      if (res.data.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error('Google One Tap login failed:', error);
    }
  }

  const logout = async () => {
    setUser(null);
    try {
      await axios.post(logout, {}, { withCredentials: true });
    } catch (err) {}
  };

  const refreshUser = async () => {
    try {
      const res = await axios.get(auth_me, { withCredentials: true });
      setUser(res.data.user || null);
    } catch (err) {
      setUser(null);
    }
  };

  const memoedContext = useMemo(
    () => ({
      user,
      setUser,
      loading,
      logout,
      refreshUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={memoedContext}>{children}</AuthContext.Provider>;
}
