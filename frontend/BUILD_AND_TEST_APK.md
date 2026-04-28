# 📱 Build and Test APK Guide

## 🔧 Step 1: Clean and Rebuild

Before building a new APK, always clean the previous build:

```powershell
cd campus-connect/frontend
flutter clean
flutter pub get
```

## 📦 Step 2: Build APK

### Debug APK (for testing)
```powershell
flutter build apk --debug
```

### Release APK (for production)
```powershell
flutter build apk --release
```

The APK will be created at:
```
build/app/outputs/flutter-apk/app-debug.apk
```
or
```
build/app/outputs/flutter-apk/app-release.apk
```

## 📲 Step 3: Install APK on Device

### Method 1: Using ADB (if device is connected)
```powershell
adb install build/app/outputs/flutter-apk/app-debug.apk
```

### Method 2: Transfer via USB/Email
1. Copy the APK file to your phone
2. Enable "Install from Unknown Sources" in Android settings
3. Open the APK file and install

## 🧪 Step 4: Test API Connection

### Option 1: Use Debug Screen (Recommended)

1. **Add debug route** to your router (temporarily for testing)
2. Navigate to the debug screen in the app
3. Test each endpoint:
   - Health Check
   - Version Info
   - Config

### Option 2: Check Logs

1. Connect device via USB
2. Run: `adb logcat | grep -E "API|Dio|Error"`
3. Try to login
4. Check the logs for:
   - Full URL being called
   - Response status codes
   - Error messages

## 🔍 Step 5: Verify API Configuration

Before building, verify `lib/config/api_config.dart`:

```dart
// Should be set to production URL
static const String baseUrl = productionBaseUrl; // ✅

// Should use versioned endpoints
static const String authLogin = '/api/v1/auth/login'; // ✅
```

## 🐛 Troubleshooting

### Issue: 404 Error on Login

**Check:**
1. ✅ API base URL is correct: `https://campus-connect-backend-wine.vercel.app`
2. ✅ Endpoints use `/api/v1/` prefix
3. ✅ Backend is deployed and accessible
4. ✅ Device has internet connection

**Solution:**
1. Check logs: `adb logcat | grep "API Request"`
2. Verify the full URL being called
3. Test the endpoint in browser first
4. Rebuild APK with latest code

### Issue: Connection Timeout

**Check:**
1. Device has internet connection
2. Backend URL is accessible from device
3. No firewall blocking HTTPS

**Solution:**
1. Test backend URL in device browser
2. Check network permissions in AndroidManifest.xml
3. Try using mobile data instead of Wi-Fi

### Issue: CORS Error

**Check:**
1. Backend CORS is configured for `*` or your domain
2. `FRONTEND_URL` environment variable in Vercel

**Solution:**
1. Verify Vercel environment variables
2. Redeploy backend if needed

## 📋 Pre-Build Checklist

- [ ] `api_config.dart` uses `productionBaseUrl`
- [ ] All endpoints use `/api/v1/` prefix
- [ ] Backend is deployed to Vercel
- [ ] Backend health check works: `https://campus-connect-backend-wine.vercel.app/api/health`
- [ ] Code is clean: `flutter clean && flutter pub get`
- [ ] No linter errors: `flutter analyze`

## 🎯 Quick Test Commands

### Test Backend (from computer)
```powershell
# Health check
curl https://campus-connect-backend-wine.vercel.app/api/health

# Version info
curl https://campus-connect-backend-wine.vercel.app/api/version

# Config
curl https://campus-connect-backend-wine.vercel.app/api/v1/config
```

### Test from Device Browser
1. Open browser on device
2. Navigate to: `https://campus-connect-backend-wine.vercel.app/api/health`
3. Should see JSON response

### View App Logs
```powershell
# All logs
adb logcat

# Filter API calls
adb logcat | grep -E "API Request|API Response|API Error"

# Filter errors only
adb logcat | grep -E "Error|Exception|404|500"
```

## ✅ Success Indicators

When everything works:
- ✅ Health check returns `{"status":"ok"}`
- ✅ Login endpoint returns user data or proper error
- ✅ No 404 errors in logs
- ✅ API requests show correct URLs in logs

## 🔄 Rebuild After Code Changes

Every time you change API configuration:
1. `flutter clean`
2. `flutter pub get`
3. `flutter build apk --debug`
4. Uninstall old app
5. Install new APK
6. Test again

