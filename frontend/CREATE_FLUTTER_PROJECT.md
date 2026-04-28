# 🚀 Create Proper Flutter Project

## ⚠️ Important

The Flutter project structure was created manually, but you need a **proper Flutter project** with Android/iOS folders for Firebase configuration.

## ✅ Solution: Create Flutter Project Properly

### Option 1: Create New Flutter Project (Recommended)

1. **Delete the current frontend folder** (or rename it to `frontend_old`)

2. **Create new Flutter project:**
   ```bash
   cd campus-connect
   flutter create frontend
   ```

3. **Copy our files to the new project:**
   - Copy `lib/` folder from old to new
   - Copy `pubspec.yaml` (merge dependencies)
   - Copy other config files

### Option 2: Initialize Flutter in Existing Folder

```bash
cd campus-connect/frontend
flutter create .
```

This will add Android/iOS folders to existing project.

## 📱 After Creating Project

### 1. Configure Firebase

**For Android:**
1. Go to Firebase Console
2. Add Android app
3. Download `google-services.json`
4. Place in: `android/app/google-services.json`
5. Update `android/build.gradle`:
   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.4.0'
   }
   ```
6. Update `android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

**For iOS:**
1. Go to Firebase Console
2. Add iOS app
3. Download `GoogleService-Info.plist`
4. Place in: `ios/Runner/GoogleService-Info.plist`
5. Open Xcode and add file to project

### 2. Use FlutterFire CLI (Easiest)

```bash
cd frontend
flutter pub add firebase_core
flutterfire configure
```

This will:
- Detect your Firebase projects
- Generate config files
- Update all necessary files automatically

## 🔧 Quick Setup Commands

```bash
# Navigate to frontend
cd campus-connect/frontend

# Initialize Flutter project (if not done)
flutter create .

# Install dependencies
flutter pub get

# Configure Firebase (if you have FlutterFire CLI)
flutterfire configure

# Or manually add Firebase config files
# (see instructions above)
```

## ✅ After Setup

1. Update `lib/config/firebase_config.dart` with your Firebase config
2. Update `lib/config/api_config.dart` with your API URL
3. Run: `flutter run`

## 📝 Note

The files I created are still valid, but you need the Android/iOS folders for:
- Firebase configuration
- Building the app
- Running on devices

Run `flutter create .` in the frontend folder to add these folders!

