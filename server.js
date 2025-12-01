// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
// Make sure your MongoDB is running!
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/student_tracker_db";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

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

// --- STUDENT SCHEMA (Add this!) ---
const studentSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Student ID (e.g. 23-01360)
    name: { type: String, required: true },
    type: String,   // Regular / Irregular
    course: String, // BSIT, etc.
    section: String,// 3D, etc.
    cell: String,
    email: String,
    address: String,
    // Links student to the professor who added them
    professorUid: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);


// ==========================================
// 2. API ROUTES
// ==========================================

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
        console.error("❌ Sync Error:", error);
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

// --- B. STUDENT ROUTES (These were missing!) ---

// 1. Add a new Student
app.post('/api/students', async (req, res) => {
    console.log("📥 Receiving student data:", req.body);
    try {
        // Create new student from frontend data
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        
        console.log(`✅ Student Added: ${savedStudent.name}`);
        res.status(201).json(savedStudent);
    } catch (error) {
        console.error("❌ Add Student Error:", error);
        res.status(400).json({ message: "Error saving student", error: error.message });
    }
});

// 2. Get Students (Filtered by Professor & Section)
app.get('/api/students/:professorUid/:section', async (req, res) => {
    const { professorUid, section } = req.params;
    console.log(`🔎 Fetching students for Prof: ${professorUid}, Section: ${section}`);
    
    // If section is "All Sections", remove the filter
    const query = { professorUid };
    if (section !== 'All Sections') {
        // Use a case-insensitive regex for section matching to be safe
        query.section = { $regex: new RegExp(`^${section}$`, 'i') };
    }

    try {
        const students = await Student.find(query).sort({ name: 1 }); // Sort alphabetically
        res.json(students);
    } catch (error) {
        console.error("❌ Fetch Students Error:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));