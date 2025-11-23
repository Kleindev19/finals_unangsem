// src/App.js

import React, { useState, useEffect } from 'react'; 
import Dashboard from './components/assets/Dashboard/Dashboard.jsx'; 
import LoginSignUp from './components/assets/Loginsignin/LoginSignUp.jsx';
import ReportsLayout from './components/assets/Reports/ReportsLayout.jsx'; 
import ProfileLayout from './components/assets/Profile/ProfileLayout.jsx'; 
import './App.css';

// --- IMPORTS for Profile Data Fetching in App.js ---
import { auth, db } from './apiService'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
// ----------------------------------------------------

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State to track the current view
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    // State to store pre-loaded profile data (null initially to indicate loading)
    const [profileData, setProfileData] = useState(null); 

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setProfileData(null); // Clear data on logout
        setCurrentPage('dashboard');
    };

    // --- EFFECT: Fetch user profile data once upon successful login (Data Pre-loading) ---
    useEffect(() => {
        if (!isLoggedIn) return;

        // Listener for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // Only fetch if a user is logged in and profile data hasn't been fetched yet
            if (user && !profileData) { 
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    // Determine the photo URL, using Firebase Auth's photoURL if available
                    const photoURL = user.photoURL || null; 
                    
                    // --- DEBUG LOG: Crucial for diagnosing the photo issue ---
                    console.log("--- Profile Data Fetch Debug ---");
                    console.log("Firebase User Photo URL:", user.photoURL);
                    console.log("Is photoURL null/empty:", !photoURL);
                    console.log("----------------------------------");
                    // --------------------------------------------------------

                    const data = docSnap.exists() ? docSnap.data() : {};
                    
                    setProfileData({
                        uid: user.uid,
                        displayName: user.displayName || data.fullName || 'User Name',
                        email: user.email,
                        role: data.role || 'Administrator',
                        photoURL: photoURL, // Added: Photo URL from Firebase Auth
                        stats: data.stats || {
                            reportsGenerated: 45, 
                            totalSystemUsers: 540,
                            activeSectionsManaged: 12
                        },
                        id: data.employeeId || `SCH-${user.uid.substring(0, 5).toUpperCase()}` 
                    });
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    setProfileData({
                        uid: auth.currentUser?.uid || 'N/A',
                        displayName: auth.currentUser?.displayName || 'Error User',
                        email: auth.currentUser?.email || 'N/A',
                        role: 'User',
                        photoURL: null,
                        stats: { reportsGenerated: 0, totalSystemUsers: 0, activeSectionsManaged: 0 },
                        id: 'SCH-0000'
                    });
                }
            }
            // Set initial page once login and initial data load attempt is complete
            setCurrentPage('dashboard');
        });

        return () => unsubscribe();
    }, [isLoggedIn, profileData]);
    // ---------------------------------------------------------------------

    // Function to switch the main content view
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderMainContent = () => {
        // Show Loading Indicator while initial data loads
        if (isLoggedIn && !profileData) {
             return <div style={{padding: '50px', textAlign: 'center', fontSize: '1.5rem', fontFamily: 'Inter'}}>Loading Dashboard and Profile Data...</div>;
        }

        switch (currentPage) {
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


    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 {renderMainContent()}
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