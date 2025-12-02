// src/Apps.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- ICONS ---
const BotIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M5 14h14"/></svg>);
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const SendIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);

const _SECURE_CHUNKS = ["TTRVUmJqeHJGUi1oLWctdjFPcGlFOFJaVjZTVW51eTJEeVNheklB"];
const _decryptSecureToken = () => { try { return atob(_SECURE_CHUNKS.join('')).split('').reverse().join(''); } catch(e) { return null; } };

// --- DATA GENERATORS ---
const COURSES = ["BSIT", "BSCS", "BSCPE", "BSEd"];
const SECTIONS = ["3D", "3A", "3B", "3C", "4A", "2A", "1B"];

const generateStudentID = () => {
    const year = '23'; 
    const queue = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${year}-${queue}`;
};

// --- SMART AI CONFIGURATION ---
const API_MODEL = "gemini-2.0-flash"; 

const CDM_SYSTEM_PROMPT = `
You are 'Cidi', the AI assistant for Colegio de Montalban.
Be casual, use Taglish, and be helpful.

**CRITICAL INSTRUCTION FOR AUTOMATION:**
If the user asks to add a SPECIFIC student (e.g., "Add student named Josh with ID 23-12345"), do NOT reply with normal text.
Instead, output a JSON object in this EXACT format:
{
  "action": "create_single_student",
  "data": {
    "name": "Extracted Name",
    "id": "Extracted ID (if not provided, return null)",
    "course": "Extracted Course (default to BSIT if missing)",
    "section": "Extracted Section (default to 3D if missing)"
  }
}

If the user asks to "Add random student" or "Add 10 students", just reply with "TRIGGER_RANDOM" or "TRIGGER_BATCH_10" respectively.
For normal questions, just chat normally.
`;

const TypewriterEffect = React.memo(({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        setDisplayedText('');
        let currentString = '';
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                currentString += text.charAt(currentIndex);
                setDisplayedText(currentString); 
                currentIndex++;
            } else {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, 15); 
        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    const renderFormatted = (str) => {
        const parts = str.split(/(\*\*.*?\*\*|\n)/g).map((part, index) => {
            if (part === '\n') return <br key={index} />;
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
            return part;
        });
        return <>{parts}</>;
    };
    return <p style={{ margin: 0, textAlign: 'left' }}>{renderFormatted(displayedText)}</p>;
});

const CdmChatbot = ({ onPageChange }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'bot', text: "Hello! I am Cidi. You can say '**Add 10 random students**' or give me specific details like '**Add student named Josh Lander Ferrera**'." }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    // --- API HELPER: ADD STUDENT TO DB ---
    const postStudentToDB = async (studentData) => {
        try {
            const response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (response.ok) {
                const event = new CustomEvent('CDM_STUDENT_ADDED', { detail: studentData });
                window.dispatchEvent(event);
                return true;
            }
        } catch (err) {
            console.error("DB Error:", err);
        }
        return false;
    };

    // --- AUTOMATION: RANDOM GENERATOR ---
    const addRandomStudents = async (count) => {
        if (onPageChange) onPageChange('view-studs');
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        let successCount = 0;
        const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda"];
        const lastNames = ["Cruz", "Santos", "Reyes", "Garcia", "Bautista", "Ocampo", "Gonzales", "Ramos"];

        for (let i = 0; i < count; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            
            const studentData = {
                id: generateStudentID(),
                name: `${lastName}, ${firstName}`,
                type: Math.random() > 0.2 ? 'Regular' : 'Irregular',
                course: COURSES[Math.floor(Math.random() * COURSES.length)],
                section: SECTIONS[Math.floor(Math.random() * SECTIONS.length)],
                cell: '09' + Math.floor(Math.random() * 1000000000).toString(),
                email: `${firstName.toLowerCase()}@student.cdm.edu.ph`,
                address: 'Rodriguez, Rizal',
                professorUid: 'MOCK_PROF_ID_123'
            };

            if (await postStudentToDB(studentData)) successCount++;
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }
        return successCount;
    };

    // --- AUTOMATION: SPECIFIC STUDENT ---
    const addSpecificStudent = async (extractedData) => {
        if (onPageChange) onPageChange('view-studs');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const studentData = {
            id: extractedData.id || generateStudentID(), 
            name: extractedData.name, 
            type: 'Regular',
            course: extractedData.course || 'BSIT',
            section: extractedData.section || '3D',
            cell: '09123456789',
            email: `${extractedData.name.replace(/\s+/g, '.').toLowerCase()}@student.cdm.edu.ph`,
            address: 'Rodriguez, Rizal',
            professorUid: 'MOCK_PROF_ID_123'
        };

        const success = await postStudentToDB(studentData);
        return success ? studentData : null;
    };

    // --- AI CALL ---
    const handleSendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

        const _token = _decryptSecureToken();
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${_token}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
                    systemInstruction: { parts: [{ text: CDM_SYSTEM_PROMPT }] }
                })
            });
            
            const result = await response.json();
            let aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const cleanText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

            if (cleanText === "TRIGGER_BATCH_10") {
                setMessages(prev => [...prev, { role: 'bot', text: "On it! Generating 10 random students... 🚀" }]);
                setTimeout(async () => {
                    const count = await addRandomStudents(10);
                    setMessages(prev => [...prev, { role: 'bot', text: `Done! Added **${count}** students.` }]);
                }, 500);

            } else if (cleanText === "TRIGGER_RANDOM") {
                setMessages(prev => [...prev, { role: 'bot', text: "Adding one random student... 👤" }]);
                setTimeout(async () => {
                    await addRandomStudents(1);
                    setMessages(prev => [...prev, { role: 'bot', text: "Success! Student added." }]);
                }, 500);

            } else {
                try {
                    const parsedData = JSON.parse(cleanText);
                    
                    if (parsedData.action === "create_single_student" && parsedData.data) {
                        const { name, id } = parsedData.data;
                        setMessages(prev => [...prev, { role: 'bot', text: `Got it. Adding **${name}** ${id ? `with ID **${id}**` : ""}... ✍️` }]);
                        
                        setTimeout(async () => {
                            const result = await addSpecificStudent(parsedData.data);
                            if (result) {
                                setMessages(prev => [...prev, { role: 'bot', text: `Successfully added **${result.name}** (${result.id}) to the database! ✅` }]);
                            } else {
                                setMessages(prev => [...prev, { role: 'bot', text: "Oops, database error." }]);
                            }
                        }, 500);
                    } else {
                        setMessages(prev => [...prev, { role: 'bot', text: aiText }]);    
                    }
                } catch (e) {
                    setMessages(prev => [...prev, { role: 'bot', text: aiText }]);
                }
            }

        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Network Error." }]);
        }

        setIsLoading(false);
    }, [input, isLoading, messages, onPageChange]); 

    const handleKeyPress = (e) => { if (e.key === 'Enter' && !isLoading) handleSendMessage(); };

    return (
        <div className="chatbot-container">
            <style>{`
                .chatbot-container { position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                .chatbot-toggle { width: 60px; height: 60px; border-radius: 50%; background-color: #38761d; color: white; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer; display: flex; justify-content: center; align-items: center; transition: transform 0.2s; }
                .chatbot-toggle:hover { transform: scale(1.05); background-color: #275d13; }
                .chatbot-widget { width: 350px; height: 500px; display: flex; flex-direction: column; background: #fff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.3); overflow: hidden; }
                @media (max-width: 400px) { .chatbot-widget { width: 90vw; height: 80vh; } }
                .chat-header { background-color: #38761d; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
                .chat-header button { background: none; border: none; color: white; cursor: pointer; }
                .chat-messages { flex-grow: 1; padding: 15px; overflow-y: auto; background-color: #f7f7f7; display: flex; flex-direction: column; gap: 12px; }
                .chat-message { max-width: 80%; padding: 12px 16px; border-radius: 18px; line-height: 1.5; font-size: 0.9rem; word-wrap: break-word; text-align: left; }
                .chat-message.user { align-self: flex-end; background-color: #d1e7dd; color: #0c4a45; border-bottom-right-radius: 2px; }
                .chat-message.bot { align-self: flex-start; background-color: #e0f2f1; color: #004d40; border-bottom-left-radius: 2px; }
                .chat-input-area { display: flex; padding: 10px; border-top: 1px solid #eee; background: white; }
                .chat-input-area input { flex-grow: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 24px; margin-right: 10px; outline: none; }
                .chat-input-area .send-btn { width: 36px; height: 36px; border-radius: 50%; background: #38761d; color: white; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; }
                .typing-dots { display: flex; align-items: center; padding: 8px 0; }
                .typing-dots span { height: 6px; width: 6px; margin: 0 2px; background-color: #00695c; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; } .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
            `}</style>
            
            {isChatOpen ? (
                <div className="chatbot-widget">
                    <div className="chat-header">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>Cidi</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>CDM-AI CHATBOT</span>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} style={{ display: 'flex' }}>
                            <XIcon width="24" height="24" />
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.role === 'bot' ? 'bot' : 'user'}`}>
                                {msg.role === 'bot' && idx === messages.length - 1 && !isLoading 
                                    ? <TypewriterEffect text={msg.text} onComplete={scrollToBottom} /> 
                                    : <p style={{ margin: 0, textAlign: 'left' }}>{msg.text}</p>}
                            </div>
                        ))}
                        {isLoading && <div className="chat-message bot"><div className="typing-dots"><span></span><span></span><span></span></div></div>}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="chat-input-area">
                        <input type="text" placeholder="Type instructions..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading} />
                        <button onClick={handleSendMessage} className="send-btn" disabled={isLoading}><SendIcon width="18" height="18" /></button>
                    </div>
                </div>
            ) : (
                <button className="chatbot-toggle" onClick={() => setIsChatOpen(true)} title="Open Cidi"><BotIcon width="30" height="30" /></button>
            )}
        </div>
    );
};

export default CdmChatbot;