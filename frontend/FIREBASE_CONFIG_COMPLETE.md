# 🔥 Complete Firebase Configuration Guide

## 📋 Your Firebase Credentials

From your `.env` file, you have:
- Project ID: `chhif-database`
- Storage Bucket: `chhif-database.firebasestorage.app`
- Auth Domain: `chhif-database.firebaseapp.com`

## 🎯 What You Need to Do

### Step 1: Get Firebase Web App Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **chhif-database**
3. Click ⚙️ **Project Settings**
4. Scroll down to **"Your apps"** section
5. If you see a web app, click on it
6. If not, click **"Add app"** > **Web** (</> icon)
7. Register app (name it "Campus Connect Web" or similar)
8. Copy the config values

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "chhif-database.firebaseapp.com",
  projectId: "chhif-database",
  storageBucket: "chhif-database.firebasestorage.app",
  messagingSenderId: "98533078449",
  appId: "1:98533078449:web:e644e8f98d1162ebcf3990"
};
```

### Step 2: Add Android App to Firebase

1. In Firebase Console > Project Settings
2. Scroll to **"Your apps"** section
3. Click **"Add app"** > **Android** (Android icon)
4. **Package name:** `com.example.campus_connect`
   - (This matches your `android/app/build.gradle.kts` file)
5. Click **Register app**
6. **Download `google-services.json`**
7. **Place file in:** `android/app/google-services.json`

### Step 3: Update Flutter Firebase Config

Edit `lib/config/firebase_config.dart`:

Replace with your actual values from Step 1:

```dart
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    return const FirebaseOptions(
      apiKey: 'YOUR_FIREBASE_API_KEY', // From web app config
      appId: '1:98533078449:web:e644e8f98d1162ebcf3990', // From web app config
      messagingSenderId: '98533078449', // From web app config
      projectId: 'chhif-database',
      storageBucket: 'chhif-database.firebasestorage.app',
      authDomain: 'chhif-database.firebaseapp.com',
    );
  }
}
```

**Note:** For Android, you might need Android-specific `appId`. Check Firebase Console after adding Android app.

### Step 4: Verify Files

Make sure you have:
- ✅ `android/app/google-services.json` (downloaded from Firebase)
- ✅ `lib/config/firebase_config.dart` (updated with your values)
- ✅ `android/build.gradle.kts` (updated - I'll do this)
- ✅ `android/app/build.gradle.kts` (updated - I'll do this)

---

## ✅ Android Gradle Files Updated

I've updated:
- ✅ `android/build.gradle.kts` - Added Google Services plugin
- ✅ `android/app/build.gradle.kts` - Applied Google Services plugin

**Next:** Download `google-services.json` and place it in `android/app/`

---

## 📱 Physical Device Setup

See `PHYSICAL_DEVICE_SETUP.md` for complete guide.

**Quick steps:**
1. Enable USB Debugging on phone
2. Connect phone via USB
3. Run `flutter devices` to verify
4. Update API URL to your computer's IP
5. Run `flutter run`

---

## 🎯 Complete Checklist

- [ ] Get Firebase web app config from Console
- [ ] Add Android app in Firebase Console
- [ ] Download `google-services.json`
- [ ] Place in `android/app/google-services.json`
- [ ] Update `lib/config/firebase_config.dart` with your values
- [ ] Enable USB Debugging on phone
- [ ] Connect phone via USB
- [ ] Find computer's IP address
- [ ] Update `api_config.dart` with IP address
- [ ] Run `flutter run`

---

## 🚀 After Configuration

Once everything is set up:
1. Backend running: `npm run dev` in backend folder
2. Phone connected and detected
3. API URL updated with computer's IP
4. Firebase configured
5. Run: `flutter run`

Your app will install and launch on your physical device! 📱

