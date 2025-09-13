import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { TrainData } from './TrainSelector';
import { 
  Radar, 
  AlertTriangle, 
  Layers, 
  Eye, 
  BarChart3,
  MapPin,
  Activity,
  Waves,
  Mountain,
  Construction,
  Zap
} from 'lucide-react';

interface SubsurfaceMonitoringProps {
  trainContext: TrainData;
  selectedLocation?: any;
}

// Mock GPR data structure
const generateGPRData = (chainage: string) => {
  const baseDepth = parseFloat(chainage) % 10;
  return {
    ballastThickness: 0.3 + baseDepth * 0.05,
    subgradeCondition: Math.random() > 0.7 ? 'Poor' : Math.random() > 0.4 ? 'Fair' : 'Good',
    moistureContent: 15 + Math.random() * 20,
    voidRatio: 0.4 + Math.random() * 0.3,
    densityVariation: Math.random() * 10,
    foundationStability: Math.random() > 0.8 ? 'Unstable' : 'Stable'
  };
};

const subsurfaceAlerts = [
  {
    id: 'SUB001',
    chainage: '441.1',
    type: 'Ballast Degradation',
    severity: 'Warning',
    depth: '0.2-0.4m',
    description: 'Reduced ballast density detected'
  },
  {
    id: 'SUB002',
    chainage: '441.3',
    type: 'Subgrade Settlement',
    severity: 'Critical',
    depth: '0.5-0.8m',
    description: 'Potential foundation settlement'
  },
  {
    id: 'SUB003',
    chainage: '441.0',
    type: 'Moisture Intrusion',
    severity: 'Warning',
    depth: '0.3-0.6m',
    description: 'Elevated moisture levels in ballast'
  }
];

const layerDefinitions = [
  { name: 'Rail & Fastening', depth: '0.0-0.1m', color: 'bg-gray-800', description: 'Steel rail and fastening system' },
  { name: 'Sleeper/Tie', depth: '0.1-0.25m', color: 'bg-amber-700', description: 'Concrete or wooden sleepers' },
  { name: 'Ballast Layer', depth: '0.25-0.55m', color: 'bg-stone-400', description: 'Crushed stone ballast' },
  { name: 'Sub-ballast', depth: '0.55-0.8m', color: 'bg-slate-500', description: 'Filter and transition layer' },
  { name: 'Subgrade', depth: '0.8m+', color: 'bg-emerald-700', description: 'Natural soil foundation' }
];

