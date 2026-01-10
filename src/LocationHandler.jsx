
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppState } from "./AppState.jsx";

const LocationHandler = () => {
  const { coords } = useParams(); // form "6.51749,3.37388"
  const navigate = useNavigate();
  const { setPendingHighlight } = useAppState();

  useEffect(() => {
    if (!coords) { navigate("/"); return; }
    const [latStr, lngStr] = coords.split(",");
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (isNaN(lat) || isNaN(lng)) { navigate("/"); return; }

    setPendingHighlight({ lat, lng, zoom: 18 });
    navigate("/hallsearch");
  }, [coords]);

  return null; // nothing to render; acts like redirect+queue
};

export default LocationHandler;
