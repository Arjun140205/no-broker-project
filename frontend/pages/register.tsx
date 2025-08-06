import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Home, 
  ArrowRight, 
  Sparkles,
  Building2,
  CheckCircle
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
  
  // Redirect if user is already logged in
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
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setLocalError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const benefits = [
    'Access to premium property listings',
    'Direct communication with property owners',
    'Secure booking and payment system',
    '24/7 customer support',
    'Verified property listings',
    'Advanced search and filtering'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-realestate-50 via-white to-luxury-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-realestate-200 rounded-full opacity-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-luxury-200 rounded-full opacity-20"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div className="relative">
                    <Home className="w-12 h-12 text-realestate-600" />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-luxury-500" />
                  </div>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-display font-bold gradient-text mb-4">
                  Join Estospaces
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-lg">
                  Create your account and start your journey to finding the perfect property or listing your own.
                </p>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Why choose Estospaces?
                  </h3>
                  
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-large">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-900">
                    Create Your Account
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Join thousands of users who found their perfect home
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {(error || localError) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-red-50 border border-red-200 p-4"
                    >
                      <div className="text-sm text-red-700">{error || localError}</div>
                    </motion.div>
                  )}

                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      I want to:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserType('seeker')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          userType === 'seeker'
                            ? 'border-realestate-500 bg-realestate-50 text-realestate-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Home className="w-5 h-5" />
                          <span className="font-medium">Find Properties</span>
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setUserType('owner')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          userType === 'owner'
                            ? 'border-realestate-500 bg-realestate-50 text-realestate-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5" />
                          <span className="font-medium">List Properties</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number (Optional)
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-10"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-realestate-500 to-realestate-600 hover:from-realestate-600 hover:to-realestate-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <Link 
                        href="/login" 
                        className="font-medium text-realestate-600 hover:text-realestate-700 transition-colors"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
