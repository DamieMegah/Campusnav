// src/page/HallPage.jsx
import { useParams } from "react-router-dom";
import HallMap from "../components/HallMap";

export default function HallPage() {
  const { code } = useParams();

  // Map hall codes to data
  const hallDetails = {
    NSB: { name: "New Science Building", lat: 8.511, lng: 7.496 },
    "MP-Theatre": { name: "Multi Purpose Hall", lat: 8.512, lng: 7.495 },
    ART: { name: "Art Gallery", lat: 8.513, lng: 7.494 },
    SCI: { name: "Science Complex", lat: 8.514, lng: 7.493 },
    Cinema: {name: "Cinema Surulere", lat: 6.49020, lng: 3.35732 },
    YCT: { name: "Yaba College Of Technology", lat: 6.51287, lng:3.37197 },
  };

  const hall = hallDetails[code];

  if (!hall) return <p>Hall not found</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{hall.name} ({code})</h1>
      <HallMap lat={hall.lat} lng={hall.lng} name={hall.name} />
    </div>
  );
}
