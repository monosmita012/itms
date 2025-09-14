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
  Minus,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ThermalMonitoringProps {
  trainContext: TrainData;
  selectedLocation?: any;
}

// Mock thermal dataset with location coordinates mapped to thermal images and defect status
const thermalLocationDataset = [
  {
    chainage: '441.0',
    lat: 26.4497,
    lng: 80.3317,
    thermalImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=600&fit=crop',
    hasDefect: false,
    defectType: null,
    maxTemp: 42.3,
    minTemp: 18.7,
    avgTemp: 28.5
  },
  {
    chainage: '441.1',
    lat: 26.4498,
    lng: 80.3318,
    thermalImage: 'https://images.unsplash.com/photo-1544827763-2b69d33e73b4?w=800&h=600&fit=crop',
    hasDefect: true,
    defectType: 'Rail Crack',
    maxTemp: 85.2,
    minTemp: 22.1,
    avgTemp: 45.8
  },
  {
    chainage: '441.2',
    lat: 26.4499,
    lng: 80.3319,
    thermalImage: 'https://images.unsplash.com/photo-1569319624402-4a1d8ba40a59?w=800&h=600&fit=crop',
    hasDefect: false,
    defectType: null,
    maxTemp: 38.9,
    minTemp: 19.3,
    avgTemp: 26.7
  },
  {
    chainage: '441.3',
    lat: 26.4500,
    lng: 80.3320,
    thermalImage: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop',
    hasDefect: true,
    defectType: 'Ballast Settlement',
    maxTemp: 72.4,
    minTemp: 20.8,
    avgTemp: 38.2
  },
  {
    chainage: '441.4',
    lat: 26.4501,
    lng: 80.3321,
    thermalImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=600&fit=crop',
    hasDefect: false,
    defectType: null,
    maxTemp: 35.6,
    minTemp: 17.9,
    avgTemp: 24.1
  }
];

// Function to find thermal data for a specific location
const getThermalDataForLocation = (chainage: string, lat?: number, lng?: number) => {
  // First try to find exact chainage match
  let thermalData = thermalLocationDataset.find(data => data.chainage === chainage);
  
  // If not found, find closest match based on coordinates
  if (!thermalData && lat && lng) {
    thermalData = thermalLocationDataset.reduce((closest, current) => {
      const closestDistance = Math.sqrt(
        Math.pow(closest.lat - lat, 2) + Math.pow(closest.lng - lng, 2)
      );
      const currentDistance = Math.sqrt(
        Math.pow(current.lat - lat, 2) + Math.pow(current.lng - lng, 2)
      );
      return currentDistance < closestDistance ? current : closest;
    });
  }
  
  // If still not found, return default data
  if (!thermalData) {
    return {
      chainage: chainage,
      lat: lat || 0,
      lng: lng || 0,
      thermalImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=600&fit=crop',
      hasDefect: Math.random() > 0.7,
      defectType: Math.random() > 0.7 ? 'Unknown Defect' : null,
      maxTemp: 25 + Math.random() * 30,
      minTemp: 15 + Math.random() * 10,
      avgTemp: 20 + Math.random() * 20
    };
  }
  
  return thermalData;
};

