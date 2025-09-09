import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, AlertTriangle, CheckCircle, Eye, Clock, MapPin } from 'lucide-react';

interface DefectAlert {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  chainage: string;
  description: string;
  aiConfidence: number;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

interface DefectAlertProps {
  onViewDetails: (alert: DefectAlert) => void;
}

// Mock alert data
const mockAlerts: DefectAlert[] = [
  {
    id: 'alert_001',
    type: 'Rail Surface Crack',
    severity: 'critical',
    chainage: '127.5',
    description: 'Transverse crack detected on rail head surface requiring immediate attention',
    aiConfidence: 94.5,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    status: 'active'
  },
  {
    id: 'alert_002',
    type: 'Fastening Looseness',
    severity: 'warning',
    chainage: '125.8',
    description: 'Loose bolt detected in rail fastening system',
    aiConfidence: 87.2,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    status: 'active'
  },
  {
    id: 'alert_003',
    type: 'Ballast Settlement',
    severity: 'info',
    chainage: '123.2',
    description: 'Minor ballast settlement detected, monitoring required',
    aiConfidence: 76.8,
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
    status: 'acknowledged'
  }
];

export function DefectAlert({ onViewDetails }: DefectAlertProps) {
  const [alerts, setAlerts] = useState<DefectAlert[]>(mockAlerts);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newAlert: DefectAlert = {
          id: `alert_${Date.now()}`,
          type: ['Rail Crack', 'Fastening Issue', 'Ballast Problem', 'Sleeper Damage'][Math.floor(Math.random() * 4)],
          severity: Math.random() < 0.3 ? 'critical' : Math.random() < 0.6 ? 'warning' : 'info',
          chainage: (120 + Math.random() * 10).toFixed(1),
          description: 'New defect detected by AI monitoring system',
          aiConfidence: 70 + Math.random() * 25,
          timestamp: new Date().toISOString(),
          status: 'active'
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only 10 alerts
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const handleViewDetails = (alert: DefectAlert) => {
    onViewDetails(alert);
  };

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-900',
          badge: 'bg-red-100 text-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-500',
          text: 'text-yellow-900',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          text: 'text-blue-900',
          badge: 'bg-blue-100 text-blue-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-500',
          text: 'text-gray-900',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));
  const activeAlerts = visibleAlerts.filter(alert => alert.status === 'active');

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 max-w-md space-y-2 z-50">
      {/* Alert Counter */}
      {activeAlerts.length > 0 && (
        <Card className="shadow-lg border-orange-200 bg-orange-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 animate-pulse" />
              <span className="font-medium text-orange-900">
                {activeAlerts.length} Active Defect Alert{activeAlerts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Alerts */}
      {visibleAlerts.slice(0, 3).map((alert) => {
        const colors = getSeverityColors(alert.severity);
        
        return (
          <Card 
            key={alert.id} 
            className={`shadow-lg border-l-4 ${colors.border} ${colors.bg} ${
              alert.status === 'active' ? 'animate-pulse' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <h4 className={`font-medium ${colors.text}`}>{alert.type}</h4>
                    <Badge className={colors.badge}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className={`text-sm ${colors.text} mb-3`}>
                    {alert.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>Chainage: {alert.chainage} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        AI Confidence: {alert.aiConfidence.toFixed(1)}%
                      </span>
                      <Badge variant="outline" className={
                        alert.status === 'active' ? 'border-red-200 text-red-700' :
                        alert.status === 'acknowledged' ? 'border-yellow-200 text-yellow-700' :
                        'border-green-200 text-green-700'
                      }>
                        {alert.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleViewDetails(alert)}
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </Button>
                    
                    {alert.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Show more indicator */}
      {visibleAlerts.length > 3 && (
        <Card className="shadow-lg bg-gray-50">
          <CardContent className="p-3 text-center">
            <span className="text-sm text-gray-600">
              +{visibleAlerts.length - 3} more alert{visibleAlerts.length - 3 !== 1 ? 's' : ''}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}