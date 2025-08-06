import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { Property } from '../../types';
import { propertyAPI, chatAPI, bookingAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

const PropertyDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || typeof id !== 'string') return;

      try {
        setLoading(true);
        const propertyData = await propertyAPI.getPropertyById(id);
        setProperty(propertyData);
      } catch (error) {
        console.error('Failed to fetch property:', error);
        toast.error('Failed to load property details');
        router.push('/browse');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, router]);

  const handleDelete = async () => {
    if (!property || !window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      setDeleting(true);
      await propertyAPI.deleteProperty(property.id);
      toast.success('Property deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast.error('Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const handleContactOwner = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to contact the owner');
      router.push('/login');
      return;
    }

    if (!property) return;

    try {
      await chatAPI.startChat(property.id);
      toast.success('Chat started! Check your messages.');
      router.push('/dashboard/chat');
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const handleBookProperty = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book this property');
      router.push('/login');
      return;
    }

    if (!property) return;

    try {
      await bookingAPI.sendBookingRequest(property.id);
      toast.success('Booking request sent! The owner will review your request.');
      router.push('/dashboard/bookings');
    } catch (error) {
      console.error('Failed to send booking request:', error);
      toast.error('Failed to send booking request');
    }
  };

  const isOwner = user && property && user.id === property.ownerId;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Property not found</h1>
        <p className="mt-2 text-gray-600">The property you're looking for does not exist or has been removed.</p>
        <div className="mt-6">
          <Link href="/browse" className="text-indigo-600 hover:text-indigo-500">
            Browse all properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/browse" className="text-indigo-600 hover:text-indigo-500">
          ← Back to properties
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {/* Property Image */}
        <div className="h-96 w-full bg-gray-200 relative">
          {property.imageUrl ? (
            <img 
              src={property.imageUrl} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <p className="mt-2 text-gray-600">{property.location}</p>
            </div>
            <div className="text-2xl font-bold text-indigo-600">${property.price}/night</div>
          </div>

          {/* Owner Information */}
          <div className="mt-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500">
              Posted by: {property.owner?.name || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500">
              Posted on: {new Date(property.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {isOwner ? (
              <>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Property'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleBookProperty}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Book This Property
                </button>
                <button
                  onClick={handleContactOwner}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Contact Owner
                </button>
              </>
            )}
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-2">
                Please <Link href="/login" className="text-indigo-600 hover:text-indigo-500">sign in</Link> to book this property.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
