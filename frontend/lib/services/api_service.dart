import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../config/api_config.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  late Dio _dio;
  String? _authToken;

  void init() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConfig.baseUrl,
        connectTimeout: ApiConfig.connectTimeout,
        receiveTimeout: ApiConfig.receiveTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add interceptors
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Log all requests for debugging
          final fullUrl = '${options.baseUrl}${options.path}';
          print('🌐 API Request: ${options.method} $fullUrl');
          if (options.data != null) {
            print('📦 Request Data: ${options.data}');
          }
          
          // Refresh token before each request if user is logged in
          await _refreshTokenFromFirebase();
          
          // Add auth token if available
          final token = _authToken; // Store in local variable for null safety
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
            print('🔑 Using auth token: ${token.substring(0, 20)}...');
          } else {
            print('⚠️ No auth token available');
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          print('✅ API Response: ${response.statusCode} ${response.requestOptions.path}');
          return handler.next(response);
        },
        onError: (error, handler) {
          // Log detailed error information
          final fullUrl = '${error.requestOptions.baseUrl}${error.requestOptions.path}';
          print('❌ API Error: ${error.type}');
          print('   URL: $fullUrl');
          print('   Status: ${error.response?.statusCode ?? 'N/A'}');
          print('   Message: ${error.message}');
          if (error.response?.data != null) {
            print('   Response: ${error.response?.data}');
          }
          
          // Handle errors
          if (error.response?.statusCode == 401) {
            // Token expired, clear and redirect to login
            clearAuthToken();
          }
          // Log connection errors for debugging
          if (error.type == DioExceptionType.connectionTimeout ||
              error.type == DioExceptionType.receiveTimeout) {
            print('⚠️ Connection timeout to: $fullUrl');
            print('   Make sure backend is running on: ${ApiConfig.baseUrl}');
          }
          return handler.next(error);
        },
      ),
    );

    // Load saved token
    _loadAuthToken();
  }

  Future<void> _loadAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    _authToken = prefs.getString('auth_token');
    // Also refresh token from Firebase if user is logged in
    await _refreshTokenFromFirebase();
  }

  Future<void> _refreshTokenFromFirebase() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        try {
          final idToken = await user.getIdToken(true); // Force refresh
          if (idToken != null && idToken.isNotEmpty) {
            _authToken = idToken;
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString('auth_token', idToken);
            print('✅ Token refreshed successfully');
          } else {
            print('⚠️ Got empty token from Firebase');
          }
        } catch (tokenError) {
          print('❌ Error getting token: $tokenError');
          // Try to get token without forcing refresh
          try {
            final idToken = await user.getIdToken(false);
            if (idToken != null && idToken.isNotEmpty) {
              _authToken = idToken;
              final prefs = await SharedPreferences.getInstance();
              await prefs.setString('auth_token', idToken);
              print('✅ Using cached token');
            }
          } catch (e) {
            print('❌ Error getting cached token: $e');
          }
        }
      } else {
        print('⚠️ No user logged in, cannot refresh token');
        _authToken = null;
      }
    } catch (e) {
      print('❌ Error refreshing token: $e');
    }
  }

  Future<void> setAuthToken(String token) async {
    _authToken = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<void> clearAuthToken() async {
    _authToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  // Health Check
  Future<Response> healthCheck() async {
    return await _dio.get(ApiConfig.health);
  }

  // AI Analysis
  Future<Response> analyzeGrievance({
    String? title,
    String? description,
    List<String> images = const [],
  }) async {
    return await _dio.post(
      ApiConfig.aiAnalyze,
      data: {
        'title': title ?? '',
        'description': description ?? '',
        'images': images,
      },
    );
  }

  // Check for duplicate grievances
  Future<Response> checkDuplicates({
    required String title,
    required String description,
    List<String> images = const [],
    double? latitude,
    double? longitude,
    List<Map<String, dynamic>> existingGrievances = const [],
  }) async {
    return await _dio.post(
      ApiConfig.aiCheckDuplicates,
      data: {
        'title': title,
        'description': description,
        'images': images,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
        'existingGrievances': existingGrievances,
      },
    );
  }

  // Auth
  Future<Response> register({
    required String idToken,
    required String displayName,
    required String role,
    String? department,
    String? phoneNumber,
  }) async {
    // Build data object - always include phoneNumber even if empty
    final data = {
      'idToken': idToken,
      'displayName': displayName,
      'role': role,
      'phoneNumber': phoneNumber ?? '', // Always send phoneNumber, even if empty
    };
    
    // Only add department if it's provided
    if (department != null && department.isNotEmpty) {
      data['department'] = department;
    }
    
    print('📤 [API] Register request: role=$role, department=$department, phoneNumber=${phoneNumber ?? ""}');
    
    return await _dio.post(
      ApiConfig.authRegister,
      data: data,
    );
  }

  Future<Response> login(String idToken) async {
    final response = await _dio.post(
      ApiConfig.authLogin,
      data: {'idToken': idToken},
    );
    
    // Save token if login successful
    if (response.data['success'] == true) {
      await setAuthToken(idToken);
    }
    
    return response;
  }

  Future<Response> getCurrentUser() async {
    return await _dio.get(ApiConfig.authMe);
  }

  Future<Response> updateProfile(Map<String, dynamic> updates) async {
    return await _dio.put(ApiConfig.authMe, data: updates);
  }

  // Grievances
  Future<Response> createGrievance({
    required String title,
    required String description,
    required List<String> departments,
    required String priority,
    String? location,
    List<String> images = const [],
    String? contactPhone,
    double? latitude,
    double? longitude,
  }) async {
    // Ensure we have a fresh token
    await _refreshTokenFromFirebase();
    
    final data = {
      'title': title.trim(),
      'description': description.trim(),
      'departments': departments,
      'priority': priority,
      'location': location?.trim() ?? '',
      'images': images,
      if (contactPhone != null && contactPhone.isNotEmpty) 'contactPhone': contactPhone.trim(),
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
    };
    
    print('📤 Creating grievance with data:');
    print('   Title: ${data['title']}');
    print('   Departments: ${data['departments']}');
    print('   Priority: ${data['priority']}');
    print('   Location: ${data['location']}');
    print('   Images count: ${images.length}');
    
    try {
      print('📤 Sending POST request to: ${ApiConfig.grievances}');
      print('📦 Request payload keys: ${data.keys.toList()}');
      print('📦 Request payload size: ${data.toString().length} bytes');
      
      final response = await _dio.post(
        ApiConfig.grievances,
        data: data,
      );
      print('✅ Grievance created successfully: ${response.statusCode}');
      print('📥 Response: ${response.data}');
      return response;
    } catch (e) {
      print('❌ Error creating grievance: $e');
      if (e is DioException) {
        print('   Error Type: ${e.type}');
        print('   Status: ${e.response?.statusCode}');
        print('   URL: ${e.requestOptions.baseUrl}${e.requestOptions.path}');
        print('   Request Data: ${e.requestOptions.data}');
        print('   Response Data: ${e.response?.data}');
        print('   Headers: ${e.requestOptions.headers}');
        
        // Log the full error for debugging
        if (e.response?.data != null) {
          print('   Full Error Response: ${e.response?.data}');
        }
      }
      rethrow; // Re-throw to let the caller handle it
    }
  }

  Future<Response> getGrievances({
    String? department,
    String? status,
    String? priority,
    String? submittedBy, // null = all, 'me' = current user, or specific UID
    int? limit,
  }) async {
    // Ensure token is refreshed before request (interceptor will also refresh)
    final user = FirebaseAuth.instance.currentUser;
    if (user != null && _authToken == null) {
      await _refreshTokenFromFirebase();
    }
    
    final queryParams = <String, dynamic>{};
    if (department != null) queryParams['department'] = department;
    if (status != null) queryParams['status'] = status;
    if (priority != null) queryParams['priority'] = priority;
    // Only add submittedBy if explicitly set (not null)
    // null = get all grievances (community feed)
    // 'me' = get current user's grievances
    // specific UID = get that user's grievances
    if (submittedBy != null) {
      queryParams['submittedBy'] = submittedBy;
    }
    if (limit != null) queryParams['limit'] = limit;

    print('📋 Getting grievances with params: $queryParams');
    print('   submittedBy was: $submittedBy (null means get all)');
    print('   Final query params: $queryParams');
    
    final response = await _dio.get(
      ApiConfig.grievances,
      queryParameters: queryParams.isEmpty ? null : queryParams,
    );
    
    print('✅ Response received: ${response.statusCode}');
    print('   Count: ${response.data['count'] ?? response.data['data']?.length ?? 0}');
    if (response.data['data'] != null && (response.data['data'] as List).isNotEmpty) {
      print('   First grievance submittedBy: ${(response.data['data'] as List)[0]['submittedBy']}');
    }
    
    return response;
  }

  Future<Response> getGrievance(String id) async {
    return await _dio.get('${ApiConfig.grievances}/$id');
  }

  Future<Response> updateGrievance(
    String id, {
    String? title,
    String? description,
    String? location,
    String? contactPhone,
  }) async {
    final data = <String, dynamic>{};
    if (title != null) data['title'] = title;
    if (description != null) data['description'] = description;
    if (location != null) data['location'] = location;
    if (contactPhone != null) data['contactPhone'] = contactPhone;

    return await _dio.put('${ApiConfig.grievances}/$id', data: data);
  }

  Future<Response> updateGrievanceStatus(
    String id, {
    String? status,
    String? priority,
    List<String>? afterPhotos,
  }) async {
    return await _dio.patch(
      '${ApiConfig.grievances}/$id/status',
      data: {
        if (status != null) 'status': status,
        if (priority != null) 'priority': priority,
        if (afterPhotos != null) 'afterPhotos': afterPhotos,
      },
    );
  }

  Future<Response> deleteGrievance(String id) async {
    await _refreshTokenFromFirebase();
    return await _dio.delete('${ApiConfig.grievances}/$id');
  }

  // Upvote
  Future<Response> upvoteGrievance(String id) async {
    await _refreshTokenFromFirebase();
    return await _dio.post('${ApiConfig.grievances}/$id/upvote');
  }

  // Comments
  Future<Response> getComments(String grievanceId) async {
    return await _dio.get('${ApiConfig.grievances}/$grievanceId/comments');
  }

  Future<Response> addComment(String grievanceId, String comment) async {
    return await _dio.post(
      '${ApiConfig.grievances}/$grievanceId/comments',
      data: {'comment': comment},
    );
  }

  // Notifications
  Future<Response> getNotifications({int? limit}) async {
    return await _dio.get(
      ApiConfig.notifications,
      queryParameters: limit != null ? {'limit': limit} : null,
    );
  }

  Future<Response> markNotificationAsRead(String id) async {
    return await _dio.put('${ApiConfig.notifications}/$id/read');
  }

  Future<Response> deleteNotification(String id) async {
    return await _dio.delete('${ApiConfig.notifications}/$id');
  }

  // Location
  Future<Response> getMapMarkers({
    String? status,
    String? department,
  }) async {
    final queryParams = <String, dynamic>{};
    if (status != null) queryParams['status'] = status;
    if (department != null) queryParams['department'] = department;

    return await _dio.get(
      ApiConfig.locationMarkers,
      queryParameters: queryParams.isEmpty ? null : queryParams,
    );
  }

  Future<Response> geocodeAddress(String address) async {
    return await _dio.post(
      ApiConfig.locationGeocode,
      data: {'address': address},
    );
  }

  Future<Response> getRoute({
    required Map<String, double> from,
    required Map<String, double> to,
  }) async {
    return await _dio.post(
      ApiConfig.locationRoute,
      data: {
        'from': from,
        'to': to,
      },
    );
  }

  // Config
  Future<Response> getConfig() async {
    return await _dio.get(ApiConfig.config);
  }
  
  // Version Info
  Future<Response> getVersionInfo() async {
    return await _dio.get(ApiConfig.version);
  }

  // Users (Admin only)
  Future<Response> getUsers() async {
    return await _dio.get(ApiConfig.users);
  }

  // Campus Locations
  Future<Response> getCampusLocations() async {
    return await _dio.get(ApiConfig.campusLocations);
  }

  Future<Response> getNearbyCampusLocations({
    required double latitude,
    required double longitude,
    int maxDistance = 500,
  }) async {
    return await _dio.get(
      ApiConfig.campusLocationsNearby,
      queryParameters: {
        'latitude': latitude,
        'longitude': longitude,
        'maxDistance': maxDistance,
      },
    );
  }

  Future<Response> createCampusLocation({
    required String name,
    String? description,
    required double latitude,
    required double longitude,
    String? category,
    String? icon,
  }) async {
    return await _dio.post(
      ApiConfig.campusLocations,
      data: {
        'name': name,
        'description': description,
        'latitude': latitude,
        'longitude': longitude,
        'category': category,
        'icon': icon,
      },
    );
  }

  Future<Response> updateCampusLocation(
    String id, {
    String? name,
    String? description,
    double? latitude,
    double? longitude,
    String? category,
    String? icon,
  }) async {
    return await _dio.put(
      '${ApiConfig.campusLocations}/$id',
      data: {
        if (name != null) 'name': name,
        if (description != null) 'description': description,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
        if (category != null) 'category': category,
        if (icon != null) 'icon': icon,
      },
    );
  }

  Future<Response> deleteCampusLocation(String id) async {
    return await _dio.delete('${ApiConfig.campusLocations}/$id');
  }

  // Route Optimization (TSP)
  Future<Response> optimizeRoutes({
    required List<Map<String, dynamic>> grievances,
    Map<String, double>? startLocation,
    int maxDistance = 500,
  }) async {
    return await _dio.post(
      ApiConfig.optimizeRoutes,
      data: {
        'grievances': grievances,
        if (startLocation != null) 'startLocation': startLocation,
        'maxDistance': maxDistance,
      },
    );
  }
}

