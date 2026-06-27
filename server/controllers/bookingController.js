import supabase from '../config/supabaseClient.js';
import { sendNotification } from '../utils/notificationUtils.js';

export const createBooking = async (req, res) => {
  const { service_id, booking_date, booking_time, notes } = req.body;
  const user_id = req.user.id;

  if (!service_id || !booking_date || !booking_time) {
    return res.status(400).json({ message: 'Service, date, and time are required' });
  }

  const { data, error } = await supabase.from('bookings').insert([
    {
      user_id,
      service_id,
      booking_date,
      booking_time,
      notes,
      status: 'pending'
    }
  ]).select('*').single();

  if (error) {
    console.error('Supabase booking insert error:', error);
    const isRlsError = error.message && error.message.toLowerCase().includes('row-level security');
    return res.status(500).json({
      message: isRlsError
        ? 'Supabase row-level security blocked the booking insert. Make sure the backend is using a valid SUPABASE_SERVICE_ROLE_KEY and the database RLS policies permit this action.'
        : error.message
    });
  }

  await sendNotification({
    user_id,
    title: 'Booking Created',
    message: `Your booking request for ${data.booking_date} at ${data.booking_time} has been created and is pending confirmation.`
  });

  res.status(201).json({ booking: data });
};

export const getUserBookings = async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(*)')
    .eq('user_id', user_id)
    .order('booking_date', { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ bookings: data });
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(*), users(id, name, email)')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (req.user.role !== 'admin' && data.user_id !== user_id) {
    return res.status(403).json({ message: 'Not authorized to view this booking' });
  }

  res.json({ booking: data });
};

export const getAllBookings = async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(*), users(id, name, email)')
    .order('booking_date', { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ bookings: data });
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { booking_date, booking_time, status, notes } = req.body;
  const user_id = req.user.id;

  const updates = {};
  if (booking_date) updates.booking_date = booking_date;
  if (booking_time) updates.booking_time = booking_time;
  if (status) updates.status = status;
  if (notes) updates.notes = notes;

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user_id)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ booking: data });
};

export const adminActionOnBooking = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!['confirm', 'complete', 'cancel'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  const status = action === 'confirm' ? 'confirmed' : action === 'complete' ? 'completed' : 'cancelled';

  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  await sendNotification({
    user_id: data.user_id,
    title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `Your booking scheduled for ${data.booking_date} at ${data.booking_time} has been ${status}.`
  });

  res.json({ booking: data });
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('user_id', user_id)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  await sendNotification({
    user_id,
    title: 'Booking Cancelled',
    message: `Your booking for ${data.booking_date} at ${data.booking_time} has been cancelled.`
  });

  res.json({ booking: data });
};
