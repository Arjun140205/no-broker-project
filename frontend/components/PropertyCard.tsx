import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Property } from '../types';
import { MapPin, Star, Heart, Eye, Bed, Bath, Maximize, Wifi, Car, Coffee, Shield } from 'lucide-react';
import { Button } from './ui/button';
import BookingModal from './booking/BookingModal';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index = 0 }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': Coffee,
    'Security': Shield,
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative card-premium overflow-hidden"
      >
        {/* Property Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.images?.[0] || property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Price Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 right-4 glass rounded-full px-3 py-1"
          >
            <span className="text-sm font-bold text-white">
              ₹{property.price.toLocaleString()}
              <span className="text-xs opacity-80">/night</span>
            </span>
          </motion.div>
          
          {/* Category Badge */}
          {property.category && (
            <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
              {property.category === 'rent' ? 'For Rent' : 'For Sale'}
            </div>
          )}
          
          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            className={`absolute bottom-4 right-4 p-2 rounded-full glass transition-colors duration-300 ${
              isFavorited ? 'text-red-500' : 'text-white hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.button>
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link href={`/properties/${property.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="glass text-white hover:bg-white/20"
              >
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Property Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:gradient-text transition-all duration-300">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
          
          {/* Property Details */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {property.bedrooms && (
              <div className="flex items-center space-x-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center space-x-1">
                <Maximize className="w-4 h-4" />
                <span>{property.area} sq ft</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {property.description}
          </p>
          
          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {property.amenities.slice(0, 3).map((amenity, idx) => {
                const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Wifi;
                return (
                  <div
                    key={idx}
                    className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 text-xs"
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{amenity}</span>
                  </div>
                );
              })}
              {property.amenities.length > 3 && (
                <div className="text-xs text-gray-500 px-2 py-1">
                  +{property.amenities.length - 3} more
                </div>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href={`/properties/${property.id}`}
              className="text-primary font-semibold hover:text-primary/80 transition-colors text-sm"
            >
              View Details
            </Link>
            <Button
              size="sm"
              onClick={handleBookNow}
              className="btn-premium text-sm px-4 py-2"
            >
              Book Now
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        property={property}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default PropertyCard;