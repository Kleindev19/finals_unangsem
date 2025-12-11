// src/components/assets/Dashboard/MultiPageGS.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './MultiPageGS.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import { ActivityModal } from './ModalComponents';
// IMPORT THE AI FUNCTION from the root Apps.jsx
import { runAIAnalysis } from '../../../Apps'; 

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
// NEW ICON: Loader/Spinner
const Loader = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>);


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
const REC_COLS = [{ id: 'r1', label: 'R1' }]; 
const EXAM_COLS = [{ id: 'exam', label: 'Major Exam' }]; 

// --- MOCK DATES FOR ATTENDANCE ---
// IMPORTANT: These must match the formats expected by the AI
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

// --- NEW HELPER: Persistence Loader for Attendance ---
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

// --- HELPER: Dispatch Sync Event ---
const dispatchDataSync = () => {
    console.log("[DATA SYNC] Dispatching global CDM_DATA_SYNC event.");
    window.dispatchEvent(new Event('CDM_DATA_SYNC'));
};


// --- HELPER: Initialize Score State ---
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


// --- HELPER: Grade Calculation based on the user's formula ---
const calculateTermGrade = (scores, isMidterm, currentQuizCols, currentActCols, recMax, examMax) => {
    // Recalculate MAX points based on current dynamic columns
    const MAX_QUIZ = currentQuizCols.reduce((sum, c) => sum + c.max, 0); 
    const MAX_ACT_LAB = currentActCols.reduce((sum, c) => sum + c.max, 0); 
    
    // Use dynamic max values for REC and EXAM
    const MAX_REC = recMax; 
    const MAX_EXAM = examMax; 

    // Handle case where MAX is zero to prevent division by zero
    const getPercentage = (score, max, percentage) => 
        max > 0 ? (score / max) * percentage : 0;

    const sumScores = (ids) => ids.reduce((sum, id) => sum + (parseFloat(scores[id]) || 0), 0);

    // 1. QUIZ (15%)
    const quizScore = sumScores(currentQuizCols.map(c => c.id));
    const quizGrade = getPercentage(quizScore, MAX_QUIZ, 15);

    let otherGrade = 0;
    let examId, recId;

    if (isMidterm) {
        // MIDTERM: Activity (35%)
        const actIds = currentActCols.map(c => c.id);
        const actScore = sumScores(actIds);
        otherGrade += getPercentage(actScore, MAX_ACT_LAB, 35); // Activity 35%
        
        recId = 'r1_mid';
        examId = 'exam_mid';

        // Recitation 10%
        const recScore = parseFloat(scores[recId]) || 0;
        otherGrade += getPercentage(recScore, MAX_REC, 10);
        
    } else {
        // FINALS: Lab/Assignment (25%)
        const labIds = currentActCols.map(c => c.id.replace('act', 'lab'));
        const labScore = sumScores(labIds);
        otherGrade += getPercentage(labScore, MAX_ACT_LAB, 25); // Lab/Assignment 25%

        recId = 'r1_fin';
        examId = 'exam_fin';

        // Recitation 20%
        const recScore = parseFloat(scores[recId]) || 0;
        otherGrade += getPercentage(recScore, MAX_REC, 20);
    }

    // Exam 40%
    const examScore = parseFloat(scores[examId]) || 0;
    const examGrade = getPercentage(examScore, MAX_EXAM, 40);

    const termGrade = quizGrade + otherGrade + examGrade;
    return Math.min(100, Math.max(0, termGrade)); // Cap at 100%
};

// --- HELPER: Convert File to Base64 for AI ---
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the data:image/png;base64, prefix
        reader.onerror = (error) => reject(error);
    });
};


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


