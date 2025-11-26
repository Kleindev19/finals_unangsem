import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- INLINE SVG ICONS (for Chatbot Widget) ---
// Bot Icon (e.g., Robot or Headset)
const BotIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
        <path d="M12 17v4"/>
        <path d="M8 21h8"/>
        <path d="M5 14h14"/>
    </svg>
);

// Close Icon (X)
const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

// Send Icon
const SendIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
);

// Dot Loader Component
const DotLoader = () => (
    <div className="dot-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
    </div>
);

// --- GEMINI API Configuration (MODEL CHANGE APPLIED) ---
// CHANGE: Switched to stable model 'gemini-2.5-flash' to avoid potential preview-model-related authentication issues.
const API_MODEL = "gemini-2.5-flash"; 
// FIX: Explicitly check for the global variable __api_key and use it for authentication.
// eslint-disable-next-line no-undef
const API_KEY = typeof __api_key !== 'undefined' ? __api_key : ''; 

// --- SYSTEM INSTRUCTION for CDM Chatbot ---
const CDM_SYSTEM_PROMPT = `
You are 'CDM Bot,' the official virtual assistant for the Colegio de Montalban (CDM) student portal. 
Your persona is friendly, formal, and highly informative, specifically about the school, its policies, and the functionality of this website.

**Rule 1: School Information:** Answer all inquiries about the school, its mission, history, academic programs (like ICS, Business, Education), vision, and location (Rodriguez, Rizal, Philippines). If asked for history, mention its establishment and dedication to education in Montalban.

**Rule 2: Webpage Functionality:** You MUST explain the purpose of the three main sections of this student portal:
* **Dashboard:** This is the landing page. It provides a summary of the student's academic standing, announcements, and quick access to their classes and metrics (like attendance and GPA).
* **Reports:** This section allows the user (typically a teacher or administrator) to generate, download, and view detailed academic reports based on filters like Institute, Year Level, and Section.
* **Profile:** This is where users can view and update their personal information, email, and security settings.

**Rule 3: Tone and Format:** Use clear, professional, and slightly enthusiastic language. Keep answers concise unless a detailed history or policy is requested. DO NOT use emojis. When listing details, use clear formatting.

**Rule 4: Grounding:** Use Google Search for questions that require external or updated knowledge (like recent news or general information).
`;

// --- CORE CHATBOT COMPONENT ---

