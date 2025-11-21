import React, { useState, useEffect } from 'react';

// --- INLINE SVG ICONS (Dependency-Free) ---
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const BellIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.32 20a1.94 1.94 0 0 0 3.36 0"/></svg>);
const UserIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const LayoutDashboardIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>);
const BarChart3Icon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17v-4"/><path d="M8 17v-1"/></svg>);
const UsersIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const GraduationCapIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.98V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.02A2 2 0 0 1 5 9h14.42a2 2 0 0 1 1.99 1.98z"/><path d="M8 19v2"/><path d="M16 19v2"/><path d="M12 9c3.314 0 6 2.686 6 6s-2.686 6-6 6c-3.314 0-6-2.686-6-6s2.686-6 6-6z"/><path d="M12 9V5a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v4"/></svg>);
const ArrowRightIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const BoxIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="m3 8 7 5 7-5"/><path d="M12 3v3"/></svg>);
const ShieldIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-5 7-7 7s-7-2-7-7V5l7-3 7 3z"/></svg>);
const DatabaseIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/><path d="M3 19a9 3 0 0 0 18 0"/></svg>);
const BrainIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c-3.5 0-6 2-6 5s1.5 5 6 5c1 0 2-.5 2.8-.8"/><path d="M12 5c3.5 0 6 2 6 5s-1.5 5-6 5c-1 0-2-.5-2.8-.8"/><path d="M12 15v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4"/><path d="M12 15v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4"/><path d="M12 5c.5-1 1.2-1 1.7-1C14.7 4 16 5 16 7c0 2-1 3-2.3 3.5"/><path d="M12 5c-.5-1-1.2-1-1.7-1C9.3 4 8 5 8 7c0 2 1 3 2.3 3.5"/></svg>);
const ArrowDownIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>);
const ArrowUpIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>);
const MenuIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);

const BarChart3 = BarChart3Icon;
const GraduationCap = GraduationCapIcon;
const LayoutDashboard = LayoutDashboardIcon;
const Users = UsersIcon;
const ArrowRight = ArrowRightIcon;
const Box = BoxIcon;
const Shield = ShieldIcon;
const Database = DatabaseIcon;
const Brain = BrainIcon;
const ArrowDown = ArrowDownIcon;
const ArrowUp = ArrowUpIcon;
const Search = SearchIcon;
const Bell = BellIcon;
const User = UserIcon;
const Menu = MenuIcon;
// --- END OF INLINE SVG ICONS ---

// --- DUMMY DATA AND OPTIONS (No change) ---
const CLASSES_DATA = [
    { icon: Box, color: '#2563EB', code: 'CS 101 - A', name: 'Introduction to Programming', iconBg: '#DBEAFE' },
    { icon: Database, color: '#7C3AED', code: 'CS 102 - B', name: 'Data Structures', iconBg: '#EDE9FE' },
    { icon: Shield, color: '#10B981', code: 'CS 201 - A', name: 'Database Systems', iconBg: '#D1FAE5' },
    { icon: Brain, color: '#EF4444', code: 'CS 202 - C', name: 'Computer Networks', iconBg: '#FEE2E2' },
    { icon: GraduationCap, color: '#EC4899', code: 'CS 301 - A', name: 'Artificial Intelligence', iconBg: '#FCE7F6' },
    { icon: Box, color: '#4F46E5', code: 'S 302 - B', name: 'Security Management', iconBg: '#E0E7FF' },
];

const STATS_DATA = [
    { icon: Users, color: '#3B82F6', value: '283', label: 'Total Students', change: '+12%', changeType: '#10B981', changeBg: '#D1FAE5', changeIcon: ArrowUp },
    { icon: BarChart3, color: '#10B981', value: '94.2%', label: 'Average Grade', change: '+5%', changeType: '#10B981', changeBg: '#D1FAE5', changeIcon: ArrowUp },
    { icon: GraduationCap, color: '#9333EA', value: '87.5%', label: 'Attendance Rate', change: '-3%', changeType: '#EF4444', changeBg: '#FEE2E2', changeIcon: ArrowDown },
    { icon: LayoutDashboard, color: '#F97316', value: '7', label: 'Active Sections', change: '+8%', changeType: '#10B981', changeBg: '#D1FAE5', changeIcon: ArrowUp },
];

