import supabase from '../config/supabaseClient.js';

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
    return res.status(500).json({ message: error.message });
  }

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

  res.json({ booking: data });
};
