import React from 'react';
import { StyledTypography } from './styles';
import type { TypographyProps } from './types';

const variantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  caption: 'span',
  overline: 'span',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  as,
  ...props
}) => {
  const Component = as || variantMapping[variant] || 'p';

  return <StyledTypography as={Component} variant={variant} {...props} />;
}; 