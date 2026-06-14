import { Bike, PackageCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MapView from "../../components/MapView.jsx";
import RiderCard from "../../components/RiderCard.jsx";
import { getBusinesses, getDeliveryJobs, getRiderProfile, getRiders, getCurrentUser, updateDeliveryStatus } from "../../utils/storage.js";

export default function RiderDashboard() {
  const user = getCurrentUser();
  const profile = getRiderProfile();
  const riders = getRiders();
  const businesses = getBusinesses();
  const [jobs, setJobs] = useState(() => getDeliveryJobs());

  const availableJobs = jobs.filter((job) => job.status === "Available");
  const assignedJobs = jobs.filter((job) => job.status === "Assigned");

  const markers = [
    ...businesses.slice(0, 6).map((b) => ({
      id: `business-${b.id}`,
      type: "business",
      title: b.name,
      subtitle: b.category,
      location: b.location,
    })),
    ...jobs
      .filter((j) => j.status === "Available" || j.status === "Assigned")
      .flatMap((job) => [
        {
          id: `pickup-${job.id}`,
          type: "pickup",
          title: `Pickup: ${job.pickup}`,
          subtitle: job.status,
          location: job.pickupLocation,
        },
        {
          id: `drop-${job.id}`,
          type: "drop",
          title: `Drop: ${job.drop}`,
          subtitle: `${job.distance} km`,
          location: job.dropLocation,
        },
      ]),
    ...(profile
      ? [
          {
            id: profile.id || "rider-owned",
            type: "rider",
            title: profile.name || user?.name || "You",
            subtitle: profile.vehicleType,
            location: profile.location,
          },
        ]
      : []),
  ];

  function accept(jobId) {
    setJobs(updateDeliveryStatus(jobId, "Assigned"));
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Rider dashboard</span>
        <h1>Welcome, {profile?.name || user?.name || "Rider"}</h1>
        <p>
          {availableJobs.length > 0
            ? `${availableJobs.length} delivery job${availableJobs.length > 1 ? "s" : ""} available near you.`
            : "No available jobs right now. Check back soon."}
        </p>
      </section>

      <MapView title="Rider delivery map" markers={markers} />

      <section className="split-layout">
        <div className="content-card">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">Your profile</span>
              <h2>Rider snapshot</h2>
            </div>
            <Link className="button ghost small" to="/rider/register">Edit</Link>
          </div>
          <RiderCard rider={profile || riders[0]} />
        </div>

        <div className="delivery-list" style={{ display: "grid", gap: 14 }}>
          {availableJobs.length === 0 ? (
            <div className="content-card" style={{ textAlign: "center", padding: "32px 20px" }}>
              <Bike size={30} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
              <p style={{ color: "var(--muted)", margin: 0 }}>No available jobs at the moment.</p>
            </div>
          ) : (
            availableJobs.slice(0, 4).map((job) => (
              <article className="delivery-card" key={job.id}>
                <span className="status-badge status-pending">
                  <PackageCheck size={14} />
                  {job.status}
                </span>
                <h3 style={{ margin: "8px 0 4px" }}>{job.pickup}</h3>
                <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>→ {job.drop}</p>
                <div className="meta-row">
                  <span>{job.distance} km</span>
                  <span>₹{job.payment}</span>
                </div>
                <button className="button primary small" type="button" onClick={() => accept(job.id)} style={{ marginTop: 8 }}>
                  <Bike size={16} />
                  Accept Job
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
