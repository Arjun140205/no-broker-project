import { loadScript } from '../utils/script-loader';

interface PaymentOptions {
  amount: number;
  currency: string;
  propertyId: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export const initializeRazorpay = async (options: PaymentOptions) => {
  try {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      throw new Error('Razorpay SDK failed to load');
    }

    const rzp = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: options.amount * 100, // Razorpay expects amount in paise
      currency: options.currency,
      name: 'Estospaces',
      description: 'Property Booking Payment',
      handler: function (response: any) {
        options.onSuccess(response);
      },
      prefill: {
        name: 'User',
        email: 'user@example.com',
      },
      theme: {
        color: '#4f46e5',
      },
    });

    rzp.open();
  } catch (error) {
    options.onError(error);
  }
};

export const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
  // Implement payment verification with your backend
  const response = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentId,
      orderId,
      signature,
    }),
  });

  return response.json();
};
