'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  function normalizeUser(userData) {
    if (!userData) return null;
    return {
      ...userData,
      // map is_admin -> isAdmin in case backend returns snake_case
      isAdmin: userData.isAdmin ?? userData.is_admin ?? false,
    };
  }

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    const normalized = normalizeUser(data.user);
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
    return normalized;
  }

  async function register({ email, password, name, birthday, gender, address }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, birthday, gender, address }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    const normalized = normalizeUser(data.user);
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
    return normalized;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}