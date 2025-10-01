import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Property } from '../types';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  Home as HomeIcon, 
  Building2, 
  Users, 
  Shield,
  Award,
  TrendingUp,
  Eye,
  Heart,
  Bath,
  Bed,
  Square,
  Wifi,
  Car,
  Coffee,
  Play,
  CheckCircle,
  Globe,
  Zap,
  Crown,
  Sparkles,
  ChevronDown,
  Phone,
  Mail,
  Calendar,
  Camera,
  Lock,
  Gem,
  Diamond,
  User
} from 'lucide-react';

// Premium sample properties
const featuredProperties: Property[] = [
  {
    id: '1',
    title: 'Royal Penthouse Manhattan',
    description: 'Extraordinary 4-bedroom penthouse with Central Park views, private elevator, and Italian marble finishes.',
    price: 25000,
    location: 'Upper East Side, Manhattan',
    city: 'New York',
    state: 'New York',
    type: 'flat',
    category: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    furnished: 'furnished',
    amenities: ['Private Elevator', 'Central Park View', 'Wine Cellar', 'Smart Home', 'Concierge', 'Rooftop Terrace'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop'],
    available: true,
    ownerId: 'owner1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroSlides = [
    {
      title: "Discover Extraordinary",
      subtitle: "Luxury Properties",
      description: "Experience sophisticated living with our curated collection of the world's most exclusive properties.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop",
      cta: "Explore Collection"
    },
    {
      title: "Architectural",
      subtitle: "Masterpieces",
      description: "From contemporary penthouses to historic estates, each property represents design excellence.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop",
      cta: "View Masterpieces"
    },
    {
      title: "Global",
      subtitle: "Luxury Living",
      description: "Discover premium properties in prestigious locations worldwide, from Manhattan to Monaco.",
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1920&h=1080&fit=crop",
      cta: "Explore Worldwide"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Premium Navigation */}
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
                  Award-Winning Luxury
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { href: '/', label: 'Home', icon: HomeIcon },
                { href: '/properties', label: 'Properties', icon: Search },
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
                  <Link href="/auth/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 font-premium transition-colors text-yellow-700 hover:text-yellow-800"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link href="/auth/register">
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

      <div className="min-h-screen overflow-x-hidden" style={{ 
        background: `linear-gradient(135deg, var(--secondary-oldlace) 0%, var(--neutral-white) 50%, var(--secondary-oldlace-dark) 100%)` 
      }}>
        {/* Hero Section */}
      <section ref={heroRef} className="hero-luxury">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${heroSlides[currentSlide].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 dark:from-black/80 dark:via-black/60 dark:to-black/80" />
          </motion.div>
        </AnimatePresence>

        {/* Award-Winning Floating Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-4 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 award-winning-animation opacity-20"
        >
          <div className="w-full h-full rounded-full blur-xl bg-gradient-to-br from-purple-500/10 to-transparent" />
        </motion.div>
        
        <motion.div
          style={{ y: y2, animationDelay: '-2s' }}
          className="absolute top-40 right-4 sm:right-20 w-16 sm:w-24 h-16 sm:h-24 award-winning-animation opacity-30"
        >
          <div className="w-full h-full rounded-lg rotate-45 blur-lg bg-gradient-to-br from-green-500/10 to-transparent" />
        </motion.div>
        
        <motion.div
          style={{ y: y1, animationDelay: '-4s' }}
          className="absolute bottom-20 left-1/4 w-20 sm:w-28 h-20 sm:h-28 award-winning-animation opacity-25"
        >
          <div className="w-full h-full rounded-full blur-xl bg-gradient-to-br from-yellow-200/20 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container-luxury text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ opacity }}
          >
            {/* Premium Logo Animation with Golden Touches */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="flex items-center justify-center mb-8 sm:mb-12"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-16 sm:w-20 h-16 sm:h-20 border-2 rounded-full"
                  style={{ 
                    borderImage: 'linear-gradient(45deg, #D4AF37, #7B57CE, #8F9D68) 1',
                    borderColor: '#D4AF37'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crown className="w-8 sm:w-10 h-8 sm:h-10 text-yellow-400" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"
                />
              </div>
              <div className="ml-4 sm:ml-6 w-1 h-16 sm:h-20 bg-gradient-to-b from-yellow-400 via-purple-500 to-green-600" />
              <div className="ml-2 flex flex-col items-start">
                <span className="text-2xl sm:text-3xl font-golden text-gradient-gold">EstoSpaces</span>
                <span className="text-xs sm:text-sm font-premium text-yellow-200 tracking-wider">LUXURY ESTATES</span>
              </div>
            </motion.div>
            
            {/* Dynamic Title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-6 sm:mb-8"
              >
                <h1 className="text-display-1 font-luxury mb-4 leading-tight">
                  <span className="text-white">{heroSlides[currentSlide].title}</span>
                  <span className="block text-gradient-gold font-golden">
                    {heroSlides[currentSlide].subtitle}
                  </span>
                </h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-body-premium mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 text-yellow-100"
                >
                  {heroSlides[currentSlide].description}
                </motion.p>
              </motion.div>
            </AnimatePresence>     
            {/* Premium Search Section with Golden Touches */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-morphism rounded-3xl p-6 sm:p-8 luxury-shadow border border-yellow-400/20">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-yellow-400" />
                    <input
                      type="text"
                      placeholder="Search exclusive luxury properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="premium-input pl-12 font-premium"
                      style={{ 
                        background: 'rgba(255, 248, 235, 0.9)',
                        border: '2px solid transparent',
                        backgroundClip: 'padding-box'
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-gold micro-bounce px-8 py-4 rounded-2xl font-premium font-semibold text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Discover Luxury
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </motion.button>
                </div>
                
                {/* Quick Search Tags */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="flex flex-wrap gap-2 mt-4 justify-center"
                >
                  {['Penthouse', 'Waterfront', 'Manhattan', 'Beverly Hills'].map((tag, index) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 rounded-full text-sm font-premium bg-yellow-400/20 text-yellow-100 hover:bg-yellow-400/30 transition-all duration-300"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Golden Slide Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1 }}
              className="flex justify-center space-x-4 mt-12"
            >
              {heroSlides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                    index === currentSlide 
                      ? 'scale-125 bg-yellow-400 border-yellow-400 shadow-lg shadow-yellow-400/50' 
                      : 'bg-transparent border-yellow-400/50 hover:border-yellow-400'
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Award-Winning Features Section */}
      <section className="award-section section-padding-luxury">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-display-2 font-golden mb-6 text-gradient-premium">
              Why Choose EstoSpaces
            </h2>
            <div className="w-24 h-1 rounded-full mx-auto mb-8 bg-gradient-to-r from-yellow-400 via-purple-500 to-green-600" />
            <p className="text-body-premium max-w-3xl mx-auto" 
               style={{ color: 'var(--tertiary-moss-dark)' }}>
              Experience the pinnacle of luxury real estate with our award-winning platform, 
              designed for discerning clients who demand excellence.
            </p>
          </motion.div>

          <div className="award-winning-grid">
            {[
              {
                icon: Crown,
                title: "Exclusive Properties",
                description: "Curated collection of the world's most prestigious properties",
                color: '#D4AF37',
                bgGradient: 'from-yellow-400/20 to-yellow-600/20'
              },
              {
                icon: Shield,
                title: "Verified Luxury",
                description: "Every property undergoes rigorous verification and quality assessment",
                color: '#7B57CE',
                bgGradient: 'from-purple-500/20 to-purple-700/20'
              },
              {
                icon: Gem,
                title: "Premium Service",
                description: "White-glove service with dedicated luxury property specialists",
                color: '#8F9D68',
                bgGradient: 'from-green-500/20 to-green-700/20'
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Access to exclusive properties in the world's most desirable locations",
                color: '#D4AF37',
                bgGradient: 'from-yellow-400/20 to-yellow-600/20'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="premium-card-hover card-luxury p-8 text-center luxury-shadow border border-yellow-400/10"
              >
                <div className="mb-6 flex justify-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center micro-glow bg-gradient-to-br ${feature.bgGradient}`}>
                    <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4" 
                    style={{ color: 'var(--neutral-dark)' }}>
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed font-premium" 
                   style={{ color: 'var(--tertiary-moss-dark)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="section-padding-luxury bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-display-2 font-display mb-6 text-gradient-moss">
              Featured Properties
            </h2>
            <div className="divider-moss mb-8" />
            <p className="text-body-premium max-w-3xl mx-auto" 
               style={{ color: 'var(--neutral-dark)' }}>
              Discover our handpicked selection of extraordinary properties that define luxury living.
            </p>
          </motion.div>

          <div className="award-winning-grid">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="property-card-luxury luxury-shadow"
              >
                <div className="property-image h-64 relative">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge-premium">Featured</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl font-bold text-gradient-iris">
                      ${property.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: 'var(--tertiary-moss)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--tertiary-moss)' }}>4.9</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold mb-2" 
                      style={{ color: 'var(--neutral-dark)' }}>
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-4 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-premium">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 text-sm" 
                       style={{ color: 'var(--tertiary-moss-dark)' }}>
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.area} sq ft</span>
                    </div>
                  </div>
                  
                  <Link href={`/properties/${property.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-moss py-3 rounded-xl font-semibold text-white micro-bounce"
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="award-section section-padding-luxury">
        <div className="container-luxury text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-display-2 font-display mb-6 text-gradient-luxury">
              Ready to Find Your Dream Property?
            </h2>
            <div className="divider-luxury mb-8" />
            <p className="text-body-premium mb-12" 
               style={{ color: 'var(--tertiary-moss-dark)' }}>
              Join thousands of satisfied clients who have found their perfect luxury property with EstoSpaces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/properties">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-premium px-8 py-4 rounded-2xl font-premium font-semibold text-white micro-bounce"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Explore Properties
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </Link>
              
              <Link href="/auth/register">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold px-8 py-4 rounded-2xl font-premium font-semibold text-white micro-bounce"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Get Started
                    <Diamond className="w-5 h-5" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;