import api from './api';

const getAll = async () => {
  const { data } = await api.get('/services');
  return data;
};

const getById = async (id) => {
  const { data } = await api.get(`/services/${id}`);
  return data;
};

const search = async (query, category) => {
  const params = {};
  if (query) params.search = query;
  if (category) params.category = category;
  const { data } = await api.get('/services', { params });
  return data;
};

export default { getAll, getById, search };
