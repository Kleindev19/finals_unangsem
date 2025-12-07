// src/components/assets/Dashboard/Dashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from './Sidebar.jsx';

// --- ICONS ---
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
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
const Menu = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);

const GreetingSection = ({ profileData }) => {
    const [text, setText] = useState('');
    const userName = profileData?.displayName || profileData?.fullName || 'Professor';
    
    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const fullText = `${getTimeBasedGreeting()}, ${userName}`; 

    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name[0]?.toUpperCase() || 'U';
    };
    
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${getInitials(userName)}&background=38761d&color=fff&size=128&bold=true`;
    const avatarSrc = profileData?.photoURL || fallbackAvatar;

    useEffect(() => {
        setText(''); 
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
    }, [fullText]); 

    return (
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', animation: 'fadeIn 0.5s ease-in-out' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #38761d', padding: '3px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(56, 118, 29, 0.2)' }}>
                <img src={avatarSrc} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = fallbackAvatar; }} />
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1F2937', margin: 0, minHeight: '3rem', display: 'flex', alignItems: 'center' }}>
                {text}
                <span className="blinking-cursor" style={{ color: '#38761d', marginLeft: '5px' }}>|</span>
            </h1>
            <style>{`@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } } .blinking-cursor { animation: blink 1s infinite; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

const ClassCard = ({ data, onClick }) => {
    const headerStyle = data.coverImage 
        ? { 
            backgroundImage: `url(${data.coverImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }
        : { 
            backgroundColor: data.color, 
            boxShadow: `0 4px 10px ${data.color}50`
          };

    return (
        <div className="class-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="class-icon-header" style={headerStyle}>
                {!data.coverImage && <BookOpen size={24} color="white" />}
            </div>
            <h4 className="class-card-title">{data.name}</h4>
            <p className="class-card-subtitle">{data.subtitle}</p>
            <div className="class-card-footer">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={16} /> {data.students} Students</span>
                <span className="view-link" style={{ color: data.color || '#3B82F6' }}>View <ArrowRight size={16} /></span>
            </div>
        </div>
    );
};

const MetricCard = ({ data }) => (
    <div className="metric-card">
        <div className="metric-header">
            <div className="metric-icon-box" style={{ backgroundColor: `${data.color}20`, color: data.color }}><data.icon size={24} /></div>
            {data.change && (<span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#10B981', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>{data.change}</span>)}
        </div>
        <div><h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#1F2937' }}>{data.value}</h3><p style={{ color: '#6B7280', margin: 0 }}>{data.label}</p></div>
    </div>
);

const Dashboard = ({ onLogout, onPageChange, profileData, isVoiceActive, onToggleVoice, sections = [], students = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDesktopMode, setIsDesktopMode] = useState(window.innerWidth >= 1024);
    const [sidebarWidth, setSidebarWidth] = useState(isDesktopMode ? SIDEBAR_DEFAULT_WIDTH : 0);
    
    const [filterInstitute, setFilterInstitute] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterCourse, setFilterCourse] = useState('');

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 1024;
            setIsDesktopMode(isDesktop);
            if (!isDesktop) setSidebarWidth(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleWidthChange = (newWidth) => { if (isDesktopMode) setSidebarWidth(newWidth); };

    // Calculate student count for each section
    const sectionsWithStudentCount = useMemo(() => {
        return sections.map(section => {
            const studentCount = students.filter(student => 
                student.section === section.name
            ).length;
            return { ...section, students: studentCount };
        });
    }, [sections, students]);

    // Filtering Logic
    const filteredSections = useMemo(() => {
        if (!sectionsWithStudentCount || sectionsWithStudentCount.length === 0) return [];
        
        return sectionsWithStudentCount.filter(section => {
            const instituteMatch = !filterInstitute || (section.institute && section.institute.toLowerCase() === filterInstitute.toLowerCase());
            const yearMatch = !filterYear || (section.year && section.year.toLowerCase() === filterYear.toLowerCase());
            const courseMatch = !filterCourse || (section.course && section.course.toLowerCase() === filterCourse.toLowerCase());
            
            const searchMatch = !searchTerm || 
                                (section.name && section.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (section.subtitle && section.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));

            return instituteMatch && yearMatch && courseMatch && searchMatch;
        });
    }, [sectionsWithStudentCount, filterInstitute, filterYear, filterCourse, searchTerm]);

    const handleInstituteChange = (e) => {
        setFilterInstitute(e.target.value === 'Select Institute' ? '' : e.target.value);
    };

    const handleYearChange = (e) => {
        setFilterYear(e.target.value === 'Select Year' ? '' : e.target.value);
    };

    const handleCourseChange = (e) => {
        setFilterCourse(e.target.value === 'Select Course' ? '' : e.target.value);
    };

    // Calculate total students across all sections
    const totalStudents = students.length;

    const METRICS_DATA = [
        { label: 'Total Students', value: totalStudents, icon: Users, color: '#3B82F6', change: '+12%' },
        { label: 'Active Sections', value: sections.length, icon: BookOpen, color: '#F97316', change: '+8%' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FDFDF5', fontFamily: 'Inter, sans-serif' }}>
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="dashboard" onWidthChange={handleWidthChange} />
            <main style={{ flexGrow: 1, padding: isDesktopMode ? '1.5rem 2rem' : '1rem', marginLeft: isDesktopMode ? sidebarWidth : 0, transition: 'margin-left 0.3s ease-in-out', width: `calc(100% - ${isDesktopMode ? sidebarWidth : 0}px)` }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', backgroundColor: 'transparent' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: isDesktopMode ? 'auto' : '100%', flexGrow: 1, maxWidth: '600px' }}>
                        {!isDesktopMode && (<button style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}><Menu style={{ width: '1.5rem', height: '1.5rem' }} /></button>)}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                            <SearchIcon style={{ position: 'absolute', left: '1rem', width: '1.2rem', height: '1.2rem', color: '#9CA3AF' }} />
                            <input type="text" placeholder="Search Class.." style={{ paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', width: '100%', fontSize: '0.95rem', backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <button onClick={onToggleVoice} className={isVoiceActive ? 'mic-btn-active' : ''} style={{ background: 'none', border: 'none', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }} title={isVoiceActive ? "Listening..." : "Activate Voice Command"}><Mic style={{ width: '1.5rem', height: '1.5rem', color: isVoiceActive ? 'inherit' : '#4B5563' }} /></button>
                        <Bell style={{ width: '1.5rem', height: '1.5rem', color: '#4B5563', cursor: 'pointer' }} />
                        <HelpIcon style={{ width: '1.5rem', height: '1.5rem', color: '#4B5563', cursor: 'pointer' }} title="Help & Support" />
                    </div>
                </header>

                <GreetingSection profileData={profileData} />

                <div className="section-container">
                    <div className="filters-bar">
                        <select className="select-filter" onChange={handleInstituteChange} value={filterInstitute || 'Select Institute'}>
                            <option disabled hidden>Select Institute</option>
                            <option>Institute of Computer Studies</option>
                            <option>Institute of Teachers Education</option>
                            <option>Institute of Business Entrepreneurship</option>
                        </select>

                        <select className="select-filter" onChange={handleYearChange} value={filterYear || 'Select Year'}>
                            <option disabled hidden>Select Year</option>
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                        </select>

                        <select className="select-filter" onChange={handleCourseChange} value={filterCourse || 'Select Course'}>
                            <option disabled hidden>Select Course</option>
                            <option>BSIT</option>
                            <option>BSEd</option>
                            <option>BSBA</option>
                        </select>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>My Classes</h2>
                    <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Manage your sections and track student progress</p>
                    <div className="class-card-grid">
                        {filteredSections.map((cls) => (
                            <ClassCard key={cls.id} data={cls} onClick={() => onPageChange('view-studs', { sectionData: cls })} />
                        ))}
                        {filteredSections.length === 0 && (
                            <p style={{ color: '#6B7280', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
                                {sections.length === 0 ? 'No classes found. Go to Profile to add your first class.' : 'No classes found matching your filter criteria.'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="metrics-grid">
                    {METRICS_DATA.map((metric, idx) => <MetricCard key={idx} data={metric} />)}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;