const INSTITUTE_OPTIONS = ['Select Institute', 'Institute of Business', 'Institute of Computer Studies', 'Institute of Education'];
const YEAR_LEVEL_OPTIONS = ['Select Year Level', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const SECTION_OPTIONS = ['Select Section', 'All Sections', 'Section A', 'Section B', 'Section C'];


// --- Sidebar Component (Pure Inline Styles) ---
const Sidebar = ({ active, isVisible, toggleSidebar, isDesktopMode }) => {
    
    // Base style for the sidebar
    const sidebarStyle = {
        height: '100vh',
        backgroundColor: '#166534', // bg-green-700
        color: 'white',
        padding: '1rem', // p-4
        boxShadow: '4px 0 10px rgba(0, 0, 0, 0.2)', // Adjusted shadow
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    };

    // Specific styles for Mobile View (When it slides out)
    const mobileStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '280px', // Fixed width for mobile
        zIndex: 50,
        transition: 'transform 0.3s ease-in-out',
        transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
    };

    // Apply mobile styles only if not in desktop mode and it's visible or sliding out
    const finalStyle = isDesktopMode 
        ? { ...sidebarStyle, width: '280px', position: 'sticky', top: 0 } // Desktop: Fixed width, sticky
        : { ...sidebarStyle, ...mobileStyle }; // Mobile: Fixed position, sliding

    const navItemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem', // p-3
        borderRadius: '0.75rem', // rounded-xl
        transition: 'background-color 0.2s, box-shadow 0.2s',
        color: isActive ? 'white' : '#D1FAE5', // text-gray-200
        backgroundColor: isActive ? '#34D399' : 'transparent', // bg-green-500
        fontWeight: isActive ? 'bold' : 'normal',
        boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' : 'none',
        marginBottom: '0.5rem',
        cursor: 'pointer',
    });

    return (
        <div style={finalStyle}>
            {/* Logo/Title */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem', padding: '0.5rem', borderBottom: '1px solid #065F46' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GraduationCap style={{ width: '2rem', height: '2rem', marginRight: '0.25rem', padding: '0.25rem', backgroundColor: 'white', borderRadius: '0.75rem', color: '#166534', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} /> 
                    <span style={{ marginLeft: '0.5rem', fontSize: '1.25rem', fontWeight: '800', letterSpacing: 'tight' }}></span>
                </div>
                
                {/* Close Button for Mobile */}
                {!isDesktopMode && (
                    <button onClick={toggleSidebar} style={{ padding: '0.25rem', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ArrowRight style={{ width: '1.5rem', height: '1.5rem', transform: 'rotate(180deg)' }} />
                    </button>
                )}
            </div>
            
            <nav style={{ flexGrow: 1, paddingTop: '0.5rem' }}>
                {[
                    { name: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
                    { name: 'Reports', icon: BarChart3, key: 'reports' },
                    { name: 'Profile', icon: User, key: 'profile' },
                ].map((item) => {
                    const Icon = item.icon;
                    const isActive = item.key === active;
                    return (
                        <a 
                            key={item.key}
                            href="#" 
                            style={{ ...navItemStyle(isActive) }}
                            onMouseOver={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = '#065F46'; // hover:bg-green-600
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            onClick={!isDesktopMode ? toggleSidebar : undefined} // Close on click in mobile
                        >
                            <Icon style={{ width: '1.5rem', height: '1.5rem' }} /> 
                            <span style={{ marginLeft: '1rem', fontSize: '1rem', fontWeight: '500' }}>{item.name}</span>
                        </a>
                    );
                })}
            </nav>
            
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #065F46' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '0.75rem', transition: 'background-color 0.2s', color: '#D1FAE5', background: 'none' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#065F46'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <ArrowRight style={{ width: '1.25rem', height: '1.25rem', transform: 'rotate(180deg)' }} />
                    <span style={{ marginLeft: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>Logout</span>
                </a>
            </div>
        </div>
    );
};

// --- StatCard Component (Pure Inline Styles) ---
const StatCard = ({ data }) => {
    const Icon = data.changeIcon;
    const CardIcon = data.icon;
    return (
        <div style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: `4px solid ${data.color}`, transition: 'box-shadow 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.125rem', backgroundColor: data.color }}>
                    <CardIcon style={{ width: '1.5rem', height: '1.5rem' }} /> 
                </div>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', color: data.changeType, backgroundColor: data.changeBg }}>
                    <Icon style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                    {data.change}
                </span>
            </div>
            <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1F2937', marginTop: '0.25rem', marginBottom: '0.25rem' }}>{data.value}</h3>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{data.label}</p>
        </div>
    );
};

// --- ClassCard Component (Pure Inline Styles) ---
const ClassCard = ({ data }) => {
    const Icon = data.icon;
    return (
        <div style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', backgroundColor: data.iconBg }}>
                    <Icon style={{ width: '1.5rem', height: '1.5rem', color: data.color }} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>{data.code}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.125rem' }}>{data.name}</p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', display: 'flex', alignItems: 'center' }}>
                    <Users style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.375rem' }} /> 35 Students
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669', cursor: 'pointer', transition: 'color 0.3s', display: 'flex', alignItems: 'center' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#047857'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#059669'}
                >
                    View <ArrowRight style={{ width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem' }} />
                </span>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [institute, setInstitute] = useState(INSTITUTE_OPTIONS[0]);
    const [yearLevel, setYearLevel] = useState(YEAR_LEVEL_OPTIONS[0]);
    const [section, setSection] = useState(SECTION_OPTIONS[0]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false); 
    const [isDesktopMode, setIsDesktopMode] = useState(window.innerWidth >= 768);

    // Function to check screen size (using 768px breakpoint)
    const checkScreenSize = () => {
        setIsDesktopMode(window.innerWidth >= 768);
    };

    // Use useEffect to handle window resize for responsiveness
    useEffect(() => {
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);


    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

    const isDashboardReady = institute !== INSTITUTE_OPTIONS[0] && 
                             yearLevel !== YEAR_LEVEL_OPTIONS[0] && 
                             section !== SECTION_OPTIONS[0];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'Inter', position: 'relative' }}>
            
            {/* Mobile Backdrop (to close the sidebar) */}
            {!isDesktopMode && isSidebarVisible && (
                <div 
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'black', opacity: 0.5, zIndex: 40 }}
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar Container */}
            <div style={{ 
                float: isDesktopMode ? 'left' : 'none', 
                width: isDesktopMode ? '280px' : '0', // Only allocate width if desktop
                height: isDesktopMode ? '100vh' : '0', 
                overflow: 'hidden' // Hide the width space completely in mobile
            }}>
                {/* Desktop Sidebar (Always rendered but hidden via CSS for mobile) */}
                {isDesktopMode && <Sidebar active="dashboard" isVisible={true} toggleSidebar={()=>{}} isDesktopMode={true} />}
            </div>

            {/* Mobile Slide-out Sidebar (Fixed Position) */}
            {!isDesktopMode && (
                <Sidebar active="dashboard" isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} isDesktopMode={false} />
            )}


            {/* Main Content Area Container */}
            <div style={{ 
                marginLeft: isDesktopMode ? '280px' : '0', // Offset the main content by sidebar width
                padding: isDesktopMode ? '2rem' : '1rem', 
                minHeight: '100vh', 
                position: 'relative', // Context for sticky headers
                zIndex: isSidebarVisible && !isDesktopMode ? 30 : 10 // Ensure it's below the backdrop if mobile sidebar is open
            }}>
                
                {/* Top Bar (Mobile and Desktop Search/Icons) */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: isDesktopMode ? '1rem' : '0.75rem', 
                    backgroundColor: 'white', 
                    borderRadius: '0.75rem', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                    marginBottom: '1.5rem', 
                    gap: '1rem'
                }}>
                    
                    {/* Mobile Menu Button */}
                    {!isDesktopMode && (
                        <button onClick={toggleSidebar} style={{ padding: '0.25rem', color: '#4B5563', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Menu style={{ width: '1.5rem', height: '1.5rem' }} />
                        </button>
                    )}

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: isDesktopMode ? '40rem' : '100%' }}>
                        <Search style={{ position: 'absolute', left: '1rem', width: '1rem', height: '1rem', color: '#9CA3AF' }} />
                        <input 
                            type="text" 
                            placeholder="Search students, sections, or reports..." 
                            style={{ paddingLeft: '2.5rem', paddingRight: '1rem', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', width: '100%', fontSize: '0.875rem' }} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', minWidth: isDesktopMode ? 'auto' : '3.5rem' }}>
                        <Bell style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} />
                        <User style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Filter/Dropdown Section */}
                <div style={{ display: 'flex', flexDirection: isDesktopMode ? 'row' : 'column', gap: '1rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', marginBottom: '0.5rem' }}>Institute</label>
                        <div style={{ position: 'relative' }}>
                            <select 
                                value={institute} 
                                onChange={(e) => setInstitute(e.target.value)}
                                style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '2.5rem', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.75rem', backgroundColor: 'white', fontSize: '0.875rem', appearance: 'none', cursor: 'pointer' }}
                            >
                                {INSTITUTE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                            <ArrowDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9CA3AF', pointerEvents: 'none' }} />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', marginBottom: '0.5rem' }}>Year Level</label>
                        <div style={{ position: 'relative' }}>
                            <select 
                                value={yearLevel} 
                                onChange={(e) => setYearLevel(e.target.value)}
                                style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '2.5rem', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.75rem', backgroundColor: 'white', fontSize: '0.875rem', appearance: 'none', cursor: 'pointer' }}
                            >
                                {YEAR_LEVEL_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                            <ArrowDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9CA3AF', pointerEvents: 'none' }} />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#6B7280', marginBottom: '0.5rem' }}>Section</label>
                        <div style={{ position: 'relative' }}>
                            <select 
                                value={section} 
                                onChange={(e) => setSection(e.target.value)}
                                style={{ width: '100%', paddingLeft: '0.75rem', paddingRight: '2.5rem', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.75rem', backgroundColor: 'white', fontSize: '0.875rem', appearance: 'none', cursor: 'pointer' }}
                            >
                                {SECTION_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                            <ArrowDown style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9CA3AF', pointerEvents: 'none' }} />
                        </div>
                    </div>
                </div>

                {/* Conditional Content: My Classes and Statistics */}
                {isDashboardReady ? (
                    <>
                        {/* Statistics Section (Grid) */}
                        <div style={{ display: 'grid', gridTemplateColumns: isDesktopMode ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                            {STATS_DATA.map((stat, index) => (
                                <StatCard key={index} data={stat} />
                            ))}
                        </div>

                        {/* My Classes Section */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937',textAlign:'center' }}>My Classes</h2>
                                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>Manage your sections and track student progress</p>
                                </div>
                        
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: isDesktopMode ? 'repeat(4, 1fr)' : 'repeat(1, 1fr)', gap: '1.5rem', 
                                ...(window.innerWidth >= 1024 && { gridTemplateColumns: 'repeat(3, 1fr)' }),
                                ...(window.innerWidth >= 1280 && { gridTemplateColumns: 'repeat(4, 1fr)' })
                            }}>
                                {CLASSES_DATA.map((classData, index) => (
                                    <ClassCard key={index} data={classData} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px dashed #D1D5DB' }}>
                        <GraduationCap style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#10B981' }} />
                        <p style={{ fontSize: '1.125rem', color: '#4B5563', fontWeight: '500' }}>
                            Choose the <span style={{ fontWeight: 'bold', color: '#059669' }}>Institute</span>, <span style={{ fontWeight: 'bold', color: '#059669' }}>Year Level</span>, and <span style={{ fontWeight: 'bold', color: '#059669' }}>Section</span> to see your classes.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default App;