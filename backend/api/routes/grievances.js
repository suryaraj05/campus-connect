import express from 'express';
import { authenticate, requireDepartment } from '../middleware/auth.js';
import { grievanceService, uploadImages } from '../services/firebaseService.js';
import { commentService } from '../services/firebaseService.js';
import { notificationService } from '../services/firebaseService.js';
import { DEPARTMENTS, STATUS_LEVELS, PRIORITY_LEVELS } from '../config/departments.js';
import { groupByProximity, optimizeRoutes } from '../services/tspService.js';

const router = express.Router();

/**
 * POST /api/grievances
 * Create a new grievance
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      title,
      description,
      departments,
      priority,
      location,
      images, // Array of base64 strings
      contactPhone,
      latitude,
      longitude
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    if (!departments || !Array.isArray(departments) || departments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one department is required'
      });
    }

    // Validate departments
    const invalidDepartments = departments.filter(dept => !DEPARTMENTS.includes(dept));
    if (invalidDepartments.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid departments: ${invalidDepartments.join(', ')}`
      });
    }

    // Validate priority
    if (!priority || !PRIORITY_LEVELS.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Valid priority is required'
      });
    }

    // STRICT duplicate check: same user, same title OR same images, within last 10 minutes
    try {
      const { db } = await import('../services/firebaseService.js');
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      
      // Check 1: Same title from same user
      const titleDuplicateQuery = await db.collection('grievances')
        .where('submittedBy', '==', req.user.uid)
        .where('title', '==', title.trim())
        .where('createdAt', '>=', tenMinutesAgo)
        .limit(1)
        .get();
      
      if (!titleDuplicateQuery.empty) {
        console.log('❌ [Duplicate] Same title from same user detected');
        return res.status(409).json({
          success: false,
          message: 'You recently submitted a grievance with the same title. Please wait a few minutes or modify the title.',
          isDuplicate: true
        });
      }
      
      // Check 2: Same images from same user (compare first image hash)
      if (images && images.length > 0) {
        // Extract base64 data from first image
        const firstImage = images[0];
        let imageData = firstImage;
        if (typeof firstImage === 'string' && firstImage.startsWith('data:image')) {
          // Extract base64 part
          imageData = firstImage.split(',')[1] || firstImage;
        }
        
        // Get first 100 chars as a simple hash/fingerprint
        const imageFingerprint = imageData.substring(0, Math.min(100, imageData.length));
        
        // Check recent grievances from same user
        const recentGrievances = await db.collection('grievances')
          .where('submittedBy', '==', req.user.uid)
          .where('createdAt', '>=', tenMinutesAgo)
          .limit(10)
          .get();
        
        for (const doc of recentGrievances.docs) {
          const existingGrievance = doc.data();
          if (existingGrievance.imageUrls && existingGrievance.imageUrls.length > 0) {
            const existingFirstImage = existingGrievance.imageUrls[0];
            let existingImageData = existingFirstImage;
            if (typeof existingFirstImage === 'string' && existingFirstImage.startsWith('data:image')) {
              existingImageData = existingFirstImage.split(',')[1] || existingFirstImage;
            }
            const existingFingerprint = existingImageData.substring(0, Math.min(100, existingImageData.length));
            
            // If fingerprints match, it's likely the same image
            if (imageFingerprint === existingFingerprint) {
              console.log('❌ [Duplicate] Same image detected from same user');
              return res.status(409).json({
                success: false,
                message: 'You recently submitted a grievance with the same image. Please use different images or wait a few minutes.',
                isDuplicate: true
              });
            }
          }
        }
      }
    } catch (duplicateCheckError) {
      console.warn('⚠️ Duplicate check failed (non-critical):', duplicateCheckError.message);
      // Continue with submission if duplicate check fails
    }

    // Store base64 images directly in Firestore (instead of uploading to Storage)
    // This avoids Firebase Storage upload issues and keeps images with the grievance
    let imageUrls = [];
    if (images && images.length > 0) {
      try {
        // Store base64 strings directly - Firestore can handle strings up to 1MB
        // For larger images, we'll store them as base64 data URLs
        imageUrls = images.map((base64Image, index) => {
          // If it's already a data URL, use it directly
          if (typeof base64Image === 'string' && base64Image.startsWith('data:image')) {
            return base64Image;
          }
          // Otherwise, ensure it's a proper data URL
          return `data:image/jpeg;base64,${base64Image}`;
        });
        console.log(`✅ Storing ${imageUrls.length} images as base64 strings`);
      } catch (error) {
        console.error('❌ Error processing images:', error);
        console.error('   Error details:', {
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({
          success: false,
          message: `Failed to process images: ${error.message}`
        });
      }
    }

    // Create grievance
    const now = new Date();
    const grievanceData = {
      title: title.trim(),
      description: description.trim(),
      departments,
      status: 'submitted',
      priority,
      location: location?.trim() || '',
      imageUrls,
      submittedBy: req.user.uid,
      submittedByName: req.user.displayName || req.user.email,
      contactPhone: contactPhone || req.user.phoneNumber || '',
      contactEmail: req.user.email,
      assignedTo: [],
      latitude: latitude || null,
      longitude: longitude || null,
      upvotes: 0,
      upvotedBy: [],
      statusHistory: [{
        status: 'submitted',
        changedAt: now,
        changedBy: req.user.uid,
        changedByName: req.user.displayName || req.user.email,
        changedByRole: req.user.role || 'citizen',
      }]
    };

    let grievance;
    try {
      grievance = await grievanceService.create(grievanceData);
      console.log('✅ Grievance created successfully:', grievance.id);
    } catch (createError) {
      console.error('❌ Error creating grievance in Firestore:', createError);
      console.error('   Error details:', {
        message: createError.message,
        code: createError.code,
        stack: createError.stack
      });
      throw createError;
    }

    // Create notification for submitter (don't fail if this fails)
    try {
      await notificationService.create({
        userId: req.user.uid,
        title: 'Grievance Submitted',
        message: `Your grievance "${title}" has been successfully submitted.`,
        type: 'success',
        relatedGrievanceId: grievance.id,
        relatedGrievanceTitle: title
      });
    } catch (notifError) {
      console.warn('⚠️  Failed to create notification (non-critical):', notifError.message);
    }

    // TODO: Notify admins and departments (can be done via cloud function or scheduled job)

    // Ensure grievanceId is set (for consistency with frontend)
    const responseData = {
      ...grievance,
      grievanceId: grievance.id || grievance.grievanceId,
    };
    
    res.status(201).json({
      success: true,
      message: 'Grievance created successfully',
      data: responseData
    });
  } catch (error) {
    console.error('❌ Error creating grievance:', error);
    console.error('   Error type:', error.constructor.name);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create grievance',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/grievances
 * Get all grievances with optional filters
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const filters = {
      department: req.query.department,
      status: req.query.status,
      priority: req.query.priority,
      limit: parseInt(req.query.limit) || 50
    };

    // Handle submittedBy filter
    // If 'me' is passed, use current user's UID
    // If a UID is passed, use that UID
    // If nothing is passed, don't filter (get all grievances)
    if (req.query.submittedBy === 'me') {
      filters.submittedBy = req.user.uid;
    } else if (req.query.submittedBy) {
      filters.submittedBy = req.query.submittedBy;
    }
    // If submittedBy is not provided, don't add it to filters (get all)

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    console.log('📋 Getting grievances with filters:', JSON.stringify(filters, null, 2));
    console.log('   Query params received:', JSON.stringify(req.query, null, 2));
    console.log('   User UID:', req.user.uid);
    console.log('   User role:', req.user.role);
    const grievances = await grievanceService.getAll(filters);
    console.log(`   Returning ${grievances.length} grievances`);

    res.json({
      success: true,
      data: grievances,
      count: grievances.length
    });
  } catch (error) {
    console.error('Error getting grievances:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get grievances'
    });
  }
});

/**
 * GET /api/grievances/:id
 * Get a single grievance by ID
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const grievance = await grievanceService.getById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    res.json({
      success: true,
      data: grievance
    });
  } catch (error) {
    console.error('Error getting grievance:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get grievance'
    });
  }
});

/**
 * PUT /api/grievances/:id
 * Update a grievance (only by submitter or admin)
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const grievance = await grievanceService.getById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Check permissions
    if (grievance.submittedBy !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this grievance'
      });
    }

    const updates = {};
    const allowedFields = ['title', 'description', 'location', 'contactPhone'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const updatedGrievance = await grievanceService.update(req.params.id, updates);

    res.json({
      success: true,
      data: updatedGrievance
    });
  } catch (error) {
    console.error('Error updating grievance:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update grievance'
    });
  }
});

/**
 * PATCH /api/grievances/:id/status
 * Update grievance status (department/admin only)
 */
