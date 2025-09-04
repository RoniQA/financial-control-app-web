const axios = require('axios');

async function testAuth() {
  const baseURL = 'https://financial-control-app-web-production.up.railway.app';
  
  try {
    console.log('🔍 Testing authentication...');
    
    // Test login
    console.log('\n🔍 Testing login...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@gestus.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    console.log('📊 User data:', loginResponse.data.user);
    console.log('📊 Access token:', loginResponse.data.accessToken ? 'Present' : 'Missing');
    
    const token = loginResponse.data.accessToken;
    
    // Test products endpoint with auth
    console.log('\n🔍 Testing products endpoint with auth...');
    const productsResponse = await axios.get(`${baseURL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Products endpoint successful');
    console.log('📊 Products count:', productsResponse.data.length);
    console.log('📊 First product:', productsResponse.data[0]);
    
    // Test debug endpoint
    console.log('\n🔍 Testing debug endpoint...');
    const debugResponse = await axios.get(`${baseURL}/api/products/test/debug`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Debug endpoint successful');
    console.log('📊 Debug data:', debugResponse.data);
    
  } catch (error) {
    console.error('❌ Auth test error:', error.response?.data || error.message);
  }
}

testAuth();
