import  { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RoutingMachine from './RoutingMachine';
import './Search.css';
import CompassDistance from "./CompassDistance";
import { supabase } from "../supabaseClient";
 import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import yctBank from '../assets/YCT-microfinance-bank.jpg';
import collegeHall from '../assets/college-hall.jpg';
import zenithBank from '../assets/zenith-bank.jpg';
import bursary from '../assets/bursary-registry.jpg';
import c5 from '../assets/c5.jpg';
import ce from '../assets/ce.jpg';
import mb from '../assets/mb.jpg';
import mechEng from '../assets/mech-engine.jpg';
import smbs from '../assets/smbs.jpg';
import mpHall from '../assets/mp-theatre.jpg';
import quantitySurvey from '../assets/quantity-survey.jpg';
import scienceComplex from '../assets/scienceComp.jpg';


  // Halls data
  const halls = [
    { name: "YCT Microfinance Bank", code: "YCT-MFB", img: yctBank, lat: 6.517496274395178, lng: 3.373883655685138 },
    { name: "Multi Purpose Hall", code: "MP-Theatre", img: mpHall, lat: 6.5230, lng: 3.3760 },
    { name: "Multi Purpose Hall MPT", code: "MPT", img: mpHall, lat: 6.5185702176752125, lng: 3.3763834744954337 },
    { name: "MPT-G Multipurpose Hall Gallery", code: "MPT-G", img: mpHall, lat: 6.5185702176752125, lng: 3.3763834744954337 },
    { name: "Yusuf Grillo Art Gallery", code: "ART", img: "/images/grillo.jpg", lat: 6.517642107970536, lng: 3.373129954954516 },
    { name: "Art Complex", code: "ART COMPLEX", img: "/images/art-complex.jpg", lat: 6.517357700896631, lng: 3.3730709463357673 },
    { name: "Science Complex", code: "SCI", img: scienceComplex, lat: 6.51767, lng: 3.37258 },
    { name: "Test", code: "Film ", img: "/images/cinema.jpg", lat: 6.49175, lng: 3.35699 },
     { name: "Cinema", code: "Film House", img: "/images/cinema.jpg", lat: 6.49171, lng: 3.35681 },
    { name: "Yaba College Of Technology", code: "YCT", img: "/images/yct.jpg", lat:6.519308385801105, lng: 3.37507094 },
    { name: "Skill Acquisition Center", code: "SAC", img: "/images/sac.jpg", lat: 6.51891, lng: 3.37218 },
    { name: "ETF Building", code: "ETF", img: "/images/ETF.jpg", lat: 6.51887, lng: 3.37236 },
    { name: "College Mosque", code: "MOSQUE", img: "/images/mosque.jpg", lat: 6.519308385801105, lng: 3.3723145634086484 },
    { name: "School of Management and Business Studies", code: "SMBS", img: smbs, lat: 6.518983272177685, lng: 3.373135319374084 },
    { name: "New Building", code: "NB", img: "/images/new.jpg", lat: 6.518422855575325, lng: 3.3725659266369634 },
    { name: "ZENITH BANK/CITM", code: "ZENITH-Citm", img: zenithBank, lat: 6.5176694912116035, lng: 3.374114325670222 },
    { name: "Bursary/Registry", code: "BURSARY", img: bursary, lat: 6.516923326046316, lng: 3.3741760164623313 },
    { name: "College Hall", code: "COLLEGE-HALL", img: collegeHall, lat: 6.516622194794321, lng: 3.3749243527859027 },
    { name: "Civil Engineer", code: "CE", img: ce, lat: 6.517072559166145, lng: 3.374733915943704 },
    { name: "Civil Engineer B", code: "C5", img: c5, lat: 6.517155170338396, lng: 3.375629773764753 },
    { name: "Mechanical Engineer", code: "MLB", img: mechEng, lat: 6.517016596751415, lng: 3.375141611718553 },
    { name: "Library", code: "LIBRARY", img: "/images/library.jpg", lat: 6.517656166833382, lng: 3.3753454596059775 },
    { name: "CITM2", code: "CITM2", img: "/images/citm2.jpg", lat: 6.517224457117517, lng: 3.3730816751719472 },
    { name: "Rectors Office", code: "RECTOR", img: "/images/rector.jpg", lat: 6.516688816768297, lng: 3.374326220168855 },
    { name: "School of Environmental Studies", code: "ENV", img: "/images/environmental.jpg", lat: 6.518226449484113, lng: 3.3759730965115398 },
  ];


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

const smallHallIcon = L.divIcon({
  className: "small-hall-marker",
  html: '<div class="smallDot" style="width: 8px; height: 8px; background-color: #555; border-radius: 50%; border: 1px solid white;"></div>',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

//CALCULATING DISTANCE LOGIC FOR GEOFENCING -> BY AI
function getDistanceInMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}




const HallSearch = () => {
  
 
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedHall, setSelectedHall] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [areaName, setAreaName] = useState("");
  const [sharedLocation, setSharedLocation] = useState(null);
  const [isNearby, setIsNearby] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  

  //PROXIMITY CHECKER LOGIC
  const PROXIMITY_RADIUS = 80; // meters

  useEffect(() => {
  if (!currentLocation) return;

  const target = selectedHall || sharedLocation;
  if (!target) return;

  const distance = getDistanceInMeters(
    currentLocation.lat,
    currentLocation.lng,
    target.lat,
    target.lng
  );

  setIsNearby(distance <= PROXIMITY_RADIUS);
}, [currentLocation, selectedHall, sharedLocation]);




  
 

const mapRef = useRef(null);
const markerRef = useRef(null);

const params = useParams();
  console.log("All URL Parameters:", params)
const { coords, hallCode } = useParams();


  const shareToChatAndExternal = async ({ lat, lng, areaName, hallName }) => {
  if (lat == null || lng == null) {
    alert("Location not ready yet. Please try again.");
    return;
  }

  // Find hall if any
  const hall = halls.find(
    h => h.name === hallName || (h.lat === lat && h.lng === lng)
  );

  const url = hall
    ? `${window.location.origin}/hall/${hall.code}`
    : `${window.location.origin}/location/${lat},${lng}`;

  const text = hall
    ? `Check out ${hall.name} on CampusNav+:`
    : `My location on CampusNav+:`;

  // Create overlay
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  });

  // Button container
  const buttonContainer = document.createElement("div");
  Object.assign(buttonContainer.style, {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: "220px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  });

  // Share to Pins button
  const chatButton = document.createElement("button");
  chatButton.textContent = "📩 Share to Pins";
  Object.assign(chatButton.style, {
    padding: "12px 16px",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
  });
  chatButton.onmouseover = () => (chatButton.style.backgroundColor = "#0056b3");
  chatButton.onmouseout = () => (chatButton.style.backgroundColor = "#007bff");
  chatButton.onclick = () => {
    const imageToShare = selectedHall?.img || "";
    const pendingMessage = {
      type: "location",
      lat,
      lng,
      areaName: areaName || "",
      hallName: hallName || "",
      hallImg: imageToShare,
      hallCode: selectedHall ? selectedHall.code : null,
      text: hallName ? ` ${hallName}` : " Shared Location",
    };

    navigate("/chat", { state: { pendingMessage } });
    document.body.removeChild(overlay);
  };

  // Share externally button
  const externalButton = document.createElement("button");
  externalButton.textContent = "Share Externally";
  Object.assign(externalButton.style, {
    padding: "12px 16px",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    backgroundColor: "#25d366",
    color: "#fff",
    border: "none",
  });
  externalButton.onmouseover = () =>
    (externalButton.style.backgroundColor = "#1da851");
  externalButton.onmouseout = () =>
    (externalButton.style.backgroundColor = "#25d366");
  externalButton.onclick = async () => {
    try {
       // Determine URL
       const hall = halls.find(h => h.name === hallName || (h.lat === lat && h.lng === lng));
       const url = hall 
       ? `${window.location.origin}/hall/${hall.code}` 
       : `${window.location.origin}/location/${lat},${lng}`;

     if (navigator.share) {
      await navigator.share({ title: "CampusNav+ Location", url });
    } else if (navigator.clipboard) {
      // Copy only the link
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } else {
      // WhatsApp fallback (just the URL)
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
    }
  } catch (err) {
    console.warn("Share failed", err);
    alert("Could not share, please try again!");
  }
  document.body.removeChild(overlay);
  };

  // Append buttons & overlay
  buttonContainer.appendChild(chatButton);
  buttonContainer.appendChild(externalButton);
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


  useEffect(() => {
  // If a hall or shared location is set, fly the map there
  const target = selectedHall || sharedLocation;
  
  if (mapRef.current && target) {
    mapRef.current.flyTo(
      [target.lat, target.lng], 
      18, 
      { duration: 2.0, animate: true }
    );
    
    // Automatically open the popup after flying
    if (markerRef.current) {
      setTimeout(() => {
        markerRef.current.openPopup();
      }, 2100); // Wait for flight to finish
    }
  }
}, [selectedHall, sharedLocation]);

  

async function shareLocation(location) {
const url = `${window.location.origin}/location/${currentLocation.lat},${currentLocation.lng}`;
  const text = `Check out my location:${areaName}, ${currentLocation.lat}, ${currentLocation.lng} on CampusNav+ `;

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
  const url = `${window.location.origin}/hall/${hall.code}`;
  const text = `Check out ${hall.name},  on CampusNav+  yctcampusnav.netlify.app`;

  try {
    // 1️⃣ Fetch hall image & convert to File
    const response = await fetch(hall.img);
    const blob = await response.blob();
    const file = new File([blob], `${hall.code}.jpg`, { type: blob.type });

    // 2️⃣ Try Web Share API with image
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "CampusNav+ Hall",
        text,
        url,
        files: [file],
      });
      console.log("Hall shared successfully with image!");
      return;
    }

    // 3️⃣ If navigator.share exists but doesn’t support files, share text only
    if (navigator.share) {
      await navigator.share({ title: "CampusNav+ Hall", text, url });
      console.log("Hall shared without image (fallback)");
      return;
    }

    // 4️⃣ WhatsApp fallback (open with image + caption)
    const waText = encodeURIComponent(`${text} \n${url}`);
    const waImage = encodeURIComponent(hall.img);
    window.open(
      `https://wa.me/?text=${waText}%0A${waImage}`,
      "_blank"
    );

  } catch (err) {
    console.warn("Sharing failed or cancelled", err);
    alert("Could not share, please try again!");
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
     else fetchVisitCount(hallCode);
  } catch (err) {
    console.error("Log visit failed:", err);
  }
}


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
     //  Center map on hall if map already loaded
  if (mapRef.current) {
    mapRef.current.flyTo([hall.lat, hall.lng], 17, { duration: 1.5 });
  }
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

