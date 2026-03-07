import { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DbProperty } from "@/types/database";
import { Loader2 } from "lucide-react";

// Fix default marker icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const cityCoords: Record<string, [number, number]> = {
  Erbil: [36.1912, 44.0119],
  Baghdad: [33.3152, 44.3661],
  Basra: [30.5085, 47.7804],
  Sulaymaniyah: [35.5570, 45.4351],
};

interface MarketplaceMapProps {
  properties: DbProperty[];
  isLoading: boolean;
}

export default function MarketplaceMap({ properties, isLoading }: MarketplaceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();

  // Determine center from first property's city
  const center = useMemo(() => {
    if (properties.length > 0) {
      const p = properties[0];
      if (p.lat && p.lng) return [p.lat, p.lng] as [number, number];
      if (p.city && cityCoords[p.city]) return cityCoords[p.city];
    }
    return [33.3152, 44.3661] as [number, number]; // Baghdad default
  }, [properties]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, { zoomControl: true }).setView(center, 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      mapRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = null;
      }
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();
    map.setView(center, 11, { animate: true });

    properties.forEach((p) => {
      const lat = p.lat || (p.city && cityCoords[p.city] ? cityCoords[p.city][0] + (Math.random() - 0.5) * 0.05 : 0);
      const lng = p.lng || (p.city && cityCoords[p.city] ? cityCoords[p.city][1] + (Math.random() - 0.5) * 0.05 : 0);

      if (!lat || !lng) return;

      const marker = L.marker([lat, lng]);
      const popup = L.popup({ maxWidth: 260 }).setContent(`
        <div style="font-family: Inter, sans-serif; min-width: 200px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #1a1a2e;">${p.title}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 6px;">${p.district || ""}, ${p.city}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 700; font-size: 16px; color: #0284c7;">$${p.price.toLocaleString()}</span>
            <span style="background: ${p.terra_score >= 80 ? "#22c55e" : p.terra_score >= 50 ? "#f59e0b" : "#ef4444"}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">TS ${p.terra_score}</span>
          </div>
          <div style="font-size: 11px; color: #888;">${p.bedrooms > 0 ? p.bedrooms + " Beds · " : ""}${p.bathrooms} Baths · ${p.area}m²</div>
          <button onclick="window.__tvNavTo('/property/${p.id}')" style="width: 100%; margin-top: 8px; padding: 6px 12px; border: none; border-radius: 8px; background: linear-gradient(135deg, #d4a843, #b8862d); color: white; font-size: 12px; font-weight: 600; cursor: pointer;">View Details</button>
        </div>
      `);

      marker.bindPopup(popup);
      markers.addLayer(marker);
    });
  }, [properties, center]);

  // Global nav handler for popup buttons
  useEffect(() => {
    (window as any).__tvNavTo = (path: string) => navigate(path);
    return () => { delete (window as any).__tvNavTo; };
  }, [navigate]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div
      ref={mapContainerRef}
      className="rounded-xl overflow-hidden border border-border w-full"
      style={{ height: "calc(100vh - 400px)", minHeight: "400px" }}
    />
  );
}
