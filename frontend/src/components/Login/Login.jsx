"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, guestLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push(redirect);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestCheckout = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    guestLogin(email);
    router.push(redirect);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center">Welcome</h2>
          <p className="text-center text-gray-600 mt-2">
            Login or continue as guest
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full p-3 border rounded"
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (optional for guest)"
              className="w-full p-3 border rounded"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              Login
            </button>
            
            <button
              type="button"
              onClick={handleGuestCheckout}
              disabled={isLoading}
              className="w-full bg-gray-600 text-white p-3 rounded hover:bg-gray-700"
            >
              Continue as Guest
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Guest checkout only requires your email
          </p>
        </form>
      </div>
    </div>
  );
}