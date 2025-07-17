import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zip script for Chrome extension
console.log('Creating zip file for Chrome extension...');

const distDir = path.join(__dirname, '../dist');
const zipFileName = 'via-remote-app-extension.zip';
const zipPath = path.join(__dirname, '..', zipFileName);

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory not found. Run "npm run build:extension" first.');
  process.exit(1);
}

try {
  // Remove existing zip if it exists
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    console.log('🗑️  Removed existing zip file');
  }
  
  // Create zip file
  console.log('📦 Creating zip file...');
  execSync(`cd "${distDir}" && zip -r "../${zipFileName}" .`, { stdio: 'inherit' });
  
  // Verify zip was created
  if (fs.existsSync(zipPath)) {
    const stats = fs.statSync(zipPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`✅ Zip file created successfully!`);
    console.log(`📁 Location: ${zipPath}`);
    console.log(`📊 Size: ${fileSizeInMB} MB`);
    console.log(`\n🚀 You can now:`);
    console.log(`   • Drag and drop ${zipFileName} to Chrome extensions page`);
    console.log(`   • Share the zip file with others`);
    console.log(`   • Upload to Chrome Web Store`);
  } else {
    throw new Error('Zip file was not created');
  }
  
} catch (error) {
  console.error('❌ Error creating zip file:', error.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   • Make sure you have zip command available on your system');
  console.log('   • On macOS: brew install zip (if not already installed)');
  console.log('   • On Windows: Use 7-Zip or similar tool');
  console.log('   • On Linux: sudo apt-get install zip (Ubuntu/Debian)');
  process.exit(1);
} 