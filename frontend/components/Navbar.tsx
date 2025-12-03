import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/browse', label: 'Explore' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-700 ${
        isScrolled
          ? 'bg-black/60 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <span className="text-white font-light text-lg tracking-tight" style={{ fontFamily: 'Playfair Display' }}>E</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-light text-xl tracking-wide" style={{ fontFamily: 'Playfair Display' }}>EstoSpaces</h1>
                <p className="text-white/50 text-xs tracking-widest font-light" style={{ fontFamily: 'Inter' }}>CURATED ESTATES</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="relative group cursor-pointer"
                >
                  <span className="text-white/70 font-light text-sm tracking-wide group-hover:text-white transition-colors duration-300" style={{ fontFamily: 'Cormorant Garamond' }}>
                    {link.label}
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-white/30 to-white/10 origin-left"
                  />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group px-6 py-2.5 text-sm font-light tracking-wide text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
                  <div className="relative bg-white/10 rounded-lg px-6 py-2.5 border border-white/20 group-hover:border-white/40 transition-all duration-300" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Dashboard
                  </div>
                </motion.button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <motion.span
                    whileHover={{ y: -2 }}
                    className="text-white/70 font-light text-sm tracking-wide hover:text-white transition-colors duration-300 cursor-pointer" style={{ fontFamily: 'Cormorant Garamond' }}
                  >
                    Sign In
                  </motion.span>
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group px-6 py-2.5 text-sm font-light tracking-wide text-white"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
                    <div className="relative bg-white/10 rounded-lg px-6 py-2.5 border border-white/20 group-hover:border-white/40 transition-all duration-300" style={{ fontFamily: 'Cormorant Garamond' }}>
                      Explore
                    </div>
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white/70 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden"
        >
          <div className="px-6 py-8 space-y-6 border-t border-white/10 bg-black/40 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="text-white/70 font-light text-sm tracking-wide hover:text-white transition-colors cursor-pointer" style={{ fontFamily: 'Cormorant Garamond' }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
