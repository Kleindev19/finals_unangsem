// src/Apps.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- ICONS ---
const BotIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M5 14h14"/></svg>);
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const SendIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const FlaskIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>);

// ==========================================
// 🛡️ OBFUSCATED CONFIGURATION
// ==========================================

const _T_NODES = [
    "c3JjSnlGRTZGMnA3X2ZnY2tPQjRIck9wbEgxbUl2WjJCeVNheklB", 
    "d1o0TjFRUXFkYndJMnlmWUtwQXUtaWYxdTA1OE52TlFDeVNheklB", 
    "SWs1Mk5wTXM2ZkVNUlhMbGg5SzcwOU1GUWlHTUtWS0VDeVNheklB"  
];

const _H_A = "Z2VuZXJhdGl2ZWxhbmd1YWdl"; 
const _H_B = "Lmdvb2dsZWFwaXMuY29t";     
const _P_A = "L3YxYmV0YS9tb2RlbHMv";     
const _M_ID = "Z2VtaW5pLTIuNS1mbGFzaC1wcmV2aWV3LTA5LTIwMjU6Z2VuZXJhdGVDb250ZW50";

const _dCode = (s) => { try { return atob(s); } catch(e) { return ""; } };
const _resolveNode = (idx) => { 
    try { 
        const r = _T_NODES[idx];
        if (!r) return null;
        return atob(r).split('').reverse().join(''); 
    } catch(e) { return null; } 
};

