// src/components/assets/Dashboard/Gradesheet.jsx

import React from 'react';
import './MultiPageGS.css';

// --- CONSTANTS (Required for rendering headers) ---
const REC_COLS = [{ id: 'r1', label: 'R1' }]; 
const EXAM_COLS = [{ id: 'exam', label: 'Major Exam' }]; 

// --- HELPER: Grade Calculation (Exported for reuse if needed) ---
export const calculateTermGrade = (scores, isMidterm, currentQuizCols, currentActCols, recMax, examMax) => {
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


// --- COMPONENT: Side Cards (Composition & Grading Scale) ---
const GradesheetSideCards = () => {
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
};

// --- COMPONENT: Main Gradesheet Summary Table ---
const GradesheetTable = ({ 
    students, 
    studentScores, 
    quizCols, 
    actCols, 
    recMax, 
    examMax 
}) => {
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
                    students.map((student) => {
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

// --- UTILITY COMPONENT: Max Score Input (Moved from MultiPageGS.jsx) ---
const MaxScoreInput = ({ value, type, id, onChange }) => (
    <input 
        type="number"
        className="mp-table-input mp-max-score-input"
        value={value === 0 ? '' : value}
        onChange={(e) => onChange(type, id, e.target.value)}
        min="0"
        style={{textAlign: 'center', width: '90%'}}
    />
);

// --- COMPONENT: Midterm/Finals Records Table (Moved/Refactored from MultiPageGS.jsx) ---
export const RecordsTableComponent = ({ 
    isMidterm, 
    students, 
    studentScores, 
    quizCols, 
    actCols, 
    recMax, 
    examMax, 
    handleMaxScoreChange, // Handler for Max Score
    handleScoreChange,    // Handler for Student Score
    searchTerm 
}) => {
    const filteredStudents = students; // Students are already filtered by the parent component
    
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

                                {/* Quiz Scores */}
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

                                {/* Activity/Lab Scores */}
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

                                {/* Recitation Score */}
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

                                {/* Exam Score */}
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


// --- NEW MAIN EXPORT COMPONENT (Default export for Gradesheet Summary) ---
const GradesheetView = (props) => {
    return (
        <div className="mp-table-container">
            <GradesheetTable {...props} />
        </div>
    );
}

// Export the side card component with a clear alias and the main view as default
export const GradesheetSideCardsExport = GradesheetSideCards;
export default GradesheetView;