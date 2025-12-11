// src/components/assets/Dashboard/ModalComponents.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import './ModalComponents.css';

// --- ICONS (Defined only ONCE at the top) ---
const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666'}}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const AlertTriangle = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 1rem auto' }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const GitIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="15"></line>
        <circle cx="18" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <path d="M18 9a9 9 0 0 1-9 9"></path>
    </svg>
);

// NEW ICON: MessageSquare for general updates (Now placed here)
const MessageSquare = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

// NEW ICON: CheckCircle for success/progress (Now placed here)
const CheckCircle = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

// NEW ICON: UserX for risk/intervention (Now placed here)
const UserX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="17" y1="17" x2="22" y2="22"/><line x1="22" y1="17" x2="17" y2="22"/>
    </svg>
);


// --- 1. ADD COLUMN MODAL ---
export const AddColumnModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-card">
                <button className="modal-close" onClick={onClose}><XIcon /></button>
                <h2 className="modal-title">Add Column</h2>
                
                <div className="modal-form-group">
                    <label>Button :</label>
                    <select className="modal-select">
                        <option value="" disabled selected>Select Type of Button</option>
                        <option>Attendance</option>
                        <option>Quiz</option>
                        <option>Activity</option>
                        <option>Assignment</option>
                    </select>
                </div>

                <div className="modal-form-group">
                    <label>Percentage :</label>
                    <select className="modal-select">
                        <option value="" disabled selected>Select</option>
                        <option>10%</option>
                        <option>20%</option>
                        <option>30%</option>
                    </select>
                </div>

                <div className="modal-form-group">
                    <label>Academic Term:</label>
                    <select className="modal-select">
                        <option value="" disabled selected>Select Term</option>
                        <option>Midterm</option>
                        <option>Finals</option>
                    </select>
                </div>

                <button className="modal-action-btn" onClick={() => { alert('Column Added!'); onClose(); }}>
                    Add Column
                </button>
            </div>
        </div>,
        document.body
    );
};

// --- 2. ADD STUDENT MODAL ---
export const AddStudentModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-card">
                <button className="modal-close" onClick={onClose}><XIcon /></button>
                <h2 className="modal-title">Add Student</h2>
                
                <div className="modal-form-group">
                    <label>Student # :</label>
                    <input type="text" placeholder="Enter Student Number" className="modal-input" />
                </div>

                <div className="modal-form-group">
                    <label>Student Name :</label>
                    <input type="text" placeholder="Enter Student Name" className="modal-input" />
                </div>

                <div className="modal-form-group">
                    <label>Type of student :</label>
                    <select className="modal-select">
                        <option value="" disabled selected>Select Term</option>
                        <option>Regular</option>
                        <option>Irregular</option>
                    </select>
                </div>

                <button className="modal-action-btn" onClick={() => { alert('Student Added!'); onClose(); }}>
                    Add Row
                </button>
            </div>
        </div>,
        document.body
    );
};

// --- 3. DYNAMIC ACTIVITY MODAL ---
export const ActivityModal = ({ isOpen, onClose, title }) => {
    if (!isOpen) return null;
    const displayTitle = title || "Activity";

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-card">
                <button className="modal-close" onClick={onClose}><XIcon /></button>
                <h2 className="modal-title">{displayTitle}</h2>
                
                <div className="modal-form-group">
                    <label>Date :</label>
                    <div style={{position: 'relative'}}>
                        <input type="text" placeholder="MM/DD/YYYY" className="modal-input" />
                        <CalendarIcon />
                    </div>
                </div>

                <div className="modal-form-group">
                    <label>Number of Item :</label>
                    <input type="text" placeholder="Enter Number of Items" className="modal-input" />
                </div>

                <button className="modal-action-btn" onClick={() => { alert(`${displayTitle} Column Added!`); onClose(); }}>
                    Add {displayTitle}
                </button>
            </div>
        </div>,
        document.body
    );
};

