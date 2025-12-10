// src/components/assets/Dashboard/MultiPageGS.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './MultiPageGS.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import { ActivityModal } from './ModalComponents';
// ---------------------------------------------
// UPDATED IMPORT: Import all necessary components and helpers from Gradesheet.jsx
import GradesheetView, { GradesheetSideCardsExport, calculateTermGrade, RecordsTableComponent } from './Gradesheet';
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
// NEW ICON: Calendar
const Calendar = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);


// --- INITIAL DATA STRUCTURES (Used for initial load only) ---
// ADD 'date' FIELD TO INITIAL COLUMNS FOR CONSISTENCY
const INITIAL_QUIZ_COLS = [
    { id: 'q1', label: 'Q1', max: 20, date: '2025-10-10' },
    { id: 'q2', label: 'Q2', max: 20, date: '2025-10-17' },
    { id: 'q3', label: 'Q3', max: 20, date: '2025-10-24' },
    { id: 'q4', label: 'Q4', max: 25, date: '2025-10-31' }, 
];
const INITIAL_ACT_COLS = [
    { id: 'act1', label: 'ACT 1', max: 30, date: '2025-10-01' },
    { id: 'act2', label: 'ACT 2', max: 30, date: '2025-10-08' },
    { id: 'act3', label: 'ACT 3', max: 50, date: '2025-10-15' },
    { id: 'act4', label: 'ACT 4', max: 50, date: '2025-10-22' }, 
];
// REMOVED REC_COLS and EXAM_COLS constants (now in Gradesheet.jsx)

// --- MOCK DATES FOR ATTENDANCE ---
const MIDTERM_DATES = ['Sept 4', 'Sept 11', 'Sept 18', 'Sept 25', 'Oct 2', 'Oct 9'];
const FINALS_DATES = ['Nov 6', 'Nov 13', 'Nov 20', 'Nov 27', 'Dec 4', 'Dec 11'];

// --- PERSISTENCE KEYS (UPDATED FOR TERM SEPARATION) ---
const GRADES_STORAGE_KEY = 'progressTracker_studentScores_v1';
const ATTENDANCE_STORAGE_KEY = 'progressTracker_attendanceData_v1';

// New Term-Specific Keys
const MID_QUIZ_COLS_KEY = 'progressTracker_midQuizCols_v1';
const FIN_QUIZ_COLS_KEY = 'progressTracker_finQuizCols_v1';
const MID_ACT_COLS_KEY = 'progressTracker_midActCols_v1';
const FIN_ACT_COLS_KEY = 'progressTracker_finActCols_v1';

const MID_REMOVED_QUIZ_COLS_KEY = 'progressTracker_midRemovedQuizCols_v1'; 
const FIN_REMOVED_QUIZ_COLS_KEY = 'progressTracker_finRemovedQuizCols_v1'; 
const MID_REMOVED_ACT_COLS_KEY = 'progressTracker_midRemovedActCols_v1'; 
const FIN_REMOVED_ACT_COLS_KEY = 'progressTracker_finRemovedActCols_v1'; 

const REC_MAX_KEY = 'progressTracker_recMax_v1';
const EXAM_MAX_KEY = 'progressTracker_examMax_v1';

// --- HELPER: Persistence Loaders for Columns ---
const initializeCols = (key, initialData) => {
    const savedCols = localStorage.getItem(key);
    if (savedCols) {
        try {
            // Ensure loaded columns have a 'date' property, default to empty string if not present
            const parsedCols = JSON.parse(savedCols);
            return parsedCols.map(col => ({
                ...col,
                date: col.date || '', // Add date property if missing
            }));
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

// --- HELPER: Persistence Loader for Attendance ---
const initializeAttendance = () => {
    const savedAttendanceJSON = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (savedAttendanceJSON) {
        try {
            const data = JSON.parse(savedAttendanceJSON);
            return data;
        } catch (e) {
            console.error("Could not parse saved attendance data:", e);
        }
    }
    return {};
};


// --- HELPER: Initialize Score State (UPDATED to handle term-specific keys) ---
const initializeScores = (students, midQuizCols, finQuizCols, midActCols, finActCols) => {
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
    
    // Define all dynamic assessment keys for both terms with term suffixes
    const midQuizKeys = midQuizCols.map(c => c.id + '_mid');
    const finQuizKeys = finQuizCols.map(c => c.id + '_fin');
    const midActKeys = midActCols.map(c => c.id + '_mid');
    const finActKeys = finActCols.map(c => c.id + '_fin');
    
    const allDynamicKeys = [...midQuizKeys, ...finQuizKeys, ...midActKeys, ...finActKeys];


    students.forEach(student => {
        const studentData = savedScores[student.id] || {};

        // Initialize dynamic scores with term-specific keys
        allDynamicKeys.forEach(key => { if (studentData[key] === undefined) studentData[key] = ''; });

        // Initialize static scores (already term-specific)
        if (studentData['r1_mid'] === undefined) studentData['r1_mid'] = '';
        if (studentData['exam_mid'] === undefined) studentData['exam_mid'] = '';
        if (studentData['r1_fin'] === undefined) studentData['r1_fin'] = '';
        if (studentData['exam_fin'] === undefined) studentData['exam_fin'] = '';

        initialScores[student.id] = studentData;
    });
    return initialScores;
};

// --- AttendanceCell component remains unchanged ---
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

// REMOVED MaxScoreInput (now imported via RecordsTableComponent)


const MultiPageGS = ({ onLogout, onPageChange, viewType = 'Midterm Records', title = 'Midterm Grade', students = [], sectionData }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState(viewType);
    const [attendanceTerm, setAttendanceTerm] = useState('Midterm Attendance');
    
    const [searchTerm, setSearchTerm] = useState('');

    // UPDATED: Separate states for Midterm and Finals columns
    const [midQuizCols, setMidQuizCols] = useState(() => initializeCols(MID_QUIZ_COLS_KEY, INITIAL_QUIZ_COLS));
    const [finQuizCols, setFinQuizCols] = useState(() => initializeCols(FIN_QUIZ_COLS_KEY, INITIAL_QUIZ_COLS));

    const [midActCols, setMidActCols] = useState(() => initializeCols(MID_ACT_COLS_KEY, INITIAL_ACT_COLS));
    const [finActCols, setFinActCols] = useState(() => initializeCols(FIN_ACT_COLS_KEY, INITIAL_ACT_COLS));

    // UPDATED: Separate states for removed columns
    const [removedMidQuizCols, setRemovedMidQuizCols] = useState(() => initializeCols(MID_REMOVED_QUIZ_COLS_KEY, []));
    const [removedFinQuizCols, setRemovedFinQuizCols] = useState(() => initializeCols(FIN_REMOVED_QUIZ_COLS_KEY, []));

    const [removedMidActCols, setRemovedMidActCols] = useState(() => initializeCols(MID_REMOVED_ACT_COLS_KEY, []));
    const [removedFinActCols, setRemovedFinActCols] = useState(() => initializeCols(FIN_REMOVED_ACT_COLS_KEY, []));
    
    const [isRemoveMenuOpen, setIsRemoveMenuOpen] = useState(false);
    const [isRestoreMenuOpen, setIsRestoreMenuOpen] = useState(false); // NEW TOGGLE

    const [recMax, setRecMax] = useState(() => initializeMaxScore(REC_MAX_KEY, 100));
    const [examMax, setExamMax] = useState(() => initializeMaxScore(EXAM_MAX_KEY, 60));

    // STATE: Holds the editable scores
    const [studentScores, setStudentScores] = useState(() => initializeScores(students, quizCols, actCols));
    // STATE: Placeholder for Attendance Data
    const [localAttendanceData, setLocalAttendanceData] = useState(() => initializeAttendance());
    
    // --- PERSISTENCE EFFECTS (UPDATED) ---
    useEffect(() => {
        try {
            localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(studentScores));
        } catch (e) {
            console.error("Could not save student scores to localStorage:", e);
        }
    }, [studentScores]);

    useEffect(() => { try { localStorage.setItem(MID_QUIZ_COLS_KEY, JSON.stringify(midQuizCols)); } catch (e) { console.error("Could not save mid quiz columns to localStorage:", e); } }, [midQuizCols]);
    useEffect(() => { try { localStorage.setItem(FIN_QUIZ_COLS_KEY, JSON.stringify(finQuizCols)); } catch (e) { console.error("Could not save fin quiz columns to localStorage:", e); } }, [finQuizCols]);
    
    useEffect(() => { try { localStorage.setItem(MID_ACT_COLS_KEY, JSON.stringify(midActCols)); } catch (e) { console.error("Could not save mid activity columns to localStorage:", e); } }, [midActCols]);
    useEffect(() => { try { localStorage.setItem(FIN_ACT_COLS_KEY, JSON.stringify(finActCols)); } catch (e) { console.error("Could not save fin activity columns to localStorage:", e); } }, [finActCols]);
    
    useEffect(() => { try { localStorage.setItem(MID_REMOVED_QUIZ_COLS_KEY, JSON.stringify(removedMidQuizCols)); } catch (e) { console.error("Could not save removed mid quiz columns to localStorage:", e); } }, [removedMidQuizCols]);
    useEffect(() => { try { localStorage.setItem(FIN_REMOVED_QUIZ_COLS_KEY, JSON.stringify(removedFinQuizCols)); } catch (e) { console.error("Could not save removed fin quiz columns to localStorage:", e); } }, [removedFinQuizCols]);
    
    useEffect(() => { try { localStorage.setItem(MID_REMOVED_ACT_COLS_KEY, JSON.stringify(removedMidActCols)); } catch (e) { console.error("Could not save removed mid activity columns to localStorage:", e); } }, [removedMidActCols]);
    useEffect(() => { try { localStorage.setItem(FIN_REMOVED_ACT_COLS_KEY, JSON.stringify(removedFinActCols)); } catch (e) { console.error("Could not save removed fin activity columns to localStorage:", e); } }, [removedFinActCols]);

    useEffect(() => { try { localStorage.setItem(REC_MAX_KEY, String(recMax)); } catch (e) { console.error("Could not save recMax to localStorage:", e); } }, [recMax]);
    useEffect(() => { try { localStorage.setItem(EXAM_MAX_KEY, String(examMax)); } catch (e) { console.error("Could not save examMax to localStorage:", e); } }, [examMax]);

    // --- EFFECT: To persist attendance data whenever it changes ---
    useEffect(() => {
        try {
            localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(localAttendanceData));
        } catch (e) {
            console.error("Could not save attendance data to localStorage:", e);
        }
    }, [localAttendanceData]);

    // UPDATED: Recalculate studentScores initialization when ANY column state changes
    useEffect(() => {
        setStudentScores(prevScores => {
            return students.reduce((acc, student) => {
                const studentData = prevScores[student.id] || {};
                
                // Use the new initializeScores signature
                const mergedData = {
                    ...initializeScores([student], midQuizCols, finQuizCols, midActCols, finActCols)[student.id],
                    ...studentData
                };
                
                acc[student.id] = mergedData;
                return acc;
            }, {});
        });
    }, [students, midQuizCols, finQuizCols, midActCols, finActCols]); // Added new dependencies

    useEffect(() => { if (viewType) setCurrentView(viewType); }, [viewType]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleScoreChange = (studentId, assessmentId, value) => {
        const parsedValue = value === '' ? '' : parseFloat(value);
        
        const numericValue = isNaN(parsedValue) || parsedValue < 0 ? '' : parsedValue;

        setStudentScores(prevScores => ({
            ...prevScores,
            [studentId]: {
                ...prevScores[studentId],
                [assessmentId]: numericValue,
            },
        }));
    };
    
    // UPDATED: Determine which set of columns to update based on currentView
    const handleMaxScoreChange = (type, id, value) => {
        const parsedValue = value === '' ? 0 : parseFloat(value);
        const finalValue = Math.max(0, isNaN(parsedValue) ? 0 : parsedValue); 
        const isMidterm = currentView.includes('Midterm'); // NEW

        if (type === 'quiz') {
            const setCols = isMidterm ? setMidQuizCols : setFinQuizCols; // NEW
            setCols(prevCols => prevCols.map(col => 
                col.id === id ? { ...col, max: finalValue } : col
            ));
        } else if (type === 'act') {
            const setCols = isMidterm ? setMidActCols : setFinActCols; // NEW
            setCols(prevCols => prevCols.map(col => 
                col.id === id ? { ...col, max: finalValue } : col
            ));
        } else if (type === 'rec') {
            setRecMax(finalValue);
        } else if (type === 'exam') {
            setExamMax(finalValue);
        }
    };

    const handleAttendanceCellChange = (studentId, dateIndex, status) => {
        setLocalAttendanceData(prevData => {
            const currentTermDates = attendanceTerm === 'Midterm Attendance' ? MIDTERM_DATES : FINALS_DATES;
            const key = `${studentId}-${currentTermDates[dateIndex]}`;
            
            const newData = { ...prevData, [key]: status };
            return newData;
        });
    };

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        student.id.toLowerCase().includes(lowerCaseSearchTerm)
    );

    // --- TOGGLE HANDLERS (for dropdown menus) ---
    const toggleRemoveMenu = useCallback(() => {
        setIsRemoveMenuOpen(prev => !prev);
        if (!isRemoveMenuOpen) setIsRestoreMenuOpen(false); // Close restore menu when opening remove
    }, [isRemoveMenuOpen]);

    const toggleRestoreMenu = useCallback(() => {
        setIsRestoreMenuOpen(prev => !prev);
        if (!isRestoreMenuOpen) setIsRemoveMenuOpen(false); // Close remove menu when opening restore
    }, [isRestoreMenuOpen]);


    // --- Handle Remove Column (Moves to removed state) ---
    const handleRemoveColumn = (type, id, label) => {
        const isMidterm = currentView.includes('Midterm'); // NEW

        if (window.confirm(`Are you sure you want to remove ${label}? The scores in this column will be preserved for restoration.`)) {
            if (type === 'quiz') {
                const setCols = isMidterm ? setMidQuizCols : setFinQuizCols; // NEW
                const setRemovedCols = isMidterm ? setRemovedMidQuizCols : setRemovedFinQuizCols; // NEW
                
                setCols(prevCols => {
                    const colToRemove = prevCols.find(col => col.id === id);
                    if (colToRemove) {
                        setRemovedCols(prevRemoved => [...prevRemoved, colToRemove]);
                    }
                    return prevCols.filter(col => col.id !== id);
                });
            } else if (type === 'act') {
                const setCols = isMidterm ? setMidActCols : setFinActCols; // NEW
                const setRemovedCols = isMidterm ? setRemovedMidActCols : setRemovedFinActCols; // NEW

                setCols(prevCols => {
                    const colToRemove = prevCols.find(col => col.id === id);
                    if (colToRemove) {
                        setRemovedCols(prevRemoved => [...prevRemoved, colToRemove]);
                    }
                    return prevCols.filter(col => col.id !== id);
                });
            }
            setIsRemoveMenuOpen(false);
        }
    };

    // --- Handle Restore Column (Moves from removed state back to active state) ---
    const handleRestoreColumn = (type, id) => {
        const isMidterm = currentView.includes('Midterm'); // NEW

        if (type === 'quiz') {
            const setRemovedCols = isMidterm ? setRemovedMidQuizCols : setRemovedFinQuizCols; // NEW
            const setCols = isMidterm ? setMidQuizCols : setFinQuizCols; // NEW
            
            setRemovedCols(prevRemoved => {
                const colToRestore = prevRemoved.find(col => col.id === id);
                if (colToRestore) {
                    setCols(prevCols => [...prevCols, colToRestore].sort((a, b) => {
                        const numA = parseInt(a.label.match(/\d+/)?.[0] || Infinity);
                        const numB = parseInt(b.label.match(/\d+/)?.[0] || Infinity);
                        return numA - numB;
                    }));
                }
                return prevRemoved.filter(col => col.id !== id);
            });
        } else if (type === 'act') {
            const setRemovedCols = isMidterm ? setRemovedMidActCols : setRemovedFinActCols; // NEW
            const setCols = isMidterm ? setMidActCols : setFinActCols; // NEW
            
            setRemovedCols(prevRemoved => {
                const colToRestore = prevRemoved.find(col => col.id === id);
                if (colToRestore) {
                    setCols(prevCols => [...prevCols, colToRestore].sort((a, b) => {
                        const numA = parseInt(a.label.match(/\d+/)?.[0] || Infinity);
                        const numB = parseInt(b.label.match(/\d+/)?.[0] || Infinity);
                        return numA - numB;
                    }));
                }
                return prevRemoved.filter(col => col.id !== id);
            });
        }
        setIsRestoreMenuOpen(false);
    };

    // --- Add Column Handlers ---
    const handleAddAssessment = (assessmentType) => {
        let type;
        if (currentView.includes('Midterm') || currentView.includes('Finals')) {
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

        // Close and reset
        setIsAddMenuOpen(false);
        setNewAssessmentData({ type: 'Quiz', maxScore: '', date: '' });
    };
    
    // --- handleExport (Uses imported calculateTermGrade) ---
    const handleExport = () => {
        let csvContent = '';
        let fileName = '';
        const studentsToExport = searchTerm ? filteredStudents : students; 
        const BOM = "\ufeff"; 

        // Use the term-specific columns for Gradesheet calculation
        const midQuiz = midQuizCols;
        const midAct = midActCols;
        const finQuiz = finQuizCols;
        const finAct = finActCols;

        if (currentView === 'Gradesheet') {
            // ... Gradesheet export logic
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
            // ... Attendance export logic
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
            // ... Records export logic
            const isMidterm = currentView.includes('Midterm');
            fileName = `${isMidterm ? 'Midterm' : 'Finals'}_Records.csv`;
            
            // NEW: Select term-specific columns
            const currentQuizCols = isMidterm ? midQuizCols : finQuizCols; 
            const currentActCols = isMidterm ? midActCols : finActCols;

            // Renaming Labs for Finals display only (IDs remain generic here)
            const dynamicActCols = isMidterm ? currentActCols : currentActCols.map(c => ({...c, id: c.id, label: c.label.replace('ACT', 'LAB')}));
            
            const recCol = { id: 'r1', label: 'R1', max: recMax };
            const examCol = { id: 'exam', label: 'Major Exam', max: examMax };
            const gradeCols = currentQuizCols.concat(dynamicActCols).concat([recCol]).concat([examCol]);
            
            const assessmentIds = gradeCols.map(c => {
                // Construct term-specific keys for dynamic assessments
                if (c.id.startsWith('q') || c.id.startsWith('act')) {
                    return c.id + (isMidterm ? '_mid' : '_fin');
                }
                // Static IDs
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
                
                // Lookup scores using the term-specific keys
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
                        <th rowSpan="2" className="sticky-col col-no header-category-green">No.</th>
                        <th rowSpan="2" className="sticky-col col-id header-category-green">Student ID</th>
                        <th rowSpan="2" className="sticky-col col-name header-category-green">Student Name</th>
                        <th colSpan={dates.length} className="header-category-orange">Dates</th>
                        <th rowSpan="2" className="header-summary-green">Total Absences</th>
                        <th rowSpan="2" className="header-summary-green">Status</th>
                    </tr>
                    <tr>
                        {dates.map((date, i) => (
                            <th key={i} className="header-category-orange mp-date-header">{date}</th>
                        ))}
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
                                const mockStatus = localAttendanceData[key] || 'P';
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

    // --- REMOVED renderGradesheetTable and renderRecordsTable ---
    
    // --- UPDATED: renderContent ---
    const renderContent = () => {
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
        
        // --- NEW LOGIC: Use the imported RecordsTableComponent ---
        const isMidterm = currentView === 'Midterm Records';
        
        return (
            <RecordsTableComponent
                isMidterm={isMidterm}
                students={filteredStudents}
                studentScores={studentScores}
                quizCols={quizCols}
                actCols={actCols}
                recMax={recMax}
                examMax={examMax}
                handleMaxScoreChange={handleMaxScoreChange}
                handleScoreChange={handleScoreChange}
                searchTerm={searchTerm}
            />
        );
    };

    
    // UPDATED: Use term-specific columns for max score calculation
    const renderSideCards = () => {
        const isMidterm = currentView.includes('Midterm');
        const currentQuizCols = isMidterm ? midQuizCols : finQuizCols;
        const currentActCols = isMidterm ? midActCols : finActCols;

        const totalQuizMax = currentQuizCols.reduce((sum, c) => sum + c.max, 0); 
        const totalActLabMax = currentActCols.reduce((sum, c) => sum + c.max, 0); 
        
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
                
                {/* HEADER */}
                <div className="mp-header-top">
                    
                    <div className="mp-header-left">
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <button 
                                className="mp-back-btn" 
                                onClick={() => onPageChange('view-studs')}
                                title="Go back to Student Records"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            
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

                    <div className="mp-header-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

                <div className="mp-toolbar">
                    <div className="mp-toolbar-left">
                        
                        {/* 1. Show Add Assessment for Grade Views */}
                        {currentView !== 'Gradesheet' && currentView !== 'Attendance' && (
                            <>
                                {/* --- NEW ADD ASSESSMENT DROPDOWN --- */}
                                <div style={{position: 'relative', display: 'inline-block'}}>
                                    <button 
                                        className="btn-add-assessment" 
                                        onClick={toggleAddMenu}
                                        title="Add New Assessment Column"
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <Plus size={18} /> Add Assessment <ChevronDown size={12} style={{strokeWidth: '3'}} />
                                    </button>

                                    {/* ADD DROPDOWN MENU (MODIFIED) */}
                                    {isAddMenuOpen && (
                                        <div className="mp-add-dropdown">
                                            <div className="mp-add-header">Add New Assessment</div>
                                            <form onSubmit={handleAddAssessment}>
                                                <div className="mp-form-group">
                                                    <label htmlFor="assessmentType">Type:</label>
                                                    <select 
                                                        id="assessmentType"
                                                        value={newAssessmentData.type}
                                                        onChange={(e) => setNewAssessmentData({ ...newAssessmentData, type: e.target.value })}
                                                        className="mp-dropdown-input"
                                                    >
                                                        <option value="Quiz">Quiz</option>
                                                        <option value={currentView.includes('Midterm') ? 'Activity' : 'Lab'}>
                                                            {currentView.includes('Midterm') ? 'Activity' : 'Lab'}
                                                        </option>
                                                    </select>
                                                    {/* NEW: Dropdown Icon for visualization (next to the dropdown itself) */}
                                                    <ChevronDown className="mp-selector-chevron" style={{right: '18px', top: '34px', width: '12px', height: '12px', strokeWidth: '3'}} />
                                                </div>
                                                
                                                {/* NEW DATE INPUT FIELD */}
                                                <div className="mp-form-group">
                                                    <label htmlFor="assessmentDate">Date: <Calendar className="w-3 h-3 inline ml-1" style={{ width: '14px', height: '14px', marginBottom: '-2px'}}/></label>
                                                    <input
                                                        type="date"
                                                        id="assessmentDate"
                                                        value={newAssessmentData.date}
                                                        onChange={(e) => setNewAssessmentData({ ...newAssessmentData, date: e.target.value })}
                                                        required
                                                        className="mp-dropdown-input"
                                                    />
                                                </div>

                                                <div className="mp-form-group">
                                                    <label htmlFor="maxScore">Items:</label>
                                                    <input 
                                                        type="number" 
                                                        id="maxScore"
                                                        placeholder="Number of Items"
                                                        value={newAssessmentData.maxScore}
                                                        onChange={(e) => setNewAssessmentData({ ...newAssessmentData, maxScore: e.target.value })}
                                                        min="1"
                                                        required
                                                        className="mp-dropdown-input"
                                                    />
                                                </div>
                                                <button type="submit" className="btn-add-column-submit">
                                                    Add Column <Plus size={18} style={{marginLeft: '5px'}}/>
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>

                                {/* --- REMOVE BUTTON WITH DROPDOWN --- */}
                                <div style={{position: 'relative', display: 'inline-block', marginLeft: '8px'}}>
                                    <button 
                                        className="btn-remove-assessment" 
                                        onClick={toggleRemoveMenu}
                                        title="Remove Assessment Column"
                                    >
                                        <Trash size={18} /> Remove
                                    </button>

                                    {isRemoveMenuOpen && (
                                        <div className="mp-remove-dropdown">
                                            <div className="mp-remove-header">Select Column to Remove</div>
                                            
                                            {/* Show current term's quiz columns */}
                                            {(currentView.includes('Midterm') ? midQuizCols : finQuizCols).length > 0 && (
                                                <>
                                                    <div className="mp-remove-category">Quizzes</div>
                                                    {(currentView.includes('Midterm') ? midQuizCols : finQuizCols).map(col => (
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

                                            {/* Show current term's activity/lab columns */}
                                            {(currentView.includes('Midterm') ? midActCols : finActCols).length > 0 && (
                                                <>
                                                    <div className="mp-remove-category">{currentView.includes('Midterm') ? 'Activities' : 'Labs'}</div>
                                                    {(currentView.includes('Midterm') ? midActCols : finActCols).map(col => {
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

                                            {(currentView.includes('Midterm') ? midQuizCols : finQuizCols).length === 0 && 
                                             (currentView.includes('Midterm') ? midActCols : finActCols).length === 0 && (
                                                <div style={{padding: '10px', fontSize: '12px', color: '#666'}}>No columns to remove.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {/* --- NEW RESTORE BUTTON WITH DROPDOWN --- */}
                                <div style={{position: 'relative', display: 'inline-block', marginLeft: '8px'}}>
                                    <button 
                                        className="btn-restore-assessment" 
                                        onClick={toggleRestoreMenu}
                                        title="Restore Removed Column"
                                    >
                                        <RotateCcw size={18} /> Restore
                                    </button>

                                    {isRestoreMenuOpen && (
                                        <div className="mp-restore-dropdown">
                                            <div className="mp-restore-header">Select Column to Restore</div>
                                            
                                            {/* Show current term's removed quiz columns */}
                                            {(currentView.includes('Midterm') ? removedMidQuizCols : removedFinQuizCols).length > 0 && (
                                                <>
                                                    <div className="mp-restore-category">Quizzes</div>
                                                    {(currentView.includes('Midterm') ? removedMidQuizCols : removedFinQuizCols).map(col => (
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

                                            {/* Show current term's removed activity/lab columns */}
                                            {(currentView.includes('Midterm') ? removedMidActCols : removedFinActCols).length > 0 && (
                                                <>
                                                    <div className="mp-restore-category">{currentView.includes('Midterm') ? 'Activities' : 'Labs'}</div>
                                                    {(currentView.includes('Midterm') ? removedMidActCols : removedFinActCols).map(col => {
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

                                            {(currentView.includes('Midterm') ? removedMidQuizCols : removedFinQuizCols).length === 0 && 
                                             (currentView.includes('Midterm') ? removedMidActCols : removedFinActCols).length === 0 && (
                                                <div style={{padding: '10px', fontSize: '12px', color: '#666'}}>No columns available for restoration.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        
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
                            <button className="btn-utility" onClick={handleExport}><Download size={14}/> Download</button>
                        </div>
                        {renderSideCards()}
                    </div>
                </div>

                <div className="mp-content-wrapper">
                    {renderContent()}
                </div>

            </main>
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

                /* --- NEW: Add Assessment Dropdown Styles --- */
                .mp-add-dropdown {
                    position: absolute;
                    top: 100%; /* Position below the button */
                    left: 0;
                    z-index: 100;
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    min-width: 200px;
                    padding: 10px;
                    margin-top: 5px;
                }
                
                .mp-add-header {
                    font-weight: 600;
                    padding-bottom: 8px;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #eee;
                    font-size: 14px;
                    color: #374151;
                }

                .mp-form-group {
                    margin-bottom: 10px;
                    position: relative; /* Para sa calendar icon at dropdown chevron */
                }

                .mp-form-group label {
                    display: block;
                    font-size: 12px;
                    color: #6B7280;
                    margin-bottom: 4px;
                }

                .mp-dropdown-input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #D1D5DB;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 14px;
                    /* For date input: Hide default calendar icon on some browsers */
                    -webkit-appearance: none; 
                    -moz-appearance: textfield; /* Firefox default is fine */
                }
                
                /* For date input to reserve space for the calendar icon if needed */
                input[type="date"].mp-dropdown-input {
                    padding-right: 10px; 
                }

                .btn-add-column-submit {
                    width: 100%;
                    padding: 8px;
                    background-color: #1f2937; /* Darker blue/black for submit */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    margin-top: 5px;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .btn-add-column-submit:hover {
                    background-color: #374151;
                }
            `}</style>
        </div>
    );
};

export default MultiPageGS;