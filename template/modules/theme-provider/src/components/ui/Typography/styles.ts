import styled, { css } from 'styled-components';
import type { TypographyProps, TypographyVariant } from './types';

const getVariantStyles = (variant: TypographyVariant) => {
  switch (variant) {
    case 'h1':
      return css`
        font-size: 2.5rem;
        font-weight: 300;
        letter-spacing: -0.5px;
      `;
    case 'h2':
      return css`
        font-size: 2rem;
        font-weight: 300;
      `;
    case 'h3':
      return css`
        font-size: 1.75rem;
        font-weight: 400;
      `;
    case 'h4':
      return css`
        font-size: 1.5rem;
        font-weight: 400;
        letter-spacing: 0.25px;
      `;
    case 'h5':
      return css`
        font-size: 1.25rem;
        font-weight: 400;
      `;
    case 'h6':
      return css`
        font-size: 1.1rem;
        font-weight: 500;
        letter-spacing: 0.15px;
      `;
    case 'body1':
      return css`
        font-size: 1rem;
        font-weight: 400;
        letter-spacing: 0.5px;
      `;
    case 'caption':
      return css`
        font-size: 0.75rem;
        font-weight: 400;
        letter-spacing: 0.4px;
      `;
    case 'overline':
      return css`
        font-size: 0.625rem;
        font-weight: 400;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      `;
  }
};

export const StyledTypography = styled.p<TypographyProps>`
  margin: 0;
  color: ${({ theme }) => theme.palette.text.primary};
  ${({ variant = 'body1' }) => getVariantStyles(variant)};
`; 