const MultiPageGS = ({ onLogout, onPageChange, viewType = 'Midterm Records', title = 'Midterm Grade', students = [], sectionData, onStudentDropped }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState(viewType);
    const [attendanceTerm, setAttendanceTerm] = useState('Midterm Attendance');
    const [searchTerm, setSearchTerm] = useState('');
    // NEW STATE: Loading state for AI upload processing
    const [isUploading, setIsUploading] = useState(false);


    // STATES FOR DYNAMIC COLUMNS
    const [quizCols, setQuizCols] = useState(() => initializeCols(QUIZ_COLS_KEY, INITIAL_QUIZ_COLS));
    const [actCols, setActCols] = useState(() => initializeCols(ACT_COLS_KEY, INITIAL_ACT_COLS));

    // NEW STATES FOR REMOVED COLUMNS (for restore functionality)
    const [removedQuizCols, setRemovedQuizCols] = useState(() => initializeCols(REMOVED_QUIZ_COLS_KEY, []));
    const [removedActCols, setRemovedActCols] = useState(() => initializeCols(REMOVED_ACT_COLS_KEY, []));

    // STATE: TOGGLES FOR DROPDOWNS
    const [isRemoveMenuOpen, setIsRemoveMenuOpen] = useState(false);
    const [isRestoreMenuOpen, setIsRestoreMenuOpen] = useState(false); // NEW TOGGLE
    
    // NEW STATE: Toggle for the Add Assessment Dropdown
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    // NEW STATE: Form data for adding a new assessment
    const [newAssessmentData, setNewAssessmentData] = useState({
        type: 'Quiz',
        maxScore: '', // Placeholder for number of items
        date: '', // NEW: State for the selected date
    });


    // STATES FOR STATIC ASSESSMENT MAX SCORES (Editable)
    const [recMax, setRecMax] = useState(() => initializeMaxScore(REC_MAX_KEY, 100));
    const [examMax, setExamMax] = useState(() => initializeMaxScore(EXAM_MAX_KEY, 60));

    // STATE: Holds the editable scores
    const [studentScores, setStudentScores] = useState(() => initializeScores(students, quizCols, actCols));
    // STATE: Placeholder for Attendance Data
    const [localAttendanceData, setLocalAttendanceData] = useState(() => initializeAttendance()); 
    
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

    // --- NEW EFFECT: To persist attendance data whenever it changes and trigger sync ---
    useEffect(() => {
        try {
            localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(localAttendanceData));
            
            // 🚨 FIX: Dispatch the sync event after attendance data is successfully persisted.
            // This signals App.js and ReportsLayout to refresh their data based on the new attendance.
            dispatchDataSync(); 
            
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

    // Handler for Attendance cell changes (MODIFIED TO INCLUDE DROP CHECK)
    const handleAttendanceCellChange = (studentId, dateIndex, status) => {
        setLocalAttendanceData(prevData => {
            const currentTermDates = attendanceTerm === 'Midterm Attendance' ? MIDTERM_DATES : FINALS_DATES;
            const key = `${studentId}-${currentTermDates[dateIndex]}`;
            
            const newData = { ...prevData, [key]: status };
            
            // --- Dropped Student Check (Integrate existing drop logic) ---
            const currentStudent = students.find(s => s.id === studentId);
            if (currentStudent) {
                // Count total absences across BOTH terms
                const totalAbsences = Object.keys(newData).reduce((count, dataKey) => {
                    const status = newData[dataKey];
                    const isForThisStudent = dataKey.startsWith(studentId);
                    
                    if (isForThisStudent && status === 'A') {
                        return count + 1;
                    }
                    return count;
                }, 0);
                
                // If student has 3 or more absences AND we have the drop handler
                if (totalAbsences >= 3 && onStudentDropped) {
                    onStudentDropped({ id: studentId, name: currentStudent.name });
                }
            }
            // --- End Dropped Student Check ---

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
    // Combined toggle handler for Add menu
    const toggleAddMenu = useCallback(() => {
        setIsAddMenuOpen(prev => !prev);
        if (!isAddMenuOpen) {
            // Reset form data when opening
            setNewAssessmentData({ type: 'Quiz', maxScore: '', date: '' }); // RESET DATE TOO
            // Close other menus
            setIsRemoveMenuOpen(false);
            setIsRestoreMenuOpen(false);
        }
    }, [isAddMenuOpen]);

    const toggleRemoveMenu = useCallback(() => {
        setIsRemoveMenuOpen(prev => !prev);
        if (!isRemoveMenuOpen) {
            setIsRestoreMenuOpen(false); // Close restore menu when opening remove
            setIsAddMenuOpen(false); // Close add menu
        }
    }, [isRemoveMenuOpen]);

    const toggleRestoreMenu = useCallback(() => {
        setIsRestoreMenuOpen(prev => !prev);
        if (!isRestoreMenuOpen) {
            setIsRemoveMenuOpen(false); // Close remove menu when opening restore
            setIsAddMenuOpen(false); // Close add menu
        }
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

    // --- MODIFIED: Add Column Handler (Uses the new form state, including date) ---
    const handleAddAssessment = (event) => {
        event.preventDefault(); // Prevent form submission if we wrap the button in a form
        const { type, maxScore, date } = newAssessmentData;
        const max = parseFloat(maxScore);
        
        if (isNaN(max) || max <= 0) {
            alert("Please enter a valid number of items/max score greater than zero.");
            return;
        }

        if (!date) {
            alert("Please select a date for the assessment.");
            return;
        }

        const assessmentType = type;
        const isActivity = assessmentType === 'Activity' || assessmentType === 'Lab';
        const collection = isActivity ? actCols : quizCols;
        const setCollection = isActivity ? setActCols : setQuizCols;
        const removedCollection = isActivity ? removedActCols : removedQuizCols;

        // Determine the next index
        const totalItems = collection.length + removedCollection.length;
        const nextIndex = totalItems + 1;

        if (!isActivity) {
            // Quiz
            setCollection(prevCols => {
                const newId = `q${Date.now()}`;
                // ADD DATE HERE
                return [...prevCols, { id: newId, label: `Q${nextIndex}`, max: max, date: date }];
            });
        } else {
            // Activity / Lab
            setCollection(prevCols => {
                const newId = `act${Date.now()}`;
                const labelPrefix = currentView.includes('Midterm') ? 'ACT' : 'LAB';
                // ADD DATE HERE
                return [...prevCols, { id: newId, label: `${labelPrefix} ${nextIndex}`, max: max, date: date }]; 
            });
        }

        // Close and reset
        setIsAddMenuOpen(false);
        setNewAssessmentData({ type: 'Quiz', maxScore: '', date: '' });
    };

    // --- NEW: AI-POWERED ATTENDANCE UPLOAD HANDLER (STRICT MODE) ---
    const handleAttendanceUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true); // Start loading state

        try {
            // 1. Convert image/file to base64 text
            const base64Data = await fileToBase64(file);

            // 2. CREATE ROSTER CONTEXT
            // We include the name prominently so the AI can fuzzy-match "Ghact Fram Cloud" to "Ghost From Cloud"
            const rosterList = students.map(s => `"${s.name}" (ID: ${s.id})`).join(', ');
            
            // 3. Construct the prompt for the AI
            // UPDATED: Stricter instructions on Name Matching and Date Alignment
            const systemPrompt = `
            You are a strict data entry clerk digitizing a handwritten attendance sheet.

            **TASK:**
            Extract attendance statuses ('P', 'A', 'L') for the students listed below.

            **1. ROSTER MATCHING (CRITICAL):**
            - The image contains rows for these specific students: [ ${rosterList} ].
            - **TRUST THE NAMES OVER THE IDs.** The handwritten IDs in the image might be typos (e.g., "88-30888" is actually "99-99999" "Ghost From Cloud").
            - Find the row in the image that visually resembles the Student Name in the roster, then use the Roster's ID for the JSON output.

            **2. DATE ALIGNMENT (CRITICAL):**
            - The Valid System Dates are: ${[...MIDTERM_DATES, ...FINALS_DATES].map(d => `"${d}"`).join(', ')}.
            - **READ THE COLUMN HEADERS IN THE IMAGE.**
            - ONLY extract data if the image header matches a Valid System Date. 
            - If the image contains a date NOT in the list (e.g., "Oct 25"), IGNORE IT.
            - If the image is MISSING a date from the list (e.g., missing "Sept 25"), DO NOT hallucinate data. Just omit that date from the JSON.

            **3. CELL INTERPRETATION:**
            - Look for circled letters: Ⓟ = 'P', Ⓐ = 'A', Ⓛ = 'L'.
            - If a cell says "Dropped", mark as 'A' (Absent) or ignore.
            
            **REQUIRED JSON OUTPUT:**
            Return a pure JSON array. No markdown formatting.
            Example: [{"id": "99-99999", "date": "Sept 4", "status": "P"}, ...]
            `;

            // 4. Call the AI service
            console.log("Sending to AI with strict roster context...");
            
            const result = await runAIAnalysis(systemPrompt, {
                mimeType: file.type || 'image/jpeg', 
                data: base64Data
            });

            if (!result.success) {
                throw new Error("AI Service unavailable or timed out.");
            }

            const aiResponseText = result.text.trim();
            console.log("AI Response:", aiResponseText);

            if (aiResponseText.includes("ERROR_UNREADABLE")) {
                    alert("The AI could not read attendance data. Please ensure the image is clear.");
                    setIsUploading(false);
                    return;
            }

            // 5. Parse the JSON response
            const jsonMatch = aiResponseText.match(/\[.*\]/s);
            const jsonString = jsonMatch ? jsonMatch[0] : aiResponseText;

            let parsedData;
            try {
                parsedData = JSON.parse(jsonString);
            } catch (e) {
                    console.error("AI JSON Parse Error:", e);
                    alert("The AI processed the image but returned an invalid format.");
                    setIsUploading(false);
                    return;
            }

            // 6. Validate and Update State
            let updatedCount = 0;
            const newAttendanceData = { ...localAttendanceData };
            const validDates = [...MIDTERM_DATES, ...FINALS_DATES];

            parsedData.forEach(entry => {
                // STRICT CHECK: Only accept data if ID exists in our roster
                const studentExists = students.some(s => s.id === entry.id);
                // STRICT CHECK: Only accept data if Date is valid
                const dateExists = validDates.includes(entry.date);
                
                // Allow P, A, L. Map any weird AI outputs to safe defaults if needed.
                let status = entry.status.toUpperCase();
                if (status === 'PRESENT') status = 'P';
                if (status === 'ABSENT') status = 'A';
                if (status === 'LATE') status = 'L';
                
                const validStatus = ['P','A','L'].includes(status);

                if (studentExists && dateExists && validStatus) {
                    const key = `${entry.id}-${entry.date}`;
                    newAttendanceData[key] = status;
                    updatedCount++;
                }
            });

            if (updatedCount > 0) {
                setLocalAttendanceData(newAttendanceData);
                alert(`Success! Updated ${updatedCount} records based on the uploaded image.`);
            } else {
                alert("AI analysis complete, but no matching records were found.\n\nMake sure the Date Headers in the image match your System Dates exactly (e.g. 'Sept 4').");
            }

        } catch (error) {
            console.error("Upload processing error:", error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setIsUploading(false); 
            event.target.value = null; 
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

                // Status calculation must reflect the state in image_72674f
                const allAbsences = Object.keys(localAttendanceData).reduce((count, key) => {
                    if (key.startsWith(student.id) && localAttendanceData[key] === 'A') {
                        return count + 1;
                    }
                    return count;
                }, 0);

                const status = allAbsences >= 5 ? 'Dropped' : 'Active'; // Based on Image 4 showing 5 absences = Dropped
                
                csvContent += `${student.id},"${student.name}",${attendanceRow},${allAbsences},"${status}"\n`;
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
                                const mockStatus = localAttendanceData[key] || 'P'; 
                                if (mockStatus === 'A') absences++;
                                return mockStatus;
                            });

                            // Calculate ALL absences across both terms
                            const allAbsences = Object.keys(localAttendanceData).reduce((count, key) => {
                                if (key.startsWith(student.id) && localAttendanceData[key] === 'A') {
                                    return count + 1;
                                }
                                return count;
                            }, 0);

                            const status = allAbsences >= 5 ? 'Dropped' : 'Active'; // Based on Image 4 showing 5 absences = Dropped
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

                                    <td className="center-text font-bold">{allAbsences}</td>
                                    <td className={`center-text ${statusClass}`}>{status}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        );
    };

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
                    {filteredStudents.length === 0 ? (
                         <tr><td colSpan="9" style={{padding: '2rem', textAlign:'center'}}>No students found matching "{searchTerm}".</td></tr>
                    ) : (
                        filteredStudents.map((student, index) => {
                            const scores = studentScores[student.id] || {};
                            
                            const midtermPercentage = calculateTermGrade(scores, true, quizCols, actCols, recMax, examMax);
                            const finalsPercentage = calculateTermGrade(scores, false, quizCols, actCols, recMax, examMax);

                            const mid40 = (midtermPercentage * 0.40);
                            const fin60 = (finalsPercentage * 0.60);
                            const finalGrade = (mid40 + fin60).toFixed(2);
                            
                            let eqvt = '5.00';
                            let remarks = 'FAILED';
                            let remarksClass = 'cell-failed';

                            if (finalGrade >= 98) eqvt = '1.00';
                            else if (finalGrade >= 96) eqvt = '1.25';
                            else if (finalGrade >= 93) eqvt = '1.50';
                            else if (finalGrade >= 75) eqvt = '2.00'; 
                            
                            if (finalGrade >= 75) {
                                remarks = 'PASSED';
                                remarksClass = 'cell-passed';
                            }

                            return (
                                <tr key={student.id}>
                                    <td className="sticky-col col-id header-beige-cell center-text">{student.id}</td>
                                    <td className="sticky-col col-name header-beige-cell" style={{fontWeight:'600', paddingLeft:'8px', textAlign:'left'}}>{student.name}</td>
                                    
                                    <td className="center-text">{midtermPercentage.toFixed(2)}</td>
                                    <td className="center-text header-green-cell">{mid40.toFixed(2)}</td>
                                    <td className="center-text">{finalsPercentage.toFixed(2)}</td>
                                    <td className="center-text header-green-cell">{fin60.toFixed(2)}</td>
                                    
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

    /**
     * @SUMMARY: Renders the table for Midterm/Finals Records. 
     * The Category row was removed and sticky columns were adjusted to rowSpan=2.
     */
    const renderRecordsTable = () => {
        const isMidterm = currentView.includes('Midterm');
        const examLabel = isMidterm ? 'Mid Exam' : 'Final Exam';
        
        const dynamicActCols = isMidterm ? actCols : actCols.map(c => ({...c, label: c.label.replace('ACT', 'LAB')}));
        
        // Calculate total columns for colspan in case of no students
        const totalCols = 4 + quizCols.length + actCols.length + REC_COLS.length + EXAM_COLS.length; 

        return (
            <table className="mp-table">
                <thead>
                    {/* FIRST HEADER ROW (Labels) */}
                    <tr>
                        {/* No., ID, Name - rowSpan="2" */}
                        <th rowSpan="2" className="sticky-col col-no header-category-green">No.</th>
                        <th rowSpan="2" className="sticky-col col-id header-category-green">Student ID</th>
                        <th rowSpan="2" className="sticky-col col-name header-category-green">Student Name</th>
                        
                        {/* Percentage Column - rowSpan="2" para hindi sumama sa scroll at masakop ang 100% label space */}
                        <th rowSpan="2" className="sticky-col col-grade header-midterm-green">
                            {isMidterm ? 'Midterm' : 'Finals'}<br/>Percentage
                        </th>
                        
                        {/* Dynamic Column Headers (Hindi sticky) */}
                        {quizCols.map(c => {
                            // NEW: Add title attribute for tooltip (Quiz columns only)
                            const tooltip = c.date ? `Date: ${new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : c.label;
                            return (
                                <th key={c.id} className="header-category-orange" title={tooltip}>
                                    {c.label}
                                </th>
                            );
                        })}
                        {dynamicActCols.map(c => <th key={c.id} className="header-category-orange">{c.label}</th>)}
                        {REC_COLS.map(c => <th key={c.id} className="header-category-orange">{c.label}</th>)}
                        <th className="header-category-orange">{examLabel}</th> 
                    </tr>

                    {/* SECOND HEADER ROW (MAX SCORES) */}
                    <tr>
                        {/* WALANG <th> DITO PARA SA STICKY COLUMNS dahil naka rowSpan="2" na sila */}
                        
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
        if (currentView === 'Gradesheet') return renderGradesheetTable();
        if (currentView === 'Attendance') return renderAttendanceTable();
        return renderRecordsTable();
    };

    // ... (renderSideCards remains unchanged)
    const renderSideCards = () => {
        const totalQuizMax = quizCols.reduce((sum, c) => sum + c.max, 0); 
        const totalActLabMax = actCols.reduce((sum, c) => sum + c.max, 0); 
        const totalRecMax = recMax; 
        const totalExamMax = examMax;

        const isGradesheet = currentView === 'Gradesheet';
        const isFinals = currentView.includes('Finals');

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
                                onClick={() => onPageChange('view-studs', { sectionData: sectionData })}
                                title="Go back to Student Records"
                            >
                                <ArrowLeft size={20} />
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
                        
                        {/* 1. Show Add Assessment for Grade Views - CONSOLIDATED INTO DROPDOWN */}
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


                                {/* --- REMOVE BUTTON WITH DROPDOWN (marginLeft set to 8px) --- */}
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
                                
                                {/* --- NEW RESTORE BUTTON WITH DROPDOWN (marginLeft set to 8px) --- */}
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
                        
                        {/* 2. Show Attendance Controls ONLY when Attendance is Selected (UPDATED) */}
                        {currentView === 'Attendance' && (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
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

                                {/* --- NEW: Upload Attendance Button with AI Integration --- */}
                                <div>
                                    <input 
                                        type="file" 
                                        id="att-upload-input" 
                                        // Accept images and PDFs for AI analysis
                                        accept="image/png, image/jpeg, image/jpg, .pdf" 
                                        style={{ display: 'none' }} 
                                        onChange={handleAttendanceUpload}
                                        disabled={isUploading} // Disable input while uploading
                                    />
                                    <label 
                                        htmlFor="att-upload-input" 
                                        className={`btn-utility ${isUploading ? 'disabled-btn' : ''}`}
                                        style={{ height: '38px', cursor: isUploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                        title="Upload Attendance Photo/File for AI Analysis"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader size={16} /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={16} /> Upload Photo/File
                                            </>
                                        )}
                                    </label>
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

                /* --- NEW: Disabled Button State & Spinner --- */
                .disabled-btn {
                    opacity: 0.6;
                    pointer-events: none;
                    background-color: #f3f4f6 !important;
                    color: #9ca3af !important;
                    box-shadow: none;
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MultiPageGS;