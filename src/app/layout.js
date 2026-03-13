import { Inter } from "next/font/google";
import { AuthProvider } from '@/components/Navbar/AuthContext';
import Navbar from '@/components/Navbar/Navbar';
import './globals.css';

// Replace Geist with Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata = {
  title: "TECH.CORE | Premium Electronics",
  description: "Next-Gen Tech for your digital life",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}