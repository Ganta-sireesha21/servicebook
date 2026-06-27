import { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingService.getAllBookings().then((data) => setBookings(data.bookings || []));
  }, []);

  const handleAction = async (id, action) => {
    await bookingService.adminAction(id, action);
    setBookings((prev) => prev.map((booking) => booking.id === id ? { ...booking, status: action === 'confirm' ? 'confirmed' : action === 'complete' ? 'completed' : 'cancelled' } : booking));
  };

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-950">Booking Management</h1>
        <p className="mt-3 text-slate-600">Review bookings, confirm service requests, and mark completed work.</p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-slate-600">No bookings available.</div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold text-slate-950">{booking.services?.title}</p>
                  <p className="text-sm text-slate-600">Customer: {booking.users?.name || booking.user_id}</p>
                  <p className="text-sm text-slate-600">{booking.booking_date} at {booking.booking_time}</p>
                  <p className="text-sm text-slate-600">Status: {booking.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(booking.id, 'confirm')} className="rounded-full bg-emerald-600 px-4 py-2 text-white">Confirm</button>
                      <button onClick={() => handleAction(booking.id, 'cancel')} className="rounded-full bg-red-600 px-4 py-2 text-white">Cancel</button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button onClick={() => handleAction(booking.id, 'complete')} className="rounded-full bg-blue-600 px-4 py-2 text-white">Complete</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
