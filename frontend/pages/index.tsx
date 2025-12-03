'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Lenis from 'lenis';
import { MapPin, Bed, Bath, Square, ArrowUpRight, ChevronDown } from 'lucide-react';

const Home = () => {

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', alt: 'Luxury Villa Exterior', span: 'md:col-span-2 md:row-span-2' },
    { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', alt: 'Modern Villa Design' },
    { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', alt: 'Beachfront Property' },
    { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop', alt: 'Contemporary Villa', span: 'md:col-span-2' },
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', alt: 'Luxury Outdoor Space' },
    { src: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop', alt: 'Mountain Villa View' },
  ];

  const properties = [
    { id: '1', title: 'Penthouse Essence', location: 'Manhattan Heights', price: 18500, bedrooms: 4, bathrooms: 3, area: 3800, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop' },
    { id: '2', title: 'Coastal Sanctuary', location: 'Malibu Shores', price: 22000, bedrooms: 6, bathrooms: 5, area: 5200, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop' },
    { id: '3', title: 'Alpine Retreat', location: 'Mountain Peak', price: 12000, bedrooms: 5, bathrooms: 4, area: 4500, image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&h=800&fit=crop' },
  ];

  return (
    <>
      <Head>
        <title>EstoSpaces - Curated Estates</title>
        <meta name="description" content="Discover exceptional properties with refined elegance" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="relative bg-black text-white overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-24 bg-gradient-to-br from-black via-gray-950 to-black">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop" alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-block mb-8">
                <div className="px-6 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                  <span className="text-white/80 text-sm tracking-widest font-light" style={{ fontFamily: 'Inter' }}>DISCOVER REFINED ELEGANCE</span>
                </div>
              </motion.div>

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-light mb-8 leading-tight tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="block">
                  Exceptional
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  Properties
                </motion.span>
              </h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
                Curated estates that embody timeless sophistication and refined living
              </motion.p>
            </motion.div>

            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <ChevronDown className="w-6 h-6 text-white/60" />
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="relative py-32 bg-black">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
              <h2 className="text-6xl md:text-7xl font-light mb-6 tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                Curated Collection
              </h2>
              <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto" style={{ fontFamily: 'Cormorant Garamond' }}>
                Explore our finest properties through stunning imagery
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-lg bg-gray-900 cursor-pointer ${image.span || ''}`}
                >
                  <motion.img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white font-light text-lg" style={{ fontFamily: 'Cormorant Garamond' }}>
                      {image.alt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="relative py-32 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-24">
              <h2 className="text-6xl md:text-7xl font-light mb-6 tracking-tight text-white" style={{ fontFamily: 'Playfair Display' }}>
                Featured Properties
              </h2>
              <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto" style={{ fontFamily: 'Cormorant Garamond' }}>
                Handpicked properties that define contemporary elegance
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <motion.div key={property.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.1 }} className="group relative">
                  <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-gray-900">
                    <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.8 }} src={property.image} alt={property.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-light mb-2 text-white" style={{ fontFamily: 'Playfair Display' }}>
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="font-light" style={{ fontFamily: 'Cormorant Garamond' }}>{property.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-400 border-t border-gray-800 pt-4">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-white/60" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-white/60" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="w-4 h-4 text-white/60" />
                        <span>{property.area.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <div className="text-gray-500 text-sm font-light mb-1">Starting from</div>
                        <div className="text-3xl font-light text-white" style={{ fontFamily: 'Playfair Display' }}>
                          ${property.price.toLocaleString()}
                          <span className="text-sm text-gray-500">/mo</span>
                        </div>
                      </div>
                      <Link href={`/properties/${property.id}`}>
                        <motion.button whileHover={{ scale: 1.1, rotate: 45 }} whileTap={{ scale: 0.9 }} className="relative group/btn w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-16">
              <Link href="/browse">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-12 py-4 bg-white/10 text-white rounded-lg font-light tracking-wide hover:bg-white/20 transition-colors border border-white/20" style={{ fontFamily: 'Cormorant Garamond' }}>
                  View All Properties
                </motion.button>
              </Link>
            </motion.div>
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
                Begin Your Journey
              </h2>
              <p className="text-gray-300 text-xl font-light mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Cormorant Garamond' }}>
                Discover properties that transcend expectations
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/register">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 bg-white text-black rounded-lg font-light tracking-wide hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Cormorant Garamond' }}>
                    Get Started
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

        {/* Modern Footer */}
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

export default Home;
