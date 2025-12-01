// src/components/assets/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Sidebar, SIDEBAR_EXPANDED_WIDTH } from './Sidebar.jsx';

// --- ICONS ---
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const Bell = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);
const Mic = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>);
const HelpIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);
const Users = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const BookOpen = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const ArrowRight = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);

// --- DATA ---
const METRICS_DATA = [
    { label: 'Total Students', value: 283, icon: Users, color: '#3B82F6', change: '+12%' },
    { label: 'Active Sections', value: 7, icon: BookOpen, color: '#F97316', change: '+8%' },
];

const CLASSES_DATA = [
    { title: 'CS 101 - A', subtitle: 'Introduction to Programming', students: 42, color: '#3B82F6' },
    { title: 'CS 101 - B', subtitle: 'Information Assurance & Security', students: 38, color: '#EAB308' },
    { title: 'CS 101 - C', subtitle: 'Human & Computer Interaction', students: 35, color: '#F97316' },
];

// --- COMPONENTS ---
const MetricCard = ({ data }) => (
    <div className="metric-card">
        <div className="metric-header">
            <div className="metric-icon-box" style={{ backgroundColor: `${data.color}20`, color: data.color }}>
                <data.icon size={24} />
            </div>
            {data.change && (
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#10B981', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                    {data.change}
                </span>
            )}
        </div>
        <div>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#1F2937' }}>{data.value}</h3>
            <p style={{ color: '#6B7280', margin: 0 }}>{data.label}</p>
        </div>
    </div>
);

const ClassCard = ({ data, onClick }) => (
    <div className="class-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="class-icon-header" style={{ backgroundColor: data.color, boxShadow: `0 4px 10px ${data.color}50` }}>
            <BookOpen size={24} color="white" />
        </div>
        <h4 className="class-card-title">{data.title}</h4>
        <p className="class-card-subtitle">{data.subtitle}</p>
        <div className="class-card-footer">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Users size={16} /> {data.students} Students
            </span>
            <span className="view-link" style={{ color: data.color }}>
                View <ArrowRight size={16} />
            </span>
        </div>
    </div>
);

// --- ANIMATED GREETING COMPONENT (DYNAMIC TIME) ---
const GreetingSection = ({ profileData }) => {
    const [text, setText] = useState('');
    
    const userName = profileData?.displayName || profileData?.fullName || 'Professor';

    // --- NEW: Time-based logic ---
    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const fullText = `${getTimeBasedGreeting()}, ${userName}`; 

    // Get initials for fallback avatar
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name[0]?.toUpperCase() || 'U';
    };
    
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${getInitials(userName)}&background=38761d&color=fff&size=128&bold=true`;
    const avatarSrc = profileData?.photoURL || fallbackAvatar;

    // Typing Logic
    useEffect(() => {
        setText(''); // Reset immediately
        
        let currentString = '';
        let i = 0;

        const timer = setInterval(() => {
            if (i < fullText.length) {
                currentString += fullText.charAt(i);
                setText(currentString);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [fullText]); // Re-run if fullText (time or name) changes

    return (
        <div style={{ 
            marginBottom: '2.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            animation: 'fadeIn 0.5s ease-in-out'
        }}>
            {/* 1. Profile Picture with Ring */}
            <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '3px solid #38761d', // Green border matching theme
                padding: '3px', // Spacing between border and image
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(56, 118, 29, 0.2)'
            }}>
                <img 
                    src={avatarSrc} 
                    alt="Profile" 
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackAvatar; }}
                />
            </div>

            {/* 2. Typing Text */}
            <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: '800', 
                color: '#1F2937', 
                margin: 0,
                minHeight: '3rem', // Prevents layout shift while typing
                display: 'flex',
                alignItems: 'center'
            }}>
                {text}
                <span className="blinking-cursor" style={{ color: '#38761d', marginLeft: '5px' }}>|</span>
            </h1>

            <style>
                {`
                    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
                    .blinking-cursor { animation: blink 1s infinite; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>
        </div>
    );
};

const Dashboard = ({ onLogout, onPageChange, profileData }) => {
    const isDesktopMode = window.innerWidth >= 1024;
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="dashboard-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="dashboard" onWidthChange={()=>{}} />
            
            <main className="main-content" style={{ marginLeft: isDesktopMode ? SIDEBAR_EXPANDED_WIDTH : 0 }}>
                {/* Header */}
                <div className="dashboard-header">
                    <div className="search-input-container">
                        <SearchIcon className="search-icon" />
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search students..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="header-icon-group">
                        <Mic className="header-icon" />
                        <Bell className="header-icon" />
                        <HelpIcon className="header-icon" title="Help & Support" />
                    </div>
                </div>

                {/* --- GREETING SECTION --- */}
                <GreetingSection profileData={profileData} />

                {/* Filters Section */}
                <div className="section-container">
                    <div className="filters-bar">
                        <select className="select-filter"><option>College of Engineering</option></select>
                        <select className="select-filter"><option>1st Year</option></select>
                        <select className="select-filter"><option>All Sections</option></select>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>My Classes</h2>
                    <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Manage your sections and track student progress</p>

                    <div className="class-card-grid">
                        {CLASSES_DATA.map((cls, idx) => (
                            <ClassCard 
                                key={idx} 
                                data={cls} 
                                onClick={() => onPageChange('view-studs')} 
                            />
                        ))}
                    </div>
                </div>

                {/* Metrics */}
                <div className="metrics-grid">
                    {METRICS_DATA.map((metric, idx) => <MetricCard key={idx} data={metric} />)}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;