router.patch('/:id/status', authenticate, requireDepartment, async (req, res) => {
  try {
    const { status, priority, afterPhotos } = req.body;

    if (!status && !priority) {
      return res.status(400).json({
        success: false,
        message: 'Status or priority is required'
      });
    }

    const grievance = await grievanceService.getById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Check if user's department is assigned to this grievance
    if (req.user.role === 'department' && !grievance.departments.includes(req.user.department)) {
      return res.status(403).json({
        success: false,
        message: 'This grievance is not assigned to your department'
      });
    }

    const updates = {};

    if (status) {
      if (!STATUS_LEVELS.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }
      
      // Track status history
      const statusHistory = grievance.statusHistory || [];
      statusHistory.push({
        status: status,
        changedAt: new Date(),
        changedBy: req.user.uid,
        changedByName: req.user.displayName || req.user.email,
        changedByRole: req.user.role,
      });
      updates.statusHistory = statusHistory;
      updates.status = status;
      
      // If resolving, set resolvedAt timestamp
      if (status === 'resolved') {
        updates.resolvedAt = new Date();
      }
    }

    if (priority) {
      if (!PRIORITY_LEVELS.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid priority'
        });
      }
      updates.priority = priority;
    }

    // Handle after photos when resolving
    if (afterPhotos && Array.isArray(afterPhotos) && afterPhotos.length > 0) {
      // Store after photos as base64 strings (same as before photos)
      updates.afterPhotos = afterPhotos.map((photo) => {
        if (typeof photo === 'string' && photo.startsWith('data:image')) {
          return photo;
        }
        return `data:image/jpeg;base64,${photo}`;
      });
      console.log(`✅ Storing ${updates.afterPhotos.length} after photos`);
    }

    const updatedGrievance = await grievanceService.update(req.params.id, updates);

    // Create comment for status update
    let commentText = '';
    if (status && priority) {
      commentText = `Status updated to ${status} and Priority updated to ${priority}`;
    } else if (status) {
      commentText = `Status updated to ${status}`;
    } else if (priority) {
      commentText = `Priority updated to ${priority}`;
    }

    if (commentText) {
      await commentService.create({
        grievanceId: req.params.id,
        userId: req.user.uid,
        userName: req.user.displayName || req.user.email,
        userRole: req.user.role,
        comment: commentText,
        isStatusUpdate: true,
        newStatus: status || undefined
      });
    }

    // Notify the submitter
    if (grievance.submittedBy) {
      await notificationService.create({
        userId: grievance.submittedBy,
        title: 'Grievance Updated',
        message: `Your grievance "${grievance.title}" has been updated.`,
        type: 'info',
        relatedGrievanceId: req.params.id,
        relatedGrievanceTitle: grievance.title
      });
    }

    res.json({
      success: true,
      data: updatedGrievance
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update status'
    });
  }
});

