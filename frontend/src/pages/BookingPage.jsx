import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookingService from '../services/bookingService';
import serviceService from '../services/serviceService';
import { useAuth } from '../context/AuthContext';

const availableSlots = ['09:00', '11:00', '13:00', '15:00', '17:00'];

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id) {
      serviceService.getById(id).then((data) => setService(data.service));
    }
  }, [id, navigate, user]);

  const validated = useMemo(() => {
    return bookingDate && bookingTime;
  }, [bookingDate, bookingTime]);

  const submitBooking = async (event) => {
    event.preventDefault();
    if (!validated || !service) return;

    try {
      await bookingService.createBooking({
        service_id: service.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes
      });
      setStatus('Your booking request was submitted successfully.');
      setBookingDate('');
      setBookingTime('09:00');
      setNotes('');
    } catch (error) {
      setStatus('Unable to submit booking. Try again later.');
    }
  };

  if (!service) {
    return <div className="px-6 py-10">Loading booking form...</div>;
  }

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-slate-950">Book {service.title}</h1>
          <p className="text-slate-600">Choose a date and time slot that works best for you.</p>
          <form onSubmit={submitBooking} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Preferred Date</span>
                <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full px-4 py-3" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Time Slot</span>
                <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full px-4 py-3">
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Notes</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" className="w-full px-4 py-3"></textarea>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Booking summary</p>
              <div className="mt-4 grid gap-3 text-slate-700 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase text-slate-500">Service</p>
                  <p className="text-base font-semibold">{service.title}</p>
                </div>
                <div>
                  <p className="text-sm uppercase text-slate-500">Price</p>
                  <p className="text-base font-semibold">{service.formatted_price}</p>
                </div>
                <div>
                  <p className="text-sm uppercase text-slate-500">Date</p>
                  <p className="text-base font-semibold">{bookingDate || 'Select a date'}</p>
                </div>
                <div>
                  <p className="text-sm uppercase text-slate-500">Time</p>
                  <p className="text-base font-semibold">{bookingTime}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-600">Complete the form to submit your booking request.</span>
              <button type="submit" disabled={!validated} className="rounded-full bg-primary px-6 py-4 text-white disabled:cursor-not-allowed disabled:opacity-50">
                Confirm Booking
              </button>
            </div>
            {status && <p className="rounded-3xl bg-emerald-100 p-4 text-emerald-700">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
