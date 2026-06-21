import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("sb_token");
    if (!token) return;

    fetch("http://localhost:4000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);

    fetch("http://localhost:4000/api/bookings/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setBookings)
      .catch(console.error);
  }, []);

  if (!user) {
    return <p>Loading profile…</p>;
  }

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <section>
        <h3>My Bookings</h3>
        {bookings.length ? (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id}>
                {booking.service.title} on {new Date(booking.slot.startTime).toLocaleString()} - {booking.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings yet.</p>
        )}
      </section>
    </div>
  );
}

export default Profile;
