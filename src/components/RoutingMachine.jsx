// src/components/RoutingMachine.jsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RoutingMachine = ({ from, to }) => {
  useEffect(() => {
    if (!from || !to || !window.mapInstance) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng)
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1"
      }),
      show: false,      // hide default UI
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(window.mapInstance);

    return () => window.mapInstance.removeControl(routingControl);
  }, [from, to]);

  return null;
};

export default RoutingMachine;
