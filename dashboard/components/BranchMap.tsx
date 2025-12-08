'use client';

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

interface Branch {
  bank_name: string;
  lat: number;
  long: number;
}

interface BranchMapProps {
  selectedBank?: string | null;
}

// Define color mapping for banks
const bankColors: { [key: string]: string } = {
  'Bank of Baku': '#e74c3c',
  'Kapital Bank': '#3498db',
  'ABB Bank': '#2ecc71',
  'Yelo Bank': '#f39c12',
  'Rabita Bank': '#9b59b6',
  'Xalq Bank': '#1abc9c',
  'AccessBank': '#e67e22',
  'Unibank': '#34495e',
  'VTB Bank': '#16a085',
  'Bank Respublika': '#c0392b',
};

// Create custom icons for different banks
const createIcon = (color: string, isHighlighted: boolean = false) => {
  const size = isHighlighted ? 35 : 25;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: ${isHighlighted ? '4px' : '2px'} solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ${isHighlighted ? 'transform: scale(1.1); z-index: 1000;' : ''}
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function BranchMap({ selectedBank }: BranchMapProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/branches.json')
      .then((res) => res.json())
      .then((data) => {
        setBranches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading branches:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading map...</div>
      </div>
    );
  }

  // Filter branches based on selected bank
  const displayedBranches = selectedBank && selectedBank !== 'all'
    ? branches.filter((b) => b.bank_name === selectedBank)
    : branches;

  // Default center (Azerbaijan center)
  const center: [number, number] = [40.4093, 47.5769];

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {displayedBranches.map((branch, idx) => {
          const color = bankColors[branch.bank_name] || '#95a5a6';
          const isHighlighted = branch.bank_name === 'Bank of Baku';

          if (isHighlighted || selectedBank === branch.bank_name) {
            // Use custom marker for Bank of Baku and selected banks
            return (
              <Marker
                key={idx}
                position={[branch.lat, branch.long]}
                icon={createIcon(color, true)}
              >
                <Popup>
                  <div className="font-semibold text-sm">
                    {branch.bank_name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {branch.lat.toFixed(4)}, {branch.long.toFixed(4)}
                  </div>
                </Popup>
              </Marker>
            );
          }

          // Use circle markers for other banks
          return (
            <CircleMarker
              key={idx}
              center={[branch.lat, branch.long]}
              radius={4}
              pathOptions={{
                color: 'white',
                weight: 1,
                fillColor: color,
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <div className="font-semibold text-sm">
                  {branch.bank_name}
                </div>
                <div className="text-xs text-gray-600">
                  {branch.lat.toFixed(4)}, {branch.long.toFixed(4)}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
