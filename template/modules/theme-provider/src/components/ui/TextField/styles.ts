import styled, { css } from 'styled-components';

interface WrapperProps {
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Wrapper = styled.div<WrapperProps>`
  position: relative;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const StyledInput = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 16px 12px 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme, error }) => (error ? theme.palette.secondary.main : theme.palette.neutral.dark)};
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => (error ? theme.palette.secondary.dark : theme.palette.primary.main)};
  }

  // Hide placeholder when the input has a value or is focused
  &:not(:placeholder-shown) + label,
  &:focus + label {
    transform: translateY(-10px) scale(0.75);
    color: ${({ theme, error }) => (error ? theme.palette.secondary.dark : theme.palette.primary.main)};
  }
`;

export const Label = styled.label`
  position: absolute;
  top: 12px;
  left: 12px;
  color: ${({ theme }) => theme.palette.text.secondary};
  pointer-events: none;
  transform-origin: top left;
  transition: transform 0.2s, color 0.2s;
`;

export const HelperText = styled.span<{ error?: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, error }) => (error ? theme.palette.secondary.main : theme.palette.text.secondary)};
  margin-top: 4px;
  display: block;
`; 