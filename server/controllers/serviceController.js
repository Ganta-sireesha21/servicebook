import supabase from '../config/supabaseClient.js';

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

  const servicesWithCurrency = (data || []).map((s) => ({
    ...s,
    currency: 'INR',
    formatted_price: typeof s.price !== 'undefined' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(s.price)) : null
  }));

  res.json({ services: servicesWithCurrency });
};

export const getServiceById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single();

  if (error) {
    return res.status(404).json({ message: 'Service not found' });
  }

  const serviceWithCurrency = {
    ...data,
    currency: 'INR',
    formatted_price: typeof data.price !== 'undefined' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(data.price)) : null
  };

  res.json({ service: serviceWithCurrency });
};
