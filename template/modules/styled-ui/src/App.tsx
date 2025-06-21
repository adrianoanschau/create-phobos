import { useState } from 'react';
import { Button, Input, Card } from './components';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Phobos App</h1>
        <p>Template moderno com Styled-Components</p>
        
        <Card padding="lg" elevation="md" hover>
          <h3>Componentes Styled-Components</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <Input
              label="Digite algo"
              placeholder="Exemplo de input..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              fullWidth
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button onClick={() => setCount((count) => count + 1)}>
              Contador: {count}
            </Button>
            
            <Button variant="secondary">
              Secundário
            </Button>
            
            <Button variant="outline">
              Outline
            </Button>
            
            <Button variant="ghost">
              Ghost
            </Button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <Button size="sm">Pequeno</Button>
            <Button size="md" style={{ margin: '0 8px' }}>Médio</Button>
            <Button size="lg">Grande</Button>
          </div>
        </Card>

        <div className="features">
          <h3>✨ Funcionalidades incluídas:</h3>
          <ul>
            <li>⚡ Vite para build rápido</li>
            <li>⚛️ React 18 com TypeScript</li>
            <li>🎨 Styled-Components para UI</li>
            <li>🛣️ React Router (se selecionado)</li>
            <li>🌙 Tema claro/escuro (se selecionado)</li>
            <li>🧪 Vitest para testes (se selecionado)</li>
            <li>🔧 ESLint + Prettier</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App; 