import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import paymentService from '../services/paymentService';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying payment...');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setMessage('Missing payment session.');
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        await paymentService.verifyPayment({ session_id: sessionId });
        setMessage('Payment verified successfully! Redirecting to dashboard...');
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Unable to verify payment.');
      }
    };

    verify();
  }, [navigate, searchParams]);

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft text-center">
        <h1 className="text-3xl font-semibold text-slate-950">Payment {status === 'success' ? 'Successful' : status === 'error' ? 'Error' : 'Pending'}</h1>
        <p className="mt-3 text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
