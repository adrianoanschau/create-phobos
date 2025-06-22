import styled, { css, keyframes } from 'styled-components';
import type { ButtonProps, ButtonVariant, ButtonColor } from './types';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const sizes = {
  sm: css`
    padding: 6px 12px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
  md: css`
    padding: 8px 16px;
    font-size: ${({ theme }) => theme.fontSizes.md};
  `,
  lg: css`
    padding: 12px 24px;
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `,
};

const getVariantStyles = (variant: ButtonVariant, color: ButtonColor) => {
  return css`
    ${({ theme }) => {
      const colors = theme.palette[color] || { main: 'inherit', contrastText: 'inherit' };
      switch (variant) {
        case 'contained':
          return css`
            background-color: ${colors.main};
            color: ${colors.contrastText};
            border: 2px solid transparent;
            &:hover {
              background-color: ${colors.dark};
            }
          `;
        case 'outlined':
          return css`
            background-color: transparent;
            color: ${colors.main};
            border: 2px solid ${colors.main};
            &:hover {
              background-color: ${colors.light}20; // 20 for alpha
            }
          `;
        case 'text':
          return css`
            background-color: transparent;
            color: ${colors.main};
            border: 2px solid transparent;
            &:hover {
              background-color: ${colors.light}20;
            }
          `;
      }
    }}
  `;
};

export const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  text-transform: uppercase;
  white-space: nowrap;

  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  ${({ size = 'md' }) => sizes[size]};
  ${({ variant = 'contained', color = 'primary' }) => getVariantStyles(variant, color)};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: ${({ theme }) => theme.palette.neutral.main};
    color: ${({ theme }) => theme.palette.text.disabled};
    border-color: transparent;
  }
  
  .loader {
    animation: ${spin} 1s linear infinite;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-right-color: transparent;
    display: inline-block;
  }
`; 