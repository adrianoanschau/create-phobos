import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import styled from 'styled-components';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s ease;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(45deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Button = styled.button`
  background: linear-gradient(45deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const FeatureItem = styled.li`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

function App() {
  const [count, setCount] = useState(0);

  const features = [
    { icon: '⚡', title: 'Vite', description: 'Build tool rápida' },
    { icon: '⚛️', title: 'React 18', description: 'Biblioteca de UI' },
    { icon: '🎨', title: 'Styled-Components', description: 'CSS-in-JS' },
    { icon: '🌙', title: 'Tema Dinâmico', description: 'Claro/escuro' },
    { icon: '🛣️', title: 'React Router', description: 'Roteamento' },
    { icon: '🧪', title: 'Vitest', description: 'Testes' }
  ];

  return (
    <ThemeProvider>
      <AppContainer>
        <Header>
          <Title>🚀 Phobos App</Title>
          <ThemeToggle />
        </Header>

        <Content>
          <Card>
            <h2>Template com Tema Dinâmico</h2>
            <p>Clique no botão de tema no canto superior direito para alternar entre modo claro e escuro!</p>
            
            <div style={{ marginTop: '2rem' }}>
              <Button onClick={() => setCount(count + 1)}>
                Contador: {count}
              </Button>
              <Button onClick={() => setCount(0)}>
                Resetar
              </Button>
            </div>
          </Card>

          <Card>
            <h3>✨ Funcionalidades Incluídas</h3>
            <FeaturesList>
              {features.map((feature, index) => (
                <FeatureItem key={index}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {feature.icon}
                  </div>
                  <h4 style={{ margin: '0.5rem 0', color: 'inherit' }}>
                    {feature.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                    {feature.description}
                  </p>
                </FeatureItem>
              ))}
            </FeaturesList>
          </Card>
        </Content>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App; 