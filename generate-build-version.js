/* generate-build-version.js */
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const META_FILE_PATH = path.join(__dirname, 'src', 'meta.js');

// 1. Get version from package.json
let appVersion = '0.0.0';
try {
    const packageJson = require('./package.json');
    appVersion = packageJson.version;
} catch (e) {
    console.warn('⚠️ package.json not found, using default version.');
}

// 2. Get latest git commit hash (Robust Fallback)
let commitHash = 'dev-local';
try {
    // Check if .git exists to avoid errors in non-git environments
    if (fs.existsSync(path.join(__dirname, '.git'))) {
        commitHash = childProcess
            .execSync('git rev-parse --short HEAD')
            .toString()
            .trim();
    }
} catch (e) {
    // Silently fail to default 'dev-local' if git command missing or fails
}

// 3. Create the content (Strictly ESM format to satisfy Webpack)
const fileContent = `/* eslint-disable */
// This file is auto-generated. Do not edit.
export const APP_VERSION = "${appVersion}";
export const BUILD_HASH = "${commitHash}";
export const BUILD_DATE = "${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}";
`;

// 4. Save file safely
try {
    // Ensure src directory exists recursively
    const srcDir = path.join(__dirname, 'src');
    if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir, { recursive: true });
    }
    
    fs.writeFileSync(META_FILE_PATH, fileContent);
    console.log(`✅ Meta file generated: v${appVersion} [${commitHash}]`);
} catch (error) {
    console.error("❌ Failed to write meta.js:", error);
    // Do NOT exit process(1). If this fails, we want to try to let React run anyway
    // (though it might fail on import, at least we logged the error).
}