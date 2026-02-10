"use client";
// src/app/login/page.jsx
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectTo = searchParams.get("redirect") || "/products";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login fehlgeschlagen");
      }

      // Success: redirect
      router.push(redirectTo);
      router.refresh();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <form 
        className="card bg-ui tls-shadow-md m-auto h-fit w-full max-w-sm p-1" 
        onSubmit={handleSubmit}
      >
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-title text-2xl font-bold mb-2">
              Willkommen zurück
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Melde dich an, um fortzufahren
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="field">
              <label htmlFor="email" className="text-title text-sm font-medium mb-2 block">
                E-Mail
              </label>
              <input 
                id="email" 
                type="email"
                className="input sz-md variant-mixed w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="deine@email.de"
                required 
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="password" className="text-title text-sm font-medium mb-2 block">
                Passwort
              </label>
              <input 
                id="password" 
                type="password" 
                className="input sz-md variant-mixed w-full" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
                disabled={loading}
              />
            </div>

            <button 
              type="submit"
              className="btn variant-primary sz-md w-full disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              {loading ? "Anmeldung läuft..." : "Anmelden"}
            </button>
          </div>

          {/* Footer - Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Noch kein Konto?{" "}
            <Link 
              href="/register" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Jetzt registrieren
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
}