import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

export default function MapModal({ start, destination, onClose }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const geoapifyKey = import.meta.env.VITE_GEOAPIFY_KEY;

  useEffect(() => {
    if (!start || !destination) return;

    const map = L.map(mapRef.current, { preferCanvas: true }).setView(
      [start.lat, start.lon],
      16
    );

    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);

    layerGroup.addLayer(L.marker([start.lat, start.lon]).bindTooltip("Start"));
    layerGroup.addLayer(
      L.marker([destination.lat, destination.lon]).bindTooltip("Destination")
    );

    const drawRoute = (coords) => {
      const latlngs = coords.map(([lon, lat]) => [lat, lon]);
      L.polyline(latlngs, { weight: 6, color: "#2563EB", opacity: 0.9 }).addTo(
        layerGroup
      );
      setRouteCoords(latlngs);
    };

    (async () => {
      try {
        if (geoapifyKey) {
          const geoUrl = `https://api.geoapify.com/v1/routing?waypoints=${start.lon},${start.lat}|${destination.lon},${destination.lat}&mode=drive&apiKey=${geoapifyKey}`;
          const res = await fetch(geoUrl);
          const json = await res.json();

          if (json.features?.length) {
            const coords = json.features[0].geometry.coordinates;
            if (coords.length) {
              drawRoute(coords);
              return;
            }
          }
        }

        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
        const res2 = await fetch(osrmUrl);
        const json2 = await res2.json();

        if (json2.routes?.[0]?.geometry?.coordinates) {
          drawRoute(json2.routes[0].geometry.coordinates);
          return;
        }
      } catch (err) {
        console.error("Routing error:", err);
      }
    })();

    return () => {
      layerGroup.clearLayers();
      map.remove();
    };
  }, [start, destination]);

  // ✅ Auto zoom to route
  useEffect(() => {
    if (mapInstance.current && routeCoords.length > 0) {
      mapInstance.current.fitBounds(routeCoords, { padding: [40, 40] });
    }
  }, [routeCoords]);

  // ✅ ESC key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      onClick={onClose} // ✅ clicking outside closes modal
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()} // ❌ prevent closing when clicking inside
        className="bg-white rounded-lg shadow-lg w-[95%] max-w-4xl h-[85vh] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-lg font-bold"
        >
          ✕
        </button>

        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
}
