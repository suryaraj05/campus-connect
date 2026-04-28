/**
 * Test script for creating a grievance
 * Run with: node test-create-grievance.js <FIREBASE_ID_TOKEN>
 */

const BASE_URL = 'https://campus-connect-backend-wine.vercel.app';

async function testCreateGrievance(token) {
  console.log('🧪 Testing POST /api/v1/grievances...\n');
  
  const testData = {
    title: 'Test Grievance from API Test',
    description: 'This is a test grievance created via API test script',
    departments: ['Municipal Cleanliness'],
    priority: 'medium',
    location: 'Test Location, Campus',
    images: [], // Empty for now
    contactPhone: '1234567890',
    latitude: 18.883747,
    longitude: 77.920214,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/v1/grievances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    console.log(`   Message: ${data.message || 'N/A'}`);
    
    if (data.success && data.data) {
      console.log(`   ✅ Grievance ID: ${data.data.grievanceId || data.data.id}`);
      console.log(`   Title: ${data.data.title}`);
    } else {
      console.error('   ❌ Error:', data.message || 'Unknown error');
      if (data.error) {
        console.error('   Error details:', JSON.stringify(data.error, null, 2));
      }
    }
    
    return response.ok && data.success;
  } catch (error) {
    console.error('   ❌ Network Error:', error.message);
    return false;
  }
}

// Main
const token = process.argv[2];
if (!token) {
  console.error('❌ Please provide a Firebase ID token:');
  console.error('   node test-create-grievance.js <YOUR_FIREBASE_ID_TOKEN>');
  process.exit(1);
}

testCreateGrievance(token);

