import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/services/${id}`)
      .then(setService)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSlot) {
      setError("Select a slot to book.");
      return;
    }

    try {
      await apiFetch("/bookings", { method: "POST", body: JSON.stringify({ serviceId: id, slotId: selectedSlot }) });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!service) return <Loading />;

  const availableSlots = service?.availableSlots?.filter((slot) => !slot.isBooked) ?? [];

  return (
    <div>
      <button className="button secondary" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="detail-panel">
        <h2>{service.title}</h2>
        <p>{service.description}</p>
        <p>Category: {service.category}</p>
        <p>Duration: {service.duration} minutes</p>
        <p>Price: ${service.price}</p>

        <section>
          <h3>Select a time slot</h3>
          {availableSlots.length === 0 ? (
            <p>No available slots. Please check back later.</p>
          ) : (
            <div className="slots-grid">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`slot-button ${selectedSlot === slot.id ? "selected" : ""}`}
                  onClick={() => setSelectedSlot(slot.id)}
                >
                  {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleTimeString()}
                </button>
              ))}
            </div>
          )}
        </section>

        <ErrorMessage message={error} />
        <button className="button primary" onClick={handleBooking} disabled={!availableSlots.length}>
          Book now
        </button>
      </div>
    </div>
  );
}

export default ServiceDetail;
