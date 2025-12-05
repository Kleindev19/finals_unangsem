// src/components/assets/Dashboard/Sidebar.jsx

import React, { useState, useEffect } from 'react'; 
import { auth } from '../../../apiService'; 
import { signOut } from 'firebase/auth';
import { LogoutModal, VersionModal } from './ModalComponents'; 
import { APP_VERSION, BUILD_HASH, BUILD_DATE } from '../../../meta';

// --- CONSTANTS ---
export const SIDEBAR_COLLAPSED_WIDTH = 80; 
export const SIDEBAR_EXPANDED_WIDTH = 280; 
export const SIDEBAR_DEFAULT_WIDTH = SIDEBAR_EXPANDED_WIDTH; 

// --- COLORS ---
export const PRIMARY_GREEN = '#2e6b18'; 
export const ACTIVE_ITEM_BG = 'rgba(255, 255, 255, 0.25)'; 
export const HOVER_ITEM_BG = 'rgba(0, 0, 0, 0.1)';

// --- INLINE ICONS ---
const GraduationCapLogo = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm1 12.09V19a4 4 0 0 1-8 0v-4.91l4 1.81 4-1.81z"/>
    </svg>
);

const MenuIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>);
const LayoutDashboardIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>);
const ReportsIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5a5.5 5.5 0 0 0-5.5 5.5v11.25a.75.75 0 0 0 1.5 0V8a4 4 0 0 1 4-4 4 4 0 0 1 4 4v11.25a.75.75 0 0 0 1.5 0V8a5.5 5.5 0 0 0-5.5-5.5Z"/><path d="M5 21a1 1 0 0 1-1-1v-6.07a7.96 7.96 0 0 1 2 .87V21H5ZM18 14.8c.63-.37 1.3-.66 2-.87V20a1 1 0 0 1-1 1h-1v-6.2Z"/></svg>);
const UserIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>);
const LogOutIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>);
const GitBranchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.6}}><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>);
const CodeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboardIcon, page: 'dashboard' },
    { name: 'Reports', icon: ReportsIcon, page: 'reports' },
    { name: 'Profile', icon: UserIcon, page: 'profile' },
    { name: 'Developers', icon: CodeIcon, page: 'tributes' },
];

export const Sidebar = ({ onLogout, onPageChange, currentPage, onWidthChange }) => { 
    const [isExpanded, setIsExpanded] = useState(true); 
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false); 

    useEffect(() => {
        if (onWidthChange) {
            onWidthChange(isExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH);
        }
    }, [isExpanded, onWidthChange]);

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        signOut(auth)
            .then(() => {
                setIsLogoutModalOpen(false); 
                onLogout(); 
            })
            .catch((error) => console.error("Logout Error:", error));
    };

    const toggleSidebar = () => setIsExpanded(!isExpanded);
    
    const NavLink = ({ item, isAction = false, onClick }) => {
        const isActive = item.page === currentPage && !isAction;
        const Icon = item.icon;

        return (
            <div 
                onClick={onClick ? onClick : () => onPageChange(item.page)}
                style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: isExpanded ? 'flex-start' : 'center',
                    padding: isExpanded ? '0.9rem 1.5rem' : '0.9rem 0.5rem', 
                    cursor: 'pointer',
                    marginBottom: '0.8rem',
                    transition: 'all 0.2s ease',
                    width: isExpanded ? '90%' : '100%',
                    marginLeft: isExpanded ? '5%' : '0',
                    boxSizing: 'border-box',
                    borderRadius: isExpanded ? '15px' : '0', 
                    backgroundColor: isActive ? ACTIVE_ITEM_BG : 'transparent',
                    boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.2)' : 'none',
                    border: isActive ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
                onMouseEnter={(e) => {
                    if(!isActive) e.currentTarget.style.backgroundColor = isActive ? ACTIVE_ITEM_BG : HOVER_ITEM_BG;
                }}
                onMouseLeave={(e) => {
                    if(!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginRight: isExpanded ? '1rem' : '0'
                }}>
                    <Icon style={{ 
                        width: '1.4rem', 
                        height: '1.4rem', 
                        color: 'white',
                        filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))'
                    }} />
                </div>

                {isExpanded && (
                    <span style={{ 
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.5px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                        {item.name}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0, left: 0, height: '100vh', zIndex: 50,
                width: isExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
                backgroundColor: PRIMARY_GREEN,
                backgroundImage: 'linear-gradient(180deg, #38761d 0%, #275214 100%)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
            }}
        >
            {/* HEADER */}
            <div style={{
                padding: '2rem 1.5rem 1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isExpanded ? 'flex-start' : 'center',
                gap: '1rem',
                borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
                <div style={{ 
                    width: '3rem', height: '3rem', 
                    backgroundColor: 'white', borderRadius: '10px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)', flexShrink: 0
                }}>
                    <GraduationCapLogo style={{ width: '1.8rem', height: '1.8rem', color: '#1a1a1a' }} />
                </div>

                {isExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem', lineHeight: '1.2', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                            Progress Tracker
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: '400' }}>
                            Professor Portal
                        </span>
                    </div>
                )}
            </div>

            {/* TOGGLE */}
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: isExpanded ? 'flex-start' : 'center' }}>
                <div onClick={toggleSidebar} style={{ cursor: 'pointer', color: 'white', opacity: 0.9, display: 'flex', alignItems: 'center' }}>
                    <MenuIcon style={{ width: '1.8rem', height: '1.8rem' }} />
                </div>
            </div>

            {/* NAV ITEMS */}
            <nav style={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1rem' }}>
                {navItems.map(item => <NavLink key={item.page} item={item} />)}
            </nav>

            {/* FOOTER SECTION (LOGOUT & VERSION) */}
            <div style={{
                marginTop: 'auto', width: '100%', 
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column',
                padding: '0', 
            }}>
                
                {/* 1. LOGOUT BUTTON */}
                <div style={{ width: '100%', padding: '0.5rem 0' }}>
                    <NavLink item={{ name: 'Logout', icon: LogOutIcon }} isAction={true} onClick={handleLogoutClick} />
                </div>

                {/* 2. VERSION INFO */}
                <div 
                    onClick={() => setIsVersionModalOpen(true)}
                    style={{
                        padding: '1rem',
                        display: 'flex', flexDirection: 'column',
                        alignItems: isExpanded ? 'flex-start' : 'center', justifyContent: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Click to view update history"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        <GitBranchIcon />
                        {isExpanded && <span>v{APP_VERSION}</span>}
                    </div>
                    
                    {isExpanded && (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', paddingLeft: '1.4rem' }}>
                            {BUILD_HASH} Build
                        </span>
                    )}
                </div>
            </div>

            {/* MODALS */}
            <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={confirmLogout} />
            <VersionModal 
                isOpen={isVersionModalOpen} 
                onClose={() => setIsVersionModalOpen(false)} 
                version={APP_VERSION} 
                hash={BUILD_HASH}
                date={BUILD_DATE}
            />

        </div>
    );
};

export { ReportsIcon };