import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

interface Station {
  name: string;
  lat: number;
  lng: number;
}

interface TrainMapProps {
  trainId: string;
  coordinates: { lat: number; lng: number };
  route?: Array<{ lat: number; lng: number }>;
  stations?: Station[];
  speedKmph?: number;
  onPointClick?: (point: { lat: number; lng: number; name?: string }) => void;
  className?: string;
}

// Fix default marker icon paths for Leaflet when bundling
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon as any;

function ClickHandler({ onClick }: { onClick?: TrainMapProps['onPointClick'] }) {
  useMapEvents({
    click: (e) => onClick?.({ lat: e.latlng.lat, lng: e.latlng.lng })
  });
  return null;
}

export function TrainMap({ trainId, coordinates, route = [], stations = [], speedKmph, onPointClick, className }: TrainMapProps) {
  const [position, setPosition] = useState<LatLngExpression>([coordinates.lat, coordinates.lng]);

  // Simulate movement if coordinates change rarely
  useEffect(() => {
    setPosition([coordinates.lat, coordinates.lng]);
  }, [coordinates.lat, coordinates.lng]);

  const polyline = useMemo(() => route.map(p => [p.lat, p.lng]) as LatLngExpression[], [route]);

  return (
    <div className={className}>
      <MapContainer center={position as LatLngExpression} zoom={6} style={{ width: '100%', height: '100%' }} scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {/* Train Marker */}
        <Marker position={position as LatLngExpression}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">Train: {trainId}</div>
              {typeof speedKmph === 'number' && <div>Speed: {Math.round(speedKmph)} km/h</div>}
              <div>Lat: {(position as any)[0].toFixed(5)}</div>
              <div>Lng: {(position as any)[1].toFixed(5)}</div>
            </div>
          </Popup>
        </Marker>

        {/* Route */}
        {polyline.length > 1 && (
          <Polyline positions={polyline} pathOptions={{ color: '#1d4ed8', weight: 4 }} />
        )}

        {/* Stations */}
        {stations.map((s) => (
          <Marker key={s.name} position={[s.lat, s.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{s.name}</div>
                <div>Lat: {s.lat.toFixed(5)}</div>
                <div>Lng: {s.lng.toFixed(5)}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* clicks */}
        <ClickHandler onClick={onPointClick} />
      </MapContainer>
    </div>
  );
}

export default TrainMap;

