import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { TrainData } from './TrainSelector';
import { 
  Thermometer, 
  AlertTriangle, 
  Camera, 
  Eye, 
  BarChart3,
  Clock,
  MapPin,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface ThermalMonitoringProps {
  trainContext: TrainData;
  selectedLocation?: any;
}

// Mock thermal data
const generateThermalData = (chainage: string) => {
  const baseTemp = 25; // Base ambient temperature
  const variation = Math.sin(parseFloat(chainage) * 0.1) * 10;
  
  return {
    wheelTemp: Math.max(15, baseTemp + variation + Math.random() * 20),
    bearingTemp: Math.max(20, baseTemp + variation + Math.random() * 25),
    brakeTemp: Math.max(30, baseTemp + variation + Math.random() * 40),
    axleTemp: Math.max(18, baseTemp + variation + Math.random() * 15),
    motorTemp: Math.max(35, baseTemp + variation + Math.random() * 30),
    transformerTemp: Math.max(40, baseTemp + variation + Math.random() * 35)
  };
};

const hotSpots = [
  { 
    id: 'HS001', 
    location: 'Bogie 1 - Left Bearing', 
    temperature: 85.2, 
    severity: 'Critical',
    chainage: '441.1',
    trend: 'increasing'
  },
  { 
    id: 'HS002', 
    location: 'Bogie 2 - Brake Disc', 
    temperature: 72.8, 
    severity: 'Warning',
    chainage: '441.0',
    trend: 'stable'
  },
  { 
    id: 'HS003', 
    location: 'Motor Housing', 
    temperature: 65.4, 
    severity: 'Normal',
    chainage: '441.2',
    trend: 'decreasing'
  }
];

export function ThermalMonitoring({ trainContext, selectedLocation }: ThermalMonitoringProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [thermalData, setThermalData] = useState(() => 
    generateThermalData(trainContext.currentLocation.chainage)
  );
  const [selectedHotSpot, setSelectedHotSpot] = useState<string | null>(null);

  // Update thermal data based on selected location
  useEffect(() => {
    if (selectedLocation) {
      setThermalData(generateThermalData(selectedLocation.chainage || trainContext.currentLocation.chainage));
    }
  }, [selectedLocation, trainContext.currentLocation.chainage]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setThermalData(prev => ({
        wheelTemp: Math.max(15, prev.wheelTemp + (Math.random() - 0.5) * 2),
        bearingTemp: Math.max(20, prev.bearingTemp + (Math.random() - 0.5) * 3),
        brakeTemp: Math.max(30, prev.brakeTemp + (Math.random() - 0.5) * 5),
        axleTemp: Math.max(18, prev.axleTemp + (Math.random() - 0.5) * 2),
        motorTemp: Math.max(35, prev.motorTemp + (Math.random() - 0.5) * 4),
        transformerTemp: Math.max(40, prev.transformerTemp + (Math.random() - 0.5) * 3)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTemperatureStatus = (temp: number, type: string) => {
    const thresholds = {
      wheel: { warning: 60, critical: 80 },
      bearing: { warning: 70, critical: 90 },
      brake: { warning: 80, critical: 120 },
      axle: { warning: 55, critical: 75 },
      motor: { warning: 75, critical: 100 },
      transformer: { warning: 85, critical: 110 }
    };

    const threshold = thresholds[type as keyof typeof thresholds];
    if (temp >= threshold.critical) return { status: 'Critical', color: 'red' };
    if (temp >= threshold.warning) return { status: 'Warning', color: 'yellow' };
    return { status: 'Normal', color: 'green' };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const TemperatureCard = ({ title, temp, type, icon }: { title: string; temp: number; type: string; icon: React.ReactNode }) => {
    const status = getTemperatureStatus(temp, type);
    
    return (
      <Card className="relative">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-medium text-sm">{title}</span>
            </div>
            <Badge className={`text-xs ${
              status.color === 'red' ? 'bg-red-100 text-red-800' :
              status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {status.status}
            </Badge>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {temp.toFixed(1)}°C
          </div>
          
          <Progress 
            value={(temp / 120) * 100} 
            className="h-2"
          />
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <span>0°C</span>
            <span>120°C</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Thermometer className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Thermal Monitoring</h2>
            <p className="text-gray-600">
              Real-time thermal imaging and temperature analysis for {trainContext.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <Activity className="w-3 h-3 mr-1" />
            LIVE THERMAL
          </Badge>
          {selectedLocation && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <MapPin className="w-3 h-3 mr-1" />
              Chainage: {selectedLocation.chainage} km
            </Badge>
          )}
        </div>
      </div>

      {/* Critical Alerts */}
      {hotSpots.some(h => h.severity === 'Critical') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical thermal anomaly detected!</strong> Immediate inspection required.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="thermogram">Thermogram</TabsTrigger>
          <TabsTrigger value="hotspots">Hot Spots</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Real-time Temperature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TemperatureCard 
              title="Wheel Temperature" 
              temp={thermalData.wheelTemp} 
              type="wheel"
              icon={<Activity className="w-4 h-4 text-blue-500" />}
            />
            <TemperatureCard 
              title="Bearing Temperature" 
              temp={thermalData.bearingTemp} 
              type="bearing"
              icon={<Zap className="w-4 h-4 text-orange-500" />}
            />
            <TemperatureCard 
              title="Brake Temperature" 
              temp={thermalData.brakeTemp} 
              type="brake"
              icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            />
            <TemperatureCard 
              title="Axle Temperature" 
              temp={thermalData.axleTemp} 
              type="axle"
              icon={<BarChart3 className="w-4 h-4 text-green-500" />}
            />
            <TemperatureCard 
              title="Motor Temperature" 
              temp={thermalData.motorTemp} 
              type="motor"
              icon={<Zap className="w-4 h-4 text-purple-500" />}
            />
            <TemperatureCard 
              title="Transformer Temperature" 
              temp={thermalData.transformerTemp} 
              type="transformer"
              icon={<Activity className="w-4 h-4 text-indigo-500" />}
            />
          </div>

          {/* Temperature Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Temperature Trends (Last 24 Hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Temperature trend visualization</p>
                  <p className="text-sm">Real-time thermal data plotting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thermogram" className="space-y-6">
          {/* Thermal Camera Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-red-600" />
                Live Thermal Imaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Thermal Image */}
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="absolute top-4 left-4 text-white">
                      <div className="text-xs font-mono bg-black bg-opacity-50 px-2 py-1 rounded">
                        THERMAL CAM 1 - LIVE
                      </div>
                    </div>
                    
                    {/* Simulated hot spots */}
                    <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-red-500 rounded-full opacity-80 animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-70"></div>
                    
                    {/* Temperature overlay */}
                    <div className="absolute bottom-4 left-4 text-white text-sm font-mono">
                      <div>Max: 85.2°C</div>
                      <div>Min: 18.4°C</div>
                      <div>Avg: 42.1°C</div>
                    </div>
                  </div>
                  
                  {/* Temperature Scale */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Temperature Scale:</span>
                    <div className="flex-1 h-4 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
                    <div className="text-xs text-gray-600 flex justify-between w-32">
                      <span>-10°C</span>
                      <span>100°C</span>
                    </div>
                  </div>
                </div>

                {/* Side Thermal Images */}
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-blue-800 via-green-700 to-yellow-600 rounded-lg relative">
                    <div className="absolute top-2 left-2 text-white text-xs font-mono bg-black bg-opacity-50 px-1 py-0.5 rounded">
                      SIDE VIEW
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-gradient-to-br from-purple-800 via-blue-700 to-green-600 rounded-lg relative">
                    <div className="absolute top-2 left-2 text-white text-xs font-mono bg-black bg-opacity-50 px-1 py-0.5 rounded">
                      UNDERCARRIAGE
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotspots" className="space-y-6">
          {/* Hot Spots List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Detected Hot Spots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hotSpots.map((hotSpot) => (
                    <div 
                      key={hotSpot.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedHotSpot === hotSpot.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedHotSpot(hotSpot.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(hotSpot.severity)}>
                            {hotSpot.severity}
                          </Badge>
                          {getTrendIcon(hotSpot.trend)}
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {hotSpot.temperature}°C
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{hotSpot.location}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Chainage: {hotSpot.chainage} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Live
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hot Spot Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Hot Spot Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedHotSpot ? (
                  <div className="space-y-4">
                    {(() => {
                      const hotSpot = hotSpots.find(h => h.id === selectedHotSpot)!;
                      return (
                        <>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">
                              {hotSpot.temperature}°C
                            </div>
                            <div className="text-gray-600">{hotSpot.location}</div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Severity:</span>
                              <Badge className={getSeverityColor(hotSpot.severity)}>
                                {hotSpot.severity}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Trend:</span>
                              <div className="flex items-center gap-1">
                                {getTrendIcon(hotSpot.trend)}
                                <span className="capitalize">{hotSpot.trend}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span>{hotSpot.chainage} km</span>
                            </div>
                          </div>
                          
                          {/* Thermal Image Detail */}
                          <div className="aspect-square bg-gradient-to-br from-yellow-400 via-red-500 to-red-700 rounded-lg relative">
                            <div className="absolute inset-4 border-2 border-white rounded-full animate-pulse"></div>
                            <div className="absolute bottom-2 left-2 text-white text-xs font-mono bg-black bg-opacity-50 px-1 py-0.5 rounded">
                              DETAIL VIEW
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a hot spot to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Thermal Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Thermal Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Health Score */}
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">72%</div>
                  <div className="text-sm text-gray-600">Thermal Health Score</div>
                  <Progress value={72} className="h-2" />
                </div>
                
                {/* Critical Components */}
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-gray-600">Critical Components</div>
                  <div className="text-xs text-red-600">Requires immediate attention</div>
                </div>
                
                {/* Average Temperature */}
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">42.1°C</div>
                  <div className="text-sm text-gray-600">Average Temperature</div>
                  <div className="text-xs text-gray-500">Within normal range</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Maintenance Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-900">Immediate Action Required</div>
                    <div className="text-sm text-red-700">Bogie 1 left bearing shows critical temperature. Stop train for inspection.</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-900">Scheduled Maintenance</div>
                    <div className="text-sm text-yellow-700">Brake disc temperatures elevated. Schedule brake inspection within 48 hours.</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Monitor</div>
                    <div className="text-sm text-blue-700">Motor temperature trending upward. Continue monitoring for next 6 hours.</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}