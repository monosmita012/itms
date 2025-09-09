import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, AlertTriangle, Clock } from 'lucide-react';

// Initial data for acceleration
const initialData = [
  { time: 0, vertical: 0.8, lateral: 0.6 },
  { time: 1, vertical: 1.2, lateral: 0.9 },
  { time: 2, vertical: 0.9, lateral: 1.1 },
  { time: 3, vertical: 1.5, lateral: 0.7 },
  { time: 4, vertical: 1.1, lateral: 1.3 },
  { time: 5, vertical: 2.1, lateral: 1.8 },
  { time: 6, vertical: 1.3, lateral: 1.0 },
  { time: 7, vertical: 0.9, lateral: 0.8 },
  { time: 8, vertical: 1.7, lateral: 1.5 },
  { time: 9, vertical: 1.0, lateral: 0.9 },
];

// Spike alerts data
const spikeAlerts = [
  {
    id: 1,
    timestamp: '14:23:45',
    location: '127.3 km',
    type: 'Vertical Acceleration',
    value: '3.2 m/s²',
    severity: 'critical',
    status: 'active'
  },
  {
    id: 2,
    timestamp: '14:18:22',
    location: '125.8 km',
    type: 'Lateral Acceleration',
    value: '2.8 m/s²',
    severity: 'warning',
    status: 'resolved'
  },
  {
    id: 3,
    timestamp: '14:15:10',
    location: '124.5 km',
    type: 'Vertical Acceleration',
    value: '2.1 m/s²',
    severity: 'warning',
    status: 'active'
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

interface DynamicParametersProps {
  showDetailedView?: boolean;
  trainContext?: any;
}

export function DynamicParameters({ showDetailedView = false, trainContext }: DynamicParametersProps) {
  const [data, setData] = useState(initialData);
  const [currentTime, setCurrentTime] = useState(10);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
      setData(prevData => {
        const newData = [...prevData];
        
        // Remove oldest point and add new point
        newData.shift();
        newData.push({
          time: currentTime,
          vertical: Math.random() * 3 + 0.5,
          lateral: Math.random() * 2.5 + 0.3,
        });
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentTime]);

  return (
    <div className="space-y-6">
      {/* Real-time Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Vertical</p>
                <p className="text-2xl font-bold">{data[data.length - 1]?.vertical?.toFixed(2) || '0.00'} m/s²</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Lateral</p>
                <p className="text-2xl font-bold">{data[data.length - 1]?.lateral?.toFixed(2) || '0.00'} m/s²</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold">{spikeAlerts.filter(alert => alert.status === 'active').length}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Real-Time Dynamic Parameters
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
                LIVE
              </Badge>
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
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: 'Acceleration (m/s²)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              
              {/* Safety zone bands */}
              <ReferenceLine y={2.0} stroke="#f59e0b" strokeDasharray="5 5" label="Warning Threshold" />
              <ReferenceLine y={3.0} stroke="#ef4444" strokeDasharray="5 5" label="Critical Threshold" />
              
              <Line 
                type="monotone" 
                dataKey="vertical" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Vertical Acceleration"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="lateral" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                name="Lateral Acceleration"
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Safety zones legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border-2 border-green-500"></div>
              <span>Safe Zone (&lt;2.0 m/s²)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-500"></div>
              <span>Warning Zone (2.0-3.0 m/s²)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border-2 border-red-500"></div>
              <span>Critical Zone (&gt;3.0 m/s²)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spike Alerts Panel */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Spike Alerts & Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {spikeAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-l-orange-500"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-mono">{alert.timestamp}</span>
                  </div>
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-gray-600">Location: {alert.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold">{alert.value}</p>
                    <Badge 
                      variant="outline" 
                      className={getSeverityColor(alert.severity)}
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <Badge 
                    variant={alert.status === 'active' ? 'destructive' : 'secondary'}
                    className={alert.status === 'active' ? 'animate-pulse' : ''}
                  >
                    {alert.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">System Analysis</h4>
            <p className="text-sm text-blue-800">
              Recent spike activity indicates potential track irregularities around kilometer 127. 
              Recommend speed reduction and detailed inspection of the affected section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}