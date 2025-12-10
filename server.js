// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { decrypt } = require('./security'); // IMPORT SECURITY MODULE
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- GLOBAL STATE FOR DB MODE (NEW) ---
let DB_MODE = 'N/A'; // Tracks the current connection mode: 'ONLINE', 'LOCAL', or 'N/A'

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// ==========================================
// 1. SCHEMAS & MODELS
// ==========================================

// --- USER SCHEMA (Professor) ---
const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: String,
    photoURL: String, 
    role: { type: String, default: 'Professor' },
    stats: {
        reportsGenerated: { type: Number, default: 0 },
        totalSystemUsers: { type: Number, default: 0 },
        activeSectionsManaged: { type: Number, default: 0 }
    },
    lastLogin: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// --- STUDENT SCHEMA ---
const studentSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Student ID (e.g. 23-01360)
    name: { type: String, required: true },
    type: String,   // Regular / Irregular
    course: String, // BSIT, etc.
    section: String,// 3D, etc.
    cell: String,
    email: String,
    address: String,
    professorUid: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// ==========================================
// 2. SMART & SECURE DATABASE CONNECTION
// ==========================================
const connectDB = async () => {
    try {
        console.log("🔐 Decrypting Cloud Credentials...");
        
        // 1. Decrypt the password from .env
        const onlineURI = decrypt(process.env.MONGO_URI_CLOUD);
        
        if (!onlineURI) {
            throw new Error("Failed to decrypt Cloud URI. Check MASTER_KEY.");
        }

        console.log("☁️  Attempting to connect to MongoDB Atlas (Online)...");
        
        // 2. Connect using the decrypted string
        await mongoose.connect(onlineURI, {
            serverSelectionTimeoutMS: 5000 
        });
        console.log("✅ CONNECTED TO: MongoDB Atlas (Online Mode)");
        DB_MODE = 'ONLINE'; // Set global mode on successful Atlas connection
        
    } catch (err) {
        console.warn("⚠️  Internet connection failed or Atlas is unreachable.");
        console.warn("🔄 Switching to Local Database...");
        try {
            // Fallback to Local Connection (No encryption needed for localhost)
            await mongoose.connect(process.env.MONGO_URI_LOCAL);
            console.log("✅ CONNECTED TO: Localhost (Offline Mode)");
            DB_MODE = 'LOCAL'; // Set global mode on successful Localhost connection
        } catch (localErr) {
            console.error("❌ CRITICAL ERROR: Could not connect to ANY database (Online or Local).");
            console.error(localErr);
        }
    }
};

// Initialize DB Connection
connectDB();


// ==========================================
// 3. API ROUTES
// ==========================================

// --- AUTO-SYNC ENDPOINT (MODIFIED TO CHECK DB MODE) ---
app.post('/api/sync-now', async (req, res) => {
    console.log("🔄 Auto-Sync Triggered by Frontend...");
    
    // Check if the server is running in Online Mode (Atlas)
    if (DB_MODE !== 'ONLINE') {
        console.warn("❌ Sync Aborted: Server is not connected to MongoDB Atlas.");
        return res.status(503).json({ 
            success: false, 
            message: "Sync failed. Server is currently running in Localhost (Offline) mode." 
        });
    }

    // 1. Decrypt the Cloud URI again for this specific connection
    const onlineURI = decrypt(process.env.MONGO_URI_CLOUD);
    
    // 2. Open temporary connections
    const localConn = mongoose.createConnection(process.env.MONGO_URI_LOCAL);
    const cloudConn = mongoose.createConnection(onlineURI);

    const LocalModel = localConn.model('Student', studentSchema);
    const CloudModel = cloudConn.model('Student', studentSchema);

    try {
        const localData = await LocalModel.find({});
        let count = 0;

        // 3. Push Local -> Cloud
        for (const doc of localData) {
            await CloudModel.findOneAndUpdate(
                { id: doc.id, professorUid: doc.professorUid },
                doc.toObject(),
                { upsert: true, new: true }
            );
            count++;
        }

        console.log(`✅ Auto-Sync Finished: ${count} records synced to Cloud.`);
        res.json({ success: true, count, message: "Sync Complete" });

    } catch (error) {
        console.error("❌ Sync Failed:", error);
        res.status(500).json({ error: "Sync failed" });
    } finally {
        // 4. Clean up connections
        await localConn.close();
        await cloudConn.close();
    }
});


// --- A. USER ROUTES ---

app.post('/api/user-sync', async (req, res) => {
    const { uid, email, displayName, photoURL } = req.body;
    console.log(`🔄 Syncing user: ${email}`);

    try {
        const user = await User.findOneAndUpdate(
            { uid: uid },
            { 
                $set: { email, displayName, photoURL, lastLogin: new Date() },
                $setOnInsert: { role: 'Professor', stats: { reportsGenerated: 0, totalSystemUsers: 0, activeSectionsManaged: 0 } }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(user);
    } catch (error) {
        console.error("❌ User Sync Error:", error);
        res.status(500).json({ message: "Server Error syncing user" });
    }
});

app.put('/api/user-update/:uid', async (req, res) => {
    const { uid } = req.params;
    const { displayName, email } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate({ uid }, { $set: { displayName, email } }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile" });
    }
});

// --- B. STUDENT ROUTES ---

// 1. Add a new Student
app.post('/api/students', async (req, res) => {
    console.log("📥 Receiving student data:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.id || !req.body.name || !req.body.professorUid) {
            return res.status(400).json({ 
                message: "Missing required fields: id, name, or professorUid" 
            });
        }

        // Check if student ID already exists for this professor
        const existingStudent = await Student.findOne({ 
            id: req.body.id, 
            professorUid: req.body.professorUid 
        });
        
        if (existingStudent) {
            return res.status(400).json({ 
                message: `Student ID ${req.body.id} already exists in your records` 
            });
        }

        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        
        console.log(`✅ Student Added: ${savedStudent.name} (ID: ${savedStudent.id})`);
        res.status(201).json(savedStudent);
    } catch (error) {
        console.error("❌ Add Student Error:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ message: "Student ID already exists in the database" });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation Error: ${error.message}` });
        }
        
        res.status(500).json({ message: "Error saving student", error: error.message });
    }
});

// 2. Get Students by Professor and Section
app.get('/api/students/:professorUid/:section', async (req, res) => {
    const { professorUid, section } = req.params;
    console.log(`🔎 Fetching students for Prof: ${professorUid}, Section: ${section}`);
    
    const query = { professorUid };
    
    // If section is "All Sections", don't filter by section
    if (section !== 'All Sections') {
        query.section = { $regex: new RegExp(`^${section}$`, 'i') };
    }

    try {
        const students = await Student.find(query).sort({ name: 1 });
        console.log(`✅ Found ${students.length} students`);
        res.json(students);
    } catch (error) {
        console.error("❌ Fetch Students Error:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

// 3. Update a Student
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`📝 Updating student: ${id}`);
    
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { id },
            req.body,
            { new: true }
        );
        
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        console.log(`✅ Student Updated: ${updatedStudent.name}`);
        res.json(updatedStudent);
    } catch (error) {
        console.error("❌ Update Student Error:", error);
        res.status(500).json({ message: "Error updating student" });
    }
});

// 4. Delete a Student
app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`🗑️ Deleting student: ${id}`);
    
    try {
        const deletedStudent = await Student.findOneAndDelete({ id });
        
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        console.log(`✅ Student Deleted: ${deletedStudent.name}`);
        res.json({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error) {
        console.error("❌ Delete Student Error:", error);
        res.status(500).json({ message: "Error deleting student" });
    }
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));