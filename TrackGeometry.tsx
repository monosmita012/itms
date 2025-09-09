import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';
import { LiveMap } from './LiveMap';

// Mock data for track geometry
const geometryData = [
  { chainage: 0, gauge: 2, alignment: 1.5, crossLevel: 0.8, twist: 1.2, unevenness: 0.9 },
  { chainage: 5, gauge: 1.8, alignment: 2.1, crossLevel: 1.2, twist: 0.8, unevenness: 1.1 },
  { chainage: 10, gauge: 3.2, alignment: 1.8, crossLevel: 1.5, twist: 2.1, unevenness: 1.3 },
  { chainage: 15, gauge: 2.5, alignment: 2.8, crossLevel: 1.1, twist: 1.5, unevenness: 0.7 },
  { chainage: 20, gauge: 1.9, alignment: 1.3, crossLevel: 0.9, twist: 1.1, unevenness: 1.2 },
  { chainage: 25, gauge: 4.1, alignment: 3.2, crossLevel: 2.1, twist: 2.8, unevenness: 1.8 },
  { chainage: 30, gauge: 2.2, alignment: 1.9, crossLevel: 1.3, twist: 1.4, unevenness: 1.0 },
  { chainage: 35, gauge: 1.7, alignment: 1.1, crossLevel: 0.8, twist: 0.9, unevenness: 0.8 },
];

// Heatmap data
const heatmapData = [
  { parameter: 'Gauge', values: [2, 1, 3, 2, 1, 4, 2, 1] },
  { parameter: 'Alignment', values: [1, 2, 1, 3, 1, 3, 2, 1] },
  { parameter: 'Cross Level', values: [1, 1, 2, 1, 1, 2, 1, 1] },
  { parameter: 'Twist', values: [1, 1, 2, 2, 1, 3, 1, 1] },
  { parameter: 'Unevenness', values: [1, 1, 1, 1, 1, 2, 1, 1] },
];

// Track segments with health status
const trackSegments = [
  { start: 0, end: 10, health: 'good' },
  { start: 10, end: 15, health: 'warning' },
  { start: 15, end: 25, health: 'good' },
  { start: 25, end: 30, health: 'critical' },
  { start: 30, end: 40, health: 'good' },
];

const getSeverityColor = (value: number) => {
  if (value <= 1.5) return 'bg-green-500';
  if (value <= 2.5) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getHealthColor = (health: string) => {
  switch (health) {
    case 'good': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'critical': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

interface TrackGeometryProps {
  onLocationClick?: (point: any) => void;
  showDetailedView?: boolean;
  trainContext?: any;
}

export function TrackGeometry({ onLocationClick, showDetailedView = false, trainContext }: TrackGeometryProps) {
  return (
    <div className="space-y-6">
      {/* Live Map - Only show on main dashboard */}
      {!showDetailedView && (
        <LiveMap onLocationClick={onLocationClick} showDetailedView={showDetailedView} />
      )}
      {/* Multi-Line Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Track Geometry Parameters
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                XML
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                JPEG
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={geometryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="chainage" 
                label={{ value: 'Chainage (km)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: 'Deviation (mm)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              
              {/* Tolerance lines */}
              <Line 
                type="monotone" 
                dataKey={() => 3} 
                stroke="#ff0000" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
                name="Upper Tolerance"
              />
              <Line 
                type="monotone" 
                dataKey={() => -3} 
                stroke="#ff0000" 
                strokeDasharray="5 5" 
                strokeWidth={1}
                dot={false}
                name="Lower Tolerance"
              />
              
              {/* Data lines */}
              <Line type="monotone" dataKey="gauge" stroke="#0ea5e9" strokeWidth={2} name="Gauge" />
              <Line type="monotone" dataKey="alignment" stroke="#f97316" strokeWidth={2} name="Alignment" />
              <Line type="monotone" dataKey="crossLevel" stroke="#22c55e" strokeWidth={2} name="Cross Level" />
              <Line type="monotone" dataKey="twist" stroke="#a855f7" strokeWidth={2} name="Twist" />
              <Line type="monotone" dataKey="unevenness" stroke="#06b6d4" strokeWidth={2} name="Unevenness" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap Overview */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Parameter Severity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {heatmapData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <div className="w-20 text-sm font-medium">{row.parameter}</div>
                  <div className="flex gap-1 flex-1">
                    {row.values.map((value, colIndex) => (
                      <div
                        key={colIndex}
                        className={`h-8 flex-1 rounded ${getSeverityColor(value)} opacity-80`}
                        title={`Chainage ${colIndex * 5}km: ${value}mm`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
              <span>0 km</span>
              <span>Chainage</span>
              <span>35 km</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Good (&lt;1.5mm)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs">Warning (1.5-2.5mm)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs">Critical (&gt;2.5mm)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Track Segment Health */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Track Segment Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Track representation */}
              <div className="relative">
                <div className="flex h-12 bg-gray-200 rounded-lg overflow-hidden">
                  {trackSegments.map((segment, index) => (
                    <div
                      key={index}
                      className={`${getHealthColor(segment.health)} relative flex items-center justify-center`}
                      style={{ 
                        width: `${((segment.end - segment.start) / 40) * 100}%` 
                      }}
                    >
                      {segment.health === 'critical' && (
                        <AlertTriangle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Chainage markers */}
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>0 km</span>
                  <span>10 km</span>
                  <span>20 km</span>
                  <span>30 km</span>
                  <span>40 km</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <h4 className="font-medium">Segment Status:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 justify-center">
                    Good
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 justify-center">
                    Warning
                  </Badge>
                  <Badge variant="secondary" className="bg-red-100 text-red-800 justify-center">
                    Critical
                  </Badge>
                </div>
              </div>

              {/* Current alerts */}
              <div className="space-y-2">
                <h4 className="font-medium">Active Alerts:</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Critical deviation at 25.3 km</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>Warning level at 12.7 km</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}