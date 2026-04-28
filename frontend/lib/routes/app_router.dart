import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../screens/landing/landing_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/grievance/submit_grievance_screen.dart';
import '../screens/grievance/grievance_list_screen.dart';
import '../screens/grievance/grievance_feed_screen.dart';
import '../screens/grievance/grievance_detail_screen.dart';
import '../screens/map/map_screen.dart';
import '../screens/notifications/notifications_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/profile/edit_profile_screen.dart';
import '../screens/profile/help_center_screen.dart';
import '../screens/debug/api_debug_screen.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/admin/admin_dashboard_screen.dart';
import '../screens/admin/admin_users_screen.dart';
import '../screens/admin/admin_locations_screen.dart';
import '../screens/department/department_dashboard_screen.dart';
import 'auth_state_notifier.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final user = FirebaseAuth.instance.currentUser;
      final location = state.matchedLocation;
      final isAuthPage = location == '/login' || 
                        location == '/register' ||
                        location == '/landing';
      
      // Allow debug page for both logged in and logged out users
      if (location == '/debug') {
        return null; // Allow access
      }
      
      // If user is logged in and trying to access auth pages, redirect to home
      if (user != null && isAuthPage && location != '/home') {
        return '/home';
      }
      
      // If user is not logged in and trying to access protected pages, redirect to landing
      if (user == null && !isAuthPage) {
        return '/landing';
      }
      
      return null; // No redirect needed
    },
    refreshListenable: AuthStateNotifier(),
    routes: [
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/landing',
        name: 'landing',
        builder: (context, state) => const LandingScreen(),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/submit-grievance',
        name: 'submit-grievance',
        builder: (context, state) => const SubmitGrievanceScreen(),
      ),
      GoRoute(
        path: '/grievances',
        name: 'grievances',
        builder: (context, state) => const GrievanceListScreen(),
      ),
      GoRoute(
        path: '/grievance/:id',
        name: 'grievance-detail',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return GrievanceDetailScreen(grievanceId: id);
        },
      ),
        GoRoute(
          path: '/map',
          name: 'map',
          builder: (context, state) {
            final selectLocation = state.uri.queryParameters['selectLocation'] == 'true';
            return MapScreen(selectLocation: selectLocation);
          },
        ),
      GoRoute(
        path: '/notifications',
        name: 'notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/profile',
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/profile/edit',
        name: 'edit-profile',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/profile/help',
        name: 'help-center',
        builder: (context, state) => const HelpCenterScreen(),
      ),
      // Admin routes
      GoRoute(
        path: '/admin',
        name: 'admin',
        builder: (context, state) => const AdminDashboardScreen(),
      ),
      GoRoute(
        path: '/admin/users',
        name: 'admin-users',
        builder: (context, state) => const AdminUsersScreen(),
      ),
      GoRoute(
        path: '/admin/locations',
        name: 'admin-locations',
        builder: (context, state) => const AdminLocationsScreen(),
      ),
      // Department route
      GoRoute(
        path: '/department',
        name: 'department',
        builder: (context, state) => const DepartmentDashboardScreen(),
      ),
      // Debug screen (remove in production)
      GoRoute(
        path: '/debug',
        name: 'debug',
        builder: (context, state) => const ApiDebugScreen(),
      ),
    ],
  );
}

