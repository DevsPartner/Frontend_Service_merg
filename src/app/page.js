import Link from 'next/link';
import Products from '@/components/Products/Products';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0f172a]">
      {/* --- Hero Section --- */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
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
              Kuratiert für Innovatoren, Gamer und Technik-Enthusiasten.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/products" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all transform active:scale-95"
              >
                Jetzt shoppen
              </Link>
              <Link 
                href="#featured" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-md transition-all"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Featured Products Section --- */}
      <section id="featured" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Unsere Highlights
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Handverlesene Premium-Produkte für dich.
              </p>
            </div>
            <Link 
              href="/products" 
              className="text-blue-600 font-bold hover:underline flex items-center gap-2"
            >
              Alle Produkte ansehen <span>→</span>
            </Link>
          </div>

          {/* This is your original Products Component */}
          <Products />
        </div>
      </section>

      {/* --- Trust Bar --- */}
      <section className="bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Gratis Versand', icon: '🚚', desc: 'Ab 50€ Bestellwert' },
            { label: '24/7 Support', icon: '💬', desc: 'Wir helfen dir immer' },
            { label: 'Sichere Zahlung', icon: '🔒', desc: 'SSL verschlüsselt' },
            { label: '30 Tage Rückgabe', icon: '🔄', desc: 'Geld-zurück-Garantie' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <h4 className="font-bold text-gray-900 dark:text-white">{item.label}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}