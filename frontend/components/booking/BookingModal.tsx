import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import DatePicker from 'react-datepicker';
import { format, differenceInDays } from 'date-fns';
import { 
  X, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Square,
  Crown,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';
import { Property } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import "react-datepicker/dist/react-datepicker.css";

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingModal: React.FC<BookingModalProps> = ({ property, isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'dates' | 'payment'>('dates');

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const days = differenceInDays(checkOut, checkIn);
    return days * property.price;
  };

  const handleDateSelection = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select both check-in and check-out dates');
      return;
    }

    if (checkIn >= checkOut) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (checkIn < new Date()) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    setStep('payment');
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a property');
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error('Please select dates');
      return;
    }

    setLoading(true);

    try {
      // Create booking
      const bookingResponse = await fetch(`/api/book/${property.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await bookingResponse.json();

      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bookingId: booking.booking.id,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Estospaces',
        description: `Booking for ${property.title}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking.booking.id,
              }),
            });

            if (verifyResponse.ok) {
              toast.success('Booking confirmed! Payment successful.');
              onClose();
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking');
    } finally {
      setLoading(false);
    }
  };

  const days = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const total = calculateTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="glass-effect border-primary/20 luxury-shadow">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute right-4 top-4 glass-effect border-0"
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center space-x-3 mb-4">
                  <Crown className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl font-display">Book Your Stay</CardTitle>
                  <Sparkles className="w-5 h-5 text-gold-500" />
                </div>

                {/* Property Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{property.title}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>3 Beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>2 Baths</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      <span>1200 sq ft</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === 'dates' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Check-in Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <DatePicker
                            selected={checkIn}
                            onChange={(date) => setCheckIn(date)}
                            minDate={new Date()}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholderText="Select check-in"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Check-out Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <DatePicker
                            selected={checkOut}
                            onChange={(date) => setCheckOut(date)}
                            minDate={checkIn || new Date()}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholderText="Select check-out"
                          />
                        </div>
                      </div>
                    </div>

                    {checkIn && checkOut && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-effect p-4 rounded-lg space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span>Duration:</span>
                          <span className="font-semibold">{days} {days === 1 ? 'night' : 'nights'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Rate per night:</span>
                          <span className="font-semibold">₹{property.price.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-border pt-3">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total Amount:</span>
                            <span className="gradient-text">₹{total.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <Button
                      onClick={handleDateSelection}
                      disabled={!checkIn || !checkOut}
                      className="w-full btn-premium"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Continue to Payment
                    </Button>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="glass-effect p-6 rounded-lg space-y-4">
                      <h4 className="font-semibold text-lg flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-500" />
                        Booking Summary
                      </h4>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span className="font-medium">{checkIn && format(checkIn, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span className="font-medium">{checkOut && format(checkOut, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{days} {days === 1 ? 'night' : 'nights'}</span>
                        </div>
                        <div className="border-t border-border pt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount:</span>
                            <span className="gradient-text">₹{total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep('dates')}
                        className="flex-1 glass-effect border-primary/20"
                      >
                        Back to Dates
                      </Button>
                      <Button
                        onClick={handleBooking}
                        disabled={loading}
                        className="flex-1 btn-premium"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {loading ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;