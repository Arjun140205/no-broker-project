import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SmoothScrollProvider } from '../contexts/SmoothScrollContext';
import SharedNavigation from '../components/SharedNavigation';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // Use shared navigation for all pages
  const shouldUseLayout = false;

  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <AuthProvider>
          <SocketProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'glass-effect',
                style: {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: 'hsl(var(--primary))',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <>
              <SharedNavigation />
              <Component {...pageProps} />
            </>
          </SocketProvider>
        </AuthProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default MyApp;
