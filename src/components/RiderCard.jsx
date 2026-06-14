import { Bike, MapPin, Star } from "lucide-react";

export default function RiderCard({ rider }) {
  return (
    <article className="rider-card">
      <div className="avatar">{rider.name?.slice(0, 1) || "R"}</div>
      <div>
        <h3>{rider.name}</h3>
        <p>{rider.phone}</p>
        <div className="meta-row">
          <span><Bike size={15} /> {rider.vehicleType}</span>
          <span><Star size={15} /> {rider.rating}</span>
          <span><MapPin size={15} /> {rider.status}</span>
        </div>
      </div>
    </article>
  );
}
