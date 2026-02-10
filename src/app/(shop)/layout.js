import Navbar from "@/components/Navbar/Navbar";

// ✅ CORRECT: Just use a div or fragment
export default function ShopLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
}