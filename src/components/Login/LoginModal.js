'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../Navbar/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ email, password, name });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#1c1e22]">
      {/* --- LEFT SIDE: Marketing Panel (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-black items-end p-16">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-60 transition-transform duration-[2000ms] hover:scale-110" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1e22] via-[#1c1e22]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-8">
            <div className="w-12 h-1.5 bg-[#307de8] rounded-full mb-6"></div>
            <h1 className="text-white text-6xl font-black leading-tight tracking-tighter mb-4">
              Elevate your tech experience.
            </h1>
            <p className="text-white/70 text-lg font-light leading-relaxed">
              The future of electronics, curated for you. Join our community of innovators and enthusiasts.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white text-sm">
              <span className="text-[#307de8] font-bold">✓</span> Secure Tech
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white text-sm">
              <span className="text-[#307de8] font-bold">⚡</span> Fast Delivery
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-gray-50 dark:bg-[#1c1e22]">
        <div className="w-full max-w-[440px] flex flex-col">
          
          {/* Logo (Mobile Only) */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="bg-[#307de8] p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-gray-900 dark:text-white font-bold text-xl tracking-tight">TECH.CORE</span>
          </div>

          <div className="mb-10">
            <h2 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight mb-2">Willkommen zurück</h2>
            <p className="text-gray-500 dark:text-[#93a9c8]">Melden Sie sich an, um fortzufahren.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 dark:text-white text-sm font-semibold">Email-Adresse</label>
              <input 
                type="email"
                required
                disabled={loading}
                className="w-full rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-[#344865] bg-white dark:bg-[#1a2432] h-14 px-4 focus:ring-2 focus:ring-[#307de8]/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-[#93a9c8]/30"
                placeholder="name@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-gray-700 dark:text-white text-sm font-semibold">Passwort</label>
                <Link href="#" className="text-[#307de8] text-xs font-bold hover:underline">Passwort vergessen?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  className="w-full rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-[#344865] bg-white dark:bg-[#1a2432] h-14 px-4 pr-12 focus:ring-2 focus:ring-[#307de8]/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-[#93a9c8]/30"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#307de8]"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#307de8] hover:bg-[#307de8]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "Wird angemeldet..." : "Anmelden"}
                {!loading && <span className="text-xl">→</span>}
              </button>
            </div>
          </form>

          {/* Social Logins */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-[#344865]/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 dark:bg-[#1c1e22] px-4 text-gray-400 dark:text-[#93a9c8]">Oder mit Social Media</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white dark:bg-[#1a2432] hover:bg-gray-100 dark:hover:bg-[#23262b] border border-gray-200 dark:border-[#344865] py-3 rounded-xl transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              <span className="text-gray-700 dark:text-white text-sm font-bold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 bg-white dark:bg-[#1a2432] hover:bg-gray-100 dark:hover:bg-[#23262b] border border-gray-200 dark:border-[#344865] py-3 rounded-xl transition-colors">
              <img src="https://www.svgrepo.com/show/303108/apple-black-logo.svg" className="w-5 h-5 dark:invert" alt="Apple" />
              <span className="text-gray-700 dark:text-white text-sm font-bold">Apple</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-[#93a9c8] text-sm font-normal">
              Noch kein Konto? 
              <Link href="/register" className="text-[#307de8] font-black hover:underline ml-1">Registrieren</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
