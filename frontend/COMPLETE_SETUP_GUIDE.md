# 🚀 Complete Setup Guide - Physical Android Device

## ✅ Step-by-Step Instructions

### Step 1: Update Android Gradle Files ✅ (Done!)

I've already updated:
- ✅ `android/build.gradle.kts` - Added Google Services plugin
- ✅ `android/app/build.gradle.kts` - Applied Google Services plugin

### Step 2: Get Firebase Config

1. **Go to Firebase Console:**
   - https://console.firebase.google.com/
   - Select project: **chhif-database**

2. **Get Web App Config:**
   - Click ⚙️ **Project Settings**
   - Scroll to **"Your apps"** section
   - If you have a web app, click on it
   - If not, click **"Add app"** > **Web** (</>)
   - Copy the config values

3. **Add Android App:**
   - In same "Your apps" section
   - Click **"Add app"** > **Android** (Android icon)
   - **Package name:** `com.example.campus_connect`
   - Click **Register app**
   - **Download `google-services.json`**
   - **Place in:** `android/app/google-services.json`

### Step 3: Update Flutter Firebase Config

Edit `lib/config/firebase_config.dart`:

Replace with values from Firebase Console:

```dart
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    return const FirebaseOptions(
      apiKey: 'YOUR_FIREBASE_API_KEY', // From Firebase Console
      appId: '1:98533078449:android:xxxxx', // Android app ID from Console
      messagingSenderId: '98533078449', // From Firebase Console
      projectId: 'chhif-database',
      storageBucket: 'chhif-database.firebasestorage.app',
      authDomain: 'chhif-database.firebaseapp.com',
    );
  }
}
```

**Note:** After adding Android app, you'll get an Android-specific `appId`. Use that instead of web app ID.

### Step 4: Find Your Computer's IP Address

**Windows (PowerShell):**
```powershell
ipconfig
```

Look for:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Copy the IPv4 Address** (e.g., `192.168.1.100`)

### Step 5: Update API URL for Physical Device

Edit `lib/config/api_config.dart`:

```dart
// Change this line:
static const String baseUrl = physicalDeviceUrl;

// And update physicalDeviceUrl with your IP:
static const String physicalDeviceUrl = 'http://192.168.1.100:3000'; // Your IP here
```

### Step 6: Enable USB Debugging on Phone

1. **Enable Developer Options:**
   - Settings > About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Settings > Developer Options
   - Turn on "USB Debugging"
   - Turn on "Install via USB" (if available)

### Step 7: Connect Phone and Test

1. **Connect phone to computer via USB**
2. **On phone:** Tap "Allow USB debugging" when prompted
3. **Check connection:**
   ```bash
   flutter devices
   ```
   Should show your device!

4. **Make sure backend is running:**
   ```bash
   cd campus-connect/backend
   npm run dev
   ```

5. **Test API connection from phone:**
   - Open browser on phone
   - Go to: `http://YOUR_IP:3000/api/health`
   - Should return: `{"status":"ok",...}`

6. **Run Flutter app:**
   ```bash
   cd campus-connect/frontend
   flutter run
   ```

---

## 📋 Complete Checklist

- [ ] Android Gradle files updated ✅ (I did this)
- [ ] Get Firebase web app config from Console
- [ ] Add Android app in Firebase Console
- [ ] Download `google-services.json`
- [ ] Place in `android/app/google-services.json`
- [ ] Update `firebase_config.dart` with Firebase values
- [ ] Find computer's IP address (`ipconfig`)
- [ ] Update `api_config.dart` with IP address
- [ ] Enable USB Debugging on phone
- [ ] Connect phone via USB
- [ ] Verify: `flutter devices` shows your phone
- [ ] Start backend: `npm run dev`
- [ ] Test API from phone browser
- [ ] Run: `flutter run`

---

## 🔧 Quick Commands

```bash
# Find your IP (Windows)
ipconfig

# Check connected devices
flutter devices

# Run app on connected device
flutter run

# Check ADB devices
adb devices
```

---

## ⚠️ Important Notes

1. **Same Network:** Phone and computer must be on **same WiFi**
2. **Backend Running:** Must be running (`npm run dev`)
3. **IP Address:** Use computer's IP, not `localhost`
4. **Firewall:** May need to allow port 3000 in Windows Firewall

---

## ✅ After Setup

Once everything is configured:
1. Phone connected ✅
2. Backend running ✅
3. API URL updated ✅
4. Firebase configured ✅
5. Run `flutter run` ✅

Your app will install and launch on your physical device! 📱

---

## 🐛 Troubleshooting

### Device Not Detected
- Check USB debugging is enabled
- Try different USB cable/port
- Run `adb devices` to check

### API Connection Failed
- Check backend is running
- Check IP address is correct
- Check phone and computer on same WiFi
- Test in phone browser first

### Firebase Errors
- Check `google-services.json` is in `android/app/`
- Check `firebase_config.dart` has correct values
- Check Android app is added in Firebase Console

---

**You're all set! Follow the steps above and you'll be running on your physical device!** 🚀

