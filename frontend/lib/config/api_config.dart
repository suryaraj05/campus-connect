class ApiConfig {
  // Backend API Base URL
  // For local development
  static const String localBaseUrl = 'http://localhost:3000';
  
  // For Android Emulator (use 10.0.2.2 instead of localhost)
  static const String androidEmulatorUrl = 'http://10.0.2.2:3000';
  
  // For Physical Device (use your computer's IP address)
  // Your IP: 10.39.13.239 (from Wi-Fi adapter)
  static const String physicalDeviceUrl = 'http://10.39.13.239:3000';
  
  // For production (Vercel deployment)
  static const String productionBaseUrl = 'https://campus-connect-backend-wine.vercel.app';
  
  // Current base URL
  // Change this based on where you're running:
  // - localBaseUrl: iOS Simulator
  // - androidEmulatorUrl: Android Emulator
  // - physicalDeviceUrl: Physical Android Device (IP: 10.39.13.239)
  // - productionBaseUrl: Production ✅ (Vercel)
  static const String baseUrl = productionBaseUrl;
  
  // API Version
  static const String apiVersion = 'v1';
  
  // API Endpoints (versioned)
  static const String health = '/api/health'; // No versioning for health check
  static const String version = '/api/version'; // Version info endpoint
  static const String aiAnalyze = '/api/v1/ai/analyze';
  static const String aiCheckDuplicates = '/api/v1/ai/check-duplicates';
  static const String grievances = '/api/v1/grievances';
  static const String authRegister = '/api/v1/auth/register';
  static const String authLogin = '/api/v1/auth/login';
  static const String authMe = '/api/v1/auth/me';
  static const String notifications = '/api/v1/notifications';
  static const String locationMarkers = '/api/v1/location/markers';
  static const String locationGeocode = '/api/v1/location/geocode';
  static const String locationRoute = '/api/v1/location/route';
  static const String config = '/api/v1/config';
  static const String campusLocations = '/api/v1/campus-locations';
  static const String campusLocationsNearby = '/api/v1/campus-locations/nearby';
  static const String optimizeRoutes = '/api/v1/grievances/optimize-routes';
  static const String users = '/api/v1/users';
  
  // Timeout duration (increased for debugging)
  static const Duration connectTimeout = Duration(seconds: 60);
  static const Duration receiveTimeout = Duration(seconds: 60);
}

