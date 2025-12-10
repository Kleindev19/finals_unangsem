// src/components/assets/Reports/ViewRD.jsx

import React, { useState, useMemo } from 'react'; 
import './ViewRD.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';

// --- ICONS ---
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>);
const CheckCircle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const Clock = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
const AlertCircle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>);
const TrendingUp = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>);
const Calendar = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);

// --- CONSTANTS ---
const PASSING_GRADE_THRESHOLD = 75;

// --- HELPER: Calculate radar data from student gradesheet data ---
const calculateRadarData = (student, calculatedAttendancePercentage) => {
    // Assuming student.grades.finals contains the percentage breakdown from Gradesheet logic
    const grades = student.grades?.finals || {};

    // Components expected from Gradesheet/DB:
    // quizPercentage, activityPercentage, recitationPercentage, examPercentage (0-100)

    // Fallback values for visual stability if data is missing (50 means average/unknown)
    return [
        { axis: 'Quizzes', value: grades.quizPercentage || 50 }, 
        { axis: 'Activities', value: grades.activityPercentage || 50 },
        { axis: 'Recitations', value: grades.recitationPercentage || 50 },
        { axis: 'Major Exam', value: grades.examPercentage || 50 },
        { axis: 'Attendance', value: calculatedAttendancePercentage || 50 }, // Use dynamic attendance
    ];
};

// --- HELPER: Generate latest submission scores (Bar Chart Data) ---
const getPerformanceBarData = (student) => {
    // This is now derived from student.latestScores or mock if gradesheet doesn't provide detail
    if (student.latestScores && student.latestScores.length > 0) {
        return student.latestScores.map(score => ({
            label: score.name,
            val: score.scorePercentage || 0, // Score as a percentage
            color: score.scorePercentage >= 75 ? '#10B981' : score.scorePercentage >= 60 ? '#F59E0B' : '#EF4444'
        }));
    }

    // Fallback/Mock data if latestScores is not provided
    return [
        { label: 'Q1', val: 75, color: '#10B981' },
        { label: 'Act1', val: 80, color: '#10B981' },
        { label: 'R1', val: 65, color: '#F59E0B' },
        { label: 'Q2', val: 55, color: '#EF4444' },
        { label: 'Act2', val: 70, color: '#10B981' },
        { label: 'Midterm', val: 85, color: '#10B981' },
    ];
};


// --- MOCK DATABASE FOR STUDENT PROFILES (Simplified - only non-grade metrics) ---
const MOCK_DETAILS_DB = {
    'CS2023001': { // Carol
        completed: 24, 
        pending: 8,
        missing: 12,
        notes: "Student is struggling with basic syntax and has a high number of absences. Immediate intervention is required.",
        attendanceRecord: ['P', 'P', 'L', 'P', 'A', 'P', 'P', 'L', 'A', 'P', 'P', 'A', 'P', 'P', 'P', 'A', 'P', 'L', 'A', 'P']
    },
    'CS2023002': { // David
        completed: 30,
        pending: 5,
        missing: 8,
        notes: "Doing well in practicals but falling behind on theory quizzes. Needs to review Chapter 4.",
        attendanceRecord: ['P', 'P', 'P', 'P', 'P', 'P', 'L', 'P', 'P', 'P', 'A', 'P', 'P', 'L', 'P', 'P', 'P', 'P', 'A', 'P']
    }
};

const DEFAULT_PROFILE_STATS = { // Fallback
    completed: 0, pending: 0, missing: 0, notes: "No detailed profile data available.",
    attendanceRecord: [] 
};


