// src/components/assets/Reports/ReportsLayout.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Reports from './Reports.jsx'; 
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar.jsx'; 

// --- ICONS ---
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

const ReportsLayout = ({ onLogout, onPageChange, sections = [], students = [], attendanceData = {}, isVoiceActive, onToggleVoice }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDesktopMode, setIsDesktopMode] = useState(window.innerWidth >= 1024);
    const [sidebarWidth, setSidebarWidth] = useState(isDesktopMode ? SIDEBAR_DEFAULT_WIDTH : 0);

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 1024;
            setIsDesktopMode(isDesktop);
            if (!isDesktop) {
                setSidebarWidth(0);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleWidthChange = (newWidth) => {
        if (isDesktopMode) {
            setSidebarWidth(newWidth);
        }
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
                currentPage={'reports'}
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
                                placeholder="Search reports..."
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
                        
                        <Bell style={{ width: '1.5rem', height: '1.5rem', color: '#4B5563', cursor: 'pointer' }} />
                        <HelpIcon style={{ width: '1.5rem', height: '1.5rem', color: '#4B5563', cursor: 'pointer' }} />
                    </div>
                </header>

                <Reports 
                    onPageChange={onPageChange} 
                    sections={sections} 
                    students={students}
                    attendanceData={attendanceData}
                    searchTerm={searchTerm} 
                />
            </main>
        </div>
    );
};

export default ReportsLayout;

ReportsLayout.propTypes = {
    onLogout: PropTypes.func,
    onPageChange: PropTypes.func,
    sections: PropTypes.array,
    students: PropTypes.array,
    attendanceData: PropTypes.object
};