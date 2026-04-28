# 🚀 Quick Fix for 404 Error in APK

## ✅ What I've Done

1. **Added detailed logging** - Now you'll see the exact URL being called in logs
2. **Improved error messages** - Better error handling in login screen
3. **Created debug screen** - Test API endpoints directly from the app
4. **Updated API service** - Logs all requests and responses

## 🔧 Steps to Fix

### Step 1: Rebuild APK with Latest Code

```powershell
cd campus-connect/frontend
flutter clean
flutter pub get
flutter build apk --debug
```

### Step 2: Install New APK

```powershell
# Uninstall old version first
adb uninstall com.surya.campusconnect

# Install new APK
adb install build/app/outputs/flutter-apk/app-debug.apk
```

### Step 3: Test API Connection

**Option A: Use Debug Screen**
1. Open the app
2. Navigate to: `/debug` (or add a button to access it)
3. Test each endpoint:
   - Health Check
   - Version Info  
   - Config

**Option B: Check Logs**
```powershell
# View all API calls
adb logcat | grep -E "API Request|API Response|API Error"

# Or view all logs
adb logcat
```

### Step 4: Verify What's Being Called

When you try to login, check the logs. You should see:
```
🌐 API Request: POST https://campus-connect-backend-wine.vercel.app/api/v1/auth/login
```

If you see a different URL, that's the problem!

## 🔍 Common Issues

### Issue 1: Old APK Still Installed
**Solution:** Uninstall completely and reinstall

### Issue 2: Wrong Base URL
**Check:** `lib/config/api_config.dart` should have:
```dart
static const String baseUrl = productionBaseUrl; // ✅
```

### Issue 3: Old Endpoints (No /v1/)
**Check:** `lib/config/api_config.dart` should have:
```dart
static const String authLogin = '/api/v1/auth/login'; // ✅
```

### Issue 4: Backend Not Deployed
**Check:** Test in browser:
```
https://campus-connect-backend-wine.vercel.app/api/v1/config
```

## 📱 Access Debug Screen

Add a temporary button in your login screen or home screen:

```dart
// In login_screen.dart or home_screen.dart
FloatingActionButton(
  onPressed: () => context.go('/debug'),
  child: Icon(Icons.bug_report),
)
```

Or navigate directly by typing `/debug` in your router.

## ✅ Success Checklist

- [ ] APK rebuilt with latest code
- [ ] Old app uninstalled
- [ ] New APK installed
- [ ] Debug screen accessible
- [ ] Logs show correct URL
- [ ] Health check works
- [ ] Login works

## 🎯 What to Look For in Logs

**Good (Correct):**
```
🌐 API Request: POST https://campus-connect-backend-wine.vercel.app/api/v1/auth/login
✅ API Response: 200 /api/v1/auth/login
```

**Bad (Wrong URL):**
```
🌐 API Request: POST http://10.39.13.239:3000/api/auth/login
❌ API Error: 404
```

**Bad (No /v1):**
```
🌐 API Request: POST https://campus-connect-backend-wine.vercel.app/api/auth/login
❌ API Error: 404
```

## 🚨 If Still Not Working

1. **Check logs** - What URL is actually being called?
2. **Test backend** - Does it work in browser?
3. **Check network** - Does device have internet?
4. **Verify config** - Is `api_config.dart` correct?
5. **Rebuild** - Did you clean before building?

The logs will tell you exactly what's wrong!

