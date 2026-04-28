/**
 * Test script for Grievance API endpoints
 * Run with: node test-grievance-api.js
 * 
 * This script tests the grievance creation endpoint to identify backend issues
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '.env') });

// Use Vercel URL if available, otherwise localhost
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : (process.env.BACKEND_URL || 'https://campus-connect-backend-wine.vercel.app');

console.log('🧪 Testing Grievance API Endpoints');
console.log('📍 Base URL:', BASE_URL);
console.log('');

// Test data
const testGrievance = {
  title: 'Test Grievance - API Test',
  description: 'This is a test grievance created by the API test script',
  departments: ['Electrical Department'],
  priority: 'medium',
  location: 'Test Location, Building A',
  images: [],
  contactPhone: '+1234567890',
  latitude: 17.3850,
  longitude: 78.4867
};

async function testHealthCheck() {
  console.log('1️⃣ Testing Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
    return response.ok;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

async function testGrievanceCreation(idToken) {
  console.log('\n2️⃣ Testing Grievance Creation...');
  console.log('   Using token:', idToken ? `${idToken.substring(0, 20)}...` : 'NO TOKEN');
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/grievances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken ? `Bearer ${idToken}` : ''
      },
      body: JSON.stringify(testGrievance)
    });

    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('   ❌ Error creating grievance');
      if (response.status === 401) {
        console.error('   💡 This is an authentication error. Make sure you provide a valid Firebase ID token.');
      } else if (response.status === 500) {
        console.error('   💡 This is a server error. Check backend logs for details.');
      }
    } else {
      console.log('   ✅ Grievance created successfully!');
    }
    
    return response.ok;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

async function testGetGrievances(idToken) {
  console.log('\n3️⃣ Testing Get Grievances...');
  console.log('   Using token:', idToken ? `${idToken.substring(0, 20)}...` : 'NO TOKEN');
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/grievances`, {
      method: 'GET',
      headers: {
        'Authorization': idToken ? `Bearer ${idToken}` : ''
      }
    });

    const data = await response.json();
    console.log('   Status:', response.status);
    console.log('   Response:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('   ❌ Error getting grievances');
      if (response.status === 401) {
        console.error('   💡 This is an authentication error. Make sure you provide a valid Firebase ID token.');
      }
    } else {
      console.log('   ✅ Grievances retrieved successfully!');
      console.log('   Count:', data.count || data.data?.length || 0);
    }
    
    return response.ok;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 GRIEVANCE API TEST SUITE');
  console.log('='.repeat(60));
  console.log('');

  // Test 1: Health check (no auth required)
  const healthOk = await testHealthCheck();
  
  if (!healthOk) {
    console.error('\n❌ Health check failed. Is the backend running?');
    console.error('   Start the backend with: cd backend && npm start');
    return;
  }

  // Test 2: Get grievances without token (should fail)
  console.log('\n⚠️  Testing without authentication token (should fail)...');
  await testGetGrievances(null);

  // Test 3: Create grievance without token (should fail)
  console.log('\n⚠️  Testing without authentication token (should fail)...');
  await testGrievanceCreation(null);

  console.log('\n' + '='.repeat(60));
  console.log('📝 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log('');
  console.log('✅ Health check: PASSED');
  console.log('⚠️  To test authenticated endpoints:');
  console.log('   1. Get a Firebase ID token from your Flutter app');
  console.log('   2. Run: node test-grievance-api.js <YOUR_FIREBASE_ID_TOKEN>');
  console.log('');
  console.log('💡 To get a token from Flutter app:');
  console.log('   - Login in the app');
  console.log('   - Check console logs for token');
  console.log('   - Or use Firebase Auth in browser console');
  console.log('');
}

// Get token from command line if provided
const idToken = process.argv[2];

if (idToken) {
  console.log('🔑 Using provided token for authenticated tests...\n');
  (async () => {
    await testGetGrievances(idToken);
    await testGrievanceCreation(idToken);
  })();
} else {
  runTests();
}

