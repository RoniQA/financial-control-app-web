const fs = require('fs');
const path = require('path');

// Source and destination paths
const frontendDistPath = path.join(__dirname, 'apps/frontend/dist');
const backendDistPath = path.join(__dirname, 'apps/backend/dist/frontend');

// Create destination directory if it doesn't exist
if (!fs.existsSync(backendDistPath)) {
  fs.mkdirSync(backendDistPath, { recursive: true });
}

// Copy function
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Check if frontend dist exists
if (fs.existsSync(frontendDistPath)) {
  console.log('Copying frontend files to backend...');
  copyRecursive(frontendDistPath, backendDistPath);
  console.log('Frontend files copied successfully!');
} else {
  console.error('Frontend dist directory not found. Please run "npm run build:frontend" first.');
  process.exit(1);
}
