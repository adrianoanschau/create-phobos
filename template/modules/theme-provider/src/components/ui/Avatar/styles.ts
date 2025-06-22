import styled from 'styled-components';
import type { AvatarProps } from './types';

export const AvatarWrapper = styled.div<Omit<AvatarProps, 'alt' | 'src'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  width: ${({ size }) => size || 40}px;
  height: ${({ size }) => size || 40}px;
  
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  
  font-size: ${({ size }) => (size || 40) / 2}px;
  overflow: hidden;
  user-select: none;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`; 