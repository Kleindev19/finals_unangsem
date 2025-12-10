// src/components/assets/Reports/Reports.jsx

import React, { useState, useMemo } from 'react'; 
import PropTypes from 'prop-types';
import './Reports.css';

// 💡 NEW: Import the grade calculation helper from Gradesheet.jsx
import { calculateTermGrade } from '../Dashboard/Gradesheet';

// --- ICONS ---
const FileTextIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>);
const UsersIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const ArrowRight = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const ChevronDown = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);

// 💡 NEW PROPS: Added all grade-related state props from MultiPageGS.jsx
const Reports = ({ 
    onPageChange, 
    sections = [], 
    students = [], 
    attendanceData = {}, 
    searchTerm = '',
    // Grade data required for risk calculation
    studentScores = {}, 
    midQuizCols = [],
    midActCols = [],
    finQuizCols = [],
    finActCols = [],
    recMax = 100, // Default to MultiPageGS initial state
    examMax = 60 // Default to MultiPageGS initial state
}) => { 
    const [instituteFilter, setInstituteFilter] = useState('All');

    // --- LOGIC: MERGE SECTIONS + STUDENTS + ATTENDANCE + GRADES ---
    const reportData = useMemo(() => {
        if (!sections || sections.length === 0) return [];

        const mergedData = sections.map(section => {
            // 1. Get students for this specific section
            const classStudents = students.filter(s => s.section === section.name);
            
            // 2. Calculate details for each student
            const detailedStudents = classStudents.map(student => {
                // Get attendance record from App state
                const record = attendanceData[student.id] || [];
                // Count absences (including 'A' status and any other absence indicators)
                const absences = record.filter(status => 
                    status === 'A' || 
                    status === 'Absent' || 
                    status === 'absent'
                ).length;
                
                // Mock GPA / Attendance % calculation
                const totalRecorded = record.length || 1;
                const presentCount = record.filter(s => s === 'P' || s === 'L').length;
                const attendancePct = Math.round((presentCount / totalRecorded) * 100) || 100;

                // 💡 NEW: Grade Calculation with validation
                const scores = studentScores[student.id] || {};
                const midtermPercentage = calculateTermGrade(scores, true, midQuizCols, midActCols, recMax, examMax) || 0;
                const finalsPercentage = calculateTermGrade(scores, false, finQuizCols, finActCols, recMax, examMax) || 0;
                const finalGrade = (midtermPercentage * 0.40 + finalsPercentage * 0.60);
                
                // ✅ VALIDATION: Only mark as risk if we have actual grade data
                const hasGradeData = Object.keys(scores).length > 0;
                const validFinalGrade = !isNaN(finalGrade) && isFinite(finalGrade);
                
                // 💡 NEW: Unified Risk Calculation
                // Risk criteria: 3 or more absences OR (has grade data AND Final Grade < 75%)
                const isAttendanceRisk = absences >= 3;
                const isAcademicRisk = hasGradeData && validFinalGrade && finalGrade < 75;
                const isAtRisk = isAttendanceRisk || isAcademicRisk;
                
                // Determine risk text
                let riskLabel;
                if (absences >= 7 || (validFinalGrade && finalGrade < 60)) {
                    riskLabel = 'High Risk';
                } else if (absences >= 5 || (validFinalGrade && finalGrade < 70)) {
                    riskLabel = 'Medium Risk';
                } else if (isAtRisk) {
                    riskLabel = 'Intervention Needed';
                } else {
                    riskLabel = 'On Track';
                }

                // 🐛 DEBUG: Remove this after testing
                console.log(`[${section.name}] ${student.name}:`);
                console.log('  - Absences:', absences);
                console.log('  - Has Grade Data:', hasGradeData);
                console.log('  - Final Grade:', validFinalGrade ? finalGrade.toFixed(2) : 'N/A');
                console.log('  - Is Attendance Risk:', isAttendanceRisk);
                console.log('  - Is Academic Risk:', isAcademicRisk);
                console.log('  - Is At Risk:', isAtRisk);
                console.log('  - Risk Label:', riskLabel);
                console.log('  - Attendance Record:', record);
                console.log('---');

                return {
                    ...student,
                    absences: absences,
                    finalGrade: validFinalGrade ? finalGrade.toFixed(2) : 'N/A', // Show N/A if no grade data
                    attendance: `${attendancePct}%`,
                    avatar: `https://ui-avatars.com/api/?name=${student.name}&background=random`,
                    isAtRisk: isAtRisk, // NEW: Unified Risk Flag
                    riskLabel: riskLabel, // NEW: Unified Risk Label
                };
            });

            // 3. Filter 'At Risk' students (Now based on the new isAtRisk flag)
            const atRisk = detailedStudents.filter(s => s.isAtRisk);

            return {
                ...section,
                code: section.name, 
                totalStudents: detailedStudents.length,
                riskCount: atRisk.length,
                atRiskStudents: atRisk, // Only the risky ones
                allStudents: detailedStudents // Everyone (with calculated stats)
            };
        });

        // 4. SORTING: Risky sections first, then by total students
        return mergedData.sort((a, b) => {
            if (b.riskCount !== a.riskCount) return b.riskCount - a.riskCount;
            return b.totalStudents - a.totalStudents;
        });

    }, [sections, students, attendanceData, studentScores, midQuizCols, midActCols, finQuizCols, finActCols, recMax, examMax]);


    // --- FILTERING ---
    const filteredReports = reportData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesInstitute = instituteFilter === 'All' || (item.institute && item.institute === instituteFilter);
        
        return matchesSearch && matchesInstitute;
    });

    const handleClassClick = (classData) => {
        if (onPageChange) {
            onPageChange('v-reports', { 
                section: classData.name,
                sectionData: classData, 
                atRiskStudents: classData.atRiskStudents, 
                allStudents: classData.allStudents 
            });
        }
    };

    return (
        <div className="reports-page-container">
            
            {/* Filter Card */}
            <div className="rep-filter-card">
                <div className="rep-filter-group">
                    <label>Institute Filter</label>
                    <div className="rep-select-wrapper">
                        <select value={instituteFilter} onChange={(e) => setInstituteFilter(e.target.value)}>
                            <option value="All">All Institutes</option>
                            <option value="Institute of Computing Studies">ICS</option>
                            <option value="Institute of Education">IED</option>
                            <option value="Institute of Business">IBE</option>
                        </select>
                        <ChevronDown className="rep-chevron" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="rep-main-card">
                <div className="rep-card-header">
                    <h2>Assess Student</h2>
                    <p>Sections prioritized by intervention needs</p>
                </div>

                <div className="rep-grid">
                    {filteredReports.length === 0 ? (
                        <div className="rep-no-data" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                            <p>No sections found. Add classes in your Profile to get started.</p>
                        </div>
                    ) : (
                        filteredReports.map((cls) => {
                            const isHighRisk = cls.riskCount > 0;
                            
                            return (
                                <div 
                                    key={cls.id} 
                                    className="rep-class-card"
                                    style={{ 
                                        borderColor: isHighRisk ? '#FCA5A5' : '#E5E7EB',
                                        backgroundColor: isHighRisk ? '#FEF2F2' : 'white',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div className="rep-class-icon-box" style={{ backgroundColor: cls.color || '#3B82F6' }}>
                                        <FileTextIcon className="rep-class-icon" />
                                    </div>
                                    
                                    <h3 className="rep-class-code">{cls.code}</h3>
                                    <p className="rep-class-name">{cls.subtitle || cls.course || 'General Section'}</p>
                                    
                                    {/* Stats Row */}
                                    <div style={{ 
                                        display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', 
                                        color: '#4B5563', padding: '0.5rem', background: 'rgba(255,255,255,0.6)', borderRadius: '6px',
                                        border: '1px solid rgba(0,0,0,0.05)'
                                    }}>
                                        <div>
                                            <span style={{ display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{cls.totalStudents}</span>
                                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Students</span>
                                        </div>
                                        <div style={{ width: '1px', background: '#D1D5DB' }}></div>
                                        <div>
                                            <span style={{ display: 'block', fontWeight: '700', fontSize: '1.1rem', color: isHighRisk ? '#DC2626' : '#10B981' }}>
                                                {cls.riskCount}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>At Risk</span>
                                        </div>
                                    </div>
                                    
                                    <div className="rep-card-footer">
                                        <div className="rep-at-risk" style={{ color: isHighRisk ? '#DC2626' : '#6B7280' }}>
                                            <UsersIcon /> 
                                            <span>{isHighRisk ? 'Intervention Needed' : 'On Track'}</span>
                                        </div>
                                        <button 
                                            className="rep-view-link" 
                                            onClick={() => handleClassClick(cls)} 
                                        >
                                            View <ArrowRight />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

        </div>
    );
};

export default Reports;

Reports.propTypes = {
    onPageChange: PropTypes.func,
    sections: PropTypes.array,
    students: PropTypes.array,
    attendanceData: PropTypes.object,
    searchTerm: PropTypes.string,
    // 💡 NEW PROPS
    studentScores: PropTypes.object,
    midQuizCols: PropTypes.array,
    midActCols: PropTypes.array,
    finQuizCols: PropTypes.array,
    finActCols: PropTypes.array,
    recMax: PropTypes.number,
    examMax: PropTypes.number,
};