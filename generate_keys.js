// generate_keys.js
const { encrypt } = require('./security');

// 1. YOUR CREDENTIALS
const MY_EMAIL = "ferrerajoshlander@gmail.com";
const MY_APP_PASS = "febf prxu kleb txoy";

console.log("🔐 GENERATING SECURE CREDENTIALS...\n");

// 2. ENCRYPT THEM
const encryptedEmail = encrypt(MY_EMAIL);
const encryptedPass = encrypt(MY_APP_PASS);

// 3. OUTPUT FOR .env
console.log("👇 COPY THESE LINES INTO YOUR .env FILE 👇");
console.log("------------------------------------------------");
console.log(`MAIL_USER_ENC=${encryptedEmail}`);
console.log(`MAIL_PASS_ENC=${encryptedPass}`);
console.log("------------------------------------------------");
console.log("\n⚠️  Delete this file (generate_keys.js) after you are done!");