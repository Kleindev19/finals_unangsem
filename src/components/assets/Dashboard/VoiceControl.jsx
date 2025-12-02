// src/components/assets/Dashboard/VoiceControl.jsx

import React, { useState, useEffect, useRef } from 'react';

const VoiceControl = ({ isVoiceActive, onToggle, onPageChange }) => {
    const [isFading, setIsFading] = useState(false);
    const [voiceText, setVoiceText] = useState('');
    const [voiceStatus, setVoiceStatus] = useState('');

    // --- REFS ---
    const recognitionRef = useRef(null);
    const isVoiceActiveRef = useRef(isVoiceActive);
    const isFadingRef = useRef(isFading);

    // Keep refs synced with state/props
    useEffect(() => { isVoiceActiveRef.current = isVoiceActive; }, [isVoiceActive]);
    useEffect(() => { isFadingRef.current = isFading; }, [isFading]);

    // --- 1. INITIALIZE INSTANCE (Run Once) ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error("Browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        // --- EVENT HANDLERS ---
        
        recognition.onstart = () => {
            console.log("✅ Mic Started");
            if (isVoiceActiveRef.current) {
                setVoiceText("Listening...");
                setIsFading(false);
            }
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const command = event.results[i][0].transcript.trim().toLowerCase();
                    console.log("🗣️ Command:", command);
                    setVoiceText(command);
                    processVoiceCommand(command);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            if (interimTranscript) setVoiceText(interimTranscript);
        };

        recognition.onerror = (event) => {
            console.warn("⚠️ Mic Error:", event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone access denied. Check permissions.");
                onToggle(false);
            }
        };

        recognition.onend = () => {
            console.log("🛑 Mic Ended");
            // Only auto-restart if we want it active AND we are not currently fading out
            if (isVoiceActiveRef.current && !isFadingRef.current) {
                console.log("🔄 Auto-restarting Mic...");
                try {
                    recognition.start();
                } catch (e) { /* ignore */ }
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
        };
    }, []); 

    // --- 2. HANDLE TOGGLE ---
    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isVoiceActive) {
            try {
                recognition.start();
            } catch (e) {
                console.log("Mic already active...");
            }
        } else {
            recognition.stop();
            setVoiceText('');
            setVoiceStatus('');
            setIsFading(false);
        }
    }, [isVoiceActive]);

    // --- COMMAND LOGIC ---
    const processVoiceCommand = (command) => {
        let taskExecuted = false;

        // --- COMMANDS ---
        if (command.includes('dashboard') || command.includes('home')) {
            onPageChange('dashboard');
            taskExecuted = true;
        } else if (command.includes('report') || command.includes('grades')) {
            onPageChange('reports');
            taskExecuted = true;
        } else if (command.includes('profile') || command.includes('settings')) {
            onPageChange('profile');
            taskExecuted = true;
        } else if (command.includes('student') || command.includes('list')) {
            onPageChange('view-studs');
            taskExecuted = true;
        } else if (command.includes('scroll down')) {
            window.scrollBy({ top: 500, behavior: 'smooth' });
            taskExecuted = true;
        } else if (command.includes('scroll up')) {
            window.scrollBy({ top: -500, behavior: 'smooth' });
            taskExecuted = true;
        } else if (command.includes('stop') || command.includes('exit')) {
            handleStopSequence("Deactivating...");
            return;
        }

        if (taskExecuted) {
            setVoiceStatus('Task Done');
            // Trigger the long wait sequence
            handleStopSequence(null, true);
        }
    };

    const handleStopSequence = (msg = null, success = false) => {
        if (msg) setVoiceText(msg);

        // 1. Lock: Mark as fading immediately so the mic doesn't auto-restart
        isFadingRef.current = true; 

        // --- CONFIGURABLE TIMERS ---
        const WAIT_TIME = success ? 4000 : 1000; // Wait 4 seconds if success, 1s if manual stop
        const FADE_TIME = 2000;                  // 2 seconds for the slow fade animation

        // 2. Wait Phase (Keep overlay visible)
        setTimeout(() => {
            setIsFading(true); // Trigger CSS fade

            // 3. Cleanup Phase (After fade is done)
            setTimeout(() => {
                onToggle(false); // Turn off in App.js
                
                setVoiceText('');
                setVoiceStatus('');
                setIsFading(false);
                isFadingRef.current = false;
                
                if (recognitionRef.current) recognitionRef.current.stop();

            }, FADE_TIME); 

        }, WAIT_TIME); 
    };

    if (!isVoiceActive && !isFading) return null;

    return (
        <>
            {/* Overlay - Fade Duration set to 2s */}
            <div 
                className="voice-overlay"
                style={{ 
                    opacity: isFading ? 0 : 1, 
                    transition: 'opacity 2s ease-out' // SLOWER FADE
                }}
            >
                <span></span><span></span><span></span><span></span>
            </div>
            
            {/* Status Box - Fade Duration set to 2s */}
            <div style={{
                position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 100000, textAlign: 'center', pointerEvents: 'none', width: '80%', maxWidth: '500px',
                opacity: isFading ? 0 : 1, 
                transition: 'opacity 2s ease-out' // SLOWER FADE
            }}>
                <div style={{
                    color: '#4ade80', fontSize: '1.5rem', fontWeight: '600',
                    textShadow: '0 0 10px #4ade80, 0 0 20px rgba(0,0,0,0.5)', marginBottom: '0.5rem',
                    fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.5rem 1rem',
                    borderRadius: '8px', display: voiceText ? 'inline-block' : 'none'
                }}>
                    {voiceText ? `"${voiceText}"` : ''}
                </div>

                {voiceStatus && (
                    <div style={{ display: 'block', marginTop: '10px' }}>
                        <div style={{
                            color: '#FFFFFF', backgroundColor: '#4ade80', padding: '0.5rem 1.5rem',
                            borderRadius: '20px', fontWeight: '700', fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(74, 222, 128, 0.4)', display: 'inline-block',
                            animation: 'popIn 0.3s ease-out'
                        }}>
                            ✓ {voiceStatus}
                        </div>
                    </div>
                )}
            </div>
            <style>{`@keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
        </>
    );
};

export default VoiceControl;