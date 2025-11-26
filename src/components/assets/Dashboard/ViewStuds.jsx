// src/components/assets/Dashboard/ViewStuds.jsx

import React, { useState, useEffect } from 'react';
import './ViewStuds.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar'; // Import your existing Sidebar

// --- ICONS (Lucide-react style inline SVGs) ---
const SearchIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const BellIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>
);
const HelpIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const LinkIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);
const CopyIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
const ChevronDown = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
const PlusIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const DownloadIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const EditIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);

// --- MOCK DATA FROM SCREENSHOT ---
const STUDENTS_DATA = [
    { id: '2024001', name: 'Anderson, James', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09874268050', email: 'A.James1@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024002', name: 'Bennett, Sarah', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09482312634', email: 'bennett_s23@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024003', name: 'Carter, Michael', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09855772072', email: 'mi-car67@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024004', name: 'Davis, Emily', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09567725197', email: 'dai-em123@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024005', name: 'Evans, Robert', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09389607348', email: 'robrob9@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024006', name: 'Foster, Jessica', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09678396246', email: 'jessssssss@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024007', name: 'Garcia, David', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09678396246', email: 'GD75935@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024008', name: 'Harris, Amanda', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09989360862', email: 'Harrriiiss12@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024009', name: 'Jackson, Christopher', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09813057460', email: 'Christopher.J@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024010', name: 'Johnson, Lisa', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09953650990', email: 'LIZZAA@gmail.com', address: 'Rodriguez,Rizal' },
];

const ViewStuds = ({ onLogout, onPageChange }) => {
    // State for Sidebar width management
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    
    // Copy function for the link
    const copyToClipboard = () => {
        const text = "https://a70da40d-721c-415b-ac01-42eb25ef63f6-v2.student.progress.tracker.site/?form=student-info&institute=ComputingScience&section=default";
        navigator.clipboard.writeText(text);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="view-studs-layout">
            {/* Sidebar integration */}
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange} 
                currentPage="dashboard"
                onWidthChange={setSidebarWidth} 
            />

            {/* Main Content Area */}
            <div className="view-studs-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* 1. Header Row (Search + Actions) */}
                <header className="vs-header">
                    <div className="vs-search-container">
                        <SearchIcon className="vs-search-icon" />
                        <input type="text" placeholder="Search students" className="vs-search-input" />
                    </div>
                    <div className="vs-header-actions">
                        <BellIcon className="vs-icon" />
                        <HelpIcon className="vs-icon" />
                    </div>
                </header>

                {/* 2. Top Filter Card */}
                <div className="vs-filter-card">
                    <div className="vs-filter-group">
                        <label>Institute</label>
                        <div className="vs-select-wrapper">
                            <select defaultValue="College of Engineering">
                                <option>College of Engineering</option>
                                <option>Institute of Computer Studies</option>
                            </select>
                            <ChevronDown className="vs-select-arrow" size={16} />
                        </div>
                    </div>
                    <div className="vs-filter-group">
                        <label>Year Level</label>
                        <div className="vs-select-wrapper">
                            <select defaultValue="1st Year">
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                            </select>
                            <ChevronDown className="vs-select-arrow" size={16} />
                        </div>
                    </div>
                    <div className="vs-filter-group">
                        <label>Section</label>
                        <div className="vs-select-wrapper">
                            <select defaultValue="All Sections">
                                <option>All Sections</option>
                                <option>3D</option>
                                <option>3A</option>
                            </select>
                            <ChevronDown className="vs-select-arrow" size={16} />
                        </div>
                    </div>
                </div>

                {/* 3. Main Student Data Card */}
                <div className="vs-content-card">
                    
                    {/* Title Section */}
                    <div className="vs-card-header">
                        <h1>BSIT -3D</h1>
                        <a href="#course" className="vs-subtitle">Introduction to Programming</a>
                    </div>

                    {/* Shareable Link Banner (Green) */}
                    <div className="vs-share-banner">
                        <div className="vs-share-content">
                            <div className="vs-share-header">
                                <LinkIcon size={20} />
                                <span>Shareable Form Link</span>
                            </div>
                            <p>Share this link with students so they can submit their own information</p>
                            <div className="vs-link-row">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value="https://a70da40d-721c-415b-ac01-42eb25ef63f6-v2.student.progress.tracker.site/?form=student-info&institute=ComputingScience&section=default" 
                                />
                                <button className="vs-copy-btn" onClick={copyToClipboard}>
                                    <CopyIcon size={14} /> Copy Link
                                </button>
                            </div>
                            <p className="vs-link-note">Students who use this link will be automatically assigned to Computing Science Institute - selected 3D section</p>
                        </div>
                    </div>

                    {/* Accordion / Action Bar */}
                    <div className="vs-action-bar">
                        <div className="vs-accordion-header">
                            <span>Student Information</span>
                            <ChevronDown size={18} />
                        </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="vs-buttons-row">
                        <button className="vs-btn vs-btn-add">
                            <PlusIcon size={16} /> Add Student
                        </button>
                        <button className="vs-btn vs-btn-export">
                            <DownloadIcon size={16} /> Export Full List
                        </button>
                    </div>

                    {/* Table */}
                    <div className="vs-table-container">
                        <table className="vs-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Type of Student</th>
                                    <th>Course</th>
                                    <th>Section & Year</th>
                                    <th>Cellphone #</th>
                                    <th>Email</th>
                                    <th>Home Address</th>
                                    <th></th> {/* Edit Action Column */}
                                </tr>
                            </thead>
                            <tbody>
                                {STUDENTS_DATA.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>{student.type}</td>
                                        <td className="vs-col-course">{student.course}</td>
                                        <td>{student.section}</td>
                                        <td>{student.cell}</td>
                                        <td>{student.email}</td>
                                        <td>{student.address}</td>
                                        <td>
                                        <button 
            className="vs-icon-btn" 
            onClick={() => onPageChange('gradesheet')} // <--- ADD THIS TRIGGER
        >
            <EditIcon size={16} />
        </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewStuds;