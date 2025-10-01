import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Crown,
  Plus,
  Building2,
  Users,
  Calendar,
  TrendingUp,
  MessageCircle,
  Star,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Square,
  IndianRupee,
  Phone,
  Mail,
  User,
  Camera,
  Save,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Property {
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
  category: string;
  available: boolean;
  createdAt: string;
}

interface OwnerProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  verified: boolean;
}

const OwnerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [profile, setProfile] = useState<OwnerProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    avatar: '',
    verified: false,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'owner') {
      router.push('/dashboard');
      return;
    }

    fetchProperties();
    fetchProfile();
  }, [isAuthenticated, user, router]);

  const fetchProperties = async () => {
    try {
      // Mock data for now
      const mockProperties: Property[] = [
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
          category: 'rent',
          available: true,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          title: 'Modern Villa with Pool',
          description: 'Spacious villa with private swimming pool',
          price: 25000,
          location: 'Goa, India',
          images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
          bedrooms: 4,
          bathrooms: 3,
          area: 3500,
          type: 'villa',
          category: 'rent',
          available: true,
          createdAt: '2024-01-10',
        },
      ];
      setProperties(mockProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      // Mock profile data
      setProfile({
        name: user?.name || 'Property Owner',
        email: user?.email || 'owner@example.com',
        phone: '+91 98765 43210',
        bio: 'Experienced property owner with premium listings across major cities.',
        avatar: '',
        verified: true,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // API call to update profile
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const stats = [
    {
      title: 'Total Properties',
      value: properties.length,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Active Bookings',
      value: 12,
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Revenue',
      value: '₹2,45,000',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Messages',
      value: 8,
      icon: MessageCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
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
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold gradient-text">
                  Owner Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage your premium property portfolio
                </p>
              </div>
            </div>
            <Button className="btn-premium">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
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
            <TabsTrigger value="properties" className="data-[state=active]:bg-primary/10">
              Properties
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary/10">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Properties */}
              <Card className="glass-effect border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Recent Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {properties.slice(0, 3).map((property) => (
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
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-effect border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/10">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">New booking for Luxury Penthouse</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500/10">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Property viewed 15 times</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-500/10">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">New message from guest</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Properties</h2>
              <Button className="btn-premium">
                <Plus className="w-4 h-4 mr-2" />
                Add New Property
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
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
                          <Button size="sm" variant="outline" className="glass-effect border-primary/20">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="glass-effect border-red-500/20 text-red-500">
                            <Trash2 className="w-4 h-4" />
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
                  {profile.verified && (
                    <div className="ml-2 flex items-center text-green-600">
                      <Sparkles className="w-4 h-4 mr-1" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 premium-gradient rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Tell guests about yourself and your properties..."
                    />
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} className="btn-premium">
                  <Save className="w-4 h-4 mr-2" />
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

export default OwnerDashboard;