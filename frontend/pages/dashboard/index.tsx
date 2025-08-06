import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router, mounted]);

  // Don't render anything until after mounting to prevent hydration issues
  if (!mounted) {
    return null;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="My Properties" 
          description="Manage your property listings"
          link="/dashboard/my-properties"
          icon="🏠"
        />
        <DashboardCard 
          title="My Bookings" 
          description="View your booking requests"
          link="/dashboard/bookings"
          icon="📅"
        />
        <DashboardCard 
          title="Booking Requests" 
          description="Manage booking requests for your properties"
          link="/dashboard/requests"
          icon="📨"
        />
        <DashboardCard 
          title="Messages" 
          description="View your conversation history"
          link="/dashboard/chat"
          icon="💬"
        />
      </div>
    </div>
  );
};

// Dashboard card component
interface DashboardCardProps {
  title: string;
  description: string;
  link: string;
  icon: string;
}

const DashboardCard = ({ title, description, link, icon }: DashboardCardProps) => {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default Dashboard;
