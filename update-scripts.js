
const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add or update test scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
};

// Write the updated package.json back to the file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Successfully updated package.json scripts for Jest testing');
