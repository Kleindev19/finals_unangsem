// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs'); 
const path = require('path'); 
const { decrypt } = require('./security'); 
const nodemailer = require('nodemailer'); 
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIG ---
// 🛑 FIX APPLIED: Renamed the key persistence file path
const KEY_FILE_PATH = path.join(__dirname, 'neural_network_node.json'); 

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// ==========================================
// 1. SCHEMAS & MODELS (No Change)
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

// --- STUDENT SCHEMA (UPDATED WITH AI ANALYTICS) ---
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
    createdAt: { type: Date, default: Date.now },
    
    // --- SCORES ---
    midtermScores: { type: Object, default: {} },
    finalScores: { type: Object, default: {} },

    // --- AI ANALYTICS FIELD ---
    aiAnalytics: {
        lastAnalyzed: { type: Date },
        riskLevel: { type: String, default: 'Pending' }, 
        summary: { type: String, default: 'No analysis generated yet.' },
        recommendation: { type: String, default: 'Click "Re-analyze" to generate insights.' }, 
        prediction: { type: String, default: 'N/A' }, 
        history: [{ 
            date: { type: Date, default: Date.now },
            riskLevel: String,
            note: String
        }]
    }
});

const Student = mongoose.model('Student', studentSchema);

// ==========================================
// 2. SECURE CONFIGURATION & CONNECTION (No Change)
// ==========================================

// A. DECRYPT EMAIL CREDENTIALS (SECURE MODE)
let mailTransporter = null;

const setupMailer = () => {
    console.log("------------------------------------------------");
    console.log("📧 [SYSTEM] Configuring Email Service...");
    try {
        const encUser = process.env.MAIL_USER_ENC;
        const encPass = process.env.MAIL_PASS_ENC;

        if (!encUser || !encPass) {
            console.warn("⚠️  [SYSTEM] Missing Encrypted Credentials in .env");
            return;
        }

        console.log("🔐 [SYSTEM] Decrypting Credentials...");
        const realUser = decrypt(encUser);
        const realPass = decrypt(encPass);

        if (realUser && realPass) {
            mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: realUser,
                    pass: realPass
                }
            });
            console.log("✅ [SYSTEM] Email System: READY (Secure Mode)");
        } else {
            console.error("❌ [SYSTEM] Decryption result was invalid. Check MASTER_KEY.");
        }
    } catch (e) {
        console.error("❌ [SYSTEM] Critical Mailer Error:", e.message);
    }
    console.log("------------------------------------------------");
};

// Initialize Mailer
setupMailer();

