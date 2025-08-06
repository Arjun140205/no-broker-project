import React, { useEffect, useState } from 'react';
import { propertyAPI } from '../services/api';
import { Property } from '../types';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
  Heart
} from 'lucide-react';

// Sample properties with high-quality images
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Penthouse in Downtown',
    description: 'Stunning 3-bedroom penthouse with panoramic city views, modern amenities, and premium finishes throughout.',
    price: 2500,
    location: 'Downtown, City Center',
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
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ownerId: 'owner6',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getAllProperties();
        // Use sample properties if API returns empty or fails
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
    <div className="min-h-screen bg-gradient-to-br from-realestate-50 via-white to-luxury-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-realestate-600 via-realestate-700 to-luxury-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full"
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full"
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <HomeIcon className="w-12 h-12 mr-3" />
              <Sparkles className="w-8 h-8 text-luxury-300" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              Find Your Perfect
              <span className="block text-luxury-300">Dream Home</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Discover premium properties in the most desirable locations. 
              From luxury penthouses to cozy studios, we have the perfect space for you.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-realestate-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4"
              >
                <Link href="/browse">
                  Browse Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              {!isAuthenticated && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-realestate-600 font-semibold text-lg px-8 py-4"
                >
                  <Link href="/register">
                    Join Estospaces
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-large border-0">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by location, property type..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-realestate-500 focus:border-transparent"
                    />
                  </div>
                  <Button className="bg-realestate-600 hover:bg-realestate-700 px-8 py-3">
                    Search Properties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose Estospaces?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                description: 'All properties are thoroughly verified and inspected for your peace of mind.'
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: 'Our team of real estate experts is here to help you every step of the way.'
              },
              {
                icon: Building2,
                title: 'Premium Listings',
                description: 'Access to the most exclusive and high-quality property listings in your area.'
              },
              {
                icon: Award,
                title: 'Trusted Platform',
                description: 'Join thousands of satisfied users who found their perfect home with us.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-realestate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-realestate-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium properties in the most desirable locations.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
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
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link href={`/properties/${property.id}`}>
                    <Card className="overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 border-0">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900">
                          ${property.price.toLocaleString()}/month
                        </div>
                        <div className="absolute top-4 left-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium ml-1">4.8</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {property.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-realestate-600 font-semibold">
                            View Details
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-realestate-600 transition-colors" />
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
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-realestate-600 hover:bg-realestate-700 px-8 py-3"
            >
              <Link href="/browse">
                View All Properties
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-realestate-600 to-luxury-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Join our growing community of satisfied users and property owners.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { number: '10,000+', label: 'Properties Listed' },
              { number: '5,000+', label: 'Happy Users' },
              { number: '500+', label: 'Cities Covered' },
              { number: '99%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-200">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
