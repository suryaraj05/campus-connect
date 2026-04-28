# 🚀 Flutter Integration Guide

## ✅ Backend Status: 100% Ready!

All 20 API endpoints are built and ready for Flutter integration.

---

## 📡 API Base URL

**Local Development:**
```
http://localhost:3000
```

**Production (Vercel):**
```
https://your-app.vercel.app
```

---

## 🔑 Authentication Flow

### 1. User Registration/Login (Flutter)

```dart
// Using Firebase Auth in Flutter
final userCredential = await FirebaseAuth.instance.signInWithEmailAndPassword(
  email: email,
  password: password,
);

// Get ID token
final idToken = await userCredential.user?.getIdToken();

// Send to backend
final response = await http.post(
  Uri.parse('$baseUrl/api/auth/login'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({'idToken': idToken}),
);
```

### 2. Store Token

```dart
// Save token for future requests
await storage.write(key: 'auth_token', value: idToken);
```

### 3. Use Token in Requests

```dart
final token = await storage.read(key: 'auth_token');
final response = await http.get(
  Uri.parse('$baseUrl/api/grievances'),
  headers: {
    'Authorization': 'Bearer $token',
    'Content-Type': 'application/json',
  },
);
```

---

## 📋 API Endpoints for Flutter

### 1. AI Analysis

```dart
POST /api/ai/analyze
Body: {
  "title": "string",
  "description": "string",
  "images": ["base64_string"]
}
Response: {
  "success": true,
  "data": {
    "suggestedTitle": "...",
    "suggestedDescription": "...",
    "suggestedDepartments": ["..."],
    "suggestedPriority": "high",
    "suggestedLocation": "...",
    "confidence": 0.95
  }
}
```

### 2. Create Grievance

```dart
POST /api/grievances
Headers: Authorization: Bearer {token}
Body: {
  "title": "string",
  "description": "string",
  "departments": ["Water Department"],
  "priority": "high",
  "location": "string",
  "images": ["base64_string"],
  "contactPhone": "string"
}
```

### 3. Get Grievances

```dart
GET /api/grievances?department=Water Department&status=submitted
Headers: Authorization: Bearer {token}
```

### 4. Get Map Markers

```dart
GET /api/location/markers?status=submitted
Headers: Authorization: Bearer {token}
Response: {
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "location": "...",
      "priority": "high",
      "status": "submitted",
      "departments": ["Water Department"]
    }
  ]
}
```

---

## 🗺️ Leaflet Integration in Flutter

### Install Package

```yaml
dependencies:
  flutter_map: ^6.0.0
  latlong2: ^0.8.1
```

### Display Map

```dart
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

FlutterMap(
  options: MapOptions(
    center: LatLng(17.3850, 78.4867), // Your campus coordinates
    zoom: 15.0,
  ),
  children: [
    TileLayer(
      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      userAgentPackageName: 'com.example.campus_connect',
    ),
    MarkerLayer(
      markers: [
        // Add markers from API
        Marker(
          point: LatLng(lat, lng),
          builder: (ctx) => Icon(Icons.location_on, color: Colors.red),
        ),
      ],
    ),
  ],
)
```

### Get Markers from API

```dart
Future<List<Marker>> getMarkers() async {
  final response = await http.get(
    Uri.parse('$baseUrl/api/location/markers'),
    headers: {'Authorization': 'Bearer $token'},
  );
  
  final data = jsonDecode(response.body)['data'];
  return data.map<Marker>((marker) {
    // Parse location string or use coordinates
    return Marker(
      point: LatLng(marker['lat'], marker['lng']),
      builder: (ctx) => Icon(Icons.location_on),
    );
  }).toList();
}
```

---

## 📦 Recommended Flutter Packages

```yaml
dependencies:
  # HTTP
  dio: ^5.4.0
  
  # State Management
  riverpod: ^2.4.0
  
  # Firebase
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  firebase_storage: ^11.5.0
  cloud_firestore: ^4.13.0
  
  # Maps
  flutter_map: ^6.0.0
  latlong2: ^0.8.1
  
  # Image Picker
  image_picker: ^1.0.0
  
  # Storage
  shared_preferences: ^2.2.0
  
  # Location
  geolocator: ^10.1.0
```

---

## 🎯 Integration Checklist

- [ ] Setup Flutter project
- [ ] Install dependencies
- [ ] Setup Firebase in Flutter
- [ ] Create API service class
- [ ] Implement authentication flow
- [ ] Create grievance submission screen
- [ ] Integrate AI analysis
- [ ] Display grievances list
- [ ] Integrate Leaflet map
- [ ] Add notifications
- [ ] Test all endpoints

---

## ✅ Backend is Ready!

All endpoints are built, tested (where possible), and ready for Flutter integration.

**You can now start building the Flutter app!** 🚀

