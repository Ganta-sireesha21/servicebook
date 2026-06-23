import { Link } from 'react-router-dom';
import serviceService from '../services/serviceService';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    serviceService.getAll().then((data) => setServices(data.services || []));
  }, []);

  return (
    <div className="space-y-12 px-6 py-10 lg:px-20">
      <section className="rounded-3xl bg-white p-10 shadow-soft">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Service Booking</p>
          <h1 className="text-4xl font-semibold text-slate-950">Book professional services in minutes.</h1>
          <p className="text-slate-600">Browse curated services, choose available slots, and manage bookings from your secure dashboard.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/services" className="rounded-full bg-primary px-6 py-3 text-white shadow-lg hover:bg-indigo-600">Browse Services</Link>
            <Link to="/login" className="rounded-full border border-slate-200 px-6 py-3 text-slate-800 hover:bg-slate-100">Login</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 6).map((service) => (
          <Link key={service.id} to={`/services/${service.id}`} className="rounded-3xl bg-white p-6 shadow-soft transition hover:-translate-y-1">
            <img src={service.image_url} alt={service.title} className="mb-5 h-52 w-full rounded-3xl object-cover" />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{service.category}</span>
                <span>{service.formatted_price}</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-950">{service.title}</h2>
              <p className="text-slate-600 line-clamp-2">{service.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
