const axios = require('axios');

async function testSimple() {
  const baseURL = 'https://financial-control-app-web-production.up.railway.app';
  
  try {
    console.log('🔍 Testing simple endpoint...');
    
    const response = await axios.get(`${baseURL}/api/products/test/simple`);
    
    console.log('✅ Simple endpoint successful');
    console.log('📊 Response:', response.data);
    
  } catch (error) {
    console.error('❌ Simple test error:', error.response?.data || error.message);
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Headers:', error.response?.headers);
  }
}

testSimple();
