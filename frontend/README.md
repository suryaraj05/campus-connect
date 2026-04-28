# Campus Connect - Flutter App

Flutter mobile application for Campus Connect grievance management system.

## ✅ Current Status

- ✅ Dependencies installed (124 packages)
- ✅ Android/iOS folders created
- ✅ Project structure complete
- ✅ API service integrated
- ✅ All screens created (basic structure)
- ⏳ Firebase configuration (next step)
- ⏳ Screen implementations (in progress)

## 🚀 Quick Start

### 1. Install Dependencies (Already Done ✅)

```bash
flutter pub get
```

### 2. Configure Firebase

**Easiest Method:**
```bash
dart pub global activate flutterfire_cli
flutterfire configure
```

**Or Manual:** See `FIREBASE_SETUP.md`

### 3. Update API URL

Edit `lib/config/api_config.dart`:
- Android emulator: `http://10.0.2.2:3000`
- iOS simulator: `http://localhost:3000`
- Physical device: `http://YOUR_IP:3000`

### 4. Run App

```bash
flutter run
```

## 📁 Project Structure

```
lib/
├── config/              # Configuration
│   ├── api_config.dart      # API endpoints
│   ├── firebase_config.dart # Firebase config
│   ├── theme.dart           # App theme
│   └── departments.dart     # Constants (deprecated - use ConfigService)
├── models/              # Data models
│   ├── grievance.dart
│   └── ai_analysis.dart
├── routes/              # Navigation
│   └── app_router.dart
├── screens/             # UI screens
│   ├── landing/
│   ├── auth/
│   ├── home/
│   ├── grievance/
│   ├── map/
│   ├── notifications/
│   └── profile/
├── services/            # Services
│   ├── api_service.dart     # API client
│   └── config_service.dart  # Dynamic config
└── main.dart           # App entry
```

## 🔧 Features

- ✅ Dynamic configuration (departments, priorities, statuses from backend)
- ✅ API service (all 20 endpoints integrated)
- ✅ Firebase Auth integration
- ✅ Navigation with GoRouter
- ✅ Material 3 theme
- ⏳ Screen implementations (in progress)

## 📦 Dependencies

- `riverpod` - State management
- `dio` - HTTP client
- `firebase_core`, `firebase_auth`, `firebase_storage`, `cloud_firestore` - Firebase
- `flutter_map` - Maps (Leaflet alternative)
- `image_picker` - Image selection
- `geolocator` - Location services
- `go_router` - Navigation

## 🔗 Backend Integration

All API calls go through `ApiService` in `lib/services/api_service.dart`.

Base URL configured in `lib/config/api_config.dart`.

Dynamic config fetched from `/api/config` endpoint.

## 📝 Next Steps

1. Configure Firebase (see `FIREBASE_SETUP.md`)
2. Update API URL
3. Implement screen features
4. Add state management with Riverpod
5. Test all endpoints

## 🐛 Common Issues

### Symlink Warning
- Not critical, can be ignored
- Or enable Developer Mode in Windows Settings

### Firebase Not Configured
- Run `flutterfire configure`
- Or manually add config files

### API Connection Failed
- Check backend is running
- Check API URL is correct
- For Android emulator, use `10.0.2.2` instead of `localhost`

## 📚 Documentation

- `FIREBASE_SETUP.md` - Firebase configuration guide
- `NEXT_STEPS.md` - What to do after setup
- `CREATE_FLUTTER_PROJECT.md` - Project creation guide

## ✅ Ready to Develop!

All dependencies installed. Configure Firebase and start building! 🚀
