// src/components/assets/Dashboard/MultiPageGS.jsx

import React, { useState, useEffect } from 'react';
import './MultiPageGS.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import { ActivityModal } from './ModalComponents';

// --- ICONS ---
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const Filter = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const Download = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const Plus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const Upload = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const ChevronDown = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);

// --- MOCK DATA ---
const STUDENTS = [
    { id: '2024001', name: 'Anderson, James', type: 'Regular' },
    { id: '2024002', name: 'Bennett, Sarah', type: 'Regular' },
    { id: '2024003', name: 'Carter, Michael', type: 'Regular' },
    { id: '2024004', name: 'Davis, Emily', type: 'Irregular' },
    { id: '2024005', name: 'Evans, Robert', type: 'Irregular' },
    { id: '2024006', name: 'Foster, Jessica', type: 'Regular' },
];

const TOTAL_ITEMS = [10, 15, 20, 20, 25];

// --- SUB-COMPONENT: ATTENDANCE CELL ---
const AttendanceCell = ({ status, onChange }) => {
    // ... (Keep existing implementation) ...
    let className = 'mp-status-pill';
    let content = status;
    if (status === 'P') className += ' mp-p';
    else if (status === 'A') className += ' mp-a';
    else if (status === 'L') className += ' mp-l';
    else if (status === 'SUSPENDED' || status === 'HOLIDAY') className = 'mp-tag-full';

    return (
        <td className="mp-cell-relative">
            <div className={className}>{status === 'SUSPENDED' || status === 'HOLIDAY' ? status : <>{content} <ChevronDown className="mp-chevron"/></>}</div>
            <select className="mp-cell-select" value={status} onChange={(e) => onChange(e.target.value)}>
                <option value="P">Present (P)</option>
                <option value="A">Absent (A)</option>
                <option value="L">Late (L)</option>
                <option disabled>──────────</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="HOLIDAY">Holiday</option>
            </select>
        </td>
    );
};

