import { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationService.getNotifications().then((data) => setNotifications(data.notifications || []));
  }, []);

  return (
    <div className="space-y-8 px-6 py-10 lg:px-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-950">Notification Center</h1>
        <p className="mt-3 text-slate-600">Your latest booking and payment alerts are shown here.</p>
      </div>
      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-slate-600">No notifications available.</div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{notification.title}</h2>
                  <p className="mt-2 text-slate-600">{notification.message}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{new Date(notification.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
