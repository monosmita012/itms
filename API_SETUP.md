# API Setup for Real-Time Train Tracking

This document explains how to set up the backend API to provide real-time GPS coordinates for train tracking.

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=wss://your-server.com
```

## API Endpoints Required

### 1. GET `/api/trains/{trainId}/location`

Returns the current location of a specific train.

**Response Format:**
```json
{
  "lat": 26.44983,
  "lng": 80.33177,
  "chainage": "441.25",
  "speedKmph": 102,
  "status": "On Time",
  "nextStation": "Kanpur Central",
  "eta": "14:25",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. WebSocket `/ws/trains/{trainId}`

Real-time location updates for a specific train.

**Message Format:**
```json
{
  "type": "location_update",
  "trainId": "12001",
  "data": {
    "lat": 26.44983,
    "lng": 80.33177,
    "chainage": "441.25",
    "speedKmph": 102,
    "status": "On Time",
    "nextStation": "Kanpur Central",
    "eta": "14:25",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Backend Implementation Examples

### Node.js/Express Example

```javascript
const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Mock train data (replace with your database)
const trainLocations = {
  '12001': {
    lat: 26.4499,
    lng: 80.3319,
    chainage: '441.2',
    speedKmph: 130,
    status: 'On Time',
    nextStation: 'Kanpur Central',
    eta: '14:25'
  }
};

// API endpoint for train location
app.get('/api/trains/:trainId/location', (req, res) => {
  const { trainId } = req.params;
  const location = trainLocations[trainId];
  
  if (!location) {
    return res.status(404).json({ error: 'Train not found' });
  }
  
  res.json({
    ...location,
    timestamp: new Date().toISOString()
  });
});

// WebSocket for real-time updates
wss.on('connection', (ws, req) => {
  const trainId = req.url.split('/').pop();
  console.log(`Client connected for train ${trainId}`);
  
  // Send location updates every 3 seconds
  const interval = setInterval(() => {
    const location = trainLocations[trainId];
    if (location) {
      ws.send(JSON.stringify({
        type: 'location_update',
        trainId,
        data: {
          ...location,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }));
    }
  }, 3000);
  
  ws.on('close', () => {
    clearInterval(interval);
    console.log(`Client disconnected for train ${trainId}`);
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### Python/Flask Example

```python
from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import json
import time
from threading import Thread

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Mock train data
train_locations = {
    '12001': {
        'lat': 26.4499,
        'lng': 80.3319,
        'chainage': '441.2',
        'speedKmph': 130,
        'status': 'On Time',
        'nextStation': 'Kanpur Central',
        'eta': '14:25'
    }
}

@app.route('/api/trains/<train_id>/location')
def get_train_location(train_id):
    location = train_locations.get(train_id)
    if not location:
        return jsonify({'error': 'Train not found'}), 404
    
    return jsonify({
        **location,
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    })

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('join_train')
def handle_join_train(data):
    train_id = data.get('trainId')
    print(f'Client joined train {train_id}')
    
    # Send periodic updates
    def send_updates():
        while True:
            location = train_locations.get(train_id)
            if location:
                socketio.emit('location_update', {
                    'type': 'location_update',
                    'trainId': train_id,
                    'data': {
                        **location,
                        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
                    },
                    'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
                })
            time.sleep(3)
    
    Thread(target=send_updates).start()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=3001)
```

## Database Schema

If you're using a database, here's a suggested schema:

```sql
CREATE TABLE train_locations (
    id SERIAL PRIMARY KEY,
    train_id VARCHAR(50) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    chainage VARCHAR(20),
    speed_kmph INTEGER,
    status VARCHAR(50),
    next_station VARCHAR(100),
    eta TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_train_locations_train_id ON train_locations(train_id);
CREATE INDEX idx_train_locations_created_at ON train_locations(created_at);
```

## Testing

You can test the API using curl:

```bash
# Test API endpoint
curl http://localhost:3001/api/trains/12001/location

# Test WebSocket (using wscat)
npm install -g wscat
wscat -c ws://localhost:3001/ws/trains/12001
```

## Security Considerations

1. **Authentication**: Add JWT tokens or API keys for authentication
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **CORS**: Configure CORS properly for your domain
4. **HTTPS/WSS**: Use secure connections in production
5. **Input Validation**: Validate all input parameters

## Production Deployment

1. Use a reverse proxy (nginx) for load balancing
2. Implement proper logging and monitoring
3. Use a message queue (Redis/RabbitMQ) for scaling
4. Set up health checks and alerts
5. Use a CDN for static assets
