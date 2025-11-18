import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Home as HomeIcon, Search, Award, Gem, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SharedNavigation = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="nav-luxury">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20">
          {/* Premium Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center luxury-shadow micro-glow bg-gradient-to-br from-yellow-400 to-yellow-600"
            >
              <Crown className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-golden font-bold text-gradient-gold">
                EstoSpaces
              </h1>
              <p className="text-xs font-premium text-yellow-600">
                Award-Winning Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { href: '/', label: 'Home', icon: HomeIcon },
              { href: '/services', label: 'Services', icon: Search },
              { href: '/about', label: 'About', icon: Award },
              { href: '/contact', label: 'Contact', icon: Gem },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="nav-link-luxury flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-premium luxury-shadow micro-glow bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user?.name || 'Dashboard'}</span>
                  </motion.div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 font-premium transition-colors text-yellow-700 hover:text-yellow-800"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="btn-gold px-6 py-2 rounded-xl font-premium"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SharedNavigation;
