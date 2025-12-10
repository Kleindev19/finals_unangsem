// src/components/assets/Dashboard/ViewStuds.jsx

import React, { useState, useEffect, useMemo } from 'react';
import './ViewStuds.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';

// --- ICONS (Adjusted to consistently use a size prop if provided) ---
// Note: Added default size=24 to ensure icons work even if size prop isn't passed
const SearchIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const BellIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);
const HelpIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const ChevronDown = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);
const PlusIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const DownloadIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const XIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const EditIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const UploadIcon = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const ArrowLeft = ({ size = 24, ...props }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);

const ATTENDANCE_DATES = ['Sept 15', 'Sept 16', 'Sept 18', 'Sept 19', 'Sept 22', 'Sept 23', 'Sep 24', 'Sept 25'];

// --- SUB-COMPONENT: ATTENDANCE CELL ---
const AttendanceCell = React.memo(({ status, onChange }) => { // Using React.memo for performance
    let className = 'vs-status-pill';
    let content = status;

    if (status === 'P') className += ' vs-p';
    else if (status === 'A') className += ' vs-a';
    else if (status === 'L') className += ' vs-l';
    else if (status === 'SUSPENDED' || status === 'HOLIDAY') className = 'vs-tag-full';

    return (
        <td className="vs-cell-relative">
            <div className={className}>
                {status === 'SUSPENDED' || status === 'HOLIDAY' ? status : <>{content} <ChevronDown className="vs-chevron-mini" size={12} /></>}
            </div>
            <select 
                className="vs-cell-select"
                value={status}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="P">Present (P)</option>
                <option value="A">Absent (A)</option>
                <option value="L">Late (L)</option>
                <option disabled>──────────</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="HOLIDAY">Holiday</option>
            </select>
        </td>
    );
});

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
            // FIX: Added 'course' to required fields to match form structure
            if (!formData.id || !formData.name || !formData.section || !formData.course) { 
                throw new Error('Student ID, Name, Course, and Section are required');
            }

            // Save to MongoDB (NOTE: Assumed backend call)
            const response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    professorUid: professorUid
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                 // FIX: Check for duplicate key or specific errors
                 if (response.status === 409) {
                     throw new Error(`Student with ID ${formData.id} already exists.`);
                 }
                throw new Error(responseData.message || 'Failed to add student');
            }

            console.log('✅ Student saved to database:', responseData.name);
            alert(`Student ${responseData.name} added successfully!`);
            
            // Call parent callback to refresh student list
            onStudentAdded(responseData);
            
            // Close modal and reset form
            onClose();
            setFormData({
                id: '', name: '', type: 'Regular', course: '', 
                section: sectionName || '', cell: '', email: '', address: ''
            });
        } catch (error) {
            console.error('Error adding student:', error);
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

// --- MAIN COMPONENT ---
const ViewStuds = ({ onLogout, onPageChange, sectionData, students = [], onRefreshStudents, professorUid }) => {
    // Destructuring props for cleaner usage
    const sectionName = sectionData?.name;
    
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewOption, setViewOption] = useState('Student Information');
    const [attendanceData, setAttendanceData] = useState({}); 
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); 

    // Filter students for THIS section only
    const sectionStudents = useMemo(() => {
        return students.filter(student => student.section === sectionName);
    }, [students, sectionName]);

    // FIX 1: Robust State Initialization for Attendance
    // This hook ensures attendanceData is initialized (or reset) every time the section changes.
    useEffect(() => {
        if (!sectionStudents.length) {
            setAttendanceData({}); // Clear if no students
            return;
        }
        
        const initialAttendance = {};
        sectionStudents.forEach(student => {
            // Initialize with default attendance records (e.g., all 'A' for Absent)
            // If the application fetched attendance records, this logic would combine the fetched data 
            // with the default fill. For now, it defaults to all 'A'.
            initialAttendance[student.id] = Array(ATTENDANCE_DATES.length).fill('A'); 
        });
        setAttendanceData(initialAttendance);
    // Dependency array includes sectionName to trigger reset when a new section is loaded
    }, [sectionName, sectionStudents.length]); 


    useEffect(() => {
        const handleBotAdd = (e) => {
            const newStudent = e.detail;
            if (newStudent.section === sectionName) {
                // Refresh from database instead of local update
                if (onRefreshStudents) {
                    onRefreshStudents();
                }
            }
        };

        window.addEventListener('CDM_STUDENT_ADDED', handleBotAdd);
        return () => window.removeEventListener('CDM_STUDENT_ADDED', handleBotAdd);
    }, [sectionName, onRefreshStudents]); 

    const handleViewChange = (e) => {
        const selected = e.target.value;
        setViewOption(selected);
        setIsExportMenuOpen(false);
        setSearchTerm(''); 

        const gradeViews = ['Midterm', 'Finals', 'Assignment', 'Quizzes', 'Activities'];

        if (gradeViews.includes(selected)) {
            let displayTitle = selected;
            if (selected === 'Midterm') displayTitle = 'Midterm Grade';
            if (selected === 'Finals') displayTitle = 'Finals Grade';
            if (selected === 'Assignment') displayTitle = 'Assignments';
            
            // Route to external gradesheet component for grade views
            onPageChange('multipage-gradesheet', { 
                viewType: selected + ' Records', // e.g., 'Midterm Records'
                title: displayTitle,
                students: sectionStudents 
            });
        } else if (selected === 'Attendance') {
             // FIX 2: Stop changing page for 'Attendance' if it's handled here by renderTable()
             // Set the view option, but DO NOT call onPageChange.
             // setViewOption(selected) already handles the table render.
        }
        // If viewOption is 'Student Information', it remains in this component.
    };

    const handleStudentAdded = (savedStudent) => {
        console.log('Student added, refreshing list...');
        // Refresh the student list from database
        if (onRefreshStudents) {
            onRefreshStudents();
        }
    };
    
    const handleStatusChange = (studentId, dayIndex, newStatus) => {
        // Attendance data is now reliably initialized in useEffect
        const currentRecords = [...(attendanceData[studentId] || [])]; 
        currentRecords[dayIndex] = newStatus;
        setAttendanceData(prev => ({ ...prev, [studentId]: currentRecords }));
    };

    const handleEditClick = (studentName) => {
        alert(`Edit feature for ${studentName} coming soon!`);
    };
    
    // FIX: Combined the export menu toggle into a dedicated function for cleanliness
    const toggleExportMenu = () => {
         setIsExportMenuOpen(prev => !prev);
    };

    const exportToExcel = () => {
        setIsExportMenuOpen(false);
        
        if (sectionStudents.length === 0) {
             alert("No student records to export.");
             return;
        }

        const headers = ["Student ID", "Student Name", "Type of Student", "Course", "Section & Year", "Cellphone #", "Email", "Home Address"];
        const rows = sectionStudents.map(s => [
            s.id, s.name, s.type, s.course, s.section, s.cell, s.email, s.address
        ]);

        const allData = [headers, ...rows];
        const csvContent = allData.map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${sectionName || 'Student'}_List.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("Your browser does not support automatic CSV download.");
        }
    };

    const exportToPDF = () => {
        setIsExportMenuOpen(false);
        
        if (sectionStudents.length === 0) {
             alert("No student records to print/save as PDF.");
             return;
        }

        window.print(); 
    };

    const filteredStudents = sectionStudents.filter(student => {
        if (viewOption !== 'Student Information') return true; 
        if (searchTerm === '') return true;

        const lowerCaseSearch = searchTerm.toLowerCase();
        
        return (
            student.name.toLowerCase().includes(lowerCaseSearch) ||
            student.id.toLowerCase().includes(lowerCaseSearch) ||
            student.course.toLowerCase().includes(lowerCaseSearch) ||
            student.section.toLowerCase().includes(lowerCaseSearch)
        );
    });

    const renderTable = () => {
        if (viewOption === 'Student Information') {
            if (sectionStudents.length === 0) return <div className="vs-status-message">No students found for this section. Click "Add Student" to begin.</div>;
            
            if (searchTerm !== '' && filteredStudents.length === 0) {
                 return <div className="vs-status-message">No students match your search for "{searchTerm}".</div>;
            }
            
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
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className={student.isNew ? "vs-row-animate-new" : ""}>
                                <td className="vs-id-text">{student.id}</td>
                                <td style={{fontWeight: '600'}}>{student.name}</td>
                                <td>{student.type}</td>
                                <td className="vs-col-course">{student.course}</td>
                                <td style={{textAlign:'center'}}>{student.section}</td>
                                <td>{student.cell}</td>
                                <td>{student.email}</td>
                                <td>{student.address}</td>
                                <td style={{textAlign: 'center'}}>
                                    <button className="vs-edit-btn" onClick={() => handleEditClick(student.name)}>
                                        <EditIcon size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (viewOption === 'Attendance') {
             if (sectionStudents.length === 0) return <div className="vs-status-message">No students found for attendance tracking.</div>;
             
             return (
                 <table className="vs-table">
                    <thead>
                        <tr>
                            <th className="fixed-col">Student ID</th>
                            <th className="fixed-col">Student Name</th>
                            <th className="fixed-col">Type of Student</th>
                            {ATTENDANCE_DATES.map((date, idx) => (
                                <th key={idx} style={{textAlign: 'center'}}>{date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sectionStudents.map((student) => { 
                            // Attendance records are guaranteed to be initialized by useEffect
                            const records = attendanceData[student.id] || Array(ATTENDANCE_DATES.length).fill('A'); 
                            return (
                                <tr key={student.id} className={student.isNew ? "vs-row-animate-new" : ""}>
                                    <td className="fixed-col vs-id-text">{student.id}</td>
                                    <td className="fixed-col" style={{fontWeight: '600'}}>{student.name}</td>
                                    <td className="fixed-col">{student.type}</td>
                                    {ATTENDANCE_DATES.map((_, idx) => (
                                        <AttendanceCell 
                                            key={idx}
                                            status={records[idx] || 'A'} 
                                            onChange={(newStatus) => handleStatusChange(student.id, idx, newStatus)}
                                        />
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                 </table>
             );
        }
        return <div style={{padding: '2rem', textAlign: 'center'}}>Feature coming soon for {viewOption}</div>;
    };

    return (
        <div className="view-studs-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="dashboard" onWidthChange={setSidebarWidth} />

            <div className="view-studs-main" style={{ marginLeft: sidebarWidth }}>
                <header className="vs-header">
                    <div className="vs-search-container">
                        <SearchIcon className="vs-search-icon" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search students" 
                            className="vs-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {viewOption === 'Attendance' && (
                        <div className="vs-top-toolbar">
                            <button className="vs-btn vs-btn-white-outline"><PlusIcon size={14}/> Add Column</button>
                            <button className="vs-btn vs-btn-white-outline"><UploadIcon size={14}/> Export Excel</button>
                        </div>
                    )}

                    <div className="vs-header-actions">
                        <BellIcon className="vs-icon" size={24} />
                        <HelpIcon className="vs-icon" size={24} />
                    </div>
                </header>

                {/* --- BACK BUTTON (Updated to use the new pill design) --- */}
                <button 
                    className="vs-back-btn" 
                    onClick={() => onPageChange('dashboard')} // Assumes 'dashboard' is the main section listing page
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                {/* --- END BACK BUTTON --- */}

                <div className="vs-content-card">
                    {viewOption === 'Student Information' && (
                        <div className="vs-card-header">
                            <h1>{sectionName || 'Section'}</h1>
                            <span className="vs-subtitle">{sectionData?.subtitle || 'Course Description'}</span>
                        </div>
                    )}

                    <div className="vs-controls-row">
                        <div className="vs-dropdown-wrapper">
                             <select 
                                 className="vs-section-dropdown"
                                 value={viewOption}
                                 onChange={handleViewChange} 
                             >
                                 <option>Student Information</option>
                                 <option>Attendance</option>
                                 <option>Midterm</option>
                                 <option>Finals</option>
                             </select>
                             <ChevronDown className="vs-dropdown-arrow" size={18} />
                        </div>

                        {viewOption === 'Attendance' && (
                            <button className="vs-btn vs-btn-export">
                                <DownloadIcon size={16} /> Attendance Sheet
                            </button>
                        )}
                    </div>

                    {viewOption === 'Student Information' && (
                             <div className="vs-buttons-row">
                                 <button className="vs-btn vs-btn-add" onClick={() => setIsAddModalOpen(true)}>
                                     <PlusIcon size={16} /> Add Student
                                 </button>
                                 
                                 <div className="vs-export-dropdown-wrapper">
                                     <button 
                                         className="vs-btn vs-btn-export" 
                                         onClick={toggleExportMenu} // Using the dedicated function
                                     >
                                         <DownloadIcon size={16} /> Export Full List <ChevronDown size={16} style={{marginLeft: '4px'}} />
                                     </button>
                                     
                                     {isExportMenuOpen && (
                                         <div className="vs-export-menu">
                                             <button onClick={exportToExcel} className="vs-export-menu-item">
                                                 Export as Excel (.csv)
                                             </button>
                                             <button onClick={exportToPDF} className="vs-export-menu-item">
                                                 Print/Export as PDF
                                             </button>
                                         </div>
                                     )}
                                 </div>
                             </div>
                    )}

                    <div className="vs-table-container">
                        {renderTable()}
                    </div>

                    {viewOption === 'Attendance' && (
                        <div className="vs-legend">
                            <div className="vs-legend-item"><span className="vs-p-pill">P</span> Present</div>
                            <div className="vs-legend-item"><span className="vs-a-pill">A</span> Absent</div>
                            <div className="vs-legend-item"><span className="vs-l-pill">L</span> Absent (Late)</div>
                        </div>
                    )}
                </div>
            </div>

            <AddStudentFormModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onStudentAdded={handleStudentAdded}
                sectionName={sectionName}
                professorUid={professorUid}
            />
            
            <style>{`
                /* --- UPDATED BACK BUTTON DESIGN --- */
                .vs-back-btn {
                    /* New Button Look: Pill-shaped, light blue style */
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 15px;
                    margin: 0 0 10px 20px; /* Aligns with card content and provides separation */
                    border-radius: 20px; /* Pill shape */
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    
                    /* Design */
                    background-color: #E0E7FF; /* Light blue/lavender */
                    color: #3B82F6; /* Blue-500 text */
                    border: 1px solid #C7D2FE; /* Lighter border */
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .vs-back-btn:hover {
                    background-color: #C7D2FE; /* Darker hover background */
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .vs-back-btn:active {
                    background-color: #A5B4FC;
                }

                .vs-back-btn svg {
                    stroke-width: 2.5;
                    width: 18px; /* Slightly smaller icon */
                    height: 18px;
                }
                
                /* EXISTING CSS BELOW */
                .vs-export-dropdown-wrapper {
                    position: relative;
                    display: inline-block;
                }
                .vs-export-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    z-index: 10;
                    background: white;
                    border: 1px solid #E5E7EB;
                    border-radius: 6px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                    min-width: 180px;
                    margin-top: 5px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .vs-export-menu-item {
                    display: block;
                    width: 100%;
                    padding: 10px 15px;
                    text-align: left;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 0.9rem;
                    color: #4B5563;
                }
                .vs-export-menu-item:hover {
                    background-color: #F3F4F6;
                    color: #1F2937;
                }
                
                @media print {
                    .vs-header,
                    .vs-floating-filter-bar,
                    .vs-controls-row,
                    .vs-share-banner,
                    .vs-buttons-row,
                    .view-studs-layout > .sidebar,
                    .vs-legend,
                    .vs-edit-btn,
                    .vs-back-btn { /* Ensure it hides on print */
                        display: none !important;
                    }
                    .view-studs-main {
                        margin-left: 0 !important; 
                        width: 100%;
                    }
                    .vs-content-card {
                        box-shadow: none !important;
                        border: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ViewStuds;