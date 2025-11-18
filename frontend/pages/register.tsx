import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles,
  Building2,
  CheckCircle,
  Crown,
  Shield,
  Phone
} from 'lucide-react';
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

  const benefits = [
    { icon: CheckCircle, text: 'Premium platform access' },
    { icon: Shield, text: 'Secure & encrypted data' },
    { icon: Crown, text: 'Award-winning experience' },
    { icon: Sparkles, text: 'Exclusive features' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #8F9D68 0%, #7B57CE 50%, #D4AF37 100%)'
      }}>
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255, 248, 235, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 70% 80%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)`
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ background: 'linear-gradient(135deg, #FFF8EB, #D4AF37)' }}
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: 'linear-gradient(135deg, #7B57CE, #8F9D68)' }}
          animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block text-white space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl"
                >
                  <Crown className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-5xl font-golden text-gradient-gold">EstoSpaces</h1>
                  <p className="text-yellow-200 text-sm font-premium tracking-wider">AWARD-WINNING PLATFORM</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-display leading-tight">
                Join Our <span className="text-gradient-gold font-golden">Premium Community</span>
              </h2>
              <p className="text-xl text-yellow-100 font-premium leading-relaxed">
                Experience the future with our award-winning platform trusted by thousands worldwide.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-3 glass-morphism rounded-2xl p-4 border border-yellow-400/20"
                >
                  <benefit.icon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <span className="text-lg font-premium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="glass-morphism rounded-3xl p-8 md:p-10 border border-yellow-400/20 shadow-2xl" style={{
              background: 'rgba(255, 248, 235, 0.95)',
              backdropFilter: 'blur(20px)'
            }}>
              {/* Mobile Logo */}
              <div className="md:hidden text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-golden text-gradient-gold">EstoSpaces</h1>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold mb-2" style={{ color: '#7B57CE' }}>
                  Create Account
                </h2>
                <p className="text-gray-600 font-premium">
                  Start your premium journey today
                </p>
              </div>

              {/* User Type Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.button
                  type="button"
                  onClick={() => setUserType('seeker')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    userType === 'seeker'
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 bg-white hover:border-yellow-200'
                  }`}
                >
                  <User className={`w-6 h-6 mx-auto mb-2 ${userType === 'seeker' ? 'text-yellow-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-premium font-semibold ${userType === 'seeker' ? 'text-yellow-600' : 'text-gray-600'}`}>
                    User
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setUserType('owner')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    userType === 'owner'
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-200'
                  }`}
                >
                  <Building2 className={`w-6 h-6 mx-auto mb-2 ${userType === 'owner' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-premium font-semibold ${userType === 'owner' ? 'text-purple-600' : 'text-gray-600'}`}>
                    Owner
                  </p>
                </motion.button>
              </div>

              {(error || localError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-red-50 border-2 border-red-200 p-4 mb-6"
                >
                  <div className="text-sm text-red-700 font-premium">{error || localError}</div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-premium font-semibold" style={{ color: '#7B57CE' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-600" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-12 h-12 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 font-premium"
                      placeholder="John Doe"
                      style={{ background: 'white' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-premium font-semibold" style={{ color: '#7B57CE' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-600" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-12 h-12 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 font-premium"
                      placeholder="your@email.com"
                      style={{ background: 'white' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-premium font-semibold" style={{ color: '#7B57CE' }}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-600" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-12 h-12 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 font-premium"
                      placeholder="+1 (555) 000-0000"
                      style={{ background: 'white' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-premium font-semibold" style={{ color: '#7B57CE' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-600" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-12 pr-12 h-12 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 font-premium"
                      placeholder="Create a strong password"
                      style={{ background: 'white' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-2xl font-premium font-semibold text-white shadow-lg transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #7B57CE 0%, #D4AF37 50%, #8F9D68 100%)',
                    boxShadow: '0 10px 25px -5px rgba(123, 87, 206, 0.4)'
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-gray-600 font-premium">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="font-semibold hover:underline"
                    style={{ color: '#7B57CE' }}
                  >
                    Sign in
                  </Link>
                </p>
                <Link 
                  href="/" 
                  className="inline-flex items-center space-x-2 text-sm font-premium hover:underline"
                  style={{ color: '#8F9D68' }}
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
