/**
 * Simple API test script
 * Tests the grievances endpoint with and without submittedBy parameter
 */

const BASE_URL = 'https://campus-connect-backend-wine.vercel.app';

async function testHealth() {
  console.log('🧪 Testing Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.status);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function testGetGrievances(token, submittedBy = null) {
  console.log(`\n📋 Testing GET /api/v1/grievances${submittedBy ? `?submittedBy=${submittedBy}` : ' (all grievances)'}...`);
  
  const url = submittedBy 
    ? `${BASE_URL}/api/v1/grievances?submittedBy=${submittedBy}&limit=10`
    : `${BASE_URL}/api/v1/grievances?limit=10`;
  
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    console.log(`   Count: ${data.count || data.data?.length || 0}`);
    
    if (data.data && data.data.length > 0) {
      console.log(`   First grievance: ${data.data[0].title}`);
      console.log(`   Submitted by: ${data.data[0].submittedBy}`);
    }
    
    if (!response.ok) {
      console.error('   ❌ Error:', data.message);
    }
    
    return response.ok;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 API ENDPOINT TEST');
  console.log('='.repeat(60));
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  // Test 1: Health check
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('\n❌ Backend is not accessible. Please check deployment.');
    return;
  }

  // Test 2: Get grievances without token (should fail)
  console.log('\n⚠️  Testing without token (should fail)...');
  await testGetGrievances(null);

  // Test 3: Get all grievances with token (if provided)
  const token = process.argv[2];
  if (token) {
    console.log('\n🔑 Testing with token...');
    console.log(`   Token: ${token.substring(0, 20)}...\n`);
    
    // Test getting all grievances (no submittedBy)
    await testGetGrievances(token, null);
    
    // Test getting user's grievances (submittedBy=me)
    await testGetGrievances(token, 'me');
  } else {
    console.log('\n💡 To test with authentication:');
    console.log('   node test-api-simple.js <YOUR_FIREBASE_ID_TOKEN>');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test Complete');
  console.log('='.repeat(60));
}

runTests();

