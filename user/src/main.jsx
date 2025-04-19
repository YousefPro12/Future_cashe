import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import App from './App' 
import './index.css'

// Apply saved theme on initial load before rendering
const applyStoredTheme = () => {
  const root = document.documentElement;
  const body = document.body;
  
  // Apply color theme if saved
  const savedColorTheme = localStorage.getItem('color-theme');
  if (savedColorTheme) {
    root.classList.add(`theme-${savedColorTheme}`);
    body.classList.add(`theme-${savedColorTheme}`);
  } else {
    // Default to red theme if not set
    root.classList.add('theme-red');
    body.classList.add('theme-red');
    localStorage.setItem('color-theme', 'red');
  }
  
  // Apply dark mode if saved
  const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
  if (savedDarkMode) {
    root.classList.add('dark');
    body.classList.add('dark');
  }

  // Alternative: check system preference for dark mode if not saved
  if (localStorage.getItem('dark-mode') === null) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
    } else {
      localStorage.setItem('dark-mode', 'false');
    }
  }
};

// Apply theme settings before rendering
applyStoredTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
