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

// --- CONSTANTS ---
const QUIZ_COLS = [
    { id: 'q1', label: 'Q1', max: 20 },
    { id: 'q2', label: 'Q2', max: 20 },
    { id: 'q3', label: 'Q3', max: 20 },
    { id: 'q4', label: 'Q4', max: 25 },
];
const ACT_COLS = [
    { id: 'act1', label: 'ACT 1', max: 30 },
    { id: 'act2', label: 'ACT 2', max: 30 },
    { id: 'act3', label: 'ACT 3', max: 50 },
    { id: 'act4', label: 'ACT 4', max: 50 },
];
const REC_COLS = [{ id: 'r1', label: 'R1', max: 100 }];
const EXAM_COLS = [{ id: 'exam', label: 'Major Exam', max: 60 }];

// --- MOCK DATES FOR ATTENDANCE ---
const MIDTERM_DATES = ['Sept 4', 'Sept 11', 'Sept 18', 'Sept 25', 'Oct 2', 'Oct 9'];
const FINALS_DATES = ['Nov 6', 'Nov 13', 'Nov 20', 'Nov 27', 'Dec 4', 'Dec 11'];

// --- HELPER: Random Grade Generator ---
const getRandomGrade = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

// --- ATTENDANCE CELL ---
const AttendanceCell = ({ status, onChange }) => {
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

const MultiPageGS = ({ onLogout, onPageChange, viewType = 'Midterm Records', title = 'Midterm Grade', students = [], sectionData }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState(viewType);
    
    // NEW: State for the specific Attendance Dropdown (Midterm vs Finals)
    const [attendanceTerm, setAttendanceTerm] = useState('Midterm Attendance');

    useEffect(() => { if (viewType) setCurrentView(viewType); }, [viewType]);

    // --- RENDERERS ---
    
    // 1. ATTENDANCE TABLE (New Logic)
    const renderAttendanceTable = () => {
        const isMidtermAtt = attendanceTerm === 'Midterm Attendance';
        const dates = isMidtermAtt ? MIDTERM_DATES : FINALS_DATES;

        return (
            <table className="mp-table">
                <thead>
                    <tr>
                        <th className="sticky-col col-no header-category-green">No.</th>
                        <th className="sticky-col col-id header-category-green">Student ID</th>
                        <th className="sticky-col col-name header-category-green">Student Name</th>
                        {dates.map((date, i) => (
                            <th key={i} className="header-category-orange">{date}</th>
                        ))}
                        <th className="header-summary-green">Total Absences</th>
                        <th className="header-summary-green">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr><td colSpan={dates.length + 5} style={{padding: '2rem', textAlign:'center'}}>No students found.</td></tr>
                    ) : (
                        students.map((student, index) => {
                            // Mock Absences Logic
                            const absences = Math.floor(Math.random() * 4); 
                            const status = absences >= 3 ? 'Dropped' : 'Active';
                            const statusClass = status === 'Dropped' ? 'cell-failed' : 'cell-passed';

                            return (
                                <tr key={student.id}>
                                    <td className="sticky-col col-no center-text">{index + 1}</td>
                                    <td className="sticky-col col-id center-text">{student.id}</td>
                                    <td className="sticky-col col-name" style={{fontWeight:'600', paddingLeft:'8px'}}>{student.name}</td>
                                    
                                    {/* Render Attendance Cells */}
                                    {dates.map((_, i) => (
                                        <AttendanceCell 
                                            key={i} 
                                            status={Math.random() > 0.1 ? 'P' : 'A'} 
                                            onChange={() => {}} 
                                        />
                                    ))}

                                    <td className="center-text font-bold">{absences}</td>
                                    <td className={`center-text ${statusClass}`}>{status}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        );
    };

    // 2. SUMMARY GRADE SHEET TABLE
    const renderGradesheetTable = () => {
        return (
            <table className="mp-table mp-summary-table">
                <thead>
                    <tr>
                        <th colSpan="2" className="header-beige-title">GRADE SHEET</th>
                        <th colSpan="7" className="header-green-title">GRADE SHEET</th>
                    </tr>
                    <tr>
                        <th className="sticky-col col-no header-beige">Student ID</th>
                        <th className="sticky-col col-name header-beige">Student Name</th>
                        <th className="header-green-col">Midterm</th>
                        <th className="header-green-col">40%</th>
                        <th className="header-green-col">Final</th>
                        <th className="header-green-col">60%</th>
                        <th className="header-green-col">FINAL GRADE</th>
                        <th className="header-green-col">EQVT GRADE</th>
                        <th className="header-green-col">REMARKS</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                         <tr><td colSpan="9" style={{padding: '2rem', textAlign:'center'}}>No students found.</td></tr>
                    ) : (
                        students.map((student, index) => {
                            const mid = parseFloat(getRandomGrade(75, 95));
                            const mid40 = (mid * 0.40).toFixed(2);
                            const fin = parseFloat(getRandomGrade(75, 95));
                            const fin60 = (fin * 0.60).toFixed(2);
                            const finalGrade = (parseFloat(mid40) + parseFloat(fin60)).toFixed(2);
                            
                            let eqvt = '5.00';
                            let remarks = 'FAILED';
                            let remarksClass = 'cell-failed';

                            if (finalGrade >= 75) {
                                eqvt = '2.00'; // Simplified for demo
                                remarks = 'PASSED';
                                remarksClass = 'cell-passed';
                            }

                            return (
                                <tr key={student.id}>
                                    <td className="sticky-col col-id header-beige-cell center-text">{student.id}</td>
                                    <td className="sticky-col col-name header-beige-cell" style={{fontWeight:'600', paddingLeft:'8px', textAlign:'left'}}>{student.name}</td>
                                    
                                    <td className="center-text">{mid.toFixed(2)}</td>
                                    <td className="center-text header-green-cell">{mid40}</td>
                                    <td className="center-text">{fin.toFixed(2)}</td>
                                    <td className="center-text header-green-cell">{fin60}</td>
                                    
                                    <td className="center-text" style={{fontWeight:'bold'}}>{finalGrade}</td>
                                    <td className="center-text header-green-cell">{eqvt}</td>
                                    <td className={`center-text ${remarksClass}`}>{remarks}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        );
    };

    // 3. REGULAR RECORDS TABLE
    const renderRecordsTable = () => {
        const isMidterm = currentView.includes('Midterm');
        const examLabel = isMidterm ? 'Mid Exam' : 'Final Exam';
        
        return (
            <table className="mp-table">
                <thead>
                    <tr>
                        <th rowSpan="3" className="sticky-col col-no">No.</th>
                        <th rowSpan="3" className="sticky-col col-id">Student ID</th>
                        <th rowSpan="3" className="sticky-col col-name">Student Name</th>
                        <th className="sticky-col col-grade header-category-green">CATEGORY</th>
                        
                        <th colSpan={QUIZ_COLS.length} className="header-category-orange">Quiz (15%)</th>
                        <th colSpan={ACT_COLS.length} className="header-category-orange">{isMidterm ? 'Activity (35%)' : 'Lab/Assignment (25%)'}</th>
                        <th colSpan={REC_COLS.length} className="header-category-orange">{isMidterm ? 'Recitation (10%)' : 'Recitation (20%)'}</th>
                        <th colSpan={EXAM_COLS.length} className="header-category-orange">Exam (40%)</th>
                    </tr>

                    <tr>
                        <th className="sticky-col col-grade header-midterm-green">
                            {isMidterm ? 'Midterm' : 'Finals'}<br/>Percentage
                        </th>
                        {QUIZ_COLS.map(c => <th key={c.id}>{c.label}</th>)}
                        {ACT_COLS.map(c => <th key={c.id}>{c.label}</th>)}
                        {REC_COLS.map(c => <th key={c.id}>{c.label}</th>)}
                        <th>{examLabel}</th>
                    </tr>

                    <tr>
                        <th className="sticky-col col-grade bg-green-soft">100%</th>
                        {QUIZ_COLS.map(c => <th key={c.id}>{c.max}</th>)}
                        {ACT_COLS.map(c => <th key={c.id}>{c.max}</th>)}
                        {REC_COLS.map(c => <th key={c.id}>{c.max}</th>)}
                        {EXAM_COLS.map(c => <th key={c.id}>{c.max}</th>)}
                    </tr>
                </thead>
                
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.id}>
                            <td className="sticky-col col-no center-text">{index + 1}</td>
                            <td className="sticky-col col-id center-text">{student.id}</td>
                            <td className="sticky-col col-name" style={{fontWeight:'600', paddingLeft:'8px'}}>{student.name}</td>
                            <td className="sticky-col col-grade bg-green-soft">{(80 + Math.random() * 15).toFixed(2)}</td>

                            {QUIZ_COLS.map(c => <td key={c.id}><input type="text" className="mp-table-input" /></td>)}
                            {ACT_COLS.map(c => <td key={c.id}><input type="text" className="mp-table-input" /></td>)}
                            {REC_COLS.map(c => <td key={c.id}><input type="text" className="mp-table-input" /></td>)}
                            {EXAM_COLS.map(c => <td key={c.id}><input type="text" className="mp-table-input" /></td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderContent = () => {
        if (currentView === 'Gradesheet') return renderGradesheetTable();
        if (currentView === 'Attendance') return renderAttendanceTable();
        return renderRecordsTable();
    };

    const renderSideCards = () => {
        const isGradesheet = currentView === 'Gradesheet';
        const isFinals = currentView.includes('Finals');

        // Hide side cards in Attendance View to reduce clutter or add Legend
        if (currentView === 'Attendance') return null;

        if (isGradesheet) {
            return (
                <div className="mp-cards-container">
                    <div className="mp-percentage-card">
                        <div className="mp-pc-header">COMPOSITION</div>
                        <table className="mp-pc-table">
                            <thead><tr><th>Term</th><th>Percentage</th></tr></thead>
                            <tbody>
                                <tr><td>Midterm</td><td>40</td></tr>
                                <tr><td>Finals</td><td>60</td></tr>
                                <tr className="mp-pc-total"><td>TOTAL</td><td>100</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mp-percentage-card">
                        <div className="mp-pc-header">FINALS</div>
                        <table className="mp-pc-table scale-table">
                            <thead><tr><th>Range %</th><th>Grade</th><th>Remarks</th></tr></thead>
                            <tbody>
                                <tr><td>98 - 100</td><td>1.00</td><td rowSpan="9" className="cell-passed-vertical">PASSED</td></tr>
                                <tr><td>96 - 97</td><td>1.25</td></tr>
                                <tr><td>93 - 95</td><td>1.50</td></tr>
                                <tr><td>...</td><td>...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (isFinals) {
            return (
                <div className="mp-percentage-card">
                    <div className="mp-pc-header">FINALS</div>
                    <table className="mp-pc-table">
                        <thead><tr><th>Item</th><th>Percentage</th></tr></thead>
                        <tbody>
                            <tr><td>Major Exam</td><td>40</td></tr>
                            <tr><td>Quiz</td><td>15</td></tr>
                            <tr><td>Lab/Assignment</td><td>25</td></tr>
                            <tr><td>Recitation</td><td>20</td></tr>
                            <tr className="mp-pc-total"><td>TOTAL</td><td>100</td></tr>
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="mp-percentage-card">
                <div className="mp-pc-header">MIDTERM</div>
                <table className="mp-pc-table">
                    <thead><tr><th>Item</th><th>Percentage</th></tr></thead>
                    <tbody>
                        <tr><td>Major Exam</td><td>40</td></tr>
                        <tr><td>Quiz</td><td>15</td></tr>
                        <tr><td>Activity</td><td>35</td></tr>
                        <tr><td>Recitation</td><td>10</td></tr>
                        <tr className="mp-pc-total"><td>TOTAL</td><td>100</td></tr>
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="mp-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="dashboard" onWidthChange={setSidebarWidth} />

            <main className="mp-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* HEADER */}
                <div className="mp-header-top">
                    <div className="mp-header-left">
                        <button className="mp-back-btn" onClick={() => onPageChange('view-studs')}><ArrowLeft /></button>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <h1 className="mp-top-title">
                                {currentView === 'Gradesheet' ? 'SUMMARY GRADESHEET' : 
                                 currentView === 'Attendance' ? 'ATTENDANCE RECORD' :
                                 currentView.toUpperCase()}
                            </h1>
                            <p className="mp-top-subtitle">{sectionData?.subtitle || 'BSIT - 3D • Introduction to Programming'}</p>
                        </div>
                    </div>
                    <div className="mp-header-center">
                        <div className="mp-search-wrapper">
                            <Search className="mp-search-icon" size={16} />
                            <input type="text" placeholder="Search student..." className="mp-search-input" />
                        </div>
                    </div>
                    <div className="mp-header-right">
                        <div className="mp-view-selector-wrapper">
                            <select className="mp-view-selector" value={currentView} onChange={(e) => setCurrentView(e.target.value)}>
                                <option value="Attendance">Attendance</option>
                                <option value="Midterm Records">Midterm Records</option>
                                <option value="Finals Records">Finals Records</option>
                                <option value="Gradesheet">Gradesheet</option>
                            </select>
                            <ChevronDown className="mp-selector-chevron" />
                        </div>
                        <button className="mp-btn"><Filter size={16}/> Filter View</button>
                    </div>
                </div>

                {/* TOOLBAR */}
                <div className="mp-toolbar">
                    <div className="mp-toolbar-left">
                        
                        {/* 1. Show Add Assessment for Grade Views */}
                        {currentView !== 'Gradesheet' && currentView !== 'Attendance' && (
                            <button className="btn-add-assessment" onClick={() => setIsActivityModalOpen(true)}>
                                <Plus size={18} /> Add Assessment
                            </button>
                        )}

                        {/* 2. Show Attendance Dropdown ONLY when Attendance is Selected */}
                        {currentView === 'Attendance' && (
                            <div className="mp-att-selector-wrapper">
                                <span className="mp-label-small">Select Term:</span>
                                <div className="relative">
                                    <select 
                                        className="mp-att-selector"
                                        value={attendanceTerm}
                                        onChange={(e) => setAttendanceTerm(e.target.value)}
                                    >
                                        <option value="Midterm Attendance">Midterm Attendance</option>
                                        <option value="Finals Attendance">Finals Attendance</option>
                                    </select>
                                    <ChevronDown className="mp-selector-chevron" style={{right: '10px'}}/>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mp-toolbar-right">
                        <div className="mp-data-actions">
                            <button className="btn-utility"><Upload size={14}/> Export</button>
                            <button className="btn-utility"><Download size={14}/> Download</button>
                        </div>
                        {renderSideCards()}
                    </div>
                </div>

                {/* TABLE CONTENT */}
                <div className="mp-content-wrapper">
                    <div className="mp-table-container">
                        {renderContent()}
                    </div>
                </div>

            </main>
            <ActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title={currentView} />
        </div>
    );
};

export default MultiPageGS;