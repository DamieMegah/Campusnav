import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RoutingMachine from './RoutingMachine';
import './Search.css';
import CompassDistance from "./CompassDistance";
import { supabase } from "../supabaseClient";
import { useAppState } from "../AppState.jsx";
import { useNavigate, useParams } from "react-router-dom";
import yctBank from '../assets/YCT-microfinance-bank.jpg';
import collegeHall from '../assets/college-hall.jpg';
import zenithBank from '../assets/zenith-bank.jpg';
import bursary from '../assets/bursary-registry.jpg'





// default marker icon in Leaflet + Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const highlightIcon = L.divIcon({
  className: 'custom-div-icon', // empty or optional
  html: '<div class="pulse-marker"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10], // point where the marker is anchored
});


const currentLocationIcon = L.divIcon({
  className: 'custom-div-icon', // empty or optional
  html: '<div class="currentLocationMarker"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10], 
});




const HallSearch = () => {
  
 
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedHall, setSelectedHall] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [areaName, setAreaName] = useState("");

  const { hallCode } = useParams();

  useEffect(() => {
    if (hallCode) {
      // fetch hall details or focus map here
      highlightHall(hallCode);
    }
  }, [hallCode]);

 
  
 const shareToChatAndExternal = async ({ lat, lng, areaName, hallName }) => {
  // Create an overlay container dynamically
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9999;

  // Create the button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.background = "#fff";
  buttonContainer.style.padding = "20px";
  buttonContainer.style.borderRadius = "12px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.flexDirection = "column";
  buttonContainer.style.gap = "10px";
  buttonContainer.style.minWidth = "200px";
  buttonContainer.style.textAlign = "center";

  // Create Share to Chat button
  const chatButton = document.createElement("button");
  chatButton.textContent = "📩 Share to Pins";
  chatButton.style.padding = "10px";
  chatButton.style.cursor = "pointer";
  chatButton.onclick = () => {
    const pendingMessage = {
    type: "location",
    lat,
    lng,
    areaName: areaName || "",
    hallName: hallName || "",
    text: hallName
     ? `SHARED AN ON CAMPUS LOCATION: #${hallName.replace(/\s/g, "_")}`
    : `SHARED A LOCATION #${areaName.replace(/\s/g, "_")}`
  };

  // 👇 Pass the message along with navigation
  navigate("/chat", { state: { pendingMessage } });
    document.body.removeChild(overlay); // remove overlay after action
  };

  // Create Share Externally button
  const externalButton = document.createElement("button");
  externalButton.textContent = "🌍 Share Externally";
  externalButton.style.padding = "10px";
  externalButton.style.cursor = "pointer";
  externalButton.onclick = async () => {
    try {
      const url = `${window.location.origin}/location/${lat},${lng}`;
      const text = `Check out this location: ${areaName || hallName} ${lat},${lng} on CampusNav+ 🚀 ${url}`;
      if (navigator.share) {
        await navigator.share({ title: "CampusNav+ Location", text, url });
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      }
    } catch (err) {
      console.warn("share failed", err);
    }
    document.body.removeChild(overlay); // remove overlay after action
  };

  // Append buttons to container
  buttonContainer.appendChild(chatButton);
  buttonContainer.appendChild(externalButton);

  // Append everything to overlay and to body
  overlay.appendChild(buttonContainer);
  document.body.appendChild(overlay);
};

  

  async function getLocationName(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name; // full address string
    } else {
      return "Unknown Location";
    }
  } catch (error) {
    console.error("Reverse geocoding failed:can,t get area name check function ", error);
    return "Unknown Location";
  }
}

useEffect(() => {
  if (currentLocation) {
    getLocationName(currentLocation.lat, currentLocation.lng).then(name =>
      setAreaName(name)
    );
  }
}, [currentLocation]);
  

async function shareLocation(location) {
  const url = `${window.location.origin}/location/${currentLocation.lat},${currentLocation.lng}`;
  const text = `Check out this location:${areaName}, ${currentLocation.lat}, ${currentLocation.lng} on CampusNav+ 🚀`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "CampusNav+ Location", text, url });
      console.log("Share successful!");
    } catch (err) {
      console.warn("Sharing failed or cancelled", err);
      alert("please try again")
    }
  } else {
    // fallback for browsers that don’t support navigator.share
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      "_blank"
    );
  }
}

async function shareHall(hall) {
  const url = `${window.location.origin}/hall/${selectedHall.lat},${selectedHall.lng}`;
  const text = `Check out ${hall.name}, ${selectedHall.lat},${selectedHall.lng} on CampusNav+ 🚀`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "CampusNav+ Hall", text, url });
      console.log("Hall shared successfully!");
    } catch (err) {
      console.warn("Sharing failed or cancelled", err);
    }
  } else {
    // fallback
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      "_blank"
    );
  }
}

  


const [visitCount, setVisitCount] = useState(0);

