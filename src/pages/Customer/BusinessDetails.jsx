import { MessageCircle, Phone, ShoppingBag, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MapView from "../../components/MapView.jsx";
import ReviewCard from "../../components/ReviewCard.jsx";
import { addReview, getBusinesses, getCurrentUser, getReviews } from "../../utils/storage.js";

export default function BusinessDetails() {
  const { businessId } = useParams();
  const user = getCurrentUser();
  const business = getBusinesses().find((item) => item.id === businessId);
  const [reviews, setReviews] = useState(() => getReviews());
  const [form, setForm] = useState({ text: "", rating: 5, photo: "" });

  const businessReviews = useMemo(
    () => reviews.filter((review) => review.businessId === businessId),
    [reviews, businessId]
  );

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((current) => ({ ...current, photo: file.name }));
  }

  function submitReview(event) {
    event.preventDefault();
    if (!form.text.trim() || !business) return;

    const next = addReview({
      businessId: business.id,
      businessName: business.name,
      author: user.name || "Demo Customer",
      rating: Number(form.rating),
      text: form.text,
      photo: form.photo,
    });
    setReviews(next);
    setForm({ text: "", rating: 5, photo: "" });
  }

  if (!business) {
    return (
      <main className="page-stack">
        <section className="content-card">
          <h1>Business not found</h1>
          <Link className="button primary" to="/customer">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-stack">
      <section className="business-hero">
        <img src={business.images?.[0]} alt={business.name} />
        <div>
          <span className="category-pill">{business.category}</span>
          <h1>{business.name}</h1>
          <p>{business.description}</p>
          <div className="meta-row">
            <span><Star size={16} /> {business.rating}</span>
            <span><Phone size={16} /> {business.phone}</span>
            <span>{business.distance} km away</span>
          </div>
          <div className="hero-actions">
            <Link className="button primary" to={`/customer/chat/${business.id}`}>
              <MessageCircle size={17} />
              Chat
            </Link>
            <Link className="button secondary" to={`/customer/order/${business.id}`}>
              <ShoppingBag size={17} />
              Order
            </Link>
          </div>
        </div>
      </section>

      <MapView
        title={`${business.name} location`}
        markers={[
          {
            id: business.id,
            type: "business",
            title: business.name,
            subtitle: business.address,
            location: business.location,
          },
        ]}
      />

      <section className="gallery-grid">
        {business.images?.map((image) => (
          <img src={image} alt={`${business.name} gallery`} key={image} />
        ))}
      </section>

      <section className="split-layout">
        <form className="content-card form-grid" onSubmit={submitReview}>
          <span className="eyebrow">Add review</span>
          <h2>Share your experience</h2>
          <label>
            Review Text
            <textarea name="text" value={form.text} onChange={updateField} placeholder="Write your review" />
          </label>
          <label>
            Rating
            <select name="rating" value={form.rating} onChange={updateField}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option value={rating} key={rating}>{rating}</option>
              ))}
            </select>
          </label>
          <label className="file-label">
            Photo Upload
            <input type="file" accept="image/*" onChange={handlePhoto} />
            <span>{form.photo || "Choose photo"}</span>
          </label>
          <button className="button primary" type="submit">Add Review</button>
        </form>

        <div className="review-list">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">Customer reviews</span>
              <h2>{businessReviews.length} reviews</h2>
            </div>
          </div>
          {businessReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </main>
  );
}
