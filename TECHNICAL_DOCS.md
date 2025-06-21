# 📚 Documentação Técnica - create-phobos

## 🏗️ Arquitetura do Projeto

### Estrutura Geral
```
create-phobos/
├── bin/
│   └── create-phobos.js       # Entrada principal da CLI
├── src/
│   └── createProject.js       # Lógica principal de criação
├── template/
│   ├── base/                  # Template mínimo
│   └── modules/               # Módulos plug-and-play
│       ├── styled-ui/         # Componentes UI
│       ├── react-router/      # Roteamento
│       ├── theme-dark-light/  # Sistema de tema
│       ├── testing/           # Setup de testes
│       ├── local-cli/         # CLI local
│       └── git-hooks/         # Git hooks
├── package.json               # Configuração do pacote
└── README.md                  # Documentação principal
```

## 🔧 Componentes Principais

### 1. CLI Principal (`bin/create-phobos.js`)
- **Responsabilidade**: Ponto de entrada da CLI
- **Tecnologias**: Commander.js, Inquirer.js
- **Funcionalidades**:
  - Validação de nome do projeto
  - Interface interativa
  - Tratamento de erros

### 2. Engine de Criação (`src/createProject.js`)
- **Responsabilidade**: Lógica de criação do projeto
- **Funcionalidades**:
  - Seleção interativa de módulos
  - Cópia de templates
  - Gerenciamento de dependências
  - Instalação automática

### 3. Template Base (`template/base/`)
- **Conteúdo**: Projeto React mínimo
- **Arquivos**:
  - `package.json` - Dependências base
  - `vite.config.ts` - Configuração Vite
  - `tsconfig.json` - Configuração TypeScript
  - `src/main.tsx` - Ponto de entrada
  - `src/App.tsx` - Componente principal

## 🧩 Sistema de Módulos

### Módulo: styled-ui
**Propósito**: Componentes UI reutilizáveis
**Dependências**: `styled-components`, `@types/styled-components`
**Estrutura**:
```
styled-ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Card/
│   └── App.tsx (versão com componentes)
```

**Componentes**:
- **Button**: Variantes (primary, secondary, outline, ghost), tamanhos (sm, md, lg)
- **Input**: Validação, labels, tipos diversos
- **Card**: Elevação, hover effects, padding configurável

### Módulo: react-router
**Propósito**: Sistema de roteamento completo
**Dependências**: `react-router-dom`
**Estrutura**:
```
react-router/
├── src/
│   ├── components/
│   │   └── Layout/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── NotFoundPage.tsx
│   └── App.tsx (versão com roteamento)
```

**Funcionalidades**:
- Layout responsivo com navegação
- Páginas pré-construídas
- Roteamento declarativo
- 404 personalizado

### Módulo: theme-dark-light
**Propósito**: Sistema de tema dinâmico
**Dependências**: `styled-components`
**Estrutura**:
```
theme-dark-light/
├── src/
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── components/
│   │   └── ThemeToggle/
│   └── App.tsx (versão com tema)
```

**Funcionalidades**:
- ThemeProvider com contexto
- Toggle de tema (claro/escuro)
- Persistência no localStorage
- Detecção de preferência do sistema
- Transições suaves

### Módulo: testing
**Propósito**: Setup completo de testes
**Dependências**: `vitest`, `@testing-library/react`, `jsdom`
**Estrutura**:
```
testing/
├── vitest.config.ts
├── src/
│   └── test/
│       └── setup.ts
└── package.json (scripts de teste)
```

**Funcionalidades**:
- Configuração Vitest + Testing Library
- Ambiente jsdom
- Setup automático
- Scripts de teste

### Módulo: local-cli
**Propósito**: CLI local para scaffolding
**Dependências**: `tsx`, `commander`, `chalk`
**Estrutura**:
```
local-cli/
├── tools/
│   └── cli.ts
└── package.json (script generate)
```

**Funcionalidades**:
- Gerar componentes
- Gerar hooks customizados
- Gerar páginas
- Templates otimizados

