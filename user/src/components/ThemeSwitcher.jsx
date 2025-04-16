import React, { useEffect, useState } from 'react';

/**
 * ThemeSwitcher component allows switching between color themes and dark/light modes
 */
const ThemeSwitcher = () => {
  // State for theme (red or blue)
  const [colorTheme, setColorTheme] = useState('red');
  // State for mode (dark or light)
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    // Get saved theme settings if they exist
    const savedColorTheme = localStorage.getItem('color-theme') || 'red';
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
    
    // Set initial states
    setColorTheme(savedColorTheme);
    setDarkMode(savedDarkMode);
    
    // Apply the saved themes to the document
    applyTheme(savedColorTheme, savedDarkMode);
  }, []);

  // Function to apply theme classes to the document
  const applyTheme = (color, isDark) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove previous theme classes from both HTML and body
    root.classList.remove('theme-red', 'theme-blue');
    body.classList.remove('theme-red', 'theme-blue');
    
    // Add current theme class to both HTML and body
    root.classList.add(`theme-${color}`);
    body.classList.add(`theme-${color}`);
    
    // Toggle dark mode class on both HTML and body
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  };

  // Handle color theme toggle
  const toggleColorTheme = () => {
    const newColorTheme = colorTheme === 'red' ? 'blue' : 'red';
    setColorTheme(newColorTheme);
    localStorage.setItem('color-theme', newColorTheme);
    applyTheme(newColorTheme, darkMode);
  };

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dark-mode', String(newDarkMode));
    applyTheme(colorTheme, newDarkMode);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Theme toggle button */}
      <button
        onClick={toggleColorTheme}
        className={`p-2 rounded-full transition-colors ${
          colorTheme === 'red' 
            ? 'bg-[#fe6604] text-white' 
            : 'bg-[#2f2cd8] text-white'
        }`}
        aria-label={`Switch to ${colorTheme === 'red' ? 'blue' : 'red'} theme`}
        title={`Switch to ${colorTheme === 'red' ? 'blue' : 'red'} theme`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
          </svg>
        </div>
      </button>

      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-full transition-colors ${
          darkMode 
            ? 'bg-[#1e1e1e] text-white border border-white/20' 
            : 'bg-white text-[#121212] border border-black/10'
        }`}
        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
};

export default ThemeSwitcher; 