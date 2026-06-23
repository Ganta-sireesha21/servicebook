import { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      api.get('/users/me').then((response) => setProfile(response.data.user));
      bookingService.getUserBookings().then((data) => setBookings(data.bookings || []));
    }
  }, [user]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put('/users/me', { name: profile.name, phone: profile.phone });
      setProfile(response.data.user);
      setStatus('Profile updated successfully.');
    } catch (err) {
      setStatus('Unable to update profile.');
    }
  };

  const handleCancel = async (bookingId) => {
    await bookingService.cancelBooking(bookingId);
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  };

  if (!user) {
    return <div className="px-6 py-10">Please login to manage your profile.</div>;
  }

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-3xl bg-slate-50 p-8">
            <img src={profile.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'} alt="Profile avatar" className="mb-6 h-28 w-28 rounded-full object-cover" />
            <h2 className="text-2xl font-semibold text-slate-950">{profile.name}</h2>
            <p className="text-slate-600">{profile.email}</p>
            <p className="mt-4 text-slate-600">Phone: {profile.phone || 'Not set'}</p>
            <button onClick={logout} className="mt-6 w-full rounded-full bg-red-600 px-6 py-3 text-white hover:bg-red-700">Logout</button>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Personal Information</h3>
              <p className="text-slate-600">Update your name and phone number here.</p>
            </div>
            <form onSubmit={handleUpdate} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-slate-700">Name</span>
                <input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-700">Phone</span>
                <input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-3" />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="rounded-full bg-primary px-6 py-3 text-white">Save Changes</button>
              </div>
            </form>
            {status && <p className="rounded-3xl bg-emerald-100 p-4 text-emerald-700">{status}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Booking History</h2>
            <p className="text-slate-600">View all of your current and past bookings.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {bookings.length === 0 && <p className="text-slate-600">No bookings found.</p>}
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-3xl border border-slate-200 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{booking.service.title}</p>
                  <p className="text-sm text-slate-600">{booking.booking_date} at {booking.booking_time}</p>
                </div>
                <div className="flex gap-3">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 capitalize">{booking.status}</span>
                  {booking.status === 'pending' && (
                    <button onClick={() => handleCancel(booking.id)} className="rounded-full bg-red-600 px-4 py-2 text-sm text-white">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
