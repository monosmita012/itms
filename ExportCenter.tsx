import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Download, FileText, Image, Video, Calendar as CalendarIcon, Filter, CheckCircle } from 'lucide-react';
// Date formatting utility
const format = (date: Date, formatStr: string) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Export history data
const exportHistory = [
  {
    id: 1,
    name: 'Track_Geometry_Report_2024_09_02.pdf',
    type: 'PDF Report',
    size: '2.4 MB',
    date: '2024-09-02 14:30',
    status: 'completed',
    downloadUrl: '#'
  },
  {
    id: 2,
    name: 'Dynamic_Parameters_Data.csv',
    type: 'CSV Data',
    size: '850 KB',
    date: '2024-09-02 12:15',
    status: 'completed',
    downloadUrl: '#'
  },
  {
    id: 3,
    name: 'Rail_Condition_Analysis.xlsx',
    type: 'Excel Report',
    size: '1.2 MB',
    date: '2024-09-02 10:45',
    status: 'completed',
    downloadUrl: '#'
  },
  {
    id: 4,
    name: 'Video_Monitoring_Highlights.mp4',
    type: 'Video',
    size: '45.2 MB',
    date: '2024-09-02 09:20',
    status: 'processing',
    downloadUrl: '#'
  }
];

// Available export options
const exportOptions = [
  {
    category: 'Track Geometry',
    options: [
      { id: 'tg_data', label: 'Raw measurement data', format: 'CSV/XML' },
      { id: 'tg_charts', label: 'Geometry charts', format: 'PDF/PNG' },
      { id: 'tg_heatmap', label: 'Severity heatmap', format: 'PNG/PDF' },
      { id: 'tg_report', label: 'Complete analysis report', format: 'PDF' }
    ]
  },
  {
    category: 'Dynamic Parameters',
    options: [
      { id: 'dp_realtime', label: 'Real-time acceleration data', format: 'CSV' },
      { id: 'dp_alerts', label: 'Spike alerts log', format: 'CSV/PDF' },
      { id: 'dp_charts', label: 'Parameter trend charts', format: 'PNG/PDF' }
    ]
  },
  {
    category: 'Rail Condition',
    options: [
      { id: 'rc_profiles', label: 'Rail cross-section profiles', format: 'CSV/PNG' },
      { id: 'rc_wear', label: 'Wear analysis data', format: 'CSV/Excel' },
      { id: 'rc_health', label: 'Component health metrics', format: 'PDF' }
    ]
  },
  {
    category: 'Track Components',
    options: [
      { id: 'tc_condition', label: 'Component condition data', format: 'CSV/Excel' },
      { id: 'tc_defects', label: 'Defect distribution charts', format: 'PNG/PDF' },
      { id: 'tc_trends', label: 'Health trend analysis', format: 'PDF' }
    ]
  },
  {
    category: 'Video Monitoring',
    options: [
      { id: 'vm_footage', label: 'Raw video footage', format: 'MP4/AVI' },
      { id: 'vm_events', label: 'Event snapshots', format: 'ZIP/PDF' },
      { id: 'vm_annotations', label: 'Defect annotations', format: 'JSON/CSV' }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'processing': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getFileIcon = (type: string) => {
  if (type.includes('Video')) return <Video className="w-4 h-4" />;
  if (type.includes('PDF') || type.includes('Report')) return <FileText className="w-4 h-4" />;
  if (type.includes('CSV') || type.includes('Excel')) return <FileText className="w-4 h-4" />;
  return <Download className="w-4 h-4" />;
};

interface ExportCenterProps {
  trainContext?: any;
}

export function ExportCenter({ trainContext }: ExportCenterProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting:', selectedOptions, dateRange, exportFormat);
    alert('Export initiated! Check the export history for progress.');
  };

  return (
    <div className="space-y-6">
      {/* Quick Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium mb-1">Daily Report</h3>
            <p className="text-sm text-gray-600 mb-3">Complete system analysis</p>
            <Button size="sm" className="w-full">Generate PDF</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Download className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-medium mb-1">Raw Data</h3>
            <p className="text-sm text-gray-600 mb-3">All measurement data</p>
            <Button size="sm" variant="outline" className="w-full">Download CSV</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Image className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium mb-1">Visual Reports</h3>
            <p className="text-sm text-gray-600 mb-3">Charts and images</p>
            <Button size="sm" variant="outline" className="w-full">Export Images</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Video className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <h3 className="font-medium mb-1">Video Archive</h3>
            <p className="text-sm text-gray-600 mb-3">Monitoring footage</p>
            <Button size="sm" variant="outline" className="w-full">Download Video</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Export Configuration */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Custom Export Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range Selection */}
              <div>
                <h4 className="font-medium mb-3">Date Range</h4>
                <div className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, 'PPP') : 'From date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, 'PPP') : 'To date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Export Format Selection */}
              <div>
                <h4 className="font-medium mb-3">Export Format</h4>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                    <SelectItem value="excel">Excel Workbook</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                    <SelectItem value="xml">XML Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Selection */}
              <div>
                <h4 className="font-medium mb-3">Select Data to Export</h4>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {exportOptions.map((category) => (
                    <div key={category.category}>
                      <h5 className="font-medium text-sm text-gray-900 mb-2">{category.category}</h5>
                      <div className="space-y-2 pl-4">
                        {category.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={option.id}
                              checked={selectedOptions.includes(option.id)}
                              onCheckedChange={() => handleOptionToggle(option.id)}
                            />
                            <label 
                              htmlFor={option.id} 
                              className="text-sm flex-1 cursor-pointer"
                            >
                              {option.label}
                            </label>
                            <Badge variant="outline" className="text-xs">
                              {option.format}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {selectedOptions.length} items selected
                </div>
                <Button 
                  onClick={handleExport}
                  disabled={selectedOptions.length === 0}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generate Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Export History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exportHistory.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getFileIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.type} • {item.size}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(item.status)}
                        >
                          {item.status}
                        </Badge>
                        {item.status === 'completed' && (
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 text-sm mb-1">Storage Info</h4>
                <p className="text-xs text-blue-800">
                  4 files • 49.6 MB total
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Files are retained for 30 days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Export Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-gray-600">Total Exports</div>
              <div className="text-xs text-gray-500">This month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2.4 GB</div>
              <div className="text-sm text-gray-600">Data Exported</div>
              <div className="text-xs text-gray-500">Total size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-gray-600">PDF Reports</div>
              <div className="text-xs text-gray-500">Most popular</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">98.5%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
              <div className="text-xs text-gray-500">Export reliability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}