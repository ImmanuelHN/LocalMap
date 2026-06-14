import ReviewCard from "../../components/ReviewCard.jsx";
import { getBusinesses, getReviews } from "../../utils/storage.js";

export default function BusinessReviews() {
  const businesses = getBusinesses();
  const reviews = getReviews();

  function labelFor(review) {
    return businesses.find((business) => business.id === review.businessId)?.name || "Registered business";
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Business reviews</span>
        <h1>Customer feedback</h1>
        <p>Business owners can view reviews and photos, but reviews cannot be deleted.</p>
      </section>

      <section className="review-list two-col-list">
        {reviews.map((review) => (
          <div className="review-wrapper" key={review.id}>
            <span className="category-pill">{labelFor(review)}</span>
            <ReviewCard review={review} />
          </div>
        ))}
      </section>
    </main>
  );
}
