import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrainData } from './TrainSelector';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  MapPin, 
  Train,
  Navigation,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface IndiaRailwayMapProps {
  selectedTrain: TrainData | null;
  trains: TrainData[];
  onTrainClick: (train: TrainData) => void;
}

// Major railway stations in India
const majorStations = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090, code: 'NDLS' },
  { name: 'Mumbai Central', lat: 19.0760, lng: 72.8777, code: 'MMCT' },
  { name: 'Chennai Central', lat: 13.0827, lng: 80.2707, code: 'MAS' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, code: 'HWH' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, code: 'SBC' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, code: 'SC' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, code: 'ADI' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, code: 'PUNE' },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319, code: 'CNB' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, code: 'LKO' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, code: 'JP' },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, code: 'BPL' },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812, code: 'BRC' },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, code: 'NGP' },
];

// Major railway routes (simplified)
const railwayRoutes = [
  // Golden Quadrilateral
  { from: { lat: 28.6139, lng: 77.2090 }, to: { lat: 19.0760, lng: 72.8777 }, name: 'Delhi-Mumbai' },
  { from: { lat: 19.0760, lng: 72.8777 }, to: { lat: 13.0827, lng: 80.2707 }, name: 'Mumbai-Chennai' },
  { from: { lat: 13.0827, lng: 80.2707 }, to: { lat: 22.5726, lng: 88.3639 }, name: 'Chennai-Kolkata' },
  { from: { lat: 22.5726, lng: 88.3639 }, to: { lat: 28.6139, lng: 77.2090 }, name: 'Kolkata-Delhi' },
  
  // Other major routes
  { from: { lat: 28.6139, lng: 77.2090 }, to: { lat: 23.0225, lng: 72.5714 }, name: 'Delhi-Ahmedabad' },
  { from: { lat: 19.0760, lng: 72.8777 }, to: { lat: 12.9716, lng: 77.5946 }, name: 'Mumbai-Bangalore' },
  { from: { lat: 28.6139, lng: 77.2090 }, to: { lat: 26.8467, lng: 80.9462 }, name: 'Delhi-Lucknow' },
];

