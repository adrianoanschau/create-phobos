import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  margin: 0;
  background: linear-gradient(45deg, #646cff, #535bf2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 1rem 0;
  color: #374151;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(45deg, #646cff, #535bf2);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
  }
`;

export const NotFoundPage: React.FC = () => {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <Title>Página não encontrada</Title>
      <Message>
        A página que você está procurando não existe ou foi movida para outro local.
        Verifique o URL ou navegue de volta para a página inicial.
      </Message>
      <HomeButton to="/">Voltar para Home</HomeButton>
    </NotFoundContainer>
  );
}; 