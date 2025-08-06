import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
    { name: 'Browse', href: '/browse', icon: Search },
    { name: 'Properties', href: '/properties', icon: Building2 },
  ];

  const userMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'My Properties', href: '/dashboard/my-properties', icon: Building2 },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Messages', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-medium border-b border-gray-200' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative">
                  <Home className="w-8 h-8 text-realestate-600" />
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-luxury-500" />
                </div>
                <span className="text-2xl font-display font-bold gradient-text">
                  Estospaces
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-link flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-realestate-600 bg-realestate-50' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-realestate-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-realestate-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-large border border-gray-200 py-2"
                      >
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = router.pathname === item.href;
                          
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                                isActive 
                                  ? 'text-realestate-600 bg-realestate-50' 
                                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 w-full transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button className="bg-realestate-600 hover:bg-realestate-700" asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
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
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-6 space-y-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = router.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive 
                          ? 'text-realestate-600 bg-realestate-50' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <div className="w-8 h-8 bg-realestate-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-realestate-600" />
                        </div>
                        <span className="text-base font-medium text-gray-700">
                          {user?.name || 'User'}
                        </span>
                      </div>
                    </div>

                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = router.pathname === item.href;
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base transition-colors ${
                            isActive 
                              ? 'text-realestate-600 bg-realestate-50' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}

                    <div className="border-t border-gray-200 pt-4">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-3 py-2 text-base text-red-600 hover:text-red-700 hover:bg-red-50 w-full rounded-md transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button className="w-full bg-realestate-600 hover:bg-realestate-700" asChild>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-8 h-8 text-realestate-400" />
                <span className="text-2xl font-display font-bold">Estospaces</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your gateway to premium real estate. Find the perfect property that matches your lifestyle and dreams.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse Properties</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Estospaces. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
