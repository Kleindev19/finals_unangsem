// src/components/assets/Dashboard/ViewStuds.jsx

import React, { useState, useEffect, useMemo } from 'react';
import './ViewStuds.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';

// --- ICONS ---
const SearchIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const BellIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);
const HelpIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const ChevronDown = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);
const PlusIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const DownloadIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const XIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const EditIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const ArrowLeft = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const CalendarIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const ChevronLeft = ({ size = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>);
const ChevronRight = ({ size = 24 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>);
const CheckIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);


// --- MOCK HOLIDAYS ---
const HOLIDAYS = {
    "2025-01-01": "New Year's Day",
    "2025-02-14": "Valentine's Event",
    "2025-04-09": "Day of Valor",
    "2025-12-25": "Christmas Day",
    "2025-11-01": "All Saints Day"
};

// --- ADD STUDENT MODAL ---
const AddStudentFormModal = ({ isOpen, onClose, onStudentAdded, sectionName, professorUid }) => { 
    const [formData, setFormData] = useState({
        id: '', name: '', type: 'Regular', course: '', 
        section: sectionName || '', cell: '', email: '', address: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, section: sectionName || '' }));
        }
    }, [isOpen, sectionName]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (!formData.id || !formData.name || !formData.section || !formData.course) { 
                throw new Error('Student ID, Name, Course, and Section are required');
            }

            const response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, professorUid: professorUid })
            });

            const responseData = await response.json();

            if (!response.ok) {
                 if (response.status === 409 || (responseData.message && responseData.message.includes('exists'))) {
                     throw new Error(`Student with ID ${formData.id} already exists.`);
                 }
                throw new Error(responseData.message || 'Failed to add student');
            }

            alert(`Student ${responseData.name} added successfully!`);
            onStudentAdded(responseData);
            
            onClose();
            setFormData({
                id: '', name: '', type: 'Regular', course: '', 
                section: sectionName || '', cell: '', email: '', address: ''
            });
        } catch (error) {
            alert(`Error: ${error.message}\n\nPlease check:\n- Student ID is unique\n- All required fields are filled\n- Backend server is running`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="vs-modal-overlay">
            <div className="vs-modal-card">
                <button className="vs-modal-close" onClick={onClose}><XIcon size={24} /></button>
                <h2 className="vs-modal-title">Add Student Information</h2>
                <form className="vs-modal-form" onSubmit={handleSubmit}>
                    <div className="vs-form-row">
                        <div className="vs-form-group"><label>Student ID</label><input type="text" name="id" value={formData.id} onChange={handleChange} className="vs-modal-input" required /></div>
                        <div className="vs-form-group"><label>Student Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="vs-modal-input" required /></div>
                    </div>
                    <div className="vs-form-row">
                        <div className="vs-form-group">
                            <label>Type of Student</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="vs-modal-select" required>
                                <option value="Regular">Regular</option>
                                <option value="Irregular">Irregular</option>
                            </select>
                        </div>
                        <div className="vs-form-group"><label>Course</label><input type="text" name="course" value={formData.course} onChange={handleChange} className="vs-modal-input" required /></div>
                    </div>
                    <div className="vs-form-row">
                        <div className="vs-form-group"><label>Section & Year</label><input type="text" name="section" value={formData.section} onChange={handleChange} className="vs-modal-input" required /></div>
                        <div className="vs-form-group"><label>Cellphone #</label><input type="text" name="cell" value={formData.cell} onChange={handleChange} className="vs-modal-input" /></div>
                    </div>
                    <div className="vs-form-row">
                        <div className="vs-form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="vs-modal-input" /></div>
                        <div className="vs-form-group"><label>Home Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="vs-modal-input" /></div>
                    </div>
                    <button type="submit" className="vs-modal-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Student'}
                    </button>
                </form>
            </div>
        </div>
    );
};


