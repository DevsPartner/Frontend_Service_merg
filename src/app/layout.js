// src/app/layout.js
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* These providers make Auth/Cart state available to EVERY page */}
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}