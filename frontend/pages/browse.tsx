import React, { useState, useEffect } from 'react';
import { propertyAPI } from '../services/api';
import { Property } from '../types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  Filter,
  Grid3X3,
  List,
  Heart,
  Bed,
  Bath,
  Square,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

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
  },
  {
    id: '7',
    title: 'Urban Loft Space',
    description: 'Industrial-chic loft with high ceilings, exposed brick, and modern appliances in the heart of the city.',
    price: 1900,
    location: 'Arts District',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ownerId: 'owner7',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '8',
    title: 'Garden Apartment',
    description: 'Charming 2-bedroom apartment with private garden, updated kitchen, and peaceful surroundings.',
    price: 1600,
    location: 'Garden District',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ownerId: 'owner8',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  }
];

const Browse = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    const matchesLocation = !selectedLocation || property.location.includes(selectedLocation);
    
    return matchesSearch && matchesPrice && matchesLocation;
  });

  const locations = [...new Set(properties.map(p => p.location))];

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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-realestate-600 to-luxury-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Browse through our extensive collection of premium properties in the most desirable locations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, property type, or features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-realestate-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* View Toggle and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-realestate-500 focus:border-transparent"
                    >
                      <option value="">All Locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>$0</span>
                        <span>$5,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchTerm('');
                        setPriceRange([0, 5000]);
                        setSelectedLocation('');
                      }}
                      className="flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear Filters</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
          </div>

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
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange([0, 5000]);
                  setSelectedLocation('');
                }}
                className="bg-realestate-600 hover:bg-realestate-700"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
              }
            >
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link href={`/properties/${property.id}`}>
                    <Card className={`overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 border-0 ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}>
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-64 h-48' : 'h-64'
                      }`}>
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900">
                          ${property.price.toLocaleString()}/month
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(property.id);
                          }}
                          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favorites.includes(property.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-600'
                            }`} 
                          />
                        </button>
                      </div>
                      
                      <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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

                        {viewMode === 'list' && (
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              <span>3 beds</span>
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              <span>2 baths</span>
                            </div>
                            <div className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              <span>1,200 sqft</span>
                            </div>
                          </div>
                        )}
                        
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
        </div>
      </section>
    </div>
  );
};

export default Browse;
