import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Heart,
  Building2,
  MessageCircle,
  Calendar,
  ChevronDown,
  Sun,
  Moon,
  Plus,
  Crown,
  Shield,
  Award,
  Users,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Gem
} from 'lucide-react';

interface PremiumLayoutProps {
  children: React.ReactNode;
}

const PremiumLayout: React.FC<PremiumLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [20, 40]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Properties', href: '/browse', icon: Search },
    { name: 'Locations', href: '/locations', icon: MapPin },
    { name: 'About', href: '/about', icon: Award },
  ];

  const userMenuItems = user?.role === 'owner' ? [
    { name: 'Owner Dashboard', href: '/dashboard/owner', icon: Building2 },
    { name: 'My Properties', href: '/dashboard/owner/properties', icon: Home },
    { name: 'Add Property', href: '/dashboard/owner/add-property', icon: Plus },
    { name: 'Bookings', href: '/dashboard/owner/bookings', icon: Calendar },
    { name: 'Messages', href: '/dashboard/owner/chat', icon: MessageCircle },
    { name: 'Analytics', href: '/dashboard/owner/analytics', icon: TrendingUp },
    { name: 'Profile', href: '/dashboard/owner/profile', icon: User },
    { name: 'Settings', href: '/dashboard/owner/settings', icon: Settings },
  ] : [
    { name: 'User Dashboard', href: '/dashboard/user', icon: User },
    { name: 'My Bookings', href: '/dashboard/user/bookings', icon: Calendar },
    { name: 'Messages', href: '/dashboard/user/chat', icon: MessageCircle },
    { name: 'Favorites', href: '/dashboard/user/favorites', icon: Heart },
    { name: 'Profile', href: '/dashboard/user/profile', icon: User },
    { name: 'Settings', href: '/dashboard/user/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Premium Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{ 
          backdropFilter: `blur(${navBlur}px)`,
          WebkitBackdropFilter: `blur(${navBlur}px)`,
        }}
        className={`nav-luxury transition-all duration-700 ${
          scrolled 
            ? 'shadow-2xl border-b border-white/20' 
            : 'bg-transparent'
        }`}
      >
        <motion.div 
          style={{ opacity: navOpacity }}
          className="absolute inset-0 bg-white/10"
        />
        
        <div className="container-luxury relative z-10">
          <div className="flex justify-between items-center h-20">
            {/* Luxury Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4"
            >
              <Link href="/" className="flex items-center space-x-4">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-2 border-gold-400/30 rounded-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-gold-400" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-luxury font-bold text-gradient-luxury">
                    EstoSpaces
                  </span>
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-xs text-slate-500 -mt-1 font-medium tracking-wider"
                  >
                    LUXURY ESTATES
                  </motion.span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href;
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Link
                      href={item.href}
                      className={`nav-link-luxury ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div> 
           {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-3 rounded-2xl glass-morphism hover:bg-white/20 transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5 text-gold-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5 text-blue-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-2xl glass-morphism hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-luxury">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      {user?.role === 'owner' && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center"
                        >
                          <Crown className="w-2 h-2 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-white">
                        {user?.name || 'User'}
                      </span>
                      <span className="text-xs text-white/70 capitalize flex items-center">
                        {user?.role === 'owner' && <Gem className="w-3 h-3 mr-1 text-gold-400" />}
                        {user?.role || 'Member'}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-white/70" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute right-0 mt-4 w-80 glass-morphism rounded-3xl shadow-2xl border border-white/20 py-6 overflow-hidden"
                      >
                        {/* User Info Header */}
                        <div className="px-6 pb-6 border-b border-white/10">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-luxury">
                                <User className="w-7 h-7 text-white" />
                              </div>
                              {user?.role === 'owner' && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                                  <Crown className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-white text-lg">{user?.name}</p>
                              <p className="text-sm text-white/70">{user?.email}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Shield className="w-3 h-3 text-emerald-400" />
                                <span className="text-xs text-emerald-400 capitalize font-medium">
                                  {user?.role} Account
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {userMenuItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = router.pathname === item.href;
                            
                            return (
                              <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                              >
                                <Link
                                  href={item.href}
                                  className={`flex items-center space-x-3 px-6 py-3 text-sm transition-colors ${
                                    isActive 
                                      ? 'text-gold-400 bg-white/10' 
                                      : 'text-white/80 hover:text-white'
                                  }`}
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  <Icon className="w-4 h-4" />
                                  <span className="font-medium">{item.name}</span>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                        
                        {/* Logout */}
                        <div className="border-t border-white/10 pt-2">
                          <motion.button
                            whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-6 py-3 text-sm text-red-400 hover:text-red-300 w-full transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 text-white/80 hover:text-white font-semibold rounded-2xl transition-colors duration-300"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-luxury px-8 py-3 font-semibold"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>      
      {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-xl glass-morphism"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gold-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-600" />
                )}
              </motion.button>
              
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl glass-morphism text-white hover:bg-white/20"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden glass-morphism border-t border-white/10"
            >
              <div className="container-luxury py-6 space-y-4">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = router.pathname === item.href;
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`nav-link-luxury ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center space-x-3 px-4 py-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user?.name}</p>
                          <p className="text-sm text-white/70 capitalize">{user?.role}</p>
                        </div>
                      </div>
                    </div>

                    {userMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = router.pathname === item.href;
                      
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={`nav-link-luxury ${isActive ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}

                    <div className="border-t border-white/10 pt-4">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-base text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full rounded-2xl transition-colors font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <Link href="/login">
                      <button className="w-full text-left px-4 py-3 text-white/80 hover:text-white font-semibold rounded-2xl transition-colors">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="w-full btn-luxury text-center font-semibold">
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>   
   {/* Luxury Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-gold-400/20 to-orange-600/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container-luxury relative z-10 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-2 border-gold-400/30 rounded-2xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-gold-400" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-luxury font-bold text-gradient-gold">EstoSpaces</span>
                    <p className="text-sm text-gray-300 font-light tracking-wider">LUXURY REAL ESTATE</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed max-w-md font-light">
                  Your gateway to the world's most exclusive properties. Experience luxury living 
                  with our curated collection of premium real estate and white-glove service.
                </p>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Verified Properties</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Award className="w-4 h-4 text-gold-400" />
                    <span>Award Winning</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Global Network</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Explore</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Luxury Properties', href: '/browse' },
                  { name: 'Prime Locations', href: '/locations' },
                  { name: 'Investment Opportunities', href: '/investments' },
                  { name: 'Market Insights', href: '/insights' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' }
                ].map((link, index) => (
                  <motion.li
                    key={link.name}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-light"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span className="font-light">+1 (555) 123-LUXURY</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 text-gold-400" />
                  <span className="font-light">arjunbirsingh1699@gmail.com</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span className="font-light">Manhattan, New York</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex space-x-3">
                  {['Facebook', 'Instagram', 'LinkedIn'].map((social, index) => (
                    <motion.button
                      key={social}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                    >
                      <span className="text-xs font-medium text-white">{social[0]}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-gray-400 text-sm font-light">
              © 2024 EstoSpaces. All rights reserved. Luxury redefined.
            </p>
            <div className="flex items-center space-x-8 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>50,000+ Elite Clients</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Building2 className="w-4 h-4" />
                <span>25,000+ Luxury Properties</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>150+ Global Cities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumLayout;