#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Building Gestus for Production...');

try {
  // Ensure we're in the correct directory
  process.chdir(__dirname);
  
  console.log('📁 Current directory:', process.cwd());
  
  // Install dependencies for frontend
  console.log('📦 Installing frontend dependencies...');
  execSync('cd apps/frontend && npm ci', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  // Build frontend
  console.log('🔧 Building frontend...');
  execSync('cd apps/frontend && npm run build', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  // Verify frontend build
  const frontendDistPath = path.join(__dirname, 'apps', 'frontend', 'dist');
  if (fs.existsSync(frontendDistPath)) {
    const files = fs.readdirSync(frontendDistPath);
    console.log('✅ Frontend build completed:', files);
  } else {
    throw new Error('Frontend build failed - dist folder not found');
  }
  
  // Install dependencies for backend
  console.log('📦 Installing backend dependencies...');
  execSync('cd apps/backend && npm ci', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  // Build backend
  console.log('🔧 Building backend...');
  execSync('cd apps/backend && npm run build', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  // Verify backend build
  const backendDistPath = path.join(__dirname, 'apps', 'backend', 'dist');
  if (fs.existsSync(backendDistPath)) {
    const files = fs.readdirSync(backendDistPath);
    console.log('✅ Backend build completed:', files);
  } else {
    throw new Error('Backend build failed - dist folder not found');
  }
  
  console.log('🎉 Production build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
