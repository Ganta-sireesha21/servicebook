import supabase from '../config/supabaseClient.js';

export const getNotifications = async (req, res) => {
  const user_id = req.user.id;
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ notifications: data });
};
