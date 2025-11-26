// src/App.js

import React, { useState, useEffect } from 'react'; 
import Dashboard from './components/assets/Dashboard/Dashboard.jsx'; 
import LoginSignUp from './components/assets/Loginsignin/LoginSignUp.jsx';
import ReportsLayout from './components/assets/Reports/ReportsLayout.jsx'; 
import ProfileLayout from './components/assets/Profile/ProfileLayout.jsx'; 
import './App.css';

// --- NEW IMPORTS: Student List and Gradesheet ---
import ViewStuds from './components/assets/Dashboard/ViewStuds.jsx';
import Gradesheet from './components/assets/Dashboard/Gradesheet.jsx';
// ------------------------------------------------

// --- IMPORT: Loading Animation Component ---
import LoadingAnimation from './components/assets/LoadingAnimation/LoadingAnimation.jsx'; 

// --- IMPORTS for Profile Data Fetching in App.js ---
import { auth, db } from './apiService'; 
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore'; 
// ----------------------------------------------------

// --- Import the CdmChatbot component ---
import CdmChatbot from './Apps.jsx'; 
// --------------------------------------------

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default page
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [profileData, setProfileData] = useState(null); // Holds user profile/role/data
    const [isDataReady, setIsDataReady] = useState(false); // New state for loading animation

    // Constants for Firebase paths (using __app_id is MANDATORY)
    // eslint-disable-next-line no-undef
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; 

    // 1. Authentication and Profile Data Loading
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("User signed in:", user.uid);
                setIsLoggedIn(true);
                // Try to sign in with custom token if available
                // eslint-disable-next-line no-undef
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { 
                    try {
                        // eslint-disable-next-line no-undef
                        await auth.signInWithCustomToken(__initial_auth_token); 
                    } catch (error) {
                        console.error("Error signing in with custom token:", error);
                    }
                }
                
                // Fetch Profile Data
                const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        setProfileData(docSnap.data());
                        console.log("Profile data loaded.");
                    } else {
                        // Default profile structure if document doesn't exist
                        setProfileData({
                            fullName: user.email || 'CDM User',
                            email: user.email,
                            role: 'teacher', // Default role for testing
                        });
                        console.log("No profile data found, using defaults.");
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    setProfileData({
                        fullName: user.email || 'CDM User',
                        email: user.email,
                        role: 'teacher',
                    });
                }
                setIsDataReady(true); // Signal that data fetching is complete
            } else {
                console.log("No user signed in.");
                setIsLoggedIn(false);
                setProfileData(null);
                setIsDataReady(false); 
            }
            setIsLoadingAuth(false);
        });

        return () => unsubscribe();
    }, [appId]);

    // Handlers
    const handleLoginSuccess = () => {
        // Auth state listener handles setIsLoggedIn
        console.log("Login success reported to App.js. Waiting for onAuthStateChanged.");
    };

    const handleLogout = async () => {
        try {
            await firebaseSignOut(auth);
            console.log("User logged out successfully.");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Main Content Renderer
    const renderMainContent = () => {
        // Show loading screen until auth check and profile data is completed
        if (isLoadingAuth || !profileData || !isDataReady) {
             return <LoadingAnimation isDataReady={isDataReady} />;
        }

        switch (currentPage) {
            case 'gradesheet':
                return <Gradesheet onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'view-studs':
                return <ViewStuds onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'reports':
                return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'profile':
                // PASS PRE-LOADED DATA
                return <ProfileLayout 
                           onLogout={handleLogout} 
                           onPageChange={handlePageChange} 
                           profileData={profileData} 
                       />; 
            case 'dashboard':
            default:
                // Passing profileData here as well for dashboard greeting/display
                return <Dashboard onLogout={handleLogout} onPageChange={handlePageChange} profileData={profileData} />;
        }
    };

    // Conditional rendering for the chatbot: show only if logged in AND profile data is loaded.
    const showChatbot = isLoggedIn && profileData && isDataReady;

    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 {renderMainContent()}
                 {/* Renders the floating chatbot widget only when NOT on the loading screen */}
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