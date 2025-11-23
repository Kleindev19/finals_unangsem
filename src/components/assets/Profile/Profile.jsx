// src/components/assets/Profile/Profile.jsx

import React, { useState, useEffect } from 'react';
import './Profile.css';
// NOTE: We rely on profileData being passed as a prop from App.js

// Inline SVG Icons (Lucide-react inspired)
const TrophyIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V22"/><path d="M14 14.66V22"/><path d="M8 9h8"/><path d="M12 2v10.5"/></svg>);
const FileTextIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>);
const UsersIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);

// Helper function to get initials for the fallback avatar
const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.split(' ').filter(p => p); // Filter out empty strings from multiple spaces
    
    if (parts.length >= 2) {
        // Use first letter of first name and first letter of last name
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    // Otherwise, just use the first letter of the first name
    return parts[0][0].toUpperCase();
}


const Profile = ({ profileData }) => {
    
    // --- HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP (Fixes ESLint error) ---
    const [name, setName] = useState(profileData?.displayName || 'User Name');
    const [email, setEmail] = useState(profileData?.email || 'user@school.edu.ph');
    const [id, setId] = useState(profileData?.id || profileData?.uid || '');
    const [role, setRole] = useState(profileData?.role || 'Administrator');

    // Use a useEffect hook to update local state if the prop changes
    useEffect(() => {
        if (profileData) {
            setName(profileData.displayName || 'User Name');
            setEmail(profileData.email || 'user@school.edu.ph');
            setId(profileData.id || profileData.uid || '');
            setRole(profileData.role || 'Administrator');
        }
    }, [profileData]);
    // -----------------------------------------------------------------------------

    // --- CONDITIONAL RETURN (Loading State) AFTER ALL HOOKS ---
    if (!profileData) {
        return (
            <div className="profile-page" style={{textAlign: 'center', padding: '5rem', fontFamily: 'Inter'}}>
                <h1>Loading Profile...</h1>
                <p>Please wait while your user details are loaded.</p>
            </div>
        );
    }
    // -------------------------------------------------------------

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        alert(`Profile Update Placeholder: Updating information for ${name}... (Functionality to be added later)`);
        // TODO: Add actual update logic (e.g., call a passed-down update function that calls the API)
    };

    // Calculate initials for the fallback avatar
    const initials = getInitials(name);
    
    // Placeholder data derived from pre-loaded stats
    const reportsCount = profileData.stats?.reportsGenerated || 45; 
    const totalUsers = profileData.stats?.totalSystemUsers || 540;
    const activeSections = profileData.stats?.activeSectionsManaged || 12;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>User Profile</h1>
            </div>

            <div className="profile-content">
                
                {/* Left Column: User Info Card */}
                <div className="user-info-card">
                    <img 
                        // --- FIXED: Use actual photoURL, or a placeholder with the user's initials ---
                        src={profileData.photoURL || `https://via.placeholder.com/100/38761d/FFFFFF?text=${initials}`}
                        alt={`${name}'s Profile Avatar`} 
                        className="profile-avatar"
                    />
                    <h2>{name}</h2>
                    <p>{email}</p>
                    <p>ID: **{id}**</p>
                    <span className="user-role">{role}</span>
                </div>

                {/* Right Column: Details and Settings */}
                <div className="profile-details-area">
                    
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <FileTextIcon style={{ color: '#38761d', marginBottom: '0.5rem' }} />
                            <div className="label">Reports Generated (This Month)</div>
                            <div className="value">{reportsCount}</div>
                        </div>
                        <div className="stat-card">
                            <TrophyIcon style={{ color: '#38761d', marginBottom: '0.5rem' }} />
                            <div className="label">Total System Users</div>
                            <div className="value">{totalUsers}</div>
                        </div>
                        <div className="stat-card">
                            <UsersIcon style={{ color: '#38761d', marginBottom: '0.5rem' }} />
                            <div className="label">Active Sections Managed</div>
                            <div className="value">{activeSections}</div>
                        </div>
                    </div>

                    {/* Settings/Update Card */}
                    <div className="settings-card">
                        <h3>Update Profile Information</h3>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label htmlFor="profile-name">Full Name</label>
                                <input 
                                    id="profile-name"
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profile-email">Email Address</label>
                                <input 
                                    id="profile-email"
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Role (View Only)</label>
                                <input type="text" value={role} disabled style={{ backgroundColor: '#f9fafb' }} />
                            </div>
                            <button type="submit" className="update-btn">
                                Save Changes
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;