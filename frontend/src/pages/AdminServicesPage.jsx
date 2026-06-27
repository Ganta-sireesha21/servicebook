import { useEffect, useState } from 'react';
import serviceService from '../services/serviceService';

const defaultForm = {
  title: '',
  description: '',
  category: '',
  duration: 60,
  price: 0,
  image_url: '',
  status: 'active'
};

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    serviceService.getAll().then((data) => setServices(data.services || []));
  }, []);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setMessage('');
  };

  const saveService = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await serviceService.updateService(editingId, form);
        setServices((prev) => prev.map((service) => (service.id === editingId ? { ...service, ...form } : service)));
        setMessage('Service updated successfully.');
      } else {
        const response = await serviceService.createService(form);
        setServices((prev) => [...prev, response.service]);
        setMessage('Service created successfully.');
      }
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving service.');
    }
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: Number(service.price),
      image_url: service.image_url,
      status: service.status
    });
  };

  const deleteService = async (id) => {
    try {
      await serviceService.deleteService(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
      setMessage('Service deleted successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting service.');
    }
  };

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-950">Service Management</h1>
        <p className="mt-3 text-slate-600">Create, update, or delete service offerings from the admin panel.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-950">Service List</h2>
          <div className="mt-6 space-y-4">
            {services.map((service) => (
              <div key={service.id} className="rounded-3xl border border-slate-200 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{service.title}</p>
                    <p className="text-sm text-slate-600">{service.category} · INR {Number(service.price).toFixed(2)} · {service.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => startEdit(service)} className="rounded-full bg-primary px-4 py-2 text-white">Edit</button>
                    <button onClick={() => deleteService(service.id)} className="rounded-full bg-red-600 px-4 py-2 text-white">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-950">{editingId ? 'Edit Service' : 'Add Service'}</h2>
          <form onSubmit={saveService} className="mt-6 space-y-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded-3xl border border-slate-200 px-4 py-3" required />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} className="w-full rounded-3xl border border-slate-200 px-4 py-3" required />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full rounded-3xl border border-slate-200 px-4 py-3" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} type="number" min={10} placeholder="Duration (minutes)" className="w-full rounded-3xl border border-slate-200 px-4 py-3" required />
              <input value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} type="number" min={0} step="0.01" placeholder="Price" className="w-full rounded-3xl border border-slate-200 px-4 py-3" required />
            </div>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="w-full rounded-3xl border border-slate-200 px-4 py-3" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-3xl border border-slate-200 px-4 py-3">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-primary px-6 py-3 text-white">Save Service</button>
              <button type="button" onClick={resetForm} className="rounded-full border border-slate-200 px-6 py-3 text-slate-700">Reset</button>
            </div>
            {message && <p className="rounded-3xl bg-slate-50 p-4 text-slate-700">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminServicesPage;
