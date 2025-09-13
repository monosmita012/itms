import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  ZoomIn, 
  Camera,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { TrackGeometry } from './TrackGeometry';
import { DynamicParameters } from './DynamicParameters';
import { RailCondition } from './RailCondition';
import { TrackComponents } from './TrackComponents';
import { VideoMonitoring } from './VideoMonitoring';

interface DefectImage {
  id: string;
  url: string;
  type: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  aiConfidence: number;
}

interface DetailedSegmentDashboardProps {
  segmentData: any;
  onBack: () => void;
}

// Mock defect images for the selected segment
const getDefectImages = (segmentData: any): DefectImage[] => {
  const images: DefectImage[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1675957664354-6a03c26abd4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlsd2F5JTIwdHJhY2slMjBkZWZlY3QlMjBjcmFjayUyMGRhbWFnZXxlbnwxfHx8fDE3NTY4NTEyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      type: 'Rail Surface Crack',
      description: 'Transverse crack detected on rail head surface',
      severity: 'critical',
      timestamp: '14:23:45',
      aiConfidence: 94.5
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1721320147251-1ecea095f86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlsd2F5JTIwZmFzdGVuaW5nJTIwYm9sdCUyMGRlZmVjdHxlbnwxfHx8fDE3NTY4NTEyNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      type: 'Fastening Defect',
      description: 'Loose bolt detected in rail fastening system',
      severity: 'warning',
      timestamp: '14:20:12',
      aiConfidence: 87.2
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1722686737290-58e911fc3d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlsd2F5JTIwYmFsbGFzdCUyMHN0b25lcyUyMG1haW50ZW5hbmNlfGVufDF8fHx8MTc1Njg1MTI1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      type: 'Ballast Settlement',
      description: 'Uneven ballast distribution affecting track stability',
      severity: 'info',
      timestamp: '14:18:30',
      aiConfidence: 76.8
    }
  ];

  return images;
};

function DefectImagePanel({ images }: { images: DefectImage[] }) {
  const [selectedImage, setSelectedImage] = useState<DefectImage | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<DefectImage | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Defect Images</h3>
        <Badge variant="outline">{images.length} detected</Badge>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-1 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedImage?.id === image.id 
                ? getSeverityColor(image.severity) 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <div className="flex gap-3">
              <img
                src={image.url}
                alt={image.type}
                className="w-20 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm truncate">{image.type}</h4>
                  <Badge className={getSeverityBadgeColor(image.severity)}>
                    {image.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{image.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{image.timestamp}</span>
                  </div>
                  <span>AI: {image.aiConfidence}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Image Details */}
      {selectedImage && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">{selectedImage.type}</h4>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setEnlargedImage(selectedImage)}
              >
                <ZoomIn className="w-4 h-4 mr-1" />
                Enlarge
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          <img
            src={selectedImage.url}
            alt={selectedImage.type}
            className="w-full h-48 object-cover rounded mb-3"
          />
          
          <div className="space-y-2 text-sm">
            <p><strong>Description:</strong> {selectedImage.description}</p>
            <p><strong>AI Confidence:</strong> {selectedImage.aiConfidence}%</p>
            <p><strong>Detection Time:</strong> {selectedImage.timestamp}</p>
            <div className="flex items-center gap-2">
              <strong>Severity:</strong>
              <Badge className={getSeverityBadgeColor(selectedImage.severity)}>
                {selectedImage.severity.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{enlargedImage.type}</h3>
              <Button variant="outline" onClick={() => setEnlargedImage(null)}>
                Close
              </Button>
            </div>
            <img
              src={enlargedImage.url}
              alt={enlargedImage.type}
              className="w-full max-h-[60vh] object-contain"
            />
            <div className="mt-4 text-sm text-gray-600">
              <p>{enlargedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DetailedSegmentDashboard({ segmentData, onBack }: DetailedSegmentDashboardProps) {
  const [activeTab, setActiveTab] = useState('track-geometry');
  const defectImages = getDefectImages(segmentData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </Button>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-semibold">Segment Details</h2>
              <p className="text-sm text-gray-600">
                Chainage: {segmentData?.chainage} km | GPS: {segmentData?.lat}, {segmentData?.lng}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge 
            variant={segmentData?.status === 'defected' ? 'destructive' : 'secondary'}
            className={segmentData?.status === 'defected' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
          >
            {segmentData?.status === 'defected' ? 
              `${segmentData.defectType} (${segmentData.severity})` : 
              'Normal Condition'
            }
          </Badge>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Dashboard Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="track-geometry">Track Geometry</TabsTrigger>
              <TabsTrigger value="dynamic-parameters">Dynamic Parameters</TabsTrigger>
              <TabsTrigger value="rail-condition">Rail Condition</TabsTrigger>
              <TabsTrigger value="track-components">Track Components</TabsTrigger>
              <TabsTrigger value="video-monitoring">Video Monitoring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="track-geometry" className="mt-6">
              <TrackGeometry showDetailedView={true} />
            </TabsContent>
            
            <TabsContent value="dynamic-parameters" className="mt-6">
              <DynamicParameters showDetailedView={true} />
            </TabsContent>
            
            <TabsContent value="rail-condition" className="mt-6">
              <RailCondition showDetailedView={true} />
            </TabsContent>
            
            <TabsContent value="track-components" className="mt-6">
              <TrackComponents showDetailedView={true} />
            </TabsContent>
            
            <TabsContent value="video-monitoring" className="mt-6">
              <VideoMonitoring showDetailedView={true} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Defect Images */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Fault Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DefectImagePanel images={defectImages} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Segment-specific Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Segment Report (PDF)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Raw Data (CSV)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Defect Images (ZIP)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Video Clips (AVI)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}