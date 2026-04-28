# ⚡ Quick Start - Physical Android Device

## 🎯 5-Minute Setup

### 1. Get Firebase Config (2 min)

1. Go to: https://console.firebase.google.com/
2. Select: **chhif-database**
3. ⚙️ **Project Settings** > **Your apps**
4. **Add Android app** (if not exists)
   - Package: `com.example.campus_connect`
5. **Download `google-services.json`**
6. **Place in:** `android/app/google-services.json`

### 2. Update Firebase Config (1 min)

Edit `lib/config/firebase_config.dart`:

Get values from Firebase Console > Project Settings > Your apps > Android app

```dart
return const FirebaseOptions(
  apiKey: 'YOUR_API_KEY', // From Firebase Console
  appId: 'YOUR_ANDROID_APP_ID', // From Android app config
  messagingSenderId: '98533078449',
  projectId: 'chhif-database',
  storageBucket: 'chhif-database.firebasestorage.app',
  authDomain: 'chhif-database.firebaseapp.com',
);
```

### 3. Find Your IP (30 sec)

```powershell
ipconfig
```

Copy IPv4 Address (e.g., `192.168.1.100`)

### 4. Update API URL (30 sec)

Edit `lib/config/api_config.dart`:

```dart
static const String physicalDeviceUrl = 'http://192.168.1.100:3000'; // Your IP
static const String baseUrl = physicalDeviceUrl;
```

### 5. Connect Phone (1 min)

1. **Enable USB Debugging:**
   - Settings > About Phone > Tap "Build Number" 7 times
   - Settings > Developer Options > USB Debugging ON

2. **Connect via USB**
3. **Allow USB debugging** on phone

4. **Verify:**
   ```bash
   flutter devices
   ```

### 6. Run! (30 sec)

```bash
# Make sure backend is running
cd campus-connect/backend
npm run dev

# In another terminal
cd campus-connect/frontend
flutter run
```

---

## ✅ Done!

Your app will install and launch on your phone! 📱

---

## 🐛 Quick Fixes

**Device not showing?**
```bash
adb devices
adb kill-server
adb start-server
```

**API not connecting?**
- Check backend is running
- Check IP is correct
- Test: `http://YOUR_IP:3000/api/health` on phone browser

**Firebase errors?**
- Check `google-services.json` is in `android/app/`
- Check `firebase_config.dart` has correct values

---

**That's it! You're ready to test on your physical device!** 🚀

