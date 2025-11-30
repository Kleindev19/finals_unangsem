// src/components/assets/Dashboard/ModalComponents.jsx

import React from 'react';
import ReactDOM from 'react-dom'; // <--- IMPORTANT IMPORT FOR THE FIX
import './ModalComponents.css';

// --- ICONS ---
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

// --- 1. ADD COLUMN MODAL ---
export const AddColumnModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    // We use Portal here too just in case you use this modal inside a constrained container later
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

// --- 4. LOGOUT CONFIRMATION MODAL (FIXED) ---
export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    // We use ReactDOM.createPortal to "teleport" this HTML to the document.body
    // ensuring it sits on top of EVERYTHING, regardless of the Sidebar's overflow:hidden.
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
        document.body // <--- This is the target destination
    );
};