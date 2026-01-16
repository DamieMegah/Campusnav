import { useEffect, useState, useRef } from "react";


const CompassDistance = ({ currentLocation, selectedHall }) => {
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);

  // Haversine formula to calculate distance in KM
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in KM
  };

  // Bearing (angle) calculation for compass
  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360; // Normalize 0–360
  };

  

const ARRIVAL_DISTANCE = 15; // meters
const [hasArrived, setHasArrived] = useState(false);
const arrivalAudio = useRef(new Audio("/arrival.mp3"));

useEffect(() => {
  arrivalAudio.current.load(); // preload
}, []);


useEffect(() => {
  if (!currentLocation || !selectedHall) return;

  const dist = calculateDistance(
    currentLocation.lat,
    currentLocation.lng,
    selectedHall.lat,
    selectedHall.lng
  );

  setDistance(dist);

  const brng = calculateBearing(
    currentLocation.lat,
    currentLocation.lng,
    selectedHall.lat,
    selectedHall.lng
  );
  setBearing(brng);

  // ARRIVAL CHECK 
  const arrived = dist * 1000 <= ARRIVAL_DISTANCE;

  if (arrived && !hasArrived) {
    setHasArrived(true);

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

   arrivalAudio.current.play().catch(() => {});
  }
}, [currentLocation, selectedHall]);

  if (!currentLocation || !selectedHall) return null;

  //CARDINALS TO DISPLAY
  const getCardinalDirection = (bearing) => {
  const directions = [
    "N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"
  ];
  const index = Math.round(bearing / 45);
  return directions[index];
};

  

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        background: "#f3f4f666",
        color:"black",
        padding: "10px",
        borderRadius: "12px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
        textAlign: "center",
        zIndex: 10000,
      }}
    >
         <div>
            {distance < 1 ? (
              <strong>
                You are {(distance * 1000).toFixed(0)} meters away
              </strong>
            ) : (
              <strong>
                You are {distance.toFixed(2)} km away
              </strong>
            )}
         </div>

       {distance * 1000 <= 15 && (
          <div style={{ color: "green", marginTop: "3px", fontSize: "0.845rem" }}>
            You have arrived, Look around for the building
            
          </div>
         )}

         <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>
              Heading: <strong>{getCardinalDirection(bearing)}</strong>
         </div>




      <div style={{ marginTop: "6px",fontSize: "0.6rem",
            color: "red", }}>
        <strong>Direction</strong>
        <div
          style={{
            margin: "8px auto",
            width: "40px",
            height: "40px",
            border: "2px solid black",
            borderRadius: "50%",
            position: "relative",
          }}
        >
          {/* Arrow that rotates */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "2px",
              height: "18px",
              background: "red",
              transform: `translate(-50%, -100%) rotate(${bearing}deg)`,
              transformOrigin: "bottom center",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CompassDistance;