export function SubsurfaceMonitoring({ trainContext, selectedLocation }: SubsurfaceMonitoringProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [gprData, setGprData] = useState(() => 
    generateGPRData(trainContext.currentLocation.chainage)
  );
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [scanDepth, setScanDepth] = useState(2.0); // meters

  // Update GPR data based on selected location
  useEffect(() => {
    if (selectedLocation) {
      setGprData(generateGPRData(selectedLocation.chainage || trainContext.currentLocation.chainage));
    }
  }, [selectedLocation, trainContext.currentLocation.chainage]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Poor': return 'text-red-600';
      case 'Fair': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const RadargramVisualization = () => (
    <div className="space-y-4">
      {/* Radargram Display */}
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {/* GPR Signal Visualization */}
        <div className="absolute inset-0">
          {/* Simulate radar signal patterns */}
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-b from-yellow-400 via-green-500 to-blue-600 opacity-70"
              style={{
                left: `${i * 2}%`,
                top: `${Math.sin(i * 0.5) * 20 + 30}%`,
                width: '2%',
                height: `${30 + Math.sin(i * 0.3) * 15}%`
              }}
            />
          ))}
          
          {/* Layer boundaries */}
          {[25, 35, 60, 80].map((depth, index) => (
            <div
              key={index}
              className="absolute w-full border-t border-white border-dashed opacity-60"
              style={{ top: `${depth}%` }}
            />
          ))}
        </div>
        
        {/* Depth Scale */}
        <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-white text-xs font-mono py-4">
          <span>0.0m</span>
          <span>0.5m</span>
          <span>1.0m</span>
          <span>1.5m</span>
          <span>2.0m</span>
        </div>
        
        {/* Distance Scale */}
        <div className="absolute bottom-2 left-8 right-2 flex justify-between text-white text-xs font-mono">
          <span>0m</span>
          <span>25m</span>
          <span>50m</span>
          <span>75m</span>
          <span>100m</span>
        </div>
        
        {/* Anomaly Markers */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 border-2 border-red-500 bg-red-500 bg-opacity-50 rounded animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-4 h-4 border-2 border-yellow-500 bg-yellow-500 bg-opacity-50 rounded"></div>
      </div>
      
      {/* Signal Intensity Legend */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Signal Intensity:</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-xs">Weak</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-xs">Strong</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-xs">Anomaly</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radar className="w-8 h-8 text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Subsurface Monitoring (GPR)</h2>
            <p className="text-gray-600">
              Ground Penetrating Radar analysis for {trainContext.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Waves className="w-3 h-3 mr-1" />
            GPR ACTIVE
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
      {subsurfaceAlerts.some(a => a.severity === 'Critical') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical subsurface anomaly detected!</strong> Foundation stability may be compromised.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="radargram">Radargram</TabsTrigger>
          <TabsTrigger value="layers">Layer Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Anomalies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  <Badge variant="outline">Structural</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {gprData.ballastThickness.toFixed(2)}m
                </div>
                <div className="text-sm text-gray-600">Ballast Thickness</div>
                <Progress value={(gprData.ballastThickness / 0.6) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Mountain className="w-5 h-5 text-green-500" />
                  <Badge className={`text-xs ${getConditionColor(gprData.subgradeCondition) === 'text-green-600' ? 'bg-green-100 text-green-800' : 
                    getConditionColor(gprData.subgradeCondition) === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {gprData.subgradeCondition}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {gprData.foundationStability}
                </div>
                <div className="text-sm text-gray-600">Foundation Status</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <Badge variant="outline">Moisture</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {gprData.moistureContent.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Moisture Content</div>
                <Progress value={(gprData.moistureContent / 40) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Cross-Section Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Track Cross-Section Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-sky-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                {/* Track Structure Layers */}
                {layerDefinitions.map((layer, index) => (
                  <div
                    key={index}
                    className={`absolute left-0 right-0 ${layer.color} border-t border-gray-300`}
                    style={{
                      top: `${index * 15}%`,
                      height: '15%'
                    }}
                  >
                    <div className="p-2 text-white text-sm font-medium">
                      {layer.name}
                    </div>
                  </div>
                ))}
                
                {/* Anomaly Indicators */}
                <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-red-500 rounded-full opacity-70 animate-pulse flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                
                <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-yellow-500 rounded-full opacity-70 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              
              {/* Layer Legend */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {layerDefinitions.map((layer, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 ${layer.color} rounded`}></div>
                    <div>
                      <span className="font-medium">{layer.name}</span>
                      <span className="text-gray-500 ml-1">({layer.depth})</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radargram" className="space-y-6">
          {/* GPR Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-purple-600" />
                GPR Radargram Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Scan Depth:</label>
                  <select 
                    value={scanDepth} 
                    onChange={(e) => setScanDepth(Number(e.target.value))}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value={1.0}>1.0m</option>
                    <option value={2.0}>2.0m</option>
                    <option value={3.0}>3.0m</option>
                  </select>
                </div>
                
                <Button size="sm" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Real-time Scan
                </Button>
              </div>
              
              <RadargramVisualization />
            </CardContent>
          </Card>

          {/* Signal Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-green-600" />
                Signal Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2.1 GHz</div>
                  <div className="text-sm text-gray-600">Antenna Frequency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600">Signal Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12 ns</div>
                  <div className="text-sm text-gray-600">Time Window</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layers" className="space-y-6">
          {/* Detailed Layer Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {layerDefinitions.map((layer, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-6 h-6 ${layer.color} rounded`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{layer.name}</div>
                      <div className="text-sm text-gray-600">{layer.depth}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{layer.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Condition:</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.random() > 0.7 ? 'Poor' : Math.random() > 0.4 ? 'Fair' : 'Good'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Density:</span>
                      <span>{(Math.random() * 30 + 70).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Moisture:</span>
                      <span>{(Math.random() * 25 + 5).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Subsurface Anomalies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Detected Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subsurfaceAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAlert === alert.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedAlert(alert.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <div className="text-sm text-gray-600">{alert.depth}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{alert.type}</div>
                        <div className="text-sm text-gray-600">{alert.description}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>Chainage: {alert.chainage} km</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Anomaly Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Anomaly Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAlert ? (
                  <div className="space-y-4">
                    {(() => {
                      const alert = subsurfaceAlerts.find(a => a.id === selectedAlert)!;
                      return (
                        <>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900 mb-2">
                              {alert.type}
                            </div>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span>{alert.chainage} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Depth Range:</span>
                              <span>{alert.depth}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Alert ID:</span>
                              <span className="font-mono text-sm">{alert.id}</span>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-900 mb-1">Description:</div>
                            <div className="text-sm text-gray-600">{alert.description}</div>
                          </div>
                          
                          {/* GPR Signal at Alert Location */}
                          <div className="aspect-video bg-gradient-to-br from-red-200 via-yellow-200 to-green-200 rounded-lg relative">
                            <div className="absolute inset-4 border-2 border-red-500 rounded animate-pulse"></div>
                            <div className="absolute bottom-2 left-2 text-red-800 text-xs font-mono bg-white bg-opacity-75 px-1 py-0.5 rounded">
                              ANOMALY DETAIL
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select an anomaly to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}