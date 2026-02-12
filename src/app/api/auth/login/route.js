// src/lib/auth.js (Updated to match your FastAPI Backend)

export const authApi = {
  login: async (email, password) => {
    const response = await fetch('http://localhost:8000/auth/login', { // Note the path /auth/login
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Since your backend only returns email, we create a user object
    // We also check if the email contains 'admin' to set the flag locally
    const user = {
      email: data.email,
      isAdmin: data.email.toLowerCase().includes('admin') || data.email === '1'
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user };
  },

  // Add the logout to clear the cookie and local storage
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      // To clear the HttpOnly cookie, you usually need a backend /logout route
      // but we clear the UI state here immediately.
    }
  }
};