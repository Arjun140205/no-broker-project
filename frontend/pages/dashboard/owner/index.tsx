import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye,
  MessageCircle,
  Star,
  Plus,
  ArrowRight,
  Home,
  MapPin,
  Clock
} from 'lucide-react';
import Link from 'next/link';

const OwnerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeListings: 0,
    pendingBookings: 0,
    totalViews: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'owner') {
      router.push('/dashboard/user');
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, [isAuthenticated, user, router]);

  const fetchDashboardStats = async () => {
    // Mock data for now
    setStats({
      totalProperties: 12,
      totalBookings: 45,
      totalRevenue: 125000,
      activeListings: 8,
      pendingBookings: 3,
      totalViews: 1250,
    });
  };

  const recentProperties = [
    {
      id: '1',
      title: 'Luxury Penthouse Downtown',
      location: 'Downtown, Mumbai',
      price: 25000,
      views: 156,
      bookings: 3,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Modern Villa Suburbs',
      location: 'Bandra, Mumbai',
      price: 35000,
      views: 89,
      bookings: 1,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Cozy Studio Apartment',
      location: 'Andheri, Mumbai',
      price: 15000,
      views: 234,
      bookings: 5,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
    }
  ];

  const recentBookings = [
    {
      id: '1',
      propertyTitle: 'Luxury Penthouse Downtown',
      guestName: 'John Doe',
      checkIn: '2024-02-15',
      checkOut: '2024-02-20',
      amount: 125000,
      status: 'pending'
    },
    {
      id: '2',
      propertyTitle: 'Modern Villa Suburbs',
      guestName: 'Jane Smith',
      checkIn: '2024-02-18',
      checkOut: '2024-02-25',
      amount: 245000,
      status: 'confirmed'
    },
    {
      id: '3',
      propertyTitle: 'Cozy Studio Apartment',
      guestName: 'Mike Johnson',
      checkIn: '2024-02-12',
      checkOut: '2024-02-14',
      amount: 30000,
      status: 'completed'
    }
  ];

  if (!isAuthenticated || user?.role !== 'owner') {
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
                Manage your properties and track your success
              </p>
            </div>
            <Button className="btn-premium mt-4 md:mt-0" asChild>
              <Link href="/dashboard/owner/add-property">
                <Plus className="w-4 h-4 mr-2" />
                Add New Property
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
                  <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalProperties}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">+2 this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">+15% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Clock className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-orange-500">{stats.pendingBookings} pending</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalViews}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">+8% this week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Properties */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Recent Properties</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/owner/properties">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProperties.map((property) => (
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
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-primary font-medium">₹{property.price.toLocaleString()}/month</span>
                          <span className="text-muted-foreground">{property.views} views</span>
                          <span className="text-emerald-500">{property.bookings} bookings</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-premium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Recent Bookings</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/owner/bookings">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{booking.propertyTitle}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Guest: {booking.guestName}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {booking.checkIn} - {booking.checkOut}
                        </span>
                        <span className="font-medium text-primary">₹{booking.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2" asChild>
                  <Link href="/dashboard/owner/add-property">
                    <Plus className="w-8 h-8 text-primary" />
                    <span className="font-medium">Add Property</span>
                    <span className="text-sm text-muted-foreground">List a new property</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2" asChild>
                  <Link href="/dashboard/owner/chat">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                    <span className="font-medium">Messages</span>
                    <span className="text-sm text-muted-foreground">Chat with guests</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2" asChild>
                  <Link href="/dashboard/owner/analytics">
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                    <span className="font-medium">Analytics</span>
                    <span className="text-sm text-muted-foreground">View performance</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;