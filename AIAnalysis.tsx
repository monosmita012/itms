import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { TrainData } from './TrainSelector';
import { 
  Brain, 
  AlertTriangle, 
  Cpu, 
  Eye, 
  BarChart3,
  MapPin,
  Activity,
  Zap,
  Target,
  Camera,
  Scan,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AIAnalysisProps {
  trainContext: TrainData;
  selectedLocation?: any;
}

// Mock AI detection data
const generateAIDetections = (chainage: string) => {
  const detections = [
    {
      id: 'AI001',
      type: 'Rail Surface Crack',
      confidence: 0.94,
      severity: 'Critical',
      boundingBox: { x: 45, y: 30, width: 20, height: 15 },
      description: 'Longitudinal crack detected on rail head',
      aiModel: 'YOLOv8-Rail',
      processing_time: '23ms'
    },
    {
      id: 'AI002',
      type: 'Missing Fastener',
      confidence: 0.87,
      severity: 'Warning',
      boundingBox: { x: 60, y: 45, width: 12, height: 8 },
      description: 'Rail fastener appears to be missing or damaged',
      aiModel: 'FastRCNN-Components',
      processing_time: '31ms'
    },
    {
      id: 'AI003',
      type: 'Ballast Irregularity',
      confidence: 0.76,
      severity: 'Normal',
      boundingBox: { x: 25, y: 65, width: 30, height: 20 },
      description: 'Irregular ballast distribution pattern',
      aiModel: 'SegNet-Track',
      processing_time: '45ms'
    }
  ];

  return detections.map(d => ({
    ...d,
    chainage: chainage,
    timestamp: new Date().toISOString()
  }));
};

const aiModels = [
  {
    name: 'YOLOv8-Rail',
    purpose: 'Rail Surface Defects',
    status: 'Active',
    accuracy: 94.2,
    lastUpdate: '2024-01-15',
    processingSpeed: '23ms/frame'
  },
  {
    name: 'FastRCNN-Components',
    purpose: 'Track Components',
    status: 'Active',
    accuracy: 89.7,
    lastUpdate: '2024-01-12',
    processingSpeed: '31ms/frame'
  },
  {
    name: 'SegNet-Track',
    purpose: 'Track Geometry',
    status: 'Active',
    accuracy: 91.5,
    lastUpdate: '2024-01-18',
    processingSpeed: '45ms/frame'
  },
  {
    name: 'DeepTrack-Thermal',
    purpose: 'Thermal Anomalies',
    status: 'Training',
    accuracy: 87.3,
    lastUpdate: '2024-01-20',
    processingSpeed: '67ms/frame'
  }
];

export function AIAnalysis({ trainContext, selectedLocation }: AIAnalysisProps) {
  const [activeTab, setActiveTab] = useState('detections');
  const [detections, setDetections] = useState(() => 
    generateAIDetections(trainContext.currentLocation.chainage)
  );
  const [selectedDetection, setSelectedDetection] = useState<string | null>(null);
  const [processingStats, setProcessingStats] = useState({
    framesProcessed: 0,
    detectionsCount: 0,
    averageConfidence: 0
  });

  // Update detections based on selected location
  useEffect(() => {
    if (selectedLocation) {
      setDetections(generateAIDetections(selectedLocation.chainage || trainContext.currentLocation.chainage));
    }
  }, [selectedLocation, trainContext.currentLocation.chainage]);

  // Simulate real-time processing stats
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStats(prev => ({
        framesProcessed: prev.framesProcessed + Math.floor(Math.random() * 5) + 1,
        detectionsCount: prev.detectionsCount + Math.floor(Math.random() * 3),
        averageConfidence: Math.random() * 0.2 + 0.8
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Training': return 'bg-blue-100 text-blue-800';
      case 'Updating': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DetectionVisualization = ({ detection }: { detection: any }) => (
    <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
      {/* Simulated camera feed */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="absolute border-gray-400" 
               style={{ 
                 left: `${i * 10}%`, 
                 top: 0, 
                 width: '1px', 
                 height: '100%',
                 borderLeft: '1px solid currentColor'
               }} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="absolute border-gray-400 w-full" 
               style={{ 
                 top: `${i * 16.67}%`, 
                 height: '1px',
                 borderTop: '1px solid currentColor'
               }} />
        ))}
      </div>
      
      {/* Detection bounding box */}
      <div 
        className="absolute border-2 border-red-500 bg-red-500 bg-opacity-10"
        style={{
          left: `${detection.boundingBox.x}%`,
          top: `${detection.boundingBox.y}%`,
          width: `${detection.boundingBox.width}%`,
          height: `${detection.boundingBox.height}%`
        }}
      >
        {/* Detection label */}
        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {detection.type} ({(detection.confidence * 100).toFixed(1)}%)
        </div>
      </div>
      
      {/* Camera info overlay */}
      <div className="absolute top-2 left-2 text-white text-xs font-mono bg-black bg-opacity-50 px-2 py-1 rounded">
        CAM 1 - AI ANALYSIS - LIVE
      </div>
      
      <div className="absolute bottom-2 right-2 text-white text-xs font-mono bg-black bg-opacity-50 px-2 py-1 rounded">
        {detection.aiModel} | {detection.processing_time}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Analysis (NVIDIA Jetson)</h2>
            <p className="text-gray-600">
              Real-time AI-powered defect detection for {trainContext.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Cpu className="w-3 h-3 mr-1" />
            AI PROCESSING
          </Badge>
          {selectedLocation && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <MapPin className="w-3 h-3 mr-1" />
              Chainage: {selectedLocation.chainage} km
            </Badge>
          )}
        </div>
      </div>

      {/* Real-time Processing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {processingStats.framesProcessed}
            </div>
            <div className="text-sm text-gray-600">Frames Processed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {detections.length}
            </div>
            <div className="text-sm text-gray-600">Active Detections</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {(processingStats.averageConfidence * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Confidence</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              28ms
            </div>
            <div className="text-sm text-gray-600">Processing Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {detections.some(d => d.severity === 'Critical') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical defect detected by AI!</strong> High confidence detection requires immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="detections">Detections</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="detections" className="space-y-6">
          {/* Live Detections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-600" />
                  Live Detections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detections.map((detection) => (
                    <div 
                      key={detection.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDetection === detection.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDetection(detection.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getSeverityColor(detection.severity)}>
                          {detection.severity}
                        </Badge>
                        <div className={`text-sm font-mono ${getConfidenceColor(detection.confidence)}`}>
                          {(detection.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{detection.type}</div>
                        <div className="text-sm text-gray-600">{detection.description}</div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {detection.chainage} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            {detection.aiModel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detection Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Detection Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDetection ? (
                  <div className="space-y-4">
                    {(() => {
                      const detection = detections.find(d => d.id === selectedDetection)!;
                      return (
                        <>
                          <DetectionVisualization detection={detection} />
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Detection ID:</span>
                              <span className="font-mono text-sm">{detection.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Confidence:</span>
                              <span className={`font-bold ${getConfidenceColor(detection.confidence)}`}>
                                {(detection.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">AI Model:</span>
                              <span className="text-sm">{detection.aiModel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Processing Time:</span>
                              <span className="text-sm">{detection.processing_time}</span>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-900 mb-1">Analysis:</div>
                            <div className="text-sm text-gray-600">{detection.description}</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a detection to view analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          {/* AI Models Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiModels.map((model, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <div className="font-medium text-gray-900">{model.name}</div>
                    </div>
                    <Badge className={getModelStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Purpose:</span>
                      <span>{model.purpose}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Accuracy:</span>
                      <span className="font-medium text-green-600">{model.accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing Speed:</span>
                      <span>{model.processingSpeed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Update:</span>
                      <span>{model.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <Progress value={model.accuracy} className="h-2 mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Model Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Model Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>AI model performance analytics</p>
                  <p className="text-sm">Accuracy and processing time trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          {/* Detection Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-orange-600" />
                Detection Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {/* Heatmap visualization */}
                <div className="absolute inset-0">
                  {/* Simulated heatmap with hotspots */}
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 60 + 20}%`,
                        width: `${Math.random() * 15 + 5}%`,
                        height: `${Math.random() * 15 + 5}%`,
                        background: `radial-gradient(circle, ${
                          Math.random() > 0.7 ? 'rgba(239, 68, 68, 0.8)' :
                          Math.random() > 0.4 ? 'rgba(245, 158, 11, 0.6)' :
                          'rgba(34, 197, 94, 0.4)'
                        } 0%, transparent 70%)`
                      }}
                    />
                  ))}
                </div>
                
                {/* Heatmap legend */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
                  <div className="text-xs font-semibold mb-2">Detection Density</div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Low</span>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>Medium</span>
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heatmap Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">3</div>
                <div className="text-sm text-gray-600">High-Density Zones</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">7</div>
                <div className="text-sm text-gray-600">Medium-Density Zones</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                <div className="text-sm text-gray-600">Low-Density Zones</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* System Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">GPU Utilization:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="h-2 w-20" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Memory Usage:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="h-2 w-20" />
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CPU Load:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={42} className="h-2 w-20" />
                      <span className="text-sm font-medium">42%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temperature:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">67°C</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Processing Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Frames/Second:</span>
                    <span className="text-sm font-medium">34.7 FPS</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inference Time:</span>
                    <span className="text-sm font-medium">28.7ms</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Throughput:</span>
                    <span className="text-sm font-medium">1.2M pixels/sec</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Model Load Time:</span>
                    <span className="text-sm font-medium">2.3s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Performance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>AI processing performance metrics</p>
                  <p className="text-sm">Real-time system health monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}