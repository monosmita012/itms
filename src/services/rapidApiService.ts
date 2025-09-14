// RapidAPI Indian Railway Live Train Status API Service
import { API_CONFIG, getApiConfigStatus, validateApiConfig } from '../config/api';

export interface RapidApiConfig {
  baseUrl: string;
  apiKey: string;
  host: string;
}

export interface TrainStatusResponse {
  success: boolean;
  data?: {
    train_number: string;
    train_name: string;
    current_station: {
      station_code: string;
      station_name: string;
      lat: number;
      lng: number;
    };
    next_station?: {
      station_code: string;
      station_name: string;
      lat: number;
      lng: number;
    };
    delay: number; // in minutes
    status: 'RUNNING' | 'STOPPED' | 'DELAYED' | 'ON_TIME';
    speed: number; // km/h
    eta: string; // HH:MM format
    last_updated: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface StationData {
  code: string;
  name: string;
  lat: number;
  lng: number;
  state: string;
  zone: string;
}

class RapidApiService {
  private config: RapidApiConfig;

  constructor() {
    this.config = {
      baseUrl: 'https://irctc1.p.rapidapi.com',
      apiKey: API_CONFIG.RAPIDAPI_KEY,
      host: 'irctc1.p.rapidapi.com'
    };
  }

  /**
   * Fetch live train status from RapidAPI
   */
  async getTrainStatus(trainNumber: string): Promise<TrainStatusResponse> {
    if (!this.config.apiKey) {
      throw new Error('RapidAPI key not configured. Please set VITE_RAPIDAPI_KEY in your .env file');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/liveTrainStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.config.apiKey,
          'X-RapidAPI-Host': this.config.host
        },
        body: JSON.stringify({
          trainNo: trainNumber,
          date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        if (response.status === 404) {
          throw new Error(`Train number ${trainNumber} not found or invalid.`);
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the response to our expected format
      return this.transformResponse(data, trainNumber);
    } catch (error) {
      console.error('RapidAPI Error:', error);
      throw error;
    }
  }

  /**
   * Transform RapidAPI response to our expected format
   */
  private transformResponse(apiResponse: any, trainNumber: string): TrainStatusResponse {
    try {
      // Handle different possible response structures
      if (apiResponse.success === false || !apiResponse.data) {
        return {
          success: false,
          error: {
            message: apiResponse.message || 'Train data not available',
            code: 'NO_DATA'
          }
        };
      }

      const data = apiResponse.data;
      
      return {
        success: true,
        data: {
          train_number: data.train_number || trainNumber,
          train_name: data.train_name || 'Unknown Train',
          current_station: {
            station_code: data.current_station?.code || data.station_code || '',
            station_name: data.current_station?.name || data.station_name || 'Unknown Station',
            lat: data.current_station?.lat || data.lat || 0,
            lng: data.current_station?.lng || data.lng || 0
          },
          next_station: data.next_station ? {
            station_code: data.next_station.code || '',
            station_name: data.next_station.name || '',
            lat: data.next_station.lat || 0,
            lng: data.next_station.lng || 0
          } : undefined,
          delay: data.delay || 0,
          status: this.mapStatus(data.status || data.train_status),
          speed: data.speed || 0,
          eta: data.eta || data.expected_arrival || '',
          last_updated: data.last_updated || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error transforming API response:', error);
      return {
        success: false,
        error: {
          message: 'Failed to parse train data',
          code: 'PARSE_ERROR'
        }
      };
    }
  }

  /**
   * Map API status to our status enum
   */
  private mapStatus(apiStatus: string): 'RUNNING' | 'STOPPED' | 'DELAYED' | 'ON_TIME' {
    const status = apiStatus?.toLowerCase() || '';
    
    if (status.includes('running') || status.includes('moving')) return 'RUNNING';
    if (status.includes('stopped') || status.includes('halted')) return 'STOPPED';
    if (status.includes('delayed') || status.includes('late')) return 'DELAYED';
    if (status.includes('on time') || status.includes('punctual')) return 'ON_TIME';
    
    return 'RUNNING'; // Default fallback
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Get API configuration status
   */
  getConfigStatus() {
    return getApiConfigStatus();
  }
}

// Export singleton instance
export const rapidApiService = new RapidApiService();

