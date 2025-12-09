// src/components/assets/Loginsignin/LandingPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import CdmLogo from './cdmm.png'; 

// Import Developer Images
import MarryAnnNediaImg from './Marry Ann Nedia.jpg';
import JoshLanderFerreraImg from './Josh Lander Ferrera.jpg';
import MarvhenneKleinOrtegaImg from './Marvhenne Klein Ortega.jpg';
import EdwardMarcelinoImg from './Edward Marcelino.jpg';
import VhyanccaTablonImg from './Vhyancca Tablon.jpg';
import JazonWilliamsChangImg from './Jazon Williams Chang.jpg';
import JonaMaeObordoImg from './Jona Mae Obordo.jpg';
import ShamellPeranteImg from './Shamell Perante.jpg';

const developers = [
    { name: "Marry Ann Nedia", role: "Project Leader", image: MarryAnnNediaImg },
    { name: "Josh Lander Ferrera", role: "Full Stack Developer", image: JoshLanderFerreraImg },
    { name: "Marvhenne Klein Ortega", role: "Full Stack Developer", image: MarvhenneKleinOrtegaImg },
    { name: "Edward Marcelino", role: "Full Stack Developer", image: EdwardMarcelinoImg },
    { name: "Vhyancca Tablon", role: "UI/Front-End Developer", image: VhyanccaTablonImg },
    { name: "Jazon Williams Chang", role: "UI/Front-End Developer", image: JazonWilliamsChangImg },
    { name: "Jona Mae Obordo", role: "Documentation", image: JonaMaeObordoImg },
    { name: "Shamell Perante", role: "Documentation", image: ShamellPeranteImg },
];

const features = [
    { title: "Centralized Data", desc: "A unified platform for all student academic records.", icon: "📂" },
    { title: "Real-time Reports", desc: "Instant generation of gradesheets and attendance analytics.", icon: "⚡" },
    { title: "Risk Identification", desc: "AI-driven flagging of at-risk students for early intervention.", icon: "🛡️" },
    { title: "Secure Access", desc: "Role-based security ensuring data privacy and integrity.", icon: "🔒" },
    { title: "Smart Sync", desc: "Seamless offline capability with automatic cloud syncing.", icon: "☁️" },
    { title: "Voice Control", desc: "Navigate the dashboard hands-free with voice commands.", icon: "🎙️" },
];

const LandingPage = ({ onGetStarted }) => {
    
    // --- ANIMATION OBSERVER ---
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const hiddenElements = document.querySelectorAll('.fade-in-up');
        hiddenElements.forEach((el) => observer.current.observe(el));

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    // --- SECURITY MODAL STATE ---
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    useEffect(() => {
        const logoutReason = sessionStorage.getItem('logoutReason');
        if (logoutReason === 'idle') {
            setShowSecurityModal(true);
            sessionStorage.removeItem('logoutReason'); 
        }
    }, []);

    // --- SCROLL HANDLER ---
    const scrollToAbout = () => {
        document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-container">
            {/* Background Animation Layer */}
            <div className="animated-bg"></div>

            {/* --- SECURITY POPUP MODAL --- */}
            {showSecurityModal && (
               <div className="security-modal-overlay">
                   <div className="security-modal-card">
                       <div className="security-icon-box">
                           <span>🛡️</span>
                       </div>
                       <h2 style={{color: '#1f2937', margin: '0 0 10px 0'}}>Security Alert</h2>
                       <p style={{color: '#6b7280', margin: '0 0 20px 0'}}>
                           You have been automatically logged out due to inactivity to protect your account data.
                       </p>
                       <button onClick={() => setShowSecurityModal(false)} className="security-btn">
                           Exit to Home
                       </button>
                   </div>
               </div>
            )}

            {/* NAVBAR */}
            <nav className="navbar fade-in-up">
                <img src={CdmLogo} alt="CDM Logo" className="nav-logo"/>
                <button className="nav-login-btn" onClick={onGetStarted}>Login Portal</button>
            </nav>

            {/* 1. HERO / OVERVIEW SECTION */}
            <header className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge fade-in-up">System Version 8.1.0</div>
                    <h1 className="hero-title fade-in-up delay-100">
                        Student progress <br/> <span>Tracker System</span>
                    </h1>
                    <p className="hero-subtitle fade-in-up delay-200">
                        The Smart Monitoring for
Student Success empowers educators with real-time data, AI-driven insights, and centralized record-keeping to ensure no student is left behind.
                    </p>
                    <div className="hero-cta-group fade-in-up delay-300">
                        <button className="btn-primary" onClick={onGetStarted}>Access Dashboard</button>
                        <button className="btn-secondary" onClick={scrollToAbout}>Learn More</button>
                    </div>
                </div>
                
                <div className="scroll-indicator" onClick={scrollToAbout} style={{cursor:'pointer'}}>
                    <span>Scroll Down</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
                </div>
            </header>

            {/* 2. ABOUT SYSTEM SECTION */}
            <section id="about-section" className="section-wrapper">
                <div className="section-header fade-in-up">
                    <span className="section-tag">Powerful Features</span>
                    <h2 className="section-title">Why We Built This</h2>
                    <p style={{color: '#6b7280', fontSize: '1.1rem', maxWidth:'600px', margin:'0 auto'}}>
                        To replace fragmented paper-based records with an integrated digital solution that frees up administrative time for actual mentorship.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, idx) => (
                        <div key={idx} className={`feature-card fade-in-up delay-${(idx % 3) * 100}`}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. DEVELOPERS SECTION */}
            <section className="developers-section">
                <div className="section-header fade-in-up">
                    <span className="section-tag">The Team</span>
                    <h2 className="section-title">Meet the Minds</h2>
                    <p style={{color: '#6b7280'}}>The dedicated development team behind the system.</p>
                </div>

                <div className="dev-grid">
                    {developers.map((dev, idx) => (
                        <div key={idx} className={`dev-card fade-in-up delay-${(idx % 4) * 100}`}>
                            <div className="dev-img-container">
                                <img src={dev.image} alt={dev.name} className="dev-img" />
                            </div>
                            <h4>{dev.name}</h4>
                            <p>{dev.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{textAlign: 'center', padding: '2rem', background: '#38761d', color: 'white'}}>
                <p style={{opacity: 0.8, fontSize: '0.9rem'}}>&copy; 2024 Colegio de Montalban. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;