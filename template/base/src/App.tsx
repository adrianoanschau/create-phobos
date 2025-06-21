import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Phobos App</h1>
        <p>Template moderno de frontend com React + TypeScript + Vite</p>
        
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Contador: {count}
          </button>
          <p>
            Edite <code>src/App.tsx</code> e salve para testar o HMR
          </p>
        </div>

        <div className="features">
          <h3>✨ Funcionalidades incluídas:</h3>
          <ul>
            <li>⚡ Vite para build rápido</li>
            <li>⚛️ React 18 com TypeScript</li>
            <li>🎨 Styled-Components (se selecionado)</li>
            <li>🛣️ React Router (se selecionado)</li>
            <li>🌙 Tema claro/escuro (se selecionado)</li>
            <li>🧪 Vitest para testes (se selecionado)</li>
            <li>🔧 ESLint + Prettier</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App 