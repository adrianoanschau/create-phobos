import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };
}; 