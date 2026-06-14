import { Edit3, MessageCircle, PackageCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import MapView from "../../components/MapView.jsx";
import { getCurrentUser, getBusinessProfile, getOrders, getReviews } from "../../utils/storage.js";

export default function BusinessDashboard() {
  const user = getCurrentUser();
  const profile = getBusinessProfile();
  const orders = getOrders();
  const reviews = getReviews();
  const pending = orders.filter((o) => o.status === "Pending").length;
  const completed = orders.filter((o) => o.status === "Completed").length;

  const businessOrders = orders.filter(
    (o) => !profile || o.businessId === profile.id || o.businessId === "business-owned"
  );

  const marker = profile
    ? [
        {
          id: profile.id || "business-owned",
          type: "business",
          title: profile.businessName || "Your Business",
          subtitle: profile.category,
          location: profile.location,
        },
      ]
    : [];

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Business dashboard</span>
        <h1>{profile?.businessName || user?.name || "Your Business"}</h1>
        <p>
          {profile?.address
            ? `📍 ${profile.address}`
            : "Manage orders, reviews, customer chats, and your business map marker."}
        </p>
      </section>

      <MapView title="Your business on the map" markers={marker} />

      <section className="stats-grid">
        <article>
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <span>Pending</span>
          <strong>{pending}</strong>
        </article>
        <article>
          <span>Completed</span>
          <strong>{completed}</strong>
        </article>
        <article>
          <span>Reviews</span>
          <strong>{reviews.length}</strong>
        </article>
      </section>

      <section className="quick-actions">
        <Link className="button primary" to="/business/orders">
          <PackageCheck size={17} />
          Manage Orders
        </Link>
        <Link className="button secondary" to="/business/chat">
          <MessageCircle size={17} />
          Chat Customers
        </Link>
        <Link className="button ghost" to="/business/reviews">
          <Star size={17} />
          View Reviews
        </Link>
        <Link className="button ghost" to="/business/register">
          <Edit3 size={17} />
          Edit Business
        </Link>
      </section>
    </main>
  );
}
