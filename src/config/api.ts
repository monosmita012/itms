// TypeScript types for Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_RAPIDAPI_KEY: string
}

// Extend the global ImportMeta interface
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

// API Configuration for Train Location Updates
export const API_CONFIG = {
  // Base URL for your API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  
  // WebSocket URL for real-time updates
  WS_URL: import.meta.env.VITE_WS_URL || 'wss://your-server.com',
  
  // RapidAPI Configuration
  RAPIDAPI_KEY: import.meta.env.VITE_RAPIDAPI_KEY || '',
  
  // API Endpoints
  ENDPOINTS: {
    // Get current location of a specific train
    TRAIN_LOCATION: (trainId: string) => `/api/trains/${trainId}/location`,
    
    // Get all trains with their current locations
    ALL_TRAINS: '/api/trains',
    
    // Get train details including route
    TRAIN_DETAILS: (trainId: string) => `/api/trains/${trainId}`,
  },
  
  // WebSocket Endpoints
  WS_ENDPOINTS: {
    // Real-time location updates for a specific train
    TRAIN_LOCATION: (trainId: string) => `/ws/trains/${trainId}`,
    
    // Real-time updates for all trains
    ALL_TRAINS: '/ws/trains',
  },
  
  // Polling interval (in milliseconds) - used as fallback when WebSocket is not available
  POLLING_INTERVAL: 3000,
  
  // Request timeout (in milliseconds)
  REQUEST_TIMEOUT: 5000,
};

// Expected API Response Format
export interface TrainLocationResponse {
  lat: number;
  lng: number;
  chainage?: string;
  speedKmph?: number;
  status?: string;
  nextStation?: string;
  eta?: string;
  timestamp?: string;
}

// WebSocket Message Format
export interface WebSocketMessage {
  type: 'location_update' | 'status_update' | 'error';
  trainId: string;
  data: TrainLocationResponse;
  timestamp: string;
}

// API Configuration Status
export interface ApiConfigStatus {
  isConfigured: boolean;
  hasApiKey: boolean;
  baseUrl: string;
  rapidApiKey: string;
}

// Utility functions for API configuration
export const getApiConfigStatus = (): ApiConfigStatus => {
  return {
    isConfigured: !!import.meta.env.VITE_RAPIDAPI_KEY,
    hasApiKey: !!import.meta.env.VITE_RAPIDAPI_KEY,
    baseUrl: API_CONFIG.BASE_URL,
    rapidApiKey: API_CONFIG.RAPIDAPI_KEY
  };
};

// Validate API configuration
export const validateApiConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!import.meta.env.VITE_RAPIDAPI_KEY) {
    errors.push('VITE_RAPIDAPI_KEY is not configured');
  }
  
  if (import.meta.env.VITE_API_BASE_URL && !isValidUrl(import.meta.env.VITE_API_BASE_URL)) {
    errors.push('VITE_API_BASE_URL is not a valid URL');
  }
  
  if (import.meta.env.VITE_WS_URL && !isValidUrl(import.meta.env.VITE_WS_URL)) {
    errors.push('VITE_WS_URL is not a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to validate URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
