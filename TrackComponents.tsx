import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Download, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Component condition data
const componentConditions = [
  {
    name: 'Rails',
    health: 85,
    status: 'good',
    defects: 12,
    lastInspection: '2 days ago',
    icon: '🛤️'
  },
  {
    name: 'Fastenings',
    health: 78,
    status: 'warning',
    defects: 8,
    lastInspection: '1 day ago',
    icon: '🔩'
  },
  {
    name: 'Ballast',
    health: 92,
    status: 'excellent',
    defects: 3,
    lastInspection: '3 days ago',
    icon: '⚰️'
  },
  {
    name: 'Sleepers',
    health: 72,
    status: 'warning',
    defects: 15,
    lastInspection: '1 day ago',
    icon: '📏'
  }
];

// Defect distribution data
const defectDistribution = [
  { component: 'Rails', good: 75, warning: 15, critical: 10 },
  { component: 'Fastenings', good: 60, warning: 25, critical: 15 },
  { component: 'Ballast', good: 85, warning: 12, critical: 3 },
  { component: 'Sleepers', good: 55, warning: 30, critical: 15 },
];

// Pie chart data for overall defects
const overallDefects = [
  { name: 'Good Condition', value: 69, color: '#22c55e' },
  { name: 'Warning', value: 20, color: '#eab308' },
  { name: 'Critical', value: 11, color: '#e11d48' },
];

// Component trend data
const trendData = [
  { month: 'Jan', rails: 88, fastenings: 82, ballast: 94, sleepers: 78 },
  { month: 'Feb', rails: 87, fastenings: 80, ballast: 93, sleepers: 76 },
  { month: 'Mar', rails: 86, fastenings: 79, ballast: 92, sleepers: 74 },
  { month: 'Apr', rails: 85, fastenings: 78, ballast: 92, sleepers: 72 },
];

// Track defect locations
const defectLocations = [
  { chainage: 15.2, type: 'Fastening', severity: 'warning', description: 'Loose bolt' },
  { chainage: 23.7, type: 'Rail', severity: 'critical', description: 'Surface crack' },
  { chainage: 31.5, type: 'Sleeper', severity: 'warning', description: 'Cracked sleeper' },
  { chainage: 28.9, type: 'Ballast', severity: 'info', description: 'Settlement' },
  { chainage: 19.3, type: 'Fastening', severity: 'critical', description: 'Missing clip' },
];

const getHealthColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
    default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
  }
};

interface TrackComponentsProps {
  showDetailedView?: boolean;
  trainContext?: any;
}

export function TrackComponents({ showDetailedView = false, trainContext }: TrackComponentsProps) {
  return (
    <div className="space-y-6">
      {/* Component Condition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {componentConditions.map((component, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{component.icon}</span>
                  <h3 className="font-medium">{component.name}</h3>
                </div>
                <Wrench className={`w-5 h-5 ${getHealthColor(component.status)}`} />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{component.health}%</span>
                  <Badge 
                    variant="outline" 
                    className={getHealthColor(component.status)}
                  >
                    {component.status.toUpperCase()}
                  </Badge>
                </div>
                
                <Progress value={component.health} className="h-2" />
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{component.defects} defects</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{component.lastInspection}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defect Distribution Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Component Defect Distribution
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  JPEG
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={defectDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="component" />
                <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="good" stackId="a" fill="#22c55e" name="Good" />
                <Bar dataKey="warning" stackId="a" fill="#eab308" name="Warning" />
                <Bar dataKey="critical" stackId="a" fill="#e11d48" name="Critical" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Defect Pie Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Overall System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={overallDefects}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {overallDefects.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              {overallDefects.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Component Trend Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Component Health Trends (4 Months)
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                domain={[60, 100]}
                label={{ value: 'Health Index (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rails" stroke="#0ea5e9" strokeWidth={3} name="Rails" />
              <Line type="monotone" dataKey="fastenings" stroke="#f97316" strokeWidth={3} name="Fastenings" />
              <Line type="monotone" dataKey="ballast" stroke="#22c55e" strokeWidth={3} name="Ballast" />
              <Line type="monotone" dataKey="sleepers" stroke="#a855f7" strokeWidth={3} name="Sleepers" />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Trend Analysis</h4>
            <p className="text-sm text-yellow-800">
              Sleepers showing consistent deterioration trend. Fastenings require increased monitoring. 
              Rails and ballast maintaining stable condition levels.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Geospatial Track Map */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Defect Location Map</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Track representation with defects */}
          <div className="relative">
            <div className="flex h-16 bg-gray-300 rounded-lg items-center relative overflow-hidden">
              {/* Track rails */}
              <div className="absolute top-2 left-0 right-0 h-2 bg-gray-600 rounded"></div>
              <div className="absolute bottom-2 left-0 right-0 h-2 bg-gray-600 rounded"></div>
              
              {/* Defect markers */}
              {defectLocations.map((defect, index) => (
                <div
                  key={index}
                  className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer"
                  style={{ left: `${(defect.chainage / 40) * 100}%` }}
                  title={`${defect.chainage} km - ${defect.description}`}
                >
                  {getSeverityIcon(defect.severity)}
                </div>
              ))}
            </div>
            
            {/* Chainage markers */}
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>0 km</span>
              <span>10 km</span>
              <span>20 km</span>
              <span>30 km</span>
              <span>40 km</span>
            </div>
          </div>

          {/* Defect List */}
          <div className="mt-6 space-y-2">
            <h4 className="font-medium">Active Defects:</h4>
            {defectLocations.map((defect, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getSeverityIcon(defect.severity)}
                  <div>
                    <p className="font-medium">{defect.type} - {defect.description}</p>
                    <p className="text-sm text-gray-600">Chainage: {defect.chainage} km</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={getSeverityColor(defect.severity)}
                >
                  {defect.severity.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}