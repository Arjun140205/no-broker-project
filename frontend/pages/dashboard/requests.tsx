import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../../services/api';
import { Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

const BookingRequests = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        setLoading(true);
        const data = await bookingAPI.getReceivedBookings();
        setBookings(data);
      } catch (err: any) {
        console.error('Error fetching booking requests:', err);
        setError('Failed to load booking requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookingRequests();
    }
  }, [user]);

  const handleAcceptBooking = async (id: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      await bookingAPI.acceptBooking(id);
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'accepted' } : booking
      ));
      // Success notification would go here
      // e.g., toast.success('Booking accepted successfully');
    } catch (err: any) {
      console.error('Error accepting booking:', err);
      // Error notification would go here
      // e.g., toast.error('Failed to accept booking');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRejectBooking = async (id: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      await bookingAPI.rejectBooking(id);
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'rejected' } : booking
      ));
      // Success notification would go here
      // e.g., toast.success('Booking rejected');
    } catch (err: any) {
      console.error('Error rejecting booking:', err);
      // Error notification would go here
      // e.g., toast.error('Failed to reject booking');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Booking Requests</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-10 bg-white shadow rounded-lg">
          <p className="text-gray-500">You don't have any booking requests yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {booking.property?.title || 'Unknown Property'}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        From: {booking.user?.name || 'Unknown user'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Requested on {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleAcceptBooking(booking.id)}
                        disabled={actionLoading[booking.id]}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        {actionLoading[booking.id] ? 'Processing...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleRejectBooking(booking.id)}
                        disabled={actionLoading[booking.id]}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {actionLoading[booking.id] ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
