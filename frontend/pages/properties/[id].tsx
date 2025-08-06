import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { propertyAPI } from '../../services/api';
import { Property } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  MapPin, 
  Star, 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  Calendar,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  AirVent,
  UtensilsCrossed,
  Shield,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  User,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Sample property data
const sampleProperty: Property = {
  id: '1',
  title: 'Luxury Penthouse in Downtown',
  description: 'Stunning 3-bedroom penthouse with panoramic city views, modern amenities, and premium finishes throughout. This exclusive property features an open-concept living area, gourmet kitchen with stainless steel appliances, and a private balcony with breathtaking cityscape views. The master suite includes a walk-in closet and en-suite bathroom with dual vanities. Additional features include in-unit laundry, central air conditioning, and secure building access.',
  price: 2500,
  location: 'Downtown, City Center',
  imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  ownerId: 'owner1',
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15'
};

const PropertyDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [bookingDate, setBookingDate] = useState('');

  // Sample images for the property
  const propertyImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await propertyAPI.getPropertyById(id as string);
        setProperty(data || sampleProperty);
      } catch (error) {
        console.error('Error fetching property:', error);
        setProperty(sampleProperty);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to contact the owner');
      router.push('/login');
      return;
    }
    setShowContactForm(true);
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book this property');
      router.push('/login');
      return;
    }
    toast.success('Booking request sent! We\'ll contact you soon.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-realestate-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/browse')}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleFavorite}
                className="flex items-center space-x-2"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={propertyImages[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? propertyImages.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setCurrentImageIndex(prev => (prev + 1) % propertyImages.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {propertyImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex space-x-2 mt-4">
                {propertyImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-realestate-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Basic Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-current text-yellow-500 mr-1" />
                        <span>4.8 (24 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-realestate-600">
                      ${property.price.toLocaleString()}
                    </div>
                    <div className="text-gray-500">per month</div>
                  </div>
                </div>
              </div>

              {/* Property Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-center space-x-3">
                      <Bed className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">3 Bedrooms</div>
                        <div className="text-sm text-gray-500">Master with en-suite</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Bath className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">2 Bathrooms</div>
                        <div className="text-sm text-gray-500">Full bathrooms</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Square className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">1,200 sqft</div>
                        <div className="text-sm text-gray-500">Living area</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Car className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">1 Parking</div>
                        <div className="text-sm text-gray-500">Covered space</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { icon: Wifi, name: 'High-speed WiFi' },
                      { icon: AirVent, name: 'Central Air Conditioning' },
                      { icon: UtensilsCrossed, name: 'Gourmet Kitchen' },
                      { icon: Shield, name: 'Security System' },
                      { icon: Building2, name: 'Elevator Access' },
                      { icon: Calendar, name: 'In-unit Laundry' },
                    ].map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <amenity.icon className="w-5 h-5 text-realestate-600" />
                        <span className="text-gray-700">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Booking Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Book This Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-realestate-600 mb-2">
                    ${property.price.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per month</div>
                </div>

                <div className="space-y-3">
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-realestate-500 focus:border-transparent"
                    placeholder="Select move-in date"
                  />
                  
                  <Button
                    onClick={handleBooking}
                    className="w-full bg-realestate-600 hover:bg-realestate-700"
                    size="lg"
                  >
                    Request Booking
                  </Button>
                  
                  <Button
                    onClick={handleContact}
                    variant="outline"
                    className="w-full"
                  >
                    Contact Owner
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>No application fees</p>
                  <p>Instant response</p>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-realestate-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-realestate-600" />
                  </div>
                  <div>
                    <div className="font-medium">John Smith</div>
                    <div className="text-sm text-gray-500">Verified Owner</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Owner
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
