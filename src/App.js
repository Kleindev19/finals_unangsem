// src/App.js

import React, { useState } from 'react';
import Dashboard from './components/assets//Dashboard/Dashboard.jsx'; 
import LoginSignUp from './components/assets/Loginsignin/LoginSignUp.jsx'; 
import './App.css'; 

const App = () => {
    // State: Sa simula, hindi naka-login (false)
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    // Function: Ito ang ipapasa sa LoginSignUp
    const handleLoginSuccess = () => {
        // Palitan ang state sa TRUE para mag-render ang Dashboard
        setIsLoggedIn(true); 
    };

    if (isLoggedIn) {
        // KUNG TRUE: Ipakita ang Dashboard UI
        return (
             <div className="dashboard-container">
                 {/* Dashboard.jsx content */}
                 <Dashboard /> 
             </div>
        );
    } else {
        // KUNG FALSE: Ipakita ang Login Form
        return (
            <div className="login-page-container">
                {/* Ipinapasa ang function bilang prop na 'onLogin' */}
                <LoginSignUp onLogin={handleLoginSuccess} /> 
            </div>
        );
    }
}

export default App;