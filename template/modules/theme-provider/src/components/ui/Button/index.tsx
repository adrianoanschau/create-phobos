import React from 'react';
import { StyledButton } from './styles';
import type { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton {...props} disabled={disabled || loading}>
      {loading && <span className="loader" />}
      {children}
    </StyledButton>
  );
}; 