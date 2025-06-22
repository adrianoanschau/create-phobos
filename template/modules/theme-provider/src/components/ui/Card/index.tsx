import styled, { css } from 'styled-components';

interface CardProps {
  hoverable?: boolean;
}

export const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.md};
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

  ${({ hoverable }) =>
    hoverable &&
    css`
      &:hover {
        box-shadow: ${({ theme }) => theme.shadows.lg};
        transform: translateY(-4px);
      }
    `}
`; 