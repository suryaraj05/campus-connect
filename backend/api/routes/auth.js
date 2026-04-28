import express from 'express';
import { verifyToken } from '../services/firebaseService.js';
import { userService } from '../services/firebaseService.js';
import { DEPARTMENTS } from '../config/departments.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user (creates user in Firestore)
 * Note: Firebase Auth handles actual user creation on client side
 * This endpoint just creates the user document in Firestore
 */
router.post('/register', async (req, res) => {
  try {
    const { idToken, displayName, role, department, phoneNumber } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required'
      });
    }

    // Verify token
    const decodedToken = await verifyToken(idToken);
    const uid = decodedToken.uid;

    // Check if user already exists - if exists, UPDATE the role and department
    const existingUser = await userService.getById(uid);
    if (existingUser) {
      console.log('⚠️ [Auth] User already exists, updating role and department...');
      const updates = {};
      
      // Update role if provided and different
      if (role && role !== existingUser.role) {
        updates.role = role;
        console.log(`📝 [Auth] Updating role from ${existingUser.role} to ${role}`);
      }
      
      // Update department if role is department
      if (role === 'department' && department) {
        updates.department = department;
        console.log(`📝 [Auth] Updating department to ${department}`);
      }
      
      // Update phone number if provided
      if (phoneNumber && phoneNumber !== existingUser.phoneNumber) {
        updates.phoneNumber = phoneNumber;
      }
      
      // Update display name if provided
      if (displayName && displayName !== existingUser.displayName) {
        updates.displayName = displayName;
      }
      
      if (Object.keys(updates).length > 0) {
        const updatedUser = await userService.update(uid, updates);
        console.log(`✅ [Auth] User updated: role=${updatedUser.role}, department=${updatedUser.department}`);
        return res.json({
          success: true,
          message: 'User updated successfully',
          data: updatedUser
        });
      } else {
        return res.json({
          success: true,
          message: 'User already exists',
          data: existingUser
        });
      }
    }

    // Validate role
    const validRoles = ['citizen', 'department', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required (citizen, department, admin)'
      });
    }

    // Validate department if role is department
    if (role === 'department') {
      if (!department || !DEPARTMENTS.includes(department)) {
        return res.status(400).json({
          success: false,
          message: 'Valid department is required for department role'
        });
      }
    }

    // Create user document
    const userData = {
      uid,
      email: decodedToken.email || '',
      displayName: displayName || decodedToken.name || 'User',
      role: role, // Explicitly set role from request
      phoneNumber: phoneNumber || '', // Save phone number even if empty string
    };
    
    // Log the data being received
    console.log('📝 [Auth] Registration request received:', {
      uid,
      email: decodedToken.email,
      displayName: displayName,
      role: role,
      phoneNumber: phoneNumber,
      department: department,
    });
    
    // Log the data being saved
    console.log('📝 [Auth] Creating user with data:', {
      uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      phoneNumber: userData.phoneNumber,
      department: role === 'department' ? department : undefined,
    });

    // Only add department if role is 'department' and department is provided
    // Firestore doesn't accept undefined values
    if (role === 'department' && department) {
      userData.department = department;
      console.log(`📝 [Auth] Adding department: ${department}`);
    }

    console.log(`📝 [Auth] Final user data before create:`, JSON.stringify(userData, null, 2));
    const user = await userService.create(userData);
    console.log(`✅ [Auth] User created successfully: ${uid}`);
    console.log(`✅ [Auth] User role after create: ${user?.role}`);
    console.log(`✅ [Auth] User phoneNumber after create: ${user?.phoneNumber}`);
    console.log(`✅ [Auth] User department after create: ${user?.department}`);
    console.log(`✅ [Auth] Full user object:`, JSON.stringify(user, null, 2));

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register user'
    });
  }
});

/**
 * POST /api/auth/login
 * Verify token and return user data
 */
router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required'
      });
    }

    // Verify token
    const decodedToken = await verifyToken(idToken);

    // Get user data from Firestore
    let user = await userService.getById(decodedToken.uid);

    // Auto-create user if they don't exist (from Firebase Auth)
    // NOTE: This should rarely happen if registration flow works correctly
    // But if it does, we'll create with 'citizen' role as fallback
    if (!user) {
      console.log(`⚠️ User not found in Firestore, auto-creating: ${decodedToken.uid}`);
      console.log(`   Email: ${decodedToken.email}`);
      console.log(`   ⚠️ WARNING: User should have registered first. Creating with default 'citizen' role.`);
      try {
        // Create user with default 'citizen' role
        const userData = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
          role: 'citizen', // Default role (user should register first to set proper role)
          phoneNumber: decodedToken.phone_number || '',
        };
        user = await userService.create(userData);
        console.log(`✅ Auto-created user in Firestore: ${decodedToken.uid} with role: ${userData.role}`);
      } catch (createError) {
        console.error('❌ Error auto-creating user:', createError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create user profile. Please try registering first.'
        });
      }
    } else {
      // Log the user's role for debugging
      console.log(`✅ User found: ${decodedToken.uid}, Role: ${user.role}`);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid token'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user data (requires authentication)
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyToken(idToken);

    const user = await userService.getById(decodedToken.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log user data for debugging
    console.log(`✅ [Auth] GET /me - User found: ${decodedToken.uid}`);
    console.log(`✅ [Auth] User role: ${user.role}`);
    console.log(`✅ [Auth] User phoneNumber: ${user.phoneNumber}`);
    console.log(`✅ [Auth] User department: ${user.department}`);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid token'
    });
  }
});

/**
 * PUT /api/auth/me
 * Update current user profile
 */
router.put('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyToken(idToken);

    const updates = {};
    const allowedFields = ['displayName', 'phoneNumber', 'profilePicture'];

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

    // Log updates for debugging
    console.log(`📝 [Auth] PUT /me - Updating user: ${decodedToken.uid}`);
    console.log(`📝 [Auth] Updates:`, JSON.stringify(updates, null, 2));

    const updatedUser = await userService.update(decodedToken.uid, updates);
    
    console.log(`✅ [Auth] User updated successfully`);
    console.log(`✅ [Auth] Updated user role: ${updatedUser?.role}`);
    console.log(`✅ [Auth] Updated user phoneNumber: ${updatedUser?.phoneNumber}`);

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
});

export default router;

