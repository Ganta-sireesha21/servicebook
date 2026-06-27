import supabase from '../config/supabaseClient.js';

const mapServiceCurrency = (service) => ({
  ...service,
  currency: 'INR',
  formatted_price: typeof service.price !== 'undefined' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(service.price)) : null
});

export const getServices = async (req, res) => {
  const { search, category } = req.query;
  let query = supabase.from('services').select('*');

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const servicesWithCurrency = (data || []).map(mapServiceCurrency);

  res.json({ services: servicesWithCurrency });
};

export const getServiceById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single();

  if (error) {
    return res.status(404).json({ message: 'Service not found' });
  }

  res.json({ service: mapServiceCurrency(data) });
};

export const createService = async (req, res) => {
  const { title, description, category, duration, price, image_url, status } = req.body;

  if (!title || !description || !category || !duration || !price) {
    return res.status(400).json({ message: 'Title, description, category, duration, and price are required' });
  }

  const { data, error } = await supabase.from('services').insert([
    { title, description, category, duration, price, image_url, status: status || 'active' }
  ]).select('*').single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({ service: mapServiceCurrency(data) });
};

export const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, duration, price, image_url, status } = req.body;

  const updates = {};
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (category) updates.category = category;
  if (duration) updates.duration = duration;
  if (price) updates.price = price;
  if (image_url) updates.image_url = image_url;
  if (status) updates.status = status;

  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ service: mapServiceCurrency(data) });
};

export const deleteService = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ message: 'Service deleted successfully' });
};