useEffect(() => {
  if (!coords) return;

  const [lat, lng] = coords.split(",").map(Number);
  if (isNaN(lat) || isNaN(lng)) return;

  setSharedLocation({ lat, lng });
}, [coords]);


useEffect(() => {
  if (!mapRef.current || !sharedLocation) return;

  mapRef.current.flyTo(
    [sharedLocation.lat, sharedLocation.lng],
    18,
    { duration: 1.5 }
  );
}, [sharedLocation]);

useEffect(() => {
  if (!mapRef.current) return;

  try {
    if (hallCode) {
      const hall = halls.find(h => h.code.toLowerCase() === hallCode.toLowerCase());
      if (hall) {
        setSelectedHall(hall);
        setSharedLocation({ lat: hall.lat, lng: hall.lng });
        logHallVisit(hall.code);
        fetchVisitCount(hall.code);
      }
    } else if (coords) {
      const [lat, lng] = coords.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        setSharedLocation({ lat, lng });
        const matchedHall = halls.find(
          h => Math.abs(h.lat - lat) < 0.0001 && Math.abs(h.lng - lng) < 0.0001
        );
        if (matchedHall) {
          setSelectedHall(matchedHall);
          logHallVisit(matchedHall.code);
          fetchVisitCount(matchedHall.code);
        }
      }
    }
  } catch (err) {
    console.error("Error parsing URL params", err);
  }
}, [hallCode, coords]);

