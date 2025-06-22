import { createContext } from 'react';

export interface PhobosThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const PhobosThemeContext = createContext<PhobosThemeContextType | undefined>(
  undefined
); 