import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import serviceService from '../services/serviceService';

const categories = ['All', 'Wellness', 'Business', 'Creative', 'Health', 'Consulting'];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    serviceService.getAll().then((data) => setServices(data.services || []));
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase()) || service.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || service.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Services</p>
          <h1 className="text-3xl font-semibold text-slate-950">Browse available service offerings.</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-[1fr_auto]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services" className="w-full rounded-2xl border-slate-200 px-4 py-3 shadow-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border-slate-200 px-4 py-3 shadow-sm">
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => (
          <Link key={service.id} to={`/services/${service.id}`} className="overflow-hidden rounded-3xl bg-white p-6 shadow-soft transition hover:-translate-y-1">
            <img src={service.image_url} alt={service.title} className="mb-5 h-52 w-full rounded-3xl object-cover" />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{service.category}</span>
                <span>{service.formatted_price}</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-950">{service.title}</h2>
              <p className="text-slate-600 line-clamp-3">{service.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
