// src/components/assets/Profile/Profile.jsx

import React, { useState, useEffect } from 'react';
import './Profile.css';

// --- FULL MOCK DATA FOR CASCADING DROPDOWNS ---
const schoolData = {
    "Institute of Computing Studies": {
        "1st Year": {
            "Bachelor of Science in Information Technology": ["BSIT 1A", "BSIT 1B","BSIT 1C","BSIT 1D"],
            "Bachelor of Science in Computer Engineering": ["BSCPE 1A","BSCPE 1B","BSCPE 1C","BSCPE 1D"],
        },
        "2nd Year": {
            "Bachelor of Science in Information Technology": ["BSIT 2A", "BSIT 2B","BSIT 2C","BSIT 2D"],
            "Bachelor of Science in Computer Engineering": ["BSCPE 2A","BSCPE 2B","BSCPE 2C","BSCPE 2D"],
        },
         "3rd Year": {
            "Bachelor of Science in Information Technology": ["BSIT 3A", "BSIT 3B","BSIT 3C","BSIT 3D"],
            "Bachelor of Science in Computer Engineering": ["BSCPE 3A","BSCPE 3B","BSCPE 3C","BSCPE 3D"],
        },
         "4th Year": {
            "Bachelor of Science in Information Technology": ["BSIT 4A", "BSIT 4B","BSIT 4C","BSIT 4D"],
            "Bachelor of Science in Computer Engineering": ["BSCPE 4A","BSCPE 4B","BSCPE 4C","BSCPE 4D"],
        },
    },
    
    // Placeholder data for other institutes (can be expanded similarly)
    "Institute of Teachers Education": { 
        "1st Year": {
             "Bachelor of Elementary Education": ["BEEd 1A", "BEEd 1B"],
             "Bachelor of Secondary Education": ["BSEd 1A", "BSEd 1B"]
        } 
    }, 
    "Institute of Business Entrepreneurship": { 
        "1st Year": {
            "Bachelor of Science in Entrepreneurship": ["BS Entrep 1A", "BS Entrep 1B"]
        } 
    },
};

// --- ICONS ---

const FileTextIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>);
const UsersIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const EditIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const PlusIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const TrashIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>);
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const ImageIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>);

// --- NEW ICONS FOR AI SHARE FEATURE ---
const SparklesIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>);
const ClipboardIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>);
const CheckIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
// --- NEW ICON FOR TIMER ---
const ClockIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);


const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.split(' ').filter(p => p); 
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
}

