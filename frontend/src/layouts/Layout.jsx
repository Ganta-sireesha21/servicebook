import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' }
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link to="/" className="text-xl font-semibold text-slate-950">BookPro</Link>
          <nav className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="text-sm font-medium text-slate-600 hover:text-slate-950">{link.label}</Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" className="rounded-full bg-primary px-4 py-2 text-sm text-white">Dashboard</Link>
                <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-slate-950">Logout</button>
              </>
            ) : (
              <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-80px)] bg-slate-50"> 
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6 text-sm text-slate-500 lg:px-10">© 2026 BookPro. Built for professional service bookings.</div>
      </footer>
    </div>
  );
};

export default Layout;
