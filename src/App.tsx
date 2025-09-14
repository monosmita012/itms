import React, { useEffect, useState } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { TrackGeometry } from './components/TrackGeometry';
import { DynamicParameters } from './components/DynamicParameters';
import { RailCondition } from './components/RailCondition';
import { TrackComponents } from './components/TrackComponents';
import { VideoMonitoring } from './components/VideoMonitoring';
import { ExportCenter } from './components/ExportCenter';
import { DetailedSegmentDashboard } from './components/DetailedSegmentDashboard';
import { DefectAlert } from './components/DefectAlert';
import { TrainSelector, TrainData } from './components/TrainSelector';
import { TrainDashboard } from './components/TrainDashboard';
import { IndiaRailwayMap } from './components/IndiaRailwayMap';
import { LiveMap } from './components/LiveMap';
import { ThermalMonitoring } from './components/ThermalMonitoring';
import { SubsurfaceMonitoring } from './components/SubsurfaceMonitoring';
import { AIAnalysis } from './components/AIAnalysis';
import { 
  BarChart3, 
  Activity, 
  Train, 
  Wrench, 
  Video, 
  Download,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Map,
  List,
  Zap,
  FileText,
  Shield,
  Settings,
  Eye,
  Clock,
  Layers,
  Target,
  Gauge as GaugeIcon,
  Cpu,
  MapPin,
  Thermometer,
  Radar,
  Brain,
  Scan,
  Waves
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { TrainMap } from './components/TrainMap';
import { API_CONFIG, TrainLocationResponse, WebSocketMessage } from './config/api';
import { rapidApiService, TrainStatusResponse } from './services/rapidApiService';

const menuItems = [
  { id: 'train-selection', label: 'Train Selection', icon: List },
  { id: 'railway-map', label: 'Railway Network Map', icon: Map },
  { id: 'track-geometry', label: 'Track Geometry', icon: BarChart3 },
  { id: 'dynamic-parameters', label: 'Dynamic Parameters', icon: Activity },
  { id: 'rail-condition', label: 'Rail Condition', icon: Train },
  { id: 'track-components', label: 'Track Components', icon: Wrench },
  { id: 'video-monitoring', label: 'Video Monitoring', icon: Video },
  { id: 'thermal-monitoring', label: 'Thermal Monitoring', icon: Thermometer },
  { id: 'subsurface-monitoring', label: 'Subsurface Monitoring (GPR)', icon: Radar },
  { id: 'ai-analysis', label: 'AI Analysis', icon: Brain },
  { id: 'export-center', label: 'Export Center', icon: Download },
];

// Mock data for trains (imported from TrainSelector)
const mockTrains: TrainData[] = [
  {
    id: '12001',
    name: 'New Delhi - Howrah Rajdhani Express',
    number: '12001',
    type: 'Rajdhani',
    status: 'On Time',
    currentSpeed: 130,
    source: 'New Delhi',
    destination: 'Howrah',
    nextStation: 'Kanpur Central',
    eta: '14:25',
    delay: 0,
    currentLocation: { lat: 26.4499, lng: 80.3319, chainage: '441.2' },
    bogies: [
      { id: 'AC1-1', type: 'AC First Class', location: { lat: 26.4499, lng: 80.3319, chainage: '441.2' } },
      { id: 'AC2-1', type: 'AC 2-Tier', location: { lat: 26.4498, lng: 80.3318, chainage: '441.1' } },
      { id: 'AC2-2', type: 'AC 2-Tier', location: { lat: 26.4497, lng: 80.3317, chainage: '441.0' } },
    ],
    route: [
      { lat: 28.6139, lng: 77.2090, station: 'New Delhi' },
      { lat: 26.4499, lng: 80.3319, station: 'Kanpur Central' },
      { lat: 22.5726, lng: 88.3639, station: 'Howrah' }
    ]
  },
  {
    id: '12002',
    name: 'New Delhi - Chennai Central Rajdhani Express',
    number: '12002',
    type: 'Rajdhani',
    status: 'Delayed',
    currentSpeed: 95,
    source: 'New Delhi',
    destination: 'Chennai Central',
    nextStation: 'Bhopal Junction',
    eta: '16:45',
    delay: 15,
    currentLocation: { lat: 23.2599, lng: 77.4126, chainage: '707.5' },
    bogies: [
      { id: 'AC1-1', type: 'AC First Class', location: { lat: 23.2599, lng: 77.4126, chainage: '707.5' } },
      { id: 'AC2-1', type: 'AC 2-Tier', location: { lat: 23.2598, lng: 77.4125, chainage: '707.4' } },
    ],
    route: [
      { lat: 28.6139, lng: 77.2090, station: 'New Delhi' },
      { lat: 23.2599, lng: 77.4126, station: 'Bhopal Junction' },  
      { lat: 13.0827, lng: 80.2707, station: 'Chennai Central' }
    ]
  },
  {
    id: '12009',
    name: 'Mumbai Central - Ahmedabad Shatabdi Express',
    number: '12009',
    type: 'Shatabdi',
    status: 'On Time',
    currentSpeed: 110,
    source: 'Mumbai Central',
    destination: 'Ahmedabad Junction',
    nextStation: 'Vadodara Junction',
    eta: '12:30',
    delay: 0,
    currentLocation: { lat: 22.3072, lng: 73.1812, chainage: '388.7' },
    bogies: [
      { id: 'CC-1', type: 'Chair Car', location: { lat: 22.3072, lng: 73.1812, chainage: '388.7' } },
      { id: 'EC-1', type: 'Executive Chair', location: { lat: 22.3071, lng: 73.1811, chainage: '388.6' } },
    ],
    route: [
      { lat: 19.0760, lng: 72.8777, station: 'Mumbai Central' },
      { lat: 22.3072, lng: 73.1812, station: 'Vadodara Junction' },
      { lat: 23.0225, lng: 72.5714, station: 'Ahmedabad Junction' }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('train-selection');
  const [selectedTrain, setSelectedTrain] = useState<TrainData | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [showDetailedDashboard, setShowDetailedDashboard] = useState(false);
  const [simIndex, setSimIndex] = useState<number>(0);
  const [liveTrainStatus, setLiveTrainStatus] = useState<TrainStatusResponse | null>(null);
  const [isRapidApiConfigured, setIsRapidApiConfigured] = useState(false);

  const handleTrainSelect = (train: TrainData) => {
    setSelectedTrain(train);
    setActiveTab('track-geometry'); // Switch to monitoring view
  };

  const handleLocationClick = (point: any) => {
    setSelectedSegment(point);
    setShowDetailedDashboard(true);
  };

  const handleDefectAlertViewDetails = (alert: any) => {
    // Create segment data from alert
    const segmentData = {
      chainage: alert.chainage,
      lat: (28.6139 + parseFloat(alert.chainage) * 0.001).toFixed(6),
      lng: (77.2090 + parseFloat(alert.chainage) * 0.001).toFixed(6),
      status: 'defected',
      defectType: alert.type,
      severity: alert.severity
    };
    setSelectedSegment(segmentData);
    setShowDetailedDashboard(true);
  };

  const handleBackToOverview = () => {
    setShowDetailedDashboard(false);
    setSelectedSegment(null);
  };

  // Check RapidAPI configuration on mount
  useEffect(() => {
    const configStatus = rapidApiService.getConfigStatus();
    setIsRapidApiConfigured(configStatus.isConfigured);
  }, []);

  // Handle live train status updates
  const handleTrainStatusUpdate = (status: TrainStatusResponse) => {
    setLiveTrainStatus(status);
    
    // Update selected train with live data if available
    if (status.success && status.data && selectedTrain) {
      setSelectedTrain(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentLocation: {
            lat: status.data!.current_station.lat,
            lng: status.data!.current_station.lng,
            chainage: prev.currentLocation.chainage // Keep existing chainage
          },
          currentSpeed: status.data!.speed,
          status: status.data!.status === 'ON_TIME' ? 'On Time' : 
                  status.data!.status === 'DELAYED' ? 'Delayed' : 
                  status.data!.status === 'RUNNING' ? 'On Time' : 'Stopped',
          nextStation: status.data!.next_station?.station_name || prev.nextStation,
          eta: status.data!.eta || prev.eta,
          delay: status.data!.delay || 0
        };
      });
    }
  };

  // Real-time GPS updates from API (with WebSocket fallback to polling)
  useEffect(() => {
    if (!selectedTrain) return;
    
    let ws: WebSocket | null = null;
    let interval: NodeJS.Timeout | null = null;
    
    const updateTrainLocation = (locationData: TrainLocationResponse) => {
      setSelectedTrain((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentLocation: {
            ...prev.currentLocation,
            lat: locationData.lat,
            lng: locationData.lng,
            chainage: locationData.chainage || prev.currentLocation.chainage
          },
          currentSpeed: locationData.speedKmph || prev.currentSpeed,
          status: locationData.status || prev.status,
          nextStation: locationData.nextStation || prev.nextStation,
          eta: locationData.eta || prev.eta
        };
      });
    };

    const fallbackToSimulation = () => {
      console.warn('API/WebSocket failed, falling back to simulation');
      if (selectedTrain.route && selectedTrain.route.length > 0) {
        setSimIndex((prev) => (prev + 1) % selectedTrain.route.length);
        setSelectedTrain((prev) => {
          if (!prev) return prev;
          const nextPoint = selectedTrain.route[(simIndex + 1) % selectedTrain.route.length];
          return {
            ...prev,
            currentLocation: {
              ...prev.currentLocation,
              lat: nextPoint.lat,
              lng: nextPoint.lng,
              chainage: prev.currentLocation.chainage
            }
          };
        });
      }
    };

    const fetchTrainLocation = async () => {
      try {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRAIN_LOCATION(selectedTrain.id)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${yourAuthToken}`,
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const locationData: TrainLocationResponse = await response.json();
        updateTrainLocation(locationData);
      } catch (error) {
        console.warn('API call failed:', error);
        fallbackToSimulation();
      }
    };

    // Try WebSocket first (preferred for real-time updates)
    try {
      const wsUrl = `${API_CONFIG.WS_URL}${API_CONFIG.WS_ENDPOINTS.TRAIN_LOCATION(selectedTrain.id)}`;
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected for train', selectedTrain.id);
      };
      
      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          if (message.type === 'location_update' && message.data) {
            updateTrainLocation(message.data);
          }
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.warn('WebSocket error, falling back to polling:', error);
        // Fallback to polling if WebSocket fails
        interval = setInterval(fetchTrainLocation, API_CONFIG.POLLING_INTERVAL);
      };
      
      ws.onclose = () => {
        console.log('WebSocket closed, falling back to polling');
        // Fallback to polling if WebSocket closes
        interval = setInterval(fetchTrainLocation, API_CONFIG.POLLING_INTERVAL);
      };
    } catch (error) {
      console.warn('WebSocket not available, using polling:', error);
      // Fallback to polling if WebSocket is not available
      interval = setInterval(fetchTrainLocation, API_CONFIG.POLLING_INTERVAL);
    }

    // Initial fetch
    fetchTrainLocation();
    
    return () => {
      if (ws) {
        ws.close();
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedTrain, simIndex]);

  const getTrainTypeIcon = (type: string) => {
    switch (type) {
      case 'Rajdhani':
      case 'Shatabdi':
      case 'Duronto':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return <Train className="w-4 h-4 text-blue-500" />;
    }
  };

  // Standards content for modals
  const standardsContent = {
    rdso: {
      title: "ITMS Standards (TM/IM/448, Rev. 1: 2023)",
      subtitle: "Integrated Track Monitoring System",
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      items: [
        {
          icon: <Eye className="w-5 h-5 text-green-600" />,
          title: "Super Inspector",
          description: "Combines all inspections (geometry, rail wear, defects, vibrations) in one system."
        },
        {
          icon: <Target className="w-5 h-5 text-purple-600" />,
          title: "MMD Envelope",
          description: "Detects if objects (trees, buildings) block the train's safety clearance."
        },
        {
          icon: <Zap className="w-5 h-5 text-orange-600" />,
          title: "High-Speed",
          description: "Works up to 200 km/h, records even from 0 km/h."
        },
        {
          icon: <Cpu className="w-5 h-5 text-blue-600" />,
          title: "Smart & Autonomous",
          description: "Identifies rail types, curves, bridges; uses GPS + RFID for accurate location."
        },
        {
          icon: <Shield className="w-5 h-5 text-red-600" />,
          title: "Rugged & Reliable",
          description: "Withstands dust, rain, power noise; has backup hard drive for data safety."
        },
        {
          icon: <FileText className="w-5 h-5 text-gray-600" />,
          title: "Source Code",
          description: "Supplier must give full software code so Railways owns the technology."
        }
      ]
    },
    en: {
      title: "EN 13848 Standards",
      subtitle: "European Railway Track Quality Rules",
      icon: <Settings className="w-6 h-6 text-green-600" />,
      items: [
        {
          icon: <Layers className="w-5 h-5 text-blue-600" />,
          title: "Part 1 – Geometry Basics",
          description: "Defines key track geometry (gauge, alignment, level) and measurement rules."
        },
        {
          icon: <Train className="w-5 h-5 text-purple-600" />,
          title: "Part 2 – Recording Vehicles",
          description: "Standards for inspection trains that measure track continuously."
        },
        {
          icon: <Wrench className="w-5 h-5 text-orange-600" />,
          title: "Part 3 – Construction/Maintenance Machines",
          description: "Standards for machines checking track during building/repair."
        },
        {
          icon: <Settings className="w-5 h-5 text-green-600" />,
          title: "Part 4 – Manual Devices",
          description: "Rules for small portable track measurement tools."
        },
        {
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          title: "Part 5 – Quality Levels",
          description: "Defines safe vs unsafe limits; sets thresholds for urgent repairs."
        },
        {
          icon: <BarChart3 className="w-5 h-5 text-indigo-600" />,
          title: "Part 6 – Quality Index",
          description: "Method to calculate overall Track Quality Index (TQI) for condition rating."
        }
      ]
    },
    sttmc: {
      title: "STTMC Standards (TM/IM/457)",
      subtitle: "Self-Propelled Track & Turnout Monitoring Car",
      icon: <GaugeIcon className="w-6 h-6 text-purple-600" />,
      items: [
        {
          icon: <Zap className="w-5 h-5 text-blue-600" />,
          title: "Fast & Slow",
          description: "Inspects at 100 km/h for normal track, 40 km/h for turnouts."
        },
        {
          icon: <Video className="w-5 h-5 text-green-600" />,
          title: "Multi-Camera",
          description: "Front/rear view + smart cameras to detect cracks, missing clips."
        },
        {
          icon: <Eye className="w-5 h-5 text-purple-600" />,
          title: "Contactless Measuring",
          description: "Uses lasers to measure alignment, gauge, and rail wear without touching track."
        },
        {
          icon: <Shield className="w-5 h-5 text-orange-600" />,
          title: "All-Weather",
          description: "Rugged for heat, rain, dust; safe from overhead wire interference."
        },
        {
          icon: <MapPin className="w-5 h-5 text-red-600" />,
          title: "Accurate Location",
          description: "Uses axle encoders + RFID tags to map exact defect positions."
        },
        {
          icon: <FileText className="w-5 h-5 text-gray-600" />,
          title: "Source Code",
          description: "Supplier must hand over full software for Indian Railways' control."
        }
      ]
    }
  };

  const StandardModal: React.FC<{ standard: keyof typeof standardsContent; children: React.ReactNode }> = ({ standard, children }) => {
    const content = standardsContent[standard];
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              {content.icon}
              <div>
                <div>{content.title}</div>
                <div className="text-sm text-gray-600 font-normal">{content.subtitle}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96 pr-4">
            <div className="space-y-4">
              {content.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    {item.icon}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  const renderContent = () => {
    if (showDetailedDashboard && selectedSegment) {
      return (
        <DetailedSegmentDashboard 
          segmentData={selectedSegment} 
          onBack={handleBackToOverview}
        />
      );
    }

    switch (activeTab) {
      case 'train-selection':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Train className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select a Train to Monitor
              </h2>
              <p className="text-gray-600 mb-6">
                Choose from live Indian Railway trains to access real-time monitoring data
              </p>
            </div>
            <TrainSelector 
              onTrainSelect={handleTrainSelect} 
              selectedTrain={selectedTrain} 
            />
          </div>
        );
      case 'railway-map':
        return (
          <div className="h-screen w-full -m-6">
            {selectedTrain ? (
              <div className="h-full">
                <LiveMap
                  trainContext={selectedTrain}
                  selectedTrainNumber={selectedTrain.number}
                  onTrainStatusUpdate={handleTrainStatusUpdate}
                  onLocationClick={(point) => {
                    setSelectedSegment({ ...point, chainage: selectedTrain?.currentLocation.chainage });
                  }}
                  showDetailedView={true}
                />
              </div>
            ) : (
              <div className="h-full">
                <IndiaRailwayMap
                  selectedTrain={selectedTrain}
                  trains={mockTrains}
                  onTrainClick={handleTrainSelect}
                />
              </div>
            )}
          </div>
        );
      case 'track-geometry':
        return selectedTrain ? 
          <TrackGeometry onLocationClick={handleLocationClick} trainContext={selectedTrain} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to view track geometry data</p>
          </div>;
      case 'dynamic-parameters':
        return selectedTrain ? 
          <DynamicParameters trainContext={selectedTrain} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to view dynamic parameters</p>
          </div>;
      case 'rail-condition':
        return selectedTrain ? 
          <RailCondition trainContext={selectedTrain} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to view rail condition data</p>
          </div>;
      case 'track-components':
        return selectedTrain ? 
          <TrackComponents trainContext={selectedTrain} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to view track components data</p>
          </div>;
      case 'video-monitoring':
        return selectedTrain ? 
          <VideoMonitoring trainContext={selectedTrain} selectedLocation={selectedSegment} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to view video monitoring</p>
          </div>;
      case 'thermal-monitoring':
        return selectedTrain ? 
          <ThermalMonitoring trainContext={selectedTrain} selectedLocation={selectedSegment} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to view thermal monitoring</p>
          </div>;
      case 'subsurface-monitoring':
        return selectedTrain ? 
          <SubsurfaceMonitoring trainContext={selectedTrain} selectedLocation={selectedSegment} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to view subsurface monitoring</p>
          </div>;
      case 'ai-analysis':
        return selectedTrain ? 
          <AIAnalysis trainContext={selectedTrain} selectedLocation={selectedSegment} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to view AI analysis</p>
          </div>;
      case 'export-center':
        return selectedTrain ? 
          <ExportCenter trainContext={selectedTrain} /> :
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Train Selected</h3>
            <p className="text-gray-600">Please select a train to export data</p>
          </div>;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Train className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select a Train to Monitor
              </h2>
              <p className="text-gray-600 mb-6">
                Choose from live Indian Railway trains to access real-time monitoring data
              </p>
            </div>
            <TrainSelector 
              onTrainSelect={handleTrainSelect} 
              selectedTrain={selectedTrain} 
            />
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Gauge className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="font-semibold text-gray-900">ITMS</h2>
                <p className="text-sm text-gray-600">Track Monitor</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-4 py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      isActive={activeTab === item.id}
                      className="w-full justify-start gap-3 py-3 transition-all duration-300 data-[active=true]:shadow-md data-[active=true]:ring-2 data-[active=true]:ring-blue-200 data-[active=true]:bg-blue-50"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      ITMS – Indigenous Track Monitoring System
                    </h1>
                    {selectedTrain && (
                      <div className="flex items-center gap-2 ml-4">
                        {getTrainTypeIcon(selectedTrain.type)}
                        <Badge variant="outline" className="text-sm">
                          {selectedTrain.number}
                        </Badge>
                        <span className="text-lg font-semibold text-blue-600">
                          {selectedTrain.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {selectedTrain 
                      ? `Live IoT-Powered Railway Track Analytics for ${selectedTrain.source} → ${selectedTrain.destination}`
                      : 'Live IoT-Powered Railway Track Analytics'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Live Monitoring Badge */}
                <Badge variant="destructive" className="animate-pulse bg-red-500">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                  {isRapidApiConfigured ? 'LIVE API MONITORING' : 'SIMULATION MODE'}
                </Badge>

                {/* System Standards */}
                <div className="flex items-center gap-2">
                  <StandardModal standard="rdso">
                    <Badge 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      RDSO
                    </Badge>
                  </StandardModal>
                  
                  <StandardModal standard="en">
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      EN 13848
                    </Badge>
                  </StandardModal>
                  
                  <StandardModal standard="sttmc">
                    <Badge 
                      variant="secondary" 
                      className="bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 transition-colors"
                    >
                      <GaugeIcon className="w-3 h-3 mr-1" />
                      STTMC
                    </Badge>
                  </StandardModal>
                </div>

                {/* System Health */}
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  System: Excellent
                </Badge>

                {/* Current Time */}
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
          
          {/* Defect Alerts - Only show on main dashboard */}
          {!showDetailedDashboard && (
            <DefectAlert onViewDetails={handleDefectAlertViewDetails} />
          )}

          {/* Footer - Track Map */}
          <footer className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedTrain ? (
                  <>
                    <span className="text-sm text-gray-600">Live Position:</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Chainage: {selectedTrain.currentLocation.chainage} km
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Speed: {Math.round(selectedTrain.currentSpeed)} km/h
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Next: {selectedTrain.nextStation}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Bogies: {selectedTrain.bogies.length}
                    </Badge>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-600">Train Status:</span>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">
                      No Train Selected
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">System Online</span>
                {selectedTrain && (
                  <>
                    <div className="w-1 h-4 bg-gray-300 mx-2"></div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        selectedTrain.status === 'On Time' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {selectedTrain.status}
                      {selectedTrain.delay > 0 && ` (+${selectedTrain.delay}m)`}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}