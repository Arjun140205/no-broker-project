'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Lenis from 'lenis';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

const About = () => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const values = [
    {
      title: 'Excellence',
      description: 'We maintain the highest standards in every aspect of our service, from property curation to client relations.'
    },
    {
      title: 'Discretion',
      description: 'Your privacy and confidentiality are paramount. We handle all matters with utmost professionalism and care.'
    },
    {
      title: 'Expertise',
      description: 'Our team brings decades of combined experience in luxury real estate and property management.'
    },
    {
      title: 'Innovation',
      description: 'We embrace modern technology and forward-thinking approaches to enhance your experience.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Properties Managed' },
    { number: '15+', label: 'Years Experience' },
    { number: '1000+', label: 'Satisfied Clients' },
    { number: '50M+', label: 'Portfolio Value' }
  ];

  return (
    <>
      <Head>
        <title>About - EstoSpaces</title>
        <meta name="description" content="Learn about EstoSpaces and our commitment to luxury real estate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="relative bg-black text-white overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-24 bg-gradient-to-br from-black via-gray-950 to-black">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&h=1080&fit=crop" alt="About Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-block mb-8">
                <div className="px-6 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                  <span className="text-white/80 text-sm tracking-widest font-light" style={{ fontFamily: 'Inter' }}>OUR STORY</span>
                </div>
              </motion.div>

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-light mb-8 leading-tight tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="block">
                  About
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  EstoSpaces
                </motion.span>
              </h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                Redefining luxury real estate through expertise, discretion, and uncompromising excellence
              </motion.p>
            </motion.div>

            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <ChevronDown className="w-6 h-6 text-white/60" />
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative py-32 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop" alt="EstoSpaces" className="rounded-lg" />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                  Our Journey
                </h2>
                <p className="text-gray-300 font-light text-lg mb-6 leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Founded with a vision to transform the luxury real estate experience, EstoSpaces has become synonymous with excellence and discretion. Our journey began with a simple belief: that exceptional properties deserve exceptional service.
                </p>
                <p className="text-gray-400 font-light text-lg leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Over the years, we've cultivated relationships with the world's most discerning clients and curated a portfolio of the finest properties. Every transaction, every interaction, reflects our commitment to perfection.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-32 bg-black">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl md:text-6xl font-light mb-4 text-white" style={{ fontFamily: 'Playfair Display' }}>
                    {stat.number}
                  </div>
                  <p className="text-gray-400 font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative py-32 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
              <h2 className="text-6xl md:text-7xl font-light mb-6 tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                Our Values
              </h2>
              <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto" style={{ fontFamily: 'Cormorant Garamond' }}>
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10 transition-all duration-500"
                >
                  <h3 className="text-2xl font-light mb-4 text-white" style={{ fontFamily: 'Playfair Display' }}>
                    {value.title}
                  </h3>
                  <p className="text-gray-400 font-light leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                    {value.description}
                  </p>
                </motion.div>
              ))}
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
                Join Our Community
              </h2>
              <p className="text-gray-300 text-xl font-light mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Cormorant Garamond' }}>
                Experience the EstoSpaces difference
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 bg-white text-black rounded-lg font-light tracking-wide hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Get in Touch
                  </motion.button>
                </Link>
                <Link href="/browse">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 border-2 border-white text-white rounded-lg font-light tracking-wide hover:bg-white/10 transition-colors" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Explore Properties
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

export default About;
