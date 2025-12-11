// src/components/assets/Profile/ProfileLayout.jsx

import React, { useState, useEffect } from 'react';
import Profile from './Profile.jsx';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar.jsx'; 
import { NotificationModal, CreditsModal } from '../Dashboard/ModalComponents.jsx'; // CreditsModal used here
// Import AboutUsModal and team member data for the modal's prop
import AboutUsModal from '../Dashboard/AboutUsModal.jsx'; 
import MarryAnnNedia from '../Dashboard/Marry Ann Nedia.jpg'; 
import JoshLanderFerrera from '../Dashboard/Josh Lander Ferrera.jpg'; 
import MarvhenneKleinOrtega from '../Dashboard/Marvhenne Klein Ortega.jpg'; 
import EdwardMarcelino from '../Dashboard/Edward Marcelino.jpg'; 
import VhyanccaTablon from '../Dashboard/Vhyancca Tablon.jpg'; 
import JazonWilliamsChang from '../Dashboard/Jazon Williams Chang.jpg'; 
import JonaMaeObordo from '../Dashboard/Jona Mae Obordo.jpg'; 
import ShamellPerante from '../Dashboard/Shamell Perante.jpg'; 


// --- ICONS (unchanged) ---
const Mic = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>);
const Menu = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const HelpIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);
const Bell = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);

// --- TEAM DATA (Re-defined for AboutUsModal prop) ---
const COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#9d48ecff", "#EF4444", "#06B6D4", "#F97316"];
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const INITIAL_TEAM_MEMBERS = [
    { name: "Marry Ann Nedia", role: "PROJECT LEADER", color: getRandomColor(), imageUrl: MarryAnnNedia },
    { name: "Josh Lander Ferrera", role: "FULL STACK DEVELOPER", color: getRandomColor(), imageUrl: JoshLanderFerrera },
    { name: "Marvhenne Klein Ortega", role: "FULL STACK DEVELOPER", color: getRandomColor(), imageUrl: MarvhenneKleinOrtega },
    { name: "Edward Marcelino", role: "FULL STACK DEVELOPER", color: getRandomColor(), imageUrl: EdwardMarcelino },
    { name: "Vhyancca Tablon", role: "UI/FRONT-END DEVELOPER", color: getRandomColor(), imageUrl: VhyanccaTablon }, 
    { name: "Jazon Williams Chang", role: "UI/FRONT-END DEVELOPER", color: getRandomColor(), imageUrl: JazonWilliamsChang },
    { name: "Jona Mae Obordo", role: "DOCUMENTATION", color: getRandomColor(), imageUrl: JonaMaeObordo }, 
    { name: "Shamell Perante", role: "DOCUMENTATION", color: getRandomColor(), imageUrl: ShamellPerante }, 
];


// Accepts voice props
const ProfileLayout = ({ onLogout, onPageChange, profileData, sections, onUpdateSections, isVoiceActive, onToggleVoice }) => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [isDesktopMode, setIsDesktopMode] = useState(window.innerWidth >= 1024);
    const [sidebarWidth, setSidebarWidth] = useState(isDesktopMode ? SIDEBAR_DEFAULT_WIDTH : 0);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    // NEW STATE for About Us Modal
    const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
    
    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 1024;
            setIsDesktopMode(isDesktop);
            if (!isDesktop) setSidebarWidth(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleWidthChange = (newWidth) => {
        if (isDesktopMode) setSidebarWidth(newWidth);
    };

    const handleOpenNotifications = () => {
        setIsNotificationModalOpen(true);
    };
    
    // Handler to open the About Us Modal
    const handleOpenAboutUs = () => {
        setIsAboutUsOpen(true);
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            backgroundColor: '#FDFDF5', 
            fontFamily: 'Inter, sans-serif'
        }}>
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange} 
                currentPage="profile"
                onWidthChange={handleWidthChange}
            />

            <main style={{ 
                flexGrow: 1, 
                padding: isDesktopMode ? '1.5rem 2rem' : '1rem',
                marginLeft: isDesktopMode ? sidebarWidth : 0,
                transition: 'margin-left 0.3s ease-in-out',
                width: `calc(100% - ${isDesktopMode ? sidebarWidth : 0}px)`
            }}>
                
                {/* Header */}
                <header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '2rem', 
                    flexWrap: 'wrap',
                    gap: '1rem',
                    backgroundColor: 'transparent'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: isDesktopMode ? 'auto' : '100%', flexGrow: 1, maxWidth: '600px' }}>
                        {!isDesktopMode && (
                            <button style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
                                <Menu style={{ width: '1.5rem', height: '1.5rem' }} />
                            </button>
                        )}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Search style={{ position: 'absolute', left: '1rem', width: '1.2rem', height: '1.2rem', color: '#9CA3AF' }} />
                            <input
                                type="text"
                                placeholder="Search settings..."
                                style={{ 
                                    paddingLeft: '3rem', 
                                    paddingRight: '1rem', 
                                    paddingTop: '0.75rem', 
                                    paddingBottom: '0.75rem', 
                                    border: '1px solid #E5E7EB', 
                                    borderRadius: '8px', 
                                    width: '100%', 
                                    fontSize: '0.95rem',
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {/* SMART MIC BUTTON */}
                        <button 
                            onClick={onToggleVoice} 
                            className={isVoiceActive ? 'mic-btn-active' : ''} 
                            style={{ 
                                background: 'none', border: 'none', padding: '5px', cursor: 'pointer', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                transition: 'all 0.3s ease' 
                            }} 
                            title={isVoiceActive ? "Listening..." : "Activate Voice Command"}
                        >
                            <Mic style={{ width: '1.5rem', height: '1.5rem', color: isVoiceActive ? 'inherit' : '#4B5563' }} />
                        </button>

                        {/* Bell Icon connected to Notification Modal */}
                        <Bell 
                            style={{ width: '1.5rem', height: '1.5rem', color: '#4B5563', cursor: 'pointer' }} 
                            onClick={handleOpenNotifications}
                        />
                        {/* Help Icon connected to About Us Modal */}
                        <HelpIcon 
                            style={{ width: '1.5rem', height: '1.5rem', color: '#4B5563', cursor: 'pointer' }} 
                            title="Help Center / About Us" 
                            onClick={handleOpenAboutUs}
                        />
                    </div>
                </header>

                {/* Pass props down to Profile */}
                <Profile 
                    profileData={profileData} 
                    sections={sections} 
                    onUpdateSections={onUpdateSections} 
                /> 
            </main>

            {/* Render Notification Modal */}
            <NotificationModal 
                isOpen={isNotificationModalOpen} 
                onClose={() => setIsNotificationModalOpen(false)} 
            />
            {/* Render About Us Modal */}
            {isAboutUsOpen && (
                <AboutUsModal 
                    onClose={() => setIsAboutUsOpen(false)} 
                    teamMembers={INITIAL_TEAM_MEMBERS} // Pass the team data
                />
            )}
        </div>
    );
};

export default ProfileLayout;