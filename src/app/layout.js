// src/app/layout.js
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}