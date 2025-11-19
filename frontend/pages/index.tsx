import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Property } from '../types';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Bath,
  Bed,
  Square,
  Crown,
  Sparkles,
  ChevronDown,
  Play,
  Award,
  Shield,
  Globe
} from 'lucide-react';

// Featured properties
const featuredProperties: Property[] = [
  {
    id: '1',
    title: 'Skyline Penthouse',
    description: 'Breathtaking views from this architectural masterpiece',
    price: 18500,
    location: 'Manhattan, New York',
    city: 'New York',
    state: 'New York',
    type: 'flat',
    category: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area: 3800,
    furnished: 'furnished',
    amenities: ['Rooftop', 'Concierge', 'Gym'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop'],
    available: true,
    ownerId: 'owner1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Ocean Villa',
    description: 'Private beachfront estate with infinity pool',
    price: 22000,
    location: 'Malibu, California',
    city: 'Malibu',
    state: 'California',
    type: 'house',
    category: 'rent',
    bedrooms: 6,
    bathrooms: 5,
    area: 5200,
    furnished: 'furnished',
    amenities: ['Beach', 'Pool', 'Spa'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop'],
    available: true,
    ownerId: 'owner2',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: '3',
    title: 'Mountain Sanctuary',
    description: 'Secluded retreat with panoramic mountain vistas',
    price: 12000,
    location: 'Aspen, Colorado',
    city: 'Aspen',
    state: 'Colorado',
    type: 'house',
    category: 'rent',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    furnished: 'furnished',
    amenities: ['Fireplace', 'Hot Tub', 'Ski Access'],
    images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&h=800&fit=crop'],
    available: true,
    ownerId: 'owner3',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  }
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Smooth scroll progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Initialize Lenis smooth scroll
  useEffect(() => {
    let lenis: any;
    
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      // Hero text reveal
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3
      });

      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.6
      });

      // Parallax images
      gsap.utils.toArray('.parallax-image').forEach((image: any) => {
        gsap.to(image, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Fade in sections
      gsap.utils.toArray('.fade-in-section').forEach((section: any) => {
        gsap.from(section, {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    };

    initGSAP();
  }, []);

  const [heroRef] = useInView({ threshold: 0.3, triggerOnce: true });
  const [featuredRef, featuredInView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <>
      <Head>
        <title>EstoSpaces - Luxury Real Estate & Premium Properties</title>
        <meta name="description" content="Discover extraordinary luxury properties worldwide. Award-winning real estate platform featuring exclusive villas, penthouses, and premium homes in prestigious locations." />
        <meta name="keywords" content="luxury real estate, premium properties, luxury homes, penthouses, villas, exclusive properties" />
        <meta property="og:title" content="EstoSpaces - Luxury Real Estate & Premium Properties" />
        <meta property="og:description" content="Discover extraordinary luxury properties worldwide" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://estospaces.com" />
      </Head>

      <div ref={containerRef} className="relative bg-[#0A0A0A] text-white overflow-hidden">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 origin-left z-50"
          style={{ scaleX }}
        />

      {/* Hero Section - Cinematic */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Layer - z-0 */}
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.6, 0.01, 0.05, 0.95] }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop"
            alt="Luxury Property Hero"
            className="w-full h-full object-cover brightness-50"
          />
        </motion.div>
        
        {/* Dark Overlay - z-[1] */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
        
        {/* Animated Gradient Overlay - z-[2] */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 z-[2]"
        />

        {/* Hero Content - z-[10] */}
        <div ref={heroRef} className="relative z-[10] container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-sm tracking-[0.3em] uppercase text-amber-500 font-light">
                Luxury Real Estate
              </span>
            </div>
          </motion.div>

          <h1 className="hero-title text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight px-4">
            <span className="block text-white drop-shadow-2xl" style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              Extraordinary
            </span>
            <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl" 
                  style={{ fontFamily: "'Playfair Display', serif", filter: 'drop-shadow(0 4px 20px rgba(251, 191, 36, 0.3))' }}>
              Living Spaces
            </span>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12 font-light leading-relaxed px-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Discover a curated collection of the world's most prestigious properties,
            <br className="hidden md:block" />
            where architectural excellence meets unparalleled luxury
          </p>

          {/* Search Bar - Premium Design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative group px-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                    <input
                      type="text"
                      placeholder="Location, City, or Neighborhood"
                      className="w-full bg-white/5 border border-white/10 rounded-xl outline-none pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:bg-white/10 focus:border-amber-500/50 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-medium group/btn shadow-lg hover:shadow-amber-500/50 transition-all">
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                      <Search className="w-5 h-5" />
                      Explore
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll Indicator - z-[11] */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[11]"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs tracking-widest uppercase text-gray-400">Scroll</span>
              <ChevronDown className="w-6 h-6 text-amber-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties - Magazine Layout */}
      <section ref={featuredRef} className="relative py-24 md:py-32 bg-gradient-to-b from-black via-zinc-900 to-black">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="fade-in-section text-center mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm tracking-[0.2em] uppercase text-amber-400 font-medium">Featured Collection</span>
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-white px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Signature Properties
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light px-4">
              Handpicked residences that redefine luxury living
            </p>
          </div>

          {/* Properties Grid - Staggered Layout */}
          <div className="space-y-20 md:space-y-32">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`fade-in-section grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <Link href={`/properties/${property.id}`}>
                  <div className={`relative group cursor-pointer ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="relative overflow-hidden rounded-3xl aspect-[4/3]">
                      {/* Base Image - z-0 */}
                      <img
                        src={property.images[0]}
                        alt={`${property.title} - ${property.location}`}
                        className="parallax-image absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 z-0"
                      />
                      
                      {/* Hover Gradient Overlay - z-[1] */}
                      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Play Button - z-[2] */}
                      <div className="absolute inset-0 z-[2] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-black/20 backdrop-blur-sm">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>

                      {/* Featured Badge - z-[3] */}
                      <div className="absolute top-6 right-6 z-[3]">
                        <div className="px-4 py-2 rounded-full bg-amber-500 backdrop-blur-sm shadow-lg">
                          <span className="text-xs font-medium tracking-wider uppercase text-white">Featured</span>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Element - Behind card */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-amber-500/20 rounded-3xl -z-[1]"></div>
                  </div>
                </Link>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''} px-4 md:px-0`}>
                  <div className="space-y-6">
                    {/* Property Type */}
                    <div className="flex items-center gap-3 text-amber-400">
                      <div className="w-12 h-px bg-amber-400"></div>
                      <span className="text-sm tracking-[0.2em] uppercase font-medium">
                        {property.type === 'house' ? 'Villa' : 'Penthouse'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-5 h-5 text-amber-400" />
                      <span className="text-base md:text-lg">{property.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-base md:text-lg text-gray-300 leading-relaxed font-light">
                      {property.description}
                    </p>

                    {/* Details */}
                    <div className="flex items-center gap-6 md:gap-8 text-sm">
                      <div className="flex items-center gap-2">
                        <Bed className="w-5 h-5 text-amber-400" />
                        <span className="text-gray-200">{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-5 h-5 text-amber-400" />
                        <span className="text-gray-200">{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="w-5 h-5 text-amber-400" />
                        <span className="text-gray-200">{property.area?.toLocaleString() || 'N/A'} sqft</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Starting from</div>
                        <div className="text-3xl md:text-4xl font-light text-white">
                          ${property.price.toLocaleString()}
                          <span className="text-lg text-gray-400">/mo</span>
                        </div>
                      </div>
                      <Link href={`/properties/${property.id}`}>
                        <button className="group/btn flex items-center gap-2 px-6 py-3 border border-amber-500/40 rounded-full hover:bg-amber-500/10 hover:border-amber-500/60 transition-all text-white">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <Link href="/browse">
              <button className="relative overflow-hidden px-12 py-5 border border-amber-500/30 rounded-full group/btn">
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  Explore All Properties
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Elegant Grid */}
      <section className="relative py-24 md:py-32 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="fade-in-section text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-white px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              The EstoSpaces Difference
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light px-4">
              Uncompromising excellence in every detail
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: Shield,
                title: 'Verified Excellence',
                description: 'Every property undergoes rigorous verification to ensure authenticity and quality standards'
              },
              {
                icon: Award,
                title: 'Award-Winning Service',
                description: 'Recognized globally for exceptional client experiences and innovative solutions'
              },
              {
                icon: Globe,
                title: 'Global Reach',
                description: 'Access to exclusive properties in the world\'s most prestigious locations'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="fade-in-section group"
              >
                <div className="relative p-8 border border-white/10 rounded-2xl hover:border-amber-500/30 transition-all duration-500 bg-zinc-900/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-amber-400" />
                    </div>
                    
                    <h3 className="text-2xl font-light mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Cinematic */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop"
            alt="CTA Background"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-white" style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              Begin Your Journey
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto font-light" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Discover extraordinary properties that transcend expectations
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link href="/register">
                <button className="relative overflow-hidden px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-lg font-medium group/btn shadow-xl hover:shadow-amber-500/50 transition-all text-white w-full sm:w-auto">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5" />
                    Get Started
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                </button>
              </Link>
              
              <Link href="/browse">
                <button className="px-10 py-5 border border-white/40 rounded-full text-lg font-medium hover:bg-white/10 hover:border-white/60 transition-all flex items-center justify-center gap-2 text-white w-full sm:w-auto">
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal Elegant */}
      <footer className="relative py-16 bg-black border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-8 h-8 text-amber-400" />
                <span className="text-2xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  EstoSpaces
                </span>
              </div>
              <p className="text-gray-400 font-light">
                Redefining luxury real estate
              </p>
            </div>

            {[
              { title: 'Company', links: ['About', 'Services', 'Contact'] },
              { title: 'Properties', links: ['Buy', 'Rent', 'Sell'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] }
            ].map((column, index) => (
              <div key={index}>
                <h4 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-4 font-medium">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm font-light">
            © 2024 EstoSpaces. All rights reserved.
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Home;
