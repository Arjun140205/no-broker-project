import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Sun, 
  Moon, 
  Home, 
  Search, 
  User, 
  Settings,
  Menu,
  X,
  Crown,
  Gem,
  Diamond,
  Sparkles,
  Shield,
  Award,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface PremiumLayoutProps {
  children: React.ReactNode;
}

const PremiumLayoutNew: React.FC<PremiumLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Properties', icon: Search },
    { href: '/about', label: 'About', icon: Crown },
    { href: '/contact', label: 'Contact', icon: Gem },
  ];

  return (
    <div className="min-h-screen" style={{ 
      background: `linear-gradient(135deg, var(--secondary-oldlace) 0%, var(--neutral-white) 50%, var(--secondary-oldlace-dark) 100%)` 
    }}>
      {/* Award-Winning Navigation */}
      <nav className="nav-luxury glass-morphism border-b luxury-shadow" 
           style={{ borderColor: 'var(--primary-iris-ultra-light)' }}>
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20">
            {/* Premium Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center luxury-shadow micro-glow"
                style={{ 
                  background: `linear-gradient(135deg, var(--primary-iris) 0%, var(--tertiary-moss) 100%)` 
                }}
              >
                <Diamond className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gradient-iris">
                  EstoSpaces
                </h1>
                <p className="text-xs font-premium" style={{ color: 'var(--tertiary-moss-dark)' }}>
                  Award-Winning Luxury
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="nav-link-luxury flex items-center space-x-2 font-premium"
                    style={{ color: 'var(--neutral-dark)' }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Premium Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 micro-glow"
                style={{ 
                  backgroundColor: 'var(--primary-iris-ultra-light)',
                  color: 'var(--primary-iris)'
                }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" style={{ color: 'var(--tertiary-moss)' }} />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Auth Actions */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link href="/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl font-premium luxury-shadow micro-glow"
                      style={{ 
                        background: `linear-gradient(135deg, var(--primary-iris) 0%, var(--tertiary-moss) 100%)`,
                        color: 'white'
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{user?.name || 'Dashboard'}</span>
                    </motion.div>
                  </Link>
                  <button
                    onClick={logout}
                    className="font-premium transition-colors hover:scale-105"
                    style={{ color: 'var(--tertiary-moss-dark)' }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 font-premium transition-colors"
                      style={{ color: 'var(--tertiary-moss-dark)' }}
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="btn-luxury px-6 py-2 rounded-xl font-premium"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--primary-iris-ultra-light)',
                  color: 'var(--primary-iris)'
                }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isMobileMenuOpen ? 1 : 0,
              height: isMobileMenuOpen ? 'auto' : 0,
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'var(--primary-iris-ultra-light)' }}
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 micro-slide"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ color: 'var(--neutral-dark)' }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: 'var(--tertiary-moss)' }} />
                    <span className="font-premium">
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Award-Winning Footer */}
      <footer style={{ 
        background: `linear-gradient(135deg, var(--neutral-charcoal) 0%, var(--neutral-dark) 50%, var(--neutral-charcoal) 100%)` 
      }}>
        <div className="container-luxury section-padding-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Premium Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center luxury-shadow"
                     style={{ 
                       background: `linear-gradient(135deg, var(--primary-iris) 0%, var(--tertiary-moss) 100%)` 
                     }}>
                  <Diamond className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-gradient-iris">
                    EstoSpaces
                  </h3>
                  <p className="text-sm font-premium" style={{ color: 'var(--secondary-oldlace)' }}>
                    Award-Winning Luxury
                  </p>
                </div>
              </div>
              <p className="leading-relaxed max-w-md font-premium" 
                 style={{ color: 'var(--secondary-oldlace-dark)' }}>
                Discover extraordinary properties and experience the pinnacle of luxury living 
                with our award-winning platform, recognized by CSS Design Awards and featured 
                in premium design showcases worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-display font-semibold mb-4" 
                  style={{ color: 'var(--secondary-oldlace)' }}>
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="transition-colors cursor-pointer inline-block font-premium micro-slide"
                        style={{ color: 'var(--tertiary-moss-light)' }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-display font-semibold mb-4" 
                  style={{ color: 'var(--secondary-oldlace)' }}>
                Contact
              </h4>
              <div className="space-y-2 font-premium" 
                   style={{ color: 'var(--tertiary-moss-light)' }}>
                <p>+1 (555) 123-4567</p>
                <p>luxury@estospaces.com</p>
                <p>New York, NY 10001</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center"
               style={{ borderColor: 'var(--tertiary-moss-dark)' }}>
            <p className="text-sm font-premium" 
               style={{ color: 'var(--tertiary-moss-light)' }}>
              © 2024 EstoSpaces. All rights reserved. Award-winning design.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" 
                    className="text-sm transition-colors font-premium micro-slide"
                    style={{ color: 'var(--tertiary-moss-light)' }}>
                Privacy Policy
              </Link>
              <Link href="/terms" 
                    className="text-sm transition-colors font-premium micro-slide"
                    style={{ color: 'var(--tertiary-moss-light)' }}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumLayoutNew;