// src/components/assets/Dashboard/MultiPageGS.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './MultiPageGS.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import { ActivityModal } from './ModalComponents';
// ---------------------------------------------
// NEW IMPORT: GradesheetView (default), GradesheetSideCardsExport, and calculateTermGrade helper
import GradesheetView, { GradesheetSideCardsExport, calculateTermGrade } from './Gradesheet';
// ---------------------------------------------

// --- ICONS ---
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const Filter = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>);
const Download = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const Plus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const Upload = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const ChevronDown = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);
const Trash = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
const RotateCcw = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>);

// --- INITIAL DATA STRUCTURES (Used for initial load only) ---
const INITIAL_QUIZ_COLS = [
    { id: 'q1', label: 'Q1', max: 20 },
    { id: 'q2', label: 'Q2', max: 20 },
    { id: 'q3', label: 'Q3', max: 20 },
    { id: 'q4', label: 'Q4', max: 25 }, 
];
const INITIAL_ACT_COLS = [
    { id: 'act1', label: 'ACT 1', max: 30 },
    { id: 'act2', label: 'ACT 2', max: 30 },
    { id: 'act3', label: 'ACT 3', max: 50 },
    { id: 'act4', label: 'ACT 4', max: 50 }, 
];
const REC_COLS = [{ id: 'r1', label: 'R1' }]; 
const EXAM_COLS = [{ id: 'exam', label: 'Major Exam' }]; 

// --- MOCK DATES FOR ATTENDANCE ---
const MIDTERM_DATES = ['Sept 4', 'Sept 11', 'Sept 18', 'Sept 25', 'Oct 2', 'Oct 9'];
const FINALS_DATES = ['Nov 6', 'Nov 13', 'Nov 20', 'Nov 27', 'Dec 4', 'Dec 11'];

// --- PERSISTENCE KEYS ---
const GRADES_STORAGE_KEY = 'progressTracker_studentScores_v1';
const ATTENDANCE_STORAGE_KEY = 'progressTracker_attendanceData_v1';
const QUIZ_COLS_KEY = 'progressTracker_quizCols_v1';
const ACT_COLS_KEY = 'progressTracker_actCols_v1';
const REMOVED_QUIZ_COLS_KEY = 'progressTracker_removedQuizCols_v1'; 
const REMOVED_ACT_COLS_KEY = 'progressTracker_removedActCols_v1'; 
const REC_MAX_KEY = 'progressTracker_recMax_v1';
const EXAM_MAX_KEY = 'progressTracker_examMax_v1';

// --- HELPER: Persistence Loaders for Columns ---
const initializeCols = (key, initialData) => {
    const savedCols = localStorage.getItem(key);
    if (savedCols) {
        try {
            return JSON.parse(savedCols);
        } catch (e) {
            console.error(`Could not parse saved columns for ${key}:`, e);
        }
    }
    return initialData;
};

// --- HELPER: Persistence Loader for Simple Max Scores ---
const initializeMaxScore = (key, initialMax) => {
    const savedMax = localStorage.getItem(key);
    if (savedMax !== null) {
        return parseFloat(savedMax) || initialMax;
    }
    return initialMax;
};

// --- NEW HELPER: Persistence Loader for Attendance (WITH DEBUG LOG) ---
const initializeAttendance = () => {
    const savedAttendanceJSON = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (savedAttendanceJSON) {
        try {
            const data = JSON.parse(savedAttendanceJSON);
            console.log("DEBUG (Attendance): Loaded attendance data from localStorage:", data); // ADDED DEBUG LOG: LOAD
            return data;
        } catch (e) {
            console.error("Could not parse saved attendance data:", e);
        }
    }
    console.log("DEBUG (Attendance): No attendance data found in localStorage. Initializing empty state."); // ADDED DEBUG LOG: NO DATA FOUND
    return {};
};


// --- HELPER: Initialize Score State (Handles initial load from storage OR creating new placeholders) ---
const initializeScores = (students, currentQuizCols, currentActCols) => {
    const savedScoresJSON = localStorage.getItem(GRADES_STORAGE_KEY);
    let savedScores = {};
    if (savedScoresJSON) {
        try {
            savedScores = JSON.parse(savedScoresJSON);
        } catch (e) {
            console.error("Could not parse saved student scores:", e);
        }
    }

    const initialScores = {};
    const quizIds = currentQuizCols.map(c => c.id);
    const actIds = currentActCols.map(c => c.id);
    const labIds = actIds.map(id => id.replace('act', 'lab'));

    students.forEach(student => {
        const studentData = savedScores[student.id] || {}; // Start with saved data

        // Ensure all current columns have a key, defaulting to '' if not in saved data
        quizIds.forEach(id => { if (studentData[id] === undefined) studentData[id] = ''; });
        actIds.forEach(id => { if (studentData[id] === undefined) studentData[id] = ''; }); 
        labIds.forEach(id => { if (studentData[id.replace('act', 'lab')] === undefined) studentData[id.replace('act', 'lab')] = ''; }); // Labs/Assignments
        
        if (studentData['r1_mid'] === undefined) studentData['r1_mid'] = ''; // Recitation Midterm
        if (studentData['exam_mid'] === undefined) studentData['exam_mid'] = ''; // Exam Midterm
        if (studentData['r1_fin'] === undefined) studentData['r1_fin'] = ''; // Recitation Finals
        if (studentData['exam_fin'] === undefined) studentData['exam_fin'] = ''; // Exam Finals

        initialScores[student.id] = studentData;
    });
    return initialScores;
};


