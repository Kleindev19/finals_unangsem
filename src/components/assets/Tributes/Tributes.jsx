// src/components/assets/Tributes/Tributes.jsx

import React, { useState, useEffect } from 'react';
import './Tributes.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';

// --- ICONS ---
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

// --- TEAM DATA ---
const TEAM_MEMBERS = [
    { name: "Jona Mae Obordo", role: "Group Creator / Leader", color: "#F59E0B" }, // Gold
    { name: "Josh Lander Ferrera", role: "Lead Developer", color: "#10B981" }, // Green
    { name: "Marvhenne Klein Ortega", role: "Developer", color: "#3B82F6" }, // Blue
    { name: "Edward Marcelino", role: "Developer", color: "#3B82F6" },
    { name: "Jazon Williams Chang", role: "Developer", color: "#3B82F6" },
    { name: "Marry Ann Nedia", role: "Developer", color: "#3B82F6" },
    { name: "Shamell", role: "Developer", color: "#3B82F6" },
    { name: "Vhvancca Tablon", role: "Developer", color: "#3B82F6" },
];

const Tributes = ({ onLogout, onPageChange }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
    
    // Resize logic to match Dashboard
    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 1024;
            if (!isDesktop) setSidebarWidth(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                        <HeartIcon />
                        <h1>Tributes & Credits</h1>
                    </div>
                    <p>Recognizing the brilliant minds behind the Capstonian Project.</p>
                </div>

                {/* Team Grid */}
                <div className="trib-grid">
                    {TEAM_MEMBERS.map((member, index) => (
                        <div key={index} className="trib-card">
                            <div className="trib-avatar-container">
                                {/* IMAGE PLACEHOLDER LOGIC: 
                                    Currently using UI Avatars API. 
                                    To use real images: <img src={require('./path/to/image.jpg')} ... /> 
                                */}
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${member.name}&background=${member.color.replace('#','')}&color=fff&size=128&bold=true`} 
                                    alt={member.name} 
                                    className="trib-avatar"
                                />
                                <div className="trib-badge" style={{backgroundColor: member.color}}>
                                    <CodeIcon />
                                </div>
                            </div>
                            
                            <h3 className="trib-name">{member.name}</h3>
                            
                            <span 
                                className="trib-role" 
                                style={{
                                    color: member.color, 
                                    backgroundColor: `${member.color}15`, // 15 = low opacity hex
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