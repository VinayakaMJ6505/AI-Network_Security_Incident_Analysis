import React, { createContext, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'suite-strike:theme';

export const ThemeContext = createContext(null);

function getInitialTheme() {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (e) {
    /* localStorage unavailable */
  }
  return 'light';
}

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState(next === 'dark' ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
