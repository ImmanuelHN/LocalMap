import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-header">
        <div>
          <strong>{review.author}</strong>
          <span>{review.createdAt}</span>
        </div>
        <span className="rating-chip">
          <Star size={15} />
          {review.rating}
        </span>
      </div>
      <p>{review.text}</p>
      {review.photo ? <img src={review.photo} alt="Review upload" /> : null}
    </article>
  );
}
