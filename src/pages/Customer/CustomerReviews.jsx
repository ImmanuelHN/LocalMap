import ReviewCard from "../../components/ReviewCard.jsx";
import { getBusinesses, getReviews } from "../../utils/storage.js";

export default function CustomerReviews() {
  const businesses = getBusinesses();
  const reviews = getReviews();

  function businessName(businessId) {
    return businesses.find((business) => business.id === businessId)?.name || "Local business";
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Reviews</span>
        <h1>Local trust signals</h1>
        <p>Reviews cannot be deleted in this prototype, matching the stakeholder demo requirement.</p>
      </section>

      <section className="review-list two-col-list">
        {reviews.map((review) => (
          <div className="review-wrapper" key={review.id}>
            <span className="category-pill">{businessName(review.businessId)}</span>
            <ReviewCard review={review} />
          </div>
        ))}
      </section>
    </main>
  );
}
