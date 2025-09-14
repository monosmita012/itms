# 📊 Setup Process Flow

## Visual Setup Guide

```
┌─────────────────────────────────────────────────────────────────┐
│                    🚀 RAPIDAPI SETUP FLOW                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: Account Setup
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Create        │───▶│   Subscribe     │───▶│   Get API       │
│   RapidAPI      │    │   to Railway    │    │   Key           │
│   Account       │    │   API           │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Step 2: Project Configuration
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Create        │───▶│   Add API Key   │───▶│   Install       │
│   .env file     │    │   to .env       │    │   Dependencies  │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Step 3: Start Application
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Run           │───▶│   Check         │───▶│   Test          │
│   npm run dev   │    │   Status Badge  │    │   Features      │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Step 4: Verification
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Select        │───▶│   View Live     │───▶│   Test          │
│   Train         │    │   Map           │    │   Fullscreen    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Status Indicators

```
┌─────────────────────────────────────────────────────────────────┐
│                        STATUS BADGES                            │
└─────────────────────────────────────────────────────────────────┘

✅ SUCCESS INDICATORS:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🟢 LIVE API   │    │   🟢 Train      │    │   🟢 Map        │
│   MONITORING    │    │   Data Loaded   │    │   Interactive   │
└─────────────────┘    └─────────────────┘    └─────────────────┘

⚠️  WARNING INDICATORS:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🟡 SIMULATION │    │   🟡 Loading    │    │   🟡 Partial    │
│   MODE          │    │   Data...       │    │   Data          │
└─────────────────┘    └─────────────────┘    └─────────────────┘

❌ ERROR INDICATORS:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🔴 API ERROR  │    │   🔴 QUOTA      │    │   🔴 NETWORK    │
│   CONFIGURED    │    │   EXCEEDED      │    │   ERROR         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗂️ File Structure

```
Indigenous Track Monitoring Dashboard/
├── 📁 src/
│   ├── 📁 services/
│   │   └── 📄 rapidApiService.ts          ← API Integration
│   ├── 📁 data/
│   │   └── 📄 indianStations.ts           ← Station Database
│   ├── 📁 components/
│   │   └── 📄 LiveMap.tsx                 ← Map Component
│   ├── 📁 config/
│   │   └── 📄 api.ts                      ← Configuration
│   └── 📄 App.tsx                         ← Main App
├── 📄 .env                                ← API Key (CREATE THIS)
├── 📄 package.json                        ← Dependencies
└── 📄 SETUP_GUIDE.md                     ← This Guide
```

## 🔧 Quick Commands

```bash
# 1. Install Dependencies
npm install leaflet react-leaflet

# 2. Create Environment File
echo "VITE_RAPIDAPI_KEY=your_key_here" > .env

# 3. Start Development Server
npm run dev

# 4. Check Status
# Look for "LIVE API MONITORING" badge in browser
```

## 🎯 Testing Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                      TESTING CHECKLIST                         │
└─────────────────────────────────────────────────────────────────┘

□ RapidAPI account created
□ API subscription active
□ API key copied to .env file
□ Dependencies installed
□ Development server running
□ "LIVE API MONITORING" badge visible
□ Train selection working
□ Live map displaying train location
□ Fullscreen map working
□ Refresh button functional
□ No console errors
□ Station data loading correctly
```

## 🚨 Common Error Flow

```
┌─────────────────┐
│   Error Found   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check Console   │
│ for Error Msg   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Match Error to  │
│ Troubleshooting │
│ Guide           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Apply Fix       │
└─────────────────┘
```

## 📱 Browser Compatibility

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ✅ Chrome     │    │   ✅ Firefox    │    │   ✅ Safari     │
│   (Recommended) │    │   (Supported)   │    │   (Supported)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐
│   ✅ Edge       │    │   ❌ IE         │
│   (Supported)   │    │   (Not Supported)│
└─────────────────┘    └─────────────────┘
```

## 🔄 Data Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Selects  │───▶│   API Call to   │───▶│   Station Data  │
│   Train         │    │   RapidAPI      │    │   Retrieved     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Map Updates   │◀───│   GPS Coords    │◀───│   Data          │
│   with Location │    │   Mapped        │    │   Transformed   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

**🎉 Success!** Once you see the green "LIVE API MONITORING" badge and can select trains to view on the live map, your setup is complete!