// B. CONNECT TO DATABASE
const connectDB = async () => {
    try {
        console.log("🔐 [DB] Decrypting Cloud Credentials...");
        
        // Decrypt the Mongo URI if it exists
        const onlineURI = process.env.MONGO_URI_CLOUD ? decrypt(process.env.MONGO_URI_CLOUD) : null;
        
        if (onlineURI) {
            console.log("☁️  [DB] Connecting to MongoDB Atlas...");
            await mongoose.connect(onlineURI, {
                serverSelectionTimeoutMS: 5000 
            });
            console.log("✅ [DB] Connected: MongoDB Atlas (Online Mode)");
        } else {
            console.warn("⚠️  [DB] No Cloud URI found or decryption failed.");
            throw new Error("Cloud URI missing");
        }
        
    } catch (err) {
        console.warn("⚠️  [DB] Connection issue. Switching to Local Database...");
        try {
            await mongoose.connect(process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/student_tracker_db');
            console.log("✅ [DB] Connected: Localhost (Offline Mode)");
        } catch (localErr) {
            console.error("❌ [DB] CRITICAL ERROR: Could not connect to ANY database.");
            console.error(localErr);
        }
    }
};

connectDB();


// ==========================================
// 3. API ROUTES (Existing Routes)
// ==========================================

// --- EMAIL ENDPOINT (SECURE) ---
app.post('/api/send-email', async (req, res) => {
    const { to, subject, html, studentName } = req.body;
    
    console.log(`\n📨 [EMAIL] Request for Student: ${studentName || "Unknown"}`);

    // 1. CHECK MAILER CONFIG
    if (!mailTransporter) {
        console.error("❌ [EMAIL ERROR] Server Mailer is NOT initialized.");
        return res.status(500).json({ error: "Server email system not configured properly." });
    }

    // 2. CHECK RECIPIENT
    if (!to || to.trim() === "" || to === "undefined") {
        console.error("❌ [EMAIL ERROR] No valid email address provided.");
        return res.status(400).json({ error: "Student missing email address." });
    }

    try {
        // 3. SEND EMAIL
        const info = await mailTransporter.sendMail({
            from: '"Progress Tracker" <ferrerajoshlander@gmail.com>', 
            to: to,
            subject: subject,
            html: html
        });

        console.log(`✅ [EMAIL SUCCESS] Sent to ${to}`);
        res.json({ success: true, message: "Email sent successfully" });

    } catch (error) {
        console.error("❌ [SMTP ERROR]:", error.message);
        
        let userMessage = "Failed to send email.";
        if (error.code === 'EAUTH') userMessage = "Server Authentication Failed.";
        
        res.status(500).json({ error: userMessage, details: error.message });
    }
});


// --- ANALYTICS SAVE ENDPOINT ---
app.post('/api/students/:id/analyze', async (req, res) => {
    const { id } = req.params;
    const { riskLevel, summary, recommendation, prediction } = req.body;

    console.log(`🧠 Saving AI Analysis for Student: ${id}`);

    try {
        const student = await Student.findOne({ id });
        if (!student) return res.status(404).json({ message: "Student not found" });

        student.aiAnalytics.lastAnalyzed = new Date();
        student.aiAnalytics.riskLevel = riskLevel;
        student.aiAnalytics.summary = summary;
        student.aiAnalytics.recommendation = recommendation;
        student.aiAnalytics.prediction = prediction;
        
        student.aiAnalytics.history.push({
            date: new Date(),
            riskLevel: riskLevel,
            note: summary
        });

        await student.save();
        res.json({ success: true, aiAnalytics: student.aiAnalytics });

    } catch (error) {
        console.error("❌ Analysis Save Error:", error);
        res.status(500).json({ message: "Failed to save analysis" });
    }
});

// --- AUTO-SYNC ENDPOINT ---
app.post('/api/sync-now', async (req, res) => {
    console.log("🔄 Auto-Sync Triggered...");
    const onlineURI = process.env.MONGO_URI_CLOUD ? decrypt(process.env.MONGO_URI_CLOUD) : null;
    
    if(!onlineURI) return res.status(500).json({ error: "No cloud URI configured" });

    const localConn = mongoose.createConnection(process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/student_tracker_db');
    const cloudConn = mongoose.createConnection(onlineURI);

    const LocalModel = localConn.model('Student', studentSchema);
    const CloudModel = cloudConn.model('Student', studentSchema);

    try {
        const localData = await LocalModel.find({});
        let count = 0;
        for (const doc of localData) {
            await CloudModel.findOneAndUpdate(
                { id: doc.id, professorUid: doc.professorUid },
                doc.toObject(),
                { upsert: true, new: true }
            );
            count++;
        }
        console.log(`✅ Sync Finished: ${count} records.`);
        res.json({ success: true, count });
    } catch (error) {
        console.error("❌ Sync Failed:", error);
        res.status(500).json({ error: "Sync failed" });
    } finally {
        await localConn.close();
        await cloudConn.close();
    }
});

// --- USER ROUTES ---
app.post('/api/user-sync', async (req, res) => {
    const { uid, email, displayName, photoURL } = req.body;
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
        res.status(500).json({ message: "Server Error syncing user" });
    }
});

app.put('/api/user-update/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const updatedUser = await User.findOneAndUpdate({ uid }, { $set: req.body }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile" });
    }
});

// --- STUDENT ROUTES ---
app.post('/api/students', async (req, res) => {
    try {
        if (!req.body.id || !req.body.name || !req.body.professorUid) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Check for existing student ID under the specific professor's UID
        const existingStudent = await Student.findOne({ id: req.body.id, professorUid: req.body.professorUid });
        if (existingStudent) return res.status(400).json({ message: `Student ID ${req.body.id} already exists` });
        
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({ message: "Error saving student" });
    }
});

