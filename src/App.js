// src/App.js

import React, { useState, useEffect } from 'react'; 
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
import Tributes from './components/assets/Tributes/Tributes.jsx'; 
import './App.css';

import VoiceControl from './components/assets/Dashboard/VoiceControl.jsx';
import { auth } from './apiService'; 
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; 
import CdmChatbot from './Apps.jsx'; 
import { APP_VERSION, BUILD_HASH, BUILD_DATE } from './meta'; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [pageParams, setPageParams] = useState({}); 

    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [profileData, setProfileData] = useState(null); 
    const [isDataReady, setIsDataReady] = useState(false); 
    const [isVoiceActive, setIsVoiceActive] = useState(false);

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

    // --- FETCH STUDENTS FROM DATABASE ---
    const fetchStudentsFromDB = async (professorUid) => {
        try {
            const response = await fetch(`http://localhost:5000/api/students/${professorUid}/All Sections`);
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data);
            console.log('✅ Students loaded from database:', data.length);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
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

    useEffect(() => {
        console.log(`%c Progress Tracker v${APP_VERSION} `, 'background: #38761d; color: white; padding: 4px; border-radius: 4px;');
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setIsLoggedIn(true);
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
                    setProfileData({ displayName: firebaseUser.displayName || 'Professor', email: firebaseUser.email, id: firebaseUser.uid, role: 'Offline Mode', photoURL: firebaseUser.photoURL });
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
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handlePageChange = (page, params = {}) => { 
        setCurrentPage(page); 
        setPageParams(params); 
    };
    
    const toggleVoice = (status) => setIsVoiceActive(status);

    // --- REFRESH STUDENTS FUNCTION (for ViewStuds to call after adding) ---
    const refreshStudents = () => {
        if (profileData?.uid) {
            fetchStudentsFromDB(profileData.uid);
        }
    };

    const renderMainContent = () => {
        if (isLoadingAuth || !profileData || !isDataReady) return <LoadingAnimation isDataReady={isDataReady} />;

        const dashboardProps = {
            onLogout: handleLogout,
            onPageChange: handlePageChange,
            profileData: profileData,
            isVoiceActive: isVoiceActive,
            onToggleVoice: () => toggleVoice(!isVoiceActive),
            sections: sections,
            students: students
        };

        const profileProps = {
            onLogout: handleLogout,
            onPageChange: handlePageChange,
            profileData: profileData,
            sections: sections, 
            onUpdateSections: setSections 
        };

        switch (currentPage) {
            case 'gradesheet': 
                return <Gradesheet onLogout={handleLogout} onPageChange={handlePageChange} />;
            
            case 'multipage-gradesheet': 
                return <MultiPageGS onLogout={handleLogout} onPageChange={handlePageChange} {...pageParams} />;
            
            case 'view-studs': 
                return <ViewStuds 
                    onLogout={handleLogout} 
                    onPageChange={handlePageChange} 
                    sectionData={pageParams.sectionData} 
                    students={students} 
                    onRefreshStudents={refreshStudents}
                    professorUid={profileData.uid}
                />;
            
            case 'reports': 
                return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            
            case 'v-reports': 
                return <VReports onLogout={handleLogout} onPageChange={handlePageChange} />;
            
            case 'view-rd': 
                return <ViewRD onLogout={handleLogout} onPageChange={handlePageChange} studentData={pageParams.student} />;
            
            case 'profile': 
                return <ProfileLayout {...profileProps} />; 
            
            case 'tributes': 
                return <Tributes onLogout={handleLogout} onPageChange={handlePageChange} />;
            
            case 'dashboard': 
            default: 
                return <Dashboard {...dashboardProps} />;
        }
    };

    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 <VoiceControl isVoiceActive={isVoiceActive} onToggle={toggleVoice} onPageChange={handlePageChange} />
                 {renderMainContent()}
                 <CdmChatbot onPageChange={handlePageChange} /> 
             </div>
        );
    } else {
        return <div className="login-page-container"><LoginSignUp onLogin={()=>{}} /></div>;
    }
}

export default App;