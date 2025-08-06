import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Property } from '../types';
import { propertyAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const BrowseProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
  });
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getAllProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters whenever filters state changes
  useEffect(() => {
    let result = [...properties];

    // Filter by location
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      result = result.filter(property => 
        property.location.toLowerCase().includes(locationQuery)
      );
    }

    // Filter by min price
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        result = result.filter(property => property.price >= minPrice);
      }
    }

    // Filter by max price
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        result = result.filter(property => property.price <= maxPrice);
      }
    }

    setFilteredProperties(result);
  }, [filters, properties]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      location: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Browse Properties</h1>
          <p className="mt-2 text-gray-600">Find your next perfect place to stay</p>
        </div>

        {user && (
          <Link href="/dashboard" className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Go to Dashboard
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Properties</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g. New York"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price ($)</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price ($)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="1000"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Properties Display */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No properties found matching your criteria.</p>
          {filters.location || filters.minPrice || filters.maxPrice ? (
            <button
              onClick={clearFilters}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Clear filters to see all properties
            </button>
          ) : (
            <p className="mt-2 text-gray-500">Check back later for new listings.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

// Property card component
interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {property.imageUrl ? (
          <div className="h-48 w-full bg-gray-200 relative">
            <img 
              src={property.imageUrl} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 truncate">{property.title}</h3>
          <p className="text-indigo-600 font-medium mt-1">${property.price}/night</p>
          <p className="text-gray-500 text-sm mt-1 truncate">{property.location}</p>
          {property.owner && (
            <p className="text-gray-500 text-xs mt-2">Posted by: {property.owner.name}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BrowseProperties;
