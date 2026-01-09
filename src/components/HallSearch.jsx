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
    { name: "Cinema Surulere", code: "Film House", img: "/images/cinema.jpg", lat: 6.5000, lng: 3.3500 },
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




const HallSearch = () => {
  
 
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedHall, setSelectedHall] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [areaName, setAreaName] = useState("");
  const [sharedLocation, setSharedLocation] = useState(null);


  
 

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
      // Clemo FIX: If it's a hall, send the /hall/ link. If not, send the /location/ link.
      const hall = halls.find(h => h.name === hallName || (h.lat === lat && h.lng === lng));
      const url = hall 
        ? `${window.location.origin}/hall/${hall.code}` 
        : `${window.location.origin}/location/${lat},${lng}`;

      const text = `Check out ${hallName || areaName} on CampusNav+ 🚀 ${url}`;
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
  const text = `Check out my location:${areaName}, ${currentLocation.lat}, ${currentLocation.lng} on CampusNav+ 🚀`;

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
  const text = `Check out ${hall.name},  on CampusNav+ 🚀 yctcampusnav.netlify.app`;

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
  // 1. If we have a hallCode (from /hall/:hallCode)
  if (hallCode) {
    const hall = halls.find(h => h.code.toLowerCase() === hallCode.toLowerCase());
    if (hall) {
      setSelectedHall(hall);
      setSharedLocation({ lat: hall.lat, lng: hall.lng });
      logHallVisit(hall.code);
      fetchVisitCount(hall.code);
    }
  } 
  // 2. If we ONLY have coords (from /location/:coords)
  else if (coords) {
    const [lat, lng] = coords.split(",").map(Number);
    setSharedLocation({ lat, lng });

    // Look for a hall that matches these coordinates exactly
    const matchedHall = halls.find(h => 
      h.lat.toFixed(4) === lat.toFixed(4) && 
      h.lng.toFixed(4) === lng.toFixed(4)
    );

    if (matchedHall) {
      setSelectedHall(matchedHall);
      logHallVisit(matchedHall.code);
      fetchVisitCount(matchedHall.code);
    }
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
            {currentLocation.lng.toFixed(5)} 
            <button
                      onClick={() =>
                        shareToChatAndExternal({
                          lat: currentLocation.lat,
                          lng: currentLocation.lng,
                          areaName
                        })
                      }
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
             zoom={15}
             whenCreated={(map) => { mapRef.current = map; }}
      >

        {sharedLocation && (
             <Marker
               position={[sharedLocation.lat, sharedLocation.lng]}
               icon={highlightIcon}
             >
               <Popup>
                 📍 Shared Location
               </Popup>
             </Marker>
         )}


  {currentLocation && selectedHall && (
  <CompassDistance 
    currentLocation={currentLocation}
    selectedHall={selectedHall}
  />
)}
 <TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
/>


  {currentLocation && (
    <Marker position={[currentLocation.lat, currentLocation.lng]}icon={currentLocationIcon}>
      <Popup>📍 You are at {areaName}
        <button onClick={() => shareToChatAndExternal({ lat: currentLocation.lat, lng: currentLocation.lng, areaName })}>Share Location</button>
 </Popup>
    </Marker>
  )}
<Marker
  ref={markerRef}
  position={[
    (selectedHall || sharedLocation).lat,
    (selectedHall || sharedLocation).lng
  ]}
  icon={highlightIcon}
>
  <Popup>
    {selectedHall ? (
      <div>
        <strong>{selectedHall.name}</strong><br />
        <button onClick={() => shareToChatAndExternal({ 
          lat: selectedHall.lat, 
          lng: selectedHall.lng, 
          hallName: selectedHall.name 
        })}>
          Share Hall
        </button>
      </div>
    ) : (
      "📍 Shared Location"
    )}
  </Popup>
</Marker>

  {halls.map((hall, idx) => (
    <Marker key={idx} position={[hall.lat, hall.lng]}>
      <Popup> {hall.name}</Popup>
    </Marker>
  ))}

{currentLocation && selectedHall && mapRef.current && (
  <RoutingMachine 
    map={mapRef.current}
    from={currentLocation}
    to={selectedHall}
  />
)}

  {currentLocation && (
    <Polyline
      positions={[
        [currentLocation.lat, currentLocation.lng],
        [selectedHall.lat, selectedHall.lng],
      ]}
      color="pink"
    />
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