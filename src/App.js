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
import './App.css';

// --- NEW IMPORT ---
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

    // --- NEW: VOICE STATE (Lifted Up) ---
    const [isVoiceActive, setIsVoiceActive] = useState(false);

    useEffect(() => {
        // ... (Keep existing Version Log & Auth Logic exactly as it is) ...
        console.log(`%c Progress Tracker v${APP_VERSION} `, 'background: #38761d; color: white;');
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
             // ... (Existing Auth Logic) ...
             if (firebaseUser) {
                 setIsLoggedIn(true);
                 // ... (Keep your sync logic here) ...
                 setProfileData({ displayName: firebaseUser.displayName, email: firebaseUser.email, uid: firebaseUser.uid }); // Simplified for brevity
                 setIsDataReady(true);
             } else {
                 setIsLoggedIn(false);
                 setProfileData(null);
                 setIsDataReady(false);
             }
             setIsLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLoginSuccess = () => { console.log("Login flow initiated."); };

    const handleLogout = async () => {
        try {
            await firebaseSignOut(auth);
            setProfileData(null);
            setIsLoggedIn(false);
            setIsVoiceActive(false); // Turn off voice on logout
        } catch (error) { console.error("Error during logout:", error); }
    };

    const handlePageChange = (page, params = {}) => {
        setCurrentPage(page);
        setPageParams(params); 
    };

    // Helper to toggle voice (Passed to Dashboard)
    const toggleVoice = (status) => {
        setIsVoiceActive(status);
    };

    const renderMainContent = () => {
        if (isLoadingAuth || !profileData || !isDataReady) {
             return <LoadingAnimation isDataReady={isDataReady} />;
        }

        // --- PASS VOICE PROPS TO DASHBOARD ---
        const dashboardProps = {
            onLogout: handleLogout,
            onPageChange: handlePageChange,
            profileData: profileData,
            // Pass these down so Dashboard button works
            isVoiceActive: isVoiceActive,
            onToggleVoice: () => toggleVoice(!isVoiceActive) 
        };

        switch (currentPage) {
            case 'gradesheet': return <Gradesheet onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'multipage-gradesheet': return <MultiPageGS onLogout={handleLogout} onPageChange={handlePageChange} {...pageParams} />;
            case 'view-studs': return <ViewStuds onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'reports': return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'v-reports': return <VReports onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'view-rd': return <ViewRD onLogout={handleLogout} onPageChange={handlePageChange} studentData={pageParams.student} />;
            case 'profile': return <ProfileLayout onLogout={handleLogout} onPageChange={handlePageChange} profileData={profileData} />; 
            case 'dashboard': default: return <Dashboard {...dashboardProps} />; // Updated
        }
    };

    const showChatbot = isLoggedIn && profileData && isDataReady;

    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 {/* --- RENDER VOICE CONTROL GLOBALLY --- */}
                 {/* It sits here, so it never unmounts when MainContent changes */}
                 <VoiceControl 
                    isVoiceActive={isVoiceActive} 
                    onToggle={toggleVoice} 
                    onPageChange={handlePageChange} 
                 />

                 {renderMainContent()}
                 
                 {showChatbot && <CdmChatbot />} 
             </div>
        );
    } else {
        return (
            <div className="login-page-container">
                <LoginSignUp onLogin={handleLoginSuccess} />
            </div>
        );
    }
}

export default App;