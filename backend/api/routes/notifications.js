import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { notificationService } from '../services/firebaseService.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Get user's notifications
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    // Check if db is initialized
    const { db } = await import('../services/firebaseService.js');
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not initialized'
      });
    }
    
    // Try to get notifications with fallback
    let notifications = [];
    try {
      notifications = await notificationService.getByUserId(req.user.uid, limit);
    } catch (queryError) {
      console.error('Error querying notifications:', queryError);
      
      // Fallback: Get all notifications for user without orderBy
      try {
        const snapshot = await db.collection('notifications')
          .where('userId', '==', req.user.uid)
          .limit(limit)
          .get();
        
        notifications = snapshot.docs.map(doc => {
          const data = doc.data();
          const notification = {
            id: doc.id,
            ...data
          };
          
          // Convert createdAt timestamp
          if (data.createdAt && data.createdAt.toDate) {
            notification.createdAt = data.createdAt.toDate().toISOString();
          } else if (data.createdAt && data.createdAt._seconds) {
            notification.createdAt = new Date(data.createdAt._seconds * 1000).toISOString();
          } else if (data.createdAt) {
            notification.createdAt = data.createdAt;
          }
          
          return notification;
        });
        
        // Sort manually by createdAt
        notifications.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        throw fallbackError;
      }
    }

    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get notifications',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    // Verify notification belongs to user
    const { db } = await import('../services/firebaseService.js');
    const notificationDoc = await db.collection('notifications').doc(req.params.id).get();
    
    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    const notification = notificationDoc.data();
    if (notification.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this notification'
      });
    }

    await notificationService.markAsRead(req.params.id);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notification as read'
    });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Verify notification belongs to user
    const { db } = await import('../services/firebaseService.js');
    const notificationDoc = await db.collection('notifications').doc(req.params.id).get();
    
    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    const notification = notificationDoc.data();
    if (notification.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this notification'
      });
    }

    await notificationService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete notification'
    });
  }
});

export default router;