// --- 4. LOGOUT CONFIRMATION MODAL ---
export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-card" style={{ width: '350px', textAlign: 'center' }}>
                <button className="modal-close" onClick={onClose}><XIcon /></button>
                
                <AlertTriangle />
                
                <h2 className="modal-title" style={{ marginBottom: '0.5rem' }}>Log Out?</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Are you sure you want to exit the application?
                </p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="modal-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="modal-btn-danger" onClick={onConfirm}>
                        Yes, Log Out
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 5. VERSIONING / UPDATE MODAL ---
export const VersionModal = ({ isOpen, onClose, version, hash, date }) => {
    if (!isOpen) return null;

    const handleGithubClick = () => {
        window.open('https://github.com/Kleindev19/finals_unangsem/commits/main', '_blank');
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-card" style={{ width: '400px', textAlign: 'center', padding: '2.5rem' }}>
                <button className="modal-close" onClick={onClose}><XIcon /></button>
                
                <div style={{ 
                    width: '60px', height: '60px', 
                    borderRadius: '50%', background: '#DCFCE7', 
                    color: '#166534', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 1.5rem auto' 
                }}>
                    <GitIcon />
                </div>
                
                <h2 className="modal-title" style={{ marginBottom: '0.5rem' }}>System Update</h2>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    Current Build Information
                </p>

                <div style={{ 
                    background: '#F9FAFB', borderRadius: '12px', 
                    padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' 
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span style={{ color: '#6B7280', fontWeight: '600', fontSize: '0.9rem' }}>Version</span>
                        <span style={{ color: '#1F2937', fontWeight: '700', fontFamily: 'monospace' }}>v{version}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span style={{ color: '#6B7280', fontWeight: '600', fontSize: '0.9rem' }}>Build Hash</span>
                        <span style={{ color: '#1F2937', fontWeight: '700', fontFamily: 'monospace' }}>{hash}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6B7280', fontWeight: '600', fontSize: '0.9rem' }}>Build Date</span>
                        <span style={{ color: '#1F2937', fontWeight: '500', fontSize: '0.85rem' }}>{date}</span>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="modal-action-btn" onClick={handleGithubClick} style={{ marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <GitIcon /> View Updates on GitHub
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- 6. CREDITS / TRIBUTE MODAL (NEW) ---
export const CreditsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // REPLACE WITH YOUR TEAM
    const TEAM_MEMBERS = [
        { name: "Klein Dev", role: "Lead Developer", emoji: "💻" },
        { name: "John Doe", role: "UI/UX Designer", emoji: "🎨" },
        { name: "Jane Smith", role: "Backend Engineer", emoji: "⚙️" },
        { name: "Alex Ray", role: "Data Analyst", emoji: "📊" },
    ];

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-card" style={{ width: '450px', textAlign: 'center', padding: '2.5rem' }}>
                <button className="modal-close" onClick={onClose}><XIcon /></button>
                
                <h2 className="modal-title" style={{ marginBottom: '0.5rem', color: '#38761d' }}>The Minds Behind</h2>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    CDM Progress Tracker System
                </p>

                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    {TEAM_MEMBERS.map((member, index) => (
                        <div key={index} style={{ 
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            backgroundColor: 'white', padding: '1rem', borderRadius: '12px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB'
                        }}>
                            <div style={{ fontSize: '1.5rem', backgroundColor: '#F3F4F6', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {member.emoji}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: '700', color: '#1F2937' }}>{member.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#38761d', fontWeight: '600' }}>{member.role}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                    "Code is like humor. When you have to explain it, it's bad."
                </div>
            </div>
        </div>,
        document.body
    );
};


/** MOCK NOTIFICATION DATA **/
const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'progress', title: 'Q1 Scores Updated', message: 'Midterm Quiz 1 scores have been fully entered for BSIT 3A.', time: '2 minutes ago', icon: CheckCircle, color: '#10B981' },
    { id: 2, type: 'risk', title: 'Student Intervention Alert', message: 'Sarah K. has reached 3 absences in BSCS 1B.', time: '1 hour ago', icon: UserX, color: '#DC2626' },
    { id: 3, type: 'update', title: 'System Maintenance', message: 'A scheduled update is planned for 1 AM tomorrow.', time: '5 hours ago', icon: MessageSquare, color: '#F97316' },
    { id: 4, type: 'risk', title: 'Grade Warning: Low Grade', message: 'Mark T. has a calculated Midterm Grade of 68% in BSIT 3A.', time: 'Yesterday', icon: UserX, color: '#DC2626' },
];

const NotificationItem = ({ notif, onMarkRead }) => {
    const IconComponent = notif.icon;
    // Simple check to mark items with 'ago' in time as 'new'
    const isNew = notif.time.includes('ago'); 

    return (
        <div className="notif-item" style={{opacity: isNew ? 1 : 0.7, borderLeftColor: notif.color}}>
            <div className="notif-icon-box" style={{backgroundColor: `${notif.color}15`, color: notif.color}}>
                <IconComponent />
            </div>
            <div className="notif-content">
                <div className="notif-header">
                    <span className="notif-title">{notif.title}</span>
                    <span className="notif-time">{notif.time}</span>
                </div>
                <p className="notif-message">{notif.message}</p>
            </div>
            {isNew && <button className="notif-mark-read" onClick={() => onMarkRead(notif.id)}>Mark Read</button>}
        </div>
    );
}


// --- 7. NOTIFICATION MODAL (NEW) ---
export const NotificationModal = ({ isOpen, onClose }) => {
    // Use React.useState to manage the notifications list state
    const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

    if (!isOpen) return null;

    const handleMarkRead = (id) => {
        // Filter out the notification with the given ID
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    // Calculate unread count based on the 'ago' flag (simple mock logic)
    const unreadCount = notifications.filter(n => n.time.includes('ago')).length;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-card notif-modal-card">
                <button className="modal-close" onClick={onClose}><XIcon /></button>
                <h2 className="modal-title" style={{textAlign: 'left', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem', marginBottom: '1.5rem'}}>
                    Notifications 
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount} New</span>}
                </h2>
                
                <div className="notif-list">
                    {notifications.length === 0 ? (
                        <p style={{textAlign: 'center', color: '#6B7280', padding: '2rem 0'}}>You are all caught up!</p>
                    ) : (
                        notifications.map(notif => (
                            <NotificationItem 
                                key={notif.id} 
                                notif={notif} 
                                onMarkRead={handleMarkRead}
                            />
                        ))
                    )}
                </div>

                <button className="modal-action-btn" onClick={onClose} style={{marginTop: '2rem'}}>
                    Close
                </button>
            </div>
        </div>,
        document.body
    );
}