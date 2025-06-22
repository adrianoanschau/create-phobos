import { DefaultTheme } from 'styled-components';
import { tokens } from './tokens';

export interface PhobosTheme extends DefaultTheme {
  name: 'light' | 'dark';
  palette: typeof tokens.palette;
  spacing: typeof tokens.spacing;
  borderRadius: typeof tokens.borderRadius;
  fontSizes: typeof tokens.fontSizes;
  zIndex: typeof tokens.zIndex;
  shadows: typeof tokens.shadows;
  breakpoints: typeof tokens.breakpoints;
}

const baseTheme = {
  ...tokens,
};

export const lightTheme: PhobosTheme = {
  ...baseTheme,
  name: 'light',
  palette: {
    ...baseTheme.palette,
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
};

export const darkTheme: PhobosTheme = {
  ...baseTheme,
  name: 'dark',
  palette: {
    ...baseTheme.palette,
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#f48fb1',
      light: '#f8bbd0',
      dark: '#f06292',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
}; 