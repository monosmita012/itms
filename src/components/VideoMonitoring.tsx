import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, Play, Pause, SkipBack, SkipForward, Video, Camera, AlertTriangle, Eye, Moon, Sun, Scan, Target, Activity } from 'lucide-react';

// Mock video events data
const videoEvents = [
  {
    id: 1,
    timestamp: '14:25:30',
    chainage: 127.5,
    type: 'Rail Crack',
    severity: 'critical',
    thumbnail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&h=150&fit=crop',
    description: 'Transverse crack detected on right rail'
  },
  {
    id: 2,
    timestamp: '14:23:45',
    chainage: 125.8,
    type: 'Ballast Issue',
    severity: 'warning',
    thumbnail: 'https://images.unsplash.com/photo-1544827763-2b69d33e73b4?w=200&h=150&fit=crop',
    description: 'Uneven ballast distribution'
  },
  {
    id: 3,
    timestamp: '14:20:15',
    chainage: 123.2,
    type: 'Fastening',
    severity: 'warning',
    thumbnail: 'https://images.unsplash.com/photo-1569319624402-4a1d8ba40a59?w=200&h=150&fit=crop',
    description: 'Loose fastening clip'
  },
  {
    id: 4,
    timestamp: '14:18:20',
    chainage: 121.7,
    type: 'Sleeper',
    severity: 'info',
    thumbnail: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=200&h=150&fit=crop',
    description: 'Minor sleeper wear'
  }
];

