import { CheckCircle2, Clock3, PackageCheck } from "lucide-react";

const statuses = ["Pending", "Accepted", "Preparing", "Ready", "Completed"];

export default function OrderCard({ order, editable = false, onStatusChange }) {
  return (
    <article className="order-card">
      <div className="order-topline">
        <span className={`status-badge status-${order.status.toLowerCase().replaceAll(" ", "-")}`}>
          <Clock3 size={14} />
          {order.status}
        </span>
        <span>#{order.id}</span>
      </div>

      <div>
        <h3>{order.productName}</h3>
        <p>{order.businessName} for {order.customerName}</p>
      </div>

      <dl className="order-details">
        <div>
          <dt>Quantity</dt>
          <dd>{order.quantity}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>Rs {order.total}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{order.createdAt}</dd>
        </div>
      </dl>

      {order.instructions ? <p className="muted-note">{order.instructions}</p> : null}

      {editable ? (
        <div className="status-actions">
          {statuses.map((status) => (
            <button
              key={status}
              className={`status-button ${order.status === status ? "active" : ""}`}
              type="button"
              onClick={() => onStatusChange?.(order.id, status)}
            >
              {status === "Completed" ? <CheckCircle2 size={14} /> : <PackageCheck size={14} />}
              {status}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
