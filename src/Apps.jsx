// src/Apps.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- ICONS ---
const BotIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
        <path d="M12 17v4"/>
        <path d="M8 21h8"/>
        <path d="M5 14h14"/>
    </svg>
);

const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

const SendIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
);

// --- ADVANCED SECURITY LAYER (Obfuscated) ---
const _SECURE_CHUNKS = [
    "TTRVUmJqeHJGUi1oLWctdjFPcGlFOFJaVjZTVW51eTJEeVNheklB", // Decodes to correct API Key
];

const _decryptSecureToken = () => {
    try {
        const _raw = _SECURE_CHUNKS.join('');
        const _decoded = atob(_raw);
        return _decoded.split('').reverse().join('');
    } catch (e) {
        console.error("Security Check Failed");
        return null;
    }
};

// --- TYPEWRITER COMPONENT (FIXED) ---
// We removed the dependency on previous state ((prev) => ...) to fix the skipping bug.
const TypewriterEffect = React.memo(({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        // 1. Reset state immediately
        setDisplayedText('');
        
        // 2. Use local variables to build the string (This fixes "Hllo" bug)
        let currentString = '';
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                currentString += text.charAt(currentIndex);
                setDisplayedText(currentString); // Set exact string, don't append blindly
                currentIndex++;
            } else {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, 20); // Slightly adjusted speed (20ms) for better reliability than 10ms

        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    const renderFormatted = (str) => {
        const parts = str.split(/(\*\*.*?\*\*|\n)/g).map((part, index) => {
            if (part === '\n') return <br key={index} />;
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
            if (part.startsWith('**')) return <span key={index}>{part}</span>;
            return part;
        });
        return <>{parts}</>;
    };

    return <p style={{ margin: 0, textAlign: 'left' }}>{renderFormatted(displayedText)}</p>;
});

// --- GEMINI API Configuration ---
const API_MODEL = "gemini-2.0-flash"; 

// --- UPDATED SYSTEM PROMPT (Taglish & Vibe Check) ---
const CDM_SYSTEM_PROMPT = `
You are 'Cidi', the official AI assistant for Colegio de Montalban (CDM).

**CORE PERSONALITY:**
1.  **Adaptable Vibe:** You MUST match the user's energy.
    * **Casual:** If they say "yo", "sup", "hi", or use slang, be chill and relatable. (e.g., "Yo! Musta? What do you need today?")
    * **Formal:** If they speak professionally, be polite and helpful. (e.g., "Good day! How may I assist you po?")
2.  **Language:** Speak in **Taglish** (English-heavy mix).
    * Use English for technical terms, but use Tagalog words like *po, opo, naman, lang, diba* to sound natural and friendly.
    * *Example:* "You can view your grades in the Dashboard. Check mo lang sa 'Academic Metrics' section."
3.  **Spelling Rule:** ALWAYS spell correctly. Never write "Hllo". It is "Hello".

**KNOWLEDGE BASE:**
* **Dashboard:** Landing page. Summarizes academic standing (GPA, Attendance) and announcements.
* **Reports:** For generating academic reports (filtered by Institute/Year/Section).
* **Profile:** For updating personal details, email, and password.
* **School Info:** CDM is in Rodriguez, Rizal. Known for courses like ICS, Education, and Business.

**GOAL:** Be the most helpful and relatable AI study buddy for CDM students.
`;

// --- CORE CHATBOT COMPONENT ---

