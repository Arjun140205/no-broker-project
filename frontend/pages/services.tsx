'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Lenis from 'lenis';
import { Home, Users, MapPin, Shield, Zap, Award, ArrowUpRight, ChevronDown } from 'lucide-react';

const Services = () => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const services = [
    {
      icon: Home,
      title: 'Property Management',
      description: 'Comprehensive management of your luxury properties with meticulous attention to detail and premium service standards.',
      features: ['24/7 Monitoring', 'Maintenance Coordination', 'Guest Relations']
    },
    {
      icon: Users,
      title: 'Concierge Services',
      description: 'Personalized concierge support tailored to your lifestyle needs and preferences.',
      features: ['Personal Assistance', 'Event Planning', 'Travel Arrangements']
    },
    {
      icon: MapPin,
      title: 'Location Scouting',
      description: 'Expert guidance in discovering the perfect property in your desired location.',
      features: ['Market Analysis', 'Site Visits', 'Neighborhood Insights']
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Discreet and secure handling of all transactions with utmost confidentiality.',
      features: ['Privacy Protection', 'Secure Transactions', 'Legal Compliance']
    },
    {
      icon: Zap,
      title: 'Smart Home Integration',
      description: 'State-of-the-art smart home technology for modern luxury living.',
      features: ['Automation Systems', 'Energy Management', 'Tech Support']
    },
    {
      icon: Award,
      title: 'Investment Advisory',
      description: 'Strategic guidance on property investment and portfolio optimization.',
      features: ['Market Trends', 'ROI Analysis', 'Portfolio Planning']
    }
  ];

  return (
    <>
      <Head>
        <title>Services - EstoSpaces</title>
        <meta name="description" content="Premium services for luxury property management and investment" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="relative bg-black text-white overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-24 bg-gradient-to-br from-black via-gray-950 to-black">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&h=1080&fit=crop" alt="Services Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-block mb-8">
                <div className="px-6 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                  <span className="text-white/80 text-sm tracking-widest font-light" style={{ fontFamily: 'Inter' }}>PREMIUM SERVICES</span>
                </div>
              </motion.div>

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-light mb-8 leading-tight tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="block">
                  Exceptional
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  Services
                </motion.span>
              </h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                Tailored solutions for your luxury lifestyle and investment needs
              </motion.p>
            </motion.div>

            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <ChevronDown className="w-6 h-6 text-white/60" />
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="relative py-32 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="group relative p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10 transition-all duration-500"
                  >
                    <div className="mb-6">
                      <Icon className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
                    </div>

                    <h3 className="text-2xl font-light mb-4 text-white" style={{ fontFamily: 'Playfair Display' }}>
                      {service.title}
                    </h3>

                    <p className="text-gray-400 font-light mb-6 leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                      {service.description}
                    </p>

                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-500 font-light flex items-center gap-2">
                          <span className="w-1 h-1 bg-white/40 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 bg-black overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)' }} />
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-6xl md:text-7xl font-light mb-8 tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                Ready to Experience Excellence
              </h2>
              <p className="text-gray-300 text-xl font-light mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Cormorant Garamond' }}>
                Let us help you discover and manage your perfect property
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 bg-white text-black rounded-lg font-light tracking-wide hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Get in Touch
                  </motion.button>
                </Link>
                <Link href="/browse">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 border-2 border-white text-white rounded-lg font-light tracking-wide hover:bg-white/10 transition-colors" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Browse Properties
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-20 bg-black border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                  EstoSpaces
                </h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Curated estates for the discerning individual
                </p>
              </div>
              {[
                { title: 'Company', links: ['About', 'Services', 'Contact'] },
                { title: 'Properties', links: ['Browse', 'Featured', 'New'] },
                { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="font-light mb-6 tracking-wide text-sm text-white" style={{ fontFamily: 'Playfair Display' }}>
                    {col.title}
                  </h4>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-gray-400 font-light text-sm hover:text-white transition-colors" style={{ fontFamily: 'Cormorant Garamond' }}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-gray-500 font-light text-sm">
              © 2024 EstoSpaces. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Services;