const MultiPageGS = ({ onLogout, onPageChange, viewType = 'Midterm', title = 'Midterm Grade' }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    
    // Sync internal state with props when navigation happens
    const [currentView, setCurrentView] = useState(viewType);

    useEffect(() => {
        setCurrentView(viewType);
    }, [viewType]);

    // --- RENDERERS ---

    const renderAttendanceTable = () => (
        <table className="mp-table">
            <thead>
                <tr>
                    <th className="fixed-col">Student ID</th>
                    <th className="fixed-col">Student Name</th>
                    <th className="fixed-col">Type of Student</th>
                    <th>Sept 17</th><th>Sept 18</th><th>Sept 19</th><th>Sept 22</th><th>Sept 23</th>
                </tr>
            </thead>
            <tbody>
                {STUDENTS.map((student) => (
                    <tr key={student.id}>
                        <td className="fixed-col mp-id">{student.id}</td>
                        <td className="fixed-col font-bold">{student.name}</td>
                        <td className="fixed-col bg-gray">{student.type}</td>
                        <AttendanceCell status="P" onChange={()=>{}} />
                        <AttendanceCell status="P" onChange={()=>{}} />
                        <AttendanceCell status="A" onChange={()=>{}} />
                        <AttendanceCell status="P" onChange={()=>{}} />
                        <AttendanceCell status="L" onChange={()=>{}} />
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // --- GENERIC GRADES TABLE (REUSED FOR Midterm, Finals, Assignment, Quiz, Activity) ---
    const renderGradesTable = () => {
        
        // Determine the Header Label based on current view
        let headerLabel = 'Assessment';
        if (currentView === 'Midterm' || currentView === 'Finals') headerLabel = 'Quiz'; // Or 'Assessments'
        if (currentView === 'Assignment') headerLabel = 'Assignment';
        if (currentView === 'Quizzes') headerLabel = 'Quiz';
        if (currentView === 'Activities') headerLabel = 'Activity';

        return (
            <table className="mp-table mp-grades-table">
                <thead>
                    <tr>
                        <th rowSpan="2" className="fixed-col">Student ID</th>
                        <th rowSpan="2" className="fixed-col">Student Name</th>
                        <th rowSpan="2" className="fixed-col">Type of Student</th>
                        {/* Dynamic Green Header */}
                        <th colSpan="5" className="mp-grouped-header header-green">{headerLabel}</th>
                        <th rowSpan="2">Total</th>
                    </tr>
                    <tr>
                        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Total Items Row */}
                    <tr className="mp-total-items-row">
                        <td className="fixed-col"></td>
                        <td className="fixed-col font-bold">Total Items</td>
                        <td className="fixed-col"></td>
                        {TOTAL_ITEMS.map((score, i) => (
                            <td key={i} className="center-text font-bold">{score}</td>
                        ))}
                        <td className="center-text font-bold">{TOTAL_ITEMS.reduce((a,b)=>a+b, 0)}</td>
                    </tr>

                    {/* Student Rows (Mock Data logic) */}
                    {STUDENTS.map((student) => {
                        // Just randomizing mock scores for demo since we don't have DB for specific activities yet
                        const grades = [10, 15, 20, 20, 25]; 
                        const totalScore = grades.reduce((acc, curr) => acc + (curr || 0), 0);

                        return (
                            <tr key={student.id}>
                                <td className="fixed-col mp-id">{student.id}</td>
                                <td className="fixed-col font-bold">{student.name}</td>
                                <td className="fixed-col bg-gray">{student.type}</td>
                                {grades.map((score, idx) => (
                                    <td key={idx} className={!score ? 'bg-red-alert' : ''}>
                                        <input type="text" defaultValue={score || ''} className="mp-table-input"/>
                                    </td>
                                ))}
                                <td className="font-bold center-text">{totalScore}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div className="mp-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="dashboard" onWidthChange={setSidebarWidth} />

            <main className="mp-main" style={{ marginLeft: sidebarWidth }}>
                
                <div className="mp-header">
                    <div className="mp-header-left">
                        <button className="mp-back-btn" onClick={() => onPageChange('view-studs')}>
                            <ArrowLeft />
                        </button>
                        <div>
                            {/* Dynamic Title */}
                            <h1 className={currentView !== 'Attendance' ? 'mp-title mp-header-green' : 'mp-title'}>
                                {title}
                            </h1>
                            <p className="mp-subtitle">BSIT - 3D • Introduction to Programming</p>
                        </div>
                    </div>
                    <div className="mp-header-right">
                        <button className="mp-btn mp-btn-white"><Filter size={16}/> Filter</button>
                        <button className="mp-btn mp-btn-white"><Upload size={16}/> Export</button>
                        <button className="mp-btn mp-btn-blue"><Download size={16}/> Download</button>
                    </div>
                </div>

                <div className="mp-toolbar">
                    <div className="mp-tools-left">
                        <button 
                            className={`mp-tool-btn ${currentView !== 'Attendance' ? 'btn-green' : ''}`} 
                            onClick={() => setIsActivityModalOpen(true)}
                        >
                            <Plus size={14} /> 
                            {currentView !== 'Attendance' ? 'Add Assessment' : 'Add Column'}
                        </button>
                    </div>
                    
                    <div className="mp-view-selector-wrapper">
                        <select 
                            className="mp-view-selector" 
                            value={currentView}
                            // Allow switching views internally too
                            onChange={(e) => {
                                setCurrentView(e.target.value);
                                // Optional: You might want to update the title here too 
                                // or better, call onPageChange to reload with new title
                            }}
                        >
                            <option value="Attendance">Attendance</option>
                            <option value="Assignment">Assignment</option>
                            <option value="Quizzes">Quizzes</option>
                            <option value="Activities">Activities</option>
                            <option value="Midterm">Midterm</option>
                            <option value="Finals">Finals</option>
                        </select>
                        <ChevronDown className="mp-selector-chevron" />
                    </div>

                    <div className="mp-search-wrapper">
                        <Search className="mp-search-icon" size={16} />
                        <input type="text" placeholder="Search student..." className="mp-search-input" />
                    </div>
                </div>

                <div className="mp-content-wrapper">
                    <div className="mp-table-container">
                        {currentView === 'Attendance' ? renderAttendanceTable() : renderGradesTable()}
                    </div>
                </div>

            </main>

            <ActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title={title} />
        </div>
    );
};

export default MultiPageGS;