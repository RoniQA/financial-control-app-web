#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Building Frontend for Production...');

try {
  // Ensure we're in the correct directory
  process.chdir(__dirname);
  
  console.log('📁 Current directory:', process.cwd());
  
  const frontendPath = path.join(__dirname, 'apps', 'frontend');
  console.log('📁 Frontend path:', frontendPath);
  
  // Check if frontend directory exists
  if (!fs.existsSync(frontendPath)) {
    throw new Error('Frontend directory not found');
  }
  
  // Install dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('npm ci', { 
    stdio: 'inherit',
    cwd: frontendPath 
  });
  
  // Build frontend
  console.log('🔧 Building frontend...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: frontendPath 
  });
  
  // Verify build
  const distPath = path.join(frontendPath, 'dist');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log('✅ Frontend build completed successfully!');
    console.log('📁 Build files:', files);
  } else {
    throw new Error('Frontend build failed - dist folder not found');
  }
  
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}
