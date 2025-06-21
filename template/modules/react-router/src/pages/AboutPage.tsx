import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #374151;
  text-align: center;
`;

const Content = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #646cff;
`;

const Paragraph = styled.p`
  line-height: 1.7;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const TechList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TechItem = styled.li`
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  color: #374151;
`;

export const AboutPage: React.FC = () => {
  const technologies = [
    'React 18',
    'TypeScript',
    'Vite',
    'Styled-Components',
    'React Router',
    'ESLint',
    'Prettier',
    'Vitest'
  ];

  return (
    <AboutContainer>
      <Title>Sobre o Phobos</Title>
      
      <Content>
        <Section>
          <SectionTitle>O que é o Phobos?</SectionTitle>
          <Paragraph>
            O Phobos é um template moderno de frontend que oferece uma base sólida 
            para desenvolvimento de aplicações React. Criado com foco em performance, 
            escalabilidade e experiência do desenvolvedor.
          </Paragraph>
          <Paragraph>
            Este template foi projetado para ser modular e flexível, permitindo que 
            você escolha apenas as funcionalidades que precisa para seu projeto.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>Características Principais</SectionTitle>
          <Paragraph>
            • <strong>Modular:</strong> Escolha apenas os módulos que precisa
          </Paragraph>
          <Paragraph>
            • <strong>Moderno:</strong> Utiliza as tecnologias mais recentes do ecossistema React
          </Paragraph>
          <Paragraph>
            • <strong>Responsivo:</strong> Design mobile-first por padrão
          </Paragraph>
          <Paragraph>
            • <strong>Tipado:</strong> TypeScript para maior segurança e produtividade
          </Paragraph>
          <Paragraph>
            • <strong>Rápido:</strong> Vite para builds e hot reload ultra-rápidos
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>Tecnologias Utilizadas</SectionTitle>
          <Paragraph>
            O Phobos utiliza um conjunto cuidadosamente selecionado de tecnologias 
            modernas para oferecer a melhor experiência de desenvolvimento:
          </Paragraph>
          <TechList>
            {technologies.map((tech, index) => (
              <TechItem key={index}>{tech}</TechItem>
            ))}
          </TechList>
        </Section>

        <Section>
          <SectionTitle>Como Usar</SectionTitle>
          <Paragraph>
            Para começar com o Phobos, simplesmente execute o comando de criação 
            e escolha os módulos que deseja incluir em seu projeto:
          </Paragraph>
          <Paragraph>
            <code>npx create-phobos meu-projeto</code>
          </Paragraph>
          <Paragraph>
            A CLI interativa irá guiá-lo através do processo de configuração, 
            permitindo que você personalize seu projeto desde o início.
          </Paragraph>
        </Section>
      </Content>
    </AboutContainer>
  );
}; 