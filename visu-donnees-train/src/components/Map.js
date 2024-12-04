import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map() {
  const delayLocations = [
    { country: "France", position: [48.8566, 2.3522], delay: "15 mins" },
    { country: "Belgium", position: [50.8503, 4.3517], delay: "10 mins" },
    { country: "Poland", position: [52.2297, 21.0122], delay: "20 mins" },
  ];

  return (
    <div className="map">
      <MapContainer center={[50, 10]} zoom={5} style={{ height: "400px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {delayLocations.map((location, index) => (
          <Marker key={index} position={location.position}>
            <Popup>{location.country}: {location.delay}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
