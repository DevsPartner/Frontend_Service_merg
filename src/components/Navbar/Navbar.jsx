'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import LoginModal from '../Login/LoginModal';
import Link from 'next/link';

export default function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [trainingModel, setTrainingModel] = useState(false);
  const { user, logout } = useAuth();

  async function handleTrainModel() {
    if (!user?.isAdmin) return;
    setTrainingModel(true);
    try {
      const response = await fetch('/api/recommendations', { method: 'POST' });
      if (response.ok) {
        alert('✅ Model training started!');
      } else {
        alert('❌ Failed to start training');
      }
    } catch (error) {
      alert('❌ Error starting training');
    } finally {
      setTrainingModel(false);
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  SmartShop
                </h1>
                <p className="text-xs text-gray-400">Powered by MLOps</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Home</Link>
              <Link href="/products" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Products</Link>
              <Link href="/cart" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Cart</Link>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {user.isAdmin && (
                    <>
                      <Link
                        href="/admin/dashboard"
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-900/40 text-indigo-300 text-sm font-medium rounded-lg hover:bg-indigo-900/60 transition-all"
                      >
                        Forecast
                      </Link>
                      <button
                        onClick={handleTrainModel}
                        disabled={trainingModel}
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-900/40 text-purple-300 text-sm font-medium rounded-lg hover:bg-purple-900/60 transition-all disabled:opacity-50"
                      >
                        {trainingModel ? 'Training...' : 'Train AI'}
                      </button>
                      <a
                        href="http://localhost:8006/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-900/40 text-green-300 text-sm font-medium rounded-lg hover:bg-green-900/60 transition-all"
                      >
                        API Docs
                      </a>
                      <a
                        href="http://localhost:8008/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-900/40 text-orange-300 text-sm font-medium rounded-lg hover:bg-orange-900/60 transition-all"
                      >
                        Forecast API
                      </a>
                      <Link
                        href="/dashboard"
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-900/40 text-teal-300 text-sm font-medium rounded-lg hover:bg-teal-900/60 transition-all"
                      >
                        Analytics
                      </Link>
                    </>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-400">{user.isAdmin ? 'Admin' : 'Customer'}</p>
                    </div>

                    <div className="relative group">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>

                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-4 border-b border-gray-700">
                          <p className="font-medium text-white">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <div className="p-2">
                          {user.isAdmin && (
                            <>
                              <Link href="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                                Forecasting Dashboard
                              </Link>
                              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                                Store Analytics
                              </Link>
                              <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                                MLflow Tracking
                              </a>
                            </>
                          )}
                          <a
                            href={`http://localhost:8006/simulate/${user.customer_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            AI Preview
                          </a>
                          <Link href="/cart" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                            Cart
                          </Link>
                          <button
                            onClick={logout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="mt-4 md:hidden flex items-center justify-center gap-4">
            <Link href="/" className="text-sm text-gray-300 hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-800">Home</Link>
            <Link href="/products" className="text-sm text-gray-300 hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-800">Products</Link>
            <Link href="/cart" className="text-sm text-gray-300 hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-800">Cart</Link>
            {user?.isAdmin && (
              <>
                <Link href="/admin/dashboard" className="text-sm text-gray-300 hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-800">Forecast</Link>
                <Link href="/dashboard" className="text-sm text-gray-300 hover:text-blue-400 font-medium px-3 py-2 rounded-lg hover:bg-gray-800">Analytics</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}