// Mock thermal data for temperature readings
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
  const [compareMode, setCompareMode] = useState<'toggle' | 'side-by-side'>('toggle');
  const [showProcessed, setShowProcessed] = useState(true);
  const [currentThermalImage, setCurrentThermalImage] = useState<any>(null);

  // Update thermal data based on selected location
  useEffect(() => {
    if (selectedLocation) {
      setThermalData(generateThermalData(selectedLocation.chainage || trainContext.currentLocation.chainage));
    }
  }, [selectedLocation, trainContext.currentLocation.chainage]);

  // Update thermal image based on selected location
  useEffect(() => {
    const location = selectedLocation || trainContext.currentLocation;
    const thermalImageData = getThermalDataForLocation(
      location.chainage, 
      location.lat, 
      location.lng
    );
    setCurrentThermalImage(thermalImageData);
  }, [selectedLocation, trainContext.currentLocation]);

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="thermal-camera">Thermal Camera</TabsTrigger>
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

          {/* Thermal Map with Abnormality Detection */}
          <Card className="backdrop-blur bg-white/60 border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Thermal Map - Track Abnormality Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Critical Hot Spots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Medium Anomalies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm font-medium">Minor Variations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Normal Range</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Last Updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Thermal Map Visualization */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg overflow-hidden relative">
                    {/* Track representation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-2 bg-gray-600 rounded-full relative">
                        {/* Track segments with different thermal states */}
                        <div className="absolute left-0 top-0 w-1/4 h-full bg-green-500 rounded-l-full"></div>
                        <div className="absolute left-1/4 top-0 w-1/4 h-full bg-yellow-400"></div>
                        <div className="absolute left-1/2 top-0 w-1/4 h-full bg-orange-500"></div>
                        <div className="absolute right-0 top-0 w-1/4 h-full bg-red-500 rounded-r-full"></div>
                      </div>
                    </div>

                    {/* Abnormality markers */}
                    <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 -translate-x-1/2">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Minor: 45°C
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Medium: 65°C
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 translate-x-1/2">
                      <div className="w-10 h-10 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Critical: 85°C
                      </div>
                    </div>

                    {/* Train position indicator */}
                    <div className="absolute top-1/2 left-1/6 transform -translate-y-1/2 -translate-x-1/2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Train
                      </div>
                    </div>

                    {/* Temperature scale overlay */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                      <div className="text-xs font-mono">
                        <div>Scale: 0°C - 100°C</div>
                        <div className="mt-1 w-16 h-2 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
                      </div>
                    </div>

                    {/* Chainage markers */}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                      Chainage: {currentThermalImage?.chainage || trainContext.currentLocation.chainage} km
                    </div>
                  </div>
                </div>

                {/* Abnormality Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">1</div>
                      <div className="text-sm text-gray-600">Critical Hot Spots</div>
                      <div className="text-xs text-red-600 mt-1">Immediate attention required</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">1</div>
                      <div className="text-sm text-gray-600">Medium Anomalies</div>
                      <div className="text-xs text-orange-600 mt-1">Monitor closely</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">1</div>
                      <div className="text-sm text-gray-600">Minor Variations</div>
                      <div className="text-xs text-yellow-600 mt-1">Within acceptable range</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Trends Chart */}
          <Card className="backdrop-blur bg-white/60 border-2 border-green-200">
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

        <TabsContent value="thermal-camera" className="space-y-6">
          {/* Thermal Camera Display */}
          <Card className="backdrop-blur bg-white/60 border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-600" />
                Live Thermal Camera Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentThermalImage ? (
                <div className="space-y-6">
                  {/* Location Info */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Chainage: {currentThermalImage.chainage} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          GPS: {currentThermalImage.lat.toFixed(6)}, {currentThermalImage.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Dual Image Display */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Raw Visual Image */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Raw Visual Image</h3>
                      </div>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative border-2 border-blue-200">
                        <img 
                          src="https://images.unsplash.com/photo-1544827763-2b69d33e73b4?w=800&h=600&fit=crop"
                          alt="Raw visual image of railway track and train"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Camera info overlay */}
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                          VISUAL CAM - LIVE
                        </div>
                        
                        {/* Track identification overlay */}
                        <div className="absolute bottom-4 left-4 bg-blue-600/90 text-white px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span className="font-bold">RAW VISUAL</span>
                          </div>
                          <div className="text-sm mt-1">
                            Track & Train Detection
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thermographic Image */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Thermographic Image</h3>
                      </div>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative border-2 border-red-200">
                        <img 
                          src={currentThermalImage.thermalImage}
                          alt={`Thermographic heatmap at chainage ${currentThermalImage.chainage} km`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Thermal overlay effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-red-900/20"></div>
                        
                        {/* Temperature readings overlay */}
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                          <div className="text-xs font-mono">
                            <div>Max: {currentThermalImage.maxTemp.toFixed(1)}°C</div>
                            <div>Min: {currentThermalImage.minTemp.toFixed(1)}°C</div>
                            <div>Avg: {currentThermalImage.avgTemp.toFixed(1)}°C</div>
                          </div>
                        </div>
                        
                        {/* Camera info overlay */}
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                          THERMAL CAM - LIVE
                        </div>
                        
                        {/* Defect detection overlay */}
                        {currentThermalImage.hasDefect && (
                          <div className="absolute bottom-4 left-4 bg-red-600/90 text-white px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-bold">DEFECT DETECTED!</span>
                            </div>
                            <div className="text-sm mt-1">
                              Type: {currentThermalImage.defectType}
                            </div>
                          </div>
                        )}
                        
                        {/* Track OK overlay */}
                        {!currentThermalImage.hasDefect && (
                          <div className="absolute bottom-4 left-4 bg-green-600/90 text-white px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-bold">TRACK OK</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Temperature Scale */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 font-medium">Temperature Scale:</span>
                    <div className="flex-1 h-6 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-lg relative">
                      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-white font-bold">
                        <span>0°C</span>
                        <span>50°C</span>
                        <span>100°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Defect Status Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className={`${currentThermalImage.hasDefect ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-bold ${currentThermalImage.hasDefect ? 'text-red-600' : 'text-green-600'}`}>
                          {currentThermalImage.hasDefect ? 'DEFECT' : 'NORMAL'}
                        </div>
                        <div className="text-sm text-gray-600">Track Status</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {currentThermalImage.maxTemp.toFixed(1)}°C
                        </div>
                        <div className="text-sm text-gray-600">Max Temperature</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200 bg-purple-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {currentThermalImage.avgTemp.toFixed(1)}°C
                        </div>
                        <div className="text-sm text-gray-600">Average Temperature</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Thermal Camera</h3>
                  <p className="text-gray-600">Initializing thermal imaging system...</p>
                </div>
              )}
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
              {/* Compare Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Compare mode:</span>
                  <div className="flex border rounded-md overflow-hidden">
                    <button 
                      className={`px-3 py-1 ${compareMode === 'toggle' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => setCompareMode('toggle')}
                    >Toggle</button>
                    <button 
                      className={`px-3 py-1 ${compareMode === 'side-by-side' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => setCompareMode('side-by-side')}
                    >Side-by-side</button>
                  </div>
                </div>
                {compareMode === 'toggle' && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">View:</span>
                    <div className="flex border rounded-md overflow-hidden">
                      <button 
                        className={`px-3 py-1 ${!showProcessed ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                        onClick={() => setShowProcessed(false)}
                      >Raw</button>
                      <button 
                        className={`px-3 py-1 ${showProcessed ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                        onClick={() => setShowProcessed(true)}
                      >Processed</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Views */}
              {compareMode === 'side-by-side' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Raw */}
                  <div className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 rounded-lg relative overflow-hidden">
                      <div className="absolute top-4 left-4 text-white">
                        <div className="text-xs font-mono bg-black bg-opacity-50 px-2 py-1 rounded">RAW • THERMAL</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Temperature Scale:</span>
                      <div className="flex-1 h-4 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
                      <div className="text-xs text-gray-600 flex justify-between w-32">
                        <span>-10°C</span>
                        <span>100°C</span>
                      </div>
                    </div>
                  </div>
                  {/* Processed */}
                  <div className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      {/* Simulated hot spots & overlays */}
                      <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-red-500 rounded-full opacity-80 animate-pulse"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-70"></div>
                      <div className="absolute bottom-4 left-4 text-white text-sm font-mono">
                        <div>Max: 85.2°C</div>
                        <div>Min: 18.4°C</div>
                        <div>Avg: 42.1°C</div>
                      </div>
                      <div className="absolute top-4 left-4 text-white">
                        <div className="text-xs font-mono bg-black bg-opacity-50 px-2 py-1 rounded">PROCESSED • THERMOGRAM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Temperature Scale:</span>
                      <div className="flex-1 h-4 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
                      <div className="text-xs text-gray-600 flex justify-between w-32">
                        <span>-10°C</span>
                        <span>100°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 rounded-lg relative overflow-hidden">
                      {showProcessed && <div className="absolute inset-0 bg-black bg-opacity-30"></div>}
                      {showProcessed && (
                        <>
                          <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-red-500 rounded-full opacity-80 animate-pulse"></div>
                          <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-70"></div>
                          <div className="absolute bottom-4 left-4 text-white text-sm font-mono">
                            <div>Max: 85.2°C</div>
                            <div>Min: 18.4°C</div>
                            <div>Avg: 42.1°C</div>
                          </div>
                        </>
                      )}
                      <div className="absolute top-4 left-4 text-white">
                        <div className="text-xs font-mono bg-black bg-opacity-50 px-2 py-1 rounded">{showProcessed ? 'PROCESSED • THERMOGRAM' : 'RAW • THERMAL'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Temperature Scale:</span>
                      <div className="flex-1 h-4 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
                      <div className="text-xs text-gray-600 flex justify-between w-32">
                        <span>-10°C</span>
                        <span>100°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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