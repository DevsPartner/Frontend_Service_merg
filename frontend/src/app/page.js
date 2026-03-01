// src/app/page.js
import Link from 'next/link';
import Products from '@/components/Products/Products';
import Recommendations from '@/components/recommendations/Recommendations'; // Add this import

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0f172a]">
      {/* --- Hero Section --- */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-[10000ms] hover:scale-110" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
              New Season 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-6">
              Next-Gen Tech <br />
              <span className="text-blue-500">For Your Digital Life.</span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
              Entdecke die exklusivsten Gadgets und Premium-Elektronik. 
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95">
                Jetzt shoppen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Recommendations Section --- */}
      <Recommendations /> {/* Add this line */}

      {/* --- Products Grid --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Products />
        </div>
      </section>
    </main>
  );
}