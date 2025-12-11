// src/components/assets/Reports/ViewRD.jsx

import React, { useState, useMemo } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Line
} from 'recharts';
import { 
    ArrowLeft, BrainCircuit, Mail, Calculator, TrendingUp, 
    AlertTriangle, CheckCircle, RefreshCw, ChevronDown, User, Users,
    Sparkles, Send, Loader2, AlertCircle as AlertIcon, XCircle
} from 'lucide-react';

import './ViewRD.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';
import { runAIAnalysis } from '../../../Apps'; 
import { calculateTermGrade } from '../Dashboard/Gradesheet'; 

// --- HELPER: CALCULATE CLASS AVERAGE ---
const calculateClassAverage = (allScores, colId, maxScore) => {
    const studentIds = Object.keys(allScores);
    if (studentIds.length === 0) return 0;
    let total = 0;
    let count = 0;
    studentIds.forEach(id => {
        const studentData = allScores[id];
        if (studentData && studentData[colId]) {
            const val = parseFloat(studentData[colId]);
            if (!isNaN(val)) { total += val; count++; }
        }
    });
    return count === 0 ? 0 : maxScore > 0 ? ((total / count) / maxScore) * 100 : 0;
};

// --- INTERNAL COMPONENT: CONTACT INTERFACE ---
const ContactInterface = ({ student, onBack, scores, quizCols, actCols }) => {
    const [generating, setGenerating] = useState(false);
    const [sending, setSending] = useState(false);
    const [subject, setSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

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

    return (
        <motion.div 
            className="vrd-contact-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ height: 'calc(100vh - 100px)', marginTop: '0' }}
        >
            <div className="vrd-contact-header">
                <button onClick={onBack} className="vrd-back-btn">
                    <ArrowLeft size={18}/> Back to Dashboard
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
                            {pendings.length ? <AlertIcon size={16}/> : <CheckCircle size={16}/>}
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

// --- MAIN DASHBOARD COMPONENT ---
const ViewRD = ({ onLogout, onPageChange, student: studentProp }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
    const [activeTab, setActiveTab] = useState('insights'); 
    const [analyzing, setAnalyzing] = useState(false);
    const [simulatedFinalScore, setSimulatedFinalScore] = useState(90);
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'contact'

    // Data Loading
    const student = useMemo(() => {
        if (studentProp && studentProp.id) return studentProp;
        const saved = localStorage.getItem('selectedStudentForView');
        return saved ? JSON.parse(saved) : { id: '00-00000', name: 'Unknown Student' };
    }, [studentProp]);

    const storedScores = useMemo(() => JSON.parse(localStorage.getItem('progressTracker_studentScores_v1') || '{}'), []);
    const storedAttendance = useMemo(() => JSON.parse(localStorage.getItem('progressTracker_attendanceData_v1') || '{}'), []);
    const quizCols = useMemo(() => JSON.parse(localStorage.getItem('progressTracker_quizCols_v1') || '[]'), []);
    const actCols = useMemo(() => JSON.parse(localStorage.getItem('progressTracker_actCols_v1') || '[]'), []);
    const recMax = parseFloat(localStorage.getItem('progressTracker_recMax_v1') || '100');
    const examMax = parseFloat(localStorage.getItem('progressTracker_examMax_v1') || '60');

    const studentScores = storedScores[student.id] || {};

    // Calculations
    const midGrade = calculateTermGrade(studentScores, true, quizCols, actCols, recMax, examMax);
    const finGrade = calculateTermGrade(studentScores, false, quizCols, actCols, recMax, examMax);
    const isFinalsActive = finGrade > 0;
    const currentGrade = isFinalsActive ? (midGrade * 0.4 + finGrade * 0.6) : (midGrade > 0 ? midGrade : parseFloat(student.gpa || 0));

    const allDates = ['Sept 4', 'Sept 11', 'Sept 18', 'Sept 25', 'Oct 2', 'Oct 9', 'Nov 6', 'Nov 13', 'Nov 20', 'Nov 27', 'Dec 4', 'Dec 11'];
    const attendanceRecord = allDates.map(date => storedAttendance[`${student.id}-${date}`] || 'P');
    const absences = attendanceRecord.filter(s => s === 'A').length;
    const finalAbsences = absences > 0 ? absences : (student.absences || 0);
    const lates = attendanceRecord.filter(s => s === 'L').length;
    const attPct = Math.round(((attendanceRecord.length - finalAbsences - (lates * 0.5)) / attendanceRecord.length) * 100);
    const finalAttPct = (attPct === 100 && student.attendancePercentage && student.attendancePercentage !== '100%') ? parseInt(student.attendancePercentage) : attPct;

    // Chart Data
    const trendData = useMemo(() => {
        const data = [];
        quizCols.forEach((col, i) => {
            const sScore = parseFloat(studentScores[col.id] || 0);
            const sPercent = col.max > 0 ? (sScore / col.max) * 100 : 0;
            const cPercent = calculateClassAverage(storedScores, col.id, col.max);
            data.push({ name: col.label || `Q${i+1}`, student: parseFloat(sPercent.toFixed(1)), classAvg: parseFloat(cPercent.toFixed(1)) });
        });
        actCols.forEach((col, i) => {
            const sScore = parseFloat(studentScores[col.id] || 0);
            const sPercent = col.max > 0 ? (sScore / col.max) * 100 : 0;
            const cPercent = calculateClassAverage(storedScores, col.id, col.max);
            data.push({ name: col.label || `Act${i+1}`, student: parseFloat(sPercent.toFixed(1)), classAvg: parseFloat(cPercent.toFixed(1)) });
        });
        return data;
    }, [quizCols, actCols, studentScores, storedScores]);

    const radarData = [
        { subject: 'Quizzes', A: (calculateTermGrade(studentScores, true, quizCols, [], 0, 0) / 15 * 100) || 60, fullMark: 100 },
        { subject: 'Activities', A: (calculateTermGrade(studentScores, true, [], actCols, 0, 0) / 35 * 100) || 70, fullMark: 100 },
        { subject: 'Exams', A: midGrade > 0 ? (parseFloat(studentScores['exam_mid'] || 0) / examMax * 100) : 50, fullMark: 100 },
        { subject: 'Attendance', A: finalAttPct, fullMark: 100 },
        { subject: 'Recitation', A: 80, fullMark: 100 }, 
    ];

    // Risk & AI
    const determineRisk = () => {
        if (finalAbsences >= 5 || currentGrade < 75) return 'High';
        if (finalAbsences >= 3 || currentGrade < 80) return 'Medium';
        return 'Low';
    };
    const riskLevel = determineRisk();
    const userAvatar = student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&color=fff&size=128`;

    const [aiData, setAiData] = useState(student.aiAnalytics || {
        riskLevel, summary: 'No analysis available. Click "Update Analysis".', recommendation: 'Pending AI insight.', emailDraft: ''
    });

    const handleRunAnalysis = async () => {
        setAnalyzing(true);
        const prompt = `Act as an academic advisor. Analyze student ${student.name}. Grade: ${currentGrade.toFixed(2)}%. Attendance: ${finalAttPct}%. JSON Output: { "riskLevel": "Low"|"Medium"|"High", "summary": "...", "recommendation": "...", "emailDraft": "..." }`;
        try {
            const res = await runAIAnalysis(prompt);
            if(res.success) {
                const parsed = JSON.parse(res.text.replace(/```json|```/g, '').trim());
                setAiData({ ...parsed, lastAnalyzed: new Date() });
            }
        } catch(e) { console.error(e); }
        setAnalyzing(false);
    };

    const projectedGrade = ((currentGrade * 0.4) + (simulatedFinalScore * 0.6)).toFixed(2);

    return (
        <div className="vrd-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="reports" onWidthChange={setSidebarWidth} />
            
            <main className="vrd-main" style={{ marginLeft: sidebarWidth }}>
                <AnimatePresence mode="wait">
                    {viewMode === 'contact' ? (
                        <ContactInterface 
                            key="contact"
                            student={student}
                            onBack={() => setViewMode('dashboard')}
                            scores={studentScores}
                            quizCols={quizCols}
                            actCols={actCols}
                        />
                    ) : (
                        <motion.div 
                            key="dashboard"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="vrd-dashboard-wrapper"
                        >
                            {/* HERO NAV */}
                            <div className="vrd-hero-nav">
                                <button className="vrd-back-btn" onClick={() => onPageChange('reports')}>
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <div className="vrd-hero-actions">
                                    <button onClick={() => setViewMode('contact')} className="vrd-action-btn primary">
                                        <Mail size={16}/> Contact Student
                                    </button>
                                </div>
                            </div>

                            {/* HERO CARD */}
                            <div className="vrd-student-hero">
                                <div className="hero-left">
                                    <div className={`avatar-ring ${riskLevel.toLowerCase()}`}>
                                        <img src={userAvatar} alt="Avatar" />
                                    </div>
                                    <div className="hero-info">
                                        <h1>{student.name}</h1>
                                        <div className="hero-chips">
                                            <span className="chip id-chip">{student.id}</span>
                                            <span className={`chip risk-chip ${riskLevel.toLowerCase()}`}>{riskLevel.toUpperCase()} RISK</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hero-stats">
                                    <div className="stat-box"><span className="label">Current Grade</span><span className={`value ${currentGrade < 75 ? 'danger' : 'success'}`}>{currentGrade.toFixed(2)}%</span></div>
                                    <div className="stat-box"><span className="label">Attendance</span><span className="value">{finalAttPct}%</span></div>
                                    <div className="stat-box"><span className="label">Absences</span><span className="value">{finalAbsences}</span></div>
                                </div>
                            </div>

                            {/* ANALYTICS GRID */}
                            <div className="vrd-dashboard-grid">
                                <div className="vrd-col-charts">
                                    <div className="chart-card">
                                        <div className="card-header">
                                            <h3><TrendingUp size={18}/> Performance Trajectory</h3>
                                            <div className="legend"><span className="dot student"></span> Student <span className="dot class"></span> Class Avg</div>
                                        </div>
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={250}>
                                                <AreaChart data={trendData.length ? trendData : [{name:'Start',student:0,classAvg:0}]}>
                                                    <defs><linearGradient id="colorStudent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                                                    <XAxis dataKey="name" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                                                    <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                                                    <RechartsTooltip contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}/>
                                                    <Area type="monotone" dataKey="student" stroke="#6366f1" strokeWidth={3} fill="url(#colorStudent)" />
                                                    <Line type="monotone" dataKey="classAvg" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false}/>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="charts-row-split">
                                        <div className="chart-card">
                                            <div className="card-header"><h3>Competency Map</h3></div>
                                            <div className="chart-container-small">
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                                        <PolarGrid stroke="#e5e7eb"/><PolarAngleAxis dataKey="subject" tick={{fontSize:9, fill:'#6b7280'}}/ ><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false}/><Radar name="Student" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="chart-card">
                                            <div className="card-header"><h3>Attendance Heatmap</h3></div>
                                            <div className="attendance-heatmap">
                                                {attendanceRecord.map((status, i) => (<div key={i} className={`heatmap-cell ${status}`}>{status}</div>))}
                                            </div>
                                            <div className="heatmap-legend"><span><div className="box P"></div> P</span><span><div className="box A"></div> A</span><span><div className="box L"></div> L</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="vrd-col-ai">
                                    <div className="ai-panel-wrapper">
                                        <div className="ai-header">
                                            <h2><BrainCircuit size={20} className="pulse-icon"/> Cidi Analytics</h2>
                                            <button className="btn-run-ai" onClick={handleRunAnalysis} disabled={analyzing}>
                                                {analyzing ? <RefreshCw className="spin" size={14}/> : 'Update Analysis'}
                                            </button>
                                        </div>
                                        <div className="ai-tabs">
                                            <button className={activeTab==='insights'?'active':''} onClick={()=>setActiveTab('insights')}>Insights</button>
                                            <button className={activeTab==='email'?'active':''} onClick={()=>setActiveTab('email')}>Intervention</button>
                                            <button className={activeTab==='simulation'?'active':''} onClick={()=>setActiveTab('simulation')}>Simulator</button>
                                        </div>
                                        <div className="ai-content-body">
                                            <AnimatePresence mode="wait">
                                                {activeTab === 'insights' && (
                                                    <motion.div key="insights" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} className="ai-tab-content">
                                                        <div className="insight-block"><h4>Diagnostic Summary</h4><p>{aiData.summary}</p></div>
                                                        <div className="insight-block highlight"><h4><CheckCircle size={14}/> Action</h4><p>{aiData.recommendation}</p></div>
                                                    </motion.div>
                                                )}
                                                {activeTab === 'email' && (
                                                    <motion.div key="email" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} className="ai-tab-content">
                                                        <div className="email-generator"><h4><Mail size={14}/> Drafted Email</h4><textarea readOnly value={aiData.emailDraft || "Run analysis first."}/></div>
                                                    </motion.div>
                                                )}
                                                {/* --- UPDATED SIMULATOR UI --- */}
                                                {activeTab === 'simulation' && (
                                                    <motion.div key="simulation" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} className="ai-tab-content">
                                                        <div className="simulation-tool" style={{ padding: '1rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                                                <Calculator size={18} className="text-indigo" />
                                                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: '700' }}>Grade Simulator</h4>
                                                            </div>
                                                            
                                                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                                                                Adjust the slider to see how a Finals score affects the overall grade.
                                                            </p>

                                                            {/* SLIDER CONTROL */}
                                                            <div className="range-wrapper" style={{ marginBottom: '2rem' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>
                                                                    <span>Finals Score</span>
                                                                    <span style={{ color: '#6366f1' }}>{simulatedFinalScore}%</span>
                                                                </div>
                                                                <input 
                                                                    type="range" 
                                                                    min="0" 
                                                                    max="100" 
                                                                    value={simulatedFinalScore} 
                                                                    onChange={(e) => setSimulatedFinalScore(parseInt(e.target.value))}
                                                                    style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
                                                                />
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                                                                    <span>0%</span>
                                                                    <span>50%</span>
                                                                    <span>100%</span>
                                                                </div>
                                                            </div>

                                                            {/* RESULT CARD */}
                                                            <div className={`sim-result-card ${projectedGrade >= 75 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`} 
                                                                 style={{ 
                                                                     padding: '1.2rem', borderRadius: '12px', border: '1px solid', textAlign: 'center',
                                                                     backgroundColor: projectedGrade >= 75 ? '#f0fdf4' : '#fef2f2',
                                                                     borderColor: projectedGrade >= 75 ? '#bbf7d0' : '#fecaca'
                                                                 }}>
                                                                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
                                                                    Projected Final Grade
                                                                </span>
                                                                <strong style={{ fontSize: '2.5rem', display: 'block', lineHeight: '1', color: projectedGrade >= 75 ? '#166534' : '#991b1b' }}>
                                                                    {projectedGrade}
                                                                </strong>
                                                                <span style={{ 
                                                                    display: 'inline-block', marginTop: '8px', padding: '4px 12px', borderRadius: '99px', 
                                                                    fontSize: '0.75rem', fontWeight: '700',
                                                                    backgroundColor: projectedGrade >= 75 ? '#dcfce7' : '#fee2e2',
                                                                    color: projectedGrade >= 75 ? '#166534' : '#991b1b'
                                                                }}>
                                                                    {projectedGrade >= 75 ? 'PASSED' : 'FAILED'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ViewRD;