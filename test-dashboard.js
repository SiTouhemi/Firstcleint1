const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:4000';

async function testDashboardEndpoints() {
  console.log('🧪 Testing Dashboard Endpoints...\n');

  try {
    // Test stats endpoint
    console.log('📊 Testing /api/dashboard/stats...');
    const statsResponse = await fetch(`${BACKEND_URL}/api/dashboard/stats`);
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      console.log('✅ Stats endpoint working:', statsData.data);
    } else {
      console.log('❌ Stats endpoint failed:', statsData.error);
    }

    // Test recent orders endpoint
    console.log('\n📦 Testing /api/dashboard/recent-orders...');
    const ordersResponse = await fetch(`${BACKEND_URL}/api/dashboard/recent-orders`);
    const ordersData = await ordersResponse.json();
    
    if (ordersData.success) {
      console.log('✅ Recent orders endpoint working:', ordersData.data.length, 'orders found');
    } else {
      console.log('❌ Recent orders endpoint failed:', ordersData.error);
    }

  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
}

// Run the test
testDashboardEndpoints(); 