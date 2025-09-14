# 🔧 Troubleshooting Guide

Quick solutions to common issues with the RapidAPI Indian Railway integration.

## 🚨 Quick Fixes

### Issue 1: "RapidAPI not configured" Error

**What you see:**
- Yellow "SIMULATION MODE" badge
- Error message: "RapidAPI not configured. Please set VITE_RAPIDAPI_KEY in your .env file"

**Quick Fix:**
1. Create `.env` file in project root (if not exists)
2. Add: `VITE_RAPIDAPI_KEY=your_api_key_here`
3. Restart development server: `npm run dev`

**Detailed Steps:**
```bash
# 1. Create .env file
touch .env

# 2. Add your API key
echo "VITE_RAPIDAPI_KEY=your_actual_key_here" >> .env

# 3. Restart server
npm run dev
```

---

### Issue 2: "API quota exceeded" Error

**What you see:**
- Red error message about quota exceeded
- No train data loading

**Quick Fix:**
1. Check RapidAPI dashboard for quota usage
2. Wait for monthly reset or upgrade plan
3. Use simulation mode as fallback

**Check Quota:**
1. Go to [RapidAPI Dashboard](https://rapidapi.com/hub)
2. Click on your app
3. Check "Usage" tab for remaining requests

---

### Issue 3: Map Not Loading

**What you see:**
- Blank white area where map should be
- Console errors about Leaflet

**Quick Fix:**
1. Check if Leaflet CSS is loaded
2. Verify internet connection
3. Clear browser cache

**Detailed Steps:**
```bash
# 1. Reinstall Leaflet
npm uninstall leaflet react-leaflet
npm install leaflet react-leaflet

# 2. Clear browser cache
# Press Ctrl+Shift+R (hard refresh)
```

---

### Issue 4: "Train number not found" Error

**What you see:**
- Error when selecting certain trains
- "Train number not found" message

**Quick Fix:**
1. Try different train numbers
2. Check if train is currently running
3. Some trains may not be in API database

**Working Train Numbers:**
- 12001 (Rajdhani Express)
- 12002 (Chennai Rajdhani)
- 12009 (Shatabdi Express)
- 16649 (Parasuram Express)

---

### Issue 5: Development Server Won't Start

**What you see:**
- Error when running `npm run dev`
- Port already in use error

**Quick Fix:**
```bash
# 1. Kill existing processes
npx kill-port 5173

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Start server
npm run dev
```

---

## 🔍 Debug Mode

### Enable Console Logging
1. Open browser console (F12)
2. Look for these messages:
   - `"RapidAPI Error:"` - API issues
   - `"Station found:"` - Station mapping
   - `"API request:"` - Request details

### Check Network Requests
1. Open DevTools (F12)
2. Go to "Network" tab
3. Look for requests to `rapidapi.com`
4. Check response status and data

### Verify Environment Variables
```javascript
// In browser console
console.log(import.meta.env.VITE_RAPIDAPI_KEY);
// Should show your API key (not undefined)
```

---

## 🛠️ Advanced Troubleshooting

### Issue: CORS Errors
**Solution:** This shouldn't happen with RapidAPI, but if it does:
1. Check if you're using the correct API endpoint
2. Verify your API key is valid
3. Try a different browser

### Issue: Slow API Responses
**Solution:**
1. Check your internet connection
2. Try during off-peak hours
3. Consider upgrading your RapidAPI plan

### Issue: Station Not Found
**Solution:**
1. Check if station code is in our database
2. Try alternative station names
3. Verify GPS coordinates are valid

---

## 📋 Pre-Flight Checklist

Before reporting issues, check:

- [ ] `.env` file exists in project root
- [ ] `VITE_RAPIDAPI_KEY` is set correctly
- [ ] No extra spaces or quotes around API key
- [ ] Development server restarted after adding API key
- [ ] Internet connection is working
- [ ] Browser console shows no errors
- [ ] RapidAPI account is active
- [ ] API quota not exceeded

---

## 🆘 Still Having Issues?

### Check These Files:
1. **`.env`** - API configuration
2. **`src/services/rapidApiService.ts`** - API service
3. **`src/data/indianStations.ts`** - Station database
4. **Browser Console** - Error messages

### Common Mistakes:
- ❌ API key in wrong file location
- ❌ Missing `VITE_` prefix in environment variable
- ❌ Not restarting server after adding API key
- ❌ Using wrong train numbers
- ❌ API key has expired or is invalid

### Get Help:
1. Check browser console for specific errors
2. Verify API key in RapidAPI dashboard
3. Test with different train numbers
4. Try in incognito/private browsing mode

---

## 🎯 Success Indicators

You know it's working when you see:
- ✅ Green "LIVE API MONITORING" badge
- ✅ Train information displayed in map area
- ✅ Interactive map with train marker
- ✅ "Refresh Status" button works
- ✅ No error messages in console
- ✅ Fullscreen map expands correctly

---

**💡 Pro Tip:** Always check the browser console first - it usually tells you exactly what's wrong!
