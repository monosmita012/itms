import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrainData } from './TrainSelector';
import { IndiaRailwayMap } from './IndiaRailwayMap';
import { TrackGeometry } from './TrackGeometry';
import { DynamicParameters } from './DynamicParameters';
import { RailCondition } from './RailCondition';
import { TrackComponents } from './TrackComponents';
import { VideoMonitoring } from './VideoMonitoring';
import { ExportCenter } from './ExportCenter';
import { 
  Train, 
  MapPin, 
  Clock, 
  Gauge,
  Users,
  BarChart3,
  Activity,
  Wrench,
  Video,
  Download,
  ChevronRight,
  Zap
} from 'lucide-react';

interface TrainDashboardProps {
  selectedTrain: TrainData;
  allTrains: TrainData[];
  onTrainSelect: (train: TrainData) => void;
  onLocationClick?: (point: any) => void;
}

export function TrainDashboard({ selectedTrain, allTrains, onTrainSelect, onLocationClick }: TrainDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'Arrived': return 'bg-blue-100 text-blue-800';
      case 'Departed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Rajdhani':
      case 'Shatabdi':
      case 'Duronto':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'Freight':
        return <Users className="w-5 h-5 text-gray-500" />;
      default:
        return <Train className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Train Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getTypeIcon(selectedTrain.type)}
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTrain.name}
                  </h2>
                  <Badge variant="outline" className="text-sm">
                    {selectedTrain.number}
                  </Badge>
                  <Badge className={`${getStatusColor(selectedTrain.status)}`}>
                    {selectedTrain.status}
                    {selectedTrain.delay > 0 && ` (+${selectedTrain.delay}m)`}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 mt-2 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedTrain.source} → {selectedTrain.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>ETA: {selectedTrain.eta}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="w-4 h-4" />
                    <span>{Math.round(selectedTrain.currentSpeed)} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Current Location</div>
              <div className="font-medium">
                Chainage: {selectedTrain.currentLocation.chainage} km
              </div>
              <div className="text-sm text-gray-600">
                Next Station: {selectedTrain.nextStation}
              </div>
            </div>
          </div>

          {/* Bogies Overview */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Train Composition</h3>
              <Badge variant="outline">{selectedTrain.bogies.length} Bogies</Badge>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {selectedTrain.bogies.map((bogie, index) => (
                <div
                  key={bogie.id}
                  className="flex-shrink-0 p-2 bg-blue-50 rounded border text-center min-w-[80px]"
                >
                  <div className="text-xs font-medium text-blue-900">{bogie.id}</div>
                  <div className="text-xs text-blue-600 mt-1">{bogie.type}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {bogie.location.chainage} km
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Train className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="track-geometry" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Geometry
          </TabsTrigger>
          <TabsTrigger value="dynamic-parameters" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Dynamics
          </TabsTrigger>
          <TabsTrigger value="rail-condition" className="flex items-center gap-2">
            <Train className="w-4 h-4" />
            Rail
          </TabsTrigger>
          <TabsTrigger value="track-components" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Components
          </TabsTrigger>
          <TabsTrigger value="video-monitoring" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video
          </TabsTrigger>
          <TabsTrigger value="export-center" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Map */}
            <IndiaRailwayMap
              selectedTrain={selectedTrain}
              trains={allTrains}
              onTrainClick={onTrainSelect}
            />

            {/* Train Details */}
            <Card>
              <CardHeader>
                <CardTitle>Train Details & Route</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Route Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Route Progress</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((parseFloat(selectedTrain.currentLocation.chainage) / 1000) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.round((parseFloat(selectedTrain.currentLocation.chainage) / 1000) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Route Stations */}
                <div>
                  <h4 className="font-medium mb-3">Route Stations</h4>
                  <div className="space-y-3">
                    {selectedTrain.route.map((station, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          station.station === selectedTrain.nextStation 
                            ? 'bg-blue-500 animate-pulse' 
                            : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <div className="font-medium">{station.station}</div>
                          <div className="text-sm text-gray-600">
                            {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
                          </div>
                        </div>
                        {station.station === selectedTrain.nextStation && (
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            Next
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(selectedTrain.currentSpeed)}
                    </div>
                    <div className="text-sm text-gray-600">Current Speed (km/h)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedTrain.bogies.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Bogies</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="track-geometry">
          <TrackGeometry onLocationClick={onLocationClick} trainContext={selectedTrain} />
        </TabsContent>

        <TabsContent value="dynamic-parameters">
          <DynamicParameters trainContext={selectedTrain} />
        </TabsContent>

        <TabsContent value="rail-condition">
          <RailCondition trainContext={selectedTrain} />
        </TabsContent>

        <TabsContent value="track-components">
          <TrackComponents trainContext={selectedTrain} />
        </TabsContent>

        <TabsContent value="video-monitoring">
          <VideoMonitoring trainContext={selectedTrain} />
        </TabsContent>

        <TabsContent value="export-center">
          <ExportCenter trainContext={selectedTrain} />
        </TabsContent>
      </Tabs>
    </div>
  );
}