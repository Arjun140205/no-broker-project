import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  User,
  Heart,
  Calendar,
  MessageCircle,
  Search,
  Star,
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Diamond,
  Sparkles,
  Crown
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
    images: string[];
    price: number;
  };
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface FavoriteProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type: string;
  available: boolean;
}

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'seeker') {
      router.push('/dashboard/owner');
      return;
    }

    fetchBookings();
    fetchFavorites();
  }, [isAuthenticated, user, router]);

  const fetchBookings = async () => {
    try {
      // Mock data for now
      const mockBookings: Booking[] = [
        {
          id: '1',
          property: {
            id: '1',
            title: 'Luxury Penthouse Suite',
            location: 'Mumbai, Maharashtra',
            images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
            price: 15000,
          },
          checkIn: '2024-02-15',
          checkOut: '2024-02-18',
          totalAmount: 45000,
          status: 'accepted',
          paymentStatus: 'completed',
          createdAt: '2024-02-10',
        },
        {
          id: '2',
          property: {
            id: '2',
            title: 'Modern Villa with Pool',
            location: 'Goa, India',
            images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
            price: 25000,
          },
          checkIn: '2024-03-01',
          checkOut: '2024-03-05',
          totalAmount: 100000,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: '2024-02-08',
        },
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      // Mock data for now
      const mockFavorites: FavoriteProperty[] = [
        {
          id: '1',
          title: 'Luxury Penthouse Suite',
          description: 'Stunning penthouse with panoramic city views',
          price: 15000,
          location: 'Mumbai, Maharashtra',
          images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
          bedrooms: 3,
          bathrooms: 2,
          area: 2500,
          type: 'flat',
          available: true,
        },
        {
          id: '3',
          title: 'Cozy Beach House',
          description: 'Beautiful beachfront property with ocean views',
          price: 12000,
          location: 'Kerala, India',
          images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
          bedrooms: 2,
          bathrooms: 2,
          area: 1800,
          type: 'house',
          available: true,
        },
      ];
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Favorite Properties',
      value: favorites.length,
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Total Spent',
      value: '₹1,45,000',
      icon: CreditCard,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Messages',
      value: 5,
      icon: MessageCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 premium-gradient rounded-full flex items-center justify-center">
                <Diamond className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold gradient-text">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-muted-foreground">
                  Discover your next luxury getaway
                </p>
              </div>
            </div>
            <Button className="btn-premium">
              <Search className="w-4 h-4 mr-2" />
              Explore Properties
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="glass-effect border-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-effect border-primary/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary/10">
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary/10">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card className="glass-effect border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                      <img
                        src={booking.property.images[0]}
                        alt={booking.property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{booking.property.title}</h4>
                        <p className="text-sm text-muted-foreground">{booking.property.location}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(booking.status)}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{booking.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Favorite Properties */}
              <Card className="glass-effect border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Favorite Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {favorites.slice(0, 3).map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{property.title}</h4>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                        <p className="text-sm font-medium text-primary">₹{property.price.toLocaleString()}/night</p>
                      </div>
                      <Button size="sm" variant="outline" className="glass-effect border-primary/20">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Bookings</h2>
              <Button className="btn-premium">
                <Search className="w-4 h-4 mr-2" />
                Find More Properties
              </Button>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-effect border-primary/10 hover:border-primary/30 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        <img
                          src={booking.property.images[0]}
                          alt={booking.property.title}
                          className="w-32 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{booking.property.title}</h3>
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{booking.property.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(booking.status)}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Check-in</p>
                              <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Check-out</p>
                              <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Amount</p>
                              <p className="font-bold text-primary">₹{booking.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="glass-effect border-primary/20">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message Owner
                              </Button>
                              <Button size="sm" variant="outline" className="glass-effect border-primary/20">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Favorite Properties</h2>
              <Button className="btn-premium">
                <Search className="w-4 h-4 mr-2" />
                Discover More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group"
                >
                  <Card className="glass-effect border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 glass-effect px-2 py-1 rounded-full">
                        <span className="text-xs font-medium">
                          {property.available ? 'Available' : 'Booked'}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="absolute top-3 left-3 glass-effect border-0 text-red-500 hover:text-red-600"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{property.title}</h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <span>{property.area} sq ft</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ₹{property.price.toLocaleString()}/night
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" className="btn-premium text-xs px-3 py-2">
                            <Calendar className="w-3 h-3 mr-1" />
                            Book
                          </Button>
                          <Button size="sm" variant="outline" className="glass-effect border-primary/20">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-effect border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Settings
                  <div className="ml-2 flex items-center text-primary">
                    <Crown className="w-4 h-4 mr-1" />
                    <span className="text-sm">Premium Member</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 premium-gradient rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-gold-500 fill-current mr-1" />
                      <span className="text-sm">Premium Member since 2024</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferences</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Tell us about your travel preferences, favorite destinations, and what you look for in a property..."
                    />
                  </div>
                </div>

                <Button className="btn-premium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;