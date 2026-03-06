import { AuthProvider } from '@/components/Navbar/AuthContext';
import Navbar from '@/components/Navbar/Navbar';
import './globals.css';

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