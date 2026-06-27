import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import paymentService from '../services/paymentService';
import bookingService from '../services/bookingService';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    bookingService.getBookingById(id).then((data) => setBooking(data.booking));
  }, [id]);

  const loadRazorpaySDK = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        return resolve(window.Razorpay);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!booking) return;
    setIsSubmitting(true);
    setMessage('Preparing payment...');

    try {
      const response = await paymentService.createOrder(booking.id);
      const order = response.order;
      const Razorpay = await loadRazorpaySDK();

      const options = {
        key: order.key_id,
        amount: Math.round(Number(order.amount) * 100),
        currency: order.currency,
        name: booking.services.title,
        description: booking.services.description || 'Service booking payment',
        order_id: order.order_id,
        handler: async (paymentResult) => {
          try {
            await paymentService.verifyPayment({
              booking_id: booking.id,
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_signature: paymentResult.razorpay_signature
            });
            setMessage('Payment verified successfully. Redirecting to dashboard...');
            setTimeout(() => navigate('/dashboard'), 1200);
          } catch (verifyError) {
            setMessage(verifyError.response?.data?.message || verifyError.message || 'Payment verification failed.');
          }
        },
        theme: {
          color: '#2563eb'
        }
      };

      const paymentObject = new Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Payment failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking) {
    return <div className="px-6 py-10">Loading payment page...</div>;
  }

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-slate-950">Checkout for {booking.services.title}</h1>
          <p className="text-slate-600">Complete your payment to confirm the booking.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Service</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">{booking.services.title}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Amount</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">INR {Number(booking.services.price).toFixed(2)}</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full bg-primary px-8 py-4 text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleCheckout}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing payment...' : 'Pay Now'}
          </button>
          {message && <p className="rounded-3xl bg-slate-50 p-4 text-slate-700">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