const CdmChatbot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello! I am CDM Bot, your virtual assistant for Colegio de Montalban. How may I help you today? Feel free to ask about our school, history, or the features of this portal (Dashboard, Reports, Profile)!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatEndRef = useRef(null);

    // Scroll to the latest message whenever messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Function to call the Gemini API with exponential backoff
    const callGeminiAPI = useCallback(async (currentHistory) => {
        // FIX: Use the explicit API_KEY in the URL query parameter for authentication.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${API_KEY}`;
        
        // TEMPORARY DEBUGGING: Log to check if API_KEY is being used in the URL
        // console.log("Attempting API call with URL:", API_KEY ? apiUrl.replace(API_KEY, '...[API_KEY_PRESENT]...') : apiUrl);

        // FIX: The currentHistory now includes the user's latest message, 
        // formatted correctly with 'user' and 'assistant' roles (or 'bot' converted).
        const contents = currentHistory.map(msg => ({ 
            role: msg.role === 'bot' ? 'assistant' : 'user', 
            parts: [{ text: msg.text }] 
        }));

        const payload = {
            contents: contents, // Use the full conversation history
            // Enable Google Search grounding
            tools: [{ "google_search": {} }], 
            systemInstruction: {
                parts: [{ text: CDM_SYSTEM_PROMPT }]
            },
        };

        const MAX_RETRIES = 5;
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
                        
                        // Extract grounding sources
                        let sources = [];
                        const groundingMetadata = candidate.groundingMetadata;
                        if (groundingMetadata && groundingMetadata.groundingAttributions) {
                            sources = groundingMetadata.groundingAttributions
                                .map(attribution => ({
                                    uri: attribution.web?.uri,
                                    title: attribution.web?.title,
                                }))
                                .filter(source => source.uri && source.title);
                        }

                        finalResult = { text, sources };
                        break; // Success! Exit the loop.
                    } else {
                        // Success status but empty or blocked response
                        finalResult = { text: "I apologize, but I received an empty or invalid response from the AI. Please try rephrasing your question.", sources: [] };
                        break;
                    }
                } else if (response.status === 429 || response.status >= 500) {
                    // Retriable error (Rate Limit or Server)
                    lastError = `Transient Error (Status ${response.status}). Retrying...`;
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    // Non-retriable error (e.g., 400, 403 - usually key or payload error)
                    lastError = `API Error (Status ${response.status}): ${result.error?.message || 'Check key and payload.'}`;
                    break;
                }
            } catch (error) {
                // Network error
                lastError = `Network Error: ${error.message}.`;
                // Retry network errors as they might be transient
                if (attempt === MAX_RETRIES) break; 
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        if (finalResult) {
            return finalResult;
        } else {
            // Final failure after retries
            return { text: `I'm having trouble connecting to the AI service: ${lastError}`, sources: [] };
        }
    }, []); // Removed messages from dependency array to use the current state during handleSendMessage

    // Function to handle sending the message
    const handleSendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        // CHECK 1: Explicitly check for API key before calling
        if (!API_KEY) {
            setError("Authentication Failed: The API key is missing or not provided by the environment.");
            // Add a friendly error message to the chat history for visibility
            setMessages(prevMessages => [
                ...prevMessages, 
                { role: 'user', text: input.trim() },
                { role: 'bot', text: "Error: Cannot connect to the service. The API key is not available in the execution environment. Please contact support." }
            ]);
            setInput('');
            return; 
        }

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);
        setError(''); // Clear any previous errors

        // 1. Prepare history BEFORE state update (to include new user message)
        const newUserMessage = { role: 'user', text: userMessage };
        const currentHistory = [...messages, newUserMessage];
        
        // 2. Optimistically update state
        setMessages(currentHistory);

        // 3. Call the Gemini API with the full conversation history
        const { text: botResponseText, sources: groundingSources } = await callGeminiAPI(currentHistory);

        // 4. Construct the full bot message including sources
        let fullBotResponse = botResponseText;
        if (groundingSources.length > 0) {
            fullBotResponse += "\n\n**Sources:**\n";
            groundingSources.forEach((source, index) => {
                // FIX: Use index in key/title generation to ensure uniqueness
                fullBotResponse += `- [${source.title || `Source ${index + 1}`}](${source.uri})\n`;
            });
        }
        
        // 5. Add bot response to history (using functional update to prevent race condition)
        setMessages(prevMessages => [...prevMessages, { role: 'bot', text: fullBotResponse }]);

        setIsLoading(false);
    }, [input, isLoading, messages, callGeminiAPI]); // Added messages as dependency for currentHistory preparation

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };

    // Helper function to render Markdown text (only handles **bold** and newlines for simplicity)
    // FIX: Simplified Markdown rendering logic for robustness
    const renderMessageText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|\n)/g).map((part, index) => {
            if (part === '\n') {
                return <br key={index} />;
            }
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
        
        // Wrap everything in a single paragraph for clean styling
        return <p style={{ margin: 0 }}>{parts}</p>;
    };

    return (
        <div className="chatbot-container">
            {/* The inline CSS block is left here to keep styling self-contained for the file generation workflow. */}
            <style>
                {/* General Styles */}
                {`
                    .chatbot-container {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 10000;
                        font-family: 'Inter', sans-serif;
                    }
                    .chatbot-toggle {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        background-color: #38761d; /* CDM Primary Green */
                        color: white;
                        border: none;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transition: transform 0.2s, background-color 0.2s;
                    }
                    .chatbot-toggle:hover {
                        background-color: #275d13;
                        transform: scale(1.05);
                    }
                    .chatbot-widget {
                        width: 350px;
                        height: 500px;
                        display: flex;
                        flex-direction: column;
                        background: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
                        overflow: hidden;
                        position: relative;
                        transition: all 0.3s ease-out;
                    }
                    @media (max-width: 400px) {
                        .chatbot-widget {
                            width: 90vw;
                            height: 80vh;
                        }
                    }

                    /* Header */
                    .chat-header {
                        background-color: #38761d; /* CDM Primary Green */
                        color: white;
                        padding: 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-weight: 600;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .chat-header button {
                        background: none;
                        border: none;
                        color: white;
                        cursor: pointer;
                        padding: 5px;
                    }

                    /* Message Area */
                    .chat-messages {
                        flex-grow: 1;
                        padding: 15px;
                        overflow-y: auto;
                        background-color: #f7f7f7;
                        display: flex;
                        flex-direction: column;
                    }
                    .chat-message {
                        max-width: 80%;
                        padding: 10px 15px;
                        border-radius: 18px;
                        margin-bottom: 10px;
                        line-height: 1.4;
                        font-size: 0.9rem;
                    }
                    .chat-message.user {
                        align-self: flex-end;
                        background-color: #d1e7dd; /* Light green for user */
                        color: #0c4a45;
                        border-bottom-right-radius: 2px;
                    }
                    .chat-message.bot {
                        align-self: flex-start;
                        background-color: #e0f2f1; /* Light cyan for bot */
                        color: #004d40;
                        border-bottom-left-radius: 2px;
                    }

                    /* Bot Message Content Styling */
                    .chat-message.bot p {
                        margin: 0;
                        padding: 0;
                        margin-bottom: 0.5em;
                    }
                    .chat-message.bot strong {
                        font-weight: 700;
                    }
                    .chat-message.bot a {
                        color: #00796b;
                        text-decoration: underline;
                    }

                    /* Input Area */
                    .chat-input-area {
                        display: flex;
                        padding: 10px;
                        border-top: 1px solid #eee;
                        background-color: white;
                        align-items: center;
                    }
                    .chat-input-area input {
                        flex-grow: 1;
                        padding: 8px 12px;
                        border: 1px solid #ccc;
                        border-radius: 20px;
                        margin-right: 10px;
                        font-size: 0.9rem;
                        outline: none;
                        transition: border-color 0.2s;
                    }
                    .chat-input-area input:focus {
                        border-color: #38761d;
                    }
                    .chat-input-area .send-btn {
                        width: 30px;
                        height: 30px;
                        min-width: 30px; /* fixed size */
                        min-height: 30px;
                        border-radius: 50%;
                        background-color: #38761d;
                        color: white;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transition: background-color 0.2s;
                    }
                    .chat-input-area .send-btn:hover {
                        background-color: #275d13;
                    }
                    .chat-input-area .send-icon {
                        width: 16px;
                        height: 16px;
                    }
                    .chat-input-area button:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    /* Loading Indicator Styles */
                    .chat-message.bot.loading-indicator {
                        background-color: #e0f2f1;
                        padding: 10px 15px;
                        width: fit-content;
                        display: flex;
                        align-items: center;
                    }
                    .dot-loader {
                        display: flex;
                        align-items: center;
                    }
                    .dot {
                        width: 8px;
                        height: 8px;
                        margin: 0 3px;
                        background-color: #004d40;
                        border-radius: 50%;
                        animation: bounce 1.4s infinite ease-in-out both;
                    }
                    .dot:nth-child(1) {
                        animation-delay: -0.32s;
                    }
                    .dot:nth-child(2) {
                        animation-delay: -0.16s;
                    }
                    @keyframes bounce {
                        0%, 80%, 100% {
                            transform: scale(0);
                        }
                        40% {
                            transform: scale(1.0);
                        }
                    }

                    /* Error Message Styling */
                    .error-message {
                        color: #d9534f;
                        text-align: center;
                        padding: 5px;
                        margin-top: 10px;
                        font-size: 0.8rem;
                        align-self: center; 
                        background-color: #fce8e8;
                        border-radius: 4px;
                    }
                `}
            </style>
            
            {isChatOpen ? (
                <div className="chatbot-widget">
                    {/* Header */}
                    <div className="chat-header">
                        <span>CDM Chatbot</span>
                        <button onClick={() => setIsChatOpen(false)} title="Close Chat">
                            <XIcon width="20" height="20" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.role}`}>
                                {renderMessageText(msg.text)}
                            </div>
                        ))}
                        
                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="chat-message bot loading-indicator">
                                <DotLoader />
                            </div>
                        )}
                        {/* Display error message if present */}
                        {error && <div className="error-message">{error}</div>} 
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Ask about school or the platform..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} className="send-btn" disabled={isLoading}>
                            <SendIcon className="send-icon" />
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    className="chatbot-toggle" 
                    onClick={() => setIsChatOpen(true)}
                    title="Open CDM Chatbot"
                >
                    <BotIcon width="30" height="30" />
                </button>
            )}
        </div>
    );
};

export default CdmChatbot;