import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Loading from "../components/Loading";

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/services")
      .then(setServices)
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Available Services</h2>
      <div className="cards-grid">
        {services.map((service) => (
          <article key={service.id} className="card">
            <img src={service.image_url} alt={service.title} className="card-image" />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>Category: {service.category}</p>
            <p>Price: ${service.price}</p>
            <p>Next slot: {service.availableSlots.find((slot) => !slot.isBooked)?.startTime ?? "No slots"}</p>
            <Link to={`/services/${service.id}`} className="button">
              View & Book
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ServiceList;
