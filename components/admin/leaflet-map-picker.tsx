'use client';

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LeafletMapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}

const defaultPosition: [number, number] = [24.7136, 46.6753]; // Riyadh

function LocationMarker({ onSelect, initial }: { onSelect: (location: { lat: number; lng: number; address: string }) => void; initial?: { lat: number; lng: number; address: string } }) {
  const [position, setPosition] = useState<[number, number] | null>(initial ? [initial.lat, initial.lng] : null);
  const [address, setAddress] = useState<string>(initial?.address || "");

  useMapEvents({
    click(e: { latlng: { lat: number; lng: number } }) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`)
        .then((res) => res.json())
        .then((data) => {
          const addr = data.display_name || `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
          setAddress(addr);
          onSelect({ lat: e.latlng.lat, lng: e.latlng.lng, address: addr });
        });
    },
  });

  useEffect(() => {
    if (initial && initial.lat && initial.lng) {
      setPosition([initial.lat, initial.lng]);
      setAddress(initial.address || "");
    }
  }, [initial]);

  if (!position) return null;

  return (
    <Marker position={position} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })}>
      <Popup>{address}</Popup>
    </Marker>
  );
}

export const LeafletMapPicker: React.FC<LeafletMapPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (map && initialLocation) {
      map.setView([initialLocation.lat, initialLocation.lng], 13);
    }
  }, [map, initialLocation]);

  if (typeof window !== 'undefined') {
    return (
      <div className="space-y-2">
        <div className="w-full h-64 rounded-lg border border-gray-300 overflow-hidden">
          <MapContainer
            center={initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultPosition}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onSelect={onLocationSelect} initial={initialLocation} />
          </MapContainer>
        </div>
      </div>
    );
  }
  return null;
};