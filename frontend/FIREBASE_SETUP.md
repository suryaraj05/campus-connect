# 🔥 Firebase Setup Guide for Flutter

## 🎯 Quick Setup (Recommended)

### Using FlutterFire CLI

```bash
# 1. Install FlutterFire CLI
dart pub global activate flutterfire_cli

# 2. Configure Firebase
cd campus-connect/frontend
flutterfire configure
```

This will:
- Show your Firebase projects
- Let you select a project
- Generate config files automatically
- Update all necessary files

**That's it!** ✅

---

## 📋 Manual Setup (If CLI doesn't work)

### Step 1: Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **chhif-database**
3. Click the gear icon ⚙️ > **Project Settings**

### Step 2: Android Setup

1. **Add Android App:**
   - Click "Add app" > Android
   - Package name: `com.example.campus_connect` (or your package name)
   - Download `google-services.json`

2. **Place File:**
   - Copy `google-services.json` to: `android/app/google-services.json`

3. **Update `android/build.gradle`:**
   ```gradle
   buildscript {
       dependencies {
           classpath 'com.google.gms:google-services:4.4.0'
       }
   }
   ```

4. **Update `android/app/build.gradle`:**
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

### Step 3: iOS Setup

1. **Add iOS App:**
   - Click "Add app" > iOS
   - Bundle ID: `com.example.campusConnect` (or your bundle ID)
   - Download `GoogleService-Info.plist`

2. **Place File:**
   - Copy `GoogleService-Info.plist` to: `ios/Runner/GoogleService-Info.plist`

3. **Add to Xcode:**
   - Open `ios/Runner.xcworkspace` in Xcode
   - Drag `GoogleService-Info.plist` into Runner folder
   - Make sure "Copy items if needed" is checked

### Step 4: Update Flutter Config

Edit `lib/config/firebase_config.dart`:

```dart
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    return const FirebaseOptions(
      apiKey: 'YOUR_API_KEY',  // From Firebase Console
      appId: 'YOUR_APP_ID',    // From Firebase Console
      messagingSenderId: 'YOUR_SENDER_ID',
      projectId: 'chhif-database',
      storageBucket: 'chhif-database.appspot.com',
      authDomain: 'chhif-database.firebaseapp.com',
    );
  }
}
```

**Get these values from:**
- Firebase Console > Project Settings > General > Your apps

---

## ✅ Verify Setup

1. **Check files exist:**
   - ✅ `android/app/google-services.json`
   - ✅ `ios/Runner/GoogleService-Info.plist`

2. **Test:**
   ```bash
   flutter run
   ```

3. **Check logs:**
   - Should see: "Firebase initialized"
   - No errors about missing config

---

## 🐛 Troubleshooting

### "Firebase not initialized"
- Check config files are in correct locations
- Check `firebase_config.dart` has correct values
- Run `flutter clean` and try again

### "google-services.json not found"
- Make sure file is in `android/app/` folder
- Check file name is exactly `google-services.json`

### "GoogleService-Info.plist not found"
- Make sure file is in `ios/Runner/` folder
- Check it's added to Xcode project

---

## 📝 Quick Reference

**Android:**
- File: `android/app/google-services.json`
- Update: `android/build.gradle` and `android/app/build.gradle`

**iOS:**
- File: `ios/Runner/GoogleService-Info.plist`
- Add to Xcode project

**Flutter:**
- Config: `lib/config/firebase_config.dart`
- Use: `DefaultFirebaseOptions.currentPlatform`

---

## ✅ After Setup

Once Firebase is configured:
1. Update API URL in `api_config.dart`
2. Run: `flutter run`
3. Test authentication
4. Continue development!

