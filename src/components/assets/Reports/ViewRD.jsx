// src/components/assets/Reports/ViewRD.jsx

import React, { useState } from 'react';
import './ViewRD.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';

// --- ICONS ---
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const CheckCircle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const Clock = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const AlertCircle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const TrendingUp = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>);
const Calendar = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);

// --- MOCK ATTENDANCE DETAIL (P: Present, L: Late, A: Absent) ---
const MOCK_ATTENDANCE_CAROL = ['P', 'P', 'L', 'P', 'A', 'P', 'P', 'L', 'A', 'P', 'P', 'A', 'P', 'P', 'P', 'A', 'P', 'L', 'A', 'P'];
const MOCK_ATTENDANCE_DAVID = ['P', 'P', 'P', 'P', 'P', 'P', 'L', 'P', 'P', 'P', 'A', 'P', 'P', 'L', 'P', 'P', 'P', 'P', 'A', 'P'];


// --- MOCK DATABASE FOR DETAILED STATS (Expanded) ---
const MOCK_DETAILS_DB = {
    'CS2023001': { // Carol (High Risk)
        completed: 24,
        pending: 8,
        missing: 12,
        overall: 68,
        riskLabel: "High Risk",
        riskColor: "#EF4444",
        radar: { attendance: 60, engagement: 50, quiz: 60, assignment: 50, pattern: 80 }, 
        barData: [
            { label: 'Q1', val: 45, color: '#EF4444' },
            { label: 'Q2', val: 60, color: '#F59E0B' },
            { label: 'Q3', val: 55, color: '#F59E0B' },
            { label: 'Mid', val: 50, color: '#F59E0B' },
            { label: 'Act1', val: 70, color: '#10B981' },
            { label: 'Act2', val: 30, color: '#EF4444' },
        ],
        notes: "Student is struggling with basic syntax. Attendance dropped significantly. Recommend remedial classes.",
        attendanceRecord: MOCK_ATTENDANCE_CAROL
    },
    'CS2023002': { // David (Medium Risk)
        completed: 30,
        pending: 5,
        missing: 8,
        overall: 78,
        riskLabel: "Medium Risk",
        riskColor: "#F59E0B",
        radar: { attendance: 85, engagement: 70, quiz: 75, assignment: 80, pattern: 60 }, 
        barData: [
            { label: 'Q1', val: 75, color: '#10B981' },
            { label: 'Q2', val: 78, color: '#10B981' },
            { label: 'Q3', val: 65, color: '#F59E0B' },
            { label: 'Mid', val: 70, color: '#10B981' },
            { label: 'Act1', val: 85, color: '#10B981' },
            { label: 'Act2', val: 60, color: '#F59E0B' },
        ],
        notes: "David is doing well in practicals but falling behind on theory quizzes. Needs to review Chapter 4.",
        attendanceRecord: MOCK_ATTENDANCE_DAVID
    }
};

const DEFAULT_STATS = { // Fallback if no ID matches
    completed: 0, pending: 0, missing: 0, overall: 0,
    riskLabel: "Unknown", riskColor: "#9CA3AF",
    radar: { attendance: 50, engagement: 50, quiz: 50, assignment: 50, pattern: 50 },
    barData: [],
    notes: "No data available.",
    attendanceRecord: [] 
};


