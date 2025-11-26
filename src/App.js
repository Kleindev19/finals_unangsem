// src/App.js

import React, { useState, useEffect } from 'react'; 
import Dashboard from './components/assets/Dashboard/Dashboard.jsx'; 
import LoginSignUp from './components/assets/Loginsignin/LoginSignUp.jsx';
import ReportsLayout from './components/assets/Reports/ReportsLayout.jsx'; 
import ProfileLayout from './components/assets/Profile/ProfileLayout.jsx'; 
import ViewStuds from './components/assets/Dashboard/ViewStuds.jsx';
import Gradesheet from './components/assets/Dashboard/Gradesheet.jsx';
import MultiPageGS from './components/assets/Dashboard/MultiPageGS.jsx'; // <--- NEW IMPORT
import LoadingAnimation from './components/assets/LoadingAnimation/LoadingAnimation.jsx'; 
import './App.css';

import { auth, db } from './apiService'; 
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore'; 
import CdmChatbot from './Apps.jsx'; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    
    // --- NEW: State to hold parameters passed between pages ---
    const [pageParams, setPageParams] = useState({}); 
    // ----------------------------------------------------------

    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [profileData, setProfileData] = useState(null); 
    const [isDataReady, setIsDataReady] = useState(false); 

    // eslint-disable-next-line no-undef
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("User signed in:", user.uid);
                setIsLoggedIn(true);
                // eslint-disable-next-line no-undef
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { 
                    try {
                        // eslint-disable-next-line no-undef
                        await auth.signInWithCustomToken(__initial_auth_token); 
                    } catch (error) {
                        console.error("Error signing in with custom token:", error);
                    }
                }
                
                const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        setProfileData(docSnap.data());
                    } else {
                        setProfileData({
                            fullName: user.email || 'CDM User',
                            email: user.email,
                            role: 'teacher', 
                        });
                    }
                } catch (error) {
                    setProfileData({
                        fullName: user.email || 'CDM User',
                        email: user.email,
                        role: 'teacher',
                    });
                }
                setIsDataReady(true); 
            } else {
                setIsLoggedIn(false);
                setProfileData(null);
                setIsDataReady(false); 
            }
            setIsLoadingAuth(false);
        });

        return () => unsubscribe();
    }, [appId]);

    const handleLoginSuccess = () => {
        console.log("Login success reported to App.js.");
    };

    const handleLogout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // --- UPDATED: handlePageChange accepts optional params ---
    const handlePageChange = (page, params = {}) => {
        setCurrentPage(page);
        setPageParams(params); // Store the params (e.g., { viewType: 'Attendance' })
    };

    const renderMainContent = () => {
        if (isLoadingAuth || !profileData || !isDataReady) {
             return <LoadingAnimation isDataReady={isDataReady} />;
        }

        switch (currentPage) {
            case 'gradesheet':
                return <Gradesheet onLogout={handleLogout} onPageChange={handlePageChange} />;
            
            // --- NEW CASE ---
            case 'multipage-gradesheet':
                return (
                    <MultiPageGS 
                        onLogout={handleLogout} 
                        onPageChange={handlePageChange} 
                        viewType={pageParams.viewType || 'Attendance'} // Pass the param
                        title={pageParams.title || 'Attendance'}
                    />
                );
            // ----------------

            case 'view-studs':
                return <ViewStuds onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'reports':
                return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'profile':
                return <ProfileLayout 
                           onLogout={handleLogout} 
                           onPageChange={handlePageChange} 
                           profileData={profileData} 
                       />; 
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