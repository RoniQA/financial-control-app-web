#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Gestus Fullstack Application...');

try {
  // Change to project root directory
  process.chdir(__dirname);
  console.log('📁 Current directory:', process.cwd());

  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production';
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

  if (isProduction) {
    console.log('🔧 Building application...');
    
    // Build backend
    console.log('📦 Building backend...');
    execSync('cd apps/backend && npm run build', { stdio: 'inherit' });
    
    // Build frontend
    console.log('📦 Building frontend...');
    execSync('cd apps/frontend && npm run build', { stdio: 'inherit' });
    
    // Copy frontend files to backend
    console.log('📋 Copying frontend files...');
    execSync('node copy-frontend.js', { stdio: 'inherit' });
    
    console.log('✅ Build completed successfully');
  }

  // Check if frontend files exist
  const frontendPath = path.join(__dirname, 'apps/backend/dist/frontend');
  if (fs.existsSync(frontendPath)) {
    console.log('✅ Frontend files found at:', frontendPath);
  } else {
    console.log('⚠️  Frontend files not found, running API-only mode');
  }

  // Start the backend
  console.log('🚀 Starting backend server...');
  execSync('cd apps/backend && npm run start:prod', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Error starting application:', error.message);
  process.exit(1);
}