// 🛑 ATTENDANCE CALENDAR MODAL COMPONENT
const AttendanceCalendarModal = ({ isOpen, onClose, student, onUpdateAttendance }) => {
    const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

    if (!isOpen || !student) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay(); 
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleDayClick = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const holidayName = HOLIDAYS[dateStr];
        if (holidayName) {
            alert(`${holidayName} is marked as a Holiday. Attendance cannot be changed.`);
            return;
        }

        const currentStatus = student.attendance?.[dateStr];
        let newStatus = 'P';
        if (currentStatus === 'P') newStatus = 'A';
        else if (currentStatus === 'A') newStatus = 'L';
        else if (currentStatus === 'L') newStatus = null; 

        onUpdateAttendance(student.id, dateStr, newStatus);
    };

    const att = student.attendance || {};
    const totalP = Object.values(att).filter(s => s === 'P').length;
    const totalA = Object.values(att).filter(s => s === 'A').length;
    const totalL = Object.values(att).filter(s => s === 'L').length;

    const renderCalendarCells = () => {
        const cells = [];
        for (let i = 0; i < startDay; i++) cells.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const status = student.attendance?.[dateStr]; 
            const holidayName = HOLIDAYS[dateStr];
            
            let cellClass = "cal-cell";
            if (holidayName) cellClass += " holiday";
            else if (status) cellClass += ` status-${status}`;

            const today = new Date();
            const isToday = dateObj.toDateString() === today.toDateString();
            if (isToday) cellClass += " today";
            
            cells.push(
                <div 
                    key={day} 
                    className={cellClass} 
                    onClick={() => handleDayClick(day)} 
                    title={holidayName || (status ? `Status: ${status}` : 'Click to mark Present')}
                >
                    <span style={{zIndex: 2, color: isToday ? 'white' : 'inherit'}}>{day}</span>
                    {holidayName && <span className="cal-event-badge">🎉</span>}
                    {status && !holidayName && <span className="cal-status-label">{status}</span>}
                </div>
            );
        }
        return cells;
    };

    return (
        <div className="vs-modal-overlay">
            <div className="vs-modal-card cal-modal">
                <button className="vs-modal-close" onClick={onClose}><XIcon size={20}/></button>
                
                <div className="cal-header">
                    <h2>{student.name}</h2>
                    <p className="cal-subtitle">{student.id} • Attendance Record</p>
                    <div className="cal-stats-row">
                        <span className="cal-stat">✅ Present: {totalP}</span>
                        <span className="cal-stat">❌ Absent: {totalA}</span>
                        <span className="cal-stat">⚠️ Late: {totalL}</span>
                    </div>
                </div>

                <div className="cal-controls">
                    <button className="cal-btn" onClick={handlePrevMonth}><ChevronLeft size={16}/></button>
                    <h3>{monthNames[month]} {year}</h3>
                    <button className="cal-btn" onClick={handleNextMonth}><ChevronRight size={16}/></button>
                </div>

                <div className="cal-grid-header">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="cal-grid">
                    {renderCalendarCells()}
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT: ViewStuds ---
const ViewStuds = ({ onLogout, onPageChange, sectionData, students = [], onRefreshStudents, professorUid }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewOption, setViewOption] = useState('Student Information');
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); 
    
    // ✅ ATTENDANCE STATE
    const [selectedStudentForAttendance, setSelectedStudentForAttendance] = useState(null);

    // ✅ EDITING STATE
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // ✅ VOICE SEARCH HIGHLIGHT STATE
    const [highlightedId, setHighlightedId] = useState(null);

    const sectionName = sectionData?.name;

    const sectionStudents = useMemo(() => {
        return students.filter(student => student.section === sectionName);
    }, [students, sectionName]);

    // --- EFFECT: Handle AI Location Requests ---
    useEffect(() => {
        const handleLocate = (e) => {
            const query = e.detail.toLowerCase();
            console.log("Locating:", query);

            // Find match
            const target = sectionStudents.find(s => 
                s.name.toLowerCase().includes(query) || 
                s.id.toLowerCase().includes(query)
            );

            if (target) {
                setHighlightedId(target.id);
                // Wait for render, then scroll
                setTimeout(() => {
                    const row = document.getElementById(`row-${target.id}`);
                    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);

                // Clear highlight after 3s
                setTimeout(() => setHighlightedId(null), 3000);
            }
        };

        window.addEventListener('CDM_LOCATE_STUDENT', handleLocate);
        return () => window.removeEventListener('CDM_LOCATE_STUDENT', handleLocate);
    }, [sectionStudents]);

    // --- Student Added from Bot/Modal ---
    useEffect(() => {
        const handleBotAdd = (e) => {
            const newStudent = e.detail;
            if (newStudent.section === sectionName) {
                if (onRefreshStudents) {
                    onRefreshStudents();
                }
            }
        };

        window.addEventListener('CDM_STUDENT_ADDED', handleBotAdd);
        return () => window.removeEventListener('CDM_STUDENT_ADDED', handleBotAdd);
    }, [sectionName, onRefreshStudents]); 

    const handleStudentAdded = () => {
        if (onRefreshStudents) onRefreshStudents();
    };
    
    const handleEditClick = (student) => {
        setEditingId(student.id);
        setEditFormData({ ...student }); 
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/students/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData),
            });

            if (response.ok) {
                alert("Student updated successfully!");
                setEditingId(null); 
                if (onRefreshStudents) onRefreshStudents(); 
            } else {
                const errorData = await response.json();
                alert(`Failed to update: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error connecting to server.");
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({});
    };

    const handleViewChange = (e) => {
        const selected = e.target.value;
        setViewOption(selected);
        setSearchTerm(''); 

        const gradeViews = ['Midterm', 'Finals'];
        if (gradeViews.includes(selected)) {
            onPageChange('multipage-gradesheet', { 
                viewType: selected + ' Records',
                title: selected + ' Grade',
                sectionData: sectionData,
                students: sectionStudents 
            });
        }
    };

    const toggleExportMenu = () => { setIsExportMenuOpen(prev => !prev); };
    const exportToExcel = () => { alert("Exporting to Excel..."); setIsExportMenuOpen(false); };
    const exportToPDF = () => { alert("Printing to PDF..."); setIsExportMenuOpen(false); };

    const handleAttendanceUpdate = async (studentId, date, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/students/${studentId}/attendance`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, status: newStatus })
            });

            if (res.ok) {
                if (onRefreshStudents) onRefreshStudents(); 
            }
        } catch (error) {
            console.error("Failed to update attendance", error);
        }
    };

    const renderTable = () => {
        const filtered = sectionStudents.filter(student => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            student.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length === 0) {
            return <div style={{textAlign: 'center', padding: '2rem', color: '#6B7280'}}>No students match your search for "{searchTerm}".</div>;
        }

        if (viewOption === 'Student Information') {
            return (
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((student) => {
                            const isEditing = editingId === student.id;
                            const isHighlighted = highlightedId === student.id;

                            return (
                                <tr 
                                    key={student.id} 
                                    id={`row-${student.id}`} 
                                    className={`${student.isNew ? "vs-row-animate-new" : ""} ${isHighlighted ? "vs-row-highlight" : ""}`}
                                >
                                    <td className="vs-id-text">{student.id}</td>
                                    
                                    <td>
                                        {isEditing ? (
                                            <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} className="vs-table-input" />
                                        ) : (
                                            <span style={{fontWeight: '600'}}>{student.name}</span>
                                        )}
                                    </td>

                                    <td>
                                        {isEditing ? (
                                             <select name="type" value={editFormData.type} onChange={handleEditChange} className="vs-table-select">
                                                 <option value="Regular">Regular</option>
                                                 <option value="Irregular">Irregular</option>
                                             </select>
                                        ) : ( student.type )}
                                    </td>

                                    <td className="vs-col-course">
                                        {isEditing ? (
                                            <input type="text" name="course" value={editFormData.course} onChange={handleEditChange} className="vs-table-input" />
                                        ) : ( student.course )}
                                    </td>

                                    <td style={{textAlign:'center'}}>
                                        {isEditing ? (
                                            <input type="text" name="section" value={editFormData.section} onChange={handleEditChange} className="vs-table-input" style={{width: '60px', textAlign: 'center'}} />
                                        ) : ( student.section )}
                                    </td>

                                    <td>
                                        {isEditing ? (
                                            <input type="text" name="cell" value={editFormData.cell} onChange={handleEditChange} className="vs-table-input" style={{width: '100px'}} />
                                        ) : ( student.cell )}
                                    </td>

                                    <td>
                                        {isEditing ? (
                                            <input type="text" name="email" value={editFormData.email} onChange={handleEditChange} className="vs-table-input" />
                                        ) : ( student.email )}
                                    </td>

                                    <td>
                                        {isEditing ? (
                                            <input type="text" name="address" value={editFormData.address} onChange={handleEditChange} className="vs-table-input" />
                                        ) : ( student.address )}
                                    </td>

                                    <td style={{textAlign: 'center', whiteSpace: 'nowrap'}}>
                                        {isEditing ? (
                                            <>
                                                <button className="vs-action-btn save" onClick={handleSaveEdit} title="Save"><CheckIcon size={16} /></button>
                                                <button className="vs-action-btn cancel" onClick={handleCancelEdit} title="Cancel"><XIcon size={16} /></button>
                                            </>
                                        ) : (
                                            <button className="vs-edit-btn" onClick={() => handleEditClick(student)}><EditIcon size={16} /></button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        } 
        
        else if (viewOption === 'Attendance') {
             return (
                 <table className="vs-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Total Present</th>
                            <th>Total Absent</th>
                            <th>Status</th>
                            <th style={{textAlign: 'center'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((student) => { 
                            const att = student.attendance || {};
                            const absents = Object.values(att).filter(v => v === 'A').length;
                            const presents = Object.values(att).filter(v => v === 'P').length;
                            const isDropped = absents >= 3; 
                            const isHighlighted = highlightedId === student.id;

                            return (
                                <tr key={student.id} id={`row-${student.id}`} className={isHighlighted ? "vs-row-highlight" : ""}>
                                    <td className="vs-id-text">{student.id}</td>
                                    <td style={{fontWeight: '600'}}>{student.name}</td>
                                    <td style={{color: '#166534', fontWeight: 'bold'}}>{presents}</td>
                                    <td style={{color: isDropped ? 'red' : 'inherit', fontWeight: isDropped ? 'bold' : 'normal'}}>
                                        {absents}
                                    </td>
                                    <td>
                                        <span style={{
                                            backgroundColor: isDropped ? '#fee2e2' : '#dcfce7',
                                            color: isDropped ? '#991b1b' : '#166534',
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700'
                                        }}>
                                            {isDropped ? 'DROPPED' : 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <button className="vs-btn-manage" onClick={() => setSelectedStudentForAttendance(student)}>
                                            <CalendarIcon size={16}/> Manage
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                 </table>
             );
        }
        return <div style={{padding: '2rem', textAlign: 'center'}}>Loading...</div>;
    };

    return (
        <div className="view-studs-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="dashboard" onWidthChange={setSidebarWidth} />

            <div className="view-studs-main" style={{ marginLeft: sidebarWidth }}>
                
                <header className="vs-header">
                    <div className="vs-search-container">
                        <SearchIcon className="vs-search-icon" size={20} />
                        <input type="text" placeholder="Search students" className="vs-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="vs-header-actions">
                        <BellIcon className="vs-icon" size={24} />
                        <HelpIcon className="vs-icon" size={24} />
                    </div>
                </header>

                <button className="vs-back-btn" onClick={() => onPageChange('dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="vs-content-card">
                    <div className="vs-card-header">
                        <h1>{sectionName || 'Section'}</h1>
                        <span className="vs-subtitle">{sectionData?.subtitle || 'Course Description'}</span>
                    </div>

                    <div className="vs-controls-row">
                        <div className="vs-dropdown-wrapper">
                             <select className="vs-section-dropdown" value={viewOption} onChange={handleViewChange}>
                                 <option>Student Information</option>
                                 <option>Attendance</option>
                                 <option>Midterm</option>
                                 <option>Finals</option>
                             </select>
                             <ChevronDown size={16} style={{position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}}/>
                        </div>
                    </div>

                    {viewOption === 'Student Information' && (
                             <div className="vs-buttons-row">
                                 <button className="vs-btn vs-btn-add" onClick={() => setIsAddModalOpen(true)}>
                                     <PlusIcon size={16} /> Add Student
                                 </button>
                                 
                                 <div className="vs-export-dropdown-wrapper">
                                     <button className="vs-btn vs-btn-export" onClick={toggleExportMenu}>
                                         <DownloadIcon size={16} /> Export Full List <ChevronDown size={16} style={{marginLeft: '4px'}} />
                                     </button>
                                     
                                     {isExportMenuOpen && (
                                         <div className="vs-export-menu">
                                             <button onClick={exportToExcel} className="vs-export-menu-item">Export as Excel (.csv)</button>
                                             <button onClick={exportToPDF} className="vs-export-menu-item">Print/Export as PDF</button>
                                         </div>
                                     )}
                                 </div>
                             </div>
                    )}

                    <div className="vs-table-container">
                        {renderTable()}
                    </div>
                </div>
            </div>

            <AddStudentFormModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onStudentAdded={handleStudentAdded}
                sectionName={sectionName}
                professorUid={professorUid}
            />
            
            {selectedStudentForAttendance && (
                <AttendanceCalendarModal 
                    isOpen={!!selectedStudentForAttendance}
                    student={selectedStudentForAttendance}
                    onClose={() => setSelectedStudentForAttendance(null)}
                    onUpdateAttendance={handleAttendanceUpdate}
                />
            )}
            
            <style>{`
                .vs-back-btn {
                    display: inline-flex; align-items: center; gap: 6px; padding: 8px 15px; margin: 0 0 10px 20px;
                    border-radius: 20px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
                    background-color: #E0E7FF; color: #3B82F6; border: 1px solid #C7D2FE; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .vs-back-btn:hover { background-color: #C7D2FE; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .vs-back-btn:active { background-color: #A5B4FC; }
                .vs-back-btn svg { stroke-width: 2.5; width: 18px; height: 18px; }

                .vs-table-input, .vs-table-select {
                    width: 100%; padding: 4px 6px; border: 1px solid #3B82F6; border-radius: 4px; font-size: 0.85rem; font-family: inherit; outline: none; background-color: #EFF6FF;
                }
                .vs-action-btn { border: none; background: none; cursor: pointer; padding: 4px; margin: 0 2px; border-radius: 4px; transition: background-color 0.2s; }
                .vs-action-btn.save { color: #166534; }
                .vs-action-btn.save:hover { background-color: #dcfce7; }
                .vs-action-btn.cancel { color: #991b1b; }
                .vs-action-btn.cancel:hover { background-color: #fee2e2; }

                .vs-export-dropdown-wrapper { position: relative; display: inline-block; }
                .vs-export-menu {
                    position: absolute; top: 100%; right: 0; z-index: 10;
                    background: white; border: 1px solid #E5E7EB; border-radius: 6px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                    min-width: 180px; margin-top: 5px; overflow: hidden; display: flex; flex-direction: column;
                }
                .vs-export-menu-item { display: block; width: 100%; padding: 10px 15px; text-align: left; background: none; border: none; cursor: pointer; font-size: 0.9rem; color: #4B5563; }
                .vs-export-menu-item:hover { background-color: #F3F4F6; color: #1F2937; }
                
                @media print {
                    .vs-header, .vs-floating-filter-bar, .vs-controls-row, .vs-share-banner,
                    .vs-buttons-row, .view-studs-layout > .sidebar, .vs-legend, .vs-edit-btn, .vs-back-btn { display: none !important; }
                    .view-studs-main { margin-left: 0 !important; width: 100%; }
                    .vs-content-card { box-shadow: none !important; border: none !important; }
                } 
            `}</style>
        </div>
    );
};

export default ViewStuds;