export function IndiaRailwayMap({ selectedTrain, trains, onTrainClick }: IndiaRailwayMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredTrain, setHoveredTrain] = useState<TrainData | null>(null);

  // Convert lat/lng to SVG coordinates
  const project = (lat: number, lng: number) => {
    const x = ((lng - 68) / (97 - 68)) * 800; // India's longitude range
    const y = ((37 - lat) / (37 - 6)) * 600;  // India's latitude range (inverted for SVG)
    return { x: x * zoom + pan.x, y: y * zoom + pan.y };
  };

  const getTrainColor = (train: TrainData) => {
    switch (train.type) {
      case 'Rajdhani': return '#ef4444'; // red
      case 'Shatabdi': return '#3b82f6'; // blue
      case 'Duronto': return '#8b5cf6'; // purple
      case 'Express': return '#10b981'; // green
      case 'Passenger': return '#f59e0b'; // orange
      case 'Freight': return '#6b7280'; // gray
      default: return '#10b981';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - pan.x, 
      y: e.clientY - pan.y 
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const focusOnTrain = (train: TrainData) => {
    const projected = project(train.currentLocation.lat, train.currentLocation.lng);
    setPan({
      x: 400 - projected.x / zoom,
      y: 300 - projected.y / zoom
    });
    setZoom(1.5);
  };

  return (
    <Card className={`${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'} bg-gray-900 text-white`}>
      <CardHeader className="pb-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-400" />
            India Railway Network - Live Map
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Rajdhani</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Shatabdi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Express</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Passenger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Freight</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        <div className="relative overflow-hidden" style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '500px' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            className="cursor-move bg-gray-900"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* India outline (simplified) */}
            <path
              d="M150,50 L650,50 L700,150 L680,300 L650,450 L550,550 L400,580 L250,560 L150,450 L120,300 L130,150 Z"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              transform={`scale(${zoom}) translate(${pan.x}, ${pan.y})`}
            />

            {/* Railway routes */}
            {railwayRoutes.map((route, index) => {
              const from = project(route.from.lat, route.from.lng);
              const to = project(route.to.lat, route.to.lng);
              return (
                <line
                  key={index}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#4b5563"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}

            {/* Major stations */}
            {majorStations.map((station) => {
              const pos = project(station.lat, station.lng);
              return (
                <g key={station.code}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="4"
                    fill="#fbbf24"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x + 8}
                    y={pos.y + 4}
                    fill="#fbbf24"
                    fontSize="10"
                    className="font-medium"
                  >
                    {station.name}
                  </text>
                </g>
              );
            })}

            {/* Train positions */}
            {trains.map((train) => {
              const pos = project(train.currentLocation.lat, train.currentLocation.lng);
              const isSelected = selectedTrain?.id === train.id;
              
              return (
                <g key={train.id}>
                  {/* Train route (if selected) */}
                  {isSelected && train.route.length > 1 && (
                    <path
                      d={train.route.map((point, index) => {
                        const p = project(point.lat, point.lng);
                        return `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
                      }).join(' ')}
                      fill="none"
                      stroke={getTrainColor(train)}
                      strokeWidth="3"
                      strokeOpacity="0.6"
                    />
                  )}
                  
                  {/* Train icon */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? "8" : "6"}
                    fill={getTrainColor(train)}
                    stroke={isSelected ? "#fff" : "none"}
                    strokeWidth="2"
                    className="cursor-pointer animate-pulse"
                    onClick={() => onTrainClick(train)}
                    onMouseEnter={() => setHoveredTrain(train)}
                    onMouseLeave={() => setHoveredTrain(null)}
                  />
                  
                  {/* Train number */}
                  <text
                    x={pos.x}
                    y={pos.y - 12}
                    fill="#fff"
                    fontSize="8"
                    textAnchor="middle"
                    className="font-medium pointer-events-none"
                  >
                    {train.number}
                  </text>
                </g>
              );
            })}

            {/* Bogies for selected train */}
            {selectedTrain && selectedTrain.bogies.map((bogie, index) => {
              const pos = project(bogie.location.lat, bogie.location.lng);
              return (
                <circle
                  key={bogie.id}
                  cx={pos.x}
                  cy={pos.y}
                  r="3"
                  fill={getTrainColor(selectedTrain)}
                  fillOpacity="0.7"
                  stroke="#fff"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredTrain && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-sm">
              <div className="font-medium">{hoveredTrain.name}</div>
              <div className="text-xs text-gray-300 mt-1">
                Speed: {Math.round(hoveredTrain.currentSpeed)} km/h
              </div>
              <div className="text-xs text-gray-300">
                Next: {hoveredTrain.nextStation}
              </div>
              <div className="text-xs text-gray-300">
                Status: {hoveredTrain.status}
              </div>
            </div>
          )}

          {/* Mini map */}
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-black bg-opacity-80 rounded border border-gray-600">
            <svg width="100%" height="100%" viewBox="0 0 800 600">
              {/* India outline */}
              <path
                d="M150,50 L650,50 L700,150 L680,300 L650,450 L550,550 L400,580 L250,560 L150,450 L120,300 L130,150 Z"
                fill="#374151"
                stroke="#6b7280"
                strokeWidth="1"
              />
              
              {/* View indicator */}
              <rect
                x={(400 + pan.x) / zoom - 50}
                y={(300 + pan.y) / zoom - 37.5}
                width={100 / zoom}
                height={75 / zoom}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Quick actions */}
          {selectedTrain && (
            <div className="absolute top-4 right-4 space-y-2">
              <Button
                size="sm"
                onClick={() => focusOnTrain(selectedTrain)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Focus Train
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}