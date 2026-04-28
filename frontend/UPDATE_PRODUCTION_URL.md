# 🔄 Update Frontend to Use Production Backend

## 📋 After Deploying to Vercel

Once your backend is deployed to Vercel, you'll get a URL like:
```
https://campus-connect-backend.vercel.app
```

## ✅ Update Frontend Configuration

### Step 1: Update `lib/config/api_config.dart`

Replace the production URL:

```dart
class ApiConfig {
  // ... existing code ...
  
  // For production (update after deploying to Vercel)
  static const String productionBaseUrl = 'https://YOUR_VERCEL_URL.vercel.app';
  
  // Change this to use production
  static const String baseUrl = productionBaseUrl;
  
  // ... rest of code ...
}
```

### Step 2: Hot Restart App

Press **`R`** (capital R) in Flutter terminal, or:

```powershell
# Stop app (press 'q')
# Then restart
flutter run
```

### Step 3: Test Connection

1. Try to login/register
2. Should connect to Vercel backend now
3. No more connection timeout errors!

---

## 🔄 Switch Between Local and Production

You can easily switch:

```dart
// For local development
static const String baseUrl = physicalDeviceUrl;

// For production
static const String baseUrl = productionBaseUrl;
```

---

## ✅ Benefits of Production Backend

- ✅ No need for local network/IP configuration
- ✅ Works from anywhere (not just same WiFi)
- ✅ No firewall issues
- ✅ Always available (24/7)
- ✅ Better for testing on multiple devices

---

**After updating, your app will connect to the Vercel backend!** 🚀

