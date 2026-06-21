import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/services/${id}`)
      .then(setService)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    try {
      const payload = await apiFetch("/bookings", { method: "POST", body: JSON.stringify({ serviceId: id, slotId: selectedSlot }) });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading message="Loading service..." />;
  if (error) return <ErrorMessage message={error} />;

  const availableSlots = service.availableSlots?.filter((s) => !s.isBooked) ?? [];

  return (
    <div className="panel">
      <h2>{service.title}</h2>
      <p>{service.description}</p>
      <p>Price: ${service.price}</p>
      <section>
        <h3>Select Slot</h3>
        {availableSlots.length === 0 ? (
          <p>No slots available.</p>
        ) : (
          <div className="slots-grid">
            {availableSlots.map((slot) => (
              <button key={slot.id} className={selectedSlot === slot.id ? "slot selected" : "slot"} onClick={() => setSelectedSlot(slot.id)}>
                {new Date(slot.startTime).toLocaleString()}
              </button>
            ))}
          </div>
        )}
      </section>
      <ErrorMessage message={error} />
      <button className="button primary" onClick={handleBook} disabled={!selectedSlot}>Confirm Booking</button>
    </div>
  );
}

export default BookingPage;
