const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Carrega os metadados de todos os módulos disponíveis
 */
async function loadModulesMetadata() {
  const modulesDir = path.join(__dirname, '../template/modules');
  const modules = {};
  
  try {
    const moduleDirs = await fs.readdir(modulesDir);
    
    for (const moduleDir of moduleDirs) {
      const modulePath = path.join(modulesDir, moduleDir);
      const stats = await fs.stat(modulePath);
      
      if (stats.isDirectory()) {
        const metaPath = path.join(modulePath, 'phobos.meta.json');
        
        if (await fs.pathExists(metaPath)) {
          try {
            const metadata = await fs.readJson(metaPath);
            modules[moduleDir] = {
              key: moduleDir,
              ...metadata
            };
          } catch (error) {
            console.warn(chalk.yellow(`⚠️  Erro ao carregar metadados do módulo ${moduleDir}: ${error.message}`));
          }
        } else {
          // Módulo sem phobos.meta.json - usar dados padrão
          modules[moduleDir] = {
            key: moduleDir,
            name: moduleDir,
            description: `Módulo ${moduleDir}`,
            dependencies: {},
            devDependencies: {},
            scripts: {},
            injections: {},
            copyRules: {}
          };
        }
      }
    }
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao carregar módulos: ${error.message}`));
    throw error;
  }
  
  return modules;
}

/**
 * Gera o PhobosProvider.tsx dinamicamente baseado nos módulos selecionados
 */
async function generatePhobosProvider(projectPath, selectedModules, modulesMetadata) {
  const providerPath = path.join(projectPath, 'src/PhobosProvider.tsx');
  
  let imports = ['import React from \'react\';'];
  let providers = [];
  
  // Adicionar imports e providers baseado nos módulos selecionados
  for (const moduleKey of selectedModules) {
    const module = modulesMetadata[moduleKey];
    
    switch (moduleKey) {
      case 'theme-dark-light':
        imports.push('import { ThemeProvider } from \'./contexts/ThemeContext\';');
        providers.push('ThemeProvider');
        break;
      case 'react-router':
        imports.push('import { BrowserRouter } from \'react-router-dom\';');
        providers.push('BrowserRouter');
        break;
    }
  }
  
  // Gerar o conteúdo do PhobosProvider
  const providerContent = `${imports.join('\n')}

export const PhobosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let app = children;
  
  ${providers.map(provider => `// ${provider} wrapper`).join('\n  ')}
  ${providers.map(provider => `app = <${provider}>{app}</${provider}>;`).join('\n  ')}
  
  return app;
};
`;

  await fs.writeFile(providerPath, providerContent, 'utf8');
  console.log(chalk.green('✅ PhobosProvider.tsx gerado dinamicamente'));
}

/**
 * Gera o main.tsx final com PhobosProvider
 */
async function generateMainTsx(projectPath) {
  const mainPath = path.join(projectPath, 'src/main.tsx');
  
  const mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PhobosProvider } from './PhobosProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PhobosProvider>
      <App />
    </PhobosProvider>
  </React.StrictMode>
);
`;

  await fs.writeFile(mainPath, mainContent, 'utf8');
  console.log(chalk.green('✅ main.tsx atualizado com PhobosProvider'));
}

/**
 * Gera o App.tsx final baseado nos módulos selecionados
 */
async function generateAppTsx(projectPath, selectedModules, modulesMetadata) {
  const appPath = path.join(projectPath, 'src/App.tsx');
  
  let imports = ['import React from \'react\';'];
  let content = '';
  
  // Verificar se react-router está selecionado
  if (selectedModules.includes('react-router')) {
    imports.push('import { Layout } from \'./components/Layout\';');
    imports.push('import { AppRoutes } from \'./routes\';');
    
    content = `
function App() {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}`;
  } else {
    // App.tsx básico sem roteamento
    content = `
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Phobos App</h1>
        <p>Template moderno com React + TypeScript + Vite</p>
      </header>
    </div>
  );
}`;
  }
  
  const appContent = `${imports.join('\n')}
import './App.css';
${content}

export default App;
`;

  await fs.writeFile(appPath, appContent, 'utf8');
  console.log(chalk.green('✅ App.tsx gerado dinamicamente'));
}

/**
 * Copia arquivos de módulos de forma integrada
 */
async function copyModuleFiles(modulePath, projectPath, copyRules) {
  if (!copyRules || Object.keys(copyRules).length === 0) {
    // Copiar tudo exceto phobos.meta.json e arquivos principais
    const files = await fs.readdir(modulePath);
    for (const file of files) {
      if (file !== 'phobos.meta.json' && file !== 'App.tsx' && file !== 'main.tsx') {
        const sourcePath = path.join(modulePath, file);
        const destPath = path.join(projectPath, file);
        
        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, destPath, { overwrite: true });
          console.log(chalk.blue(`📁 Integrado: ${file}`));
        }
      }
    }
    return;
  }
  
  // Aplicar regras de cópia específicas
  for (const [source, destination] of Object.entries(copyRules)) {
    const sourcePath = path.join(modulePath, source);
    const destPath = path.join(projectPath, destination);
    
    if (await fs.pathExists(sourcePath)) {
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(sourcePath, destPath, { overwrite: true });
      console.log(chalk.blue(`📁 Integrado: ${source} → ${destination}`));
    } else {
      console.warn(chalk.yellow(`⚠️  Caminho não encontrado: ${source}`));
    }
  }
}

/**
 * Atualiza o package.json com dependências e scripts dos módulos
 */
