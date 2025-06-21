# 🚀 create-phobos

CLI interativa para criar projetos React modernos com TypeScript e Vite.

## ✨ Características

- ⚡ **CLI Interativa** - Escolha apenas os módulos que precisa
- 🧩 **Modular** - Módulos plug-and-play
- ⚛️ **React 18** - Com TypeScript
- 🎨 **Styled-Components** - CSS-in-JS
- 🛣️ **React Router** - Roteamento moderno
- 🌙 **Tema Dinâmico** - Suporte a modo claro/escuro
- 🧪 **Vitest** - Framework de testes
- 🔧 **ESLint + Prettier** - Qualidade de código
- 📱 **Responsivo** - Design mobile-first

## 🚀 Como usar

```bash
npx create-phobos my-app
```

A CLI irá perguntar quais módulos você deseja incluir:

- ✅ UI com Styled-Components
- ✅ React Router com estrutura de rotas
- ✅ Tema claro/escuro com ThemeProvider
- ✅ Testes com Vitest
- ✅ CLI local para scaffolding
- ✅ Git hooks com Husky

## 📦 Módulos Disponíveis

### 🎨 styled-ui
Componentes reutilizáveis com Styled-Components:
- Button (com variantes e tamanhos)
- Input (com validação e labels)
- Card (com elevação e hover)

### 🛣️ react-router
Estrutura de roteamento completa:
- Layout com navegação
- Páginas: Home, About, Contact, 404
- Navegação responsiva

### 🌙 theme-dark-light
Sistema de tema dinâmico:
- ThemeProvider com contexto
- Toggle de tema (claro/escuro)
- Persistência no localStorage
- Detecção de preferência do sistema

### 🧪 testing
Setup completo de testes:
- Vitest + Testing Library
- Configuração de ambiente
- Testes de exemplo

### 🔧 local-cli
CLI local para scaffolding:
- Gerar componentes
- Gerar hooks customizados
- Gerar páginas
- Templates otimizados

### 🪝 git-hooks
Git hooks com Husky:
- Pre-commit com lint-staged
- ESLint + Prettier automático
- Validação de código

## 📁 Estrutura do Projeto

```
my-app/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── hooks/         # Custom hooks
│   ├── contexts/      # Contextos React
│   ├── utils/         # Funções utilitárias
│   ├── types/         # Definições TypeScript
│   ├── test/          # Setup de testes
│   ├── App.tsx        # Componente principal
│   └── main.tsx       # Ponto de entrada
├── tools/             # CLI local (se incluído)
├── .husky/            # Git hooks (se incluído)
├── vite.config.ts     # Configuração Vite
├── tsconfig.json      # Configuração TypeScript
├── .eslintrc.cjs      # Configuração ESLint
└── .prettierrc        # Configuração Prettier
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint

# Testes (se configurado)
npm run test

# CLI local (se configurado)
npm run generate component MyComponent
npm run generate hook useMyHook
npm run generate page MyPage
```

## 🎯 Exemplo de Uso

```bash
# Criar projeto com todos os módulos
npx create-phobos my-dashboard

# Escolher módulos interativamente
npx create-phobos my-app
# ✅ UI com Styled-Components
# ✅ React Router
# ❌ Tema claro/escuro
# ✅ Testes com Vitest
# ❌ CLI local
# ✅ Git hooks
```

## 🔧 Tecnologias

- [React 18](https://reactjs.org/) - Biblioteca de UI
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Vite](https://vitejs.dev/) - Build tool
- [Styled-Components](https://styled-components.com/) - CSS-in-JS
- [React Router](https://reactrouter.com/) - Roteamento
- [Vitest](https://vitest.dev/) - Framework de testes
- [ESLint](https://eslint.org/) - Linter
- [Prettier](https://prettier.io/) - Formatador
- [Husky](https://typicode.github.io/husky/) - Git hooks

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Vite](https://vitejs.dev/) pela build tool incrível
- [React](https://reactjs.org/) pela biblioteca de UI
- [Styled-Components](https://styled-components.com/) pelo CSS-in-JS
- [React Router](https://reactrouter.com/) pelo roteamento
- [Vitest](https://vitest.dev/) pelos testes rápidos 