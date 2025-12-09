// src/security/SecurityController.js

import { useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../apiService'; // Ensure this points to your firebase config

export const useSecurityController = (isLoggedIn, onLogout) => {
    const timeoutRef = useRef(null);

    // Helper: Get the timeout duration from settings (default 5 mins)
    const getTimeoutDuration = () => {
        try {
            const stored = localStorage.getItem('autoLogoutMinutes');
            const minutes = stored ? parseInt(stored, 10) : 5;
            // Convert minutes to milliseconds (e.g., 5 * 60 * 1000 = 300,000ms)
            return minutes * 60 * 1000; 
        } catch (error) {
            return 300000; // Default 5 mins safety fallback
        }
    };

    const handleIdle = () => {
        if (!isLoggedIn) return;

        console.warn("🛡️ SECURITY: User idle. Initiating auto-logout.");

        // Perform Firebase Logout
        signOut(auth).then(() => {
            // Set a specific flag so Landing Page knows why we logged out
            sessionStorage.setItem('logoutReason', 'idle');
            
            // Trigger the App.js logout state cleanup
            if (onLogout) onLogout();
        }).catch(err => console.error("Security Logout Error:", err));
    };

    useEffect(() => {
        // If not logged in, do nothing
        if (!isLoggedIn) return;

        let duration = getTimeoutDuration();
        console.log(`🛡️ Security Timer Active: ${duration / 60000} minutes`);

        const resetTimer = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(handleIdle, duration);
        };

        // Events that define "activity"
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'];
        
        // Add Listeners
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Start the initial timer
        resetTimer();

        // Listen for setting changes from Profile page (Custom Event)
        const handleSettingsUpdate = () => {
            console.log("🛡️ Security Settings Updated. Resetting timer.");
            duration = getTimeoutDuration(); // Refresh duration
            resetTimer(); // Restart timer with new duration
        };
        window.addEventListener('CDM_SETTINGS_UPDATE', handleSettingsUpdate);

        // Cleanup
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach(event => window.removeEventListener(event, resetTimer));
            window.removeEventListener('CDM_SETTINGS_UPDATE', handleSettingsUpdate);
        };
    }, [isLoggedIn, onLogout]);
};