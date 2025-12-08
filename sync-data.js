/* sync-data.js */
const mongoose = require('mongoose');
require('dotenv').config();

// 1. Define the Student Schema (Must match server.js exactly)
const studentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: String,
    course: String,
    section: String,
    cell: String,
    email: String,
    address: String,
    professorUid: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const sync = async () => {
    console.log("🔄 STARTING SYNC: Local -> Cloud...");

    // 2. Open two separate connections simultaneously
    const localConn = mongoose.createConnection(process.env.MONGO_URI_LOCAL);
    const cloudConn = mongoose.createConnection(process.env.MONGO_URI_CLOUD);

    const LocalStudent = localConn.model('Student', studentSchema);
    const CloudStudent = cloudConn.model('Student', studentSchema);

    // 3. Get all data from your computer
    const localData = await LocalStudent.find({});
    console.log(`📂 Found ${localData.length} students stored locally.`);

    if (localData.length === 0) {
        console.log("No data to sync.");
        process.exit();
    }

    // 4. Upload to Cloud (Update existing ones, Create new ones)
    console.log("☁️  Uploading to Atlas...");
    let count = 0;
    
    for (const doc of localData) {
        // Find by ID + ProfessorUID to ensure unique student per professor
        await CloudStudent.findOneAndUpdate(
            { id: doc.id, professorUid: doc.professorUid }, 
            doc.toObject(),
            { upsert: true, new: true } // Create if missing
        );
        count++;
        process.stdout.write("."); // Show progress dots
    }

    console.log(`\n✅ SYNC COMPLETE! Successfully processed ${count} records.`);
    
    // Close connections
    await localConn.close();
    await cloudConn.close();
    process.exit();
};

sync().catch(err => {
    console.error("Sync Failed:", err);
    process.exit(1);
});