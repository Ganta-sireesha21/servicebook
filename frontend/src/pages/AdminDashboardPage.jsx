import { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import userService from '../services/userService';
import serviceService from '../services/serviceService';

const AdminDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    bookingService.getAllBookings().then((data) => setBookings(data.bookings || []));
    serviceService.getAll().then((data) => setServices(data.services || []));
    userService.getAllUsers().then((data) => setUsers(data.users || []));
  }, []);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((booking) => booking.status === 'pending').length;
  const revenue = bookings.reduce((sum, booking) => {
    return sum + Number(booking.services?.price || 0);
  }, 0);

  const stats = [
    { title: 'Total Services', value: services.length },
    { title: 'Total Bookings', value: totalBookings },
    { title: 'Revenue', value: `INR ${revenue.toFixed(2)}` },
    { title: 'Pending Bookings', value: pendingBookings }
  ];

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="grid gap-6 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className="rounded-3xl bg-white p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.title}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-950">Recent Bookings</h2>
          <div className="mt-6 space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="rounded-3xl border border-slate-200 p-6 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{booking.services?.title}</p>
                  <p className="text-sm text-slate-600">{booking.booking_date} at {booking.booking_time}</p>
                  <p className="text-sm text-slate-600">{booking.users?.name || booking.user_id}</p>
                </div>
                <span className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 capitalize sm:mt-0">{booking.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-950">Customer List</h2>
          <div className="mt-6 space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="rounded-3xl border border-slate-200 p-6">
                <p className="font-semibold text-slate-950">{user.name}</p>
                <p className="text-sm text-slate-600">{user.email}</p>
                <p className="text-sm text-slate-600">{user.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
