"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [trainingModel, setTrainingModel] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  async function handleTrainModel() {
    if (!user?.isAdmin) return;
    setTrainingModel(true);
    try {
      const response = await fetch('/api/recommendations', { method: 'POST' });
      if (response.ok) alert('✅ AI Training Started!');
      else alert('❌ Failed to start training');
    } catch (err) {
      alert('❌ Error starting training');
    } finally {
      setTrainingModel(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const isActive = (path) => pathname === path;

  return (
    <header className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TECH.CORE
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link href="/" className={`px-4 py-2 text-sm font-bold rounded-xl transition-all uppercase tracking-wide ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}>Home</Link>
            <Link href="/products" className={`px-4 py-2 text-sm font-bold rounded-xl transition-all uppercase tracking-wide ${isActive('/products') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}>Produkte</Link>
            
            {/* AI Training Button (Only for Admin) */}
            {user?.isAdmin && (
              <button 
                onClick={handleTrainModel}
                disabled={trainingModel}
                className="ml-4 px-4 py-2 text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all disabled:opacity-50"
              >
                {trainingModel ? 'Training...' : 'Train AI'}
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1 pr-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:ring-2 hover:ring-blue-500/20">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-gray-700 dark:text-gray-300">Account</span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 py-2 animate-in fade-in zoom-in-95 duration-150">
                    {user.isAdmin && (
                       <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50">
                         Admin Dashboard
                       </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50">
                      Abmelden
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all">
                Login
              </Link>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/> : <path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2}/>}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}