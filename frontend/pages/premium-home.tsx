import React, { useEffect, useState, useRef } from 'react';
import { propertyAPI } from '../services/api';
import { Property } from '../types';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Loading, PropertyCardSkeleton } from '../components/ui/loading';
import { gsap } from 'gsap';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  Home as HomeIcon, 
  Building2, 
  Users, 
  Shield,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
  Crown,
  Zap,
  Globe,
  CheckCircle,
  Play,
  Filter,
  Calendar,
  CreditCard,
  ChevronRight,

  Target,
  Compass
} from 'lucide-react';

// Enhanced sample properties with luxury images
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Penthouse in Downtown',
    description: 'Stunning 3-bedroom penthouse with panoramic city views, modern amenities, and premium finishes throughout.',
    price: 2500,
    location: 'Downtown, City Center',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'flat',
    category: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    furnished: 'furnished',
    amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Swimming Pool'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    ownerId: 'owner1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Modern Family Villa',
    description: 'Spacious 4-bedroom villa with private garden, swimming pool, and contemporary design in a quiet neighborhood.',
    price: 3200,
    location: 'Suburban Heights',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'villa',
    category: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    furnished: 'semifurnished',
    amenities: ['WiFi', 'Swimming Pool', 'Garden', 'Parking', 'Security'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ownerId: 'owner2',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Cozy Studio Apartment',
    description: 'Perfect starter home with open-plan living, modern kitchen, and convenient location near public transport.',
    price: 1200,
    location: 'University District',
    city: 'Bangalore',
    state: 'Karnataka',
    type: 'studio',
    category: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    furnished: 'furnished',
    amenities: ['WiFi', 'Air Conditioning', 'Elevator'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ownerId: 'owner3',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'Waterfront Condo',
    description: 'Exclusive 2-bedroom condo with stunning water views, private balcony, and luxury amenities.',
    price: 2800,
    location: 'Harbor Bay',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'flat',
    category: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    furnished: 'furnished',
    amenities: ['WiFi', 'Balcony', 'Water View', 'Gym', 'Security'],
    images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop'],
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
    ownerId: 'owner4',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    id: '5',
    title: 'Historic Townhouse',
    description: 'Beautifully restored 3-bedroom townhouse with original features, modern updates, and private courtyard.',
    price: 2100,
    location: 'Old Town District',
    city: 'Delhi',
    state: 'Delhi',
    type: 'house',
    category: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    furnished: 'semifurnished',
    amenities: ['WiFi', 'Garden', 'Parking', 'Historic Features'],
    images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop'],
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
    ownerId: 'owner5',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  },
  {
    id: '6',
    title: 'Mountain View Retreat',
    description: 'Peaceful 2-bedroom cabin with breathtaking mountain views, hiking trails, and modern comforts.',
    price: 1800,
    location: 'Mountain Valley',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    type: 'house',
    category: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    furnished: 'furnished',
    amenities: ['WiFi', 'Mountain View', 'Hiking Trails', 'Fireplace'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ownerId: 'owner6',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const PremiumHome = () => {
  const { isAuthenticated, user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getAllProperties();
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data);
        } else {
          setProperties(sampleProperties);
        }
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        setProperties(sampleProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    // GSAP animations for hero section
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-title', 
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.hero-subtitle', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero-buttons', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );

    // Floating elements animation
    gsap.to('.floating-element', {
      y: -20,
      duration: 3,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.5
    });

  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-luxury-50/10 dark:to-luxury-950/10">
      {/* Premium Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-600/10 via-luxury-500/5 to-luxury-400/10 dark:from-luxury-400/5 dark:via-luxury-500/3 dark:to-luxury-600/5"></div>
        
        {/* Floating Elements */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-luxury-400/20 to-luxury-600/20 rounded-full blur-xl"></div>
          <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-luxury-500/30 to-luxury-700/30 rounded-full blur-lg"></div>
          <div className="floating-element absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-luxury-300/15 to-luxury-500/15 rounded-full blur-2xl"></div>
          <div className="floating-element absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-luxury-600/25 to-luxury-800/25 rounded-full blur-lg"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                className="relative"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-full flex items-center justify-center shadow-luxury-shadow">
                  <HomeIcon className="w-10 h-10 text-white" />
                </div>
                <Crown className="absolute -top-2 -right-2 w-6 h-6 text-luxury-400" />
              </motion.div>
            </div>
          </motion.div>
          
          <h1 className="hero-title text-6xl md:text-8xl font-display font-bold mb-8 leading-tight">
            <span className="block text-foreground">Find Your</span>
            <span className="block gradient-text">Dream Home</span>
            <span className="block text-foreground">In Luxury</span>
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl mb-12 text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Discover premium properties in the most desirable locations. From luxury penthouses to cozy studios, 
            we have the perfect space that matches your lifestyle and dreams.
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="btn-luxury text-lg px-12 py-4 shadow-luxury-shadow hover:shadow-luxury-shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/browse" className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Explore Properties</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            {!isAuthenticated && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="glass-effect border-luxury-300 text-luxury-700 dark:text-luxury-300 hover:bg-luxury-50 dark:hover:bg-luxury-900/20 text-lg px-12 py-4 shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <Link href="/register" className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Join Premium</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-luxury-500" />
              <span>Verified Properties</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-luxury-500" />
              <span>Trusted Platform</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-luxury-500" />
              <span>Premium Service</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-luxury-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-luxury-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Premium Search Section */}
      <section className="py-20 bg-gradient-to-r from-luxury-50/50 to-luxury-100/30 dark:from-luxury-950/30 dark:to-luxury-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <Card className="luxury-card glass-effect border-luxury-200/30 dark:border-luxury-800/30 shadow-luxury-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                    Find Your Perfect Property
                  </h2>
                  <p className="text-muted-foreground">
                    Use our advanced search to discover properties that match your exact needs
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luxury-500" />
                    <input
                      type="text"
                      placeholder="Location, property type..."
                      className="luxury-input pl-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luxury-500" />
                    <select className="luxury-input pl-12 appearance-none">
                      <option>Property Type</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Villa</option>
                      <option>Studio</option>
                    </select>
                  </div>
                  
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luxury-500" />
                    <select className="luxury-input pl-12 appearance-none">
                      <option>Price Range</option>
                      <option>$1000 - $2000</option>
                      <option>$2000 - $3000</option>
                      <option>$3000+</option>
                    </select>
                  </div>
                  
                  <Button className="btn-luxury h-12 shadow-soft hover:shadow-medium">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-luxury-50/20 dark:to-luxury-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-luxury-500 mr-3" />
              <h2 className="text-5xl font-display font-bold text-foreground">
                Why Choose EstoSpaces?
              </h2>
              <Sparkles className="w-8 h-8 text-luxury-500 ml-3" />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We provide the most comprehensive real estate platform with premium features and exceptional service.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Shield,
                title: 'Verified Properties',
                description: 'All properties are thoroughly verified and inspected for your peace of mind.',
                color: 'from-emerald-400 to-emerald-600'
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: 'Our team of real estate experts is here to help you every step of the way.',
                color: 'from-blue-400 to-blue-600'
              },
              {
                icon: Crown,
                title: 'Premium Listings',
                description: 'Access to the most exclusive and high-quality property listings in your area.',
                color: 'from-luxury-400 to-luxury-600'
              },
              {
                icon: Award,
                title: 'Trusted Platform',
                description: 'Join thousands of satisfied users who found their perfect home with us.',
                color: 'from-purple-400 to-purple-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="luxury-card text-center group cursor-pointer"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury-shadow group-hover:shadow-luxury-shadow-lg transition-all duration-300`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-luxury-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-gradient-to-r from-luxury-50/30 to-luxury-100/20 dark:from-luxury-950/20 dark:to-luxury-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-display font-bold text-foreground mb-6">
              Featured Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our handpicked selection of premium properties in the most desirable locations.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {properties.slice(0, 6).map((property) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Link href={`/properties/${property.id}`}>
                    <Card className="luxury-card overflow-hidden border-luxury-200/30 dark:border-luxury-800/30 shadow-soft hover:shadow-luxury-shadow transition-all duration-500">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute top-4 right-4 glass-effect px-4 py-2 rounded-full">
                          <span className="text-sm font-bold text-foreground">
                            ${property.price.toLocaleString()}/month
                          </span>
                        </div>
                        
                        <div className="absolute top-4 left-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="glass-effect hover:bg-red-500/20 text-foreground hover:text-red-500 transition-all duration-300"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="sm" className="btn-luxury text-xs">
                            View Details
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-foreground line-clamp-1 group-hover:text-luxury-600 transition-colors">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-luxury-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium ml-1">4.8</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground mb-4">
                          <MapPin className="w-4 h-4 mr-2 text-luxury-500" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                          {property.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-luxury-600 dark:text-luxury-400 font-semibold">
                            Premium Property
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-luxury-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button
              asChild
              size="lg"
              className="btn-luxury px-12 py-4 text-lg shadow-luxury-shadow hover:shadow-luxury-shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/browse" className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>View All Properties</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="py-24 bg-gradient-to-r from-luxury-600 via-luxury-700 to-luxury-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-element absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="floating-element absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="floating-element absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-display font-bold mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-luxury-100 max-w-3xl mx-auto leading-relaxed">
              Join our growing community of satisfied users and property owners.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '10,000+', label: 'Properties Listed', icon: Building2 },
              { number: '5,000+', label: 'Happy Users', icon: Users },
              { number: '500+', label: 'Cities Covered', icon: Globe },
              { number: '99%', label: 'Satisfaction Rate', icon: Award }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-luxury-200" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 font-display">
                  {stat.number}
                </div>
                <div className="text-luxury-200 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-background to-luxury-50/30 dark:to-luxury-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-8">
              <Crown className="w-12 h-12 text-luxury-500 mr-4" />
              <h2 className="text-5xl font-display font-bold text-foreground">
                Ready to Find Your Dream Home?
              </h2>
              <Crown className="w-12 h-12 text-luxury-500 ml-4" />
            </div>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied users who found their perfect property with EstoSpaces. 
              Start your journey to luxury living today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="btn-luxury text-lg px-12 py-4 shadow-luxury-shadow hover:shadow-luxury-shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/browse" className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Start Exploring</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              {!isAuthenticated && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="glass-effect border-luxury-300 text-luxury-700 dark:text-luxury-300 hover:bg-luxury-50 dark:hover:bg-luxury-900/20 text-lg px-12 py-4 shadow-soft hover:shadow-medium transition-all duration-300"
                >
                  <Link href="/register" className="flex items-center space-x-2">
                    <Crown className="w-5 h-5" />
                    <span>Join Premium</span>
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PremiumHome;