const getRandomColor = () => {
    const colors = ['#3B82F6', '#EAB308', '#F97316', '#10B981', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const Profile = ({ profileData, sections, onUpdateSections }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [role, setRole] = useState('');

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    
    // --- FORM STATE ---
    const [currentId, setCurrentId] = useState(null);
    const [formName, setFormName] = useState('');
    const [formDesc, setFormDesc] = useState('');
    const [formImage, setFormImage] = useState(null); // Stores Base64 string

    // --- CASCADING DROPDOWN STATE ---
    const [institute, setInstitute] = useState('');
    const [year, setYear] = useState('');
    const [course, setCourse] = useState('');
    const [section, setSection] = useState('');
    
    // Filterable Lists
    const availableYears = ['1st Year', '2nd Year', '3rd Year', '4th Year']; 
    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableSections, setAvailableSections] = useState([]);
    const institutes = Object.keys(schoolData);

    // --- SHARE LINK STATE ---
    const [isCopied, setIsCopied] = useState(false);
    // Generate a fake "AI" link based on ID.
    const generatedShareLink = `https://portal.university.edu/faculty-share/ai-connect/${id ? id.toLowerCase().replace(/\s/g, '') : 'user'}-${Math.random().toString(36).substring(2, 8)}`;

    // --- NEW: AUTO LOGOUT TIMER STATE ---
    const [autoLogoutMinutes, setAutoLogoutMinutes] = useState('5'); // Default 5 mins

    // --- EFFECTS ---
    useEffect(() => {
        if (profileData) {
            setName(profileData.displayName || 'User Name');
            setEmail(profileData.email || 'user@school.edu.ph');
            setId(profileData.id || profileData.uid || 'N/A');
            setRole(profileData.role || 'Professor');
        }
        
        // --- LOAD SETTINGS: Load the saved timer preference from localStorage ---
        const storedTimer = localStorage.getItem('autoLogoutMinutes');
        if (storedTimer) {
            setAutoLogoutMinutes(storedTimer);
        }
    }, [profileData]);

    // --- CASCADING EFFECTS ---

    // EFFECT 1: Update Courses (Runs when Institute or Year changes)
    useEffect(() => {
        if (institute && year) {
            const coursesObj = schoolData[institute]?.[year] || {};
            setAvailableCourses(Object.keys(coursesObj));
            setCourse(''); 
            setSection('');
        } else {
            setAvailableCourses([]);
            setCourse(''); 
            setSection('');
        }
    }, [institute, year]);

    // EFFECT 2: Update Sections (Runs when Course changes)
    useEffect(() => {
        if (institute && year && course) {
            const sectionsArray = schoolData[institute]?.[year]?.[course] || [];
            setAvailableSections(sectionsArray);
            setSection('');
        } else {
            setAvailableSections([]);
            setSection('');
        }
    }, [institute, year, course]);


    if (!profileData) return <div className="pro-loading">Loading Profile...</div>;

    const initials = getInitials(name);
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${initials}&background=38761d&color=fff&size=128&bold=true`;
    
    const stats = profileData.stats || {};
    const reportsCount = stats.reportsGenerated || 0; 
    const totalUsers = stats.totalSystemUsers || 0;
    // Fallback if sections prop is not passed or activeSectionsManaged is not available
    const activeSections = sections ? sections.length : stats.activeSectionsManaged || 0; 

    // --- HANDLERS ---

    // NEW HANDLER FOR COPY LINK
    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedShareLink).then(() => {
            setIsCopied(true);
            // Reset copy status after 2.5 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 2500);
        });
    };

    // --- UPDATED: HANDLE SAVE PROFILE & SETTINGS ---
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        
        // 1. Save the new timer setting to localStorage
        localStorage.setItem('autoLogoutMinutes', autoLogoutMinutes);
        
        // 2. Dispatch Custom Event so App.js (SecurityController) updates immediately
        window.dispatchEvent(new Event('CDM_SETTINGS_UPDATE')); 
        
        alert(`Settings Saved!\n\nSecurity Timer set to: ${autoLogoutMinutes} minutes.`);
    };

    const handleOpenAdd = () => {
        // Reset all states for adding a new section
        setIsEditMode(false);
        setFormName('');
        setFormDesc('');
        setFormImage(null);
        setInstitute('');
        setYear('');
        setCourse('');
        setSection('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (section) => {
        setIsEditMode(true);
        setCurrentId(section.id);
        setFormName(section.name);
        setFormDesc(section.subtitle || '');
        setFormImage(section.coverImage || null);
        // Reset cascading states as they are not used in the existing edit logic
        setInstitute('');
        setYear('');
        setCourse('');
        setSection('');
        setIsModalOpen(true);
    };

    const handleDeleteSection = (id) => {
        if (window.confirm("Are you sure you want to delete this section?")) {
            onUpdateSections(sections.filter(s => s.id !== id));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormImage(reader.result); // Save Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSection = (e) => {
        e.preventDefault();

        if (isEditMode) {
            // Edit Existing
            onUpdateSections(sections.map(s => 
                s.id === currentId 
                ? { ...s, name: formName, subtitle: formDesc, coverImage: formImage } 
                : s
            ));
        } else {
            // Add New Section
            if (!institute || !year || !course || !section || !formDesc.trim()) {
                alert("Please select the Institute, Year, Course, Section, and provide a Description / Subject.");
                return;
            }

            const newId = sections && sections.length > 0 ? Math.max(...sections.map(s => s.id)) + 1 : 1;
            const newSection = {
                id: newId,
                name: section, // e.g., BSCS 1A
                subtitle: `${course} (${year}) - ${formDesc}`,
                students: 0,
                color: getRandomColor(),
                coverImage: formImage,
                institute,
                year,
                course,
            };
            onUpdateSections([...sections, newSection]);
        }
        setIsModalOpen(false);
    };
    
    // --- DROPDOWN HANDLERS ---
    const handleInstituteChange = (e) => {
        setInstitute(e.target.value);
        setYear(''); setCourse(''); setSection('');
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleCourseChange = (e) => {
        setCourse(e.target.value);
    };


    return (
        <div className="pro-container">
            
            {/* 1. TOP "IDENTITY" CARD */}
            <div className="pro-identity-card">
                <div className="pro-id-left">
                    <div className="pro-avatar-wrapper">
                        <img 
                            src={profileData.photoURL || fallbackAvatar} 
                            alt="Profile" 
                            className="pro-avatar"
                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackAvatar; }} 
                        />
                        <button className="pro-edit-avatar-btn"><EditIcon /></button>
                    </div>
                    <div className="pro-user-text">
                        <h2 className="pro-name">{name}</h2>
                        <span className="pro-role-badge">{role}</span>
                        <p className="pro-id-text">ID: {id}</p>
                    </div>
                </div>

                <div className="pro-id-right">
                    {/* Horizontal Metrics similar to Dashboard */}
                    <div className="pro-stat-item">
                        <div className="pro-stat-icon-box" style={{background: '#DCFCE7', color: '#166534'}}>
                            <FileTextIcon />
                        </div>
                        <div>
                            <span className="pro-stat-val">{reportsCount}</span>
                            <span className="pro-stat-lbl">Reports</span>
                        </div>
                    </div>
                    <div className="pro-stat-item">
                        <div className="pro-stat-icon-box" style={{background: '#DBEAFE', color: '#1E40AF'}}>
                            <UsersIcon />
                        </div>
                        <div>
                            <span className="pro-stat-val">{activeSections}</span>
                            <span className="pro-stat-lbl">Sections</span>
                        </div>
                    </div>
                   
                </div>
            </div>

            {/* 2. PERSONAL INFO & SETTINGS CARD */}
            <div className="pro-settings-card">
                <div className="pro-card-header">
                    <h3>Personal Information & Security</h3>
                    <p>Update your photo, personal details, and security preferences.</p>
                </div>

                <form className="pro-form" onSubmit={handleUpdateProfile}>
                    <div className="pro-form-grid">
                        <div className="pro-form-group">
                            <label>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="pro-form-group">
                            <label>Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {/* --- NEW SECURITY SECTION: AUTO-LOGOUT TIMER --- */}
                        <div className="pro-form-group">
                             <label style={{display:'flex', alignItems:'center', gap:'6px', color:'#DC2626'}}>
                                 <ClockIcon style={{width:'16px', height:'16px'}}/> Auto-Logout Timer
                             </label>
                             <select 
                                value={autoLogoutMinutes} 
                                onChange={(e) => setAutoLogoutMinutes(e.target.value)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    color: '#1F2937',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            >
                                <option value="1">1 Minute (For Testing)</option>
                                <option value="5">5 Minutes (Recommended)</option>
                                <option value="15">15 Minutes</option>
                                <option value="30">30 Minutes</option>
                                <option value="60">1 Hour</option>
                             </select>
                             <span style={{fontSize:'0.8rem', color:'#6B7280', marginTop:'4px', fontStyle:'italic'}}>
                                 For security, you will be automatically logged out after this period of inactivity.
                             </span>
                        </div>
                        {/* ----------------------------------------------- */}

                        <div className="pro-form-group">
                            <label>System ID (Read Only)</label>
                            <input type="text" value={id} disabled className="pro-input-disabled" />
                        </div>
                    </div>

                    <div className="pro-form-actions">
                        <button type="button" className="pro-btn-cancel">Cancel</button>
                        <button type="submit" className="pro-btn-save">Save Settings</button>
                    </div>
                </form>
            </div>
            
            {/* 3. SECTIONS MANAGEMENT CARD */}
            <div className="pro-settings-card" style={{ marginTop: '0' }}>
                <div className="pro-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div><h3>My Classes & Students</h3><p>Manage your active sections or share them with colleagues.</p></div>
                    <button onClick={handleOpenAdd} style={{ background: '#38761d', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} title="Add New Section"><PlusIcon /></button>
                </div>

                {/* --- NEW "AI" SHAREABLE LINK SECTION --- */}
                {/* This container uses the new special CSS class */}
                <div className="pro-ai-share-container">
                    <div className="pro-ai-content-wrapper">
                        <div className="pro-ai-header">
                            <SparklesIcon className="ai-sparkle-icon" width="22" height="22" />
                            <h4>AI Smart-Share Faculty Link</h4>
                        </div>
                        <p className="pro-ai-desc">
                            Share this unique, secure link with other professors to grant temporary read access to your active student rosters across all sections.
                        </p>
                        <div className="pro-link-box">
                            <input 
                                type="text" 
                                className="pro-link-input"
                                value={generatedShareLink} 
                                readOnly 
                                onClick={(e) => e.target.select()} // Auto-select on click
                            />
                            <button 
                                className={`pro-btn-copy ${isCopied ? 'copied' : ''}`} 
                                onClick={handleCopyLink}
                            >
                                {isCopied ? <><CheckIcon /> Copied!</> : <><ClipboardIcon /> Copy Link</>}
                            </button>
                        </div>
                    </div>
                </div>
                {/* --------------------------------------- */}

                <div className="pro-sections-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {sections && sections.map(section => (
                        <div key={section.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '10px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
                                {/* Small Preview of Cover or Color */}
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '6px', 
                                    background: section.coverImage ? `url(${section.coverImage}) center/cover` : `${section.color}20`, 
                                    color: section.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 
                                }}>
                                    {!section.coverImage && section.name.charAt(0)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    <span style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{section.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{section.subtitle}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                                <button onClick={() => handleOpenEdit(section)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '6px' }} title="Edit"><EditIcon /></button>
                                <button onClick={() => handleDeleteSection(section.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '6px' }} title="Remove"><TrashIcon /></button>
                            </div>
                        </div>
                    ))}
                </div>
                {(!sections || sections.length === 0) && (<div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', background: '#F9FAFB', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>No classes found. Add one to get started.</div>)}
            </div>


            {/* --- EDITOR MODAL (Overlay) --- */}
            {isModalOpen && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>{isEditMode ? 'Edit Section' : 'Add New Section'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XIcon /></button>
                        </div>
                        <form onSubmit={handleSaveSection}>
                            {/* CASCADING DROPDOWNS */}
                            <div className="filters-bar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                                
                                {/* 1. INSTITUTE Dropdown */}
                                <select className="select-filter" value={institute} onChange={handleInstituteChange}>
                                    <option value="">Select Institute</option>
                                    {institutes.map(inst => (
                                        <option key={inst} value={inst}>{inst}</option>
                                    ))}
                                </select>
                                
                                {/* 2. YEAR Dropdown */}
                                <select className="select-filter" value={year} onChange={handleYearChange} disabled={!institute}>
                                    <option value="">Select Year</option>
                                    {availableYears.map(yr => (
                                        <option key={yr} value={yr}>{yr}</option>
                                    ))}
                                </select>
                                
                                {/* 3. COURSES Dropdown (Filtered) */}
                                <select 
                                    className="select-filter" 
                                    value={course} 
                                    onChange={handleCourseChange} 
                                    disabled={!institute || !year || availableCourses.length === 0}
                                >
                                    <option value="">
                                        {year ? 'Select Course' : 'Select Year first'}
                                    </option>
                                    {availableCourses.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                
                                {/* 4. SECTIONS Dropdown (Filtered) */}
                                <select 
                                    className="select-filter" 
                                    value={section} 
                                    onChange={(e) => setSection(e.target.value)} 
                                    disabled={!institute || !year || !course || availableSections.length === 0}
                                >
                                    <option value="">
                                        {course ? 'Select Section' : 'Select Course first'}
                                    </option>
                                    {availableSections.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Description / Subject Input */}
                            <div className="pro-form-group" style={{ marginBottom: '1rem' }}>
                                <label>Description / Subject</label>
                                <input type="text" placeholder="e.g. Intro to Programming" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
                            </div>

                            {/* Cover Image Input */}
                            <div className="pro-form-group" style={{ marginBottom: '1.5rem' }}>
                                <label>Cover Image (Optional)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: '#F3F4F6', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid #D1D5DB' }}>
                                        <ImageIcon /> Upload Image
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                    {formImage && <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: `url(${formImage}) center/cover`, border: '1px solid #ddd' }}></div>}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="pro-btn-cancel">Cancel</button>
                                <button type="submit" className="pro-btn-save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Styles for Modal (Injected here for simplicity) */}
            <style>{`
                .pro-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
                .pro-modal-card { background: white; padding: 2rem; borderRadius: 12px; width: 400px; max-width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: popIn 0.2s ease-out; }
                .select-filter { padding: 10px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.9rem; background-color: white; width: 100%; }
                .select-filter:disabled { background-color: #F9FAFB; color: #9CA3AF; cursor: not-allowed; }
                @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default Profile;