import React, { useEffect, useState } from 'react';
import { propertyAPI } from '../../services/api';
import { Property } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MyProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getMyProperties();
        setProperties(data);
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        setError('Failed to load your properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyProperties();
    }
  }, [user]);

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.deleteProperty(id);
        setProperties(properties.filter(property => property.id !== id));
        // Success notification would go here
        // e.g., toast.success('Property deleted successfully');
      } catch (err: any) {
        console.error('Error deleting property:', err);
        // Error notification would go here
        // e.g., toast.error('Failed to delete property');
      }
    }
  };

  if (authLoading || (loading && user)) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Properties</h1>
        <Link
          href="/dashboard/new-property"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Property
        </Link>
      </div>
      
      {properties.length === 0 ? (
        <div className="text-center py-10 bg-white shadow rounded-lg">
          <p className="text-gray-500 mb-4">You haven't listed any properties yet.</p>
          <Link
            href="/dashboard/new-property"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Add your first property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg">
              {property.imageUrl && (
                <div className="h-48 w-full bg-gray-200">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{property.location}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">${property.price}/day</p>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{property.description}</p>
                <div className="mt-4 flex justify-between">
                  <Link
                    href={`/dashboard/edit-property/${property.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
