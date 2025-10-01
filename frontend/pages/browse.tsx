import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '../types';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Heart, 
  Bed, 
  Bath, 
  Square,
  Crown,
  ArrowRight,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  List,
  Map,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Shield,
  TreePine
} from 'lucide-react';

// Premium sample properties with international locations
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Penthouse Manhattan',
    description: 'Stunning 3-bedroom penthouse with panoramic city views, modern amenities, and premium finishes throughout.',
    price: 8500,
    location: 'Manhattan, New York',
    city: 'New York',
    state: 'New York',
    type: 'flat',
    category: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    furnished: 'furnished',
    amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Gym', 'Concierge', 'Rooftop'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
    available: true,
    ownerId: 'owner1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Modern Villa Beverly Hills',
    description: 'Spectacular 5-bedroom villa with infinity pool, wine cellar, and breathtaking canyon views.',
    price: 15000,
    location: 'Beverly Hills, California',
    city: 'Los Angeles',
    state: 'California',
    type: 'villa',
    category: 'rent',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    furnished: 'furnished',
    amenities: ['Pool', 'Wine Cellar', 'Home Theater', 'Gym', 'Garden', 'Security'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
    available: true,
    ownerId: 'owner2',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Waterfront Condo Miami',
    description: 'Exclusive 2-bedroom oceanfront condo with private beach access and world-class amenities.',
    price: 6800,
    location: 'South Beach, Miami',
    city: 'Miami',
    state: 'Florida',
    type: 'flat',
    category: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    furnished: 'furnished',
    amenities: ['Beach Access', 'Spa', 'Valet', 'Restaurant', 'Pool', 'Fitness'],
    images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop'],
    available: true,
    ownerId: 'owner3',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'Historic Townhouse London',
    description: 'Beautifully restored Victorian townhouse in prestigious Kensington with private garden.',
    price: 12000,
    location: 'Kensington, London',
    city: 'London',
    state: 'England',
    type: 'house',
    category: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    furnished: 'furnished',
    amenities: ['Garden', 'Fireplace', 'Study', 'Wine Storage', 'Parking', 'Maid Service'],
    images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop'],
    available: true,
    ownerId: 'owner4',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    id: '5',
    title: 'Alpine Chalet Switzerland',
    description: 'Luxurious mountain retreat with panoramic Alpine views, ski-in/ski-out access, and premium amenities.',
    price: 18000,
    location: 'Zermatt, Switzerland',
    city: 'Zermatt',
    state: 'Valais',
    type: 'house',
    category: 'rent',
    bedrooms: 6,
    bathrooms: 5,
    area: 5000,
    furnished: 'furnished',
    amenities: ['Ski Access', 'Fireplace', 'Sauna', 'Wine Cellar', 'Mountain View', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'],
    available: true,
    ownerId: 'owner5',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03'
  },
  {
    id: '6',
    title: 'Beachfront Villa Malibu',
    description: 'Stunning oceanfront estate with private beach, infinity pool, and unobstructed Pacific views.',
    price: 22000,
    location: 'Malibu, California',
    city: 'Malibu',
    state: 'California',
    type: 'villa',
    category: 'rent',
    bedrooms: 7,
    bathrooms: 6,
    area: 6500,
    furnished: 'furnished',
    amenities: ['Private Beach', 'Pool', 'Home Theater', 'Gym', 'Wine Cellar', 'Guest House'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'],
    available: true,
    ownerId: 'owner6',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '7',
    title: 'Penthouse Tokyo',
    description: 'Ultra-modern penthouse in Shibuya with city skyline views, smart home technology, and luxury finishes.',
    price: 9500,
    location: 'Shibuya, Tokyo',
    city: 'Tokyo',
    state: 'Tokyo',
    type: 'flat',
    category: 'rent',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    furnished: 'furnished',
    amenities: ['Smart Home', 'City View', 'Concierge', 'Gym', 'Rooftop Garden', 'Valet'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'],
    available: true,
    ownerId: 'owner7',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '8',
    title: 'Tuscan Villa Florence',
    description: 'Restored 16th-century villa with vineyard, olive groves, and breathtaking countryside views.',
    price: 14000,
    location: 'Chianti, Florence',
    city: 'Florence',
    state: 'Tuscany',
    type: 'villa',
    category: 'rent',
    bedrooms: 8,
    bathrooms: 6,
    area: 7200,
    furnished: 'furnished',
    amenities: ['Vineyard', 'Pool', 'Garden', 'Wine Cellar', 'Chef Kitchen', 'Historic Features'],
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'],
    available: true,
    ownerId: 'owner8',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  }
];

const Browse = () => {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    amenities: [] as string[],
    location: ''
  });

  const amenitiesList = [
    { name: 'WiFi', icon: Wifi },
    { name: 'Parking', icon: Car },
    { name: 'Pool', icon: Coffee },
    { name: 'Gym', icon: Dumbbell },
    { name: 'Security', icon: Shield },
    { name: 'Garden', icon: TreePine }
  ];

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'flat', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'bedrooms', label: 'Most Bedrooms' }
  ];

  useEffect(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
      const matchesBedrooms = !filters.bedrooms || property.bedrooms?.toString() === filters.bedrooms;
      const matchesBathrooms = !filters.bathrooms || property.bathrooms?.toString() === filters.bathrooms;
      const matchesType = !filters.propertyType || property.type === filters.propertyType;
      const matchesLocation = !filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesAmenities = filters.amenities.length === 0 || 
        filters.amenities.every(amenity => property.amenities.includes(amenity));

      return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms && 
             matchesType && matchesLocation && matchesAmenities;
    });

    // Sort properties
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bedrooms':
        filtered.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0));
        break;
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters, sortBy]);

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 50000],
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      amenities: [],
      location: ''
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Crown className="w-12 h-12 text-amber-400 mr-3" />
              <div className="w-1 h-12 bg-gradient-to-b from-amber-400 to-transparent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Discover Luxury
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Properties Worldwide
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Explore our curated collection of premium properties in the world's most prestigious locations.
            </p>
          </motion.div>

          {/* Advanced Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="glass-effect rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, property name, or features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 bg-transparent text-gray-800 placeholder-gray-500 text-lg focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      showFilters ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-800 hover:bg-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filters</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-8 py-4 text-lg font-semibold"
                  >
                    Search
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="container-custom py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                      }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${filters.priceRange[0].toLocaleString()}</span>
                      <span>${filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Bathrooms</label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => setFilters(prev => ({ ...prev, bathrooms: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {amenitiesList.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = filters.amenities.includes(amenity.name);
                    return (
                      <motion.button
                        key={amenity.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleAmenity(amenity.name)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn-primary px-6 py-3"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {filteredProperties.length} Premium Properties
              </h2>
              <p className="text-gray-600">
                {searchQuery && `Results for "${searchQuery}"`}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          <motion.div
            layout
            className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            <AnimatePresence>
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/properties/${property.id}`}>
                    <div className={`property-card hover-lift cursor-pointer ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}>
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-80 h-64' : 'h-80'
                      }`}>
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="image-overlay" />
                        
                        {/* Property Badge */}
                        <div className="absolute top-6 left-6">
                          <span className="luxury-badge">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        </div>
                        
                        {/* Favorite Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                        >
                          <Heart className="w-5 h-5 text-gray-700" />
                        </motion.button>
                        
                        {/* Price */}
                        <div className="absolute bottom-6 left-6">
                          <div className="glass-effect px-4 py-2 rounded-xl">
                            <span className="text-2xl font-bold text-white">
                              ${property.price.toLocaleString()}
                            </span>
                            <span className="text-white/80 ml-1">/month</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-8 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-amber-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="ml-1 font-semibold">4.9</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span className="font-medium">{property.location}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-6 line-clamp-2">
                          {property.description}
                        </p>
                        
                        {/* Property Features */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center text-gray-600">
                              <Bed className="w-5 h-5 mr-2" />
                              <span className="font-medium">{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Bath className="w-5 h-5 mr-2" />
                              <span className="font-medium">{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Square className="w-5 h-5 mr-2" />
                              <span className="font-medium">{property.area} sq ft</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {property.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                              +{property.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                            View Details
                          </span>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Properties Found</h3>
              <p className="text-gray-600 mb-8">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary px-8 py-3"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Browse;