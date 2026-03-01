// src/lib/auth.js
const AUTH_API_URL = process.env.NEXT_PUBLIC_LOGIN_SERVICE_URL || 'http://localhost:8004/api/auth';

// Helper function to check if user is admin
const checkIfAdmin = (userData) => {
  if (!userData) return false;
  
  const id = String(userData.id || '').toLowerCase();
  const email = String(userData.email || '').toLowerCase();
  const role = String(userData.role || '').toLowerCase();
  const userType = String(userData.user_type || '').toLowerCase();
  
  return (
    id === 'admin' || 
    id === '1' ||
    email.includes('admin') ||
    role === 'admin' ||
    role === 'role_admin' ||
    userType === 'admin' ||
    userData.isAdmin === true
  );
};

export const authApi = {
  login: async (email, password) => {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.error || 'Login failed');
    }

    const data = await response.json();
    if (!data.user) throw new Error('No user data received from server');
    
    // Add isAdmin flag and save to localStorage
    const userWithAdmin = { ...data.user, isAdmin: checkIfAdmin(data.user) };
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(userWithAdmin));
    
    return { ...data, user: userWithAdmin };
  },

  register: async (userData) => {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.error || 'Registration failed');
    }

    const data = await response.json();
    const userWithAdmin = { ...data.user, isAdmin: checkIfAdmin(data.user) };
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(userWithAdmin));
    
    return { ...data, user: userWithAdmin };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
    }
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return {
        ...user,
        id: String(user.id || ''),
        email: String(user.email || ''),
        name: String(user.name || ''),
        isAdmin: user.isAdmin === true
      };
    } catch (error) {
      return null;
    }
  },

  getToken: () => typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: () => typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
};