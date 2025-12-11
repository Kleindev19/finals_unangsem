// src/components/assets/Dashboard/VoiceControl.jsx

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { analyzeVoiceCommand } from '../../../Apps'; // Import the Brain

const VoiceControl = forwardRef(({ isVoiceActive, onToggle, onPageChange }, ref) => {
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

    // --- TEXT TO SPEECH FUNCTION ---
    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
            v.name.includes("Google US English") || 
            v.name.includes("Samantha") || 
            v.name.includes("Microsoft Zira")
        );
        
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0; 
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
    };

    useImperativeHandle(ref, () => ({
        speak: (text) => speak(text)
    }));

    // --- 1. INITIALIZE INSTANCE ---
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
                    const command = event.results[i][0].transcript.trim();
                    console.log("🗣️ User said:", command);
                    setVoiceText(command);
                    processVoiceCommand(command); // Send to AI
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
            if (isVoiceActiveRef.current && !isFadingRef.current) {
                try { recognition.start(); } catch (e) { /* ignore */ }
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
                speak("Voice system online.");
            } catch (e) { console.log("Mic already active..."); }
        } else {
            recognition.stop();
            setVoiceText('');
            setVoiceStatus('');
            setIsFading(false);
            window.speechSynthesis.cancel(); 
        }
    }, [isVoiceActive]);

    // --- COMMAND LOGIC (AI POWERED) ---
    const processVoiceCommand = async (commandText) => {
        // 1. Send text to Brain (Apps.jsx)
        const result = await analyzeVoiceCommand(commandText);

        if (result.success) {
            try {
                // 2. Extract JSON from response
                const jsonMatch = result.text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("No JSON found");
                
                const cmd = JSON.parse(jsonMatch[0]);
                console.log("🤖 AI Command:", cmd);
                
                let taskExecuted = false;

                // 3. Execute Actions
                if (cmd.action === 'NAVIGATE') {
                    onPageChange(cmd.target);
                    taskExecuted = true;
                } 
                else if (cmd.action === 'LOCATE') {
                    // Dispatch custom event for ViewStuds to catch
                    const ev = new CustomEvent('CDM_LOCATE_STUDENT', { detail: cmd.query });
                    window.dispatchEvent(ev);
                    taskExecuted = true;
                }
                else if (cmd.action === 'SCROLL') {
                     if (cmd.direction === 'down') window.scrollBy({ top: 500, behavior: 'smooth' });
                     else window.scrollBy({ top: -500, behavior: 'smooth' });
                     taskExecuted = true;
                }
                else if (cmd.action === 'STOP') {
                    speak(cmd.reply);
                    handleStopSequence("Goodbye.");
                    return;
                }

                // 4. Feedback
                if (cmd.reply) speak(cmd.reply);
                if (taskExecuted) {
                    setVoiceStatus('Task Done');
                    handleStopSequence(null, true); // Visual feedback only, don't stop mic
                }

            } catch (e) {
                console.error("AI Parse Error:", e);
                speak("I'm sorry, I didn't understand that.");
            }
        }
    };

    const handleStopSequence = (msg = null, success = false) => {
        if (msg) setVoiceText(msg);

        // If manual stop, lock mic immediately. If success, just visual fade.
        if (!success) isFadingRef.current = true; 

        const WAIT_TIME = success ? 4000 : 1000; 
        const FADE_TIME = 2000;                  

        setTimeout(() => {
            setIsFading(true); 

            setTimeout(() => {
                // Only fully stop if it wasn't just a success message
                if (!success) {
                    onToggle(false); 
                    if (recognitionRef.current) recognitionRef.current.stop();
                }
                
                setVoiceText('');
                setVoiceStatus('');
                setIsFading(false);
                if (!success) isFadingRef.current = false;
                
            }, FADE_TIME); 

        }, WAIT_TIME); 
    };

    if (!isVoiceActive && !isFading) return null;

    return (
        <>
            <div 
                className="voice-overlay"
                style={{ 
                    opacity: isFading ? 0 : 1, 
                    transition: 'opacity 2s ease-out' 
                }}
            >
                <span></span><span></span><span></span><span></span>
            </div>
            
            <div style={{
                position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 100000, textAlign: 'center', pointerEvents: 'none', width: '80%', maxWidth: '500px',
                opacity: isFading ? 0 : 1, 
                transition: 'opacity 2s ease-out'
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
});

export default VoiceControl;