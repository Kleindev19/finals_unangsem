// src/components/assets/Dashboard/AboutUsModal.jsx

import React from 'react';

// --- ICONS ---
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const CheckSquare = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>);
const BookOpen = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const Target = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const Users = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const Zap = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const HelpIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

// Helper function for UI Avatar fallback
const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name[0]?.toUpperCase() || 'U';
};

const AboutUsModal = ({ onClose, teamMembers }) => {
    
    // Card styling to match the screenshot's general aesthetic
    const cardStyle = {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E5E7EB'
    };

    // Style for the role badge
    const RoleBadge = ({ role, color }) => (
        <span style={{ 
            fontSize: '0.65rem', 
            fontWeight: '600',
            color: color, 
            backgroundColor: `${color}15`,
            padding: '0.15rem 0.5rem',
            borderRadius: '10px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginTop: '0.4rem'
        }}>{role}</span>
    );
    
    // Style for the main section title boxes
    const SectionHeader = ({ icon: Icon, title, subtitle, color = '#38761d' }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: color }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: `${color}15`, display: 'flex' }}>
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>{title}</h3>
                {subtitle && <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>{subtitle}</p>}
            </div>
        </div>
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1000,
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
            backdropFilter: 'blur(3px)',
            animation: 'fadeInOverlay 0.3s ease-out'
        }}>
            <div style={{
                backgroundColor: '#FDFDF5', width: '80%', minWidth: '900px', 
                height: '100%',
                display: 'flex', flexDirection: 'column', 
                boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.2)',
                animation: 'slideInRight 0.3s ease-out'
            }}>
                
                {/* Modal Header/Title Bar (Top of the page) */}
                <div style={{
                    padding: '1.5rem 2rem', borderBottom: '1px solid #E5E7EB',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HelpIcon style={{ width: '1.5rem', height: '1.5rem', color: '#38761d' }} />
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                                About Us
                            </h1>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>Learn more about the Student Progress Tracker System</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ 
                        background: 'none', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '50%', transition: 'background-color 0.2s'
                    }} title="Close">
                        <XIcon style={{ color: '#4B5563', width: '1.5rem', height: '1.5rem' }} />
                    </button>
                </div>
                
                {/* Modal Content - Scrollable Main Area */}
                <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Section 1: About the System & Mission/Vision (3-column layout) */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', // Using 4 columns for flexible sizing
                        gap: '2rem' 
                    }}>
                        
                        {/* 1. About the System (Takes 2 Columns) */}
                        <div style={{ ...cardStyle, gridColumn: 'span 2 / span 2' }}>
                            <SectionHeader icon={BookOpen} title="About the System" color="#10B981" />
                            <p style={{ color: '#4B5563', lineHeight: '1.6' }}>
                                The **Student Progress Tracker System** is a digital platform designed to help professors monitor, record, and assess student performance more efficiently.
                                It provides a centralized dashboard where instructors can track grades, attendance, class standings, and academic alerts in real time.
                            </p>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#1F2937' }}>This system aims to:</h4>
                            <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                                {['Simplify grading and record-keeping', 'Help identify at-risk students early', 'Provide accurate performance insights', 'Improve transparency and communication', 'Support academic decision-making'].map((item, index) => (
                                    <li key={index} style={{ color: '#4B5563', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <CheckSquare style={{ color: '#38761d', width: '16px', height: '16px', marginTop: '4px' }}/> 
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Mission and Vision (Each takes 1 Column) */}
                        <div style={{ gridColumn: 'span 2 / span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Mission */}
                            <div style={cardStyle}>
                                <SectionHeader icon={Zap} title="Our Mission" color="#F97316" />
                                <p style={{ color: '#4B5563', lineHeight: '1.6' }}>
                                    To empower educators with easy-to-use digital tools that streamline academic monitoring, support continuous learning, and enhance student success.
                                </p>
                            </div>
                            
                            {/* Vision */}
                            <div style={cardStyle}>
                                <SectionHeader icon={Target} title="Vision" color="#3B82F6" />
                                <p style={{ color: '#4B5563', lineHeight: '1.6' }}>
                                    A school community where technology strengthens teaching, helps students thrive, and makes academic data accessible, organized, and meaningful.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Meet the Developers */}
                    <div style={cardStyle}>
                        <SectionHeader icon={Users} title="Meet the Developers" color="#6366F1" />
                        
                        {/* Developers Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                            {teamMembers.map((member, index) => (
                                <div key={index} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                                    padding: '1rem', 
                                    backgroundColor: '#F9FAFB', 
                                    textAlign: 'center',
                                    transition: 'transform 0.2s',
                                    borderRadius: '8px' 
                                }}>
                                    {/* Profile Picture */}
                                    <div style={{ position: 'relative', width: '90px', height: '90px', marginBottom: '0.75rem' }}>
                                        <img 
                                            src={member.imageUrl || `https://ui-avatars.com/api/?name=${getInitials(member.name)}&background=${member.color.replace('#','')}&color=fff&size=128&bold=true`}
                                            alt={member.name} 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                borderRadius: '50%', 
                                                objectFit: 'cover', 
                                                border: '4px solid white', 
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                                            }}
                                        />
                                    </div>

                                    <span style={{ fontWeight: '700', color: '#1F2937', fontSize: '1rem', lineHeight: '1.2' }}>{member.name}</span>
                                    <RoleBadge role={member.role} color={member.color} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Why We Built This */}
                    <div style={cardStyle}>
                        <SectionHeader icon={Zap} title="Why We Built This" color="#EF4444" />
                        <p style={{ color: '#4B5563', lineHeight: '1.6' }}>
                            We developed this system as part of our academic project to address real challenges faced by educators:
                            manual recording, inconsistent grade tracking, and difficulty identifying students who need additional support.
                        </p>
                        <p style={{ color: '#4B5563', lineHeight: '1.6', marginTop: '1rem' }}>
                            Our goal is to create a functional, helpful tool that can be expanded and improved in the future.
                        </p>
                    </div>

                    {/* Version Footer */}
                    <div style={{ textAlign: 'left', marginTop: '1rem', marginBottom: '1rem', color: '#9CA3AF', fontSize: '0.8rem' }}>
                        V8.1.0 232408 Build
                    </div>

                </div>
            </div>
            {/* Keyframe styles for animations */}
            <style>{`
                @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `}</style>
        </div>
    );
};

export default AboutUsModal;