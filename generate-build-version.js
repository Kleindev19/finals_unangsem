/* generate-build-version.js */
const fs = require('fs');
const packageJson = require('./package.json');
const childProcess = require('child_process');

// 1. Get version from package.json
const appVersion = packageJson.version;

// 2. Get latest git commit hash (short)
let commitHash = 'dev';
try {
    commitHash = childProcess
        .execSync('git rev-parse --short HEAD')
        .toString()
        .trim();
} catch (e) {
    // console.log('Git not initialized');
}

// 3. Create the content
const fileContent = `
// This file is auto-generated. Do not edit directly.
export const APP_VERSION = "${appVersion}";
export const BUILD_HASH = "${commitHash}";
export const BUILD_DATE = "${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}";
`;

// 4. Save to src/meta.js
// Ensure src directory exists
if (!fs.existsSync('./src')) {
    fs.mkdirSync('./src');
}
fs.writeFileSync('./src/meta.js', fileContent);

console.log(`✅ Build version generated: v${appVersion} (${commitHash})`);