/**
 * DELETE /api/grievances/:id
 * Delete a grievance (only by submitter or admin)
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const grievance = await grievanceService.getById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Check permissions
    if (grievance.submittedBy !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this grievance'
      });
    }

    await grievanceService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Grievance deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting grievance:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete grievance'
    });
  }
});

/**
 * GET /api/grievances/:id/comments
 * Get comments for a grievance
 */
router.get('/:id/comments', authenticate, async (req, res) => {
  try {
    const comments = await commentService.getByGrievanceId(req.params.id);

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get comments'
    });
  }
});

/**
 * POST /api/grievances/:id/comments
 * Add a comment to a grievance
 */
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }

    const grievance = await grievanceService.getById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    const commentData = {
      grievanceId: req.params.id,
      userId: req.user.uid,
      userName: req.user.displayName || req.user.email,
      userRole: req.user.role,
      comment: comment.trim(),
      isStatusUpdate: false
    };

    const newComment = await commentService.create(commentData);

    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create comment'
    });
  }
});

/**
 * POST /api/grievances/:id/upvote
 * Upvote a grievance (one vote per user, prevents gaming)
 */
router.post('/:id/upvote', authenticate, async (req, res) => {
  try {
    const grievance = await grievanceService.getById(req.params.id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Check if user already upvoted
    const upvotedBy = grievance.upvotedBy || [];
    const hasUpvoted = upvotedBy.includes(req.user.uid);

    if (hasUpvoted) {
      // Remove upvote
      const updatedUpvotedBy = upvotedBy.filter(uid => uid !== req.user.uid);
      const updatedUpvotes = Math.max(0, (grievance.upvotes || 0) - 1);
      
      await grievanceService.update(req.params.id, {
        upvotes: updatedUpvotes,
        upvotedBy: updatedUpvotedBy
      });

      res.json({
        success: true,
        data: {
          upvoted: false,
          upvotes: updatedUpvotes
        }
      });
    } else {
      // Add upvote - validation: one vote per user (enforced by checking upvotedBy array)
      const updatedUpvotedBy = [...upvotedBy, req.user.uid];
      const updatedUpvotes = (grievance.upvotes || 0) + 1;
      
      await grievanceService.update(req.params.id, {
        upvotes: updatedUpvotes,
        upvotedBy: updatedUpvotedBy
      });

      res.json({
        success: true,
        data: {
          upvoted: true,
          upvotes: updatedUpvotes
        }
      });
    }
  } catch (error) {
    console.error('Error upvoting grievance:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upvote grievance'
    });
  }
});

