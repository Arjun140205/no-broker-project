import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Building2, Phone } from 'lucide-react';
const Register = () => {
  const { register, error, loading, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'owner' | 'seeker'>('seeker');
  const [localError, setLocalError] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    
    try {
      await register({ ...formData, role: userType });
      toast.success('Welcome to EstoSpaces!');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setLocalError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Head>
        <title>Create Account - EstoSpaces</title>
        <meta name="description" content="Create your EstoSpaces account" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        </div>

        <motion.div
          className="absolute top-20 right-10 w-32 h-32 rounded-full blur-3xl opacity-10"
          style={{ background: 'linear-gradient(135deg, #ffffff, #888888)' }}
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full blur-3xl opacity-10"
          style={{ background: 'linear-gradient(135deg, #888888, #ffffff)' }}
          animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
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
                CREATE ACCOUNT
              </p>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-light mb-3 text-white" style={{ fontFamily: 'Playfair Display' }}>
                Join Us
              </h2>
              <p className="text-gray-400 font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                Start your luxury journey today
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.button
                type="button"
                onClick={() => setUserType('seeker')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  userType === 'seeker'
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <User className={`w-6 h-6 mx-auto mb-2 ${userType === 'seeker' ? 'text-white' : 'text-white/40'}`} />
                <p className={`text-sm font-light ${userType === 'seeker' ? 'text-white' : 'text-gray-400'}`}>
                  User
                </p>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setUserType('owner')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  userType === 'owner'
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <Building2 className={`w-6 h-6 mx-auto mb-2 ${userType === 'owner' ? 'text-white' : 'text-white/40'}`} />
                <p className={`text-sm font-light ${userType === 'owner' ? 'text-white' : 'text-gray-400'}`}>
                  Owner
                </p>
              </motion.button>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-light text-gray-300" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-light text-gray-300" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="+1 (555) 000-0000"
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-12 pr-12 h-12 rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="Create a strong password"
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
                className="w-full h-12 rounded-lg font-light text-black bg-white hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mt-6"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-400 font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-white hover:text-gray-300 transition-colors font-light"
                >
                  Sign in
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

export default Register;
