// src/components/assets/Profile/ProfileLayout.jsx

import React, { useState, useEffect } from 'react';
import Profile from './Profile.jsx'; // Import the new Profile component
// --- UPDATED IMPORT: Use the extracted Sidebar component and its constants ---
import { 
    Sidebar, 
    SIDEBAR_DEFAULT_WIDTH, 
} from '../Dashboard/Sidebar.jsx'; // Path adjusted based on Dashboard/Sidebar location
// ----------------------------------------------------

// Import icons needed for the header (copied from ReportsLayout/Dashboard)
const Menu = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const Bell = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);
const User = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);


const ProfileLayout = ({ onLogout, onPageChange, profileData }) => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isDesktopMode, setIsDesktopMode] = useState(window.innerWidth >= 768);
    const [sidebarWidth, setSidebarWidth] = useState(isDesktopMode ? SIDEBAR_DEFAULT_WIDTH : 0);
    
    // Helper for applying width change from Sidebar
    const handleWidthChange = (newWidth) => {
        if (isDesktopMode) {
            setSidebarWidth(newWidth);
        }
    };


    const checkScreenSize = () => {
        const desktop = window.innerWidth >= 768;
        setIsDesktopMode(desktop);
        // Reset sidebar width based on new mode
        setSidebarWidth(desktop ? SIDEBAR_DEFAULT_WIDTH : 0);
        // Hide overlay/sidebar if resizing to desktop
        if (desktop) {
             setIsSidebarVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', checkScreenSize);
        // Initialize sidebar width on mount
        setSidebarWidth(isDesktopMode ? SIDEBAR_DEFAULT_WIDTH : 0);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [isDesktopMode]);


    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#F9FAFB', 
            fontFamily: 'Inter', // <--- ADDED FONT FAMILY for consistency
            position: 'relative' 
        }}>

            {/* Mobile Backdrop */}
            {!isDesktopMode && isSidebarVisible && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'black', opacity: 0.5, zIndex: 40 }}
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar Container */}
            {(isDesktopMode || isSidebarVisible) && ( 
                <div style={{ 
                    position: 'fixed',
                    height: '100%', 
                    zIndex: 50,
                    // Mobile slide-in animation
                    transform: isDesktopMode ? 'translateX(0)' : `translateX(${isSidebarVisible ? '0' : '-100%'})`,
                    transition: 'transform 0.3s ease-in-out' 
                }}>
                    <Sidebar 
                        onLogout={onLogout} 
                        onPageChange={onPageChange} 
                        currentPage="profile" // Set currentPage to 'profile'
                        onWidthChange={handleWidthChange} // Pass the handler
                    />
                </div>
            )}

            {/* Main Content Area (Header + Profile) */}
            <div 
                style={{ 
                    flexGrow: 1,
                    minHeight: '100vh',
                    // Dynamic margin-left for desktop mode
                    marginLeft: sidebarWidth, 
                    transition: 'margin-left 0.3s ease-in-out',
                    width: `calc(100% - ${sidebarWidth}px)`,
                    boxSizing: 'border-box'
                }}
            >
                {/* Fixed Header */}
                <header
                    style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#ffffff',
                        zIndex: 30,
                        padding: '1rem 2rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {!isDesktopMode && (
                        <button 
                            onClick={toggleSidebar} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                        >
                            <Menu style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                    )}

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: isDesktopMode ? '40rem' : '100%' }}>
                        <Search style={{ position: 'absolute', left: '1rem', width: '1rem', height: '1rem', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Search settings, profile details..."
                            style={{ paddingLeft: '2.5rem', paddingRight: '1rem', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', width: '100%', fontSize: '0.875rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', minWidth: isDesktopMode ? 'auto' : '3.5rem' }}>
                        <Bell style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} />
                        <User style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} onClick={() => onPageChange('profile')} />
                    </div>
                </header>

                {/* RENDER THE PROFILE PAGE CONTENT */}
                <Profile profileData={profileData} /> {/* <-- PASS DATA TO PROFILE */}
            </div>
        </div>
    );
};

export default ProfileLayout;