/**
 * POST /api/grievances/optimize-routes
 * Optimize routes for grievances using TSP algorithm (admin only)
 * Body: { grievances: [], startLocation?: {latitude, longitude}, maxDistance?: number }
 */
router.post('/optimize-routes', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can optimize routes'
      });
    }

    const { grievances = [], startLocation = null, maxDistance = 500 } = req.body;

    if (!grievances || grievances.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Grievances array is required'
      });
    }

    // Filter grievances with coordinates
    const validGrievances = grievances.filter(g => g.latitude && g.longitude);

    if (validGrievances.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No grievances with valid coordinates found'
      });
    }

    // Group by proximity
    const groups = groupByProximity(validGrievances, maxDistance);

    // Optimize routes for each group
    const optimizedRoutes = optimizeRoutes(groups, startLocation);

    res.json({
      success: true,
      data: {
        groups: optimizedRoutes.map(({ group, route }) => ({
          grievances: group,
          route: route.route,
          totalDistance: route.totalDistance,
          totalDistanceKm: route.totalDistanceKm,
          count: group.length,
        })),
        summary: {
          totalGroups: optimizedRoutes.length,
          totalGrievances: validGrievances.length,
          totalDistance: optimizedRoutes.reduce((sum, { route }) => 
            sum + route.totalDistance, 0
          ),
        }
      }
    });
  } catch (error) {
    console.error('Error optimizing routes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to optimize routes'
    });
  }
});

export default router;

