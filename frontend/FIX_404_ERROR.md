# 🔧 Fix 404 Error on Login

## ✅ Backend is Deployed!

The backend has been successfully redeployed with versioned routes:
- **URL:** `https://campus-connect-backend-wine.vercel.app`
- **Versioned routes:** `/api/v1/*` are now live
- **Backward compatibility:** `/api/*` routes still work

## 🔄 Fix Steps

### Step 1: Hot Restart Flutter App

The Flutter app needs to be restarted to pick up the new API endpoints:

1. **Stop the app** (press `q` in terminal or stop from IDE)
2. **Clear build cache:**
   ```powershell
   cd campus-connect/frontend
   flutter clean
   flutter pub get
   ```
3. **Restart the app:**
   ```powershell
   flutter run
   ```

### Step 2: Verify API Configuration

Check that `lib/config/api_config.dart` has:
```dart
static const String baseUrl = productionBaseUrl; // ✅ Using Vercel
static const String authLogin = '/api/v1/auth/login'; // ✅ Versioned
```

### Step 3: Test the Endpoint

Test the login endpoint directly:

```bash
curl -X POST https://campus-connect-backend-wine.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"idToken": "test"}'
```

Expected response (even with invalid token):
```json
{
  "success": false,
  "message": "ID token is required" or "Invalid token"
}
```

If you get 404, the deployment might not have completed. Wait a minute and try again.

### Step 4: Check Network Logs

In Flutter, check the console output when you try to login. You should see:
- The full URL being called: `https://campus-connect-backend-wine.vercel.app/api/v1/auth/login`
- The response status code

## 🐛 Common Issues

### Issue 1: Still Getting 404

**Solution:** The deployment might still be propagating. Wait 1-2 minutes and try again.

### Issue 2: CORS Error

**Solution:** Make sure `FRONTEND_URL` environment variable in Vercel is set to `*` or your app's URL.

### Issue 3: Old Endpoints Still Cached

**Solution:** 
1. Uninstall the app from your device
2. Run `flutter clean`
3. Rebuild and reinstall

### Issue 4: Backend Not Responding

**Solution:** Check Vercel deployment logs:
```powershell
cd campus-connect/backend
vercel logs
```

## ✅ Verification Checklist

- [ ] Backend deployed to Vercel
- [ ] Flutter app restarted (hot restart or full restart)
- [ ] `api_config.dart` uses `productionBaseUrl`
- [ ] Endpoints use `/api/v1/` prefix
- [ ] Network request shows correct URL in logs
- [ ] Backend health check works: `https://campus-connect-backend-wine.vercel.app/api/health`

## 🎯 Quick Test

1. **Health Check:**
   ```
   https://campus-connect-backend-wine.vercel.app/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Version Info:**
   ```
   https://campus-connect-backend-wine.vercel.app/api/version
   ```
   Should return version information

3. **Config:**
   ```
   https://campus-connect-backend-wine.vercel.app/api/v1/config
   ```
   Should return departments, priorities, statuses

If all three work, the backend is fine. The issue is likely the Flutter app needs a restart.