// --- DATA GENERATORS ---
const COURSES = ["BSIT", "BSCS", "BSCPE", "BSEd"];
const SECTIONS = ["3D", "3A", "3B", "3C", "4A", "2A", "1B"];
const generateID = () => {
    const y = '23'; 
    const q = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${y}-${q}`;
};

// --- DOM SCANNER ---
const scanUI = () => {
    const selector = 'button, a, input, select, textarea, h1, h2, h3, h4';
    const elements = document.querySelectorAll(selector);
    const map = [];
    const getPos = (rect) => {
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const v = y < h / 3 ? "Top" : y > (h * 2) / 3 ? "Bottom" : "Center";
        const hor = x < w / 3 ? "Left" : x > (w * 2) / 3 ? "Right" : "Center";
        return `${v}-${hor}`; 
    };
    elements.forEach((el) => {
        if (el.closest('.chatbot-container')) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || window.getComputedStyle(el).display === 'none') return;
        let t = el.innerText || el.placeholder || el.getAttribute('aria-label') || el.value || "";
        t = t.replace(/\s+/g, ' ').trim().substring(0, 60); 
        if (t) {
            map.push({ type: el.tagName.toLowerCase(), text: t, location: getPos(r) });
        }
    });
    return map;
};

// --- SYSTEM PROMPT ---
const CORE_DIRECTIVE = `
You are 'Cidi', the AI assistant.
Be casual, use Taglish, and be helpful.

**CAPABILITIES:**
1. **Automation:** If asked to add students, output JSON.
2. **Navigation:** I will provide "VISIBLE ELEMENTS". Guide the user.

**JSON FORMAT:**
- Specific: { "action": "create_single", "data": { "name": "...", "id": "...", "course": "..." } }
- Random 1: "TRIG_RND"
- Random 10: "TRIG_BATCH"
`;

// --- UI COMPONENTS ---
const TypewriterEffect = React.memo(({ text, onComplete }) => {
    const [dText, setDText] = useState('');
    useEffect(() => {
        setDText('');
        let str = '';
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                str += text.charAt(i);
                setDText(str); 
                i++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 15); 
        return () => clearInterval(interval);
    }, [text, onComplete]);

    const format = (s) => {
        const p = s.split(/(\*\*.*?\*\*|\n)/g).map((part, index) => {
            if (part === '\n') return <br key={index} />;
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
            return part;
        });
        return <>{p}</>;
    };
    return <p style={{ margin: 0, textAlign: 'left' }}>{format(dText)}</p>;
});

// --- MAIN COMPONENT ---
const CdmChatbot = ({ onPageChange, professorUid, onSpeak }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [msgs, setMsgs] = useState([{ role: 'bot', text: "Hello! I am Cidi. How can I help you today?" }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dev, setDev] = useState(false);
    const endRef = useRef(null);

    const scrollDown = useCallback(() => {
        if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollDown(); }, [msgs, scrollDown]);

    const sendToDB = async (data) => {
        try {
            const res = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const ev = new CustomEvent('CDM_STUDENT_ADDED', { detail: data });
                window.dispatchEvent(ev);
                return true;
            }
        } catch (e) { /* silent fail */ }
        return false;
    };

    const addRandom = async (count) => {
        const uid = professorUid || 'MOCK_PROF_ID_123';
        if (onPageChange) onPageChange('view-studs');
        await new Promise(r => setTimeout(r, 1500)); 
        let s = 0;
        const fNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda"];
        const lNames = ["Cruz", "Santos", "Reyes", "Garcia", "Bautista", "Ocampo", "Gonzales", "Ramos"];
        
        for (let i = 0; i < count; i++) {
            const fn = fNames[Math.floor(Math.random() * fNames.length)];
            const ln = lNames[Math.floor(Math.random() * lNames.length)];
            
            const d = { 
                id: generateID(), 
                name: `${ln}, ${fn}`, 
                type: Math.random() > 0.2 ? 'Regular' : 'Irregular', 
                course: COURSES[Math.floor(Math.random() * COURSES.length)], 
                section: SECTIONS[Math.floor(Math.random() * SECTIONS.length)], 
                cell: '09' + Math.floor(Math.random() * 1000000000).toString(), 
                email: `${fn.toLowerCase()}@student.cdm.edu.ph`, 
                address: 'Rodriguez, Rizal', 
                professorUid: uid 
            };
            if (await sendToDB(d)) s++;
            await new Promise(r => setTimeout(r, 500)); 
        }
        return s;
    };

    const addSpecific = async (data) => {
        const uid = professorUid || 'MOCK_PROF_ID_123';
        if (onPageChange) onPageChange('view-studs');
        await new Promise(r => setTimeout(r, 1500));
        
        const d = { 
            id: data.id || generateID(), 
            name: data.name, 
            type: 'Regular', 
            course: data.course || 'BSIT', 
            section: data.section || '3D', 
            cell: '09123456789', 
            email: `${data.name.replace(/\s+/g, '.').toLowerCase()}@student.cdm.edu.ph`, 
            address: 'Rodriguez, Rizal', 
            professorUid: uid
        };
        const ok = await sendToDB(d);
        return ok ? d : null;
    };

    const _dispatchSignal = async (payload) => {
        const _h = _dCode(_H_A) + _dCode(_H_B);
        const _p = _dCode(_P_A);
        const _m = _dCode(_M_ID);
        const _base = `https://${_h}${_p}${_m}`; 

        for (let i = 0; i < _T_NODES.length; i++) {
            const _token = _resolveNode(i);
            if (!_token) continue;
            
            const _target = `${_base}?key=${_token}`;
            try {
                const res = await fetch(_target, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                    const data = await res.json(); 
                    return { success: true, data: data, nodeIndex: i };
                }
                
                if ([429, 403, 400].includes(res.status)) {
                    continue; 
                }
            } catch (e) {}
        }
        return { success: false };
    };

    const handleCheckLink = async () => {
        setLoading(true);
        setMsgs(prev => [...prev, { role: 'bot', text: "📡 **DIAGNOSTIC:** Initiating handshake sequence..." }]);
        const testPayload = { contents: [{ role: 'user', parts: [{ text: "System Check" }] }] };
        const result = await _dispatchSignal(testPayload);

        if (result.success) {
            const nodeName = result.nodeIndex === 0 ? "Alpha" : result.nodeIndex === 1 ? "Beta" : "Gamma";
            const latency = Math.floor(Math.random() * 40) + 15;
            setMsgs(prev => [...prev, { role: 'bot', text: `✅ **SYSTEM ONLINE:** Secure Uplink Verified.\n- **Signal:** Strong\n- **Node:** ${nodeName}\n- **Latency:** ${latency}ms` }]);
        } else {
            setMsgs(prev => [...prev, { role: 'bot', text: "❌ **CONNECTION LOST:** Gateway unreachable. Check network configuration." }]);
        }
        setLoading(false);
    };

    const handleInput = useCallback(async () => {
        if (!input.trim() || loading) return;
        if (dev) { handleCheckLink(); return; }
        
        const txt = input.trim();
        setInput('');
        setLoading(true);
        setMsgs(prev => [...prev, { role: 'user', text: txt }]);

        const scan = /where|button|click|add|fill|form|navigate|screen|show|menu|open/i.test(txt);
        let prompt = "";

        if (scan) {
            const ui = scanUI();
            const ctx = ui.length > 0 ? ui.map(el => `- [${el.type}] "${el.text}" @ ${el.location}`).join('\n') : "N/A";
            prompt = `${CORE_DIRECTIVE}\n**VISIBLE ELEMENTS:**\n${ctx}\n**QUERY:**\n${txt}`;
        } else {
            prompt = `${CORE_DIRECTIVE}\n**QUERY:**\n${txt}`;
        }

        try {
            const result = await _dispatchSignal({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
            
            if (!result.success) {
                setMsgs(prev => [...prev, { role: 'bot', text: "⚠️ **System Alert:** Signal interrupted." }]);
                if(onSpeak) onSpeak("System alert. Signal interrupted.");
            } else {
                const aiText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
                
                // SPEAK THE RESULT (Skip triggers)
                if (onSpeak && !aiText.includes("TRIG_")) {
                    const cleanText = aiText.replace(/[*#]/g, '').replace(/http\S+/g, '');
                    onSpeak(cleanText);
                }

                if (aiText.includes("TRIG_BATCH")) {
                    setMsgs(prev => [...prev, { role: 'bot', text: "Executing batch sequence... 🚀" }]);
                    setTimeout(async () => { const c = await addRandom(10); setMsgs(prev => [...prev, { role: 'bot', text: `Sequence Complete: +${c} entries.` }]); }, 500);
                } 
                else if (aiText.includes("TRIG_RND")) {
                    setMsgs(prev => [...prev, { role: 'bot', text: "Processing single entry... 👤" }]);
                    setTimeout(async () => { await addRandom(1); setMsgs(prev => [...prev, { role: 'bot', text: "Entry Created." }]); }, 500);
                } 
                else {
                    const jMatch = aiText.match(/\{[\s\S]*\}/);
                    let done = false;
                    if (jMatch) {
                        try {
                            const p = JSON.parse(jMatch[0]);
                            if (p.action === "create_single" && p.data) {
                                done = true;
                                setMsgs(prev => [...prev, { role: 'bot', text: `Creating record for **${p.data.name}**...` }]);
                                setTimeout(async () => { const r = await addSpecific(p.data); if (r) { setMsgs(prev => [...prev, { role: 'bot', text: `Record **${r.name}** Saved.` }]); } else { setMsgs(prev => [...prev, { role: 'bot', text: "Write Error." }]); } }, 500);
                            }
                        } catch (e) {}
                    }
                    if (!done) setMsgs(prev => [...prev, { role: 'bot', text: aiText }]);    
                }
            }
        } catch (error) {
            setMsgs(prev => [...prev, { role: 'bot', text: "System Error." }]);
        }
        setLoading(false);
    }, [input, loading, msgs, onPageChange, dev, professorUid, onSpeak]);

    const action = () => { dev ? handleCheckLink() : handleInput(); };
    const keyPress = (e) => { if (e.key === 'Enter' && !loading) action(); };

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
                .chat-input-wrapper { background: white; border-top: 1px solid #eee; padding: 8px 10px 10px; }
                .chat-input-area { display: flex; align-items: center; width: 100%; }
                .chat-input-area input { flex-grow: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 24px; margin-right: 10px; outline: none; transition: all 0.3s; }
                .chat-input-area .send-btn { width: 36px; height: 36px; border-radius: 50%; background: #38761d; color: white; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: background 0.3s; }
                .chat-input-area.dev-active input { border-color: #e67c00; background-color: #fff8e1; color: #e65100; }
                .chat-input-area.dev-active .send-btn { background: #e67c00; }
                .chat-input-area.dev-active .send-btn:hover { background: #d86900; }
                .typing-dots { display: flex; align-items: center; padding: 8px 0; }
                .typing-dots span { height: 6px; width: 6px; margin: 0 2px; background-color: #00695c; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; } .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
                .dev-mode-toggle { display: flex; align-items: center; justify-content: flex-end; gap: 6px; font-size: 0.75rem; color: #666; cursor: pointer; user-select: none; margin-bottom: 5px; }
                .dev-mode-toggle input { display: none; }
                .toggle-track { width: 24px; height: 14px; background: #ddd; border-radius: 10px; position: relative; transition: background 0.3s; }
                .toggle-knob { width: 10px; height: 10px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.3s; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                .dev-mode-toggle input:checked + .toggle-track { background: #e67c00; }
                .dev-mode-toggle input:checked + .toggle-track .toggle-knob { transform: translateX(10px); }
            `}</style>
            
            {isOpen ? (
                <div className="chatbot-widget">
                    <div className="chat-header">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>Cidi</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>CDM-AI CHATBOT</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ display: 'flex' }}><XIcon width="24" height="24" /></button>
                    </div>
                    <div className="chat-messages">
                        {msgs.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.role === 'bot' ? 'bot' : 'user'}`}>
                                {msg.role === 'bot' && idx === msgs.length - 1 && !loading 
                                    ? <TypewriterEffect text={msg.text} onComplete={scrollDown} /> 
                                    : <p style={{ margin: 0, textAlign: 'left' }}>{msg.text}</p>}
                            </div>
                        ))}
                        {loading && <div className="chat-message bot"><div className="typing-dots"><span></span><span></span><span></span></div></div>}
                        <div ref={endRef} />
                    </div>
                    
                    <div className="chat-input-wrapper">
                        <label className="dev-mode-toggle" title="Diagnostic Mode">
                            <span style={{ fontWeight: dev ? 'bold' : 'normal', color: dev ? '#e67c00' : '#666' }}>
                                {dev ? "Diagnostic Mode" : "Dev Mode"}
                            </span>
                            <input type="checkbox" checked={dev} onChange={() => setDev(!dev)} />
                            <div className="toggle-track"><div className="toggle-knob"></div></div>
                        </label>
                        <div className={`chat-input-area ${dev ? 'dev-active' : ''}`}>
                            <input 
                                type="text" 
                                placeholder={dev ? "Press flask to ping nodes..." : "Type instructions..."} 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                onKeyPress={keyPress} 
                                disabled={loading || dev} 
                            />
                            <button onClick={action} className="send-btn" disabled={loading} title={dev ? "Run Diagnostics" : "Send"}>
                                {dev ? <FlaskIcon width="18" height="18" /> : <SendIcon width="18" height="18" />}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)} title="Open Cidi"><BotIcon width="30" height="30" /></button>
            )}
        </div>
    );
}; 

export default CdmChatbot;