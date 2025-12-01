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

import { auth } from './apiService'; 
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; 
import CdmChatbot from './Apps.jsx'; 

// --- VERSION IMPORT ---
import { APP_VERSION, BUILD_HASH, BUILD_DATE } from './meta'; // Import build info

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [pageParams, setPageParams] = useState({}); 

    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [profileData, setProfileData] = useState(null); 
    const [isDataReady, setIsDataReady] = useState(false); 

    useEffect(() => {
        // --- LOG BUILD VERSION ON STARTUP ---
        console.log(`%c Progress Tracker v${APP_VERSION} `, 'background: #38761d; color: white; padding: 4px; border-radius: 4px;');
        console.log(`Build: ${BUILD_HASH} | Date: ${BUILD_DATE}`);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log("Firebase User detected:", firebaseUser.email);
                setIsLoggedIn(true);
                
                // --- SYNC WITH MONGODB BACKEND ---
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

                    if (!response.ok) {
                        throw new Error('Failed to sync user with backend');
                    }

                    const mongoProfile = await response.json();
                    setProfileData({
                        ...mongoProfile,
                        id: mongoProfile.uid, 
                        displayName: mongoProfile.displayName,
                        photoURL: mongoProfile.photoURL || firebaseUser.photoURL
                    });
                    
                    setIsDataReady(true);

                } catch (error) {
                    console.error("Error fetching profile from MongoDB:", error);
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

    const handleLoginSuccess = () => {
        console.log("Login flow initiated.");
    };

    const handleLogout = async () => {
        try {
            await firebaseSignOut(auth);
            setProfileData(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const handlePageChange = (page, params = {}) => {
        setCurrentPage(page);
        setPageParams(params); 
    };

    const renderMainContent = () => {
        if (isLoadingAuth || !profileData || !isDataReady) {
             return <LoadingAnimation isDataReady={isDataReady} />;
        }

        switch (currentPage) {
            case 'gradesheet':
                return <Gradesheet onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'multipage-gradesheet':
                return (
                    <MultiPageGS 
                        onLogout={handleLogout} 
                        onPageChange={handlePageChange} 
                        viewType={pageParams.viewType || 'Attendance'} 
                        title={pageParams.title || 'Attendance'}
                        term={pageParams.term || ''}
                    />
                );
            case 'view-studs':
                return <ViewStuds onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'reports':
                return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'v-reports': 
                return <VReports onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'view-rd': 
                return <ViewRD onLogout={handleLogout} onPageChange={handlePageChange} studentData={pageParams.student} />;
            case 'profile':
                return <ProfileLayout onLogout={handleLogout} onPageChange={handlePageChange} profileData={profileData} />; 
            case 'dashboard':
            default:
                return <Dashboard onLogout={handleLogout} onPageChange={handlePageChange} profileData={profileData} />;
        }
    };

    const showChatbot = isLoggedIn && profileData && isDataReady;

    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
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