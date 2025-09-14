# RapidAPI Integration Setup

This document explains how to set up RapidAPI integration for live Indian Railway train tracking.

## Prerequisites

1. **RapidAPI Account**: Sign up at [https://rapidapi.com](https://rapidapi.com)
2. **Indian Railway API**: Subscribe to the Indian Railway Live Train Status API

## API Setup

### 1. Get Your API Key

1. Go to [RapidAPI Indian Railway API](https://rapidapi.com/irctc1/api/irctc1)
2. Subscribe to the API (choose a plan that fits your needs)
3. Copy your API key from the dashboard

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```env
# RapidAPI Configuration
VITE_RAPIDAPI_KEY=your_rapidapi_key_here

# Optional: Other API configurations
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=wss://your-server.com
```

### 3. API Endpoints Used

The integration uses the following RapidAPI endpoints:

- **Live Train Status**: `POST /api/v1/liveTrainStatus`
  - Input: `{ trainNo: string, date: string }`
  - Output: Train location, status, delay, speed, next station

### 4. Station Database

The system includes a comprehensive database of Indian Railway stations with:
- Station codes (e.g., NDLS, MMCT, MAS)
- Station names
- GPS coordinates (lat/lng)
- State and zone information
- Station categories (A1, A, B, C, D, E, F)

## Features

### Live Train Tracking
- **Real-time Status**: Get current train location, speed, and status
- **Station Mapping**: Automatically map station codes to GPS coordinates
- **Delay Information**: Display train delays and ETA
- **Status Updates**: Show if train is running, delayed, or stopped

### Map Integration
- **GIS Maps**: Interactive maps using OpenStreetMap tiles
- **Train Markers**: Show train location with real-time updates
- **Station Markers**: Display current and next stations
- **Fullscreen Mode**: Expand map to full screen for detailed view

### Error Handling
- **API Quota**: Graceful handling when API quota is exceeded
- **Invalid Trains**: Clear error messages for invalid train numbers
- **Network Issues**: Fallback to simulation mode when API is unavailable
- **Configuration**: Helpful setup instructions when API key is missing

## Usage

### 1. Select a Train
- Choose a train from the train selection list
- The system will automatically fetch live status if API is configured

### 2. View Live Map
- Navigate to "Railway Network Map" section
- See real-time train location on the map
- Click "Fullscreen Map" for detailed view

### 3. Refresh Data
- Use the "Refresh Status" button to get latest train information
- Data updates automatically when switching between trains

## API Response Format

```typescript
interface TrainStatusResponse {
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
    delay: number; // minutes
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
```

## Troubleshooting

### Common Issues

1. **"RapidAPI not configured" Error**
   - Ensure `VITE_RAPIDAPI_KEY` is set in your `.env` file
   - Restart the development server after adding the key

2. **"API quota exceeded" Error**
   - Check your RapidAPI subscription limits
   - Wait for quota reset or upgrade your plan

3. **"Train number not found" Error**
   - Verify the train number is correct
   - Some trains may not be available in the API

4. **Map not showing train location**
   - Check if the station code is in our database
   - Verify GPS coordinates are valid

### Debug Mode

Enable debug logging by opening browser console to see:
- API request/response details
- Station mapping information
- Error details and stack traces

## Security Notes

- **API Key Security**: Never commit your API key to version control
- **Environment Variables**: Use `.env` file for local development
- **Production**: Use secure environment variable management in production

## Cost Considerations

- **Free Tier**: Limited requests per month
- **Paid Plans**: Higher limits and better reliability
- **Caching**: Consider implementing response caching to reduce API calls

## Support

For issues related to:
- **RapidAPI**: Contact RapidAPI support
- **Indian Railway Data**: Check API documentation
- **This Integration**: Check the project's GitHub issues

