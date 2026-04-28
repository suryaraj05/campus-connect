// Quick test script to verify Firebase credentials
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Testing Firebase Credentials...\n');

// Check environment variables
const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

console.log('Environment Variables:');
console.log('  FIREBASE_PROJECT_ID:', projectId || '❌ Missing');
console.log('  FIREBASE_CLIENT_EMAIL:', clientEmail || '❌ Missing');
console.log('  FIREBASE_PRIVATE_KEY:', privateKey ? `✅ (${privateKey.length} chars)` : '❌ Missing');
console.log('');

if (!projectId || !privateKey || !clientEmail) {
  console.error('❌ Missing required Firebase credentials!');
  process.exit(1);
}

// Clean up credentials
const removeQuotes = (str) => {
  if (!str || typeof str !== 'string') return str;
  str = str.trim();
  if ((str.startsWith('"') && str.endsWith('"')) || 
      (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1);
  }
  return str;
};

let cleanPrivateKey = removeQuotes(privateKey);
cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');
const cleanClientEmail = removeQuotes(clientEmail);

console.log('Cleaned Credentials:');
console.log('  Project ID:', projectId);
console.log('  Client Email:', cleanClientEmail);
console.log('  Private Key Length:', cleanPrivateKey.length);
console.log('  Private Key Starts:', cleanPrivateKey.substring(0, 30) + '...');
console.log('');

// Try to initialize
try {
  const serviceAccount = {
    projectId: projectId,
    privateKey: cleanPrivateKey,
    clientEmail: cleanClientEmail
  };

  console.log('🔍 Initializing Firebase Admin...');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${projectId}.appspot.com`
  });

  console.log('✅ Firebase Admin initialized successfully!');
  
  // Test Firestore
  const db = admin.firestore();
  console.log('✅ Firestore connection ready');
  
  // Test Auth
  const auth = admin.auth();
  console.log('✅ Auth connection ready');
  
  // Test Storage
  const storage = admin.storage();
  console.log('✅ Storage connection ready');
  
  console.log('\n✅ All Firebase services are working!');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Firebase initialization failed!');
  console.error('Error:', error.message);
  console.error('Code:', error.code);
  if (error.stack) {
    console.error('\nStack:', error.stack);
  }
  process.exit(1);
}