### Módulo: git-hooks
**Propósito**: Git hooks com validação
**Dependências**: `husky`, `lint-staged`
**Estrutura**:
```
git-hooks/
├── .husky/
│   └── pre-commit
└── .lintstagedrc
```

**Funcionalidades**:
- Pre-commit hooks
- Linting automático
- Formatação automática
- Validação de código

## 🔄 Fluxo de Execução

### 1. Inicialização
```javascript
// bin/create-phobos.js
program.argument('[project-name]')
  .action(async (projectName) => {
    // Validação e criação
  });
```

### 2. Seleção de Módulos
```javascript
// src/createProject.js
const { selectedModules } = await inquirer.prompt([
  {
    type: 'checkbox',
    name: 'selectedModules',
    message: 'Quais módulos você deseja incluir?',
    choices: Object.entries(MODULES).map(...)
  }
]);
```

### 3. Criação do Projeto
```javascript
// 1. Criar pasta do projeto
await fs.ensureDir(projectPath);

// 2. Copiar template base
await fs.copy(baseTemplatePath, projectPath);

// 3. Copiar módulos selecionados
for (const moduleKey of selectedModules) {
  await fs.copy(modulePath, projectPath, { overwrite: true });
}
```

### 4. Gerenciamento de Dependências
```javascript
// Adicionar dependências dos módulos
for (const moduleKey of selectedModules) {
  const module = MODULES[moduleKey];
  if (module.dependencies) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...module.dependencies
    };
  }
}
```

### 5. Instalação e Configuração
```javascript
// Instalar dependências
execSync(`${packageManager} install`, { cwd: projectPath });

// Configurar git hooks (se selecionado)
if (selectedModules.includes('git-hooks')) {
  execSync('npx husky install', { cwd: projectPath });
}
```

## 🎨 Sistema de Temas

### Estrutura do Tema
```typescript
interface Theme {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}
```

### Uso do Tema
```typescript
const StyledComponent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
```

## 🧪 Sistema de Testes

### Configuração Vitest
```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

### Exemplo de Teste
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});
```

## 🔧 CLI Local

### Comandos Disponíveis
```bash
# Gerar componente
npm run generate component MyComponent

# Gerar hook
npm run generate hook useMyHook

# Gerar página
npm run generate page MyPage
```

### Templates
- **Componente**: Estrutura com styled-components
- **Hook**: Template com useState/useEffect
- **Página**: Estrutura de página completa

## 🚀 Deploy e Publicação

### Preparação para NPM
1. **Build do projeto**
2. **Testes automatizados**
3. **Documentação atualizada**
4. **Versionamento semântico**

### Estrutura do Pacote Publicado
```
create-phobos@1.0.0/
├── bin/
│   └── create-phobos.js
├── template/
│   ├── base/
│   └── modules/
├── src/
│   └── createProject.js
└── package.json
```

## 🔍 Monitoramento e Debug

### Logs da CLI
- Spinner com progresso
- Mensagens de sucesso/erro
- Resumo final detalhado

### Tratamento de Erros
- Validação de nome do projeto
- Verificação de pasta existente
- Fallback para gerenciador de pacotes
- Rollback em caso de erro

## 📈 Métricas e Performance

### Otimizações
- Cópia seletiva de arquivos
- Instalação paralela de dependências
- Cache de templates
- Lazy loading de módulos

### Benchmarks
- Tempo de criação: ~30-60s
- Tamanho do pacote: ~2MB
- Dependências: ~15 pacotes principais

## 🔮 Roadmap

### Versão 1.1
- [ ] Suporte a mais gerenciadores de pacotes
- [ ] Templates adicionais
- [ ] Configuração de CI/CD

### Versão 1.2
- [ ] Plugin system
- [ ] Customização avançada
- [ ] Integração com IDEs

### Versão 2.0
- [ ] Interface gráfica
- [ ] Templates dinâmicos
- [ ] Marketplace de módulos 