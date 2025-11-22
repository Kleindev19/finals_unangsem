// src/App.js

import React, { useState } from 'react';
import Dashboard from './components/assets/Dashboard/Dashboard.jsx'; 
import LoginSignUp from './components/assets/Loginsignin/LoginSignUp.jsx';
// --- UPDATED IMPORT: Using the ReportsLayout component for the shared layout ---
import ReportsLayout from './components/assets/Reports/ReportsLayout.jsx'; 
// -----------------------------
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State to track the current view
    const [currentPage, setCurrentPage] = useState('dashboard'); 

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('dashboard');
    };

    // Function to switch the main content view
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderMainContent = () => {
        switch (currentPage) {
            case 'reports':
                // Renders the Layout which contains the Sidebar and the Reports content
                return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'dashboard':
            default:
                // Renders Dashboard (which now uses the extracted Sidebar)
                return <Dashboard onLogout={handleLogout} onPageChange={handlePageChange} />;
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