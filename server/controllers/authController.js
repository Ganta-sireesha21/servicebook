import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    return res.status(500).json({ message: selectError.message });
  }

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from('users').insert([
    {
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'customer'
    }
  ]).select('*').single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  const token = signToken({ id: data.id, email: data.email, role: data.role });
  res.status(201).json({ user: { id: data.id, name: data.name, email: data.email, phone: data.phone, role: data.role }, token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();

  if (error) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatches = await bcrypt.compare(password, data.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ id: data.id, email: data.email, role: data.role });
  res.json({ user: { id: data.id, name: data.name, email: data.email, phone: data.phone, role: data.role }, token });
};
