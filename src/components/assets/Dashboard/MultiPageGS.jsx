// src/components/assets/Dashboard/MultiPageGS.jsx

import React, { useState } from 'react';
import './MultiPageGS.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';

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
    { id: '2024002', name: 'Bennett, Sarah', type: 'Irregular' },
];

const ATTENDANCE_DATA = [
    { 
        studentId: '2024001', 
        records: ['P', 'A', 'SUSPENDED', 'P', 'L', 'HOLIDAY', 'P', 'P', 'A'] 
    },
    { 
        studentId: '2024002', 
        records: ['P', 'P', 'SUSPENDED', 'L', 'P', 'HOLIDAY', 'A', 'P', 'L'] 
    },
];

const ACTIVITY_DATA = [
    {
        studentId: '2024001',
        scores: [20, 28], // Corresponds to Activity 1, Activity 2
        total: 48,
        percentage: 92.00
    },
    {
        studentId: '2024002',
        scores: [10, 20],
        total: 30,
        percentage: 85.40
    }
];

const MultiPageGS = ({ onLogout, onPageChange, viewType = 'Attendance', title = 'Attendance' }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);

    // --- RENDER HELPERS ---

    // 1. Attendance Cell Renderer
    const renderAttendanceCell = (status, index) => {
        let className = 'mp-status-pill';
        let content = status;

        if (status === 'P') className += ' mp-p';
        else if (status === 'A') className += ' mp-a';
        else if (status === 'L') className += ' mp-l';
        else if (status === 'SUSPENDED' || status === 'HOLIDAY') className = 'mp-tag-full';

        if (status === 'SUSPENDED' || status === 'HOLIDAY') {
            return <td key={index}><div className={className}>{status}</div></td>;
        }

        return (
            <td key={index}>
                <div className={className}>
                    {content} <ChevronDown className="mp-chevron"/>
                </div>
            </td>
        );
    };

    // 2. Attendance Table
    const renderAttendanceTable = () => (
        <table className="mp-table">
            <thead>
                <tr>
                    <th className="fixed-col">Student ID</th>
                    <th className="fixed-col">Student Name</th>
                    <th className="fixed-col">Type of Student</th>
                    <th>Sept 17</th><th>Sept 18</th><th>Sept 19</th><th>Sept 22</th><th>Sept 23</th><th>Sept 24</th><th>Sept 25</th><th>Sept 26</th><th>Sept 26</th>
                </tr>
            </thead>
            <tbody>
                {STUDENTS.map((student, idx) => {
                    const records = ATTENDANCE_DATA[idx].records;
                    return (
                        <tr key={student.id}>
                            <td className="fixed-col mp-id">{student.id}</td>
                            <td className="fixed-col font-bold">{student.name}</td>
                            <td className="fixed-col bg-gray">{student.type}</td>
                            {records.map((rec, i) => renderAttendanceCell(rec, i))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    // 3. Activity Table
    const renderActivityTable = () => (
        <table className="mp-table">
            <thead>
                <tr>
                    <th className="fixed-col">Student ID</th>
                    <th className="fixed-col">Student Name</th>
                    <th className="fixed-col">Type of Student</th>
                    <th>Activity 1 <br/><span className="mp-sub-date">Sept 22</span></th>
                    <th>Activity 2 <br/><span className="mp-sub-date">Sept 26</span></th>
                    <th>Total</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                {/* Max Score Row (Item Row) */}
                <tr className="mp-item-row">
                    <td className="fixed-col" colSpan={3} style={{textAlign: 'center', color: '#666'}}>Item</td>
                    <td>30</td>
                    <td>30</td>
                    <td>60</td>
                    <td>100.00</td>
                </tr>
                {/* Student Data */}
                {STUDENTS.map((student, idx) => {
                    const data = ACTIVITY_DATA[idx];
                    return (
                        <tr key={student.id}>
                            <td className="fixed-col mp-id">{student.id}</td>
                            <td className="fixed-col font-bold">{student.name}</td>
                            <td className="fixed-col bg-gray">{student.type}</td>
                            <td>{data.scores[0]}</td>
                            <td>{data.scores[1]}</td>
                            <td className="font-bold">{data.total}</td>
                            <td>{data.percentage}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <div className="mp-layout">
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange} 
                currentPage="dashboard"
                onWidthChange={setSidebarWidth} 
            />

            <main className="mp-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* HEADER */}
                <div className="mp-header">
                    <div className="mp-header-left">
                        <button className="mp-back-btn" onClick={() => onPageChange('gradesheet')}>
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="mp-title">{title}</h1>
                            <p className="mp-subtitle">CS 101 - Section A</p>
                        </div>
                    </div>
                    <div className="mp-header-right">
                        <button className="mp-btn mp-btn-white"><Filter size={16}/> Filter</button>
                        <button className="mp-btn mp-btn-white"><Upload size={16}/> Export</button>
                        <button className="mp-btn mp-btn-blue"><Download size={16}/> Download</button>
                    </div>
                </div>

                {/* TOOLBAR */}
                <div className="mp-toolbar">
                    <div className="mp-tools-left">
                        <button className="mp-tool-btn"><Plus size={14} /> Add Column</button>
                        <button className="mp-tool-btn"><Upload size={14} /> Export Excel</button>
                    </div>
                    <div className="mp-search-wrapper">
                        <Search className="mp-search-icon" size={16} />
                        <input type="text" placeholder="Search student..." className="mp-search-input" />
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="mp-content-wrapper">
                    {/* View Selector (Only for Attendance usually, but generic here) */}
                    <div className="mp-view-selector">
                        <span>{title}</span> <ChevronDown />
                    </div>

                    {/* Table Render */}
                    <div className="mp-table-container">
                        {viewType === 'Attendance' ? renderAttendanceTable() : renderActivityTable()}
                    </div>
                </div>

                {/* FOOTER LEGEND (Attendance Only) */}
                {viewType === 'Attendance' && (
                    <div className="mp-legend">
                        <div className="mp-legend-item"><span className="mp-box mp-box-p">P</span> Present</div>
                        <div className="mp-legend-item"><span className="mp-box mp-box-a">A</span> Absent</div>
                        <div className="mp-legend-item"><span className="mp-box mp-box-l">L</span> Absent (Late)</div> 
                        {/* Note: In image L says Absent, usually Late, but following image */}
                    </div>
                )}

            </main>
        </div>
    );
};

export default MultiPageGS;