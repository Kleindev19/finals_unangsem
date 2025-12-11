// src/components/assets/Reports/VReports.jsx

import React, { useState, useMemo } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; // Ensure framer-motion is imported
import './VReports.css';
import './ViewRD.css'; // <--- CRITICAL IMPORT: Loads the professional styles
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';
import { runAIAnalysis } from '../../../Apps'; 
import { 
    ArrowLeft, Search, ChevronDown, Mail, Send, Sparkles, 
    AlertCircle, CheckCircle, Loader2, XCircle 
} from 'lucide-react';

// --- INTERNAL COMPONENT: CONTACT INTERFACE (STYLED MATCHING VIEWRD) ---
const ContactInterface = ({ student, onBack, scores, quizCols, actCols }) => {
    const [generating, setGenerating] = useState(false);
    const [sending, setSending] = useState(false);
    const [subject, setSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

    // Calculate Pendings
    const pendings = [];
    [...quizCols, ...actCols].forEach(col => {
        const val = parseFloat(scores[col.id]);
        if (isNaN(val) || val === 0) pendings.push(col.label);
    });

    const handleGenerate = async () => {
        setGenerating(true);
        const prompt = `
            Draft a professional intervention email to ${student.name}.
            Context: Missing: ${pendings.join(', ')}. Status: At Risk.
            Goal: Supportive but firm. Ask to submit by Friday.
            Output JSON: { "subject": "...", "body": "..." }
        `;
        try {
            const res = await runAIAnalysis(prompt);
            if (res.success) {
                const data = JSON.parse(res.text.replace(/```json|```/g, '').trim());
                setSubject(data.subject);
                setEmailBody(data.body);
            }
        } catch (e) {}
        setGenerating(false);
    };

    const handleSend = async () => {
        setSending(true);
        await fetch('http://localhost:5000/api/send-email', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ to: student.email, studentName: student.name, subject, html: emailBody })
        });
        alert("Email sent successfully!");
        onBack();
        setSending(false);
    };

    // --- RENDER (Using ViewRD.css classes) ---
    return (
        <motion.div 
            className="vrd-contact-container" // Uses ViewRD.css style
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ height: 'calc(100vh - 100px)', marginTop: '0' }} // Minor adjust for layout context
        >
            <div className="vrd-contact-header">
                <button onClick={onBack} className="vrd-back-btn">
                    <ArrowLeft size={18}/> Back to List
                </button>
                <div className="vrd-contact-title">
                    <Mail className="text-indigo" size={20}/>
                    <h2>Communication Hub</h2>
                </div>
            </div>

            <div className="vrd-contact-grid">
                {/* Left Panel: Context */}
                <div className="vrd-context-panel">
                    <div className="vrd-panel-header">
                        <img src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}`} className="vrd-mini-avatar" alt="Avatar"/>
                        <div>
                            <h3>{student.name}</h3>
                            <span>{student.id}</span>
                        </div>
                    </div>

                    <div className={`vrd-status-box ${pendings.length ? 'status-danger' : 'status-success'}`}>
                        <div className="status-title">
                            {pendings.length ? <AlertCircle size={16}/> : <CheckCircle size={16}/>}
                            <span>{pendings.length} Requirements Pending</span>
                        </div>
                        <p>{pendings.length ? `Missing: ${pendings.join(', ')}` : "Student is up to date."}</p>
                    </div>

                    <button onClick={handleGenerate} disabled={generating} className="vrd-btn-ai">
                        {generating ? <Loader2 className="spin" size={18}/> : <Sparkles size={18}/>}
                        Generate AI Draft
                    </button>
                </div>

                {/* Right Panel: Editor */}
                <div className="vrd-editor-panel">
                    <div className="vrd-input-group">
                        <label>Subject Line</label>
                        <input 
                            value={subject} 
                            onChange={e=>setSubject(e.target.value)} 
                            placeholder="Email Subject..."
                        />
                    </div>
                    <div className="vrd-input-group full-height">
                        <label>Message Body</label>
                        <textarea 
                            value={emailBody} 
                            onChange={e=>setEmailBody(e.target.value)} 
                            placeholder="AI generated content will appear here..."
                        />
                    </div>
                    <div className="vrd-editor-actions">
                        <button onClick={handleSend} disabled={sending || !emailBody} className="vrd-btn-send">
                            {sending ? <Loader2 className="spin" size={18}/> : <Send size={18}/>} Send Email
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


// --- MAIN COMPONENT ---
const VReports = ({ onLogout, onPageChange, sectionData, atRiskStudents = [], allStudents = [] }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('atRisk');
    
    // VIEW STATE: 'list' or 'contact'
    const [viewMode, setViewMode] = useState('list');
    const [selectedContact, setSelectedContact] = useState(null);

    // Load Data for Context
    const allScores = useMemo(() => JSON.parse(localStorage.getItem('progressTracker_studentScores_v1') || '{}'), []);
    const quizCols = useMemo(() => JSON.parse(localStorage.getItem('progressTracker_quizCols_v1') || '[]'), []);
    const actCols = useMemo(() => JSON.parse(localStorage.getItem('progressTracker_actCols_v1') || '[]'), []);

    // Helper functions for Risk Status (retained from original)
    const getRiskStatus = (student) => {
        const finalGrade = parseFloat(student.gpa || student.finalGrade); 
        const absences = student.absences || 0;
        if ((!isNaN(finalGrade) && finalGrade < 75) || absences >= 7) return 'High Risk';
        if (absences >= 5 || (finalGrade < 80 && finalGrade > 0)) return 'Medium Risk';
        return 'On Track';
    };
    const getStatusStyle = (risk) => risk.includes('High') ? 'vr-status-high' : risk.includes('Medium') ? 'vr-status-medium' : 'vr-status-green';

    // Filter Logic
    const currentList = filterType === 'atRisk' ? (atRiskStudents || []) : (allStudents || []);
    const filteredList = currentList.filter(s => 
        (s.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (s.id?.includes(searchTerm))
    );

    const handleContactClick = (student) => {
        setSelectedContact(student);
        setViewMode('contact');
    };

    return (
        <div className="vr-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="reports" onWidthChange={setSidebarWidth} />

            <main className="vr-main" style={{ marginLeft: sidebarWidth }}>
                
                <AnimatePresence mode="wait">
                    {/* CONDITIONAL RENDER: CONTACT INTERFACE VS TABLE */}
                    {viewMode === 'contact' && selectedContact ? (
                        <ContactInterface 
                            key="contact"
                            student={selectedContact} 
                            onBack={() => setViewMode('list')}
                            scores={allScores[selectedContact.id] || {}}
                            quizCols={quizCols}
                            actCols={actCols}
                        />
                    ) : (
                        <motion.div 
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="vr-header">
                                <div className="vr-header-left">
                                    <button className="vr-back-btn" onClick={() => onPageChange('reports')}>
                                        <ArrowLeft size={18}/>
                                    </button>
                                    <div>
                                        <h1 className="vr-title">{sectionData?.code || 'Section Report'}</h1>
                                        <p className="vr-subtitle">{sectionData?.course || 'Course Details'}</p>
                                    </div>
                                </div>
                                <div className="vr-header-right">
                                    <div className="vr-search-box">
                                        <Search className="vr-search-icon" />
                                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    </div>
                                    <div className="mp-view-selector-wrapper">
                                        <select className="mp-view-selector" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                            <option value="atRisk">At-Risk ({atRiskStudents?.length || 0})</option>
                                            <option value="all">All ({allStudents?.length || 0})</option>
                                        </select>
                                        <ChevronDown className="mp-selector-chevron" />
                                    </div>
                                </div>
                            </div>

                            <div className="vr-table-container">
                                <table className="vr-table">
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>Name</th>
                                            <th className="center-text">Attendance</th>
                                            <th className="center-text">Missed</th>
                                            <th className="center-text">Status</th>
                                            <th className="center-text">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredList.length === 0 ? (
                                            <tr><td colSpan="6" style={{textAlign:'center', padding:'2rem', color:'#888'}}>No students found.</td></tr>
                                        ) : (
                                            filteredList.map((student) => {
                                                const risk = getRiskStatus(student);
                                                return (
                                                    <tr key={student.id}>
                                                        <td className="vr-text-id">{student.id}</td>
                                                        <td>
                                                            <div className="vr-name-cell">
                                                                <span className="vr-avatar-initials" style={{background:'#6366f1'}}>{student.name.charAt(0)}</span>
                                                                <span>{student.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="center-text">{student.attendance || '0%'}</td>
                                                        <td className="center-text">{student.absences || 0}</td>
                                                        <td className="center-text">
                                                            <span className={`vr-status-pill ${getStatusStyle(risk)}`}>{risk}</span>
                                                        </td>
                                                        <td className="center-text">
                                                            <div className="vr-actions">
                                                                <button 
                                                                    className="vr-btn-contact"
                                                                    onClick={() => handleContactClick(student)}
                                                                >
                                                                    Contact
                                                                </button>
                                                                
                                                                <button 
                                                                    className="vr-btn-view" 
                                                                    onClick={() => {
                                                                        localStorage.setItem('selectedStudentForView', JSON.stringify(student));
                                                                        onPageChange('view-rd', { student });
                                                                    }}
                                                                >
                                                                    Details
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default VReports;