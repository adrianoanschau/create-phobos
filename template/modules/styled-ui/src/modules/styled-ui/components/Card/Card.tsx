import React from 'react';
import styled from 'styled-components';

export interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled.div<Omit<CardProps, 'children'>>`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  transition: all 0.2s ease-in-out;

  /* Padding */
  ${({ padding }) => {
    switch (padding) {
      case 'sm':
        return 'padding: 16px;';
      case 'lg':
        return 'padding: 32px;';
      default: // md
        return 'padding: 24px;';
    }
  }}

  /* Elevação */
  ${({ elevation }) => {
    switch (elevation) {
      case 'sm':
        return 'box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);';
      case 'md':
        return 'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);';
      case 'lg':
        return 'box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);';
      default: // none
        return 'box-shadow: none;';
    }
  }}

  /* Hover effect */
  ${({ hover, elevation }) => {
    if (!hover) return '';
    
    const baseShadow = elevation === 'none' ? '0 1px 3px rgba(0, 0, 0, 0.1)' :
                      elevation === 'sm' ? '0 2px 4px rgba(0, 0, 0, 0.15)' :
                      elevation === 'md' ? '0 6px 12px rgba(0, 0, 0, 0.15)' :
                      '0 15px 25px rgba(0, 0, 0, 0.15)';
    
    return `
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${baseShadow};
      }
    `;
  }}

  @media (max-width: 768px) {
    ${({ padding }) => {
      switch (padding) {
        case 'lg':
          return 'padding: 24px;';
        default:
          return '';
      }
    }}
  }
`;

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  elevation = 'sm',
  hover = false,
  fullWidth = false,
  onClick,
  className,
  ...props
}) => {
  return (
    <StyledCard
      padding={padding}
      elevation={elevation}
      hover={hover}
      fullWidth={fullWidth}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  );
}; 