import React, { useEffect, useState } from 'react';
import { propertyAPI } from '../services/api';
import { Property } from '../types';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getAllProperties();
        // Make sure data is an array before setting it
        if (Array.isArray(data)) {
          setProperties(data);
        } else {
          console.error('API did not return an array:', data);
          setProperties([]);
          setError('Received invalid data format from server');
        }
      } catch (err: any) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading properties...</div>;
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
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Estospaces
            </h1>
            <p className="mt-6 text-xl max-w-2xl">
              Find the perfect space for your next project or event. Browse through our curated list of premium properties.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/browse" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-md font-medium text-base shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                Browse Properties
              </Link>
              {!isAuthenticated && (
                <Link href="/register" className="inline-block bg-indigo-800 text-white px-8 py-3 rounded-md font-medium text-base shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400">
                  Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Featured Properties</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Check out our handpicked selection of premium spaces
          </p>
        </div>
        
        {Array.isArray(properties) ? (
          properties.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No properties available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.slice(0, 6).map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`} className="block">
                  <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="h-60 w-full bg-gray-200 relative">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-0 right-0 mt-3 mr-3 px-3 py-1 bg-indigo-600 text-white text-sm font-bold rounded-full">
                        ${property.price}/night
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                      <p className="mt-2 text-gray-500 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.location}
                      </p>
                      <p className="mt-3 text-gray-600 line-clamp-2">{property.description}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm text-indigo-600 font-medium">View details &rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Error loading properties. Please try again.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
