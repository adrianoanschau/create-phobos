export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

type BreakpointKey = keyof typeof breakpoints;

export const up = (key: BreakpointKey) => `@media (min-width: ${breakpoints[key]}px)`;

export const down = (key: BreakpointKey) => `@media (max-width: ${breakpoints[key]}px)`; 