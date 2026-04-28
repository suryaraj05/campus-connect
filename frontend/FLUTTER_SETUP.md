# 🚀 Flutter App Setup Guide

## ✅ Flutter App Created!

The Flutter app structure has been created in `campus-connect/frontend/`

## 📁 Project Structure

```
frontend/
├── lib/
│   ├── config/
│   │   ├── api_config.dart          # API endpoints configuration
│   │   ├── firebase_config.dart     # Firebase configuration
│   │   ├── theme.dart               # App theme
│   │   └── departments.dart         # Department constants
│   ├── models/
│   │   ├── grievance.dart           # Grievance model
│   │   └── ai_analysis.dart         # AI analysis model
│   ├── routes/
│   │   └── app_router.dart          # Navigation routes
│   ├── screens/
│   │   ├── landing/                # Landing screen
│   │   ├── auth/                    # Login & Register
│   │   ├── home/                    # Home screen
│   │   ├── grievance/               # Grievance screens
│   │   ├── map/                     # Map screen
│   │   ├── notifications/           # Notifications
│   │   └── profile/                 # Profile
│   ├── services/
│   │   └── api_service.dart         # API service (all endpoints)
│   └── main.dart                    # App entry point
├── pubspec.yaml                     # Dependencies
└── README.md                        # Setup instructions
```

## 🚀 Quick Start

### 1. Install Flutter

If not installed:
- Download from [flutter.dev](https://flutter.dev)
- Add to PATH

### 2. Install Dependencies

```bash
cd campus-connect/frontend
flutter pub get
```

### 3. Configure Firebase

**Option A: Use Firebase CLI (Recommended)**
```bash
flutterfire configure
```

**Option B: Manual Setup**
1. Go to Firebase Console
2. Add Android/iOS app
3. Download config files:
   - Android: `google-services.json` → `android/app/`
   - iOS: `GoogleService-Info.plist` → `ios/Runner/`
4. Update `lib/config/firebase_config.dart` with your values

### 4. Update API URL

Edit `lib/config/api_config.dart`:

**For Android Emulator:**
```dart
static const String baseUrl = 'http://10.0.2.2:3000';
```

**For iOS Simulator:**
```dart
static const String baseUrl = 'http://localhost:3000';
```

**For Physical Device:**
```dart
static const String baseUrl = 'http://YOUR_COMPUTER_IP:3000';
// Find IP: ipconfig (Windows) or ifconfig (Mac/Linux)
```

**For Production:**
```dart
static const String baseUrl = 'https://your-app.vercel.app';
```

### 5. Run App

```bash
flutter run
```

## 📦 What's Included

### ✅ Complete API Service
- All 20 endpoints integrated
- Authentication handling
- Token management
- Error handling

### ✅ Screens Created
- Landing screen
- Login screen
- Register screen
- Home screen
- Grievance screens (placeholders)
- Map screen (placeholder)
- Notifications screen (placeholder)
- Profile screen (placeholder)

### ✅ Models
- Grievance model
- AI Analysis model

### ✅ Configuration
- API config
- Firebase config
- Theme configuration
- Department constants

## 🔧 Next Steps

1. **Complete Screen Implementations:**
   - Submit Grievance (with AI integration)
   - Grievance List (with filters)
   - Grievance Detail
   - Map with Leaflet
   - Notifications
   - Profile

2. **Add State Management:**
   - Create Riverpod providers
   - Manage app state
   - Handle loading/error states

3. **Integrate Features:**
   - AI analysis on image upload
   - Image picker and upload
   - Map markers display
   - Real-time notifications

## 🐛 Common Issues

### Android Emulator
- Use `10.0.2.2` instead of `localhost`
- Make sure backend is running

### iOS Simulator
- Use `localhost`
- May need to allow network access

### Physical Device
- Use your computer's IP address
- Make sure phone and computer are on same network
- Backend must be accessible from network

### Firebase
- Make sure config files are in correct locations
- Check Firebase project settings
- Enable Authentication in Firebase Console

## 📝 Notes

- All API endpoints are ready in `ApiService`
- Firebase Auth is integrated
- Navigation is set up with GoRouter
- Theme is configured
- Ready for feature implementation!

## ✅ Status

**Flutter App: 30% Complete**
- ✅ Project structure
- ✅ API service integration
- ✅ Basic screens
- ✅ Navigation
- ⏳ Screen implementations
- ⏳ State management
- ⏳ Feature integration

**Ready to continue development!** 🎉

