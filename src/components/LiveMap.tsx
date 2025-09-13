import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { MapPin, Navigation, AlertTriangle, CheckCircle, Eye, Map, Maximize2, Minimize2 } from 'lucide-react';
import { TrainMap } from './TrainMap';

// Mock GPS tracking points every 25cm (0.25m)
interface TrackPoint {
  id: string;
  chainage: string;
  lat: string;
  lng: string;
  status: string;
  severity: string;
  defectType: string | null;
  timestamp: string;
}

const generateTrackPoints = (): TrackPoint[] => {
  const points: TrackPoint[] = [];
  const startLat = 28.6139; // Delhi coordinates as example
  const startLng = 77.2090;
  const totalDistance = 10000; // 10km in meters
  const interval = 0.25; // 25cm intervals
  
  for (let distance = 0; distance <= totalDistance; distance += interval) {
    const chainage = distance / 1000; // Convert to km
    const lat = startLat + (distance * 0.00001 * Math.cos(distance * 0.01));
    const lng = startLng + (distance * 0.00001 * Math.sin(distance * 0.01));
    
    // Randomly assign defects to some points
    const hasDefect = Math.random() < 0.05; // 5% chance of defect
    const severity = hasDefect ? 
      (Math.random() < 0.3 ? 'critical' : (Math.random() < 0.6 ? 'warning' : 'info')) : 
      'normal';
    
    points.push({
      id: `point_${distance}`,
      chainage: chainage.toFixed(3),
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      status: hasDefect ? 'defected' : 'normal',
      severity,
      defectType: hasDefect ? 
        ['Rail Crack', 'Fastening Issue', 'Ballast Settlement', 'Sleeper Damage'][Math.floor(Math.random() * 4)] : 
        null,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()
    });
  }
  
  return points;
};

interface LiveMapProps {
  onLocationClick?: (point: any) => void;
  showDetailedView?: boolean;
  trainContext?: any;
}

