// src/components/assets/Reports/VReports.jsx

import React, { useState } from 'react';
import './VReports.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';

// --- ICONS (unchanged) ---
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const ChevronDown = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);

// 💡 CRITICAL FIX: Accept sectionData for dynamic header
const VReports = ({ onLogout, onPageChange, sectionData, atRiskStudents = [] }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);

    // 💡 FIX: Dynamically use props for header content
    const sectionCode = sectionData?.code || 'Course Details - Section Report'; 
    const courseName = sectionData?.course || 'Course Details';
    const STUDENT_DATA = atRiskStudents;

    // Helper function to determine status style based on absences
    const getStatusStyle = (absences) => {
        if (absences >= 7) return 'vr-status-high';
        if (absences >= 5) return 'vr-status-medium';
        if (absences >= 3) return 'vr-status-low';
        return '';
    };

    // Helper function to determine text color based on missed classes (absences)
    const getMissedColor = (count) => {
        if (count >= 10) return '#EF4444'; 
        if (count >= 7) return '#F97316'; 
        if (count >= 3) return '#EAB308'; 
        return 'inherit';
    };

    return (
        <div className="vr-layout">
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange}
                currentPage="reports"
                onWidthChange={setSidebarWidth}
            />

            <main className="vr-main" style={{ marginLeft: sidebarWidth }}>
                
                <div className="vr-header">
                    <div className="vr-header-left">
                        <button className="vr-back-btn" onClick={() => onPageChange('reports')}>
                            <ArrowLeft />
                        </button>
                        <div>
                            {/* 💡 FIX: Use dynamic header content */}
                            <h1 className="vr-title">{sectionCode}</h1>
                            <p className="vr-subtitle">{courseName} • 1st Year • Fall 2024</p>
                        </div>
                    </div>

                    <div className="vr-header-right">
                        <div className="vr-search-box">
                            <Search className="vr-search-icon" />
                            <input type="text" placeholder="Search student..." />
                        </div>
                    </div>
                </div>

                <div className="vr-table-container">
                    <table className="vr-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th className="center-text">GPA</th>
                                <th className="center-text">Attendance</th>
                                <th className="center-text">Missed Classes</th>
                                <th className="center-text">Status</th>
                                <th className="center-text">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {STUDENT_DATA.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: '#6B7280'}}>
                                        No at-risk students found in this section.
                                    </td>
                                </tr>
                            ) : (
                                STUDENT_DATA.map((student) => (
                                    <tr key={student.id}>
                                        <td className="vr-text-id">{student.id}</td>
                                        <td>
                                            <div className="vr-name-cell">
                                                <img src={student.avatar || 'placeholder-avatar.jpg'} alt={student.name} className="vr-avatar" />
                                                <span>{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="center-text">{student.gpa || 'N/A'}</td>
                                        <td className="center-text">{student.attendance || 'N/A'}</td>
                                        
                                        {/* Use student.absences for missed classes */}
                                        <td className="center-text" style={{ color: getMissedColor(student.absences), fontWeight: 'bold' }}>
                                            {student.absences}
                                        </td>
                                        
                                        <td className="center-text">
                                            {/* Status is calculated dynamically based on absences */}
                                            <span className={`vr-status-pill ${getStatusStyle(student.absences)}`}>
                                                {student.absences >= 7 ? 'High Risk' : student.absences >= 5 ? 'Medium Risk' : 'Low Risk'}
                                            </span>
                                        </td>
                                        <td className="center-text">
                                            <div className="vr-actions">
                                                <button className="vr-btn-contact">Contact</button>
                                                
                                                <button 
                                                    className="vr-btn-view" 
                                                    onClick={() => onPageChange('view-rd', { student: student })}
                                                >
                                                    View Details
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
};

export default VReports;