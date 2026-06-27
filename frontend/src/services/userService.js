import api from './api';

const getAllUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export default { getAllUsers };
