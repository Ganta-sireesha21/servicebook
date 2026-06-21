import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { Link } from "react-router-dom";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/profile")
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="dashboard-grid">
      <section className="panel profile-card">
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
        <p>{profile.phone || "No phone number set"}</p>
        <Link to="/profile/edit" className="button secondary">Edit Profile</Link>
      </section>

      <section className="panel summary-card">
        <h3>Upcoming bookings</h3>
        {profile.bookings?.length ? (
          <ul>
            {profile.bookings.slice(0, 3).map((booking) => (
              <li key={booking.id}>
                {booking.service?.title} — {booking.time_slot} ({booking.status})
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming bookings.</p>
        )}
        <Link to="/bookings" className="button">View all bookings</Link>
      </section>

      <section className="panel notification-card">
        <h3>Notifications</h3>
        {profile.notifications?.length ? (
          <ul>
            {profile.notifications.slice(0, 3).map((note) => (
              <li key={note.id} className={note.is_read ? "read" : "unread"}>
                {note.title || "Update"}: {note.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications yet.</p>
        )}
        <Link to="/notifications" className="button">View all</Link>
      </section>
    </div>
  );
}

export default Dashboard;