async function updatePackageJson(projectPath, selectedModules, modulesMetadata) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (!await fs.pathExists(packageJsonPath)) {
    throw new Error(`Arquivo package.json não encontrado em ${packageJsonPath}`);
  }
  
  let packageJson;
  try {
    packageJson = await fs.readJson(packageJsonPath);
  } catch (error) {
    throw new Error(`Erro ao ler package.json: ${error.message}`);
  }
  
  if (!packageJson || typeof packageJson !== 'object') {
    throw new Error('package.json inválido ou vazio');
  }
  
  // Garantir que as seções existam
  if (!packageJson.dependencies) packageJson.dependencies = {};
  if (!packageJson.devDependencies) packageJson.devDependencies = {};
  if (!packageJson.scripts) packageJson.scripts = {};
  
  // Adicionar dependências e scripts dos módulos selecionados
  for (const moduleKey of selectedModules) {
    const module = modulesMetadata[moduleKey];
    if (!module) continue;
    
    // Adicionar dependências
    if (module.dependencies) {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...module.dependencies
      };
    }
    
    // Adicionar devDependencies
    if (module.devDependencies) {
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        ...module.devDependencies
      };
    }
    
    // Adicionar scripts
    if (module.scripts) {
      packageJson.scripts = {
        ...packageJson.scripts,
        ...module.scripts
      };
    }
  }
  
  // Salvar package.json atualizado
  try {
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log(chalk.green('✅ package.json atualizado com sucesso'));
  } catch (error) {
    throw new Error(`Erro ao salvar package.json: ${error.message}`);
  }
}

/**
 * Detecta o gerenciador de pacotes baseado na variável de ambiente
 */
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent?.includes('pnpm')) return 'pnpm';
  if (userAgent?.includes('yarn')) return 'yarn';
  return 'npm'; // fallback
}

/**
 * Função principal para criar o projeto
 */
async function createProject(projectName, options = {}) {
  const spinner = ora('Carregando módulos disponíveis...').start();
  
  try {
    // Detectar gerenciador de pacotes
    const packageManager = detectPackageManager();
    console.log(chalk.blue(`📦 Gerenciador de pacotes detectado: ${packageManager}`));
    
    // Carregar metadados dos módulos
    const modulesMetadata = await loadModulesMetadata();
    const allModuleKeys = Object.keys(modulesMetadata);

    let selectedModules;
    if (options.all) {
      selectedModules = allModuleKeys;
      spinner.text = 'Incluindo todos os módulos automaticamente (--all)...';
    } else {
      spinner.text = 'Configurando interface interativa...';
      // Perguntar quais módulos incluir
      const answer = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedModules',
          message: 'Quais módulos você deseja incluir no seu projeto?',
          choices: Object.values(modulesMetadata).map(module => ({
            name: `${module.name} - ${module.description}`,
            value: module.key,
            checked: ['styled-ui', 'react-router'].includes(module.key) // Módulos padrão
          }))
        }
      ]);
      selectedModules = answer.selectedModules;
    }

    spinner.text = 'Criando estrutura do projeto...';
    
    // Criar pasta do projeto
    const projectPath = path.resolve(projectName);
    await fs.ensureDir(projectPath);

    // Copiar template base
    const baseTemplatePath = path.join(__dirname, '../template/base');
    await fs.copy(baseTemplatePath, projectPath);

    // Remover package-lock.json se não for npm
    if (packageManager !== 'npm') {
      const lockFilePath = path.join(projectPath, 'package-lock.json');
      if (fs.existsSync(lockFilePath)) {
        fs.removeSync(lockFilePath);
        console.log(chalk.blue(`🗑️  Removido package-lock.json (usando ${packageManager})`));
      }
    }

    // Copiar módulos selecionados (exceto App.tsx e main.tsx)
    for (const moduleKey of selectedModules) {
      const module = modulesMetadata[moduleKey];
      const modulePath = path.join(__dirname, `../template/modules/${moduleKey}`);
      
      if (await fs.pathExists(modulePath)) {
        spinner.text = `Integrando módulo: ${module.name}...`;
        await copyModuleFiles(modulePath, projectPath, module.copyRules);
      }
    }

    spinner.text = 'Gerando aplicação unificada...';
    
    // Gerar arquivos principais dinamicamente
    await generatePhobosProvider(projectPath, selectedModules, modulesMetadata);
    await generateMainTsx(projectPath);
    await generateAppTsx(projectPath, selectedModules, modulesMetadata);

    spinner.text = 'Configurando dependências e scripts...';
    
    // Atualizar package.json
    await updatePackageJson(projectPath, selectedModules, modulesMetadata);

    spinner.succeed(chalk.green('✅ Projeto criado com sucesso!'));

    // Exibir resumo
    console.log('\n' + chalk.cyan('📦 Resumo do projeto criado:'));
    console.log(chalk.white(`   Nome: ${projectName}`));
    console.log(chalk.white(`   Módulos incluídos: ${selectedModules.length}`));
    console.log(chalk.white(`   Gerenciador: ${packageManager}`));
    
    selectedModules.forEach(moduleKey => {
      const module = modulesMetadata[moduleKey];
      console.log(chalk.green(`   ✓ ${module.name}`));
    });

    console.log('\n' + chalk.yellow('🚀 Para começar:'));
    console.log(chalk.white(`   cd ${projectName}`));
    console.log(chalk.white(`   ${packageManager} install`));
    console.log(chalk.white(`   ${packageManager} dev`));

    console.log('\n' + chalk.blue('📚 Documentação:'));
    console.log(chalk.white('   Leia o README.md para mais informações'));

  } catch (error) {
    spinner.fail(chalk.red('❌ Erro ao criar o projeto'));
    throw error;
  }
}

module.exports = { createProject }; 