// src/components/assets/Dashboard/VoiceControl.jsx

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { analyzeVoiceCommand } from '../../../Apps'; 

const VoiceControl = forwardRef(({ isVoiceActive, onToggle, onPageChange, students = [] }, ref) => {
    const [isFading, setIsFading] = useState(false);
    const [voiceText, setVoiceText] = useState('');
    const [voiceStatus, setVoiceStatus] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const recognitionRef = useRef(null);
    const isVoiceActiveRef = useRef(isVoiceActive);
    const isFadingRef = useRef(isFading);
    
    // ✅ Keep a "Live Reference" to ensure we access the latest student list
    const studentsRef = useRef(students);

    useEffect(() => {
        studentsRef.current = students;
    }, [students]);

    useEffect(() => { isVoiceActiveRef.current = isVoiceActive; }, [isVoiceActive]);
    useEffect(() => { isFadingRef.current = isFading; }, [isFading]);

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // --- START NEW VOICE PREFERENCE LOGIC ---
        const userPreferredVoiceName = localStorage.getItem('ttsVoiceName');
        const userPreferredLanguage = localStorage.getItem('ttsLanguage') || 'en-US'; 
        
        utterance.lang = userPreferredLanguage;

        const loadVoicesAndSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            
            // 1. Try to find the user's preferred voice by name
            const selectedVoice = voices.find(v => v.name === userPreferredVoiceName);
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            } else {
                // 2. Fallback logic (uses language preference, then searches for smart defaults)
                const preferredVoice = voices.find(v => 
                    v.lang === userPreferredLanguage || 
                    v.name.includes("Google") || 
                    v.name.includes("Zira") || 
                    v.name.includes("Samantha")
                );
                if (preferredVoice) utterance.voice = preferredVoice;
            }
            
            window.speechSynthesis.speak(utterance);
        };

        // Standard way to handle voices loaded asynchronously
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = loadVoicesAndSpeak;
        } else {
            loadVoicesAndSpeak(); // Try immediate execution
        }
        // --- END NEW VOICE PREFERENCE LOGIC ---
    };

    useImperativeHandle(ref, () => ({ speak: (text) => speak(text) }));

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onstart = () => {
            if (isVoiceActiveRef.current) {
                setVoiceText("Listening...");
                setIsFading(false);
            }
        };

        recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const command = event.results[i][0].transcript.trim();
                    if (command.length > 2) { 
                        setVoiceText(command);
                        processVoiceCommand(command);
                    }
                }
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') onToggle(false);
        };

        recognition.onend = () => {
            if (isVoiceActiveRef.current && !isFadingRef.current) {
                try { recognition.start(); } catch (e) {}
            }
        };

        recognitionRef.current = recognition;
        
        // ✅ FIX 1: Access .current before calling abort()
        return () => { 
            if (recognitionRef.current) recognitionRef.current.abort(); 
        };
    }, []); 

    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;
        if (isVoiceActive) {
            try { recognition.start(); speak("Online."); } catch (e) {}
        } else {
            // FIX 2: Ensure .current is used here too
            if (recognitionRef.current) recognitionRef.current.stop();
            setVoiceText('');
            setVoiceStatus('');
            setIsFading(false);
            window.speechSynthesis.cancel(); 
        }
    }, [isVoiceActive]);

    const processVoiceCommand = async (commandText) => {
        if (isProcessing) return; 
        setIsProcessing(true);

        const result = await analyzeVoiceCommand(commandText);

        if (result.success) {
            try {
                if (result.text.includes("System busy")) throw new Error("Busy");

                const jsonMatch = result.text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("No JSON found");
                
                const cmd = JSON.parse(jsonMatch[0]);
                console.log("🤖 AI Action:", cmd);
                
                let taskExecuted = false;

                if (cmd.action === 'NAVIGATE') {
                    onPageChange(cmd.target);
                    speak(cmd.reply);
                    taskExecuted = true;
                } 
                else if (cmd.action === 'LOCATE') {
                    const currentStudents = studentsRef.current;

                    if (!currentStudents || currentStudents.length === 0) {
                        speak("I don't have the student list yet. Please wait a moment.");
                        setIsProcessing(false);
                        return;
                    }

                    const query = cmd.query.toLowerCase();

                    // Enhanced Fuzzy Search Logic
                    const targetStudent = currentStudents.find(s => {
                        const sName = s.name.toLowerCase();
                        const sId = s.id.toString().toLowerCase();
                        if (sName.includes(query) || sId.includes(query)) return true;
                        const nameParts = sName.split(' ');
                        return nameParts.some(part => part.length > 2 && query.includes(part));
                    });

                    if (targetStudent && targetStudent.section) {
                        console.log(`📍 Found ${targetStudent.name} in ${targetStudent.section}`);
                        speak(`Locating ${targetStudent.name}...`);
                        
                        // ✅ FIX: Create a robust section payload
                        // We send 'name', 'id', and 'title' to ensure the Dashboard picks it up correctly
                        const sectionPayload = { 
                            name: targetStudent.section, 
                            id: targetStudent.section, // Fallback ID
                            title: targetStudent.section, // Fallback Title
                            subtitle: `Course: ${targetStudent.course} • ${targetStudent.year || 'Student'}` 
                        };

                        onPageChange('view-studs', sectionPayload);

                        // Dispatch event after a delay to ensure ViewStuds is mounted and ready
                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('CDM_LOCATE_STUDENT', { detail: targetStudent.name }));
                        }, 800);
                        
                        taskExecuted = true;
                    } else {
                        speak(`I couldn't find anyone named ${cmd.query}.`);
                    }
                }
                else if (cmd.action === 'SCROLL') {
                     window.scrollBy({ top: cmd.direction === 'down' ? 500 : -500, behavior: 'smooth' });
                     taskExecuted = true;
                }
                else if (cmd.action === 'STOP') {
                    speak(cmd.reply);
                    handleStopSequence("Goodbye.");
                    setIsProcessing(false);
                    return;
                }

                if (taskExecuted) {
                    setVoiceStatus('Done');
                    handleStopSequence(null, true); 
                }

            } catch (e) {
                console.warn("Skipped:", e.message);
            }
        }
        
        setTimeout(() => setIsProcessing(false), 1000);
    };

    const handleStopSequence = (msg = null, success = false) => {
        if (msg) setVoiceText(msg);
        if (!success) isFadingRef.current = true; 

        setTimeout(() => {
            setIsFading(true); 
            setTimeout(() => {
                if (!success) {
                    onToggle(false); 
                    // FIX 3: Ensure .current is used here too
                    if (recognitionRef.current) recognitionRef.current.stop();
                }
                setVoiceText('');
                setVoiceStatus('');
                setIsFading(false);
                if (!success) isFadingRef.current = false;
            }, 2000); 
        }, success ? 2500 : 1000); 
    };

    if (!isVoiceActive && !isFading) return null;

    return (
        <>
            <div className="voice-overlay" style={{ opacity: isFading ? 0 : 1, transition: 'opacity 2s ease-out' }}>
                <span></span><span></span><span></span><span></span>
            </div>
            <div style={{
                position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 100000, textAlign: 'center', pointerEvents: 'none', width: '80%', maxWidth: '500px',
                opacity: isFading ? 0 : 1, transition: 'opacity 2s ease-out'
            }}>
                {voiceText && <div style={{
                    color: '#4ade80', fontSize: '1.5rem', fontWeight: '600',
                    textShadow: '0 0 10px #4ade80, 0 0 20px rgba(0,0,0,0.5)', marginBottom: '0.5rem',
                    fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.5rem 1rem',
                    borderRadius: '8px', display: 'inline-block'
                }}>"{voiceText}"</div>}
                {voiceStatus && <div style={{ marginTop: '10px', color: '#fff', backgroundColor: '#4ade80', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', display: 'inline-block' }}>✓ {voiceStatus}</div>}
            </div>
        </>
    );
});

export default VoiceControl;