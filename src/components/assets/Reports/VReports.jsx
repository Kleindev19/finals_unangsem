// src/components/assets/Reports/VReports.jsx

import React, { useState, useMemo } from 'react'; // 💡 MODIFIED: Added useMemo for efficient filtering
import './VReports.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';

// --- CONSTANTS (Required for comprehensive risk calculation) ---
const PASSING_GRADE_THRESHOLD = 75;
const HIGH_ABSENCE_THRESHOLD = 7;
const MEDIUM_ABSENCE_THRESHOLD = 5;

// Helper to determine comprehensive risk status based on grade and absences
const getRiskStatus = (student) => {
    // Check for both 'gpa' (used in the UI column) and 'finalGrade' (used in Reports.jsx logic)
    const finalGrade = parseFloat(student.gpa || student.finalGrade); 
    const absences = student.absences || 0;

    const gradeRisk = !isNaN(finalGrade) && finalGrade < PASSING_GRADE_THRESHOLD;
    const absenceRisk = absences >= HIGH_ABSENCE_THRESHOLD;

    if (gradeRisk || absenceRisk) {
        return 'High Risk'; 
    } else if (absences >= MEDIUM_ABSENCE_THRESHOLD || finalGrade < 70) {
        return 'Medium Risk'; 
    }
    return 'On Track';
};

// Helper to map status to style
const getStatusStyle = (riskLabel) => {
    if (riskLabel.includes('High')) return 'vr-status-high'; // Red
    if (riskLabel.includes('Medium')) return 'vr-status-medium'; // Yellow
    if (riskLabel.includes('On Track')) return 'vr-status-green'; // Green/Default
    return 'vr-status-low'; // Fallback for intervention/low risk (was not present in old UI, using low for visual difference)
};

// Helper function to determine text color based on missed classes (absences)
const getMissedColor = (count) => {
    if (count >= 10) return '#EF4444'; 
    if (count >= 7) return '#F97316'; 
    if (count >= 3) return '#EAB308'; 
    return 'inherit';
};


// --- ICONS (unchanged) ---
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const ChevronDown = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);


const VReports = ({ onLogout, onPageChange, sectionData, atRiskStudents = [], allStudents = [] }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
    const [searchTerm, setSearchTerm] = useState(''); // 💡 NEW: State for search term
    const [filterType, setFilterType] = useState('atRisk'); // 💡 NEW: State for the filter type

    // Dynamically use props for header content
    const sectionCode = sectionData?.code || 'Course Details - Section Report'; 
    const courseName = sectionData?.course || 'Course Details';

    // 1. Select base list based on filterType
    const currentStudentList = filterType === 'atRisk' ? atRiskStudents : allStudents;
    
    // 2. Use useMemo for efficient filtering based on search
    const STUDENT_DATA = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        return currentStudentList.filter(s => 
            s.name.toLowerCase().includes(lowerCaseSearchTerm) || 
            s.id.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [currentStudentList, searchTerm]);


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
                            <h1 className="vr-title">{sectionCode}</h1>
                            <p className="vr-subtitle">{courseName} • 1st Year • Fall 2024</p>
                        </div>
                    </div>

                    <div className="vr-header-right">
                        {/* Search Box */}
                        <div className="vr-search-box">
                            <Search className="vr-search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search student..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* 💡 MODIFIED UI: Filter Control using MultiPageGS styles */}
                        <div className="mp-view-selector-wrapper">
                            <select 
                                id="studentFilter" 
                                className="mp-view-selector"
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="atRisk">At-Risk Students ({atRiskStudents.length})</option>
                                <option value="all">All Students ({allStudents.length})</option>
                            </select>
                            <ChevronDown className="mp-selector-chevron" />
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
                                        No students found matching the criteria.
                                    </td>
                                </tr>
                            ) : (
                                STUDENT_DATA.map((student) => {
                                    const riskStatus = getRiskStatus(student);
                                    
                                    return (
                                        <tr key={student.id}>
                                            <td className="vr-text-id">{student.id}</td>
                                            <td>
                                                <div className="vr-name-cell">
                                                    <img src={student.avatar || 'placeholder-avatar.jpg'} alt={student.name} className="vr-avatar" />
                                                    <span>{student.name}</span>
                                                </div>
                                            </td>
                                            
                                            <td className="center-text">{student.gpa || student.finalGrade || 'N/A'}</td>
                                            
                                            <td className="center-text">{student.attendance || 'N/A'}</td>
                                            
                                            <td className="center-text" style={{ color: getMissedColor(student.absences), fontWeight: 'bold' }}>
                                                {student.absences}
                                            </td>
                                            
                                            <td className="center-text">
                                                <span className={`vr-status-pill ${getStatusStyle(riskStatus)}`}>
                                                    {riskStatus}
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
};

export default VReports;