import React from 'react';
import { AvatarWrapper, AvatarImage } from './styles';
import type { AvatarProps } from './types';

const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size,
  children,
  ...props
}) => {
  return (
    <AvatarWrapper size={size} {...props}>
      {src ? (
        <AvatarImage src={src} alt={alt} />
      ) : (
        children || getInitials(alt)
      )}
    </AvatarWrapper>
  );
}; 