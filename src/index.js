// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// --- INJECT GLOBAL API KEY HERE ---

// 1. Get the key from the environment variable (Use the prefix you chose in .env)
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY; 

// 2. Define the global variable __api_key for Apps.jsx to read
if (geminiApiKey) {
    window.__api_key = geminiApiKey;
    console.log("Gemini API key successfully injected into window.__api_key.");
} else {
    console.error("Warning: REACT_APP_GEMINI_API_KEY is missing from environment variables.");
}

// ----------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);