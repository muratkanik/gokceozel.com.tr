'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CLINIC_POSITION: [number, number] = [39.8938, 32.6897];

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
    
    // Cleanup
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
}

function LocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
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
}

export default function ContactMap() {
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={CLINIC_POSITION} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={CLINIC_POSITION}>
          <Popup>
            <strong>Prof. Dr. Gökçe Özel Kliniği</strong><br/>
            Ümitköy, Ankara
          </Popup>
        </Marker>
        
        <SearchField />
        <LocationMarker />
      </MapContainer>
      <div className="absolute top-2 right-2 z-[400] bg-white px-3 py-2 rounded-lg shadow-md text-xs font-semibold text-[#17201e] pointer-events-none">
        Haritaya tıklayarak veya arama yaparak iğne bırakabilirsiniz 📍
      </div>
    </div>
  );
}