// --- CUSTOM RADAR CHART COMPONENT (SVG) ---
const RadarChart = ({ stats }) => {
    const getPoint = (value, index, total) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const radius = (value / 100) * 80; 
        const x = 100 + radius * Math.cos(angle);
        const y = 100 + radius * Math.sin(angle);
        return `${x},${y}`;
    };

    const points = [
        getPoint(stats.attendance, 0, 5),
        getPoint(stats.engagement, 1, 5),
        getPoint(stats.quiz, 2, 5),
        getPoint(stats.assignment, 3, 5),
        getPoint(stats.pattern, 4, 5),
    ].join(" ");
    
    return (
        <div className="vrd-radar-wrapper">
            <svg viewBox="0 0 200 200" className="vrd-radar-svg">
                {/* Background Grid */}
                {[20, 40, 60, 80, 100].map(r => (
                    <polygon key={r} points={[0,1,2,3,4].map(i => {
                        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                        const rad = (r/100)*80;
                        return `${100 + rad * Math.cos(angle)},${100 + rad * Math.sin(angle)}`;
                    }).join(" ")} fill="none" stroke="#E5E7EB" strokeWidth="1" />
                ))}
                
                {/* The Data Shape */}
                <polygon points={points} fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeWidth="2" />
                
                {/* Labels */}
                <text x="100" y="15" textAnchor="middle" className="vrd-radar-label">Attendance</text>
                <text x="190" y="85" textAnchor="middle" className="vrd-radar-label">Engagement</text>
                <text x="160" y="190" textAnchor="middle" className="vrd-radar-label">Quiz Perf.</text>
                <text x="40" y="190" textAnchor="middle" className="vrd-radar-label">Assignment</text>
                <text x="10" y="85" textAnchor="middle" className="vrd-radar-label">Pattern</text>
            </svg>
            <div className="vrd-risk-badge">Risk Score: {((stats.attendance + stats.quiz)/20).toFixed(1)}/10</div>
        </div>
    );
};


// --- BAR CHART COMPONENT ---
const PerformanceChart = ({ data }) => {
    return (
        <div className="vrd-bar-chart">
            {data.map((d, i) => (
                <div key={i} className="vrd-bar-col">
                    <span className="vrd-bar-val">{d.val}%</span>
                    <div className="vrd-bar-track">
                        <div className="vrd-bar-fill" style={{ height: `${d.val}%`, backgroundColor: d.color }}></div>
                    </div>
                    <span className="vrd-bar-lbl">{d.label}</span>
                </div>
            ))}
        </div>
    );
};


// --- MODIFIED COMPONENT: Attendance Report (Now Interactive) ---
const AttendanceReport = ({ record, attendancePercentage, studentId, onUpdateStatus }) => {
    const totalClasses = record.length;
    const absences = record.filter(s => s === 'A').length;
    const lates = record.filter(s => s === 'L').length;
    const present = totalClasses - absences - lates;

    // Function to handle cell click and attempt status update
    const handleCellClick = (index, currentStatus) => {
        // Simple cycle: P -> A -> L -> P
        let nextStatus;
        if (currentStatus === 'P') {
            nextStatus = 'A'; 
        } else if (currentStatus === 'A') {
            nextStatus = 'L';
        } else if (currentStatus === 'L') {
            nextStatus = 'P'; 
        } else {
            nextStatus = 'P';
        }
        
        // Pass the update attempt to the parent component/handler
        onUpdateStatus(studentId, index, nextStatus);
    };

    const getCellClass = (status) => {
        switch (status) {
            case 'P': return 'atd-present';
            case 'L': return 'atd-late';
            case 'A': return 'atd-absent';
            default: return 'atd-unknown';
        }
    };
    
    return (
        <div className="vrd-attendance-card">
            <div className="vrd-attendance-summary">
                <div className="vrd-summary-item">
                    <span className="vrd-summary-value" style={{color: attendancePercentage < 70 ? '#EF4444' : '#10B981'}}>{attendancePercentage}%</span>
                    <span className="vrd-summary-label">Overall Attendance</span>
                </div>
                <div className="vrd-summary-item">
                    <span className="vrd-summary-value vrd-green-text">{present}</span>
                    <span className="vrd-summary-label">Present Count</span>
                </div>
                <div className="vrd-summary-item">
                    <span className="vrd-summary-value vrd-yellow-text">{lates}</span>
                    <span className="vrd-summary-label">Late Count</span>
                </div>
                <div className="vrd-summary-item">
                    <span className="vrd-summary-value vrd-red-text">{absences}</span>
                    <span className="vrd-summary-label">Absent Count</span>
                </div>
            </div>

            <div className="vrd-attendance-grid-container">
                <h4 className="vrd-grid-title">
                    <Calendar size={16} /> Daily Attendance Pattern 
                    <span style={{marginLeft: '10px', color: '#DC2626', fontSize: '0.8em'}}>
                        (Click to change status - 'P' is Permanent)
                    </span>
                </h4>
                <div className="vrd-attendance-grid">
                    {record.map((status, index) => (
                        <div 
                            key={index} 
                            className={`vrd-attendance-cell ${getCellClass(status)}`} 
                            title={`Day ${index + 1}: ${status === 'P' ? 'Present' : status === 'L' ? 'Late' : 'Absent'}. Click to update.`}
                            onClick={() => handleCellClick(index, status)}
                            style={{ cursor: 'pointer' }}
                        >
                            {status}
                            <span className="vrd-cell-day">D{index + 1}</span>
                        </div>
                    ))}
                    {record.length === 0 && (
                        <p style={{gridColumn: '1 / -1', textAlign: 'center', color: '#9CA3AF'}}>No attendance record found.</p>
                    )}
                </div>
            </div>
            
        </div>
    );
};
// ---------------------------------------------


