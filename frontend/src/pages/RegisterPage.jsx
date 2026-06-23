import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const submitForm = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register({ name, email, phone, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-soft">
        <h1 className="mb-4 text-3xl font-semibold text-slate-950">Create Account</h1>
        <p className="mb-8 text-slate-600">Register now to book services and track your appointments.</p>
        <form className="space-y-5" onSubmit={submitForm}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Phone</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3" required minLength={8} />
          </label>
          {error && <p className="rounded-3xl bg-red-100 p-4 text-red-700">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-white">Register</button>
        </form>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account? <a href="/login" className="text-primary">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
