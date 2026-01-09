import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Get or create root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found in index.html');
}

// Initialize Google AI API (optional - if using Gemini services)
const initializeGeminiAPI = async () => {
  try {
    // Check if Gemini API key is available in environment
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      // Initialize any Gemini-dependent services
      console.log('✅ Gemini API initialized');
    }
  } catch (error) {
    console.warn('⚠️ Gemini API initialization failed:', error);
  }
};

// Initialize app
const initializeApp = async () => {
  try {
    await initializeGeminiAPI();
    
    // Create and mount React root
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    // Fallback error UI
    rootElement.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #208D85 0%, #32B8C6 100%);
        font-family: system-ui, -apple-system, sans-serif;
        color: white;
      ">
        <div style="text-align: center; padding: 20px;">
          <h1 style="margin-bottom: 20px;">⚠️ Application Error</h1>
          <p style="margin-bottom: 10px;">Failed to initialize Sisteminha EcoFarm</p>
          <p style="font-size: 12px; opacity: 0.8;">Please refresh the page or contact support</p>
        </div>
      </div>
    `;
  }
};

// Start application
initializeApp();