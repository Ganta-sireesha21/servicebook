import api from './api';

const getAll = async () => {
  const { data } = await api.get('/services');
  return data;
};

const getById = async (id) => {
  const { data } = await api.get(`/services/${id}`);
  return data;
};

const createService = async (payload) => {
  const { data } = await api.post('/services', payload);
  return data;
};

const updateService = async (id, payload) => {
  const { data } = await api.put(`/services/${id}`, payload);
  return data;
};

const deleteService = async (id) => {
  const { data } = await api.delete(`/services/${id}`);
  return data;
};

const search = async (query, category) => {
  const params = {};
  if (query) params.search = query;
  if (category) params.category = category;
  const { data } = await api.get('/services', { params });
  return data;
};

export default { getAll, getById, createService, updateService, deleteService, search };
