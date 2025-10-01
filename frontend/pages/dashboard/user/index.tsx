import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Calendar, 
  Heart, 
  MessageCircle, 
  Search,
  MapPin,
  Star,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Home,
  Filter
} from 'lucide-react';
import Link from 'next/link';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    favoriteProperties: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'seeker') {
      router.push('/dashboard/owner');
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, [isAuthenticated, user, router]);

  const fetchDashboardStats = async () => {
    // Mock data for now
    setStats({
      totalBookings: 8,
      activeBookings: 2,
      completedBookings: 5,
      favoriteProperties: 12,
      totalSpent: 85000,
    });
  };

  const recentBookings = [
    {
      id: '1',
      propertyTitle: 'Luxury Penthouse Downtown',
      location: 'Downtown, Mumbai',
      checkIn: '2024-02-15',
      checkOut: '2024-02-20',
      amount: 125000,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      propertyTitle: 'Modern Villa Suburbs',
      location: 'Bandra, Mumbai',
      checkIn: '2024-02-18',
      checkOut: '2024-02-25',
      amount: 245000,
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      propertyTitle: 'Cozy Studio Apartment',
      location: 'Andheri, Mumbai',
      checkIn: '2024-01-12',
      checkOut: '2024-01-14',
      amount: 30000,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
    }
  ];

  const favoriteProperties = [
    {
      id: '1',
      title: 'Waterfront Condo',
      location: 'Marine Drive, Mumbai',
      price: 28000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Historic Townhouse',
      location: 'Colaba, Mumbai',
      price: 21000,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Mountain View Retreat',
      location: 'Lonavala, Maharashtra',
      price: 18000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
    }
  ];

  const recentSearches = [
    { query: '2BHK in Bandra', results: 45, date: '2024-02-10' },
    { query: 'Villa near beach', results: 23, date: '2024-02-08' },
    { query: 'Studio apartment Mumbai', results: 67, date: '2024-02-05' },
  ];

  if (!isAuthenticated || user?.role !== 'seeker') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold gradient-text mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover your next perfect home
              </p>
            </div>
            <Button className="btn-premium mt-4 md:mt-0" asChild>
              <Link href="/browse">
                <Search className="w-4 h-4 mr-2" />
                Browse Properties
              </Link>
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
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Clock className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-orange-500">{stats.activeBookings} active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold text-foreground">₹{stats.totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">{stats.completedBookings} completed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Favorite Properties</p>
                  <p className="text-3xl font-bold text-foreground">{stats.favoriteProperties}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Eye className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-blue-500">Recently viewed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Messages</p>
                  <p className="text-3xl font-bold text-foreground">5</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <MessageCircle className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-blue-500">2 unread</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Recent Bookings</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/user/bookings">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                      <img
                        src={booking.image}
                        alt={booking.propertyTitle}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground">{booking.propertyTitle}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          {booking.location}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {booking.checkIn} - {booking.checkOut}
                          </span>
                          <span className="font-medium text-primary">₹{booking.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Favorite Properties */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Favorite Properties</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/user/favorites">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favoriteProperties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{property.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.location}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span className="text-primary font-medium">₹{property.price.toLocaleString()}/month</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1 fill-current" />
                            <span className="text-muted-foreground">{property.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Searches & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Searches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{search.query}</p>
                          <p className="text-sm text-muted-foreground">{search.results} results • {search.date}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex items-center justify-between" asChild>
                    <Link href="/browse">
                      <div className="flex items-center space-x-3">
                        <Search className="w-5 h-5 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">Search Properties</p>
                          <p className="text-sm text-muted-foreground">Find your perfect home</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex items-center justify-between" asChild>
                    <Link href="/dashboard/user/chat">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-blue-500" />
                        <div className="text-left">
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">Chat with property owners</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex items-center justify-between" asChild>
                    <Link href="/dashboard/user/favorites">
                      <div className="flex items-center space-x-3">
                        <Heart className="w-5 h-5 text-red-500" />
                        <div className="text-left">
                          <p className="font-medium">Saved Properties</p>
                          <p className="text-sm text-muted-foreground">View your favorites</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
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

export default UserDashboard;