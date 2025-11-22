import React, { useState, useEffect } from 'react';

// --- IMPORTS FOR DASHBOARD FUNCTIONALITY ---
// NOTE: Adjust the path if your apiService is not three levels up
import { auth } from '../../../apiService';
// --- NEW IMPORT: Use the extracted Sidebar component and its constants ---
import { 
    Sidebar, 
    SIDEBAR_DEFAULT_WIDTH, 
    SIDEBAR_EXPANDED_WIDTH,
    BarChart3Icon as ReportsIcon // Alias for clarity in METRICS_DATA
} from './Sidebar.jsx'; 
// --------------------------------------------------

// --- INLINE SVG ICONS (ONLY those needed by Dashboard main content/header/cards) ---
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const BellIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);
const UserIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const GraduationCap = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M14 10H2L10 3zM2 17v-1.5C2 12 4 10 7 10h10c3 0 5 2 5 4.5V17m-10 4V17"/></svg>);
// ------------------------------------------------------------------------------------------------------------------------------------------------------

// --- Placeholder Components (Needed for structure) ---
const ClassCard = ({ data }) => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderLeft: `4px solid ${data.color || '#38761d'}`
    }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>{data.title}</h3>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>{data.details}</p>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Students: {data.students}</span>
            <span style={{ color: data.progress > 70 ? 'green' : 'orange' }}>Progress: {data.progress}%</span>
        </div>
    </div>
);

const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderLeft: `4px solid ${color || '#38761d'}`
    }}>
        <div style={{ color: color, padding: '0.75rem', backgroundColor: `${color}10`, borderRadius: '9999px' }}>
            <Icon style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
        <div>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>{title}</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#333', margin: '0.25rem 0 0' }}>{value}</h2>
        </div>
    </div>
);
// --- Dummy Data ---
const CLASSES_DATA = [
    { title: 'Grade 10 - Section A', details: 'Math, Science, English', students: 35, progress: 85, color: '#059669' },
    { title: 'Grade 9 - Section B', details: 'Algebra, Filipino', students: 32, progress: 65, color: '#f59e0b' },
    { title: 'Grade 8 - Section C', details: 'World History', students: 30, progress: 92, color: '#3b82f6' },
    { title: 'Grade 7 - Section D', details: 'Intro to Programming', students: 28, progress: 78, color: '#ef4444' },
];

const METRICS_DATA = [
    { title: 'Total Classes', value: '12', icon: GraduationCap, color: '#38761d' },
    { title: 'Total Students', value: '420', icon: UserIcon, color: '#f59e0b' },
    { title: 'Avg. Progress', value: '78%', icon: ReportsIcon, color: '#3b82f6' },
    { title: 'New Alerts', value: '5', icon: BellIcon, color: '#ef4444' },
];
// --------------------

const Dashboard = ({ onLogout, onPageChange }) => {

    const [isDataLoaded, setIsDataLoaded] = useState(true);
    // 2. Content Offset: State to track sidebar width
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
    // State for filtering
    const [filterState, setFilterState] = useState({
        institute: '', yearLevel: '', section: ''
    });

    // Helper for applying width change from Sidebar
    const handleWidthChange = (newWidth) => {
        setSidebarWidth(newWidth);
    };

    // Placeholder data for filters
    const institutes = ['Institute 1', 'Institute 2'];
    const yearLevels = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const sections = ['Section A', 'Section B', 'Section C'];
    
    // --- 4. Layout: Header Component ---
    const Header = () => (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingBottom: '1rem',
            marginBottom: '1rem',
            borderBottom: '1px solid #E5E7EB'
        }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937' }}>Dashboard Overview</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <SearchIcon style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} />
                <BellIcon style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} />
                <UserIcon style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} />
            </div>
        </div>
    );
    // -------------------------------------------------------------

    // --- 4. Layout: Filters Component ---
    const Filters = () => (
        <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            padding: '1.5rem',
            marginBottom: '2rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            flexWrap: 'wrap'
        }}>
            <select 
                value={filterState.institute} 
                onChange={(e) => setFilterState({...filterState, institute: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
            >
                <option value="">Select Institute</option>
                {institutes.map(inst => <option key={inst} value={inst}>{inst}</option>)}
            </select>
            <select 
                value={filterState.yearLevel} 
                onChange={(e) => setFilterState({...filterState, yearLevel: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
            >
                <option value="">Select Year Level</option>
                {yearLevels.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <select 
                value={filterState.section} 
                onChange={(e) => setFilterState({...filterState, section: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
            >
                <option value="">Select Section</option>
                {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>
        </div>
    );
    // -------------------------------------------------------------
    
    // Determine screen size for responsive grid columns
    const isDesktopMode = window.innerWidth >= 768;


    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            
            {/* Sidebar Component */}
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange} 
                currentPage="dashboard" 
                onWidthChange={handleWidthChange} // Pass the handler
            />

            {/* Main Content (2. Content Offset) */}
            <div 
                style={{ 
                    flexGrow: 1, 
                    padding: '2rem', 
                    // Dynamic margin-left based on sidebarWidth
                    marginLeft: sidebarWidth, 
                    transition: 'margin-left 0.3s ease-in-out',
                    width: `calc(100% - ${sidebarWidth}px)`, // Ensure content resizes correctly
                    boxSizing: 'border-box'
                }}
            >
                
                {/* 4. Layout: Header */}
                <Header />
                
                {/* 4. Layout: Filters */}
                <Filters />

                {/* 4. Layout: Metric Grid */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>Key Metrics</h2>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: isDesktopMode ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', 
                        gap: '1.5rem' 
                    }}>
                        {METRICS_DATA.map((metric, index) => (
                            <MetricCard key={index} {...metric} />
                        ))}
                    </div>
                </div>


                {/* 4. Layout: Class Grid */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>Active Classes</h2>
                    
                    {isDataLoaded && (filterState.institute || filterState.yearLevel || filterState.section) ? (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: isDesktopMode ? 'repeat(4, 1fr)' : 'repeat(1, 1fr)', 
                            gap: '1.5rem' 
                        }}>
                            {CLASSES_DATA.map((classData, index) => (
                                <ClassCard key={index} data={classData} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px dashed #D1D5DB' }}>
                            <GraduationCap style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#10B981' }} />
                            <p style={{ fontSize: '1.125rem', color: '#4B5563', fontWeight: '500' }}>
                                Choose the <span style={{ fontWeight: 'bold', color: '#059669' }}>Institute</span>, <span style={{ fontWeight: 'bold', color: '#059669' }}>Year Level</span>, and <span style={{ fontWeight: 'bold', color: '#059669' }}>Section</span> to see your data.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;