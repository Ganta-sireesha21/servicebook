import api from './api';

const createOrder = async (booking_id) => {
  const { data } = await api.post('/payments/create-order', { booking_id });
  return data;
};

const verifyPayment = async (payload) => {
  const { data } = await api.post('/payments/verify', payload);
  return data;
};

const getPayments = async () => {
  const { data } = await api.get('/payments');
  return data;
};

export default { createOrder, verifyPayment, getPayments };
