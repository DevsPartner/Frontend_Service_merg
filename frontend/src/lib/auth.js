export const authApi = {
  login: async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.error || 'Login failed');
    }

    const data = await response.json();
    
    if (!data.user) {
      throw new Error('No user data received from server');
    }
    
    const userWithAdmin = {
      ...data.user,
      id: String(data.user.id || data.user.customer_id || ''),
      isAdmin: checkIfAdmin(data.user)
    };
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userWithAdmin));
    
    return {
      ...data,
      user: userWithAdmin
    };
  },

  register: async (userData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.error || 'Registration failed');
    }

    const data = await response.json();
    
    if (!data.user) {
      throw new Error('No user data received from server');
    }
    
    const userWithAdmin = {
      ...data.user,
      id: String(data.user.id || data.user.customer_id || ''),
      isAdmin: checkIfAdmin(data.user)
    };
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userWithAdmin));
    
    return {
      ...data,
      user: userWithAdmin
    };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return {
        ...user,
        id: String(user.id || user.customer_id || ''),
        email: String(user.email || ''),
        username: String(user.username || ''),
        name: String(user.name || user.username || ''),
        role: String(user.role || ''),
        user_type: String(user.user_type || ''),
        isAdmin: user.isAdmin === true
      };
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },
  
  setAdminStatus: (isAdmin) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    try {
      const user = JSON.parse(userStr);
      localStorage.setItem('user', JSON.stringify({ ...user, isAdmin }));
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  },
};

const checkIfAdmin = (userData) => {
  if (!userData) return false;
  const id = String(userData.id || userData.customer_id || '').toLowerCase();
  const email = String(userData.email || '').toLowerCase();
  const username = String(userData.username || '').toLowerCase();
  const role = String(userData.role || '').toLowerCase();
  const userType = String(userData.user_type || '').toLowerCase();
  return (
    id === 'admin' || 
    email.includes('admin') ||
    username.includes('admin') ||
    role === 'admin' ||
    role === 'role_admin' ||
    userType === 'admin' ||
    userData.isAdmin === true ||
    id === '1'
  );
};