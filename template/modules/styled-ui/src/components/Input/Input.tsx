import React from 'react';
import styled from 'styled-components';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  required?: boolean;
  name?: string;
  id?: string;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label<{ error?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ error }) => (error ? '#ef4444' : '#374151')};
`;

const StyledInput = styled.input<Omit<InputProps, 'children' | 'label'>>`
  padding: 12px 16px;
  border: 2px solid ${({ error }) => (error ? '#ef4444' : '#d1d5db')};
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  background-color: white;
  color: #111827;
  transition: all 0.2s ease-in-out;
  width: 100%;
  box-sizing: border-box;

  /* Tamanhos */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 8px 12px;
          font-size: 14px;
          min-height: 36px;
        `;
      case 'lg':
        return `
          padding: 16px 20px;
          font-size: 18px;
          min-height: 56px;
        `;
      default: // md
        return `
          padding: 12px 16px;
          font-size: 16px;
          min-height: 44px;
        `;
    }
  }}

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? '#ef4444' : '#646cff')};
    box-shadow: 0 0 0 3px ${({ error }) => 
      error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 108, 255, 0.1)'};
  }

  &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    border-color: ${({ error }) => (error ? '#ef4444' : '#9ca3af')};
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Evita zoom no iOS */
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  error = false,
  fullWidth = false,
  size = 'md',
  label,
  required = false,
  name,
  id,
  ...props
}) => {
  const inputId = id || name;

  return (
    <InputContainer fullWidth={fullWidth}>
      {label && (
        <Label htmlFor={inputId} error={error}>
          {label}
          {required && <span style={{ color: '#ef4444' }}> *</span>}
        </Label>
      )}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        error={error}
        size={size}
        required={required}
        name={name}
        id={inputId}
        {...props}
      />
      {error && (
        <ErrorMessage>Este campo é obrigatório</ErrorMessage>
      )}
    </InputContainer>
  );
}; 