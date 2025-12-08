// src/components/assets/Tributes/Tributes.jsx

import React, { useState, useEffect } from 'react';
import './Tributes.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';

// --- ICONS ---
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

// --- COLOR PALETTE FOR RANDOMIZATION ---
const COLORS = [
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#3B82F6", // Blue
    "#6366F1", // Indigo
    "#8B5CF6", // Violet
    "#9d48ecff", // Pink
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#F97316"  // Orange
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// --- TEAM DATA ---
// 🔑 CRITICAL FIX: The imageUrls below are SIMULATED public links 
// based on the image you provided. 
// YOU MUST REPLACE THESE WITH YOUR ACTUAL PUBLIC HOSTED URLs.

const INITIAL_TEAM_MEMBERS = [
    { 
        name: "Jona Mae Obordo", 
        role: "DOCUMENTATION", 
        color: getRandomColor(), 
        // 🚨 REPLACE THIS WITH YOUR REAL URL
        imageUrl: "https://your-server.com/images/jona-mae-obordo.png" 
    }, 
    { 
        name: "Josh Lander Ferrera", 
        role: "FULL STACK DEVELOPER", 
        color: getRandomColor(), 
        // 🚨 REPLACE THIS WITH YOUR REAL URL
        imageUrl: "https://your-server.com/images/josh-lander-ferrera.png" 
    },
    { 
        name: "Marvhenne Klein Ortega", 
        role: "FULL STACK DEVELOPER", 
        color: getRandomColor(), 
        // 🚨 REPLACE THIS WITH YOUR REAL URL
        imageUrl: "https://your-server.com/images/marvhenne-klein-ortega.png" 
    },
    { 
        name: "Edward Marcelino", 
        role: "FULL STACK DEVELOPER", 
        color: getRandomColor(), 
        // 🚨 REPLACE THIS WITH YOUR REAL URL
        imageUrl: "C:\Users\klein\Downloads\edward.jpg" 
    },
    { 
        name: "Jazon Williams Chang", 
        role: "UI/FRONT END DEVELOPER", 
        color: getRandomColor(), 
        // 🚨 REPLACE THIS WITH YOUR REAL URL
        imageUrl: "https://your-server.com/images/jazon-williams-chang.png" 
    },
    { 
        name: "Marry Ann Nedia", 
        role: "LEADER", 
        color: getRandomColor(), 
        // Marry Ann Nedia has a letter avatar in the original screenshot, 
        // so we'll leave it blank to use the UI Avatar fallback, 
        // but you can add a URL here later:
        imageUrl: "" 
    },
    { 
        name: "Shamell", 
        role: "DOCUMENTATION", 
        color: getRandomColor(), 
        // Shamell has a photo in the original screenshot.
        // 🚨 REPLACE THIS WITH YOUR REAL URL
        imageUrl: "https://your-server.com/images/shamell.png"
    },
    { 
        name: "Vhvancca Tablon", 
        role: "UI/FRONT END", 
        color: getRandomColor(), 
        // Vhvancca Tablon has a photo in the original screenshot.
        // 🚨 REPLACE THIS WITH YOUR REAL URL
        imageUrl: "https://your-server.com/images/vhvancca-tablon.png" 
    },
];

const Tributes = ({ onLogout, onPageChange }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
    // Use the INITIAL_TEAM_MEMBERS with the online URLs as the primary state
    const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);
    
    // Resize logic
    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 1024;
            if (!isDesktop) setSidebarWidth(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle image upload
    const handleImageUpload = (memberName, event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            
            // 🚨 CRITICAL CHANGE: This is where you must call your server-side API
            // to upload the 'file' and get a persistent public URL back.
            
            alert(`Placeholder: Image for ${memberName} selected. You need a server to complete the upload and save the permanent URL.`);
            
            // If the upload succeeds, the backend returns the public URL:
            /*
            const publicUrl = "URL_FROM_YOUR_SERVER_AFTER_UPLOAD";
            
            setTeamMembers(prevMembers => 
                prevMembers.map(m => m.name === memberName ? { ...m, imageUrl: publicUrl } : m)
            );
            */
        }
    };

    return (
        <div className="tributes-layout">
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange}
                currentPage="tributes"
                onWidthChange={setSidebarWidth} 
            />

            <main className="tributes-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* Header Section */}
                <div className="trib-header">
                    <div className="trib-title-box">
                        <CodeIcon /> 
                        <h1>Development Team</h1>
                    </div>
                    <p>Recognizing the brilliant minds behind the System Project.</p>
                </div>

                {/* Team Grid */}
                <div className="trib-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="trib-card">
                            <div className="trib-avatar-container">
                                {/* Avatar Image */}
                                {/* The src now prioritizes member.imageUrl (your online photo) */}
                                <img 
                                    src={member.imageUrl || `https://ui-avatars.com/api/?name=${member.name}&background=${member.color.replace('#','')}&color=fff&size=128&bold=true`}
                                    alt={member.name} 
                                    className="trib-avatar"
                                />
                                
                                {/* Badge */}
                                <div className="trib-badge" style={{backgroundColor: member.color}}>
                                    <CodeIcon />
                                </div>

                                {/* Upload Button Overlay (Kept for future server-side implementation) */}
                                <div 
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '110px',
                                        height: '110px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                        cursor: 'pointer',
                                    }}
                                    className="upload-overlay"
                                    onClick={() => document.getElementById(`upload-${index}`).click()}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}>
                                        <UploadIcon />
                                        <span style={{
                                            color: 'white',
                                            fontSize: '0.7rem',
                                            fontWeight: '600'
                                        }}>Upload</span>
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    id={`upload-${index}`}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(member.name, e)}
                                />
                            </div>
                            
                            <h3 className="trib-name">{member.name}</h3>
                            
                            <span 
                                className="trib-role" 
                                style={{
                                    color: member.color, 
                                    backgroundColor: `${member.color}15`,
                                    borderColor: `${member.color}40`
                                }}
                            >
                                {member.role}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer Quote */}
                <div className="trib-footer">
                    <p>"Individual commitment to a group effort — that is what makes a team work, a company work, a society work, a civilization work."</p>
                    <span>— Vince Lombardi</span>
                </div>

            </main>
        </div>
    );
};

export default Tributes;