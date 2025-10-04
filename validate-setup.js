#!/usr/bin/env node

// CelebrateHub Setup Validation Script
// This script checks if the project is properly set up

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkPackageJson(filePath) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0) {
      log(`✅ ${path.basename(filePath)} has dependencies`, 'green');
      return true;
    } else {
      log(`❌ ${path.basename(filePath)} has no dependencies`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${path.basename(filePath)} is invalid JSON`, 'red');
    return false;
  }
}

function checkEnvFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('your-') || content.includes('placeholder')) {
      log(`⚠️  ${description} (has placeholder values)`, 'yellow');
      return false;
    } else {
      log(`✅ ${description}`, 'green');
      return true;
    }
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function main() {
  log('🔍 CelebrateHub Setup Validation', 'blue');
  log('================================', 'blue');
  console.log();

  let allGood = true;

  // Check project structure
  log('📁 Project Structure:', 'blue');
  allGood &= checkDirectory('./client', 'Client directory exists');
  allGood &= checkDirectory('./server', 'Server directory exists');
  allGood &= checkDirectory('./node_modules', 'Root node_modules exists');
  allGood &= checkDirectory('./client/node_modules', 'Client node_modules exists');
  console.log();

  // Check package files
  log('📦 Package Files:', 'blue');
  allGood &= checkFile('./package.json', 'Root package.json exists');
  allGood &= checkFile('./client/package.json', 'Client package.json exists');
  allGood &= checkPackageJson('./package.json', 'Root package.json');
  allGood &= checkPackageJson('./client/package.json', 'Client package.json');
  console.log();

  // Check environment files
  log('🔧 Environment Configuration:', 'blue');
  const envStatus = checkEnvFile('./.env', 'Root .env file');
  const clientEnvStatus = checkEnvFile('./client/.env', 'Client .env file');
  allGood &= (envStatus || checkFile('./.env', 'Root .env file exists'));
  allGood &= (clientEnvStatus || checkFile('./client/.env', 'Client .env file exists'));
  console.log();

  // Check Firebase config
  log('🔥 Firebase Configuration:', 'blue');
  allGood &= checkFile('./client/src/config/firebase.js', 'Firebase config file exists');
  allGood &= checkFile('./server/config/firebase.js', 'Firebase admin config exists');
  console.log();

  // Check if ports are available
  log('🌐 Port Availability:', 'blue');
  const { execSync } = require('child_process');
  
  try {
    execSync('lsof -Pi :3000 -sTCP:LISTEN -t', { stdio: 'ignore' });
    log('⚠️  Port 3000 is in use', 'yellow');
  } catch {
    log('✅ Port 3000 is available', 'green');
  }

  try {
    execSync('lsof -Pi :5001 -sTCP:LISTEN -t', { stdio: 'ignore' });
    log('⚠️  Port 5001 is in use', 'yellow');
  } catch {
    log('✅ Port 5001 is available', 'green');
  }
  console.log();

  // Summary
  if (allGood) {
    log('🎉 Setup validation passed!', 'green');
    log('You can now run: npm run dev', 'blue');
  } else {
    log('⚠️  Setup validation found issues', 'yellow');
    log('Please run: ./setup.sh', 'blue');
  }

  console.log();
  log('📚 Next steps:', 'blue');
  log('1. Configure Firebase (see FIREBASE_SETUP.md)', 'reset');
  log('2. Update .env files with real credentials', 'reset');
  log('3. Set up GitHub OAuth', 'reset');
  log('4. Run: npm run dev', 'reset');
}

main();
