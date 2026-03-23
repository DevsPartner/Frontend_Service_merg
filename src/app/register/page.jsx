"use client";
// src/app/register/page.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthday: "",
    gender: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const router = useRouter();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Bitte akzeptiere die Nutzungsbedingungen");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          birthday: formData.birthday || undefined,
          gender: formData.gender || undefined,
          address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registrierung fehlgeschlagen");
      }

      router.push("/login?registered=true");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <form 
        className="card bg-ui tls-shadow-md m-auto h-fit w-full max-w-2xl p-1" 
        onSubmit={handleSubmit}
      >
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-title text-2xl font-bold mb-2">
              Konto erstellen
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Erstelle dein Konto und starte mit dem Einkaufen
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
            {/* Account Information */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-title text-lg font-semibold mb-4">
                Account-Informationen
              </h2>
              
              <div className="space-y-4">
                <div className="field">
                  <label htmlFor="email" className="text-title text-sm font-medium mb-2 block">
                    E-Mail *
                  </label>
                  <input 
                    id="email" 
                    name="email"
                    type="email"
                    className="input sz-md variant-mixed w-full" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="deine@email.de"
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="field">
                    <label htmlFor="password" className="text-title text-sm font-medium mb-2 block">
                      Passwort *
                    </label>
                    <input 
                      id="password"
                      name="password"
                      type="password" 
                      className="input sz-md variant-mixed w-full" 
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mindestens 8 Zeichen"
                      required 
                      disabled={loading}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="confirmPassword" className="text-title text-sm font-medium mb-2 block">
                      Passwort bestätigen *
                    </label>
                    <input 
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password" 
                      className="input sz-md variant-mixed w-full" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Passwort wiederholen"
                      required 
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-title text-lg font-semibold mb-4">
                Persönliche Informationen
              </h2>
              
              <div className="space-y-4">
                <div className="field">
                  <label htmlFor="name" className="text-title text-sm font-medium mb-2 block">
                    Vollständiger Name *
                  </label>
                  <input 
                    id="name"
                    name="name"
                    type="text"
                    className="input sz-md variant-mixed w-full" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Max Mustermann"
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="field">
                    <label htmlFor="birthday" className="text-title text-sm font-medium mb-2 block">
                      Geburtsdatum
                    </label>
                    <input 
                      id="birthday"
                      name="birthday"
                      type="date"
                      className="input sz-md variant-mixed w-full" 
                      value={formData.birthday}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="gender" className="text-title text-sm font-medium mb-2 block">
                      Geschlecht
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className="input sz-md variant-mixed w-full"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Bitte wählen</option>
                      <option value="male">Männlich</option>
                      <option value="female">Weiblich</option>
                      <option value="other">Divers</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-title text-lg font-semibold mb-4">
                Adresse
              </h2>
              
              <div className="space-y-4">
                <div className="field">
                  <label htmlFor="street" className="text-title text-sm font-medium mb-2 block">
                    Straße und Hausnummer
                  </label>
                  <input 
                    id="street"
                    name="street"
                    type="text"
                    className="input sz-md variant-mixed w-full" 
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Musterstraße 123"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="field">
                    <label htmlFor="postalCode" className="text-title text-sm font-medium mb-2 block">
                      PLZ
                    </label>
                    <input 
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      className="input sz-md variant-mixed w-full" 
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="12345"
                      disabled={loading}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="city" className="text-title text-sm font-medium mb-2 block">
                      Stadt
                    </label>
                    <input 
                      id="city"
                      name="city"
                      type="text"
                      className="input sz-md variant-mixed w-full" 
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Berlin"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="country" className="text-title text-sm font-medium mb-2 block">
                    Land
                  </label>
                  <select 
                    id="country"
                    name="country"
                    className="input sz-md variant-mixed w-full" 
                    value={formData.country}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Land auswählen</option>
                    <option value="DE">Deutschland</option>
                    <option value="AT">Österreich</option>
                    <option value="CH">Schweiz</option>
                    <option value="NL">Niederlande</option>
                    <option value="FR">Frankreich</option>
                    <option value="IT">Italien</option>
                    <option value="ES">Spanien</option>
                    <option value="PL">Polen</option>
                    <option value="BE">Belgien</option>
                    <option value="LU">Luxemburg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start pt-4">
              <input 
                id="terms"
                type="checkbox"
                className="mt-1 mr-3 h-4 w-4"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                Ich akzeptiere die{" "}
                <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Nutzungsbedingungen
                </Link>{" "}
                und die{" "}
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Datenschutzerklärung
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="btn variant-primary sz-md w-full disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              {loading ? "Registrierung läuft..." : "Konto erstellen"}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Hast du bereits ein Konto?{" "}
            <Link 
              href="/login" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Jetzt anmelden
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
}