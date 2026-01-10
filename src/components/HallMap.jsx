// src/components/HallMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function HallMap({ lat, lng, name }) {
  const position = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={17}
      scrollWheelZoom={true}
      style={{ height: '450px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{name || "Here it is!"}</Popup>
      </Marker>
    </MapContainer>
  );
}
