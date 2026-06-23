import supabase from '../config/supabaseClient.js';

export const getCurrentUser = async (req, res) => {
  const user_id = req.user.id;
  const { data, error } = await supabase.from('users').select('id, name, email, phone, profile_image, role, created_at').eq('id', user_id).single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ user: data });
};

export const updateCurrentUser = async (req, res) => {
  const user_id = req.user.id;
  const { name, phone } = req.body;

  const { data, error } = await supabase.from('users').update({ name, phone }).eq('id', user_id).select('id, name, email, phone, profile_image, role, created_at').single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ user: data });
};
