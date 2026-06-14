import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../utils/storage.js";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(() => getNotifications());
  const unread = notifications.filter((notification) => !notification.read).slice(0, 3);

  useEffect(() => {
    function sync() {
      setNotifications(getNotifications());
    }

    window.addEventListener("localhub:storage", sync);
    return () => window.removeEventListener("localhub:storage", sync);
  }, []);

  function dismiss(id) {
    markNotificationRead(id);
    setNotifications(getNotifications());
  }

  if (!unread.length) return null;

  return (
    <section className="notification-center" aria-label="Notifications">
      <div className="notification-title">
        <Bell size={17} />
        <strong>Notifications</strong>
      </div>
      <div className="notification-list">
        {unread.map((notification) => (
          <article key={notification.id} className="notification-item">
            <div>
              <strong>{notification.type}</strong>
              <p>{notification.text}</p>
            </div>
            <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(notification.id)}>
              <X size={15} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
