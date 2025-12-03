'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Lenis from 'lenis';
import { Mail, Phone, MapPin, Clock, ChevronDown, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@estospaces.com',
      link: 'mailto:hello@estospaces.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Luxury Avenue, New York, NY 10001',
      link: '#'
    },
    {
      icon: Clock,
      title: 'Hours',
      value: 'Mon - Fri: 9AM - 6PM EST',
      link: '#'
    }
  ];

  return (
    <>
      <Head>
        <title>Contact - EstoSpaces</title>
        <meta name="description" content="Get in touch with EstoSpaces" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="relative bg-black text-white overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-24 bg-gradient-to-br from-black via-gray-950 to-black">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&h=1080&fit=crop" alt="Contact Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-block mb-8">
                <div className="px-6 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                  <span className="text-white/80 text-sm tracking-widest font-light" style={{ fontFamily: 'Inter' }}>GET IN TOUCH</span>
                </div>
              </motion.div>

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-light mb-8 leading-tight tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="block">
                  Let's
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  Connect
                </motion.span>
              </h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                We're here to answer your questions and help you find your perfect property
              </motion.p>
            </motion.div>

            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <ChevronDown className="w-6 h-6 text-white/60" />
            </motion.div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="relative py-32 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.link}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="group p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10 transition-all duration-500"
                  >
                    <Icon className="w-8 h-8 mb-4 text-white/80 group-hover:text-white transition-colors" />
                    <h3 className="text-lg font-light mb-2 text-white" style={{ fontFamily: 'Playfair Display' }}>
                      {info.title}
                    </h3>
                    <p className="text-gray-400 font-light text-sm" style={{ fontFamily: 'Cormorant Garamond' }}>
                      {info.value}
                    </p>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="relative py-32 bg-black">
          <div className="container mx-auto px-6 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                Send us a Message
              </h2>
              <p className="text-gray-400 font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                We'll get back to you within 24 hours
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors font-light"
                  >
                    <option value="">Select a subject</option>
                    <option value="property-inquiry">Property Inquiry</option>
                    <option value="investment">Investment Opportunity</option>
                    <option value="services">Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors font-light resize-none"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-8 py-4 bg-white text-black rounded-lg font-light tracking-wide hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                <Send className="w-5 h-5" />
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)' }} />
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-6xl md:text-7xl font-light mb-8 tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                Ready to Explore
              </h2>
              <p className="text-gray-300 text-xl font-light mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Cormorant Garamond' }}>
                Browse our collection of exceptional properties
              </p>

              <Link href="/browse">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 bg-white text-black rounded-lg font-light tracking-wide hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Cormorant Garamond' }}>
                  View Properties
                </motion.button>
              </Link>
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

export default Contact;
