'use client';

import { useState, useEffect, useTransition } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { saveLocationSettings } from './actions';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function SearchField() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: 'bar',
      showMarker: false,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Adres arayın...',
      keepResult: true,
    });
    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);
  return null;
}

interface AdminMapProps {
  initialLat?: number;
  initialLng?: number;
}

const DEFAULT_POSITION: [number, number] = [39.9118045, 32.7686267];

export default function AdminMap({ initialLat, initialLng }: AdminMapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? L.latLng(initialLat, initialLng) : null
  );
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!position) return;
    startTransition(async () => {
      await saveLocationSettings(position.lat.toString(), position.lng.toString());
      alert('Konum başarıyla kaydedildi!');
    });
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    });

    useEffect(() => {
      const handleLocation = (e: any) => {
        if (e.location && e.location.y && e.location.x) {
           setPosition(L.latLng(e.location.y, e.location.x));
        }
      };
      map.on('geosearch/showlocation', handleLocation);
      return () => {
        map.off('geosearch/showlocation', handleLocation);
      };
    }, [map]);

    return position === null ? null : (
      <Marker position={position}>
        <Popup>Seçtiğiniz Konum</Popup>
      </Marker>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-300 relative z-0">
        <MapContainer 
          center={position || DEFAULT_POSITION} 
          zoom={14} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SearchField />
          <LocationMarker />
        </MapContainer>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Haritaya tıklayarak veya arama yaparak kliniğinizin yerini işaretleyin.
          {position && <div className="mt-1 font-mono text-xs text-slate-400">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</div>}
        </div>
        <button
          onClick={handleSave}
          disabled={!position || isPending}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
        >
          {isPending ? 'Kaydediliyor...' : 'Konumu Kaydet'}
        </button>
      </div>
    </div>
  );
}
