# 🚀 Create Phobos

CLI moderna para criar projetos React com TypeScript, Vite e módulos plugáveis. Gera aplicações unificadas e dinâmicas baseadas nos módulos selecionados.

## ✨ Características

- **Aplicação Unificada**: Estrutura final coesa, não subaplicações separadas
- **Composição Dinâmica**: `PhobosProvider.tsx` gerado automaticamente com providers necessários
- **Módulos Plugáveis**: Escolha quais funcionalidades incluir
- **TypeScript + Vite**: Setup moderno e otimizado
- **Styled-Components**: CSS-in-JS com tema claro/escuro
- **React Router**: Roteamento completo com páginas e layouts
- **Testing**: Vitest + Testing Library configurados
- **Git Hooks**: Husky + lint-staged para qualidade de código
- **CLI Local**: Ferramentas de scaffolding integradas

## 🎯 Módulos Disponíveis

| Módulo | Descrição | Dependências |
|--------|-----------|--------------|
| `styled-ui` | Componentes reutilizáveis (Button, Input, Card) | styled-components |
| `react-router` | Rotas com BrowserRouter, páginas e layouts | react-router-dom |
| `theme-dark-light` | ThemeProvider com toggle claro/escuro | styled-components |
| `testing` | Setup completo de Vitest + Testing Library | vitest, @testing-library/* |
| `git-hooks` | Husky + lint-staged para qualidade | husky, lint-staged |
| `local-cli` | CLI local para scaffolding | tsx, commander |

## 🚀 Uso Rápido

### Criar projeto com todos os módulos
```bash
npx create-phobos my-app --all
```

### Criar projeto interativo
```bash
npx create-phobos my-app
```

### Usar com yarn
```bash
yarn create phobos my-app
```

## 📁 Estrutura Gerada

```
my-app/
├── src/
│   ├── App.tsx              # App principal (gerado dinamicamente)
│   ├── main.tsx             # Entry point com PhobosProvider
│   ├── PhobosProvider.tsx   # Providers compostos dinamicamente
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/              # Páginas (se react-router)
│   ├── routes/             # Configuração de rotas
│   ├── contexts/           # Contextos (se theme-dark-light)
│   ├── hooks/              # Hooks customizados
│   ├── styles/             # Temas e estilos
│   └── test/               # Setup de testes
├── tools/                  # CLI local (se local-cli)
├── .husky/                 # Git hooks (se git-hooks)
└── package.json            # Dependências unificadas
```

## 🔧 Como Funciona

### 1. Composição Dinâmica de Providers

O `PhobosProvider.tsx` é gerado automaticamente baseado nos módulos selecionados:

```tsx
// Exemplo com react-router + theme-dark-light
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

export const PhobosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let app = children;
  
  // BrowserRouter wrapper
  // ThemeProvider wrapper
  app = <BrowserRouter>{app}</BrowserRouter>;
  app = <ThemeProvider>{app}</ThemeProvider>;
  
  return app;
};
```

### 2. App.tsx Dinâmico

O `App.tsx` é gerado baseado nos módulos ativos:

```tsx
// Com react-router
import React from 'react';
import { Layout } from './components/Layout';
import { AppRoutes } from './routes';
import './App.css';

function App() {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
```

### 3. Integração de Módulos

Cada módulo define suas regras de cópia no `phobos.meta.json`:

```json
{
  "name": "React Router",
  "dependencies": {
    "react-router-dom": "^6.20.0"
  },
  "copyRules": {
    "src/components": "src/components",
    "src/pages": "src/pages",
    "src/routes": "src/routes"
  }
}
```

## 🎨 Módulos em Detalhe

### Styled-UI
- Componentes: Button, Input, Card
- Sistema de design tokens
- Props tipadas com TypeScript

### React Router
- Estrutura de páginas completa
- Layout responsivo
- Rotas configuradas automaticamente

### Theme Dark/Light
- ThemeProvider com persistência
- Hook `useThemeToggle`
- Temas claro/escuro pré-configurados

### Testing
- Vitest + Testing Library
- Setup para componentes e hooks
- Exemplos de testes incluídos

### Git Hooks
- Husky para pre-commit
- lint-staged para arquivos modificados
- Prettier + ESLint integrados

### Local CLI
- Ferramentas de scaffolding
- Geração de componentes/páginas/hooks
- Integração com o projeto

## 🛠️ Desenvolvimento

### Estrutura do Template

```
template/
├── base/                    # Template base
│   ├── src/
│   ├── package.json
│   └── ...
└── modules/                 # Módulos plugáveis
    ├── styled-ui/
    │   ├── phobos.meta.json
    │   └── src/
    ├── react-router/
    │   ├── phobos.meta.json
    │   └── src/
    └── ...
```

### Adicionando Novos Módulos

1. Crie a pasta em `template/modules/nome-do-modulo/`
2. Adicione `phobos.meta.json` com metadados
3. Defina `copyRules` para integração
4. Adicione dependências e scripts necessários

### phobos.meta.json

```json
{
  "name": "Nome do Módulo",
  "description": "Descrição do módulo",
  "dependencies": {
    "pacote": "^1.0.0"
  },
  "devDependencies": {
    "@types/pacote": "^1.0.0"
  },
  "scripts": {
    "script": "comando"
  },
  "copyRules": {
    "src/arquivo": "destino/arquivo"
  }
}
```

## 📦 Publicação

```bash
npm version patch  # ou minor/major
npm publish
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Criado com ❤️ por [Adriano Santos](https://github.com/adrianosantos) 