'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, error, loading, user } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    
    try {
      await login(credentials);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setLocalError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - EstoSpaces</title>
        <meta name="description" content="Sign in to your EstoSpaces account" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        </div>

        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl opacity-10"
          style={{ background: 'linear-gradient(135deg, #ffffff, #888888)' }}
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 rounded-full blur-3xl opacity-10"
          style={{ background: 'linear-gradient(135deg, #888888, #ffffff)' }}
          animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl font-light mb-2 text-white" style={{ fontFamily: 'Playfair Display' }}>
                  EstoSpaces
                </h1>
                <p className="text-gray-400 font-light text-sm tracking-widest" style={{ fontFamily: 'Inter' }}>
                  SIGN IN
                </p>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-light mb-3 text-white" style={{ fontFamily: 'Playfair Display' }}>
                  Welcome Back
                </h2>
                <p className="text-gray-400 font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Sign in to your account to continue
                </p>
              </div>

              {(error || localError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 mb-6"
                >
                  <div className="text-sm text-red-400 font-light">{error || localError}</div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-light text-gray-300" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={credentials.email}
                      onChange={handleChange}
                      className="pl-12 h-12 rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-light text-gray-300" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={credentials.password}
                      onChange={handleChange}
                      className="pl-12 pr-12 h-12 rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-lg font-light text-black bg-white hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Cormorant Garamond' }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-400 font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-white hover:text-gray-300 transition-colors font-light"
                  >
                    Create one
                  </Link>
                </p>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-light"
                  style={{ fontFamily: 'Cormorant Garamond' }}
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
