// Using built-in fetch (Node.js 18+)

async function testBackend() {
  const baseUrl = 'http://localhost:4000';
  
  console.log('Testing backend endpoints...\n');
  
  // Test health endpoint
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }
  
  // Test GET stores
  try {
    const getResponse = await fetch(`${baseUrl}/api/stores`);
    const getData = await getResponse.json();
    console.log('✅ GET stores:', getData.success ? 'Success' : 'Failed');
    console.log('   Stores count:', getData.data?.length || 0);
  } catch (error) {
    console.log('❌ GET stores failed:', error.message);
  }
  
  // Test POST store
  const testStore = {
    name: "Test Store API",
    description: "A test store created via API",
    email: "test@api.com",
    phone: "0501234567",
    address: "123 API Test Street",
    location_lat: 21.4858,
    location_lng: 39.1925,
    delivery_range: 10,
    delivery_fee: 5,
    min_order_amount: 50,
    theme_color: "#FF5722"
  };
  
  try {
    const postResponse = await fetch(`${baseUrl}/api/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testStore)
    });
    
    const postData = await postResponse.json();
    console.log('✅ POST store response status:', postResponse.status);
    console.log('   Response:', postData);
    
    if (postData.success && postData.data) {
      const storeId = postData.data.id;
      console.log('   Created store ID:', storeId);
      
      // Test PUT store
      try {
        const updateData = { name: "Updated Test Store API" };
        const putResponse = await fetch(`${baseUrl}/api/stores/${storeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
        
        const putData = await putResponse.json();
        console.log('✅ PUT store response status:', putResponse.status);
        console.log('   Response:', putData);
      } catch (error) {
        console.log('❌ PUT store failed:', error.message);
      }
      
      // Test DELETE store
      try {
        const deleteResponse = await fetch(`${baseUrl}/api/stores/${storeId}`, {
          method: 'DELETE'
        });
        
        const deleteData = await deleteResponse.json();
        console.log('✅ DELETE store response status:', deleteResponse.status);
        console.log('   Response:', deleteData);
      } catch (error) {
        console.log('❌ DELETE store failed:', error.message);
      }
    }
  } catch (error) {
    console.log('❌ POST store failed:', error.message);
  }
}

testBackend();