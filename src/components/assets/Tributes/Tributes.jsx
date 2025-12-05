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
const INITIAL_TEAM_MEMBERS = [
    { name: "Jona Mae Obordo", role: "DOCUMENTATION", color: getRandomColor() },
    { name: "Josh Lander Ferrera", role: "FULL STACK DEVELOPER", color: getRandomColor() },
    { name: "Marvhenne Klein Ortega", role: "FULL STACK DEVELOPER", color: getRandomColor() },
    { name: "Edward Marcelino", role: "FULL STACK DEVELOPER", color: getRandomColor() },
    { name: "Jazon Williams Chang", role: "UI/FRONT END DEVELOPER", color: getRandomColor() },
    { name: "Marry Ann Nedia", role: "LEADER", color: getRandomColor() },
    { name: "Shamell", role: "DOCUMENTATION", color: getRandomColor() },
    { name: "Vhvancca Tablon", role: "UI/FRONT END", color: getRandomColor() },
];

const Tributes = ({ onLogout, onPageChange }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
    const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);
    const [uploadedImages, setUploadedImages] = useState({});
    
    // Resize logic
    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 1024;
            if (!isDesktop) setSidebarWidth(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load saved images from localStorage on mount
    useEffect(() => {
        const savedImages = localStorage.getItem('tributeImages');
        if (savedImages) {
            setUploadedImages(JSON.parse(savedImages));
        }
    }, []);

    // Handle image upload
    const handleImageUpload = (memberName, event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImages = {
                    ...uploadedImages,
                    [memberName]: e.target.result
                };
                setUploadedImages(newImages);
                localStorage.setItem('tributeImages', JSON.stringify(newImages));
            };
            reader.readAsDataURL(file);
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
                                <img 
                                    src={uploadedImages[member.name] || `https://ui-avatars.com/api/?name=${member.name}&background=${member.color.replace('#','')}&color=fff&size=128&bold=true`}
                                    alt={member.name} 
                                    className="trib-avatar"
                                />
                                
                                {/* Badge */}
                                <div className="trib-badge" style={{backgroundColor: member.color}}>
                                    <CodeIcon />
                                </div>

                                {/* Upload Button Overlay */}
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