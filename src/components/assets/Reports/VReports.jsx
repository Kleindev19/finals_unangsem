// src/components/assets/Reports/VReports.jsx

import React, { useState } from 'react';
import './VReports.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';

// --- ICONS ---
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const ChevronDown = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);

// --- MOCK DATA ---
const STUDENT_DATA = [
    {
        id: 'CS2023001',
        name: 'Carol Martinez',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        gpa: 2.1,
        attendance: '68%',
        missed: 12,
        status: 'High Risk'
    },
    {
        id: 'CS2023002',
        name: 'David Chen',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        gpa: 2.8,
        attendance: '75%',
        missed: 8,
        status: 'Medium Risk'
    },
];

const VReports = ({ onLogout, onPageChange }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);

    const getStatusStyle = (status) => {
        switch(status) {
            case 'High Risk': return 'vr-status-high';
            case 'Medium Risk': return 'vr-status-medium';
            case 'Low Risk': return 'vr-status-low';
            default: return '';
        }
    };

    const getMissedColor = (count) => {
        if (count >= 10) return '#EF4444'; 
        if (count >= 7) return '#F97316'; 
        return '#EAB308'; 
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
                            <h1 className="vr-title">CS101 - Section A</h1>
                            <p className="vr-subtitle">Computer Science • 1st Year • Fall 2024</p>
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
                            {STUDENT_DATA.map((student) => (
                                <tr key={student.id}>
                                    <td className="vr-text-id">{student.id}</td>
                                    <td>
                                        <div className="vr-name-cell">
                                            <img src={student.avatar} alt={student.name} className="vr-avatar" />
                                            <span>{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="center-text">{student.gpa}</td>
                                    <td className="center-text">{student.attendance}</td>
                                    <td className="center-text" style={{ color: getMissedColor(student.missed), fontWeight: 'bold' }}>
                                        {student.missed}
                                    </td>
                                    <td className="center-text">
                                        <span className={`vr-status-pill ${getStatusStyle(student.status)}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="center-text">
                                        <div className="vr-actions">
                                            <button className="vr-btn-contact">Contact</button>
                                            
                                            {/* --- UPDATED: Pass Student Object --- */}
                                            <button 
                                                className="vr-btn-view" 
                                                onClick={() => onPageChange('view-rd', { student: student })}
                                            >
                                                View Details
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
};

export default VReports;