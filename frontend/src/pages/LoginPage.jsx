import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitForm = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-soft">
        <h1 className="mb-4 text-3xl font-semibold text-slate-950">Welcome Back</h1>
        <p className="mb-8 text-slate-600">Login to manage your bookings and profile.</p>
        <form className="space-y-5" onSubmit={submitForm}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3" required />
          </label>
          {error && <p className="rounded-3xl bg-red-100 p-4 text-red-700">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-white">Login</button>
        </form>
        <p className="mt-6 text-sm text-slate-600">
          Don’t have an account? <a href="/register" className="text-primary">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
