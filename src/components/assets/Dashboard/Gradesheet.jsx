// src/components/assets/Dashboard/Gradesheet.jsx

import React, { useState } from 'react';
import './Gradesheet.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';

// --- ICONS (Lucide-react style) ---
const ArrowLeft = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
);
const Filter = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const Download = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const Save = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const Plus = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const Upload = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const Search = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const UsersGroup = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

// --- MOCK DATA ---
const GRADES_DATA = [
    { id: '2024001', name: 'Anderson, James', type: 'Irregular', grades: { attendance: 95, assignment: 92, quizzes: 88, activity: 90, midterm: 87, recitation: 95, assignment2: 92, quizzes2: 88, activity2: 90, finals: 87 } },
    { id: '2024002', name: 'Bennett, Sarah', type: 'Regular', grades: { attendance: 70, assignment: 71, quizzes: 70, activity: 67, midterm: 68, recitation: 70, assignment2: 70, quizzes2: 70, activity2: 70, finals: 70 } },
];

const Gradesheet = ({ onLogout, onPageChange }) => {
    // Standard sidebar setup
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);

    // --- UPDATED: Navigate to MultiPageGS ---
    const handleHeaderClick = (title, type) => {
        // We pass the 'viewType' (Activity or Attendance) and the 'title' (e.g. Activity 1)
        onPageChange('multipage-gradesheet', { viewType: type, title: title });
    };

    return (
        <div className="gradesheet-layout">
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange} 
                currentPage="dashboard" // Keep 'Dashboard' highlighted
                onWidthChange={setSidebarWidth} 
            />

            <main className="gradesheet-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* 1. Header Section */}
                <div className="gs-header-container">
                    <div className="gs-header-left">
                        <button className="gs-back-btn" onClick={() => onPageChange('view-studs')}>
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="gs-title">CS101 - Section A</h1>
                            <p className="gs-subtitle">Computer Science • 1st Year • Fall 2024</p>
                        </div>
                    </div>
                    <div className="gs-header-right">
                        <button className="gs-btn gs-btn-white">
                            <Filter size={16} /> Filter
                        </button>
                        <button className="gs-btn gs-btn-white">
                            <Download size={16} /> Export
                        </button>
                        <button className="gs-btn gs-btn-primary">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>

                {/* 2. Toolbar & Search */}
                <div className="gs-toolbar">
                    <div className="gs-tools-left">
                        <button className="gs-tool-btn"><Plus size={14} /> Add Column</button>
                        <button className="gs-tool-btn"><Plus size={14} /> Add Row</button>
                        <button className="gs-tool-btn">Export Excel</button>
                        <button className="gs-icon-only-btn"><Upload size={16} /></button>
                    </div>
                    <div className="gs-search-wrapper">
                        <Search className="gs-search-icon" size={16} />
                        <input type="text" placeholder="Search student..." className="gs-search-input" />
                    </div>
                </div>

                {/* 3. The Spreadsheet Table */}
                <div className="gs-table-wrapper">
                    <table className="gs-table">
                        <thead>
                            <tr>
                                <th className="fixed-col">Student ID</th>
                                <th className="fixed-col">Student Name</th>
                                <th className="fixed-col">Type of Student</th>
                                
                                {/* --- UPDATED: CLICKABLE GRADE COLUMNS --- */}
                                <th>
                                    <button 
                                        className="gs-pill gs-pill-green gs-pill-clickable"
                                        onClick={() => handleHeaderClick('Attendance', 'Attendance')}
                                    >
                                        Attendance
                                    </button>
                                </th>
                                <th>
                                    <button 
                                        className="gs-pill gs-pill-green gs-pill-clickable"
                                        onClick={() => handleHeaderClick('Assignment', 'Activity')}
                                    >
                                        Assignment
                                    </button>
                                </th>
                                <th>
                                    <button 
                                        className="gs-pill gs-pill-green gs-pill-clickable"
                                        onClick={() => handleHeaderClick('Quizzes', 'Activity')}
                                    >
                                        Quizzes
                                    </button>
                                </th>
                                <th>
                                    <button 
                                        className="gs-pill gs-pill-green gs-pill-clickable"
                                        onClick={() => handleHeaderClick('Activity', 'Activity')}
                                    >
                                        Activity
                                    </button>
                                </th>
                                
                                {/* Standard Headers */}
                                <th>Midterm</th>
                                
                                <th>
                                    <button 
                                        className="gs-pill gs-pill-green gs-pill-clickable"
                                        onClick={() => handleHeaderClick('Recitation', 'Activity')}
                                    >
                                        Recitation
                                    </button>
                                </th>
                                <th>
                                    <button 
                                        className="gs-pill gs-pill-green gs-pill-clickable"
                                        onClick={() => handleHeaderClick('Assignment 2', 'Activity')}
                                    >
                                        Assignment
                                    </button>
                                </th>
                                <th>
                                    <button 
                                        className="gs-pill gs-pill-green gs-pill-clickable"
                                        onClick={() => handleHeaderClick('Quizzes 2', 'Activity')}
                                    >
                                        Quizzes
                                    </button>
                                </th>
                                <th>
                                    <button 
                                        className="gs-pill gs-pill-green gs-pill-clickable"
                                        onClick={() => handleHeaderClick('Activity 2', 'Activity')}
                                    >
                                        Activity
                                    </button>
                                </th>
                                
                                <th>Finals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {GRADES_DATA.map((student) => (
                                <tr key={student.id}>
                                    <td className="fixed-col gs-id-cell">{student.id}</td>
                                    <td className="fixed-col font-bold">{student.name}</td>
                                    <td className="fixed-col">
                                        <span className={`gs-badge ${student.type === 'Regular' ? 'badge-reg' : 'badge-irreg'}`}>
                                            {student.type}
                                        </span>
                                    </td>
                                    
                                    {/* Inputs for grades */}
                                    <td><input type="text" defaultValue={student.grades.attendance} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.assignment} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.quizzes} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.activity} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.midterm} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.recitation} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.assignment2} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.quizzes2} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.activity2} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.finals} className="gs-input" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. Footer Summary Card */}
                <div className="gs-footer-card">
                    <div>
                        <span className="gs-footer-label">Total Students</span>
                        <div className="gs-footer-count">8</div>
                    </div>
                    <div className="gs-footer-icon-box">
                        <UsersGroup size={24} />
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Gradesheet;