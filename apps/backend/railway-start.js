#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Gestus Backend on Railway...');

try {
  // Ensure we're in the correct directory
  process.chdir(__dirname);
  
  console.log('📁 Current directory:', process.cwd());
  
  // Log ALL environment variables for debug
  console.log('🔍 Environment check:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV);
  console.log('  - PORT:', process.env.PORT);
  console.log('  - DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('  - JWT_SECRET exists:', !!process.env.JWT_SECRET);
  
  // Log all environment variables that start with DATABASE or POSTGRES
  Object.keys(process.env).forEach(key => {
    if (key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('DB')) {
      const value = process.env[key];
      if (value && value.includes('://')) {
        const maskedValue = value.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
        console.log(`  - ${key}:`, maskedValue);
      } else {
        console.log(`  - ${key}:`, value ? '***' : 'undefined');
      }
    }
  });
  
  if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log('  - DATABASE_URL:', maskedUrl);
  } else {
    console.error('❌ DATABASE_URL not found! Available env vars:');
    Object.keys(process.env).forEach(key => {
      if (key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('DB')) {
        console.log(`    ${key}: ${process.env[key] ? 'exists' : 'undefined'}`);
      }
    });
  }
  
  // Generate Prisma Client
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Prisma Client generated successfully');
  
  // Build frontend if not exists
  console.log('🔍 Checking frontend build...');
  const frontendPath = path.join(__dirname, '..', '..', 'apps', 'frontend');
  const distPath = path.join(frontendPath, 'dist');
  const fs = require('fs');
  
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log('✅ Frontend build found:', files);
  } else {
    console.log('❌ Frontend build not found, building now...');
    try {
      console.log('🔧 Installing frontend dependencies...');
      execSync('npm ci', { 
        stdio: 'inherit',
        cwd: frontendPath 
      });
      
      console.log('🔧 Building frontend...');
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: frontendPath 
      });
      
      console.log('✅ Frontend built successfully');
      
      // Verify build
      if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath);
        console.log('📁 Frontend build files:', files);
      }
    } catch (error) {
      console.error('❌ Frontend build failed:', error.message);
      console.log('⚠️ Continuing with backend only...');
    }
  }
  
  // Run database migrations
  console.log('🔄 Running database migrations...');
  try {
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    console.log('✅ Database migrations completed successfully');
  } catch (migrationError) {
    console.warn('⚠️ Migration failed, continuing anyway:', migrationError.message);
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
