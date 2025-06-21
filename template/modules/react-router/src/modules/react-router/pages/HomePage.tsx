import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Hero = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #646cff, #535bf2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Vite',
      description: 'Build tool rápida e moderna para desenvolvimento React'
    },
    {
      icon: '⚛️',
      title: 'React 18',
      description: 'Biblioteca de UI com TypeScript e hooks modernos'
    },
    {
      icon: '🎨',
      title: 'Styled-Components',
      description: 'CSS-in-JS para estilização componentizada'
    },
    {
      icon: '🛣️',
      title: 'React Router',
      description: 'Roteamento declarativo e navegação SPA'
    },
    {
      icon: '🌙',
      title: 'Tema Dinâmico',
      description: 'Suporte a modo claro/escuro com ThemeProvider'
    },
    {
      icon: '🧪',
      title: 'Vitest',
      description: 'Framework de testes rápido e moderno'
    }
  ];

  return (
    <HomeContainer>
      <Hero>
        <Title>Bem-vindo ao Phobos</Title>
        <Subtitle>
          Template moderno de frontend com React, TypeScript e Vite
        </Subtitle>
      </Hero>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </HomeContainer>
  );
}; 