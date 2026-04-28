import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:dio/dio.dart';
import '../../services/api_service.dart';
import '../../config/api_config.dart';
import '../../providers/auth_provider.dart';
import '../../utils/refresh_utils.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      // Sign in with Firebase Auth
      UserCredential userCredential;
      try {
        userCredential = await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        );
      } catch (e) {
        // Handle Firebase Auth internal errors (like PigeonUserDetails cast error)
        if (e.toString().contains('PigeonUserDetails') || e.toString().contains('type cast')) {
          // Try to get the user from current user if auth succeeded
          final user = FirebaseAuth.instance.currentUser;
          if (user != null && user.email == _emailController.text.trim()) {
            // Auth succeeded, continue with login
            final idToken = await user.getIdToken();
            if (idToken != null) {
              // Continue with backend login
              final apiService = ApiService();
              apiService.init();
              final response = await apiService.login(idToken);

              if (response.data['success'] == true) {
                // Clear cache and refresh user data to get latest role
                await RefreshUtils.fullRefresh(ref);
                await Future.delayed(const Duration(milliseconds: 1000));
                ref.invalidate(userDataProvider);
                if (mounted) {
                  await Future.delayed(const Duration(milliseconds: 300));
                  context.go('/home');
                }
                return;
              } else {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(response.data['message'] ?? 'Login failed')),
                  );
                }
                return;
              }
            }
          }
        }
        rethrow;
      }

      // Get ID token
      final idToken = await userCredential.user?.getIdToken();
      if (idToken == null) {
        throw Exception('Failed to get ID token');
      }

      // Login to backend
      final apiService = ApiService();
      apiService.init();
      final response = await apiService.login(idToken);

      if (response.data['success'] == true) {
        // Save token for persistence
        await apiService.setAuthToken(idToken);
        
        // Log response for debugging
        if (response.data['data'] != null) {
          print('✅ [Login] User data received:');
          print('   Role: ${response.data['data']['role']}');
          print('   Phone: ${response.data['data']['phoneNumber']}');
          print('   Department: ${response.data['data']['department']}');
        }
        
        // Use refresh utility for robust refresh
        await RefreshUtils.refreshUserData(ref);
        
        if (mounted) {
          context.go('/home');
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(response.data['message'] ?? 'Login failed')),
          );
        }
      }
    } on FirebaseAuthException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message ?? 'Login failed')),
        );
      }
    } on DioException catch (e) {
      // Handle API errors with detailed information
      String errorMessage = 'Login failed';
      if (e.response != null) {
        errorMessage = e.response?.data['message'] ?? 'Server error: ${e.response?.statusCode}';
        print('❌ API Error Details:');
        print('   Status: ${e.response?.statusCode}');
        print('   URL: ${e.requestOptions.baseUrl}${e.requestOptions.path}');
        print('   Response: ${e.response?.data}');
      } else if (e.type == DioExceptionType.connectionTimeout ||
                 e.type == DioExceptionType.receiveTimeout) {
        errorMessage = 'Connection timeout. Check your internet connection.';
      } else if (e.type == DioExceptionType.badResponse) {
        errorMessage = 'Server error: ${e.response?.statusCode ?? 'Unknown'}';
        if (e.response?.statusCode == 404) {
          errorMessage = 'API endpoint not found. Please check backend URL: ${ApiConfig.baseUrl}';
        }
      } else {
        errorMessage = 'Network error: ${e.message}';
      }
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMessage),
            duration: const Duration(seconds: 5),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
            duration: const Duration(seconds: 5),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
        actions: [
          IconButton(
            icon: const Icon(Icons.bug_report),
            onPressed: () => context.push('/debug'),
            tooltip: 'Debug API',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 32),
                Text(
                  'Welcome Back',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Sign in to continue',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    prefixIcon: Icon(Icons.email),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email';
                    }
                    if (!value.contains('@')) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    prefixIcon: const Icon(Icons.lock),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility : Icons.visibility_off,
                      ),
                      onPressed: () {
                        setState(() => _obscurePassword = !_obscurePassword);
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your password';
                    }
                    if (value.length < 6) {
                      return 'Password must be at least 6 characters';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _login,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Login'),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => context.push('/register'),
                  child: const Text('Don\'t have an account? Register'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

