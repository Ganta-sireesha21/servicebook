import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft text-center">
        <h1 className="text-3xl font-semibold text-slate-950">Payment Cancelled</h1>
        <p className="mt-3 text-slate-600">Your payment was cancelled. You can try again from your booking page.</p>
        <p className="mt-5 text-slate-700">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
