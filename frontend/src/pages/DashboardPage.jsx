import { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import serviceService from '../services/serviceService';

const DashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    bookingService.getUserBookings().then((data) => setBookings(data.bookings || []));
    serviceService.getAll().then((data) => setServices(data.services || []));
  }, []);

  const totalBookings = bookings.length;
  const confirmed = bookings.filter((booking) => booking.status === 'confirmed').length;

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">My Bookings</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{totalBookings}</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Confirmed</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{confirmed}</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Available Services</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{services.length}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">Upcoming Bookings</h2>
        <div className="mt-6 space-y-4">
          {bookings.length === 0 ? (
            <p className="text-slate-600">No upcoming bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="rounded-3xl border border-slate-200 p-6 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{booking.services?.title || 'Unnamed service'}</p>
                  <p className="text-sm text-slate-600">{booking.booking_date} at {booking.booking_time}</p>
                </div>
                <span className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 capitalize sm:mt-0">{booking.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
