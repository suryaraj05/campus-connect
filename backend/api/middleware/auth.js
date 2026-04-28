import { verifyToken } from '../services/firebaseService.js';
import { userService } from '../services/firebaseService.js';

/**
 * Middleware to verify Firebase ID token
 */
export const authenticate = async (req, res, next) => {
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
    
    // Get user data from Firestore
    let user = await userService.getById(decodedToken.uid);
    
    // Auto-create user in Firestore if they don't exist (from Firebase Auth)
    // This handles cases where user was created in Firebase Auth but not registered in Firestore
    if (!user) {
      console.log(`⚠️ User not found in Firestore, auto-creating: ${decodedToken.uid}`);
      try {
        // Create user with default 'citizen' role
        const userData = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
          role: 'citizen', // Default role
          phoneNumber: decodedToken.phone_number || '',
        };
        user = await userService.create(userData);
        console.log(`✅ Auto-created user in Firestore: ${decodedToken.uid}`);
      } catch (createError) {
        console.error('❌ Error auto-creating user:', createError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create user profile'
        });
      }
    }

    // Attach user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...user
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Middleware to check if user has specific role
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole('admin');

/**
 * Middleware to check if user is department or admin
 */
export const requireDepartment = requireRole('department', 'admin');

