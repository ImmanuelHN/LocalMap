import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { getUserLocation } from "../utils/storage.js";

const userLoc = getUserLocation();
const defaultCenter = userLoc ? [userLoc.lat, userLoc.lng] : [17.4305, 78.407];

function iconFor(type = "business") {
  const colorByType = {
    customer: "blue",
    business: "green",
    rider: "orange",
    pickup: "blue",
    drop: "orange",
    selected: "blue",
  };

  const color = colorByType[type] || "green";
  return L.divIcon({
    html: `<span class="marker-pin marker-${color}"></span>`,
    className: "localhub-div-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function LocationButton({ onLocated }) {
  const map = useMap();
  const [error, setError] = useState("");

  function locate(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!navigator.geolocation) {
      setError("GPS is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setError("");
        onLocated(coords);
        map.flyTo([coords.lat, coords.lng], 15);
      },
      () => setError("Location permission was not granted.")
    );
  }

  return (
    <div className="map-control-stack">
      <button className="map-control" type="button" onClick={locate}>
        <LocateFixed size={16} />
        Current location
      </button>
      {error ? <span className="map-error">{error}</span> : null}
    </div>
  );
}

function ClickPicker({ enabled, onSelect }) {
  useMapEvents({
    click(event) {
      if (!enabled || !onSelect) return;
      onSelect({
        lat: Number(event.latlng.lat.toFixed(5)),
        lng: Number(event.latlng.lng.toFixed(5)),
      });
    },
  });

  return null;
}

export default function MapView({
  title = "Local map",
  markers = [],
  picker = false,
  selectedPosition = null,
  onLocationSelect,
  showLegend = true,
  className = "",
}) {
  const [currentLocation, setCurrentLocation] = useState(null);

  function handleLocated(coords) {
    setCurrentLocation(coords);
    if (picker && onLocationSelect) {
      onLocationSelect({
        lat: Number(coords.lat.toFixed(5)),
        lng: Number(coords.lng.toFixed(5)),
      });
    }
  }

  const normalizedMarkers = useMemo(
    () =>
      markers
        .filter((marker) => marker.location || marker.position)
        .map((marker) => ({
          ...marker,
          position: marker.position || [marker.location.lat, marker.location.lng],
        })),
    [markers]
  );

  const center = selectedPosition
    ? [selectedPosition.lat, selectedPosition.lng]
    : normalizedMarkers[0]?.position || defaultCenter;

  return (
    <section className={`map-card ${className}`} aria-label={title}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationButton onLocated={handleLocated} />
        <ClickPicker enabled={picker} onSelect={onLocationSelect} />

        {normalizedMarkers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={iconFor(marker.type)}>
            <Popup>
              <div className="map-popup">
                <strong>{marker.title}</strong>
                {marker.subtitle ? <span>{marker.subtitle}</span> : null}
                {marker.actionPath ? <Link to={marker.actionPath}>Open details</Link> : null}
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedPosition ? (
          <Marker position={[selectedPosition.lat, selectedPosition.lng]} icon={iconFor("selected")}>
            <Popup>Selected location</Popup>
          </Marker>
        ) : null}

        {currentLocation ? (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={iconFor("customer")}>
            <Popup>Your current location</Popup>
          </Marker>
        ) : null}
      </MapContainer>

      {picker ? (
        <p className="map-helper">Tap anywhere on the map to place your business or rider location marker.</p>
      ) : null}

      {showLegend ? (
        <div className="map-legend">
          <span><i className="legend-dot blue" /> Customer</span>
          <span><i className="legend-dot green" /> Business</span>
          <span><i className="legend-dot orange" /> Rider</span>
        </div>
      ) : null}
    </section>
  );
}
