import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/bookings")
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading bookings..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="panel">
      <h2>Booking History</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="list-grid">
          {bookings.map((booking) => (
            <article key={booking.id} className="list-card">
              <h3>{booking.service?.title ?? "Unknown service"}</h3>
              <p>{new Date(booking.booking_date).toLocaleDateString()}</p>
              <p>{booking.time_slot}</p>
              <p>Status: {booking.status}</p>
              <p>Paid: ${booking.payment?.amount?.toFixed(2) ?? "0.00"}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
