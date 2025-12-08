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
  TreePine,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { sampleProperties } from '../data/sampleProperties';



const Browse = () => {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [itemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1); // Reset to first page when filtering
  }, [properties, searchQuery, filters, sortBy]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gray-950 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)' }} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="inline-block mb-8">
              <div className="px-6 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                <span className="text-white/80 text-sm tracking-widest font-light" style={{ fontFamily: 'Inter' }}>CURATED ESTATES</span>
              </div>
            </motion.div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight" style={{ fontFamily: 'Playfair Display' }}>
              Discover Refined
              <span className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                Properties
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed" style={{ fontFamily: 'Cormorant Garamond' }}>
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
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, property name, or features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 bg-transparent text-white placeholder-gray-400 text-lg focus:outline-none"
                    style={{ fontFamily: 'Cormorant Garamond' }}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-light transition-all duration-300 ${showFilters ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    style={{ fontFamily: 'Cormorant Garamond' }}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Filters</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-black px-8 py-4 rounded-xl text-lg font-light hover:bg-gray-100 transition-colors flex items-center gap-2"
                    style={{ fontFamily: 'Cormorant Garamond' }}
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
            className="bg-gray-950 border-b border-white/10 shadow-lg"
          >
            <div className="container mx-auto px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>Price Range</label>
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
                    <div className="flex justify-between text-sm text-gray-400" style={{ fontFamily: 'Cormorant Garamond' }}>
                      <span>${filters.priceRange[0].toLocaleString()}</span>
                      <span>${filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                    style={{ fontFamily: 'Cormorant Garamond' }}
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value} className="bg-gray-950 text-white">{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                    style={{ fontFamily: 'Cormorant Garamond' }}
                  >
                    <option value="" className="bg-gray-950">Any</option>
                    <option value="1" className="bg-gray-950">1+</option>
                    <option value="2" className="bg-gray-950">2+</option>
                    <option value="3" className="bg-gray-950">3+</option>
                    <option value="4" className="bg-gray-950">4+</option>
                    <option value="5" className="bg-gray-950">5+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-3" style={{ fontFamily: 'Cormorant Garamond' }}>Bathrooms</label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => setFilters(prev => ({ ...prev, bathrooms: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                    style={{ fontFamily: 'Cormorant Garamond' }}
                  >
                    <option value="" className="bg-gray-950">Any</option>
                    <option value="1" className="bg-gray-950">1+</option>
                    <option value="2" className="bg-gray-950">2+</option>
                    <option value="3" className="bg-gray-950">3+</option>
                    <option value="4" className="bg-gray-950">4+</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-8">
                <label className="block text-sm font-light text-gray-300 mb-4" style={{ fontFamily: 'Cormorant Garamond' }}>Amenities</label>
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
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-300 font-light ${isSelected
                          ? 'bg-white text-black border-white'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                          }`}
                        style={{ fontFamily: 'Cormorant Garamond' }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{amenity.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white font-light transition-colors"
                  style={{ fontFamily: 'Cormorant Garamond' }}
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="bg-white text-black px-6 py-3 rounded-xl font-light hover:bg-gray-100 transition-colors"
                  style={{ fontFamily: 'Cormorant Garamond' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: 'Playfair Display' }}>
                {filteredProperties.length} Exceptional Properties
              </h2>
              <p className="text-gray-400 font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                {searchQuery && `Results for "${searchQuery}"`}
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'map' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                style={{ fontFamily: 'Cormorant Garamond' }}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-950">{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          <motion.div
            layout
            className={`grid gap-8 ${viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
              }`}
          >
            <AnimatePresence>
              {currentItems.map((property, index) => (
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
                    <div className="cursor-pointer">
                      <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-gray-900">
                        <motion.img
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.8 }}
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Favorite Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                          <Heart className="w-4 h-4 text-white" />
                        </motion.button>
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
                            <span>{property.area?.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div>
                            <div className="text-gray-500 text-sm font-light mb-1" style={{ fontFamily: 'Cormorant Garamond' }}>Starting from</div>
                            <div className="text-3xl font-light text-white" style={{ fontFamily: 'Playfair Display' }}>
                              ${property.price.toLocaleString()}
                              <span className="text-sm text-gray-500">/mo</span>
                            </div>
                          </div>
                          <motion.div whileHover={{ scale: 1.1, rotate: 45 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                            <ArrowRight className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          {filteredProperties.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-lg border transition-all ${currentPage === i + 1
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-light text-white mb-4" style={{ fontFamily: 'Playfair Display' }}>No Properties Found</h3>
              <p className="text-gray-400 mb-8 font-light" style={{ fontFamily: 'Cormorant Garamond' }}>
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <button
                onClick={clearFilters}
                className="bg-white text-black px-8 py-3 rounded-xl font-light hover:bg-gray-100 transition-colors"
                style={{ fontFamily: 'Cormorant Garamond' }}
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