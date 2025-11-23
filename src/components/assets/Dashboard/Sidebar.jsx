// src/components/assets/Dashboard/Sidebar.jsx

import React, { useState, useEffect, useRef } from 'react'; 
// NOTE: Adjust the path if your apiService is not three levels up
import { auth } from '../../../apiService'; 
import { signOut } from 'firebase/auth';

// --- CONSTANTS FOR SIDEBAR LOGIC ---
export const SIDEBAR_DEFAULT_WIDTH = 80; 
export const SIDEBAR_EXPANDED_WIDTH = 250; 
export const PRIMARY_GREEN = '#38761d'; 
export const HOVER_BG_GREEN = '#4a952d'; 
export const ACTIVE_BG_GREEN = '#275d13'; 
export const DEFAULT_TEXT_COLOR = 'white';
// ------------------------------------------

// --- INLINE SVG ICONS (Required by Sidebar) ---
const LayoutDashboardIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>);
export const BarChart3Icon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17v-4"/><path d="M8 17v-1"/></svg>);
const UserIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const ArrowRight = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboardIcon, page: 'dashboard' },
    { name: 'Reports', icon: BarChart3Icon, page: 'reports' }, 
    { name: 'Profile', icon: UserIcon, page: 'profile' },
];


export const Sidebar = ({ onLogout, onPageChange, currentPage, onWidthChange }) => { 
    // Simplified state: Removed isLockedExpanded
    const [isExpanded, setIsExpanded] = useState(false);
    
    // We keep timeoutRef for useEffect cleanup, but it's not used for collapse.
    const timeoutRef = useRef(null); 
    
    const currentWidth = isExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_DEFAULT_WIDTH;

    useEffect(() => {
        if (onWidthChange) {
            onWidthChange(currentWidth);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentWidth, onWidthChange]);

    // **handleNavigation is REMOVED to simplify logic**
    
    const handleFirebaseLogout = async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            onLogout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    
    // --- Helper Component for Navigation Link ---
    // Now takes onPageChange and setIsExpanded directly
    const NavLink = ({ item, isExpanded, currentPage, onPageChange, setIsExpanded }) => {
        const Icon = item.icon;
        const isActive = item.page === currentPage;
        
        const baseStyle = {
            display: 'flex', 
            alignItems: 'center', 
            padding: '0.75rem', 
            borderRadius: '0.5rem', 
            margin: '0.5rem 0',
            transition: 'all 0.3s ease', 
            color: DEFAULT_TEXT_COLOR, 
            background: isActive ? ACTIVE_BG_GREEN : 'transparent', 
            cursor: 'pointer',
            overflow: 'hidden', 
            whiteSpace: 'nowrap',
            flexShrink: 0
        };
        
        const handleMouseEnter = (e) => {
            if (!isActive) e.currentTarget.style.backgroundColor = HOVER_BG_GREEN;
        };
        
        const handleMouseLeave = (e) => {
            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
        };

        const handleClick = () => {
             // 1. 🔥 FORCE EXPANSION: This must happen first, every time.
             setIsExpanded(true); 

             // 2. NAVIGATE: Now change the page.
             onPageChange(item.page); 
        }

        return (
            <a
                href="#"
                onClick={handleClick} 
                style={baseStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                {isExpanded && ( 
                    <span style={{ marginLeft: '1rem', fontSize: '1rem', fontWeight: '500', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
                        {item.name}
                    </span>
                )}
            </a>
        );
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 50,
                width: currentWidth, 
                backgroundColor: PRIMARY_GREEN,
                padding: '1.5rem 1rem',
                boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
                transition: 'width 0.4s ease-in-out', 
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}
            // REMOVED onMouseEnter and onMouseLeave here
        >
            <div 
                style={{ 
                    marginBottom: '2rem', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    cursor: 'pointer' 
                }}
                // Added click handler to toggle sidebar when clicking the logo/header
                onClick={() => setIsExpanded(!isExpanded)} 
            >
                <span style={{ color: 'white', fontSize: isExpanded ? '1.5rem' : '1.2rem', fontWeight: 'bold', transition: 'font-size 0.3s ease' }}>
                    {isExpanded ? 'CDM Tracker' : 'CD'}
                </span>
            </div>

            <nav style={{ flexGrow: 1 }}>
                {navItems.map((item) => (
                    <NavLink 
                        key={item.page} 
                        item={item} 
                        isExpanded={isExpanded} 
                        currentPage={currentPage} 
                        onPageChange={onPageChange} // Pass directly
                        setIsExpanded={setIsExpanded} // Pass setter
                    />
                ))}
            </nav>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid ' + HOVER_BG_GREEN }}>
                <a
                    href="#"
                    onClick={handleFirebaseLogout}
                    style={{ 
                        display: 'flex', 
                        // ... (rest of styles)
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = HOVER_BG_GREEN;
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <ArrowRight style={{ width: '1.25rem', height: '1.25rem', transform: 'rotate(180deg)' }} />
                    {isExpanded && (
                         <span style={{ marginLeft: '1rem', fontSize: '1rem', fontWeight: '500' }}>Logout</span>
                    )}
                </a>
            </div>
        </div>
    );
};