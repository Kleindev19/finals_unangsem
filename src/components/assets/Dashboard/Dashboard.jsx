// src/components/assets/Dashboard/Dashboard.jsx

import React, { useState } from 'react';
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

// --- UPDATED CLASS CARD: Accepts onClick ---
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

                {/* Greeting */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1F2937', marginBottom: '0.5rem' }}>
                        Good Day, {profileData?.fullName || 'Prof. Junas Arroyo'}
                    </h1>
                </div>

                {/* Filters Section (Imitating the white card look) */}
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
                                // --- NAVIGATION TRIGGER ---
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