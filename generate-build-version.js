/* generate-build-version.js */
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

// CHANGE 1: Write to meta.json
const META_FILE_PATH = path.join(__dirname, 'src', 'meta.json');

// 1. Get version from package.json
let appVersion = '0.0.0';
try {
    const packageJson = require('./package.json');
    appVersion = packageJson.version;
} catch (e) {
    // defaults to 0.0.0
}

// 2. Get latest git commit hash
let commitHash = 'dev-local';
try {
    if (fs.existsSync(path.join(__dirname, '.git'))) {
        commitHash = childProcess.execSync('git rev-parse --short HEAD').toString().trim();
    }
} catch (e) {
    // defaults to dev-local
}

// CHANGE 2: Create a raw JSON object string
const fileContent = JSON.stringify({
    APP_VERSION: appVersion,
    BUILD_HASH: commitHash,
    BUILD_DATE: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
}, null, 2);

// 3. Save file
try {
    const srcDir = path.join(__dirname, 'src');
    if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir, { recursive: true });
    }
    
    fs.writeFileSync(META_FILE_PATH, fileContent);
    console.log(`✅ Meta JSON generated: v${appVersion} [${commitHash}]`);
} catch (error) {
    console.error("❌ Failed to write meta.json:", error);
}