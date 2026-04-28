import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../grievance/grievance_feed_screen.dart';
import '../../config/theme.dart';
import '../../config/app_design_system.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/design_system/app_fab.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/base64_image_widget.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = FirebaseAuth.instance.currentUser;
    final userDataAsync = ref.watch(userDataProvider);
    final userData = userDataAsync.value;
    final profilePicture = userData?['profilePicture'];
    final displayName = userData?['displayName'] ?? user?.displayName ?? 'User';
    final initials = displayName.isNotEmpty 
        ? displayName.split(' ').map((n) => n[0]).take(2).join().toUpperCase()
        : 'U';

    return Scaffold(
      backgroundColor: AppDesignSystem.backgroundColor,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Community Feed',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            Text(
              'All reported issues in your campus',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Stack(
              children: [
                const Icon(Icons.notifications_outlined),
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
            onPressed: () => context.push('/notifications'),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () => context.push('/profile'),
              borderRadius: BorderRadius.circular(20),
              child: profilePicture != null && profilePicture.toString().isNotEmpty
                  ? ClipOval(
                      child: Base64ImageWidget(
                        imageUrl: profilePicture,
                        width: 40,
                        height: 40,
                        fit: BoxFit.cover,
                      ),
                    )
                  : CircleAvatar(
                      backgroundColor: AppDesignSystem.primaryColor,
                      child: Text(
                        initials,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                      ),
                    ),
            ),
          ),
        ],
        elevation: 0,
      ),
      body: SafeArea(
        bottom: false,
        child: const GrievanceFeedScreen(),
      ),
      floatingActionButton: AppFAB(
        onPressed: () => context.push('/submit-grievance'),
        icon: Icons.add,
        tooltip: 'Report an Issue',
      ),
      bottomNavigationBar: BottomNavBar(currentRoute: '/home'),
    );
  }
}
