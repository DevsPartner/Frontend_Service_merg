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
  const pathname = usePathname(); // For active link styling
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  // Close dropdown when clicking outside
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

  // Helper for active links
  const isActive = (path) => pathname === path;

  return (
    <header className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300">
              TECH.CORE
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {[
              { name: 'Home', path: '/' },
              { name: 'Produkte', path: '/products' },
            ].map((link) => (
              <Link 
                key={link.path}
                href={link.path} 
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 uppercase tracking-wide ${
                  isActive(link.path) 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Cart Icon */}
            <Link 
              href="/cart"
              className="relative p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full transition-all hover:ring-2 hover:ring-blue-500/20"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                    {user.name?.charAt(0) || user.email?.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-gray-700 dark:text-gray-300">
                    {user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                        <p className="text-xs text-gray-500 uppercase font-bold">Angemeldet als</p>
                        <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Profil
                    </Link>
                    <Link href="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      Bestellungen
                    </Link>
                    <hr className="my-1 border-gray-100 dark:border-gray-800" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Abmelden
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Sidebar/Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 space-y-2 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top duration-300">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${isActive('/') ? 'bg-blue-50 text-blue-600' : ''}`}>Home</Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-bold ${isActive('/products') ? 'bg-blue-50 text-blue-600' : ''}`}>Produkte</Link>
            
            {!user && (
               <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-center">Login</Link>
            )}

            {user && (
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 font-bold text-gray-600 dark:text-gray-400">Mein Profil</Link>
                <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 font-bold text-gray-600 dark:text-gray-400">Bestellungen</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 font-bold text-red-600">Abmelden</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}