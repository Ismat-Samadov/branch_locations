'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

// Define color mapping for banks - AzerTurk Bank in distinct red, others in cool tones
const bankColors: { [key: string]: string } = {
  'AzerTurk Bank': '#FF0000',       // Bright red - highly distinct
  'Kapital Bank': '#2196F3',        // Blue
  'ABB Bank': '#4CAF50',            // Green
  'Yelo Bank': '#FFC107',           // Amber/Yellow
  'Rabita Bank': '#9C27B0',         // Purple
  'Xalq Bank': '#00BCD4',           // Cyan
  'AccessBank': '#FF9800',          // Orange
  'Unibank': '#607D8B',             // Blue Grey
  'VTB Bank': '#009688',            // Teal
  'Bank Respublika': '#3F51B5',     // Indigo (changed from red)
  'Pasha Bank': '#8BC34A',          // Light Green
  'Turan Bank': '#00ACC1',          // Dark Cyan
  'AGBank': '#7B1FA2',              // Deep Purple
  'Expressbank': '#E91E63',         // Pink
  'Muganbank': '#FF5722',           // Deep Orange
  'Yapı Kredi Bank': '#795548',     // Brown
  'Bank Avrasiya': '#0288D1',       // Light Blue
  'default': '#78909C'              // Grey for any other bank
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
          const color = bankColors[branch.bank_name] || bankColors['default'];
          const isAzerTurkBank = branch.bank_name === 'AzerTurk Bank';
          const isSelected = selectedBank === branch.bank_name;

          // Make AzerTurk Bank and selected banks larger
          const isHighlighted = isAzerTurkBank || isSelected;

          return (
            <Marker
              key={idx}
              position={[branch.lat, branch.long]}
              icon={createIcon(color, isHighlighted)}
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
        })}
      </MapContainer>
    </div>
  );
}