export function LiveMap({ onLocationClick, showDetailedView = false, trainContext }: LiveMapProps) {
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>(generateTrackPoints());
  const [currentPosition, setCurrentPosition] = useState(4000); // Current position in meters
  const [hoveredPoint, setHoveredPoint] = useState<TrackPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<TrackPoint | null>(null);
  const [mapView, setMapView] = useState<'svg' | 'gis'>('svg');
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);

  // Simulate live tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition(prev => (prev + 1) % 10000); // Loop through track
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMarkerColor = (point: TrackPoint) => {
    if (point.status === 'defected') {
      switch (point.severity) {
        case 'critical': return 'bg-red-500';
        case 'warning': return 'bg-yellow-500';
        case 'info': return 'bg-blue-500';
        default: return 'bg-green-500';
      }
    }
    return 'bg-green-500';
  };

  const getMarkerIcon = (point: TrackPoint) => {
    if (point.status === 'defected') {
      return <AlertTriangle className="w-2 h-2 text-white" />;
    }
    return <CheckCircle className="w-2 h-2 text-white" />;
  };

  const handlePointClick = (point: TrackPoint) => {
    setSelectedPoint(point);
    if (onLocationClick) {
      onLocationClick(point);
    }
  };

  const currentPositionKm = (currentPosition / 1000).toFixed(3);
  const visiblePoints = trackPoints.filter((_, index) => 
    showDetailedView ? true : index % 100 === 0 // Show every 100th point for overview, all for detailed view
  );

  return (
    <TooltipProvider>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Live Track Monitoring
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Navigation className="w-3 h-3 mr-1" />
                Position: {currentPositionKm} km
              </Badge>
              <Badge variant="outline">
                GPS: {trackPoints[Math.floor(currentPosition / 0.25)]?.lat}, {trackPoints[Math.floor(currentPosition / 0.25)]?.lng}
              </Badge>
            </div>
          </CardTitle>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant={mapView === 'svg' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('svg')}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                SVG Map
              </Button>
              <Button
                variant={mapView === 'gis' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('gis')}
                className="flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                GIS Map
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullScreenMap(!showFullScreenMap)}
                className="flex items-center gap-2"
              >
                {showFullScreenMap ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {showFullScreenMap ? 'Exit Fullscreen' : 'Fullscreen Map'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showFullScreenMap ? (
            <div className="fixed inset-0 z-50 bg-white">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullScreenMap(false)}
                  className="bg-white shadow-lg"
                >
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Exit Fullscreen
                </Button>
              </div>
              <div className="h-full w-full">
                {mapView === 'gis' && trainContext ? (
                  <TrainMap
                    trainId={trainContext.id}
                    coordinates={trainContext.currentLocation}
                    stations={trainContext.route?.map((r: any) => ({ name: r.station || 'Station', lat: r.lat, lng: r.lng })) || []}
                    route={trainContext.route || []}
                    speedKmph={trainContext.currentSpeed}
                    onPointClick={(p) => {
                      onLocationClick?.({ ...p, chainage: trainContext.currentLocation.chainage });
                    }}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">SVG Map in Fullscreen Mode</p>
                      <p className="text-sm text-gray-500 mt-2">Switch to GIS Map for interactive fullscreen view</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              {mapView === 'gis' && trainContext ? (
                <TrainMap
                  trainId={trainContext.id}
                  coordinates={trainContext.currentLocation}
                  stations={trainContext.route?.map((r: any) => ({ name: r.station || 'Station', lat: r.lat, lng: r.lng })) || []}
                  route={trainContext.route || []}
                  speedKmph={trainContext.currentSpeed}
                  onPointClick={(p) => {
                    onLocationClick?.({ ...p, chainage: trainContext.currentLocation.chainage });
                  }}
                  className="h-full w-full"
                />
              ) : (
                <>
                  {/* Background map image */}
                  <img 
                    src="https://images.unsplash.com/photo-1691595567329-e8c38a9db811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlsd2F5JTIwdHJhY2slMjBhZXJpYWwlMjB2aWV3JTIwbWFwfGVufDF8fHx8MTc1Njg1MTE5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Track aerial view"
                    className="w-full h-full object-cover opacity-30"
                  />
                  
                  {/* Track line */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 50 200 Q 200 150 350 200 T 650 200"
                      stroke="#374151"
                      strokeWidth="4"
                      fill="none"
                      className="opacity-60"
                    />
                  </svg>

                  {/* Track points */}
                  {visiblePoints.map((point, index) => {
                    const x = 50 + (index / visiblePoints.length) * 600;
                    const y = 200 + Math.sin(index * 0.1) * 20; // Slight curve for realism
                    
                    return (
                      <Tooltip key={point.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-150 border border-white shadow-sm ${getMarkerColor(point)} ${
                              selectedPoint?.id === point.id ? 'ring-2 ring-blue-500 scale-125' : ''
                            }`}
                            style={{ 
                              left: `${x}px`, 
                              top: `${y}px`,
                              transform: 'translate(-50%, -50%)'
                            }}
                            onClick={() => handlePointClick(point)}
                            onMouseEnter={() => setHoveredPoint(point)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          >
                            {getMarkerIcon(point)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Chainage: {point.chainage} km</div>
                            <div>GPS: {point.lat}, {point.lng}</div>
                            <div>Status: <span className={point.status === 'defected' ? 'text-red-600' : 'text-green-600'}>
                              {point.status === 'defected' ? `${point.defectType} (${point.severity})` : 'Normal'}
                            </span></div>
                            {point.status === 'defected' && (
                              <div className="text-xs text-gray-600">Detected: {point.timestamp}</div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}

                  {/* Current position marker */}
                  <div
                    className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"
                    style={{
                      left: `${50 + (currentPosition / 10000) * 600}px`,
                      top: `${200 + Math.sin(currentPosition * 0.0001) * 20}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Map Controls and Info */}
          <div className="mt-4 space-y-4">
            {/* Legend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Info</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Current Position</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {showDetailedView ? 'Detailed View (25cm intervals)' : 'Overview (25m intervals)'}
              </div>
            </div>

            {/* Selected Point Info */}
            {selectedPoint && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Selected Location</h4>
                    <p className="text-sm text-blue-800">
                      Chainage: {selectedPoint.chainage} km | GPS: {selectedPoint.lat}, {selectedPoint.lng}
                    </p>
                    <p className="text-sm text-blue-700">
                      Status: {selectedPoint.status === 'defected' ? 
                        `${selectedPoint.defectType} (${selectedPoint.severity})` : 
                        'Normal Condition'
                      }
                    </p>
                  </div>
                  {onLocationClick && (
                    <Button size="sm" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Real-time Statistics */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-700">
                  {trackPoints.filter(p => p.status === 'normal').length}
                </div>
                <div className="text-xs text-green-600">Normal Points</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-700">
                  {trackPoints.filter(p => p.severity === 'warning').length}
                </div>
                <div className="text-xs text-yellow-600">Warnings</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-700">
                  {trackPoints.filter(p => p.severity === 'critical').length}
                </div>
                <div className="text-xs text-red-600">Critical Issues</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-700">
                  {currentPositionKm}
                </div>
                <div className="text-xs text-blue-600">Current Position</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}