// --- HELPER: Grade Calculation based on the user's formula (REMOVED - now imported from Gradesheet.jsx) ---
// const calculateTermGrade = (scores, isMidterm, currentQuizCols, currentActCols, recMax, examMax) => {
//     // ... (REMOVED LOGIC)
// };


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

// Component for the editable max score input field
const MaxScoreInput = ({ value, type, id, onChange }) => (
    <input 
        type="number"
        className="mp-table-input mp-max-score-input"
        value={value === 0 ? '' : value} // Show empty string if value is 0
        onChange={(e) => onChange(type, id, e.target.value)}
        min="0"
        style={{textAlign: 'center', width: '90%'}}
    />
);


const MultiPageGS = ({ onLogout, onPageChange, viewType = 'Midterm Records', title = 'Midterm Grade', students = [], sectionData }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState(viewType);
    const [attendanceTerm, setAttendanceTerm] = useState('Midterm Attendance');
    
    // NEW STATE: Search term for student filtering
    const [searchTerm, setSearchTerm] = useState('');

    // STATES FOR DYNAMIC COLUMNS
    const [quizCols, setQuizCols] = useState(() => initializeCols(QUIZ_COLS_KEY, INITIAL_QUIZ_COLS));
    const [actCols, setActCols] = useState(() => initializeCols(ACT_COLS_KEY, INITIAL_ACT_COLS));

    // NEW STATES FOR REMOVED COLUMNS (for restore functionality)
    const [removedQuizCols, setRemovedQuizCols] = useState(() => initializeCols(REMOVED_QUIZ_COLS_KEY, []));
    const [removedActCols, setRemovedActCols] = useState(() => initializeCols(REMOVED_ACT_COLS_KEY, []));

    // STATE: TOGGLES FOR DROPDOWNS
    const [isRemoveMenuOpen, setIsRemoveMenuOpen] = useState(false);
    const [isRestoreMenuOpen, setIsRestoreMenuOpen] = useState(false); // NEW TOGGLE

    // STATES FOR STATIC ASSESSMENT MAX SCORES (Editable)
    const [recMax, setRecMax] = useState(() => initializeMaxScore(REC_MAX_KEY, 100));
    const [examMax, setExamMax] = useState(() => initializeMaxScore(EXAM_MAX_KEY, 60));

    // STATE: Holds the editable scores
    const [studentScores, setStudentScores] = useState(() => initializeScores(students, quizCols, actCols));
    // STATE: Placeholder for Attendance Data
    const [localAttendanceData, setLocalAttendanceData] = useState(() => initializeAttendance()); // MODIFIED: Use initializeAttendance
    
    // Effect to persist studentScores whenever it changes (CRUCIAL for grade persistence)
    useEffect(() => {
        try {
            localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(studentScores));
        } catch (e) {
            console.error("Could not save student scores to localStorage:", e);
        }
    }, [studentScores]);

    // Effects for column and max score persistence
    useEffect(() => { try { localStorage.setItem(QUIZ_COLS_KEY, JSON.stringify(quizCols)); } catch (e) { console.error("Could not save quiz columns to localStorage:", e); } }, [quizCols]);
    useEffect(() => { try { localStorage.setItem(ACT_COLS_KEY, JSON.stringify(actCols)); } catch (e) { console.error("Could not save activity columns to localStorage:", e); } }, [actCols]);
    
    // NEW: Effects for removed column persistence
    useEffect(() => { try { localStorage.setItem(REMOVED_QUIZ_COLS_KEY, JSON.stringify(removedQuizCols)); } catch (e) { console.error("Could not save removed quiz columns to localStorage:", e); } }, [removedQuizCols]);
    useEffect(() => { try { localStorage.setItem(REMOVED_ACT_COLS_KEY, JSON.stringify(removedActCols)); } catch (e) { console.error("Could not save removed activity columns to localStorage:", e); } }, [removedActCols]);
    
    useEffect(() => { try { localStorage.setItem(REC_MAX_KEY, String(recMax)); } catch (e) { console.error("Could not save recMax to localStorage:", e); } }, [recMax]);
    useEffect(() => { try { localStorage.setItem(EXAM_MAX_KEY, String(examMax)); } catch (e) { console.error("Could not save examMax to localStorage:", e); } }, [examMax]);

    // --- NEW EFFECT: To persist attendance data whenever it changes (WITH DEBUG LOG) ---
    useEffect(() => {
        try {
            localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(localAttendanceData));
            console.log("DEBUG (Attendance): Saved attendance data to localStorage."); // ADDED DEBUG LOG: SAVE
        } catch (e) {
            console.error("Could not save attendance data to localStorage:", e);
        }
    }, [localAttendanceData]);

    // Initialize/Re-initialize scores if the students list OR columns change
    useEffect(() => {
        setStudentScores(prevScores => {
            return students.reduce((acc, student) => {
                const studentData = prevScores[student.id] || {};
                
                // Merge existing scores with placeholders for new columns
                const mergedData = {
                    ...initializeScores([student], quizCols, actCols)[student.id], // Placeholders for all columns
                    ...studentData // Overwrite with existing student data
                };
                
                acc[student.id] = mergedData;
                return acc;
            }, {});
        });
    }, [students, quizCols, actCols]);

    useEffect(() => { if (viewType) setCurrentView(viewType); }, [viewType]);

    // HANDLER: For student search input
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Handler for student score input field changes
    const handleScoreChange = (studentId, assessmentId, value) => {
        const parsedValue = value === '' ? '' : parseFloat(value);
        
        // Ensure the value is a non-negative number or empty string
        const numericValue = isNaN(parsedValue) || parsedValue < 0 ? '' : parsedValue;

        setStudentScores(prevScores => ({
            ...prevScores,
            [studentId]: {
                ...prevScores[studentId],
                [assessmentId]: numericValue,
            },
        }));
    };
    
    // HANDLER: For updating the max score of any column (Quiz, Act, Rec, Exam)
    const handleMaxScoreChange = (type, id, value) => {
        const parsedValue = value === '' ? 0 : parseFloat(value);
        // Ensure the final value is a non-negative number
        const finalValue = Math.max(0, isNaN(parsedValue) ? 0 : parsedValue); 

        if (type === 'quiz') {
            setQuizCols(prevCols => prevCols.map(col => 
                col.id === id ? { ...col, max: finalValue } : col
            ));
        } else if (type === 'act') {
            setActCols(prevCols => prevCols.map(col => 
                col.id === id ? { ...col, max: finalValue } : col
            ));
        } else if (type === 'rec') {
            setRecMax(finalValue);
        } else if (type === 'exam') {
            setExamMax(finalValue);
        }
    };

    // Handler for Attendance cell changes (WITH DEBUG LOG)
    const handleAttendanceCellChange = (studentId, dateIndex, status) => {
        setLocalAttendanceData(prevData => {
            const currentTermDates = attendanceTerm === 'Midterm Attendance' ? MIDTERM_DATES : FINALS_DATES;
            const key = `${studentId}-${currentTermDates[dateIndex]}`;
            
            const newData = { ...prevData, [key]: status };
            console.log(`DEBUG (Attendance): Updated attendance status for ${studentId} on ${currentTermDates[dateIndex]} to ${status}.`); // ADDED DEBUG LOG: CHANGE
            return newData;
        });
    };

    // --- Student Filtering Logic ---
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        student.id.toLowerCase().includes(lowerCaseSearchTerm)
    );
    // --- End Filtering Logic ---

    // --- TOGGLE HANDLERS (for dropdown menus) ---
    const toggleRemoveMenu = useCallback(() => {
        setIsRemoveMenuOpen(prev => !prev);
        if (!isRemoveMenuOpen) setIsRestoreMenuOpen(false); // Close restore menu when opening remove
    }, [isRemoveMenuOpen]);

    const toggleRestoreMenu = useCallback(() => {
        setIsRestoreMenuOpen(prev => !prev);
        if (!isRestoreMenuOpen) setIsRemoveMenuOpen(false); // Close remove menu when opening restore
    }, [isRestoreMenuOpen]);


    // --- UPDATE: Handle Remove Column (Moves to removed state) ---
    const handleRemoveColumn = (type, id, label) => {
        if (window.confirm(`Are you sure you want to remove ${label}? The scores in this column will be preserved for restoration.`)) {
            if (type === 'quiz') {
                setQuizCols(prevCols => {
                    const colToRemove = prevCols.find(col => col.id === id);
                    if (colToRemove) {
                        setRemovedQuizCols(prevRemoved => [...prevRemoved, colToRemove]);
                    }
                    return prevCols.filter(col => col.id !== id);
                });
            } else if (type === 'act') {
                setActCols(prevCols => {
                    const colToRemove = prevCols.find(col => col.id === id);
                    if (colToRemove) {
                        setRemovedActCols(prevRemoved => [...prevRemoved, colToRemove]);
                    }
                    return prevCols.filter(col => col.id !== id);
                });
            }
            setIsRemoveMenuOpen(false); // Close menu after selection
        }
    };

    // --- NEW: Handle Restore Column (Moves from removed state back to active state) ---
    const handleRestoreColumn = (type, id) => {
        if (type === 'quiz') {
            setRemovedQuizCols(prevRemoved => {
                const colToRestore = prevRemoved.find(col => col.id === id);
                if (colToRestore) {
                    // Add back to quizCols, sort by label number
                    setQuizCols(prevCols => [...prevCols, colToRestore].sort((a, b) => {
                        const numA = parseInt(a.label.match(/\d+/)?.[0] || Infinity);
                        const numB = parseInt(b.label.match(/\d+/)?.[0] || Infinity);
                        return numA - numB;
                    }));
                }
                // Remove from removed list
                return prevRemoved.filter(col => col.id !== id);
            });
        } else if (type === 'act') {
            setRemovedActCols(prevRemoved => {
                const colToRestore = prevRemoved.find(col => col.id === id);
                if (colToRestore) {
                    // Add back to actCols, sort by label number
                    setActCols(prevCols => [...prevCols, colToRestore].sort((a, b) => {
                        const numA = parseInt(a.label.match(/\d+/)?.[0] || Infinity);
                        const numB = parseInt(b.label.match(/\d+/)?.[0] || Infinity);
                        return numA - numB;
                    }));
                }
                // Remove from removed list
                return prevRemoved.filter(col => col.id !== id);
            });
        }
        setIsRestoreMenuOpen(false); // Close menu after selection
    };

    // --- NEW: Add Column Handlers (No change, just keeping for context) ---
    const handleAddAssessment = (assessmentType) => {
        let type;
        if (currentView.includes('Midterm')) {
            type = assessmentType === 'Quiz' ? 'quiz' : 'activity';
        } else if (currentView.includes('Finals')) {
            type = assessmentType === 'Quiz' ? 'quiz' : 'activity';
        }
        
        if (type === 'quiz') {
            setQuizCols(prevCols => {
                // Use timestamp for unique ID to avoid conflicts if user deletes/adds
                const newId = `q${Date.now()}`;
                const newIndex = prevCols.length + 1 + removedQuizCols.length; // Approximate number
                return [...prevCols, { id: newId, label: `Q${newIndex}`, max: 20 }];
            });
        } else if (type === 'activity') {
            setActCols(prevCols => {
                const newId = `act${Date.now()}`;
                const newIndex = prevCols.length + 1 + removedActCols.length; // Approximate number
                return [...prevCols, { id: newId, label: `ACT ${newIndex}`, max: 50 }]; 
            });
        }
    };
    
    // ... (handleExport function remains unchanged as it relies on the state being correct)
    const handleExport = () => {
        let csvContent = '';
        let fileName = '';
        const studentsToExport = searchTerm ? filteredStudents : students; 
        const BOM = "\ufeff"; 

        if (currentView === 'Gradesheet') {
            // ... Gradesheet export logic (unchanged)
            fileName = 'Summary_Gradesheet.csv';
            csvContent += "Student ID,Student Name,Midterm,40%,Final,60%,FINAL GRADE,EQVT GRADE,REMARKS\n";
            studentsToExport.forEach(student => {
                const scores = studentScores[student.id] || {};
                // Uses the imported calculateTermGrade
                const midtermPercentage = calculateTermGrade(scores, true, quizCols, actCols, recMax, examMax); 
                const finalsPercentage = calculateTermGrade(scores, false, quizCols, actCols, recMax, examMax);
                const mid40 = (midtermPercentage * 0.40);
                const fin60 = (finalsPercentage * 0.60);
                const finalGrade = (mid40 + fin60).toFixed(2);
                
                let eqvt = '5.00';
                let remarks = 'FAILED';
                if (finalGrade >= 98) eqvt = '1.00';
                else if (finalGrade >= 96) eqvt = '1.25';
                else if (finalGrade >= 93) eqvt = '1.50';
                else if (finalGrade >= 75) eqvt = '2.00'; 
                if (finalGrade >= 75) remarks = 'PASSED';
                
                csvContent += `${student.id},"${student.name}",${midtermPercentage.toFixed(2)},${mid40.toFixed(2)},${finalsPercentage.toFixed(2)},${fin60.toFixed(2)},${finalGrade},${eqvt},"${remarks}"\n`;
            });

        } else if (currentView === 'Attendance') {
            // ... Attendance export logic (unchanged)
            fileName = `${attendanceTerm.replace(/\s/g, '_')}_Record.csv`;
            const dates = attendanceTerm === 'Midterm Attendance' ? MIDTERM_DATES : FINALS_DATES;
            
            csvContent += "Student ID,Student Name," + dates.join(',') + ",Total Absences,Status\n";

            studentsToExport.forEach(student => {
                let absences = 0;
                const attendanceRow = dates.map((date) => {
                    const key = `${student.id}-${date}`;
                    const status = localAttendanceData[key] || 'P'; 
                    if (status === 'A') absences++;
                    return status;
                }).join(',');

                const status = absences >= 3 ? 'Dropped' : 'Active';
                
                csvContent += `${student.id},"${student.name}",${attendanceRow},${absences},"${status}"\n`;
            });
            
        } else { // Midterm/Finals Records
            // ... Records export logic (unchanged)
            const isMidterm = currentView.includes('Midterm');
            fileName = `${isMidterm ? 'Midterm' : 'Finals'}_Records.csv`;
            
            const dynamicActCols = isMidterm ? actCols : actCols.map(c => ({...c, id: c.id.replace('act', 'lab'), label: c.label.replace('ACT', 'LAB')}));
            const recCol = { id: 'r1', label: 'R1', max: recMax };
            const examCol = { id: 'exam', label: 'Major Exam', max: examMax };
            const gradeCols = quizCols.concat(dynamicActCols).concat([recCol]).concat([examCol]);
            
            const assessmentIds = gradeCols.map(c => {
                if (c.id.startsWith('act') || c.id.startsWith('lab')) return c.id;
                if (c.id === 'r1') return isMidterm ? 'r1_mid' : 'r1_fin';
                if (c.id === 'exam') return isMidterm ? 'exam_mid' : 'exam_fin';
                return c.id; 
            });
            
            const assessmentLabels = gradeCols.map(c => c.label + (c.id === 'exam' ? ' (Exam)' : ''));
            
            csvContent += `Student ID,Student Name,${isMidterm ? 'Midterm' : 'Finals'} Percentage,${assessmentLabels.join(',')}\n`;

            studentsToExport.forEach(student => {
                const scores = studentScores[student.id] || {};
                // Uses the imported calculateTermGrade
                const termPercentage = calculateTermGrade(scores, isMidterm, quizCols, actCols, recMax, examMax).toFixed(2);
                
                const scoreRow = assessmentIds.map(id => scores[id] || 0).join(',');
                
                csvContent += `${student.id},"${student.name}",${termPercentage},${scoreRow}\n`;
            });
        }

        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' }); 
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    // --- RENDERERS ---
    // ... (renderAttendanceTable remains unchanged)
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
                    {filteredStudents.length === 0 ? (
                        <tr><td colSpan={dates.length + 5} style={{padding: '2rem', textAlign:'center'}}>No students found matching "{searchTerm}".</td></tr>
                    ) : (
                        filteredStudents.map((student, index) => {
                            let absences = 0;
                            const studentAttendanceStatuses = dates.map((date, i) => {
                                const key = `${student.id}-${date}`;
                                const mockStatus = localAttendanceData[key] || 'P'; // Changed from Math.random() to always default to 'P' on first load
                                if (mockStatus === 'A') absences++;
                                return mockStatus;
                            });

                            const status = absences >= 3 ? 'Dropped' : 'Active';
                            const statusClass = status === 'Dropped' ? 'cell-failed' : 'cell-passed';

                            return (
                                <tr key={student.id}>
                                    <td className="sticky-col col-no center-text">{index + 1}</td>
                                    <td className="sticky-col col-id center-text">{student.id}</td>
                                    <td className="sticky-col col-name" style={{fontWeight:'600', paddingLeft:'8px'}}>{student.name}</td>
                                    
                                    {/* Render Attendance Cells */}
                                    {studentAttendanceStatuses.map((status, i) => (
                                        <AttendanceCell 
                                            key={i} 
                                            status={status} 
                                            onChange={(newStatus) => handleAttendanceCellChange(student.id, i, newStatus)} 
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

    // --- REMOVED: renderGradesheetTable function was deleted as it is now in Gradesheet.jsx ---
    
    // ... (renderRecordsTable remains unchanged)
    const renderRecordsTable = () => {
        const isMidterm = currentView.includes('Midterm');
        const examLabel = isMidterm ? 'Mid Exam' : 'Final Exam';
        
        const dynamicActCols = isMidterm ? actCols : actCols.map(c => ({...c, label: c.label.replace('ACT', 'LAB')}));
        
        const totalCols = 6 + quizCols.length + actCols.length;

        return (
            <table className="mp-table">
                <thead>
                    <tr>
                        <th rowSpan="3" className="sticky-col col-no">No.</th>
                        <th rowSpan="3" className="sticky-col col-id">Student ID</th>
                        <th rowSpan="3" className="sticky-col col-name">Student Name</th>
                        <th className="sticky-col col-grade header-category-green">CATEGORY</th>
                        
                        <th colSpan={quizCols.length} className="header-category-orange">Quiz (15%)</th>
                        <th colSpan={dynamicActCols.length} className="header-category-orange">{isMidterm ? 'Activity (35%)' : 'Assignment (25%)'}</th>
                        <th colSpan={REC_COLS.length} className="header-category-orange">{isMidterm ? 'Recitation (10%)' : 'Recitation (20%)'}</th>
                        <th colSpan={EXAM_COLS.length} className="header-category-orange">Exam (40%)</th>
                    </tr>

                    <tr>
                        <th className="sticky-col col-grade header-midterm-green">
                            {isMidterm ? 'Midterm' : 'Finals'}<br/>Percentage
                        </th>
                        {quizCols.map(c => <th key={c.id}>{c.label}</th>)}
                        {dynamicActCols.map(c => <th key={c.id}>{c.label}</th>)}
                        {REC_COLS.map(c => <th key={c.id}>{c.label}</th>)}
                        <th>{examLabel}</th>
                    </tr>

                    {/* ROW FOR EDITABLE MAX SCORES */}
                    <tr>
                        <th className="sticky-col col-grade bg-green-soft">100%</th>
                        {/* Editable Quiz Max Scores */}
                        {quizCols.map(c => (
                            <th key={c.id}>
                                <MaxScoreInput 
                                    value={c.max} 
                                    type="quiz" 
                                    id={c.id} 
                                    onChange={handleMaxScoreChange} 
                                />
                            </th>
                        ))} 
                        {/* Editable Activity/Lab Max Scores */}
                        {actCols.map(c => (
                            <th key={c.id}>
                                <MaxScoreInput 
                                    value={c.max} 
                                    type="act" 
                                    id={c.id} 
                                    onChange={handleMaxScoreChange} 
                                />
                            </th>
                        ))} 
                        {/* Editable Recitation Max Score */}
                        {REC_COLS.map(c => (
                            <th key={c.id}>
                                <MaxScoreInput 
                                    value={recMax} 
                                    type="rec" 
                                    id={c.id}
                                    onChange={handleMaxScoreChange} 
                                />
                            </th>
                        ))}
                        {/* Editable Exam Max Score */}
                        {EXAM_COLS.map(c => (
                            <th key={c.id}>
                                <MaxScoreInput 
                                    value={examMax} 
                                    type="exam" 
                                    id={c.id}
                                    onChange={handleMaxScoreChange} 
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                
                <tbody>
                    {filteredStudents.length === 0 ? (
                        <tr><td colSpan={totalCols} style={{padding: '2rem', textAlign:'center'}}>No students found matching "{searchTerm}".</td></tr>
                    ) : (
                        filteredStudents.map((student, index) => {
                            const scores = studentScores[student.id] || {};
                            const termPercentage = calculateTermGrade(scores, isMidterm, quizCols, actCols, recMax, examMax).toFixed(2);
                            
                            return (
                                <tr key={student.id}>
                                    <td className="sticky-col col-no center-text">{index + 1}</td>
                                    <td className="sticky-col col-id center-text">{student.id}</td>
                                    <td className="sticky-col col-name" style={{fontWeight:'600', paddingLeft:'8px'}}>{student.name}</td>
                                    <td className="sticky-col col-grade bg-green-soft">{termPercentage}</td>

                                    {/* Quiz Scores (Shared IDs) */}
                                    {quizCols.map(c => (
                                        <td key={c.id}>
                                            <input 
                                                type="number" 
                                                className="mp-table-input" 
                                                value={scores[c.id] || ''} 
                                                onChange={(e) => handleScoreChange(student.id, c.id, e.target.value)}
                                                max={c.max} 
                                                min="0"
                                            />
                                        </td>
                                    ))}

                                    {/* Activity/Lab Scores (Dynamic IDs) */}
                                    {actCols.map(c => {
                                        const assessmentId = isMidterm ? c.id : c.id.replace('act', 'lab');
                                        
                                        return (
                                            <td key={c.id}>
                                                <input 
                                                    type="number" 
                                                    className="mp-table-input" 
                                                    value={scores[assessmentId] || ''} 
                                                    onChange={(e) => handleScoreChange(student.id, assessmentId, e.target.value)}
                                                    max={c.max} 
                                                    min="0"
                                                />
                                            </td>
                                        );
                                    })}

                                    {/* Recitation Score (Dynamic IDs) */}
                                    {REC_COLS.map(c => {
                                        const assessmentId = isMidterm ? 'r1_mid' : 'r1_fin';
                                        return (
                                            <td key={c.id}>
                                                <input 
                                                    type="number" 
                                                    className="mp-table-input" 
                                                    value={scores[assessmentId] || ''} 
                                                    onChange={(e) => handleScoreChange(student.id, assessmentId, e.target.value)}
                                                    max={recMax} 
                                                    min="0"
                                                />
                                            </td>
                                        );
                                    })}

                                    {/* Exam Score (Dynamic IDs) */}
                                    {EXAM_COLS.map(c => {
                                        const assessmentId = isMidterm ? 'exam_mid' : 'exam_fin';
                                        return (
                                            <td key={c.id}>
                                                <input 
                                                    type="number" 
                                                    className="mp-table-input" 
                                                    value={scores[assessmentId] || ''} 
                                                    onChange={(e) => handleScoreChange(student.id, assessmentId, e.target.value)}
                                                    max={examMax} 
                                                    min="0"
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        );
    };

    const renderContent = () => {
        // --- UPDATED: Use the imported GradesheetView component ---
        if (currentView === 'Gradesheet') {
            return (
                <GradesheetView
                    students={filteredStudents}
                    studentScores={studentScores}
                    quizCols={quizCols}
                    actCols={actCols}
                    recMax={recMax}
                    examMax={examMax}
                />
            );
        }
        if (currentView === 'Attendance') return renderAttendanceTable();
        return renderRecordsTable();
    };

    // ... (renderSideCards)
    const renderSideCards = () => {
        const totalQuizMax = quizCols.reduce((sum, c) => sum + c.max, 0); 
        const totalActLabMax = actCols.reduce((sum, c) => sum + c.max, 0); 
        const totalRecMax = recMax; 
        const totalExamMax = examMax;

        const isGradesheet = currentView === 'Gradesheet';
        const isFinals = currentView.includes('Finals');

        if (currentView === 'Attendance') return null;

        if (isGradesheet) {
            // --- UPDATED: Use the imported GradesheetSideCardsExport component ---
            return <GradesheetSideCardsExport />;
        }

        if (isFinals) {
            return (
                <div className="mp-percentage-card">
                    <div className="mp-pc-header">FINALS</div>
                    <table className="mp-pc-table">
                        <thead><tr><th>Item</th><th>Percentage</th><th>Max Score</th></tr></thead>
                        <tbody>
                            <tr><td>Major Exam</td><td>40</td><td>{totalExamMax}</td></tr>
                            <tr><td>Quiz</td><td>15</td><td>{totalQuizMax}</td></tr>
                            <tr><td>Lab/Assignment</td><td>25</td><td>{totalActLabMax}</td></tr>
                            <tr><td>Recitation</td><td>20</td><td>{totalRecMax}</td></tr>
                            <tr className="mp-pc-total"><td>TOTAL</td><td>100</td><td></td></tr>
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="mp-percentage-card">
                <div className="mp-pc-header">MIDTERM</div>
                <table className="mp-pc-table">
                    <thead><tr><th>Item</th><th>Percentage</th><th>Max Score</th></tr></thead>
                    <tbody>
                        <tr><td>Major Exam</td><td>40</td><td>{totalExamMax}</td></tr>
                        <tr><td>Quiz</td><td>15</td><td>{totalQuizMax}</td></tr>
                        <tr><td>Activity</td><td>35</td><td>{totalActLabMax}</td></tr>
                        <tr><td>Recitation</td><td>10</td><td>{totalRecMax}</td></tr>
                        <tr className="mp-pc-total"><td>TOTAL</td><td>100</td><td></td></tr>
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="mp-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="dashboard" onWidthChange={setSidebarWidth} />

            <main className="mp-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* HEADER (UPDATED mp-header-center) */}
                <div className="mp-header-top">
                    
                    {/* MODIFIED: mp-header-left now contains the back button next to the title */}
                    <div className="mp-header-left">
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}> {/* NEW FLEX WRAPPER */}
                            {/* BACK BUTTON (ICON ONLY) */}
                            <button 
                                className="mp-back-btn" 
                                onClick={() => onPageChange('view-studs')}
                                title="Go back to Student Records"
                            >
                                <ArrowLeft size={20} /> {/* ICON ONLY */}
                            </button>
                            
                            {/* TITLE WRAPPER */}
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <h1 className="mp-top-title">
                                    {currentView === 'Gradesheet' ? 'SUMMARY GRADESHEET' : 
                                     currentView === 'Attendance' ? 'ATTENDANCE RECORD' :
                                     currentView.toUpperCase()}
                                </h1>
                                <p className="mp-top-subtitle">{sectionData?.subtitle || 'BSIT - 3D • Introduction to Programming'}</p>
                            </div>
                        </div>
                    </div>

                    {/* MODIFIED: mp-header-center now only contains the Search bar */}
                    <div className="mp-header-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* EXISTING SEARCH WRAPPER */}
                            <div className="mp-search-wrapper">
                                <Search className="mp-search-icon" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search student..." 
                                    className="mp-search-input" 
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
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
                        
                    </div>
                </div>

                {/* TOOLBAR */}
                <div className="mp-toolbar">
                    <div className="mp-toolbar-left">
                        
                        {/* 1. Show Add Assessment for Grade Views */}
                        {currentView !== 'Gradesheet' && currentView !== 'Attendance' && (
                            <>
                                <button 
                                    className="btn-add-assessment" 
                                    onClick={() => handleAddAssessment('Quiz')}
                                    title="Add New Quiz Column"
                                >
                                    <Plus size={18} /> Add Quiz
                                </button>
                                <button 
                                    className="btn-add-assessment" 
                                    onClick={() => handleAddAssessment('Activity')}
                                    title={`Add New ${currentView.includes('Midterm') ? 'Activity' : 'Lab'} Column`}
                                    style={{marginLeft: '8px'}}
                                >
                                    <Plus size={18} /> Add {currentView.includes('Midterm') ? 'Activity' : 'Lab'}
                                </button>

                                {/* --- REMOVE BUTTON WITH DROPDOWN --- */}
                                <div style={{position: 'relative', display: 'inline-block', marginLeft: '8px'}}>
                                    <button 
                                        className="btn-remove-assessment" 
                                        onClick={toggleRemoveMenu} // Use toggle handler
                                        title="Remove Assessment Column"
                                    >
                                        <Trash size={18} /> Remove
                                    </button>

                                    {/* DROPDOWN MENU */}
                                    {isRemoveMenuOpen && (
                                        <div className="mp-remove-dropdown">
                                            <div className="mp-remove-header">Select Column to Remove</div>
                                            
                                            {/* QUIZ SECTION */}
                                            {quizCols.length > 0 && (
                                                <>
                                                    <div className="mp-remove-category">Quizzes</div>
                                                    {quizCols.map(col => (
                                                        <button 
                                                            key={col.id} 
                                                            className="mp-remove-item"
                                                            onClick={() => handleRemoveColumn('quiz', col.id, col.label)}
                                                        >
                                                            Remove {col.label}
                                                        </button>
                                                    ))}
                                                </>
                                            )}

                                            {/* ACT SECTION */}
                                            {actCols.length > 0 && (
                                                <>
                                                    <div className="mp-remove-category">{currentView.includes('Midterm') ? 'Activities' : 'Labs'}</div>
                                                    {actCols.map(col => {
                                                        const displayLabel = currentView.includes('Finals') 
                                                            ? col.label.replace('ACT', 'LAB') 
                                                            : col.label;
                                                        
                                                        return (
                                                            <button 
                                                                key={col.id} 
                                                                className="mp-remove-item"
                                                                onClick={() => handleRemoveColumn('act', col.id, displayLabel)}
                                                            >
                                                                Remove {displayLabel}
                                                            </button>
                                                        );
                                                    })}
                                                </>
                                            )}

                                            {quizCols.length === 0 && actCols.length === 0 && (
                                                <div style={{padding: '10px', fontSize: '12px', color: '#666'}}>No columns to remove.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {/* --- NEW RESTORE BUTTON WITH DROPDOWN --- */}
                                <div style={{position: 'relative', display: 'inline-block', marginLeft: '8px'}}>
                                    <button 
                                        className="btn-restore-assessment" 
                                        onClick={toggleRestoreMenu} // Use toggle handler
                                        title="Restore Removed Column"
                                    >
                                        <RotateCcw size={18} /> Restore
                                    </button>

                                    {/* DROPDOWN MENU */}
                                    {isRestoreMenuOpen && (
                                        <div className="mp-restore-dropdown">
                                            <div className="mp-restore-header">Select Column to Restore</div>
                                            
                                            {/* QUIZ SECTION */}
                                            {removedQuizCols.length > 0 && (
                                                <>
                                                    <div className="mp-restore-category">Quizzes</div>
                                                    {removedQuizCols.map(col => (
                                                        <button 
                                                            key={col.id} 
                                                            className="mp-restore-item"
                                                            onClick={() => handleRestoreColumn('quiz', col.id)}
                                                        >
                                                            Restore {col.label}
                                                        </button>
                                                    ))}
                                                </>
                                            )}

                                            {/* ACT/LAB SECTION */}
                                            {removedActCols.length > 0 && (
                                                <>
                                                    <div className="mp-restore-category">{currentView.includes('Midterm') ? 'Activities' : 'Labs'}</div>
                                                    {removedActCols.map(col => {
                                                        const displayLabel = currentView.includes('Finals') 
                                                            ? col.label.replace('ACT', 'LAB') 
                                                            : col.label;
                                                        
                                                        return (
                                                            <button 
                                                                key={col.id} 
                                                                className="mp-restore-item"
                                                                onClick={() => handleRestoreColumn('act', col.id)}
                                                            >
                                                                Restore {displayLabel}
                                                            </button>
                                                        );
                                                    })}
                                                </>
                                            )}

                                            {removedQuizCols.length === 0 && removedActCols.length === 0 && (
                                                <div style={{padding: '10px', fontSize: '12px', color: '#666'}}>No columns available for restoration.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
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
                            {/* LINKED DOWNLOAD BUTTON TO handleExport */}
                            <button className="btn-utility" onClick={handleExport}><Download size={14}/> Download</button>
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
            {/* Keeping ActivityModal, though we are currently using direct buttons */}
            <ActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title={currentView} />
            
            <style>{`
                /* --- Back Button Design (Updated for Icon-Only in Header) --- */
                .mp-back-btn {
                    /* Icon-only, minimal look */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px; /* Fixed width */
                    height: 36px; /* Fixed height (making it square) */
                    padding: 0; /* Remove padding */
                    border-radius: 50%; /* Circular shape */
                    cursor: pointer;
                    transition: all 0.2s ease;
                    
                    /* Design: Simple gray/white */
                    background-color: transparent;
                    color: #4B5563; /* Gray text/icon */
                    border: none;
                }

                .mp-back-btn:hover {
                    background-color: #F3F4F6; /* Light gray hover background */
                    color: #1F2937; /* Darker icon color on hover */
                    box-shadow: none; 
                }

                .mp-back-btn:active {
                    background-color: #E5E7EB;
                }

                .mp-back-btn svg {
                    stroke-width: 2.5;
                    width: 20px; 
                    height: 20px;
                }
            `}</style>
        </div>
    );  
};

export default MultiPageGS;