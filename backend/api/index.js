import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

// Debug: Log environment variables (without sensitive data)
console.log('🔍 Environment check:');
console.log('  GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('  FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || '❌ Missing');
console.log('  FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
console.log('  FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

// Import routes
import grievanceRoutes from './routes/grievances.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import locationRoutes from './routes/location.js';
import configRoutes from './routes/config.js';
import campusLocationsRoutes from './routes/campusLocations.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check (no versioning - system endpoint)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Campus Connect API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    apiVersion: 'v1'
  });
});

// API Version Info
app.get('/api/version', (req, res) => {
  res.json({
    success: true,
    data: {
      apiVersion: 'v1',
      version: '1.0.0',
      supportedVersions: ['v1'],
      latestVersion: 'v1',
      endpoints: {
        v1: {
          base: '/api/v1',
          routes: [
            '/api/v1/grievances',
            '/api/v1/ai',
            '/api/v1/auth',
            '/api/v1/users',
            '/api/v1/notifications',
            '/api/v1/location',
            '/api/v1/config'
          ]
        }
      }
    }
  });
});

// API v1 Routes (versioned)
app.use('/api/v1/grievances', grievanceRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/config', configRoutes);
app.use('/api/v1/campus-locations', campusLocationsRoutes);

// Backward compatibility: Redirect old routes to v1 (optional, can be removed later)
app.use('/api/grievances', grievanceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/config', configRoutes);
app.use('/api/campus-locations', campusLocationsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// For Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Campus Connect API running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });
}

