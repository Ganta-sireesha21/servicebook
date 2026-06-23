import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import serviceService from '../services/serviceService';
import { useAuth } from '../context/AuthContext';

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      serviceService.getById(id).then((data) => setService(data.service));
    }
  }, [id]);

  if (!service) {
    return <div className="px-6 py-10">Loading service details...</div>;
  }

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <img src={service.image_url} alt={service.title} className="mb-8 h-[420px] w-full rounded-3xl object-cover" />
          <div className="space-y-5">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{service.category}</span>
              <span>{service.duration} min</span>
            </div>
            <h1 className="text-4xl font-semibold text-slate-950">{service.title}</h1>
            <p className="text-slate-600">{service.description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Price</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{service.formatted_price}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Status</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950 capitalize">{service.status}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Book this service</p>
            <p className="text-slate-600">Reserve a slot with the service expert and manage your booking securely in your profile dashboard.</p>
            <button
              onClick={() => navigate(user ? `/booking/${service.id}` : '/login')}
              className="w-full rounded-full bg-primary px-6 py-4 text-white hover:bg-indigo-600"
            >
              {user ? 'Continue to Booking' : 'Login to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
