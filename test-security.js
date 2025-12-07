const { encrypt, decrypt } = require('./security');

console.log("🔐 SECURITY SYSTEM TEST\n");

// 1. THE SECRET DATA (Your Real Mongo URI)
// Replace this string with your REAL connection string to test
const myRealPassword = "mongodb+srv://Laeanhard:Laeanhard@cluster0.yqebx7x.mongodb.net/student_tracker_db?retryWrites=true&w=majority&appName=Cluster0";

console.log("1️⃣  Original String:");
console.log(myRealPassword);

// 2. ENCRYPT IT
const encryptedData = encrypt(myRealPassword);
console.log("\n2️⃣  Encrypted (Safe to put in .env):");
console.log(encryptedData);

// 3. DECRYPT IT (What the server will do)
const decryptedData = decrypt(encryptedData);
console.log("\n3️⃣  Decrypted back to Original:");
console.log(decryptedData);

// 4. VERIFY
if (myRealPassword === decryptedData) {
    console.log("\n✅ SUCCESS: The system works perfectly!");
} else {
    console.log("\n❌ FAIL: The data does not match.");
}