// src/App.js

import React, { useState, useEffect, useRef } from 'react'; 

// --- PAGE IMPORTS ---
import Dashboard from './components/assets/Dashboard/Dashboard.jsx'; 
import LoginSignUp from './components/assets/Loginsignin/LoginSignUp.jsx';
import ReportsLayout from './components/assets/Reports/ReportsLayout.jsx'; 
import ProfileLayout from './components/assets/Profile/ProfileLayout.jsx'; 
import ViewStuds from './components/assets/Dashboard/ViewStuds.jsx';
import Gradesheet from './components/assets/Dashboard/Gradesheet.jsx';
import MultiPageGS from './components/assets/Dashboard/MultiPageGS.jsx'; 
import VReports from './components/assets/Reports/VReports.jsx'; 
import ViewRD from './components/assets/Reports/ViewRD.jsx'; 
import LoadingAnimation from './components/assets/LoadingAnimation/LoadingAnimation.jsx'; 
import LandingPage from './components/assets/Loginsignin/LandingPage.jsx'; 

// --- FEATURE IMPORTS ---
import VoiceControl from './components/assets/Dashboard/VoiceControl.jsx';
import CdmChatbot from './Apps.jsx'; 
import { auth } from './apiService'; 
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; 
import './App.css';

// --- NEW SECURITY IMPORT ---
import { useSecurityController } from './security/SecurityController';

import meta from './meta.json'; 
const { APP_VERSION } = meta; 

