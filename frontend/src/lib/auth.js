const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8004/api/auth';

// Helper function to check if user is admin
const checkIfAdmin = (userData) => {
  if (!userData) return false;
  
  // Check multiple ways user could be admin
  const id = String(userData.id || '').toLowerCase();
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
    id.includes('admin') ||
    id === '1'
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
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Make sure user data exists
    if (!data.user) {
      throw new Error('No user data received from server');
    }
    
    // Add isAdmin flag to user
    const userWithAdmin = {
      ...data.user,
      isAdmin: checkIfAdmin(data.user)
    };
    
    // Store in localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(userWithAdmin));
    
    return {
      ...data,
      user: userWithAdmin
    };
  },

  register: async (userData) => {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    
    // Make sure user data exists
    if (!data.user) {
      throw new Error('No user data received from server');
    }
    
    // Add isAdmin flag to user
    const userWithAdmin = {
      ...data.user,
      isAdmin: checkIfAdmin(data.user)
    };
    
    // Store in localStorage
    localStorage.setItem('token', data.access_token);
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
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      
      // Ensure all required fields are strings
      const safeUser = {
        ...user,
        id: String(user.id || ''),
        email: String(user.email || ''),
        username: String(user.username || ''),
        name: String(user.name || ''),
        role: String(user.role || ''),
        user_type: String(user.user_type || ''),
        isAdmin: user.isAdmin === true
      };
      
      return safeUser;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  getToken: () => localStorage.getItem('token'),
  
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  // Optional: Method to manually set admin status for testing
  setAdminStatus: (isAdmin) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    try {
      const user = JSON.parse(userStr);
      const updatedUser = { ...user, isAdmin };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  },
  
  // Optional: Method to simulate admin login for testing
  simulateAdminLogin: (userId = 'admin') => {
    const mockAdminUser = {
      id: String(userId),
      email: 'admin@example.com',
      username: 'admin',
      name: 'Admin User',
      role: 'admin',
      isAdmin: true
    };
    
    localStorage.setItem('token', 'mock-token-for-testing');
    localStorage.setItem('user', JSON.stringify(mockAdminUser));
    
    return mockAdminUser;
  },
  
  // Optional: Method to simulate regular user login for testing
  simulateUserLogin: (userId = 'user123') => {
    const mockUser = {
      id: String(userId),
      email: 'user@example.com',
      username: 'user',
      name: 'Regular User',
      role: 'user',
      isAdmin: false
    };
    
    localStorage.setItem('token', 'mock-token-for-testing');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return mockUser;
  }
};