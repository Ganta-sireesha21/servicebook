import api from './api';

const createBooking = async (payload) => {
  const { data } = await api.post('/bookings', payload);
  return data;
};

const getUserBookings = async () => {
  const { data } = await api.get('/bookings/my');
  return data;
};

const getBookingById = async (id) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
};

const cancelBooking = async (id) => {
  const { data } = await api.delete(`/bookings/${id}`);
  return data;
};

const getAllBookings = async () => {
  const { data } = await api.get('/bookings');
  return data;
};

const adminAction = async (id, action) => {
  const { data } = await api.post(`/bookings/${id}/action`, { action });
  return data;
};

export default { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings, adminAction };
