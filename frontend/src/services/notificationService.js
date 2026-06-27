import api from './api';

const getNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

export default { getNotifications };
