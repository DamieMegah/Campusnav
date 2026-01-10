import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RoutingMachine = ({ map, from, to }) => {
  useEffect(() => {
    if (!map || !from || !to) return;

    let routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      lineOptions: {
        styles: [{ color: "#007bff", weight: 5, opacity: 0.8 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    }).addTo(map);

    // Optional logs
    routingControl.on("routesfound", (e) => {
      console.log("✅ Route found:", e.routes[0]);
    });

    routingControl.on("routingerror", (err) => {
      console.error("❌ Routing error:", err);
    });

    // 🚫 Instead of removing immediately, delay cleanup to avoid async conflict
    return () => {
      if (routingControl && map.hasLayer(routingControl)) {
        map.removeControl(routingControl);
      }
      routingControl = null;
    };
  }, [map, from, to]);

  return null;
};

export default RoutingMachine;
