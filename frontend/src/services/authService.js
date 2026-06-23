import api from './api';

const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export default { register, login };
