import { Bike, CheckCircle2, PackageCheck } from "lucide-react";
import { useState } from "react";
import { getDeliveryJobs, updateDeliveryStatus } from "../../utils/storage.js";

function nextStatus(status) {
  if (status === "Available") return "Assigned";
  if (status === "Assigned") return "Picked Up";
  if (status === "Picked Up") return "Delivered";
  return "Delivered";
}

function actionLabel(status) {
  if (status === "Available") return "Accept";
  if (status === "Assigned") return "Mark Picked Up";
  if (status === "Picked Up") return "Mark Delivered";
  return "Delivered";
}

export default function RiderJobs({ showHistory = false }) {
  const [jobs, setJobs] = useState(() => getDeliveryJobs());
  const visibleJobs = jobs.filter((job) => (showHistory ? job.status === "Delivered" : job.status !== "Delivered"));

  function advance(job) {
    if (job.status === "Delivered") return;
    setJobs(updateDeliveryStatus(job.id, nextStatus(job.status)));
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">{showHistory ? "Delivery history" : "Rider jobs"}</span>
        <h1>{showHistory ? "Completed deliveries" : "Available and active jobs"}</h1>
        <p>Dummy delivery jobs move from Available to Picked Up to Delivered.</p>
      </section>

      <section className="delivery-grid">
        {visibleJobs.map((job) => (
          <article className="delivery-card" key={job.id}>
            <span className={`status-badge status-${job.status.toLowerCase().replaceAll(" ", "-")}`}>
              {job.status === "Delivered" ? <CheckCircle2 size={14} /> : <PackageCheck size={14} />}
              {job.status}
            </span>
            <h3>{job.pickup}</h3>
            <p>{job.drop}</p>
            <dl className="order-details">
              <div>
                <dt>Distance</dt>
                <dd>{job.distance} km</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>Rs {job.payment}</dd>
              </div>
            </dl>
            {!showHistory ? (
              <button className="button primary small" type="button" onClick={() => advance(job)}>
                <Bike size={16} />
                {actionLabel(job.status)}
              </button>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