const CdmChatbot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello! I am Cidi, your virtual assistant for Colegio de Montalban. Musta? How can I help you with the portal today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const callGeminiAPI = useCallback(async (currentHistory) => {
        const _token = _decryptSecureToken();
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${_token}`;
        
        const contents = currentHistory.map(msg => ({ 
            role: msg.role === 'bot' ? 'model' : 'user', 
            parts: [{ text: msg.text }] 
        }));

        const payload = {
            contents: contents, 
            systemInstruction: { parts: [{ text: CDM_SYSTEM_PROMPT }] },
        };

        const MAX_RETRIES = 3;
        let attempt = 0;
        let finalResult = null;
        let lastError = null;

        while (attempt < MAX_RETRIES) {
            attempt++;
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok) {
                    const candidate = result.candidates?.[0];
                    if (candidate && candidate.content?.parts?.[0]?.text) {
                        const text = candidate.content.parts[0].text;
                        finalResult = { text, sources: [] };
                        break; 
                    } else {
                        finalResult = { text: "Pasensya na, I didn't catch that. Pwede pakiclarify?", sources: [] };
                        break;
                    }
                } else {
                    lastError = `Server Busy (Status ${response.status}). Retrying...`;
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                lastError = `Network Error: ${error.message}.`;
                if (attempt === MAX_RETRIES) break; 
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        return finalResult || { text: `Service unavailable: ${lastError}`, sources: [] };
    }, []); 

    const handleSendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);
        setError(''); 

        const currentHistory = [...messages, { role: 'user', text: userMessage }];
        setMessages(currentHistory);

        const { text: botResponseText } = await callGeminiAPI(currentHistory);

        let fullBotResponse = botResponseText;
        
        setMessages(prevMessages => [...prevMessages, { role: 'bot', text: fullBotResponse }]);
        setIsLoading(false);
    }, [input, isLoading, messages, callGeminiAPI]); 

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };

    const renderStaticText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|\n)/g).map((part, index) => {
            if (part === '\n') return <br key={index} />;
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
            return part;
        });
        return <p style={{ margin: 0, textAlign: 'left' }}>{parts}</p>;
    };

    return (
        <div className="chatbot-container">
            <style>
                {`
                    .chatbot-container {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 10000;
                        font-family: 'Inter', sans-serif;
                    }
                    .chatbot-toggle {
                        width: 60px; height: 60px;
                        border-radius: 50%;
                        background-color: #38761d;
                        color: white; border: none;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                        cursor: pointer;
                        display: flex; justify-content: center; align-items: center;
                        transition: transform 0.2s;
                    }
                    .chatbot-toggle:hover { transform: scale(1.05); background-color: #275d13; }
                    
                    .chatbot-widget {
                        width: 350px; height: 500px;
                        display: flex; flex-direction: column;
                        background: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
                        overflow: hidden;
                    }
                    @media (max-width: 400px) { .chatbot-widget { width: 90vw; height: 80vh; } }

                    .chat-header {
                        background-color: #38761d; color: white;
                        padding: 15px;
                        display: flex; justify-content: space-between; align-items: center;
                        font-weight: 600;
                    }
                    .chat-header button { background: none; border: none; color: white; cursor: pointer; }

                    .chat-messages {
                        flex-grow: 1; padding: 15px;
                        overflow-y: auto;
                        background-color: #f7f7f7;
                        display: flex; flex-direction: column; gap: 12px;
                    }
                    
                    .chat-message {
                        max-width: 80%; padding: 12px 16px;
                        border-radius: 18px; line-height: 1.5; font-size: 0.9rem;
                        position: relative; word-wrap: break-word;
                        text-align: left !important;
                    }
                    
                    .chat-message.user {
                        align-self: flex-end; background-color: #d1e7dd; color: #0c4a45;
                        border-bottom-right-radius: 2px;
                    }
                    
                    .chat-message.bot {
                        align-self: flex-start; background-color: #e0f2f1; color: #004d40;
                        border-bottom-left-radius: 2px;
                    }

                    .chat-message strong { font-weight: 700; color: #00332a; }
                    .chat-message a { color: #00796b; text-decoration: underline; }

                    /* Typing Dots */
                    .typing-dots { display: flex; align-items: center; padding: 8px 0; }
                    .typing-dots span {
                        height: 6px; width: 6px; margin: 0 2px;
                        background-color: #00695c; border-radius: 50%;
                        animation: bounce 1.4s infinite ease-in-out both;
                    }
                    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
                    @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }

                    .chat-input-area {
                        display: flex; padding: 10px;
                        border-top: 1px solid #eee; background-color: white;
                    }
                    .chat-input-area input {
                        flex-grow: 1; padding: 10px 14px;
                        border: 1px solid #ddd; border-radius: 24px;
                        margin-right: 10px; outline: none;
                    }
                    .chat-input-area input:focus { border-color: #38761d; }
                    .chat-input-area .send-btn {
                        width: 36px; height: 36px;
                        border-radius: 50%;
                        background-color: #38761d; color: white;
                        border: none; cursor: pointer;
                        display: flex; justify-content: center; align-items: center;
                    }
                    
                    .error-message { color: #d9534f; text-align: center; font-size: 0.8rem; margin-bottom: 5px; }
                `}
            </style>
            
            {isChatOpen ? (
                <div className="chatbot-widget">
                    <div className="chat-header">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>Cidi</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: '400', opacity: '0.85' }}>Colegio de Montalban AI</span>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} style={{ display: 'flex' }}>
                            <XIcon width="24" height="24" />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => {
                            const isLast = index === messages.length - 1;
                            const isBot = msg.role === 'bot';

                            return (
                                <div key={index} className={`chat-message ${isBot ? 'bot' : 'user'}`}>
                                    {isBot && isLast && !isLoading ? (
                                        <TypewriterEffect text={msg.text} onComplete={scrollToBottom} />
                                    ) : (
                                        renderStaticText(msg.text)
                                    )}
                                </div>
                            );
                        })}
                        
                        {isLoading && (
                            <div className="chat-message bot">
                                <div className="typing-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        
                        {error && <div className="error-message">{error}</div>} 
                        <div ref={chatEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} className="send-btn" disabled={isLoading}>
                            <SendIcon width="18" height="18" />
                        </button>
                    </div>
                </div>
            ) : (
                <button className="chatbot-toggle" onClick={() => setIsChatOpen(true)} title="Open Cidi">
                    <BotIcon width="30" height="30" />
                </button>
            )}
        </div>
    );
};

export default CdmChatbot;