// 🚨 NEW COMPONENT: Dropped Student Modal 🚨
const DroppedStudentModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 10000 
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '10px',
                width: '90%', maxWidth: '400px', textAlign: 'center',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                border: '2px solid #EF4444' 
            }}>
                <h2 style={{ color: '#EF4444', marginBottom: '10px' }}>⚠️ ALERT: STUDENT DROPPED</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                    Si <strong>{student.name}</strong> ay umabot sa <strong>3 absences</strong> at <strong>Automatically Dropped</strong> na sa klase.
                </p>
                <div style={{ backgroundColor: '#FEE2E2', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
                    <p><strong>Student Name:</strong> {student.name}</p>
                    <p><strong>Student ID:</strong> {student.id}</p>
                </div>
                
                <button 
                    onClick={onClose} 
                    style={{
                        backgroundColor: '#EF4444', color: 'white', padding: '10px 20px', 
                        border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    );
};
// 🚨 END NEW COMPONENT

function App() {
    // --- AUTH & NAVIGATION STATE ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [pageParams, setPageParams] = useState({}); 
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    
    // --- DATA STATE ---
    const [profileData, setProfileData] = useState(null); 
    const [isDataReady, setIsDataReady] = useState(false); 
    
    // --- VOICE CONTROL STATE ---
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const voiceRef = useRef(null);

    // --- SYSTEM STATUS STATE ---
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    // --- HELPER: LOAD FROM LOCAL STORAGE ---
    const loadFromStorage = (key, defaultValue) => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return defaultValue;
        }
    };

    // --- CORE DATA (Sections & Students) ---
    const [sections, setSections] = useState(() => loadFromStorage('cdm_sections', []));
    const [students, setStudents] = useState([]);

    // --- ATTENDANCE & RISK TRACKING ---
    const [attendanceData, setAttendanceData] = useState({});
    const [atRiskStudents, setAtRiskStudents] = useState({});
    const [currentSectionContext, setCurrentSectionContext] = useState('');
    const [selectedSection, setSelectedSection] = useState('CS 101 - A');
    
    // 🚨 NEW STATE: Dropped Student Alert 🚨
    const [droppedStudentAlert, setDroppedStudentAlert] = useState(null); 

    // -------------------------------------------------------------------------
    // 1. SECURITY & LOGOUT LOGIC
    // -------------------------------------------------------------------------

    // Manual Logout Handler
    const handleLogout = async () => {
        try { 
            await firebaseSignOut(auth); 
            // Clear all sensitive state
            setProfileData(null); 
            setIsLoggedIn(false); 
            setIsVoiceActive(false);
            setStudents([]);
            // Redirect to Landing Page
            setShowLanding(true); 
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // **ACTIVATE SECURITY CONTROLLER**
    // This hook runs in the background, detects idle mouse/keyboard activity,
    // checks the user's timer setting, and triggers handleLogout if time expires.
    useSecurityController(isLoggedIn, handleLogout);


    // -------------------------------------------------------------------------
    // 2. DATA SYNC & ATTENDANCE LOGIC
    // -------------------------------------------------------------------------

    // Track At-Risk Students based on Attendance Data
    useEffect(() => {
        const atRiskMap = {};
        
        students.forEach(student => {
            const studentAttendance = attendanceData[student.id] || [];
            const absences = studentAttendance.filter(status => status === 'A').length;
            
            // Threshold: 3 absences = At Risk
            if (absences >= 3) {
                const section = currentSectionContext || 'CS 101 - A';
                
                if (!atRiskMap[section]) {
                    atRiskMap[section] = [];
                }
                atRiskMap[section].push({
                    id: student.id,
                    name: student.name,
                    avatar: `https://ui-avatars.com/api/?name=${student.name}&background=random`,
                    gpa: 2.1, // Placeholder for future GPA logic
                    attendance: Math.round((1 - absences/20) * 100) + '%',
                    missed: absences,
                    status: absences >= 10 ? 'High Risk' : 'Medium Risk'
                });
            }
        });
        
        setAtRiskStudents(atRiskMap);
    }, [attendanceData, students, currentSectionContext]);

    // Updates attendance state when changed in MultiPageGS or ViewStuds
    const handleAttendanceUpdate = (updatedData) => {
        setAttendanceData(updatedData);
    };
    
    // 🚨 NEW HANDLER: For student dropped alert 🚨
    const handleStudentDropped = (studentDetails) => {
        setDroppedStudentAlert(studentDetails);
    };

    // Auto-Sync Listener (Online/Offline Toggle)
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            triggerAutoSync(); // Sync immediately when connection returns
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const triggerAutoSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('http://localhost:5000/api/sync-now', { method: 'POST' });
            await res.json();
        } catch (e) {
            console.error("Sync Failed:", e);
        } finally {
            // Keep the "Syncing" badge visible for 2s for UX
            setTimeout(() => setIsSyncing(false), 2000);
        }
    };

    // Fetch Students from MongoDB
    const fetchStudentsFromDB = async (professorUid) => {
        try {
            const response = await fetch(`http://localhost:5000/api/students/${professorUid}/All Sections`);
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            // If offline, keep existing state to prevent UI clearing
            if (isOnline) setStudents([]); 
        }
    };

    // Persist Sections to LocalStorage
    useEffect(() => {
        try {
            localStorage.setItem('cdm_sections', JSON.stringify(sections));
        } catch (error) {
            console.error('Error saving sections to localStorage:', error);
        }
    }, [sections]);

    // ✅ NEW: Load attendance from localStorage and transform it for Reports
    useEffect(() => {
        const loadAttendanceFromStorage = () => {
            try {
                const ATTENDANCE_STORAGE_KEY = 'progressTracker_attendanceData_v1';
                const savedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
                if (savedAttendance) {
                    const parsed = JSON.parse(savedAttendance);
                    
                    // Transform from MultiPageGS format {studentId-date: status} 
                    // to App.js format {studentId: [status, status, ...]}
                    const transformed = {};
                    const MIDTERM_DATES = ['Sept 4', 'Sept 11', 'Sept 18', 'Sept 25', 'Oct 2', 'Oct 9'];
                    const FINALS_DATES = ['Nov 6', 'Nov 13', 'Nov 20', 'Nov 27', 'Dec 4', 'Dec 11'];
                    const allDates = [...MIDTERM_DATES, ...FINALS_DATES];
                    
                    students.forEach(student => {
                        const studentRecord = [];
                        allDates.forEach(date => {
                            const key = `${student.id}-${date}`;
                            const status = parsed[key] || 'P';
                            studentRecord.push(status);
                        });
                        transformed[student.id] = studentRecord;
                    });
                    
                    setAttendanceData(transformed);
                    console.log('✅ Attendance data loaded and transformed');
                }
            } catch (error) {
                console.error('Error loading attendance from localStorage:', error);
            }
        };

        if (students.length > 0) {
            loadAttendanceFromStorage();
        }
    }, [students]); // Run when students are loaded


    // -------------------------------------------------------------------------
    // 3. AUTHENTICATION & INITIALIZATION
    // -------------------------------------------------------------------------

    useEffect(() => {
        console.log(`%c Progress Tracker v${APP_VERSION} `, 'background: #38761d; color: white; padding: 4px; border-radius: 4px;');
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setIsLoggedIn(true);
                setShowLanding(false); // Skip Landing Page if session exists
                
                try {
                    // Sync User Profile with Backend
                    const response = await fetch('http://localhost:5000/api/user-sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                            photoURL: firebaseUser.photoURL || "" 
                        })
                    });
                    
                    if (!response.ok) throw new Error('Failed to sync');
                    const mongoProfile = await response.json();
                    
                    setProfileData({ 
                        ...mongoProfile, 
                        id: mongoProfile.uid, 
                        displayName: mongoProfile.displayName, 
                        photoURL: mongoProfile.photoURL || firebaseUser.photoURL 
                    });
                    
                    // Load Students
                    await fetchStudentsFromDB(firebaseUser.uid);
                    
                    setIsDataReady(true); // Triggers LoadingAnimation exit
                } catch (error) {
                    console.warn("⚠️ Offline Mode Detected during login.");
                    // Set minimal profile data for offline use
                    setProfileData({ 
                        displayName: firebaseUser.displayName || 'Professor', 
                        email: firebaseUser.email, 
                        id: firebaseUser.uid, 
                        role: 'Offline Mode', 
                        photoURL: firebaseUser.photoURL 
                    });
                    setIsDataReady(true);
                }
            } else {
                // Not Logged In
                setIsLoggedIn(false); 
                setProfileData(null); 
                setIsDataReady(false); 
            }
            setIsLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);


    // -------------------------------------------------------------------------
    // 4. NAVIGATION & PROPS
    // -------------------------------------------------------------------------

    const handlePageChange = (page, params = {}) => { 
        setCurrentPage(page); 
        setPageParams(params);
        
        // Context saving for MultiPage Gradesheet
        if (page === 'multipage-gradesheet' && params.sectionData) {
            const sectionName = params.sectionData.name || params.sectionData.code || params.sectionData.title || params.title || 'Unknown Section';
            setCurrentSectionContext(sectionName);
        }
        
        // Context saving for Virtual Reports
        if (page === 'v-reports' && params.section) {
            setSelectedSection(params.section);
        }
    };
    
    // Callback for ViewStuds to refresh data after adding a student
    const refreshStudents = () => {
        if (profileData?.id || profileData?.uid) {
            fetchStudentsFromDB(profileData.id || profileData.uid);
        }
    };

    // Voice & Chatbot Helpers
    const handleGlobalSpeak = (text) => { 
        if (voiceRef.current) voiceRef.current.speak(text); 
    };
    
    const toggleVoice = () => { 
        setIsVoiceActive(prev => !prev); 
    };

    // -------------------------------------------------------------------------
    // 5. RENDER LOGIC
    // -------------------------------------------------------------------------

    const renderMainContent = () => {
        // Show Loading Screen until Auth & Data are ready
        if (isLoadingAuth || !profileData || !isDataReady) {
            return <LoadingAnimation isDataReady={isDataReady} />;
        }

        // Shared Props Bundle
        const commonProps = {
            onLogout: handleLogout,
            onPageChange: handlePageChange,
            profileData: profileData,
            sections: sections,
            students: students,
            attendanceData: attendanceData,
            isVoiceActive: isVoiceActive,
            onToggleVoice: toggleVoice,
            isOnline: isOnline
        };

        switch (currentPage) {
            case 'gradesheet': 
                return <Gradesheet {...commonProps} />;
            
            case 'multipage-gradesheet': 
                return <MultiPageGS 
                    {...commonProps}
                    onAttendanceUpdate={handleAttendanceUpdate}
                    onStudentDropped={handleStudentDropped} // 🚨 ADDED PROP
                    {...pageParams} // Passes title, viewType, etc.
                />;
            
            case 'view-studs': 
                return <ViewStuds 
                    {...commonProps}
                    sectionData={pageParams.sectionData} 
                    onRefreshStudents={refreshStudents}
                    professorUid={profileData.id || profileData.uid}
                />;
            
            case 'reports': 
                return <ReportsLayout {...commonProps} />;
            
            case 'v-reports': 
                return <VReports 
                    {...commonProps}
                    atRiskStudents={pageParams.atRiskStudents || []} 
                    allStudents={pageParams.allStudents || []} 
                    sectionData={pageParams.sectionData}
                />;
            
            case 'view-rd': 
                // FIXED: Ipinapasa ang targetStudentId na galing sa ViewStuds.jsx
                return <ViewRD 
                    {...commonProps}
                    targetStudentId={pageParams.targetStudentId} 
                />;
            
            case 'profile': 
                return <ProfileLayout 
                    {...commonProps}
                    onUpdateSections={setSections} 
                />; 
            
            case 'dashboard': 
            default: 
                return <Dashboard {...commonProps} />;
        }
    };

    // -------------------------------------------------------------------------
    // 6. FINAL RETURN
    // -------------------------------------------------------------------------

    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 {/* Status Bar for Sync/Offline */}
                 <div className={`status-bar ${!isOnline ? 'offline' : ''} ${isSyncing ? 'syncing' : ''}`}>
                     {!isOnline && "🔡 Offline Mode - Saving Locally"}
                     {isSyncing && "☁️ Internet Restored - Syncing to Cloud..."}
                   </div>

                 {/* Voice Logic Overlay (Invisible until active) */}
                 <VoiceControl 
                     ref={voiceRef} 
                     isVoiceActive={isVoiceActive} 
                     onToggle={setIsVoiceActive} 
                     onPageChange={handlePageChange} 
                   />
                   
                   {/* Main Application Area */}
                   {renderMainContent()}
                   
                 {/* Floating Chatbot */}
                 <CdmChatbot 
                     onPageChange={handlePageChange} 
                     professorUid={profileData?.id || profileData?.uid} 
                     onSpeak={handleGlobalSpeak}
                   /> 
                   
                 {/* 🚨 NEW MODAL RENDER 🚨 */}
                 <DroppedStudentModal 
                     student={droppedStudentAlert} 
                     onClose={() => setDroppedStudentAlert(null)} 
                 />
               </div>
        );
    } else {
        // If not logged in, decide between Landing Page or Login Form
        if (showLanding) {
            return <LandingPage onGetStarted={() => setShowLanding(false)} />;
        }
        
        return <div className="login-page-container"><LoginSignUp onLogin={()=>{}} /></div>;
    }
}

export default App;