import React, { useState } from 'react';
import { initializeRazorpay } from '../../services/razorpay';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface BookingFormProps {
  propertyId: string;
  propertyPrice: number;
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ propertyId, propertyPrice, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError('');

      // Create booking order
      const orderResponse = await api.post(`/book/${propertyId}`, {
        userId: user?.id,
        amount: propertyPrice,
      });

      // Initialize Razorpay payment
      await initializeRazorpay({
        amount: propertyPrice,
        currency: 'INR',
        propertyId,
        onSuccess: async (response) => {
          try {
            // Verify payment and confirm booking
            await api.post(`/book/${propertyId}/confirm`, {
              orderId: orderResponse.data.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            onSuccess();
          } catch (error) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        onError: (error) => {
          setError('Payment failed. Please try again.');
          console.error('Payment error:', error);
        },
      });
    } catch (error) {
      setError('Failed to initiate booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleBooking}
        disabled={loading}
        className={`w-full bg-indigo-600 text-white px-4 py-2 rounded-md ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default BookingForm;
