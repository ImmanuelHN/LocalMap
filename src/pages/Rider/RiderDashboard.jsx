import { Bike, PackageCheck } from "lucide-react";
import MapView from "../../components/MapView.jsx";
import RiderCard from "../../components/RiderCard.jsx";
import { getBusinesses, getDeliveryJobs, getRiderProfile, getRiders, updateDeliveryStatus } from "../../utils/storage.js";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RiderDashboard() {
  const profile = getRiderProfile();
  const riders = getRiders();
  const businesses = getBusinesses();
  const [jobs, setJobs] = useState(() => getDeliveryJobs());
  const availableJobs = jobs.filter((job) => job.status === "Available");

  const markers = [
    ...businesses.slice(0, 5).map((business) => ({
      id: `business-${business.id}`,
      type: "business",
      title: business.name,
      subtitle: business.category,
      location: business.location,
    })),
    ...jobs.flatMap((job) => [
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
            id: profile.id,
            type: "rider",
            title: profile.name,
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
        <h1>Available deliveries near you</h1>
        <p>Pickup and drop markers are visible on the same OpenStreetMap view.</p>
      </section>

      <MapView title="Rider delivery map" markers={markers} />

      <section className="split-layout">
        <div className="content-card">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">Registered rider</span>
              <h2>Profile snapshot</h2>
            </div>
            <Link className="button ghost small" to="/rider/register">Edit</Link>
          </div>
          <RiderCard rider={profile || riders[0]} />
        </div>

        <div className="delivery-list">
          {availableJobs.slice(0, 4).map((job) => (
            <article className="delivery-card" key={job.id}>
              <span className="status-badge status-pending">
                <PackageCheck size={14} />
                {job.status}
              </span>
              <h3>{job.pickup}</h3>
              <p>{job.drop}</p>
              <div className="meta-row">
                <span>{job.distance} km</span>
                <span>Rs {job.payment}</span>
              </div>
              <button className="button primary small" type="button" onClick={() => accept(job.id)}>
                <Bike size={16} />
                Accept
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
