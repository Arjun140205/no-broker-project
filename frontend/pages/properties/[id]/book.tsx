import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar } from '../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import DatePicker from 'react-datepicker';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Square,
  ArrowLeft,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Wifi,
  Car,
  Coffee
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format, differenceInDays, addDays } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookProperty = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (id) {
      fetchProperty();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (checkInDate && checkOutDate && property) {
      const days = differenceInDays(checkOutDate, checkInDate);
      setNumberOfDays(days);
      setTotalAmount(days * property.price);
    }
  }, [checkInDate, checkOutDate, property]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        toast.error('Property not found');
        router.push('/browse');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (checkInDate >= checkOutDate) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (checkInDate < new Date()) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    setBookingLoading(true);

    try {
      // Create booking
      const bookingResponse = await fetch(`/api/book/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
        }),
      });

      if (!bookingResponse.ok) {
        const error = await bookingResponse.json();
        toast.error(error.message || 'Failed to create booking');
        return;
      }

      const booking = await bookingResponse.json();

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Payment gateway failed to load');
        return;
      }

      // Create payment order
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
        toast.error('Failed to create payment order');
        return;
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EstoSpaces',
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
              router.push('/dashboard/user/bookings');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#667eea',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="loading-shimmer w-96 h-64 rounded-xl"></div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link href={`/properties/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Property
            </Link>
          </Button>
          <h1 className="text-4xl font-display font-bold gradient-text mb-2">
            Book Your Stay
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete your booking for this amazing property
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="card-premium mb-6">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={property.images?.[0] || property.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'}
                    alt={property.title}
                    className="w-32 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{property.title}</h2>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <span>{property.area} sq ft</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center mt-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-medium">4.8 (124 reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">₹{property.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">per night</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Select Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check-in Date</label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => setCheckInDate(date)}
                      minDate={new Date()}
                      maxDate={addDays(new Date(), 365)}
                      placeholderText="Select check-in date"
                      className="w-full p-3 rounded-lg border border-border bg-background"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Check-out Date</label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      minDate={checkInDate ? addDays(checkInDate, 1) : addDays(new Date(), 1)}
                      maxDate={addDays(new Date(), 365)}
                      placeholderText="Select check-out date"
                      className="w-full p-3 rounded-lg border border-border bg-background"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>

                {checkInDate && checkOutDate && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{numberOfDays} nights</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Dates:</span>
                      <span className="font-medium">
                        {format(checkInDate, 'dd MMM')} - {format(checkOutDate, 'dd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-premium sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkInDate && checkOutDate ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>₹{property.price.toLocaleString()} × {numberOfDays} nights</span>
                        <span>₹{(property.price * numberOfDays).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>₹0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxes</span>
                        <span>₹0</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full btn-premium" 
                      onClick={handleBooking}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        'Processing...'
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Book Now & Pay
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      <span>Secure payment powered by Razorpay</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Select your check-in and check-out dates to see the total price
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium">What's included:</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Free cancellation for 48 hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>24/7 customer support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Verified property owner</span>
                    </div>
                  </div>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Amenities:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {property.amenities.slice(0, 6).map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          {amenity === 'WiFi' && <Wifi className="w-3 h-3" />}
                          {amenity === 'Parking' && <Car className="w-3 h-3" />}
                          {amenity === 'Coffee' && <Coffee className="w-3 h-3" />}
                          <span className="text-muted-foreground">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookProperty;