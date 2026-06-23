import api from './api';

const createBooking = async (payload) => {
  const { data } = await api.post('/bookings', payload);
  return data;
};

const getUserBookings = async () => {
  const { data } = await api.get('/bookings/my');
  return data;
};

const cancelBooking = async (id) => {
  const { data } = await api.delete(`/bookings/${id}`);
  return data;
};

export default { createBooking, getUserBookings, cancelBooking };
