import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:dio/dio.dart';
import '../../services/api_service.dart';
import '../../services/config_service.dart';
import '../../config/api_config.dart';
import '../../providers/auth_provider.dart';
import '../../utils/refresh_utils.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  
  String? _selectedRole;
  String? _selectedDepartment;
  bool _isLoading = false;
  bool _obscurePassword = true;
  List<String> _departments = [];
  final _configService = ConfigService();

  @override
  void initState() {
    super.initState();
    _loadDepartments();
  }

  Future<void> _loadDepartments() async {
    final departments = await _configService.getDepartments();
    setState(() {
      _departments = departments;
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedRole == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a role')),
      );
      return;
    }
    if (_selectedRole == 'department' && _selectedDepartment == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a department')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      // Create user in Firebase Auth
      UserCredential userCredential;
      try {
        userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        );
      } catch (e) {
        // Handle Firebase Auth internal errors (like PigeonUserDetails cast error)
        if (e.toString().contains('PigeonUserDetails') || e.toString().contains('type cast')) {
          // Try to get the user from current user if auth succeeded
          final user = FirebaseAuth.instance.currentUser;
          if (user != null && user.email == _emailController.text.trim()) {
            // Auth succeeded, continue with registration
            final idToken = await user.getIdToken();
            if (idToken != null) {
              await user.updateDisplayName(_nameController.text.trim());
              // Continue with backend registration
              final apiService = ApiService();
              apiService.init();
              final response = await apiService.register(
                idToken: idToken,
                displayName: _nameController.text.trim(),
                role: _selectedRole!,
                department: _selectedDepartment,
                phoneNumber: _phoneController.text.trim(),
              );

              if (response.data['success'] == true) {
                // Log the response to verify data
                print('✅ [Register] Registration successful (error path)');
                print('✅ [Register] Response data: ${response.data}');
                if (response.data['data'] != null) {
                  print('✅ [Register] User role in response: ${response.data['data']['role']}');
                  print('✅ [Register] User phoneNumber in response: ${response.data['data']['phoneNumber']}');
                  print('✅ [Register] User department in response: ${response.data['data']['department']}');
                }
                
                await apiService.setAuthToken(idToken);
                
                // Use refresh utility for robust refresh
                await RefreshUtils.refreshUserData(ref);
                
                if (mounted) {
                  context.go('/home');
                }
                return;
              } else {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(response.data['message'] ?? 'Registration failed')),
                  );
                }
                return;
              }
            }
          }
        }
        rethrow;
      }

      // Update display name
      await userCredential.user?.updateDisplayName(_nameController.text.trim());

      // Get ID token
      final idToken = await userCredential.user?.getIdToken();
      if (idToken == null) {
        throw Exception('Failed to get ID token');
      }

      // Register in backend
      final apiService = ApiService();
      apiService.init();
      final response = await apiService.register(
        idToken: idToken,
        displayName: _nameController.text.trim(),
        role: _selectedRole!,
        department: _selectedDepartment,
        phoneNumber: _phoneController.text.trim(),
      );

      if (response.data['success'] == true) {
        // Log the response to verify data
        print('✅ [Register] Registration successful');
        print('✅ [Register] Response data: ${response.data}');
        if (response.data['data'] != null) {
          print('✅ [Register] User role in response: ${response.data['data']['role']}');
          print('✅ [Register] User phoneNumber in response: ${response.data['data']['phoneNumber']}');
          print('✅ [Register] User department in response: ${response.data['data']['department']}');
        }
        
        await apiService.setAuthToken(idToken);
        
        // Clear all cache and force complete refresh
        await RefreshUtils.fullRefresh(ref);
        
        // Wait for refresh to complete
        await Future.delayed(const Duration(milliseconds: 2000));
        
        // Verify role was saved correctly
        final userDataAsync = ref.read(userDataProvider);
        await userDataAsync.when(
          data: (data) {
            if (data != null) {
              print('✅ [Register] Final user data after refresh:');
              print('   Role: ${data['role']}');
              print('   Phone: ${data['phoneNumber']}');
              print('   Department: ${data['department']}');
            }
          },
          loading: () {},
          error: (error, stack) {
            print('❌ [Register] Error loading user data: $error');
          },
        );
        
        if (mounted) {
          context.go('/home');
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(response.data['message'] ?? 'Registration failed')),
          );
        }
      }
    } on DioException catch (e) {
      // Handle API errors with detailed information
      String errorMessage = 'Registration failed';
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
        if (e.response?.statusCode == 500) {
          errorMessage = 'Server error. Please check backend logs or try again later.';
          if (e.response?.data != null && e.response?.data['message'] != null) {
            errorMessage = e.response!.data['message'];
          }
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
    } on FirebaseAuthException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message ?? 'Registration failed')),
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
        title: const Text('Register'),
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
                const SizedBox(height: 16),
                Text(
                  'Create Account',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Full Name',
                    prefixIcon: Icon(Icons.person),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
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
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Phone Number',
                    prefixIcon: Icon(Icons.phone),
                  ),
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
                      return 'Please enter a password';
                    }
                    if (value.length < 6) {
                      return 'Password must be at least 6 characters';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                DropdownButtonFormField<String>(
                  value: _selectedRole,
                  decoration: const InputDecoration(
                    labelText: 'Role',
                    prefixIcon: Icon(Icons.people),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'citizen', child: Text('Citizen/Student')),
                    DropdownMenuItem(value: 'department', child: Text('Department')),
                    DropdownMenuItem(value: 'admin', child: Text('Admin')),
                  ],
                  onChanged: (value) {
                    setState(() {
                      _selectedRole = value;
                      if (value != 'department') {
                        _selectedDepartment = null;
                      }
                    });
                  },
                  validator: (value) {
                    if (value == null) {
                      return 'Please select a role';
                    }
                    return null;
                  },
                ),
                if (_selectedRole == 'department') ...[
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: _selectedDepartment,
                    decoration: const InputDecoration(
                      labelText: 'Department',
                      prefixIcon: Icon(Icons.business),
                    ),
                    items: _departments.map((dept) {
                      return DropdownMenuItem(
                        value: dept,
                        child: Text(dept),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() => _selectedDepartment = value);
                    },
                    validator: (value) {
                      if (_selectedRole == 'department' && value == null) {
                        return 'Please select a department';
                      }
                      return null;
                    },
                  ),
                ],
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: _isLoading ? null : _register,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Register'),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => context.push('/login'),
                  child: const Text('Already have an account? Login'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

