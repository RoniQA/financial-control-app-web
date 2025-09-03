#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Nova Agro Backend...');

try {
  // Ensure we're in the correct directory
  process.chdir(__dirname);
  
  console.log('📁 Current directory:', process.cwd());
  
  // Generate Prisma Client
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Prisma Client generated successfully');
  
  // Start the application
  console.log('🚀 Starting NestJS application...');
  execSync('node dist/src/main.js', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
} catch (error) {
  console.error('❌ Error starting application:', error.message);
  process.exit(1);
}
