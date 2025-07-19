import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RoutingMachine from './RoutingMachine';
import './Search.css';
import { Link } from "react-router-dom";

import bagImg from '../assets/bag.jpg';


// Fix default marker icon issue in Leaflet + Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const HallSearch = () => {
  const [query, setQuery] = useState("");
  const [selectedHall, setSelectedHall] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Halls data
  const halls = [
    { name: "YCT Microfinance Bank", code: "YCT-MFB", img: bagImg, lat: 6.517496274395178, lng: 3.373883655685138 },
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
    { name: "ZENITH BANK/CITM", code: "ZENITH-Citm", img: "/images/zenith.jpg", lat: 6.5176694912116035, lng: 3.374114325670222 },
    { name: "Bursary", code: "BURSARY", img: "/images/bursary.jpg", lat: 6.516923326046316, lng: 3.3741760164623313 },
    { name: "College Hall", code: "COLLEGE-HALL", img: "/images/collegehall.jpg", lat: 6.516622194794321, lng: 3.3749243527859027 },
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
  };

  const handleSearch = () => {
    if (!selectedHall) alert("Please enter desire location!");
    else setShowSuggestions(false);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
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
      {/* Search input & buttons */}
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
      <button className="locate-button" onClick={handleLocateMe}>📍My Location</button>


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
          <img src={selectedHall.img} alt={selectedHall.name} />

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
  zoom={15}
  scrollWheelZoom={false}
  
  whenCreated={(mapInstance) => {
    window.mapInstance = mapInstance;
  }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; OpenStreetMap & Damiemegah contributors"
  />

  {currentLocation && (
    <Marker position={[currentLocation.lat, currentLocation.lng]}>
      <Popup>📍 You are here</Popup>
    </Marker>
  )}

  <Marker position={[selectedHall.lat, selectedHall.lng]}>
    <Popup>📍{selectedHall.name}</Popup>
  </Marker>

  {halls.map((hall, idx) => (
    <Marker key={idx} position={[hall.lat, hall.lng]}>
      <Popup>🏫 {hall.name}</Popup>
    </Marker>
  ))}

  {currentLocation && selectedHall && (
    <RoutingMachine from={currentLocation} to={selectedHall} />
  )}

  {currentLocation && (
    <Polyline
      positions={[
        [currentLocation.lat, currentLocation.lng],
        [selectedHall.lat, selectedHall.lng]
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

      {/* Show current user location */}
      {currentLocation && (
        <div className="current-location">
          <p><strong>Your Location:</strong> {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}</p>
        </div>
      )}

           
    </div>
  );
};

export default HallSearch;
