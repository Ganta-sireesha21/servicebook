import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/notifications")
      .then(setNotifications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      const updated = await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
      setNotifications((items) => items.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading message="Loading notifications..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="panel">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((note) => (
            <article key={note.id} className={`notification-card ${note.is_read ? "read" : "unread"}`}>
              <div>
                <strong>{note.title ?? "Update"}</strong>
                <p>{note.message}</p>
                <small>{new Date(note.created_at).toLocaleString()}</small>
              </div>
              {!note.is_read && (
                <button className="button small" onClick={() => markRead(note.id)}>
                  Mark read
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
