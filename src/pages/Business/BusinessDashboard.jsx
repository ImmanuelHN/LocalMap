import { Edit3, MessageCircle, PackageCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import MapView from "../../components/MapView.jsx";
import {
  getBusinessProfile,
  getOrders,
  getReviews,
} from "../../utils/storage.js";

export default function BusinessDashboard() {
  const profile = getBusinessProfile();
  const orders = getOrders();
  const reviews = getReviews();
  const pending = orders.filter((order) => order.status === "Pending").length;
  const completed = orders.filter((order) => order.status === "Completed").length;

  const marker = profile
    ? [
        {
          id: profile.id,
          type: "business",
          title: profile.businessName,
          subtitle: profile.category,
          location: profile.location,
        },
      ]
    : [];

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Business dashboard</span>
        <h1>{profile?.businessName || "Your business"}</h1>
        <p>Manage orders, reviews, customer chats, and your public business marker.</p>
      </section>

      <MapView title="Business marker map" markers={marker} />

      <section className="stats-grid">
        <article>
          <span>Orders</span>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <span>Pending Orders</span>
          <strong>{pending}</strong>
        </article>
        <article>
          <span>Completed Orders</span>
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
