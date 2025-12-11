// src/App.js

import React, { useState, useEffect, useRef } from 'react'; 
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
import './App.css';

// --- UPDATED IMPORT PATH FOR LANDING PAGE ---
import LandingPage from './components/assets/Loginsignin/LandingPage.jsx'; 

import VoiceControl from './components/assets/Dashboard/VoiceControl.jsx';
import { auth } from './apiService'; 
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; 
import CdmChatbot from './Apps.jsx'; 

import meta from './meta.json'; 
const { APP_VERSION, BUILD_HASH, BUILD_DATE } = meta; 

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // --- STATE: Controls if Landing Page is visible ---
    const [showLanding, setShowLanding] = useState(true);

    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [pageParams, setPageParams] = useState({}); 

    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [profileData, setProfileData] = useState(null); 
    const [isDataReady, setIsDataReady] = useState(false); 
    
    // --- GLOBAL VOICE STATE ---
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    // Ref to access the VoiceControl's speak function
    const voiceRef = useRef(null);

    const handleGlobalSpeak = (text) => {
        if (voiceRef.current) {
            voiceRef.current.speak(text);
        }
    };

    const toggleVoice = () => {
        setIsVoiceActive(prev => !prev);
    };

    // --- OFFLINE/SYNC STATUS ---
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    // --- LOAD FROM LOCALSTORAGE ON MOUNT ---
    const loadFromStorage = (key, defaultValue) => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return defaultValue;
        }
    };

    // --- SHARED SECTIONS STATE (LOAD FROM LOCALSTORAGE) ---
    const [sections, setSections] = useState(() => loadFromStorage('cdm_sections', []));
    
    // --- SHARED STUDENTS STATE (LOAD FROM DATABASE) ---
    const [students, setStudents] = useState([]);

    // ========== ATTENDANCE TRACKING FOR AT-RISK STUDENTS ==========
    const [attendanceData, setAttendanceData] = useState({});
    const [atRiskStudents, setAtRiskStudents] = useState({});
    const [currentSectionContext, setCurrentSectionContext] = useState('');
    const [selectedSection, setSelectedSection] = useState('CS 101 - A');
    
    // 🚨 NEW STATE: Dropped Student Alert 🚨
    const [droppedStudentAlert, setDroppedStudentAlert] = useState(null); 

    // Track at-risk students whenever attendance changes
    useEffect(() => {
        const atRiskMap = {};
        
        students.forEach(student => {
            const studentAttendance = attendanceData[student.id] || [];
            const absences = studentAttendance.filter(status => status === 'A').length;
            
            // If student has 3 or more absences, mark as at-risk
            if (absences >= 3) {
                // Use currentSectionContext to group students by the section they're viewing
                const section = currentSectionContext || 'CS 101 - A';
                
                if (!atRiskMap[section]) {
                    atRiskMap[section] = [];
                }
                atRiskMap[section].push({
                    id: student.id,
                    name: student.name,
                    avatar: `https://ui-avatars.com/api/?name=${student.name}&background=random`,
                    gpa: 2.1,
                    attendance: Math.round((1 - absences/20) * 100) + '%',
                    missed: absences,
                    status: absences >= 10 ? 'High Risk' : 'Medium Risk'
                });
            }
        });
        
        setAtRiskStudents(atRiskMap);
    }, [attendanceData, students, currentSectionContext]);

    // Handler for attendance updates from MultiPageGS
    const handleAttendanceUpdate = (updatedData) => {
        setAttendanceData(updatedData);
    };

    // 🚨 NEW HANDLER: For student dropped alert 🚨
    const handleStudentDropped = (studentDetails) => {
        setDroppedStudentAlert(studentDetails);
    };

    // --- AUTO-SYNC LISTENER ---
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            triggerAutoSync(); // Call sync when internet returns
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
            // Keep the blue badge for 2 seconds so the user sees it
            setTimeout(() => setIsSyncing(false), 2000);
        }
    };

    // --- FETCH STUDENTS FROM DATABASE ---
    const fetchStudentsFromDB = async (professorUid) => {
        try {
            const response = await fetch(`http://localhost:5000/api/students/${professorUid}/All Sections`);
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            // Don't clear students on error if we are offline, keep current state if possible
            if (isOnline) setStudents([]); 
        }
    };

    // --- SAVE SECTIONS TO LOCALSTORAGE WHENEVER IT CHANGES ---
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
                setShowLanding(false); // Hide landing page if user is already logged in
                try {
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
                    setProfileData({ ...mongoProfile, id: mongoProfile.uid, displayName: mongoProfile.displayName, photoURL: mongoProfile.photoURL || firebaseUser.photoURL });
                    
                    // --- FETCH STUDENTS FROM DATABASE ---
                    await fetchStudentsFromDB(firebaseUser.uid);
                    
                    setIsDataReady(true);
                } catch (error) {
                    console.warn("⚠️ Offline Mode Detected during login.");
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
                setIsLoggedIn(false); 
                setProfileData(null); 
                setIsDataReady(false); 
            }
            setIsLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try { 
            await firebaseSignOut(auth); 
            setProfileData(null); 
            setIsLoggedIn(false); 
            setIsVoiceActive(false);
            setStudents([]);
            setShowLanding(true); // Return to Landing Page on Logout
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handlePageChange = (page, params = {}) => { 
        setCurrentPage(page); 
        setPageParams(params);
        
        // When navigating to multipage-gradesheet, save the section context
        if (page === 'multipage-gradesheet' && params.sectionData) {
            const sectionName = params.sectionData.name || params.sectionData.code || params.sectionData.title || params.title || 'Unknown Section';
            setCurrentSectionContext(sectionName);
        }
        
        // When navigating to v-reports, save which section to display
        if (page === 'v-reports' && params.section) {
            setSelectedSection(params.section);
        }
    };
    
    // --- REFRESH STUDENTS FUNCTION (for ViewStuds to call after adding) ---
    const refreshStudents = () => {
        if (profileData?.id || profileData?.uid) {
            fetchStudentsFromDB(profileData.id || profileData.uid);
        }
    };

    const renderMainContent = () => {
        if (isLoadingAuth || !profileData || !isDataReady) return <LoadingAnimation isDataReady={isDataReady} />;

        const dashboardProps = {
            onLogout: handleLogout,
            onPageChange: handlePageChange,
            profileData: profileData,
            sections: sections,
            students: students,
            isOnline: isOnline,
            // VOICE PROPS
            isVoiceActive: isVoiceActive,
            onToggleVoice: toggleVoice
        };

        const profileProps = {
            onLogout: handleLogout,
            onPageChange: handlePageChange,
            profileData: profileData,
            sections: sections, 
            onUpdateSections: setSections,
            // VOICE PROPS
            isVoiceActive: isVoiceActive,
            onToggleVoice: toggleVoice
        };

        const reportsProps = {
            onLogout: handleLogout, 
            onPageChange: handlePageChange, 
            sections: sections, 
            students: students,
            attendanceData: attendanceData,
            // VOICE PROPS
            isVoiceActive: isVoiceActive,
            onToggleVoice: toggleVoice
        };

        switch (currentPage) {
            case 'gradesheet': 
                return <Gradesheet onLogout={handleLogout} onPageChange={handlePageChange} />;
            
            case 'multipage-gradesheet': 
                return <MultiPageGS 
                    onLogout={handleLogout} 
                    onPageChange={handlePageChange} 
                    onAttendanceUpdate={handleAttendanceUpdate}
                    students={students} 
                    onStudentDropped={handleStudentDropped} // 🚨 ADDED PROP
                    {...pageParams} // Passes title, viewType, etc.
                />;
            
            case 'view-studs': 
                return <ViewStuds 
                    onLogout={handleLogout} 
                    onPageChange={handlePageChange} 
                    sectionData={pageParams.sectionData} 
                    students={students} 
                    onRefreshStudents={refreshStudents}
                    professorUid={profileData.id || profileData.uid}
                />;
            
            case 'reports': 
                return <ReportsLayout {...reportsProps} />;
            
            case 'v-reports': 
                return <VReports 
                    onLogout={handleLogout} 
                    onPageChange={handlePageChange} 
                    atRiskStudents={pageParams.atRiskStudents || []} 
                    allStudents={pageParams.allStudents || []} 
                    sectionData={pageParams.sectionData}
                />;
            
            case 'view-rd': 
                // FIXED: Ipinapasa ang targetStudentId na galing sa ViewStuds.jsx
                return <ViewRD 
                    onLogout={handleLogout} 
                    onPageChange={handlePageChange}
                    targetStudentId={pageParams.targetStudentId} 
                />;
            
            case 'profile': 
                return <ProfileLayout {...profileProps} />; 
            
            // The case 'tributes' is now REMOVED
            
            case 'dashboard': 
            default: 
                return <Dashboard {...dashboardProps} />;
        }
    };

    // --- MAIN RENDER LOGIC ---
    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 <div className={`status-bar ${!isOnline ? 'offline' : ''} ${isSyncing ? 'syncing' : ''}`}>
                     {!isOnline && "🔡 Offline Mode - Saving Locally"}
                     {isSyncing && "☁️ Internet Restored - Syncing to Cloud..."}
                   </div>
                    
                 {/* LOGIC OVERLAY (Pass ref here) */}
                 <VoiceControl 
                     ref={voiceRef} 
                     isVoiceActive={isVoiceActive} 
                     onToggle={setIsVoiceActive} 
                     onPageChange={handlePageChange} 
                   />
                   
                   {renderMainContent()}
                   
                 {/* CHATBOT (Pass handleGlobalSpeak) */}
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
        // --- SHOW LANDING PAGE FIRST, THEN LOGIN ---
        if (showLanding) {
            return <LandingPage onGetStarted={() => setShowLanding(false)} />;
        }
        
        return <div className="login-page-container"><LoginSignUp onLogin={()=>{}} /></div>;
    }
}

export default App;