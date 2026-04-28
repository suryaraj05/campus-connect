import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthStateNotifier extends ChangeNotifier {
  AuthStateNotifier() {
    // Listen to auth state changes
    FirebaseAuth.instance.authStateChanges().listen((user) {
      notifyListeners();
    });
  }
}

