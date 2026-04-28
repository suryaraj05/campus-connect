import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '..', '.env') });

async function sendTestNotifications() {
  try {
    // Import Firebase service
    const { db, notificationService, userService } = await import('../api/services/firebaseService.js');
    
    if (!db) {
      console.error('❌ Firestore not initialized');
      process.exit(1);
    }
    
    // Find user by email
    console.log('🔍 Finding user with email: admin005@gmail.com');
    const usersSnapshot = await db.collection('users')
      .where('email', '==', 'admin005@gmail.com')
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      console.error('❌ User not found with email: admin005@gmail.com');
      console.log('💡 Available users:');
      const allUsers = await db.collection('users').limit(10).get();
      allUsers.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.email} (${data.role})`);
      });
      process.exit(1);
    }
    
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    
    console.log(`✅ Found user: ${userData.displayName} (${userData.email})`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Role: ${userData.role}`);
    
    // Send 3 test notifications
    const notifications = [
      {
        userId: userId,
        title: 'Test Notification 1',
        message: 'This is the first test notification to verify push notifications are working.',
        type: 'info',
        read: false,
      },
      {
        userId: userId,
        title: 'Test Notification 2',
        message: 'This is the second test notification. Check if you receive this push notification.',
        type: 'success',
        read: false,
      },
      {
        userId: userId,
        title: 'Test Notification 3',
        message: 'This is the third test notification. If you see this, notifications are working!',
        type: 'warning',
        read: false,
      },
    ];
    
    console.log('\n📤 Sending test notifications...');
    
    for (let i = 0; i < notifications.length; i++) {
      try {
        const notification = await notificationService.create(notifications[i]);
        console.log(`✅ Notification ${i + 1} sent: ${notification.id}`);
      } catch (error) {
        console.error(`❌ Failed to send notification ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n✅ Test notifications sent successfully!');
    console.log('💡 Check the notifications screen in the app to see if they appear.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending test notifications:', error);
    process.exit(1);
  }
}

sendTestNotifications();

