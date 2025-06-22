import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { PhobosThemeContext } from './context';
import { themes } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';

type ThemeName = keyof typeof themes;

interface PhobosThemeProviderProps {
  children: ReactNode;
}

export const PhobosThemeProvider: React.FC<PhobosThemeProviderProps> = ({
  children,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setThemeName(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const activeTheme = themes[themeName];
  const contextValue = useMemo(
    () => ({ theme: themeName, toggleTheme }),
    [themeName]
  );

  return (
    <PhobosThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={activeTheme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </PhobosThemeContext.Provider>
  );
};