app.get('/api/students/:professorUid/:section', async (req, res) => {
    const { professorUid, section } = req.params;
    const query = { professorUid };
    if (section !== 'All Sections') query.section = { $regex: new RegExp(`^${section}$`, 'i') };
    
    try {
        const students = await Student.find(query).sort({ name: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students" });
    }
});

app.put('/api/students/:id/scores', async (req, res) => {
    const { id } = req.params;
    const { term, scores } = req.body; 
    try {
        let updateField = {};
        if (term === 'midterm') updateField.midtermScores = scores; 
        else if (term === 'final') updateField.finalScores = scores; 
        
        const updatedStudent = await Student.findOneAndUpdate({ id }, { $set: updateField }, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: "Error updating scores" });
    }
});

app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedStudent = await Student.findOneAndUpdate({ id }, req.body, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: "Error updating student" });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedStudent = await Student.findOneAndDelete({ id });
        if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student" });
    }
});

// ==========================================
// 4. NEW: STUDENT SHARING ROUTES (The Share Fix)
// ==========================================

// GET: Fetches a student roster based on Professor UID and Section name.
// Used by a receiving professor when they paste a share link.
app.get('/api/share/students/:professorUid/:section', async (req, res) => {
    const { professorUid, section } = req.params;

    // Decode URL-encoded section name
    const decodedSection = decodeURIComponent(section);
    
    if (!professorUid || !decodedSection) {
        return res.status(400).json({ message: "Invalid share link parameters." });
    }

    try {
        // Query the database for students belonging to the specified professor and section
        const students = await Student.find({ 
            professorUid: professorUid, 
            section: { $regex: new RegExp(`^${decodedSection}$`, 'i') } // Case-insensitive exact match
        }).select('id name type course section email cell address').sort({ name: 1 }); // Select only essential fields

        if (students.length === 0) {
            return res.status(404).json({ message: "No students found for this class section, or the link is expired/invalid." });
        }

        // Success: Return the clean roster data
        res.json({
            success: true,
            roster: students,
            sectionName: decodedSection,
            professorId: professorUid
        });

    } catch (error) {
        console.error("❌ Share Link Fetch Error:", error);
        res.status(500).json({ message: "Failed to retrieve shared roster." });
    }
});


// ==========================================
// 5. KEY PERSISTENCE ROUTES (FILE MANAGEMENT)
// ==========================================

// GET: Load Encrypted Key from JSON file
app.get('/api/keys', (req, res) => {
    try {
        if (fs.existsSync(KEY_FILE_PATH)) {
            const data = fs.readFileSync(KEY_FILE_PATH, 'utf8');
            const keyData = JSON.parse(data);
            console.log("🔐 [KEY] Loaded encrypted cipher from JSON file.");
            // Send back the cipher object { key_cipher: "..." }
            return res.json(keyData); 
        } else {
            // File does not exist, return an empty object (no key found)
            console.log("🔓 [KEY] Key file not found. Returning empty object.");
            return res.json({});
        }
    } catch (error) {
        console.error("❌ [KEY ERROR] Error reading key file:", error.message);
        res.status(500).json({ error: "Failed to read key file." });
    }
});

// POST: Save Encrypted Key to JSON file
app.post('/api/keys', (req, res) => {
    const { key_cipher, timestamp } = req.body;
    
    if (!key_cipher) {
        return res.status(400).json({ message: "Missing encrypted key cipher." });
    }

    try {
        const keyData = { key_cipher, timestamp };
        // Write data to the JSON file, creating it if it doesn't exist
        fs.writeFileSync(KEY_FILE_PATH, JSON.stringify(keyData, null, 2), 'utf8');
        console.log(`✅ [KEY] Successfully wrote encrypted cipher to ${path.basename(KEY_FILE_PATH)}.`);
        res.json({ success: true, message: "Key saved successfully to file." });

    } catch (error) {
        console.error("❌ [KEY ERROR] Error writing key file:", error);
        res.status(500).json({ error: "Failed to write key file." });
    }
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));