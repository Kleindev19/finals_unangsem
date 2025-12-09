// src/components/assets/Loginsignin/LandingPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import CdmLogo from './cdmm.png'; 
// NOTE: Make sure the path to CdmLogo is correct.

// Import individual developer images (Place these files in the same folder as this JSX file)
import MarryAnnNediaImg from './Marry Ann Nedia.jpg';
import JoshLanderFerreraImg from './Josh Lander Ferrera.jpg';
import MarvhenneKleinOrtegaImg from './Marvhenne Klein Ortega.jpg';
import EdwardMarcelinoImg from './Edward Marcelino.jpg';
import VhyanccaTablonImg from './Vhyancca Tablon.jpg'; // Corrected name used
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

const LandingPage = ({ onGetStarted }) => {
    
    // CAROUSEL STATE AND LOGIC
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const delay = 5000; // Slide changes every 5 seconds (5000 milliseconds)

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // --- AUTO-SLIDING LOGIC ---
    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    // Cycle back to 0 when the last developer is reached
                    prevIndex === developers.length - 1 ? 0 : prevIndex + 1
                ),
            delay
        );

        return () => {
            resetTimeout(); // Cleanup on unmount or before effect runs again
        };
    }, [currentIndex]);
    
    // --- ANIMATION ON SCROLL LOGIC ---
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 }); 

        const hiddenElements = document.querySelectorAll('.animate-on-scroll');
        hiddenElements.forEach((el) => observer.observe(el));
        
        return () => hiddenElements.forEach(el => observer.unobserve(el));
    }, []);

    // Calculate the translation style for the carousel track
    const trackStyle = {
        transform: `translateX(-${currentIndex * 100}%)`,
    };

    return (
        <div className="landing-container">
            
            {/* HERO/HEADER SECTION */}
            <header className="hero-section">
                <nav className="navbar">
                    <img src={CdmLogo} alt="CDM Logo" className="nav-logo"/>
                    <button className="nav-login-btn" onClick={onGetStarted}>Login Portal</button>
                </nav>
                
                <div className="hero-content animate-on-scroll">
                    <h1>✅ ABOUT US – <br/><span className="highlight">Student Progress Tracker System</span></h1>
                    <p>Learn more about our mission to streamline academic monitoring and support student success.</p>
                    <button className="cta-button" onClick={onGetStarted}>
                        Access Portal
                    </button>
                </div>
            </header>

            {/* 1. ABOUT THE SYSTEM (Placeholder content) */}
            <section className="content-section about-system-section animate-on-scroll">
                 <h2 className="section-title">📊 About the System</h2>
                 <div className="text-block">
                    <p>The Student Progress Tracker System is designed to provide teachers, administrators, and parents with real-time insights into student performance. This centralized platform aims to enhance communication and facilitate proactive intervention strategies.</p>
                    <div className="system-goals">
                        <h4>Key Goals:</h4>
                        <ul>
                            <li>Centralized data management.</li>
                            <li>Automated progress reports.</li>
                            <li>Identification of at-risk students.</li>
                            <li>Secure data access.</li>
                            <li>Efficient communication channels.</li>
                            <li>Compliance with educational standards.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 2. MISSION & VISION (Placeholder content) */}
            <section className="content-section mission-vision-section animate-on-scroll">
                <div className="mission-box">
                    <h3>Our Mission</h3>
                    <p>To provide an intuitive and powerful platform that empowers educators to effectively monitor, analyze, and support the academic journey of every student, fostering a data-driven approach to educational success.</p>
                </div>
                <div className="vision-box">
                    <h3>Our Vision</h3>
                    <p>To be the leading progress tracking solution for educational institutions, known for reliability, security, and the ability to significantly improve student outcomes through actionable insights.</p>
                </div>
            </section>


            {/* 3. THE DEVELOPERS - AUTO CAROUSEL WITH IMAGES */}
            <section className="content-section developers-section animate-on-scroll">
                <h2 className="section-title">👨‍💻 The Developers</h2>
                <p className="developer-intro">Meet the dedicated team behind the Student Progress Tracker System.</p>
                
                {/* CAROUSEL STRUCTURE */}
                <div className="developer-carousel-window">
                    <div className="developer-carousel-track" style={trackStyle}>
                        {developers.map((dev, index) => (
                            <div key={index} className="developer-carousel-card">
                                <img 
                                    src={dev.image} 
                                    alt={dev.name} 
                                    className="dev-profile-picture"
                                />
                                <h3>{dev.name}</h3>
                                <p className="dev-role-carousel">{dev.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* INDICATORS (Clickable for manual override) */}
                <div className="carousel-indicators">
                    {developers.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        ></div>
                    ))}
                </div>
            </section>
            {/* END DEVELOPERS CAROUSEL */}

            {/* 4. WHY WE BUILT THIS (Placeholder content) */}
            <section className="content-section why-built-section animate-on-scroll">
                <h2 className="section-title">💡 Why We Built This</h2>
                <div className="text-block">
                    <p>The project was initiated to address the common challenges faced by Colegio de Montalban: the lack of a unified, real-time mechanism for tracking student achievements and identifying those who require timely intervention. Our goal is to replace fragmented paper-based records with an integrated digital solution.</p>
                    <p>By digitizing this process, we aim to free up administrative and teaching staff to focus more on instruction and mentorship, ultimately leading to improved educational efficiency and higher student retention rates.</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <p>&copy; 2024 Colegio de Montalban. All rights reserved. | Student Progress Tracker System</p>
            </footer>
        </div>
    );
};

export default LandingPage;