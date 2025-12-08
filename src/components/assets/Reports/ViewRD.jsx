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

// --- MOCK DATABASE FOR DETAILED STATS ---
// This allows us to show different graphs based on the ID passed
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
        notes: "Student is struggling with basic syntax. Attendance dropped significantly. Recommend remedial classes."
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
        notes: "David is doing well in practicals but falling behind on theory quizzes. Needs to review Chapter 4."
    }
};

const DEFAULT_STATS = { // Fallback if no ID matches
    completed: 0, pending: 0, missing: 0, overall: 0,
    riskLabel: "Unknown", riskColor: "#9CA3AF",
    radar: { attendance: 50, engagement: 50, quiz: 50, assignment: 50, pattern: 50 },
    barData: [],
    notes: "No data available."
};


// --- CUSTOM RADAR CHART COMPONENT (SVG) ---
const RadarChart = ({ stats }) => {
    // Helper to calculate points on a pentagon
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

const ViewRD = ({ onLogout, onPageChange, studentData }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);

    // 1. Get Basic Info from Props (passed from VReports)
    // Fallback data in case page is loaded directly without navigation
    const student = studentData || { 
        id: 'CS2023001', 
        name: 'Carol Martinez', 
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' 
    };

    // 2. Get Detailed Mock Stats based on ID
    const details = MOCK_DETAILS_DB[student.id] || DEFAULT_STATS;

    return (
        <div className="vrd-layout">
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange}
                currentPage="reports"
                onWidthChange={setSidebarWidth}
            />

            <main className="vrd-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* Header */}
                <div className="vrd-top-nav">
                    <button className="vrd-back-link" onClick={() => onPageChange('v-reports')}>
                        <ArrowLeft size={18} /> Back to List
                    </button>
                </div>

                {/* Profile Section (Dynamic Name/Avatar) */}
                <div className="vrd-profile-header">
                    <img src={student.avatar} alt="Student" className="vrd-header-avatar" style={{borderColor: details.riskColor}} />
                    <div>
                        <h1 className="vrd-student-name">{student.name}</h1>
                        <p className="vrd-student-meta">
                            ID: {student.id} • <span className="vrd-meta-risk" style={{color: details.riskColor}}>{details.riskLabel} (AI Computed)</span>
                        </p>
                    </div>
                </div>

                {/* Metrics Grid (Dynamic Values) */}
                <div className="vrd-metrics-grid">
                    <div className="vrd-metric-card">
                        <div className="vrd-metric-top">
                            <div className="vrd-icon-sq green"><CheckCircle size={20}/></div>
                            <span className="vrd-metric-num">{details.completed}</span>
                        </div>
                        <p className="vrd-metric-title">Completed Tasks</p>
                        <span className="vrd-metric-sub">(AI Class Avg: 22)</span>
                    </div>

                    <div className="vrd-metric-card">
                        <div className="vrd-metric-top">
                            <div className="vrd-icon-sq yellow"><Clock size={20}/></div>
                            <span className="vrd-metric-num">{details.pending}</span>
                        </div>
                        <p className="vrd-metric-title">Pending Tasks</p>
                        <span className="vrd-metric-sub">(AI Predicted Delay: High)</span>
                    </div>

                    <div className="vrd-metric-card">
                        <div className="vrd-metric-top">
                            <div className="vrd-icon-sq red"><AlertCircle size={20}/></div>
                            <span className="vrd-metric-num">{details.missing}</span>
                        </div>
                        <p className="vrd-metric-title">Missing Tasks</p>
                        <span className="vrd-metric-sub">(AI Critical Flag)</span>
                    </div>

                    <div className="vrd-metric-card">
                        <div className="vrd-metric-top">
                            <div className="vrd-icon-sq purple"><TrendingUp size={20}/></div>
                            <span className="vrd-metric-num">{details.overall}%</span>
                        </div>
                        <p className="vrd-metric-title">Overall Progress</p>
                        <span className="vrd-metric-sub">(AI Predicted Final: {details.overall - 3}%)</span>
                    </div>
                </div>

                {/* Progress Bar Section (Visuals only, static for now or can use details.overall) */}
                <div className="vrd-section-card">
                    <h3 className="vrd-sect-title">Student Performance by Subject</h3>
                    <p className="vrd-sect-sub">Current semester courses</p>
                    
                    <div className="vrd-course-row">
                        <div className="vrd-course-info">
                            <h4>CS101</h4>
                            <p>Introduction to Programming</p>
                            <span className="vrd-prof-name">Prof. Michael Chen</span>
                        </div>
                        <div className="vrd-progress-container">
                            <div className="vrd-prog-labels">
                                <span>Progress: {details.overall + 5}%</span>
                                <span className="vrd-badge-green">{details.overall + 5}%</span>
                            </div>
                            <div className="vrd-prog-track">
                                <div className="vrd-prog-fill" style={{width: `${details.overall + 5}%`}}></div>
                                <div className="vrd-ai-marker" style={{left: '58%'}}>
                                    <div className="vrd-ai-tooltip">AI Forecast 58%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="vrd-stat-footer">
                        <span>Assignment Avg: <strong>{details.barData[4]?.val || 80}%</strong></span>
                        <span className="vrd-divider">|</span>
                        <span>Quiz Avg: <strong>{details.barData[2]?.val || 75}%</strong></span>
                        <span className="vrd-divider">|</span>
                        <span>Midterm: <strong>{details.barData[3]?.val || 60}%</strong></span>
                        <span className="vrd-divider">|</span>
                        <span>Attendance: <strong>{details.radar.attendance}%</strong></span>
                    </div>
                </div>

                {/* Bottom Grid: Dynamic Charts */}
                <div className="vrd-bottom-grid">
                    
                    {/* Left: AI Radar */}
                    <div className="vrd-section-card vrd-ai-panel">
                        <div className="vrd-panel-header">
                            <h3>AI Analytics Engine</h3>
                        </div>
                        <div className="vrd-ai-content">
                            <div className="vrd-radar-container">
                                <h4>AI Risk Factor Analysis</h4>
                                <RadarChart stats={details.radar} />
                            </div>
                            <div className="vrd-ai-recos">
                                <h4>AI Intervention Recommendations</h4>
                                <ul>
                                    <li>Schedule 1:1 with student (High Priority)</li>
                                    <li>Enroll in Friday remedial class (AI Suggestion)</li>
                                    <li>Review basic syntax modules (AI Targeted Content)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right: Bar Chart & Notes */}
                    <div className="vrd-section-card">
                        <h3 className="vrd-sect-title">Performance Overview</h3>
                        <PerformanceChart data={details.barData} />
                        
                        <div className="vrd-instructor-notes">
                            <h4>Instructor Notes</h4>
                            <p>{details.notes}</p>
                        </div>

                        <button className="vrd-warning-btn">Send Warning Email</button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ViewRD;