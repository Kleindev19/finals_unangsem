// src/components/assets/LoadingAnimation/LoadingAnimation.jsx

import React from 'react';
import './LoadingAnimation.css'; 
import RunningProfessorGif from './runningman.gif'; 

// Accept the new prop: isDataReady
const LoadingAnimation = ({ isDataReady }) => { 
    // Conditional class to trigger the final animation state
    const professorClass = `running-professor-gif ${isDataReady ? 'exit-animation' : ''}`;
    const barClass = `loading-bar ${isDataReady ? 'fill-to-complete' : ''}`;
    
    return (
        <div className="loading-animation-screen">
            <div className="professor-container">
                <img 
                    src={RunningProfessorGif} 
                    alt="Professor running late" 
                    className={professorClass} // Use the conditional class
                /> 
            </div>
            <div className="loading-bar-container">
                <div className={barClass}></div> {/* Use the conditional class */}
            </div>
            <p className="loading-message">
                {/* Dynamically change message based on data status */}
                {isDataReady ? "Loading complete. Redirecting..." : "Pre-loading profile data and system assets..."}
            </p>
            <p className="late-message">
                {/* Dynamically change message based on data status */}
                {isDataReady ? "See you on the dashboard!" : "Wait a minute, I'm late for the dashboard!"}
            </p>
        </div>
    );
};

export default LoadingAnimation;