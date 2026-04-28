import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_fonts/google_fonts.dart';

import 'config/firebase_config.dart';
import 'config/theme.dart';
import 'routes/app_router.dart';
import 'services/local_notification_service.dart';
import 'services/cache_service.dart';
import 'services/notification_listener_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  // Initialize Local Notifications
  await LocalNotificationService().initialize();
  
  // Start notification listener for push notifications
  NotificationListenerService().startListening();
  
  // Initialize Cache Service in background (non-blocking)
  CacheService.init().then((_) {
    print('✅ [App] Cache service initialized');
  }).catchError((e) {
    print('⚠️ [App] Cache initialization error: $e, continuing anyway');
  });
  
  runApp(
    const ProviderScope(
      child: CampusConnectApp(),
    ),
  );
}

class CampusConnectApp extends StatelessWidget {
  const CampusConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Campus Connect',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: AppRouter.router,
    );
  }
}

