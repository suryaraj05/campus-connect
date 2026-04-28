import 'package:firebase_core/firebase_core.dart';
import 'dart:io' show Platform;

/// Firebase configuration
/// 
/// Configured for Android and iOS
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    // Android configuration
    if (Platform.isAndroid) {
      return const FirebaseOptions(
        apiKey: 'YOUR_FIREBASE_ANDROID_API_KEY',
        appId: '1:98533078449:android:2aec8a313ee9f8cbcf3990',
        messagingSenderId: '98533078449',
        projectId: 'chhif-database',
        storageBucket: 'chhif-database.firebasestorage.app',
        authDomain: 'chhif-database.firebaseapp.com',
      );
    }
    
    // iOS configuration
    if (Platform.isIOS) {
      return const FirebaseOptions(
        apiKey: 'YOUR_FIREBASE_IOS_API_KEY',
        appId: '1:98533078449:ios:d6b2eb1f2717da23cf3990',
        messagingSenderId: '98533078449',
        projectId: 'chhif-database',
        storageBucket: 'chhif-database.firebasestorage.app',
        authDomain: 'chhif-database.firebaseapp.com',
      );
    }
    
    // Web/Default (fallback)
    return const FirebaseOptions(
      apiKey: 'YOUR_FIREBASE_WEB_API_KEY',
      appId: '1:98533078449:android:2aec8a313ee9f8cbcf3990',
      messagingSenderId: '98533078449',
      projectId: 'chhif-database',
      storageBucket: 'chhif-database.firebasestorage.app',
      authDomain: 'chhif-database.firebaseapp.com',
    );
  }
}

