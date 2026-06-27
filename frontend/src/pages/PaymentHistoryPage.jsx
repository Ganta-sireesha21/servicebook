import { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    paymentService.getPayments().then((data) => setPayments(data.payments || []));
  }, []);

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-950">Payment History</h1>
        <p className="mt-3 text-slate-600">Review all payment transactions tied to your bookings.</p>
      </div>
      <div className="space-y-4">
        {payments.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-slate-600">No payment records found.</div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">Booking {payment.booking_id}</p>
                  <p className="text-sm text-slate-600">Status: {payment.payment_status}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-slate-950">INR {Number(payment.amount).toFixed(2)}</p>
                  <p className="text-sm text-slate-600">{new Date(payment.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
