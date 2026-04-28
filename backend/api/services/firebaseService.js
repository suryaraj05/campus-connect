import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// Initialize Firebase Admin
let db;
let storage;
let auth;

// Check if Firebase credentials are available
const hasFirebaseCredentials = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  
  console.log('🔍 [Firebase] Checking credentials...');
  console.log('  Project ID:', projectId ? `✅ ${projectId}` : '❌ Missing');
  console.log('  Client Email:', clientEmail ? `✅ ${clientEmail.substring(0, 30)}...` : '❌ Missing');
  console.log('  Private Key:', privateKey ? `✅ (${privateKey.length} chars)` : '❌ Missing');
  
  return !!(projectId && privateKey && clientEmail);
};

// Initialize Firebase Admin (only if credentials are available)
if (hasFirebaseCredentials()) {
  try {
    if (!admin.apps.length) {
      // Get and clean credentials
      let projectId = process.env.FIREBASE_PROJECT_ID?.trim();
      let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
      let clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
      
      // Remove surrounding quotes if present (for all fields)
      const removeQuotes = (str) => {
        if (!str || typeof str !== 'string') return str;
        str = str.trim();
        if ((str.startsWith('"') && str.endsWith('"')) || 
            (str.startsWith("'") && str.endsWith("'"))) {
          return str.slice(1, -1);
        }
        return str;
      };
      
      projectId = removeQuotes(projectId);
      clientEmail = removeQuotes(clientEmail);
      privateKey = removeQuotes(privateKey);
      
      // Replace \\n with actual newlines in private key
      if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      console.log('🔍 [Firebase] Parsed credentials:');
      console.log('  Project ID:', projectId ? `✅ ${projectId}` : '❌');
      console.log('  Client Email:', clientEmail ? `✅ ${clientEmail}` : '❌');
      console.log('  Private Key:', privateKey ? `✅ (${privateKey.length} chars, starts with: ${privateKey.substring(0, 30)}...)` : '❌');

      const serviceAccount = {
        projectId: projectId,
        privateKey: privateKey,
        clientEmail: clientEmail
      };

      // Validate service account
      if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        console.error('❌ [Firebase] Service account validation failed:');
        console.error('  Project ID:', serviceAccount.projectId ? '✅' : '❌');
        console.error('  Private Key:', serviceAccount.privateKey ? '✅' : '❌');
        console.error('  Client Email:', serviceAccount.clientEmail ? '✅' : '❌');
        throw new Error('Firebase credentials are incomplete. Please check your .env file.');
      }

      console.log('🔍 [Firebase] Initializing Firebase Admin...');
      
      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: `${serviceAccount.projectId}.appspot.com`
        });

        db = admin.firestore();
        storage = admin.storage();
        auth = admin.auth();

        console.log('✅ [Firebase] Firebase Admin initialized successfully');
        console.log('✅ [Firebase] Firestore: Ready');
        console.log('✅ [Firebase] Storage: Ready');
        console.log('✅ [Firebase] Auth: Ready');
      } catch (initError) {
        console.error('❌ [Firebase] Initialization error:', initError.message);
        console.error('❌ [Firebase] Error details:', {
          code: initError.code,
          message: initError.message
        });
        throw initError;
      }
    } else {
      db = admin.firestore();
      storage = admin.storage();
      auth = admin.auth();
    }
  } catch (error) {
    console.error('❌ [Firebase] Admin initialization error:', error.message);
    console.error('💡 [Firebase] Make sure your .env file has correct Firebase credentials');
    console.error('💡 [Firebase] Check:');
    console.error('   1. .env file is in backend/ folder');
    console.error('   2. FIREBASE_PROJECT_ID is set');
    console.error('   3. FIREBASE_PRIVATE_KEY is set (with quotes and \\n)');
    console.error('   4. FIREBASE_CLIENT_EMAIL is set (NO quotes)');
    console.error('   5. Server was restarted after .env changes');
    // Don't throw - allow server to start for testing other endpoints
    console.warn('⚠️  [Firebase] Server will start but Firebase features will not work');
  }
} else {
  console.warn('⚠️  [Firebase] Credentials not found in .env file');
  console.warn('⚠️  [Firebase] Firebase features will not be available');
  console.warn('💡 [Firebase] To enable Firebase, add these to your .env file:');
  console.warn('   FIREBASE_PROJECT_ID=your_project_id');
  console.warn('   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
  console.warn('   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com');
}

/**
 * Upload image to Firebase Storage
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} fileName - File name
 * @returns {Promise<string>} Download URL
 */
export const uploadImage = async (imageBuffer, fileName) => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized. Please check your Firebase credentials.');
  }
  
  try {
    const bucket = storage.bucket();
    const file = bucket.file(`grievances/${Date.now()}_${fileName}`);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    await file.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 */
export const uploadImages = async (images) => {
  const uploadPromises = images.map((image, index) => {
    // Handle base64 string
    let imageBuffer;
    if (typeof image === 'string') {
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = image.includes(',') ? image.split(',')[1] : image;
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      imageBuffer = image;
    }
    
    const fileName = `image_${Date.now()}_${index}.jpg`;
    return uploadImage(imageBuffer, fileName);
  });

  return Promise.all(uploadPromises);
};

/**
 * Grievance Operations
 */
export const grievanceService = {
  // Create grievance
  async create(grievanceData) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      const docRef = await db.collection('grievances').add({
        ...grievanceData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      // Return with both id and grievanceId for compatibility
      return { 
        id: docRef.id, 
        grievanceId: docRef.id,
        ...grievanceData 
      };
    } catch (error) {
      console.error('Error creating grievance:', error);
      throw error;
    }
  },

  // Get grievance by ID
  async getById(grievanceId) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      const doc = await db.collection('grievances').doc(grievanceId).get();
      if (!doc.exists) {
        return null;
      }
      return { grievanceId: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting grievance:', error);
      throw error;
    }
  },

  // Get all grievances with filters
  async getAll(filters = {}) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      let query = db.collection('grievances');

      // Apply filters
      if (filters.department) {
        query = query.where('departments', 'array-contains', filters.department);
      }
      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }
      if (filters.priority) {
        query = query.where('priority', '==', filters.priority);
      }
      if (filters.submittedBy) {
        query = query.where('submittedBy', '==', filters.submittedBy);
      }

      // Order by createdAt (newest first)
      query = query.orderBy('createdAt', 'desc');

      // Limit results
      const limit = filters.limit || 50;
      query = query.limit(limit);

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        grievanceId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting grievances:', error);
      throw error;
    }
  },

  // Update grievance
  async update(grievanceId, updates) {
    try {
      await db.collection('grievances').doc(grievanceId).update({
        ...updates,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return await this.getById(grievanceId);
    } catch (error) {
      console.error('Error updating grievance:', error);
      throw error;
    }
  },

  // Delete grievance
  async delete(grievanceId) {
    try {
      await db.collection('grievances').doc(grievanceId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting grievance:', error);
      throw error;
    }
  },

  // Update status
  async updateStatus(grievanceId, status) {
    try {
      const updates = {
        status,
        updatedAt: FieldValue.serverTimestamp(),
      };
      
      if (status === 'resolved') {
        updates.resolvedAt = FieldValue.serverTimestamp();
      }

      await db.collection('grievances').doc(grievanceId).update(updates);
      return await this.getById(grievanceId);
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }
};

/**
 * User Operations
 */
export const userService = {
  // Get user by ID
  async getById(userId) {
    try {
      const doc = await db.collection('users').doc(userId).get();
      if (!doc.exists) {
        return null;
      }
      const userData = { uid: doc.id, ...doc.data() };
      // Log for debugging
      console.log(`📖 [Firestore] Fetched user ${userId}:`, {
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        department: userData.department,
      });
      return userData;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Create user
  async create(userData) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      // Remove undefined values - Firestore doesn't accept them
      const cleanData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined)
      );
      
      // Log what we're about to save
      console.log('📝 [Firestore] Saving user data:', JSON.stringify(cleanData, null, 2));
      
      await db.collection('users').doc(userData.uid).set({
        ...cleanData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      
      // Return the created user data - force fresh read
      const createdUser = await this.getById(userData.uid);
      console.log('✅ [Firestore] User created, fetched data:', JSON.stringify(createdUser, null, 2));
      console.log('✅ [Firestore] Role in fetched data:', createdUser?.role);
      console.log('✅ [Firestore] PhoneNumber in fetched data:', createdUser?.phoneNumber);
      console.log('✅ [Firestore] Department in fetched data:', createdUser?.department);
      return createdUser || cleanData;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async update(userId, updates) {
    try {
      await db.collection('users').doc(userId).update({
        ...updates,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return await this.getById(userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

/**
 * Notification Operations
 */
export const notificationService = {
  // Create notification
  async create(notificationData) {
    try {
      const docRef = await db.collection('notifications').add({
        ...notificationData,
        read: false,
        createdAt: FieldValue.serverTimestamp(),
      });
      return { id: docRef.id, ...notificationData };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get user notifications
  async getByUserId(userId, limit = 50) {
    try {
      const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore timestamps to ISO strings
        const notification = {
          id: doc.id,
          ...data
        };
        
        // Convert createdAt timestamp
        if (data.createdAt && data.createdAt.toDate) {
          notification.createdAt = data.createdAt.toDate().toISOString();
        } else if (data.createdAt && data.createdAt._seconds) {
          notification.createdAt = new Date(data.createdAt._seconds * 1000).toISOString();
        }
        
        return notification;
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      // If orderBy fails (missing index), try without it
      if (error.code === 'failed-precondition') {
        console.log('⚠️ [Notifications] Index missing, fetching without orderBy');
        const snapshot = await db.collection('notifications')
          .where('userId', '==', userId)
          .limit(limit)
          .get();
        
        const notifications = snapshot.docs.map(doc => {
          const data = doc.data();
          const notification = {
            id: doc.id,
            ...data
          };
          
          if (data.createdAt && data.createdAt.toDate) {
            notification.createdAt = data.createdAt.toDate().toISOString();
          } else if (data.createdAt && data.createdAt._seconds) {
            notification.createdAt = new Date(data.createdAt._seconds * 1000).toISOString();
          }
          
          return notification;
        });
        
        // Sort manually by createdAt
        notifications.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        
        return notifications;
      }
      throw error;
    }
  },

  // Mark as read
  async markAsRead(notificationId) {
    try {
      await db.collection('notifications').doc(notificationId).update({
        read: true,
      });
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Delete notification
  async delete(notificationId) {
    try {
      await db.collection('notifications').doc(notificationId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};

/**
 * Comment Operations
 */
export const commentService = {
  // Create comment
  async create(commentData) {
    try {
      const docRef = await db.collection('comments').add({
        ...commentData,
        createdAt: FieldValue.serverTimestamp(),
      });
      return { commentId: docRef.id, ...commentData };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Get comments for grievance
  async getByGrievanceId(grievanceId) {
    try {
      const snapshot = await db.collection('comments')
        .where('grievanceId', '==', grievanceId)
        .orderBy('createdAt', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({
        commentId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }
};

/**
 * Verify Firebase ID Token
 */
export const verifyToken = async (idToken) => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase credentials.');
  }
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

/**
 * Campus Location Operations
 * Manage predefined campus locations/landmarks
 */
export const locationService = {
  // Create location
  async create(locationData) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      const docRef = await db.collection('campusLocations').add({
        ...locationData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return { id: docRef.id, ...locationData };
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  },

  // Get all locations
  async getAll() {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      const snapshot = await db.collection('campusLocations')
        .orderBy('name')
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting locations:', error);
      throw error;
    }
  },

  // Get location by ID
  async getById(locationId) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      const doc = await db.collection('campusLocations').doc(locationId).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  },

  // Update location
  async update(locationId, updates) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      await db.collection('campusLocations').doc(locationId).update({
        ...updates,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return await this.getById(locationId);
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },

  // Delete location
  async delete(locationId) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      await db.collection('campusLocations').doc(locationId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  },

  // Find nearby locations
  async findNearby(latitude, longitude, maxDistance = 500) {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase credentials.');
    }
    
    try {
      const allLocations = await this.getAll();
      const nearby = [];
      
      for (const location of allLocations) {
        if (location.latitude && location.longitude) {
          const distance = _calculateDistance(
            latitude, longitude,
            location.latitude, location.longitude
          );
          
          if (distance <= maxDistance) {
            nearby.push({
              ...location,
              distance: Math.round(distance),
            });
          }
        }
      }
      
      // Sort by distance
      nearby.sort((a, b) => a.distance - b.distance);
      
      return nearby;
    } catch (error) {
      console.error('Error finding nearby locations:', error);
      throw error;
    }
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function _calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

export { db, storage, auth };