// Chart data for synchronized view
const chartData = [
  { chainage: 120, defectCount: 0, severity: 'good' },
  { chainage: 121, defectCount: 1, severity: 'info' },
  { chainage: 122, defectCount: 0, severity: 'good' },
  { chainage: 123, defectCount: 1, severity: 'warning' },
  { chainage: 124, defectCount: 0, severity: 'good' },
  { chainage: 125, defectCount: 1, severity: 'warning' },
  { chainage: 126, defectCount: 0, severity: 'good' },
  { chainage: 127, defectCount: 1, severity: 'critical' },
  { chainage: 128, defectCount: 0, severity: 'good' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

interface VideoMonitoringProps {
  showDetailedView?: boolean;
  trainContext?: any;
  selectedLocation?: any;
}

export function VideoMonitoring({ showDetailedView = false, trainContext, selectedLocation }: VideoMonitoringProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45); // seconds
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentChainage] = useState(selectedLocation?.chainage || trainContext?.currentLocation?.chainage || 125.4);
  const [activeTab, setActiveTab] = useState('daylight');
  const [nightVisionEnabled, setNightVisionEnabled] = useState(false);
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState(true);
  const [compareMode, setCompareMode] = useState<'toggle' | 'side-by-side'>('toggle');
  const [showProcessed, setShowProcessed] = useState(true);

  const totalDuration = 300; // 5 minutes

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimelineChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const jumpToEvent = (event: any) => {
    setSelectedEvent(event);
    // Calculate time based on chainage (mock calculation)
    const eventTime = (event.chainage - 120) * 30; // 30 seconds per km
    setCurrentTime(eventTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Video Controls Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></div>
                LIVE RECORDING
              </Badge>
              <span className="text-sm text-gray-600">
                Current Position: {currentChainage} km
              </span>
              <span className="text-sm text-gray-600">
                Time: {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
              {trainContext && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {trainContext.name} - {trainContext.number}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant={nightVisionEnabled ? "default" : "outline"} 
                size="sm"
                onClick={() => setNightVisionEnabled(!nightVisionEnabled)}
              >
                <Moon className="w-4 h-4 mr-2" />
                Night Vision
              </Button>
              <Button 
                variant={aiOverlayEnabled ? "default" : "outline"} 
                size="sm"
                onClick={() => setAiOverlayEnabled(!aiOverlayEnabled)}
              >
                <Scan className="w-4 h-4 mr-2" />
                AI Overlay
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Video Player with Tabs */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Multi-Camera Track Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="daylight" className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Daylight
              </TabsTrigger>
              <TabsTrigger value="nightvision" className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Night Vision
              </TabsTrigger>
              <TabsTrigger value="multicam" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Multi-Camera
              </TabsTrigger>
              <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                AI Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daylight" className="space-y-4">
              {/* Main Daylight Video */}
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img 
                  src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=450&fit=crop"
                  alt="Daylight track view"
                  className="w-full h-full object-cover"
                />
                
                {/* AI Overlay Boxes */}
                {aiOverlayEnabled && (
                  <div className="absolute inset-0">
                    {/* Rail crack detection */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-red-500 bg-red-500/20 px-2 py-1 rounded">
                      <span className="text-white text-xs font-bold">CRACK DETECTED (94%)</span>
                    </div>
                    
                    {/* Missing fastener */}
                    <div className="absolute bottom-1/3 right-1/4 border-2 border-yellow-500 bg-yellow-500/20 px-2 py-1 rounded">
                      <span className="text-white text-xs font-bold">FASTENER (87%)</span>
                    </div>
                  </div>
                )}
                
                {/* Standard overlays */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  14:25:30 | {currentChainage} km | DAYLIGHT CAM
                </div>
                
                {/* Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handlePlayPause}
                    className="bg-black/50 hover:bg-black/70 text-white border-none"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nightvision" className="space-y-4">
              {/* Night Vision Video */}
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-black flex items-center justify-center">
                  <div className="text-center text-green-400">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Night Vision Camera Feed</p>
                    <p className="text-sm opacity-75">Enhanced low-light imaging</p>
                  </div>
                </div>
                
                {/* Night vision AI overlays */}
                {aiOverlayEnabled && (
                  <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/3 border-2 border-green-400 bg-green-400/20 px-2 py-1 rounded">
                      <span className="text-green-300 text-xs font-bold">THERMAL SPOT (89%)</span>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 bg-black/70 text-green-400 px-2 py-1 rounded text-sm">
                  14:25:30 | {currentChainage} km | NIGHT VISION
                </div>
                
                {/* Night vision indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-900/70 text-green-400 px-2 py-1 rounded text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>IR ACTIVE</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="multicam" className="space-y-4">
              {/* Multi-Camera Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Front Camera */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1544827763-2b69d33e73b4?w=400&h=225&fit=crop"
                    alt="Front camera"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                    FRONT CAM
                  </div>
                </div>
                
                {/* Rear Camera */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=225&fit=crop"
                    alt="Rear camera"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                    REAR CAM
                  </div>
                  {aiOverlayEnabled && (
                    <div className="absolute bottom-1/4 right-1/4 border border-red-400 bg-red-400/20 px-1 py-0.5 rounded">
                      <span className="text-white text-xs">DEFECT</span>
                    </div>
                  )}
                </div>
                
                {/* Side Camera Left */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1569319624402-4a1d8ba40a59?w=400&h=225&fit=crop"
                    alt="Left side camera"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                    LEFT SIDE
                  </div>
                </div>
                
                {/* Side Camera Right */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=225&fit=crop"
                    alt="Right side camera"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                    RIGHT SIDE
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-analysis" className="space-y-4">
              {/* Compare Controls */}
              <div className="flex items-center justify-between">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Raw */}
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=450&fit=crop"
                      alt="Raw view"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">RAW</div>
                  </div>
                  {/* Processed */}
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=450&fit=crop"
                      alt="AI analysis view"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="border-2 border-red-500 bg-red-500/20 rounded-lg p-2">
                          <div className="text-white text-xs font-bold mb-1">RAIL SURFACE CRACK</div>
                          <div className="text-white text-xs">Confidence: 94.2%</div>
                          <div className="text-white text-xs">Severity: Critical</div>
                        </div>
                      </div>
                      <div className="absolute bottom-1/3 right-1/4">
                        <div className="border-2 border-yellow-500 bg-yellow-500/20 rounded p-1">
                          <div className="text-white text-xs font-bold">MISSING FASTENER</div>
                          <div className="text-white text-xs">Confidence: 87.3%</div>
                        </div>
                      </div>
                      <div className="absolute top-1/4 left-1/4">
                        <div className="border-2 border-blue-500 bg-blue-500/20 rounded p-1">
                          <div className="text-white text-xs font-bold">BALLAST PATTERN</div>
                          <div className="text-white text-xs">Confidence: 76.5%</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">AI ANALYSIS | 28ms | 34.7 FPS</div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">YOLOv8-Rail | NVIDIA Jetson</div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=450&fit=crop"
                    alt="AI analysis view"
                    className={`w-full h-full object-cover ${showProcessed ? 'opacity-80' : ''}`}
                  />
                  {showProcessed && (
                    <div className="absolute inset-0">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="border-2 border-red-500 bg-red-500/20 rounded-lg p-2">
                          <div className="text-white text-xs font-bold mb-1">RAIL SURFACE CRACK</div>
                          <div className="text-white text-xs">Confidence: 94.2%</div>
                          <div className="text-white text-xs">Severity: Critical</div>
                        </div>
                      </div>
                      <div className="absolute bottom-1/3 right-1/4">
                        <div className="border-2 border-yellow-500 bg-yellow-500/20 rounded p-1">
                          <div className="text-white text-xs font-bold">MISSING FASTENER</div>
                          <div className="text-white text-xs">Confidence: 87.3%</div>
                        </div>
                      </div>
                      <div className="absolute top-1/4 left-1/4">
                        <div className="border-2 border-blue-500 bg-blue-500/20 rounded p-1">
                          <div className="text-white text-xs font-bold">BALLAST PATTERN</div>
                          <div className="text-white text-xs">Confidence: 76.5%</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">{showProcessed ? 'AI ANALYSIS | 28ms | 34.7 FPS' : 'RAW VIEW'}</div>
                  {showProcessed && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">YOLOv8-Rail | NVIDIA Jetson</div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Enhanced Video Controls */}
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <SkipForward className="w-4 h-4" />
              </Button>
              <span className="text-sm">{formatTime(currentTime)}</span>
              
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-600">Resolution:</span>
                <select className="text-xs border rounded px-1 py-0.5">
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
            </div>

            {/* Enhanced Timeline with Events */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                onValueChange={handleTimelineChange}
                max={totalDuration}
                step={1}
                className="w-full"
              />
              
              {/* Event markers on timeline with enhanced tooltips */}
              <div className="relative h-4">
                {videoEvents.map((event) => {
                  const position = ((event.chainage - 120) * 30 / totalDuration) * 100;
                  return (
                    <div
                      key={event.id}
                      className={`absolute top-1 w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 ${
                        event.severity === 'critical' ? 'bg-red-500' :
                        event.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ left: `${position}%` }}
                      onClick={() => jumpToEvent(event)}
                      title={`${event.type} at ${event.chainage} km - ${event.severity}`}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Event Snapshots Gallery */}
        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Event Snapshots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {videoEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedEvent?.id === event.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => jumpToEvent(event)}
                  >
                    <div className="flex gap-3">
                      <img
                        src={event.thumbnail}
                        alt={event.type}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{event.type}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(event.severity)}`}
                          >
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{event.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{event.timestamp}</span>
                          <span>{event.chainage} km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Split-Screen: Video Analysis */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Synchronized Data Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Synchronized Chart */}
            <div>
              <h4 className="font-medium mb-4">Defect Distribution Along Track</h4>
              <div className="space-y-2">
                {chartData.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-12 text-sm">{point.chainage} km</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div 
                        className={`h-6 flex-1 rounded flex items-center justify-center text-white text-xs ${
                          point.severity === 'critical' ? 'bg-red-500' :
                          point.severity === 'warning' ? 'bg-yellow-500' :
                          point.severity === 'info' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                      >
                        {point.defectCount > 0 && (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                      </div>
                      <span className="text-xs w-8">{point.defectCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Summary */}
            <div>
              <h4 className="font-medium mb-4">Real-Time Analysis</h4>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-red-900">Critical Alert</span>
                  </div>
                  <p className="text-sm text-red-800">
                    Significant rail crack detected at 127.5 km. Immediate inspection required.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-yellow-900">Multiple Warnings</span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    3 warning-level defects detected in the current segment. Schedule maintenance review.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Detection Statistics</h5>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Events:</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Warning:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Info:</span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}