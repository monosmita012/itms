# 🚀 Complete Setup Guide: RapidAPI Indian Railway Integration

This comprehensive guide will walk you through setting up the RapidAPI integration for live Indian Railway train tracking in your dashboard.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js (v16 or higher) installed
- ✅ npm or yarn package manager
- ✅ A code editor (VS Code recommended)
- ✅ Internet connection for API access

## 🎯 Step 1: RapidAPI Account Setup

### 1.1 Create RapidAPI Account
1. Go to [https://rapidapi.com](https://rapidapi.com)
2. Click **"Sign Up"** in the top right corner
3. Choose your preferred signup method:
   - Email and password
   - Google account
   - GitHub account
4. Verify your email address if required

### 1.2 Subscribe to Indian Railway API
1. Navigate to [Indian Railway API](https://rapidapi.com/irctc1/api/irctc1)
2. Click **"Subscribe to Test"** or **"Subscribe to Basic"**
3. Choose your plan:
   - **Free**: 100 requests/month (good for testing)
   - **Basic**: 1,000 requests/month ($9.99/month)
   - **Pro**: 10,000 requests/month ($49.99/month)
4. Complete the subscription process

### 1.3 Get Your API Key
1. After subscribing, go to your [RapidAPI Dashboard](https://rapidapi.com/hub)
2. Click on **"My Apps"** in the left sidebar
3. Find your app or create a new one
4. Copy your **API Key** (starts with something like `abc123def456...`)

## 🔧 Step 2: Project Configuration

### 2.1 Create Environment File
1. In your project root directory, create a new file called `.env`
2. Add the following content:

```env
# RapidAPI Configuration
VITE_RAPIDAPI_KEY=your_actual_api_key_here

# Optional: Other API configurations
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=wss://your-server.com
```

**⚠️ Important**: Replace `your_actual_api_key_here` with your actual RapidAPI key from Step 1.3

### 2.2 Verify File Structure
Ensure your project has these files (they should already exist from our integration):
```
src/
├── services/
│   └── rapidApiService.ts
├── data/
│   └── indianStations.ts
├── components/
│   └── LiveMap.tsx
├── config/
│   └── api.ts
└── App.tsx
```

## 🚀 Step 3: Install Dependencies

### 3.1 Install Required Packages
Open your terminal in the project directory and run:

```bash
npm install leaflet react-leaflet
```

Or if you're using yarn:
```bash
yarn add leaflet react-leaflet
```

### 3.2 Verify Installation
Check that the packages are installed by looking at your `package.json`:
```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  }
}
```

## 🔄 Step 4: Start the Development Server

### 4.1 Start the Application
```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

### 4.2 Verify the Application
1. Open your browser and go to `http://localhost:5173` (or the port shown in terminal)
2. You should see the Indigenous Track Monitoring Dashboard
3. Check the top-right corner for the status badge:
   - **"LIVE API MONITORING"** (green) = API is configured correctly
   - **"SIMULATION MODE"** (yellow) = API key missing or invalid

## 🧪 Step 5: Test the Integration

### 5.1 Test Train Selection
1. Click on **"Train Selection"** in the sidebar
2. Select any train from the list (e.g., "New Delhi - Howrah Rajdhani Express")
3. The train should be highlighted and selected

### 5.2 Test Live Map
1. Click on **"Railway Network Map"** in the sidebar
2. You should see the LiveMap component with:
   - Train information at the top
   - Interactive map showing train location
   - API status indicators

### 5.3 Test Fullscreen Map
1. In the Railway Network Map section, click **"Fullscreen Map"**
2. The map should expand to full screen
3. Click **"Exit Fullscreen"** to return to normal view

### 5.4 Test Refresh Functionality
1. Click the **"Refresh Status"** button
2. You should see a loading spinner
3. The train status should update with latest data

## 🔍 Step 6: Troubleshooting

### 6.1 Common Issues and Solutions

#### Issue: "RapidAPI not configured" Error
**Symptoms**: Yellow "SIMULATION MODE" badge, error message in map area
**Solution**:
1. Check that `.env` file exists in project root
2. Verify `VITE_RAPIDAPI_KEY` is set correctly
3. Restart the development server
4. Ensure no extra spaces or quotes around the API key

#### Issue: "API quota exceeded" Error
**Symptoms**: Red error message, no data loading
**Solution**:
1. Check your RapidAPI dashboard for quota usage
2. Wait for quota reset (usually monthly)
3. Upgrade to a higher plan if needed

#### Issue: "Train number not found" Error
**Symptoms**: Error message when selecting certain trains
**Solution**:
1. Try different train numbers
2. Check if the train is currently running
3. Some trains may not be available in the API

#### Issue: Map not loading
**Symptoms**: Blank map area, console errors
**Solution**:
1. Check internet connection
2. Verify Leaflet CSS is loaded
3. Check browser console for errors

### 6.2 Debug Mode
Enable debug logging by opening browser console (F12):
- Look for API request/response details
- Check for error messages
- Verify station mapping information

## 📊 Step 7: Understanding the Features

### 7.1 Live Train Tracking
- **Current Station**: Shows where the train is now
- **Next Station**: Upcoming station
- **Speed**: Real-time speed in km/h
- **Delay**: Any delays in minutes
- **Status**: Running, delayed, stopped, on-time

### 7.2 Map Features
- **Train Marker**: Blue marker showing current location
- **Station Markers**: Yellow markers for stations
- **Interactive**: Click on map points for details
- **Zoom/Pan**: Standard map controls
- **Fullscreen**: Expand for detailed view

### 7.3 API Status Indicators
- **Green "Live API"**: API is working correctly
- **Yellow "Simulation"**: Using mock data
- **Red Error**: API issue or configuration problem

## 🔐 Step 8: Security Best Practices

### 8.1 Environment Variables
- ✅ Never commit `.env` file to version control
- ✅ Add `.env` to `.gitignore`
- ✅ Use different keys for development/production

### 8.2 API Key Management
- ✅ Keep your API key secure
- ✅ Don't share it in public repositories
- ✅ Rotate keys periodically
- ✅ Monitor usage in RapidAPI dashboard

## 📈 Step 9: Monitoring and Maintenance

### 9.1 Monitor API Usage
1. Check your RapidAPI dashboard regularly
2. Monitor quota usage and remaining requests
3. Set up alerts for quota limits

### 9.2 Performance Optimization
- The system caches station data locally
- API calls are made only when needed
- Fallback to simulation mode when API is unavailable

### 9.3 Regular Updates
- Keep dependencies updated
- Check for API changes
- Update station database if needed

## 🎉 Step 10: Success Verification

### 10.1 Complete Checklist
- [ ] RapidAPI account created and subscribed
- [ ] API key added to `.env` file
- [ ] Dependencies installed
- [ ] Development server running
- [ ] "LIVE API MONITORING" badge showing
- [ ] Train selection working
- [ ] Live map displaying train location
- [ ] Fullscreen map working
- [ ] Refresh functionality working
- [ ] No error messages in console

### 10.2 Test Different Scenarios
- [ ] Select different trains
- [ ] Test with and without internet
- [ ] Try fullscreen mode
- [ ] Test refresh button
- [ ] Check error handling

## 🆘 Getting Help

### Support Resources
1. **RapidAPI Documentation**: [API Docs](https://rapidapi.com/irctc1/api/irctc1)
2. **Project Issues**: Check GitHub issues
3. **Browser Console**: Look for error messages
4. **Network Tab**: Check API requests/responses

### Common Error Messages
- `"RapidAPI key not configured"` → Check `.env` file
- `"API quota exceeded"` → Check RapidAPI dashboard
- `"Train number not found"` → Try different train
- `"Network error"` → Check internet connection

## 🎯 Next Steps

Once everything is working:
1. **Explore Features**: Try different trains and map views
2. **Customize**: Modify the UI or add new features
3. **Deploy**: Set up production environment
4. **Monitor**: Keep track of API usage and performance

---

## 📞 Quick Reference

### Essential Files
- `.env` - API configuration
- `src/services/rapidApiService.ts` - API service
- `src/data/indianStations.ts` - Station database
- `src/components/LiveMap.tsx` - Map component

### Key Commands
```bash
npm run dev          # Start development server
npm install          # Install dependencies
```

### Important URLs
- [RapidAPI Dashboard](https://rapidapi.com/hub)
- [Indian Railway API](https://rapidapi.com/irctc1/api/irctc1)
- [Leaflet Documentation](https://leafletjs.com/)

---

**🎉 Congratulations!** You now have a fully functional live train tracking system with RapidAPI integration. The system will automatically fetch real-time train data and display it on interactive maps.