async function fetchVisitCount(hallCode) {
  const { count, error } = await supabase
    .from("hall_visits")
    .select("*", { count: "exact", head: true })
    .eq("hall_code", hallCode);

  if (!error) setVisitCount(count);
}

async function logHallVisit(hallCode) {
  try {
    // Insert only once per user per hall
    const { error } = await supabase
      .from("hall_visits")
      .insert({ hall_code: hallCode });

    if (error) console.error("Error saving visit:", error);
  } catch (err) {
    console.error("Log visit failed:", err);
  }
}

  // Halls data
  const halls = [
    { name: "YCT Microfinance Bank", code: "YCT-MFB", img: yctBank, lat: 6.517496274395178, lng: 3.373883655685138 },
    { name: "Multi Purpose Hall", code: "MP-Theatre", img: "/images/multi.jpg", lat: 6.5230, lng: 3.3760 },
    { name: "Multi Purpose Hall MPT", code: "MPT", img: "/images/multi.jpg", lat: 6.5185702176752125, lng: 3.3763834744954337 },
    { name: "MPT-G Multipurpose Hall Gallery", code: "MPT-G", img: "/images/multi.jpg", lat: 6.5185702176752125, lng: 3.3763834744954337 },
    { name: "Yusuf Grillo Art Gallery", code: "ART", img: "/images/grillo.jpg", lat: 6.517642107970536, lng: 3.373129954954516 },
    { name: "Art Complex", code: "ART COMPLEX", img: "/images/art-complex.jpg", lat: 6.517357700896631, lng: 3.3730709463357673 },
    { name: "Science Complex", code: "SCI", img: "/images/science.jpg", lat: 6.51767, lng: 3.37258 },
    { name: "Cinema Surulere", code: "Film House", img: "/images/cinema.jpg", lat: 6.5000, lng: 3.3500 },
    { name: "Yaba College Of Technology", code: "YCT", img: "/images/yct.jpg", lat:6.519308385801105, lng: 3.37507094 },
    { name: "Skill Acquisition Center", code: "SAC", img: "/images/sac.jpg", lat: 6.51891, lng: 3.37218 },
    { name: "ETF Building", code: "ETF", img: "/images/ETF.jpg", lat: 6.51887, lng: 3.37236 },
    { name: "College Mosque", code: "MOSQUE", img: "/images/mosque.jpg", lat: 6.519308385801105, lng: 3.3723145634086484 },
    { name: "School of Management and Business Studies", code: "SMBS", img: "/images/smbs.jpg", lat: 6.518983272177685, lng: 3.373135319374084 },
    { name: "New Building", code: "NB", img: "/images/new.jpg", lat: 6.518422855575325, lng: 3.3725659266369634 },
    { name: "ZENITH BANK/CITM", code: "ZENITH-Citm", img: zenithBank, lat: 6.5176694912116035, lng: 3.374114325670222 },
    { name: "Bursary/Registry", code: "BURSARY", img: bursary, lat: 6.516923326046316, lng: 3.3741760164623313 },
    { name: "College Hall", code: "COLLEGE-HALL", img: collegeHall, lat: 6.516622194794321, lng: 3.3749243527859027 },
    { name: "Civil Engineer", code: "CE", img: "/images/civil-engineer.jpg", lat: 6.517072559166145, lng: 3.374733915943704 },
    { name: "Civil Engineer B", code: "CE", img: "/images/civil-engineer-b.jpg", lat: 6.517155170338396, lng: 3.375629773764753 },
    { name: "Mechanical Engineer", code: "ME", img: "/images/mechanical-engineer.jpg", lat: 6.517016596751415, lng: 3.375141611718553 },
    { name: "Library", code: "LIBRARY", img: "/images/library.jpg", lat: 6.517656166833382, lng: 3.3753454596059775 },
    { name: "CITM2", code: "CITM2", img: "/images/citm2.jpg", lat: 6.517224457117517, lng: 3.3730816751719472 },
    { name: "Rectors Office", code: "RECTOR", img: "/images/rector.jpg", lat: 6.516688816768297, lng: 3.374326220168855 },
    { name: "School of Environmental Studies", code: "ENV", img: "/images/environmental.jpg", lat: 6.518226449484113, lng: 3.3759730965115398 },
  ];

  // Filtered halls for suggestions
  const filteredHalls = halls.filter(hall =>
    hall.name.toLowerCase().includes(query.toLowerCase()) ||
    hall.code.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (hall) => {
    setQuery(hall.name);
    setSelectedHall(hall);
    setShowSuggestions(false);
    logHallVisit(hall.code);
    fetchVisitCount(hall.code);
  };

const handleSearch = () => {
  if (!selectedHall) {
    alert("Please enter desired location!");
  } else {
    setShowSuggestions(false);
    logHallVisit(selectedHall.code);
    fetchVisitCount(selectedHall.code);
  }
};

  const [showButton, setShowButton] = useState(true);
  const handleLocateMe = () => {
    if (navigator.geolocation) {
       setShowButton(false);
      navigator.geolocation.getCurrentPosition(
        pos => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => {
          console.error(err);
          alert("Could not get your location.");
        }
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  const getDirectionsUrl = () => {
    if (currentLocation && selectedHall) {
      return `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${selectedHall.lat},${selectedHall.lng}`;
    }
    return "#";
  };

  const resetAll = () => {
  setShowModal(false);
  setOpenMenu(false);
  setSelectedHall(null);
  setCurrentLocation(null);
  // etc...
};

  return (
    <div className="input-container">
      
      <div className="input-row">
        <input
          type="text"
          placeholder="Enter your hall or code..."
          className="search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedHall(null);
            setShowSuggestions(true);
          }}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      {showButton && (
        <button className="locate-button" onClick={handleLocateMe}>
          <i className="fas fa-map-marker-alt"></i> My Location
        </button>
      )}

      {currentLocation && (
        <div className="current-location">
          <p>
            <strong>📍Your Location:</strong> {areaName} <br />
            <strong>Coordinates:</strong> Lat: {currentLocation.lat.toFixed(5)}, Lng:{" "}
            {currentLocation.lng.toFixed(5)} <button onClick={() => shareToChatAndExternal({ lat: currentLocation.lat, lng: currentLocation.lng, areaName })}>Share Location</button>
          </p>
        </div>
      )}


      {/* Suggestion list */}
      {query && showSuggestions && (
        <ul className="preview">
          {filteredHalls.length > 0 ? (
            filteredHalls.map((hall, index) => (
              <li
                key={index}
                className="inner-preview"
                onClick={() => handleSelect(hall)}
                style={{ cursor: "pointer" }}
              >
                <strong>★ {hall.name}</strong> — <span>{hall.code}</span>
              </li>
            ))
          ) : (
            <li className="inner-preview not-found">Location not found!😣</li>
          )}
        </ul>
      )}

      {/* Hall preview & map */}
      {selectedHall && (
        <div className="preview-image">
          <h4>visual Representation</h4>
          <p className="visit"> {visitCount} people have inquired about this location.</p>
          <img src={selectedHall.img} alt={selectedHall.name} loading="lazy"/>

          {(currentLocation || selectedHall) && (
         <MapContainer
  center={
    currentLocation
      ? [
          (currentLocation.lat + selectedHall.lat) / 2,
          (currentLocation.lng + selectedHall.lng) / 2
        ]
      : [selectedHall.lat, selectedHall.lng]
  }
  zoom={17}
  scrollWheelZoom={false}
  whenCreated={(mapInstance) => {
    window.mapInstance = mapInstance;

    // Define campus bounds (SW and NE corners)
    const southWest = L.latLng(6.5220, 3.3770); // bottom-left corner
    const northEast = L.latLng(6.5260, 3.3820); // top-right corner
    const bounds = L.latLngBounds(southWest, northEast);

    // Restrict panning
    mapInstance.setMaxBounds(bounds);
    mapInstance.on('drag', () => {
      mapInstance.panInsideBounds(bounds, { animate: false });
    });

    // Optional: restrict zoom levels
    mapInstance.setMinZoom(16);
    mapInstance.setMaxZoom(20);
  }}

  
>

  {currentLocation && selectedHall && (
  <CompassDistance 
    currentLocation={currentLocation}
    selectedHall={selectedHall}
  />
)}
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; OpenStreetMap & DamieMegah contributors"
  />

  {currentLocation && (
    <Marker position={[currentLocation.lat, currentLocation.lng]}icon={currentLocationIcon}>
      <Popup>📍 You are at {areaName}
        <button onClick={() => shareToChatAndExternal({ lat: currentLocation.lat, lng: currentLocation.lng, areaName })}>Share Location</button>
 </Popup>
    </Marker>
  )}

  <Marker position={[selectedHall.lat, selectedHall.lng]} icon={highlightIcon}>
    <Popup>📍
 <button onClick={() => shareToChatAndExternal({ lat: selectedHall.lat, lng: selectedHall.lng, hallName: selectedHall.name })}>Share Hall</button>
</Popup>
  </Marker>

  {halls.map((hall, idx) => (
    <Marker key={idx} position={[hall.lat, hall.lng]}>
      <Popup> {hall.name}</Popup>
    </Marker>
  ))}

  {currentLocation && selectedHall && (
    <RoutingMachine from={currentLocation} to={selectedHall} />
  )}

  {currentLocation && (
    <Polyline
      positions={[
        [currentLocation.lat, currentLocation.lng],
        [selectedHall.lat, selectedHall.lng],
      ]}
      color="green"
    />
  )}
</MapContainer>
    )}

          {/* Show Directions button */}
          {currentLocation && (
            <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer">
              <button className="directions-button">Google Maps</button> </a>
          
          )}
        </div>
      )}

     

           
    </div>
  );
};

export default HallSearch;
