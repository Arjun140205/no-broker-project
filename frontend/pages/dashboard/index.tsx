import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Home,
  Building2,
  Calendar,
  MessageCircle,
  Heart,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Plus,
  ArrowRight,
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Layout from '../../components/Layout';


const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    properties: 0,
    bookings: 0,
    messages: 0,
    favorites: 0
  });

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect based on user role
    if (user?.role === 'owner') {
      router.push('/dashboard/owner');
    } else if (user?.role === 'seeker') {
      router.push('/dashboard/user');
    } else {
      // Fallback for existing dashboard
      setStats({
        properties: user?.role === 'owner' ? 3 : 0,
        bookings: user?.role === 'seeker' ? 2 : 5,
        messages: 8,
        favorites: 4
      });
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      title: 'Booking Request Sent',
      description: 'Luxury Penthouse in Downtown',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      description: 'John Smith sent you a message',
      time: '4 hours ago',
      status: 'unread'
    },
    {
      id: 3,
      type: 'property',
      title: 'Property Listed',
      description: 'Modern Family Villa',
      time: '1 day ago',
      status: 'active'
    },
    {
      id: 4,
      type: 'favorite',
      title: 'Property Saved',
      description: 'Waterfront Condo',
      time: '2 days ago',
      status: 'saved'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Properties',
      description: 'Find your perfect home',
      icon: Home,
      href: '/browse',
      color: 'bg-realestate-500'
    },
    {
      title: 'My Properties',
      description: 'Manage your listings',
      icon: Building2,
      href: '/dashboard/my-properties',
      color: 'bg-luxury-500'
    },
    {
      title: 'Bookings',
      description: 'View booking requests',
      icon: Calendar,
      href: '/dashboard/bookings',
      color: 'bg-success-500'
    },
    {
      title: 'Messages',
      description: 'Check your inbox',
      icon: MessageCircle,
      href: '/dashboard/chat',
      color: 'bg-blue-500'
    }
  ];

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your account today.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-realestate-500 to-realestate-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-realestate-100 text-sm font-medium">Properties</p>
                    <p className="text-3xl font-bold">{stats.properties}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-realestate-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-luxury-500 to-luxury-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-luxury-100 text-sm font-medium">Bookings</p>
                    <p className="text-3xl font-bold">{stats.bookings}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-luxury-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-success-500 to-success-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-success-100 text-sm font-medium">Messages</p>
                    <p className="text-3xl font-bold">{stats.messages}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-success-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Favorites</p>
                    <p className="text-3xl font-bold">{stats.favorites}</p>
                  </div>
                  <Heart className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-large transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-realestate-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-realestate-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" className="text-realestate-600 hover:text-realestate-700">
                View All
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-realestate-100 flex items-center justify-center">
                        {activity.type === 'booking' && <Calendar className="w-5 h-5 text-realestate-600" />}
                        {activity.type === 'message' && <MessageCircle className="w-5 h-5 text-realestate-600" />}
                        {activity.type === 'property' && <Building2 className="w-5 h-5 text-realestate-600" />}
                        {activity.type === 'favorite' && <Heart className="w-5 h-5 text-realestate-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{activity.time}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          activity.status === 'unread' ? 'bg-red-100 text-red-800' :
                            activity.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Properties */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {user?.role === 'owner' ? 'Your Properties' : 'Recommended for You'}
              </h2>
              <Button variant="ghost" className="text-realestate-600 hover:text-realestate-700">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden hover:shadow-large transition-all duration-300">
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&v=${item}`}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-bold text-gray-900">
                      $2,500/mo
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        Luxury Property {item}
                      </h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium ml-1">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">Downtown, City Center</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-realestate-600 font-semibold">View Details</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
