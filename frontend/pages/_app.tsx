import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { SocketProvider } from '../contexts/SocketContext';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR for SocketProvider to avoid hydration issues
const SocketProviderWithNoSSR = dynamic(
  () => import('../contexts/SocketContext').then((mod) => mod.SocketProvider),
  { ssr: false }
);

const ChatProviderWithNoSSR = dynamic(
  () => import('../contexts/ChatContext').then((mod) => mod.ChatProvider),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Check if the current route is login or register - don't wrap those with the full layout
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';
  
  return (
    <SocketProviderWithNoSSR>
      <ChatProviderWithNoSSR>
        {isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
        <Toaster position="top-right" />
      </ChatProviderWithNoSSR>
    </SocketProviderWithNoSSR>
  );
}

export default MyApp;
