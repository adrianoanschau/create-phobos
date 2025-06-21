import styled from 'styled-components';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<Omit<ButtonProps, 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-family: inherit;
  text-decoration: none;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  /* Tamanhos */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 8px 16px;
          font-size: 14px;
          min-height: 36px;
        `;
      case 'lg':
        return `
          padding: 16px 32px;
          font-size: 18px;
          min-height: 56px;
        `;
      default: // md
        return `
          padding: 12px 24px;
          font-size: 16px;
          min-height: 44px;
        `;
    }
  }}

  /* Variantes */
  ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return `
          background-color: #6b7280;
          color: white;
          &:hover {
            background-color: #4b5563;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #646cff;
          border: 2px solid #646cff;
          &:hover {
            background-color: #646cff;
            color: white;
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: #646cff;
          &:hover {
            background-color: rgba(100, 108, 255, 0.1);
          }
        `;
      default: // primary
        return `
          background: linear-gradient(45deg, #646cff, #535bf2);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
          }
        `;
    }
  }}

  &:focus {
    outline: 2px solid #646cff;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    ${({ size }) => {
      switch (size) {
        case 'lg':
          return `
            padding: 14px 28px;
            font-size: 16px;
            min-height: 48px;
          `;
        default:
          return '';
      }
    }}
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
}; 