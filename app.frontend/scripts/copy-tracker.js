const fs = require('fs');
const path = require('path');

// Create the target directory if it doesn't exist
const targetDir = path.join(__dirname, '../assets/public/tinybird');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy the tracker file
const sourceFile = path.join(
  __dirname,
  '../../package.tinybird/dist/tracker.js'
);
const targetFile = path.join(targetDir, 'tracker.js');

try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('✓ Successfully copied tracker.js to public/tinybird/');
} catch (error) {
  console.error('Error copying tracker file:', error);
  process.exit(1);
}
