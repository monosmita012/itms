import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Train, 
  Clock, 
  MapPin, 
  Search, 
  Filter,
  Zap,
  Truck,
  Users
} from 'lucide-react';

export interface TrainData {
  id: string;
  name: string;
  number: string;
  type: 'Express' | 'Passenger' | 'Freight' | 'Rajdhani' | 'Shatabdi' | 'Duronto';
  status: 'On Time' | 'Delayed' | 'Arrived' | 'Departed';
  currentSpeed: number;
  source: string;
  destination: string;
  nextStation: string;
  eta: string;
  delay: number; // minutes
  currentLocation: {
    lat: number;
    lng: number;
    chainage: string;
  };
  bogies: Array<{
    id: string;
    type: string;
    location: {
      lat: number;
      lng: number;
      chainage: string;
    };
  }>;
  route: Array<{
    lat: number;
    lng: number;
    station?: string;
  }>;
}

// Mock data for Indian trains
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
  },
  {
    id: '16649',
    name: 'Parasuram Express',
    number: '16649',
    type: 'Express',
    status: 'On Time',
    currentSpeed: 85,
    source: 'Mangalore Central',
    destination: 'Trivandrum Central',
    nextStation: 'Kozhikode',
    eta: '18:15',
    delay: 0,
    currentLocation: { lat: 11.2588, lng: 75.7804, chainage: '225.3' },
    bogies: [
      { id: 'S1', type: 'Sleeper', location: { lat: 11.2588, lng: 75.7804, chainage: '225.3' } },
      { id: 'S2', type: 'Sleeper', location: { lat: 11.2587, lng: 75.7803, chainage: '225.2' } },
    ],
    route: [
      { lat: 12.8644, lng: 74.8420, station: 'Mangalore Central' },
      { lat: 11.2588, lng: 75.7804, station: 'Kozhikode' },
      { lat: 8.5241, lng: 76.9366, station: 'Trivandrum Central' }
    ]
  },
  {
    id: 'FR001',
    name: 'Coal Freight Train',
    number: 'FR001',
    type: 'Freight',
    status: 'On Time',
    currentSpeed: 45,
    source: 'Jharia',
    destination: 'Paradip Port',
    nextStation: 'Rourkela',
    eta: '22:00',
    delay: 0,
    currentLocation: { lat: 22.2587, lng: 84.8507, chainage: '147.8' },
    bogies: [
      { id: 'BOXN-1', type: 'Freight Wagon', location: { lat: 22.2587, lng: 84.8507, chainage: '147.8' } },
      { id: 'BOXN-2', type: 'Freight Wagon', location: { lat: 22.2586, lng: 84.8506, chainage: '147.7' } },
    ],
    route: [
      { lat: 23.7307, lng: 86.4185, station: 'Jharia' },
      { lat: 22.2587, lng: 84.8507, station: 'Rourkela' },
      { lat: 20.2648, lng: 86.6947, station: 'Paradip Port' }
    ]
  }
];

interface TrainSelectorProps {
  onTrainSelect: (train: TrainData) => void;
  selectedTrain: TrainData | null;
}

export function TrainSelector({ onTrainSelect, selectedTrain }: TrainSelectorProps) {
  const [trains, setTrains] = useState<TrainData[]>(mockTrains);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filteredTrains, setFilteredTrains] = useState<TrainData[]>(trains);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          currentSpeed: train.currentSpeed + (Math.random() - 0.5) * 10,
          currentLocation: {
            ...train.currentLocation,
            lat: train.currentLocation.lat + (Math.random() - 0.5) * 0.001,
            lng: train.currentLocation.lng + (Math.random() - 0.5) * 0.001,
          }
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter trains based on search and type
  useEffect(() => {
    let filtered = trains;

    if (searchQuery) {
      filtered = filtered.filter(train =>
        train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.number.includes(searchQuery)
      );
    }

    if (filterType !== 'All') {
      filtered = filtered.filter(train => train.type === filterType);
    }

    setFilteredTrains(filtered);
  }, [trains, searchQuery, filterType]);

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
        return <Zap className="w-4 h-4" />;
      case 'Freight':
        return <Truck className="w-4 h-4" />;
      default:
        return <Train className="w-4 h-4" />;
    }
  };

  const trainTypes = ['All', 'Express', 'Passenger', 'Freight', 'Rajdhani', 'Shatabdi', 'Duronto'];

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Train className="w-5 h-5 text-blue-600" />
          Live Trains
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search trains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {trainTypes.map(type => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className="text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[600px] px-4">
          <div className="space-y-3">
            {filteredTrains.map((train) => (
              <div key={train.id}>
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTrain?.id === train.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => onTrainSelect(train)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Train Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(train.type)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{train.number}</span>
                              <Badge variant="outline" className="text-xs">
                                {train.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{train.name}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(train.status)}`}>
                          {train.status}
                          {train.delay > 0 && ` (+${train.delay}m)`}
                        </Badge>
                      </div>

                      {/* Route Info */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{train.source} → {train.destination}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="w-3 h-3" />
                          <span>ETA: {train.eta}</span>
                        </div>
                      </div>

                      {/* Current Status */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-600">
                          Next: <span className="font-medium">{train.nextStation}</span>
                        </div>
                        <div className="text-green-600">
                          {Math.round(train.currentSpeed)} km/h
                        </div>
                      </div>

                      {/* Bogies Info */}
                      <div className="text-xs text-gray-500">
                        {train.bogies.length} Bogies • Chainage: {train.currentLocation.chainage} km
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}