useEffect(() => {
  if (selectedHall?.code) {
    fetchVisitCount(selectedHall.code);
  }
}, [selectedHall]);

useEffect(() => {
  if (markerRef.current) {
    markerRef.current.openPopup();
  }
}, [selectedHall]);


  const [showButton, setShowButton] = useState(true);
  const watchIdRef = useRef(null);

const handleLocateMe = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  setShowButton(false);
  setIsLocating(true);

  watchIdRef.current = navigator.geolocation.watchPosition(
    (pos) => {
      setCurrentLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setIsLocating(false);
    },
    (err) => {
      console.error(err);
      setIsLocating(false);
      setShowButton(true);
      alert("Live tracking failed, Please check your GPS settings");
    },
    {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 10000,
    }
  );
};

useEffect(() => {
  return () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  };
}, []);


  const getDirectionsUrl = () => {
    if (currentLocation && selectedHall) {
      return `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${selectedHall.lat},${selectedHall.lng}`;
    }
    return "#";
  };



const resetAll = () => {
  // 1. Clear State
  setQuery("");
  setSelectedHall(null);
  setCurrentLocation(null);
  setSharedLocation(null);
  setShowSuggestions(false);
  setIsLocating(false);
  setShowButton(true);

  // 2. Stop GPS tracking if it's running
  if (watchIdRef.current !== null) {
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }

  // 3. Clear the URL parameters by navigating back to home
  navigate("/", { replace: true });
};

