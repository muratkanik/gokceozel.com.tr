'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Default to clinic position if none provided
const DEFAULT_POSITION: [number, number] = [39.9118045, 32.7686267];

interface ContactMapProps {
  lat?: number;
  lng?: number;
  name?: string;
  address?: string;
}

export default function ContactMap({ lat, lng, name, address }: ContactMapProps) {
  const position: [number, number] = lat && lng ? [lat, lng] : DEFAULT_POSITION;

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center space-y-2">
              <strong>{name || "Prof. Dr. Gökçe Özel Kliniği"}</strong><br/>
              <span className="text-xs text-slate-500">{address || "Mustafa Kemal Mahallesi, Ankara"}</span><br/>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1.5 mt-1 bg-[#17201e] text-white text-xs font-bold rounded hover:bg-[#b8893c] transition-colors"
              >
                Yol Tarifi Al
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
