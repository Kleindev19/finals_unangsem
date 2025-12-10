/**
 * server.js
 * * Backend Express server for the Progress Tracker application.
 * Handles database connection (MongoDB), API endpoints, and data synchronization.
 * * IMPORTANT: This server is configured to run in 'OFFLINE' mode by default. 
 * To enable database synchronization, change DB_MODE to 'ONLINE'.
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const JWT_SECRET = 'your_jwt_secret_key'; // CHANGE THIS IN PRODUCTION
const DB_MODE = 'ONLINE'; // 'ONLINE' or 'OFFLINE'

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ==========================================
// 1. DATABASE CONNECTION
// ==========================================

const MONGO_URI = 'mongodb+srv://admin:pass123@cluster0.abcde.mongodb.net/progress-tracker?retryWrites=true&w=majority'; // Replace with your connection string

if (DB_MODE === 'ONLINE') {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ MongoDB connected successfully.'))
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
            // Optionally, switch to offline mode if connection fails
            // DB_MODE = 'OFFLINE';
        });
} else {
    console.log('⚠️ Running in OFFLINE mode. Database connection skipped.');
}

// ==========================================
// 2. MONGOOSE SCHEMAS AND MODELS
// ==========================================

// --- USER SCHEMA ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
}, { timestamps: true });

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

// --- SECTION SCHEMA ---
const sectionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    sectionName: { type: String, required: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
}, { timestamps: true });

const Section = mongoose.model('Section', sectionSchema);

// --- STUDENT SCHEMA ---
const studentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    sectionId: { type: String, required: true },
    studentId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// --- GRADESHEET DATA SCHEMA (MODIFIED) ---
const gradesheetDataSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    sectionId: { type: String, required: true, unique: true }, // Unique per section
    
    // MODIFIED: Use separate keys for Midterm and Finals
    midtermScores: { type: Object, default: {} }, // New field for Midterm records
    finalsScores: { type: Object, default: {} },   // New field for Finals records
    
    attendance: { type: Object, default: {} },
    maxScores: { type: Object, default: {} },
    quizCols: { type: Array, default: [] },
    actCols: { type: Array, default: [] },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const GradesheetData = mongoose.model('GradesheetData', gradesheetDataSchema);


// ==========================================
// 3. AUTHENTICATION (Register)
// ==========================================

app.post('/api/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        const user = new User({ username, password, firstName, lastName });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// ==========================================
// 4. AUTHENTICATION (Login)
// ==========================================

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// ==========================================
// 5. JWT Verification Middleware
// ==========================================

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};

// ==========================================
// 6. SECTION/STUDENT MANAGEMENT
// (Simplified placeholders for CRUD operations)
// ==========================================

// Add a new section
app.post('/api/sections', verifyToken, async (req, res) => {
    try {
        const { sectionName, subjectCode, subjectName } = req.body;
        const newSection = new Section({ userId: req.userId, sectionName, subjectCode, subjectName });
        await newSection.save();
        res.status(201).json(newSection);
    } catch (error) {
        res.status(500).json({ message: 'Error creating section', error: error.message });
    }
});

// Get all sections for the user
app.get('/api/sections', verifyToken, async (req, res) => {
    try {
        const sections = await Section.find({ userId: req.userId });
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sections', error: error.message });
    }
});

// Get students for a specific section
app.get('/api/sections/:sectionId/students', verifyToken, async (req, res) => {
    try {
        const students = await Student.find({ userId: req.userId, sectionId: req.params.sectionId });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
});

// Add a new student
app.post('/api/sections/:sectionId/students', verifyToken, async (req, res) => {
    try {
        const { studentId, firstName, lastName } = req.body;
        const newStudent = new Student({ 
            userId: req.userId, 
            sectionId: req.params.sectionId, 
            studentId, 
            firstName, 
            lastName 
        });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Student ID already exists in this section.' });
        }
        res.status(500).json({ message: 'Error creating student', error: error.message });
    }
});

// ==========================================
// 7. DATA RETRIEVAL (Load Gradesheet)
// ==========================================

app.get('/api/gradesheet/:sectionId', verifyToken, async (req, res) => {
    if (DB_MODE !== 'ONLINE') {
        return res.status(200).json({ message: 'Load skipped (Offline Mode)', data: {} });
    }
    try {
        const gradesheetData = await GradesheetData.findOne({ 
            userId: req.userId, 
            sectionId: req.params.sectionId 
        });

        if (gradesheetData) {
            console.log(`✅ MongoDB Load Success: Gradesheet data for section ${req.params.sectionId} retrieved.`);
            res.json({ message: 'Data loaded successfully', data: gradesheetData });
        } else {
            console.log(`⚠️ MongoDB Load Warning: No existing gradesheet data found for section ${req.params.sectionId}.`);
            res.status(200).json({ message: 'No existing data', data: {} });
        }
    } catch (error) {
        console.error("❌ MongoDB Load Error:", error.message);
        res.status(500).json({ message: "Error loading data", error: error.message });
    }
});

// ==========================================
// 8. DATA SYNCHRONIZATION (Sync-Now)
// ==========================================

app.post('/api/sync-now', verifyToken, async (req, res) => {
    if (DB_MODE !== 'ONLINE') {
        console.log('⚠️ Sync blocked: Running in OFFLINE mode.');
        return res.status(200).json({ message: 'Sync skipped (Offline Mode)' });
    }
    
    try {
        const { userId, sectionId, attendance, maxScores, quizCols, actCols, midtermScores, finalsScores } = req.body;

        // Sanitize scores to ensure only non-null objects are stored
        const safeMidtermScores = midtermScores || {};
        const safeFinalsScores = finalsScores || {};
        
        // ADDED DEBUG LOG: Check received record counts for Midterm and Finals
        const midCount = Object.keys(safeMidtermScores).length;
        const finCount = Object.keys(safeFinalsScores).length;
        console.log(`DEBUG (Sync): Received ${midCount} midterm records and ${finCount} finals records.`);

        const updateData = {
            attendance: attendance || {},
            maxScores: maxScores || {},
            quizCols: quizCols || [],
            actCols: actCols || [],
            // Set the new separate score fields
            midtermScores: safeMidtermScores, 
            finalsScores: safeFinalsScores,
            updatedAt: Date.now(),
        };

        // Attempt to find and update the existing document
        const existingData = await GradesheetData.findOneAndUpdate(
            { userId, sectionId },
            { $set: updateData },
            { new: true, upsert: true } // Upsert: Create a new document if none exists
        );

        if (existingData) {
            // ADDED DEBUG LOG: Confirms successful MongoDB operation
            const isNew = existingData.createdAt.getTime() === existingData.updatedAt.getTime();
            console.log(`✅ MongoDB Sync Success: Gradesheet data for section ${sectionId} ${isNew ? 'created (upsert)' : 'updated'}.`);
            res.json({ message: 'Sync successful', data: existingData });
        } else {
            // This should rarely happen due to upsert: true, but good practice
            console.log(`❌ MongoDB Sync Failure: Could not find or create gradesheet data for section ${sectionId}.`);
            res.status(500).json({ message: 'Sync failed: Database error' });
        }

    } catch (error) {
        // ADDED DEBUG LOG: Catches and logs any database query errors
        console.error("❌ MongoDB Sync Error:", error.message); 
        res.status(500).json({ message: "Error syncing data", error: error.message });
    }
});


// ==========================================
// 9. START SERVER
// ==========================================

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});