useEffect(() => {
  if (!currentLocation || !selectedHall) return;

  const distance =
    getDistanceInMeters(
      currentLocation.lat,
      currentLocation.lng,
      selectedHall.lat,
      selectedHall.lng
    );

  if (distance <= 15) {
    supabase.from("hall_visits").insert({
      hall_code: selectedHall.code,
      arrived: true,
    });
  }
}, [currentLocation]);


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
        {/* ONLY SHOW RESET IF STATE IS ACTIVE */}
  {(query || selectedHall || currentLocation || sharedLocation) && (
    <button className="reset-button" onClick={resetAll} style={{ marginLeft: '10px' }}>
      <i className="fas fa-sync-alt"></i> Reset
    </button>
  )}
      </div>
     {/* THE THROBBER/LOADER */}
{isLocating && (
  <div className="location-loader">
    <div className="spinner"></div>
    <p>Fetching your location...</p>
  </div>
)}

{/* THE BUTTON */}
{showButton && !isLocating && (
  <button className="locate-button" onClick={handleLocateMe}>
    <i className="fas fa-map-marker-alt"></i> My Location
  </button>
)}

      {currentLocation && (
        <div className="current-location">
          <p>
            <strong>Your Location:</strong> {areaName} <br />
            <strong>Coordinates:</strong> Lat: {currentLocation.lat.toFixed(5)}, Lng:{" "}
            {currentLocation.lng.toFixed(5)} 
            <button
                      onClick={() =>
                        shareToChatAndExternal({
                          lat: currentLocation.lat,
                          lng: currentLocation.lng,
                          areaName
                        })
                      }
                    style={{borderRadius :"250px"}}
                 >     
  Share Location
</button>

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
      {(selectedHall || sharedLocation) &&(
        <div className="preview-image">
          <h4>visual Representation</h4>
        {/* Show the count ONLY if it's greater than 0 or we have a hall */}
  {selectedHall && (
    <p className="visit">{visitCount} people have inquired about this location.</p>
   )}
        {hallCode && !selectedHall ? (
    <div className="loading-state">Loading Hall Details...</div>
  ) : (
    <img
      src={selectedHall?.img || "/image-not-available.jpg"}
      alt={selectedHall?.name || "Shared location"}
      loading="lazy"
      key={selectedHall?.code} // This forces the image to refresh when the hall changes
      onError={(e) => {
        e.currentTarget.src = "/image-not-available.jpg";
      }}
    />
  )}

        <MapContainer
  ref={mapRef}
  center={[6.517496274395178, 3.373883655685138]}
  zoom={17}
  whenCreated={(map) => { mapRef.current = map; }}
>
  <TileLayer
    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    attribution='© <a href="https://carto.com/attributions">CARTO</a>'
  />

  {/* 1. SHARED LOCATION MARKER (from URL) */}
  {sharedLocation && !selectedHall && (
    <Marker
      key="shared-loc-marker" 
      position={[sharedLocation.lat, sharedLocation.lng]}
      icon={highlightIcon}
    >
      <Popup>Shared Location</Popup>
    </Marker>
  )}

  {/* 2. LIVE USER LOCATION MARKER */}
  {currentLocation && (
    <Marker 
      key="user-live-gps"  // Hardcoded unique key prevents duplication
      position={[currentLocation.lat, currentLocation.lng]} 
      icon={currentLocationIcon}
    >
      <Popup> 
        You are at {areaName || "Your Location"}
        <br />
        <button onClick={() => shareToChatAndExternal({ lat: currentLocation.lat, lng: currentLocation.lng, areaName })}>
          Share Location
        </button>
      </Popup>
    </Marker>
  )}

  {/* 3. STATIC HALL MARKERS (The most likely cause of duplication) */}
  {halls.map((hall) => {
    const isSelected = selectedHall?.code === hall.code;
    
    // We only render a special marker if it's the one the user selected
    // or a small dot for the others
    return (
      <Marker 
        key={`hall-${hall.code}`} // Use the hall code as a unique prefix
        position={[hall.lat, hall.lng]}
        icon={isSelected ? highlightIcon : smallHallIcon} // highlightIcon only on the active one
      >
        <Popup>
          <strong>{hall.name}</strong>
          {isSelected && (
            <button onClick={() => shareToChatAndExternal({ lat: hall.lat, lng: hall.lng, hallName: hall.name })}>
              Share Hall
            </button>
          )}
        </Popup>
      </Marker>
    );
  })}

  {/* 4. ROUTING & POLYLINE */}
  {currentLocation && selectedHall && (
    <>
      <RoutingMachine map={mapRef.current} from={currentLocation} to={selectedHall} />
      <Polyline
        key="route-line"
        positions={[
          [currentLocation.lat, currentLocation.lng],
          [selectedHall.lat, selectedHall.lng],
        ]}
        color="pink"
      />
    </>
  )}
        </MapContainer>

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