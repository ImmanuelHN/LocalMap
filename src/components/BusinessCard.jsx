import { MapPin, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function BusinessCard({ business }) {
  return (
    <article className="business-card card-hover">
      <img src={business.images?.[0]} alt={business.name} />
      <div className="business-card-body">
        <div>
          <span className="category-pill">{business.category}</span>
          <h3>{business.name}</h3>
          <p>{business.description}</p>
        </div>

        <div className="meta-row">
          <span><MapPin size={15} /> {business.distance} km</span>
          <span><Star size={15} /> {business.rating}</span>
        </div>

        <div className="card-actions">
          <Link className="button primary small" to={`/customer/business/${business.id}`}>
            View Details
          </Link>
          <Link className="button ghost small" to={`/customer/chat/${business.id}`}>
            <MessageCircle size={16} />
            Chat
          </Link>
        </div>
      </div>
    </article>
  );
}
