// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// --- CONNECT TO MONGODB (Standard Port 27017) ---
// Note the database name at the end: '/studenttracker'
mongoose.connect('mongodb://127.0.0.1:27017/studenttracker')
    .then(() => console.log('✅ Connected to MongoDB Local (Standard Port)'))
    .catch(err => console.error('❌ Connection Error:', err));

// --- DATA MODEL ---
const StudentSchema = new mongoose.Schema({
    studentId: String,
    name: String,
    type: String,
    course: String,
    section: String,
    cell: String,
    email: String,
    address: String
});

const StudentModel = mongoose.model('students', StudentSchema);

// --- ROUTES ---
app.get('/api/students', async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const newStudent = new StudentModel(req.body);
        const savedStudent = await newStudent.save();
        res.json(savedStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        await StudentModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Run Backend on Port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});