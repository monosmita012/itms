import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Download, Gauge } from 'lucide-react';

// Cross-section profile data
const profileData = [
  { position: -35, ideal: 0, measured: 0.2 },
  { position: -30, ideal: 2, measured: 1.8 },
  { position: -25, ideal: 8, measured: 7.5 },
  { position: -20, ideal: 15, measured: 14.2 },
  { position: -15, ideal: 20, measured: 19.1 },
  { position: -10, ideal: 22, measured: 21.3 },
  { position: -5, ideal: 23, measured: 22.1 },
  { position: 0, ideal: 23.5, measured: 22.8 },
  { position: 5, ideal: 23, measured: 22.1 },
  { position: 10, ideal: 22, measured: 21.3 },
  { position: 15, ideal: 20, measured: 19.1 },
  { position: 20, ideal: 15, measured: 14.2 },
  { position: 25, ideal: 8, measured: 7.5 },
  { position: 30, ideal: 2, measured: 1.8 },
  { position: 35, ideal: 0, measured: 0.2 },
];

// Wear trend data
const wearTrendData = [
  { chainage: 0, wearDepth: 0.5, headLoss: 0.3, sideLoss: 0.2 },
  { chainage: 5, wearDepth: 0.8, headLoss: 0.5, sideLoss: 0.3 },
  { chainage: 10, wearDepth: 1.2, headLoss: 0.7, sideLoss: 0.5 },
  { chainage: 15, wearDepth: 1.8, headLoss: 1.1, sideLoss: 0.7 },
  { chainage: 20, wearDepth: 2.3, headLoss: 1.4, sideLoss: 0.9 },
  { chainage: 25, wearDepth: 3.1, headLoss: 1.9, sideLoss: 1.2 },
  { chainage: 30, wearDepth: 2.8, headLoss: 1.7, sideLoss: 1.1 },
  { chainage: 35, wearDepth: 2.1, headLoss: 1.3, sideLoss: 0.8 },
];

// Heatmap data for wear severity
const wearHeatmapData = [
  { wearType: 'Head Wear', values: [1, 1, 2, 2, 3, 3, 2, 2] },
  { wearType: 'Side Wear', values: [1, 1, 1, 2, 2, 2, 2, 1] },
  { wearType: 'Corrugation', values: [1, 2, 1, 1, 2, 3, 2, 1] },
  { wearType: 'Rail Breaks', values: [1, 1, 1, 1, 1, 2, 1, 1] },
];

// Component health data
const componentHealth = [
  { name: 'Rail Head', health: 85, status: 'good' },
  { name: 'Rail Foot', health: 92, status: 'excellent' },
  { name: 'Web Thickness', health: 78, status: 'warning' },
  { name: 'Surface Quality', health: 65, status: 'critical' },
];

const getSeverityColor = (value: number) => {
  if (value <= 1) return 'bg-green-500';
  if (value <= 2) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getHealthColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getProgressColor = (health: number) => {
  if (health >= 85) return 'bg-green-500';
  if (health >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

interface RailConditionProps {
  showDetailedView?: boolean;
  trainContext?: any;
}

export function RailCondition({ showDetailedView = false, trainContext }: RailConditionProps) {
  return (
    <div className="space-y-6">
      {/* Status Indicators Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {componentHealth.map((component, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{component.name}</h3>
                <Gauge className={`w-5 h-5 ${getHealthColor(component.status)}`} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{component.health}%</span>
                  <Badge 
                    variant="outline" 
                    className={getHealthColor(component.status)}
                  >
                    {component.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(component.health)}`}
                    style={{ width: `${component.health}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cross-Section Overlay Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Rail Cross-Section Profile
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  JPEG
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={profileData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="position" 
                  label={{ value: 'Position (mm)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  label={{ value: 'Height (mm)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                
                <Area
                  type="monotone"
                  dataKey="ideal"
                  stackId="1"
                  stroke="#64748b"
                  fill="#e2e8f0"
                  fillOpacity={0.6}
                  name="Ideal Profile"
                />
                <Line 
                  type="monotone" 
                  dataKey="measured" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  name="Measured Profile"
                  dot={{ fill: '#f97316', r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Analysis:</strong> Measured profile shows 0.7mm average deviation from ideal. 
                Significant wear detected at rail head center (-2 to +2mm position).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Wear Severity Heatmap */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Wear Type Severity Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wearHeatmapData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <div className="w-24 text-sm font-medium">{row.wearType}</div>
                  <div className="flex gap-1 flex-1">
                    {row.values.map((value, colIndex) => (
                      <div
                        key={colIndex}
                        className={`h-8 flex-1 rounded ${getSeverityColor(value)} opacity-80 flex items-center justify-center text-white text-xs font-bold`}
                        title={`Chainage ${colIndex * 5}km: Level ${value}`}
                      >
                        {value}
                      </div>
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
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Level 1 (Minimal)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs">Level 2 (Moderate)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs">Level 3 (Severe)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wear Trend Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Wear Progression Trends
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                XML
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={wearTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="chainage" 
                label={{ value: 'Chainage (km)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: 'Wear Depth (mm)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              
              <Line 
                type="monotone" 
                dataKey="wearDepth" 
                stroke="#e11d48" 
                strokeWidth={3}
                name="Total Wear Depth"
                dot={{ fill: '#e11d48', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="headLoss" 
                stroke="#f97316" 
                strokeWidth={2}
                name="Head Loss"
                dot={{ fill: '#f97316', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="sideLoss" 
                stroke="#eab308" 
                strokeWidth={2}
                name="Side Loss"
                dot={{ fill: '#eab308', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900">Critical Sections</h4>
              <p className="text-sm text-red-800 mt-1">
                25-30 km: Wear exceeds 3mm threshold
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900">Monitoring Required</h4>
              <p className="text-sm text-yellow-800 mt-1">
                15-25 km: Accelerated wear progression
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Optimal Condition</h4>
              <p className="text-sm text-green-800 mt-1">
                0-15 km: Normal wear patterns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}