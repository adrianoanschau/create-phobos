import { useContext } from 'react';
import { PhobosThemeContext } from '../context';

export const usePhobosTheme = () => {
  const context = useContext(PhobosThemeContext);

  if (context === undefined) {
    throw new Error('usePhobosTheme must be used within a PhobosThemeProvider');
  }
  return context;
}; 