// --- CUSTOM RADAR CHART COMPONENT (SVG) ---
const RadarChart = ({ stats }) => {
    const labels = stats.map(s => s.axis);
    const values = stats.map(s => s.value);
    const totalAxes = values.length;

    const getPoint = (value, index) => {
        const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
        const radius = (value / 100) * 80; 
        const x = 100 + radius * Math.cos(angle);
        const y = 100 + radius * Math.sin(angle);
        return `${x},${y}`;
    };

    const points = values.map((val, i) => getPoint(val, i)).join(" ");
    
    return (
        <div className="vrd-radar-wrapper">
            <svg viewBox="0 0 200 200" className="vrd-radar-svg">
                {/* Background Grid */}
                {[20, 40, 60, 80, 100].map(r => (
                    <polygon key={r} points={[...Array(totalAxes).keys()].map(i => {
                        const angle = (Math.PI * 2 * i) / totalAxes - Math.PI / 2;
                        const rad = (r/100)*80;
                        return `${100 + rad * Math.cos(angle)},${100 + rad * Math.sin(angle)}`;
                    }).join(" ")} fill="none" stroke="#E5E7EB" strokeWidth="1" />
                ))}
                
                {/* The Data Shape */}
                <polygon points={points} fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeWidth="2" />
                
                {/* Labels (Adjusted for 5-axis dynamic labels) */}
                <text x="100" y="15" textAnchor="middle" className="vrd-radar-label">{labels[0]}</text>
                <text x="190" y="85" textAnchor="middle" className="vrd-radar-label">{labels[1]}</text>
                <text x="160" y="190" textAnchor="middle" className="vrd-radar-label">{labels[2]}</text>
                <text x="40" y="190" textAnchor="middle" className="vrd-radar-label">{labels[3]}</text>
                <text x="10" y="85" textAnchor="middle" className="vrd-radar-label">{labels[4]}</text>
            </svg>
            {/* Calculate Risk Score based on average component performance */}
            <div className="vrd-risk-badge">
                Risk Score: {
                    (values.reduce((sum, v) => sum + v, 0) / totalAxes / 10).toFixed(1)
                }/10
            </div>
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


// --- MODIFIED COMPONENT: Attendance Report ---
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


const ViewRD = ({ onLogout, onPageChange, student: studentProp }) => { // Rename studentData to studentProp
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);

    // Use studentProp, or a safe default (if no grades are passed, use mock structure)
    const student = studentProp || { 
        id: 'CS2023001', 
        name: 'Carol Martinez', 
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        // Example mock grade structure to ensure charts render if data is missing
        grades: { finals: { finalGrade: 68.5, percentage: 68.5, quizPercentage: 60, activityPercentage: 50, recitationPercentage: 65, examPercentage: 55 } },
        absences: 5 
    };

    // 1. Get Profile/Attendance data (Mock/Fallback)
    const initialDetails = MOCK_DETAILS_DB[student.id] || DEFAULT_PROFILE_STATS;
    
    // 2. Initialize local state for the attendance record
    const [localAttendanceRecord, setLocalAttendanceRecord] = useState(initialDetails.attendanceRecord);
    
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
    
    // 3. Memoized calculation of all dynamic details
    const details = useMemo(() => {
        // Attendance Calculation
        const totalClasses = localAttendanceRecord.length;
        const absences = localAttendanceRecord.filter(s => s === 'A').length;
        
        // We count Present (P) as 100% and Late (L) as 50% for the percentage calculation
        const attendanceScore = localAttendanceRecord.reduce((score, status) => {
            if (status === 'P') return score + 1;
            if (status === 'L') return score + 0.5; 
            return score;
        }, 0);
        
        // Calculate final percentage (using 0 if totalClasses is 0 to prevent division by zero)
        const calculatedAttendancePercentage = totalClasses > 0 
            ? Math.round((attendanceScore / totalClasses) * 100)
            : 0;

        // Grade Calculation
        const finalGrade = student.grades?.finals?.finalGrade || student.gpa; // Use gpa fallback if structure is flat
        const gradeValue = parseFloat(finalGrade);
        const finalPercentage = student.grades?.finals?.percentage || finalGrade; // Use grade as percent if not separated
        const overallPercentageValue = parseFloat(finalPercentage);
        
        const isFailing = !isNaN(gradeValue) && gradeValue < PASSING_GRADE_THRESHOLD;
        
        let riskColor = '#4B5563'; // Default Gray
        let riskLabel = 'On Track';
        let notes = initialDetails.notes; // Use profile notes as base

        if (absences >= 7) {
            riskColor = '#DC2626'; // High Risk (Red)
            riskLabel = 'High Risk (Absences)';
            notes = `High absence count (${absences}) detected. Immediate intervention is required. Contact the student/guardian to address attendance issues.`;
        } else if (isFailing) {
            riskColor = '#FBBF24'; // Medium Risk (Amber)
            riskLabel = 'Medium Risk (Failing)';
            notes = `Failing grade (${gradeValue.toFixed(2)}%) detected. Focus on improving exam and activity scores. Recommend remedial sessions for key topics.`;
        } else {
            riskColor = '#10B981'; // Green (On Track)
            riskLabel = 'On Track';
        }

        const barData = getPerformanceBarData(student);
        const dynamicRadar = calculateRadarData(student, calculatedAttendancePercentage);

        return {
            ...student, // Spread existing student data
            ...initialDetails, // Spread profile stats (completed, pending, missing)
            finalGrade: !isNaN(gradeValue) ? gradeValue.toFixed(2) : 'N/A',
            finalPercentage: !isNaN(overallPercentageValue) ? overallPercentageValue.toFixed(2) : 'N/A',
            absences: absences, // Use calculated absences
            attendancePercentage: calculatedAttendancePercentage, // Use calculated percentage
            riskColor,
            riskLabel,
            notes,
            barData, 
            dynamicRadar 
        };
    }, [student, localAttendanceRecord, initialDetails]);


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
                    <img src={details.avatar} alt="Student" className="vrd-header-avatar" style={{borderColor: details.riskColor}} />
                    <div>
                        <h1 className="vrd-student-name">{details.name}</h1>
                        <p className="vrd-student-meta">
                            ID: {details.id} • <span className="vrd-meta-risk" style={{color: details.riskColor}}>{details.riskLabel} (AI Computed)</span>
                        </p>
                    </div>
                </div>

                {/* Metrics Grid */}
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
                    {/* UPDATED: Overall Grade Metric */}
                    <div className="vrd-metric-card">
                        <TrendingUp size={24} className="vrd-metric-icon" style={{ color: details.riskColor }}/>
                        <div>
                            <span className="vrd-metric-val">{details.finalGrade}</span>
                            <span className="vrd-metric-lbl">Final Grade</span>
                        </div>
                    </div>
                </div>


                {/* --- DETAILED ATTENDANCE SECTION --- */}
                <div className="vrd-section-card" style={{ marginBottom: '1.5rem' }}>
                    <h3 className="vrd-sect-title">Detailed Attendance Report</h3>
                    <p className="vrd-sect-sub">Class attendance record (P: Present, L: Late (50%), A: Absent (0%))</p>
                    <AttendanceReport 
                        record={localAttendanceRecord} 
                        attendancePercentage={details.attendancePercentage} 
                        studentId={details.id}
                        onUpdateStatus={handleStatusChange} // Passes the state updater with permanence logic
                    />
                </div>
                {/* -------------------------------------- */}

                {/* Performance Chart Section */}
                <div className="vrd-section-card">
                    <h3 className="vrd-sect-title">Student Performance Summary</h3>
                    <p className="vrd-sect-sub">Current semester courses</p>
                    
                    <div className="vrd-course-row">
                        <div className="vrd-course-info">
                            {/* Assuming the student object contains course info if loaded from a section */}
                            <h4>{details.course || 'Data Structures and Algorithms'}</h4> 
                            <p>Instructor: Dr. Jane Doe | Schedule: T/Th 10:00 AM</p>
                        </div>
                        <div className="vrd-course-stats">
                            <span>Grade: <strong>{details.finalGrade}</strong></span>
                            <span className="vrd-divider">|</span>
                            <span>Attendance: <strong>{details.attendancePercentage}%</strong></span> 
                        </div>
                    </div>
                    
                    <div className="vrd-stat-footer">
                        <h4 className="vrd-sect-title" style={{ marginTop: '10px' }}>Latest Submission Scores</h4>
                        <p className="vrd-sect-sub">Performance in the last six graded activities</p>
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
                                <RadarChart stats={details.dynamicRadar} /> 
                            </div>
                            <div className="vrd-ai-recommendations">
                                <h4>Intervention Notes</h4>
                                <blockquote style={{borderColor: details.riskColor}}>
                                    {details.notes}
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    {/* Right: Grade Component Breakdown */}
                    <div className="vrd-section-card vrd-grade-details-panel">
                        <h3 className="vrd-sect-title">Grade Component Breakdown</h3>
                        <p className="vrd-sect-sub">Score as a percentage of total component points (0-100)</p>
                        
                        <div className="vrd-breakdown-list">
                            <div className="vrd-breakdown-item">
                                <span>Quizzes:</span> <strong>{details.dynamicRadar.find(d => d.axis === 'Quizzes')?.value.toFixed(1) || 'N/A'}%</strong>
                            </div>
                            <div className="vrd-breakdown-item">
                                <span>Activities:</span> <strong>{details.dynamicRadar.find(d => d.axis === 'Activities')?.value.toFixed(1) || 'N/A'}%</strong>
                            </div>
                            <div className="vrd-breakdown-item">
                                <span>Recitations:</span> <strong>{details.dynamicRadar.find(d => d.axis === 'Recitations')?.value.toFixed(1) || 'N/A'}%</strong>
                            </div>
                            <div className="vrd-breakdown-item">
                                <span>Major Exam:</span> <strong>{details.dynamicRadar.find(d => d.axis === 'Major Exam')?.value.toFixed(1) || 'N/A'}%</strong>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', padding: '10px 0', borderTop: '1px solid #E5E7EB' }}>
                             <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: details.riskColor }}>
                                Overall Percentage: {details.finalPercentage}%
                            </span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ViewRD;