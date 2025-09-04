#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Starting Gestus Backend on Railway...');

try {
  // Ensure we're in the correct directory
  process.chdir(__dirname);
  
  console.log('📁 Current directory:', process.cwd());
  
  // Log environment variables
  console.log('🔍 Environment check:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV);
  console.log('  - PORT:', process.env.PORT);
  console.log('  - DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('  - JWT_SECRET exists:', !!process.env.JWT_SECRET);
  
  // Generate Prisma Client
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Prisma Client generated successfully');
  
  // Run database migrations
  console.log('🔄 Running database migrations...');
  try {
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Failed to run database migrations:', error.message);
    console.log('⚠️ Continuing anyway...');
  }
  
  // Start the application
  console.log('🚀 Starting NestJS application...');
  execSync('node dist/src/main.js', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
} catch (error) {
  console.error('❌ Error starting application:', error.message);
  console.error('❌ Error stack:', error.stack);
  process.exit(1);
}