const ViewRD = ({ onLogout, onPageChange, studentData }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);

    const student = studentData || { 
        id: 'CS2023001', 
        name: 'Carol Martinez', 
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' 
    };

    // 1. Get Initial Mock Stats
    const initialDetails = MOCK_DETAILS_DB[student.id] || DEFAULT_STATS;
    
    // 2. Initialize local state for the attendance record
    const [localAttendanceRecord, setLocalAttendanceRecord] = useState(initialDetails.attendanceRecord);
    
    // Create a dynamic details object that uses the local state
    const details = { ...initialDetails, attendanceRecord: localAttendanceRecord };
    
    // --- **PERMANENCE LOGIC HERE** ---
    const handleStatusChange = (studentId, dayIndex, newStatus) => {
        setLocalAttendanceRecord(prevRecord => {
            const currentStatus = prevRecord[dayIndex];
            
            // CORE REQUIREMENT: Block change if current status is 'P' and new status is different
            if (currentStatus === 'P' && newStatus !== 'P') {
                console.warn(`[PERMANENCE CHECK] Blocked attempt to change Day ${dayIndex + 1} from Present (P) to ${newStatus}.`);
                return prevRecord; // Return the old state, preventing the update.
            }

            // Otherwise, update the record
            const newRecord = [...prevRecord];
            newRecord[dayIndex] = newStatus;
            
            console.log(`[UPDATE] Day ${dayIndex + 1} successfully changed to ${newStatus}.`);
            return newRecord;
        });
    };
    // ---------------------------------
    
    // 3. Calculate dynamic stats using local state
    const totalClasses = details.attendanceRecord.length;
    
    // We count Present (P) as 100% and Late (L) as 50% for the percentage calculation
    const attendanceScore = details.attendanceRecord.reduce((score, status) => {
        if (status === 'P') return score + 1;
        if (status === 'L') return score + 0.5; 
        return score;
    }, 0);
    
    // Calculate final percentage (using 0 if totalClasses is 0 to prevent division by zero)
    const calculatedAttendancePercentage = totalClasses > 0 
        ? Math.round((attendanceScore / totalClasses) * 100)
        : 0;

    // Clone and update the radar object to use the calculated percentage
    const dynamicRadar = { 
        ...details.radar, 
        attendance: calculatedAttendancePercentage // Overrides the static mock value
    };


    return (
        <div className="vrd-layout">
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange}
                currentPage="reports"
                onWidthChange={setSidebarWidth}
            />

            <main className="vrd-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* Header & Profile Section */}
                <div className="vrd-top-nav">
                    <button className="vrd-back-link" onClick={() => onPageChange('v-reports')}>
                        <ArrowLeft size={18} /> Back to List
                    </button>
                </div>

                <div className="vrd-profile-header">
                    <img src={student.avatar} alt="Student" className="vrd-header-avatar" style={{borderColor: details.riskColor}} />
                    <div>
                        <h1 className="vrd-student-name">{student.name}</h1>
                        <p className="vrd-student-meta">
                            ID: {student.id} • <span className="vrd-meta-risk" style={{color: details.riskColor}}>{details.riskLabel} (AI Computed)</span>
                        </p>
                    </div>
                </div>

                {/* Metrics Grid (omitted for brevity) */}
                <div className="vrd-metrics-grid">
                    <div className="vrd-metric-card">
                        <CheckCircle size={24} className="vrd-metric-icon vrd-green-icon"/>
                        <div>
                            <span className="vrd-metric-val">{details.completed}</span>
                            <span className="vrd-metric-lbl">Completed Tasks</span>
                        </div>
                    </div>
                    <div className="vrd-metric-card">
                        <Clock size={24} className="vrd-metric-icon vrd-yellow-icon"/>
                        <div>
                            <span className="vrd-metric-val">{details.pending}</span>
                            <span className="vrd-metric-lbl">Pending Tasks</span>
                        </div>
                    </div>
                    <div className="vrd-metric-card">
                        <AlertCircle size={24} className="vrd-metric-icon vrd-red-icon"/>
                        <div>
                            <span className="vrd-metric-val">{details.missing}</span>
                            <span className="vrd-metric-lbl">Missing Tasks</span>
                        </div>
                    </div>
                    <div className="vrd-metric-card">
                        <TrendingUp size={24} className="vrd-metric-icon vrd-blue-icon"/>
                        <div>
                            <span className="vrd-metric-val">{details.overall}%</span>
                            <span className="vrd-metric-lbl">Overall Course Grade</span>
                        </div>
                    </div>
                </div>


                {/* --- DETAILED ATTENDANCE SECTION --- */}
                <div className="vrd-section-card" style={{ marginBottom: '1.5rem' }}>
                    <h3 className="vrd-sect-title">Detailed Attendance Report</h3>
                    <p className="vrd-sect-sub">Class attendance record (P: Present, L: Late (50%), A: Absent (0%))</p>
                    <AttendanceReport 
                        record={localAttendanceRecord} 
                        attendancePercentage={calculatedAttendancePercentage} 
                        studentId={student.id}
                        onUpdateStatus={handleStatusChange} // Passes the state updater with permanence logic
                    />
                </div>
                {/* -------------------------------------- */}

                {/* Progress Bar Section */}
                <div className="vrd-section-card">
                    <h3 className="vrd-sect-title">Student Performance by Subject</h3>
                    <p className="vrd-sect-sub">Current semester courses</p>
                    
                    <div className="vrd-course-row">
                        <div className="vrd-course-info">
                            <h4>CS 301 - Data Structures and Algorithms</h4>
                            <p>Instructor: Dr. Jane Doe | Schedule: T/Th 10:00 AM</p>
                        </div>
                        <div className="vrd-course-stats">
                            <span>GPA: <strong>3.2</strong></span>
                            <span className="vrd-divider">|</span>
                            <span>Attendance: <strong>{calculatedAttendancePercentage}%</strong></span> 
                        </div>
                    </div>
                    
                    <div className="vrd-stat-footer">
                        <PerformanceChart data={details.barData} />
                    </div>
                </div>

                {/* Bottom Grid: Dynamic Charts and Notes */}
                <div className="vrd-bottom-grid">
                    
                    {/* Left: AI Radar - Passed dynamicRadar */}
                    <div className="vrd-section-card vrd-ai-panel">
                        <div className="vrd-panel-header">
                            <h3>AI Analytics Engine</h3>
                        </div>
                        <div className="vrd-ai-content">
                            <div className="vrd-radar-container">
                                <h4>AI Risk Factor Analysis</h4>
                                <RadarChart stats={dynamicRadar} /> 
                            </div>
                            <div className="vrd-ai-recommendations">
                                <h4>Intervention Notes</h4>
                                <blockquote style={{borderColor: details.riskColor}}>
                                    {details.notes}
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    {/* Right: Bar Chart & Notes (omitted for brevity) */}
                    <div className="vrd-section-card">
                        <h3 className="vrd-sect-title">Latest Submission Scores</h3>
                        <p className="vrd-sect-sub">Performance in the last six graded activities</p>
                        <PerformanceChart data={details.barData} />
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ViewRD;