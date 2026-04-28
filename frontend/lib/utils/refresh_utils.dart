import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import '../providers/cache_provider.dart';

/// Utility functions for refreshing app data
class RefreshUtils {
  /// Force refresh user data with retries
  static Future<void> refreshUserData(WidgetRef ref, {int retries = 3}) async {
    for (int i = 0; i < retries; i++) {
      ref.invalidate(userDataProvider);
      await Future.delayed(Duration(milliseconds: 500 * (i + 1)));
      
      // Check if data is loaded
      final userDataAsync = ref.read(userDataProvider);
      await userDataAsync.when(
        data: (data) async {
          if (data != null) {
            print('✅ [Refresh] User data refreshed successfully on attempt ${i + 1}');
            print('   Role: ${data['role']}, Phone: ${data['phoneNumber']}');
            return;
          }
        },
        loading: () {},
        error: (_, __) {},
      );
    }
  }
  
  /// Clear all cache and refresh user data
  static Future<void> fullRefresh(WidgetRef ref) async {
    await CacheProvider.clearAll();
    await refreshUserData(ref);
  }
}

