const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const MODULES = {
  'styled-ui': {
    name: 'UI com Styled-Components',
    description: 'Componentes reutilizáveis (Button, Input, Card, etc.)',
    dependencies: {
      'styled-components': '^6.1.0',
      '@types/styled-components': '^5.1.34'
    }
  },
  'react-router': {
    name: 'React Router com estrutura de rotas',
    description: 'Rotas com BrowserRouter, pages/, routes/ e layouts',
    dependencies: {
      'react-router-dom': '^6.20.0'
    }
  },
  'theme-dark-light': {
    name: 'Tema claro/escuro',
    description: 'ThemeProvider com toggle claro/escuro',
    dependencies: {
      'styled-components': '^6.1.0',
      '@types/styled-components': '^5.1.34'
    }
  },
  'testing': {
    name: 'Testes com Vitest',
    description: 'Setup de Vitest, @testing-library/react, testes exemplo',
    dependencies: {
      'vitest': '^1.0.0',
      '@testing-library/react': '^14.1.0',
      '@testing-library/jest-dom': '^6.1.0',
      '@testing-library/user-event': '^14.5.0',
      'jsdom': '^23.0.0'
    }
  },
  'local-cli': {
    name: 'CLI local para scaffolding',
    description: 'tools/cli.ts + script yarn generate para gerar componentes/hooks/pages',
    dependencies: {
      'tsx': '^4.6.0',
      'commander': '^11.1.0',
      'chalk': '^4.1.2'
    }
  },
  'git-hooks': {
    name: 'Git hooks com Husky',
    description: 'Husky, lint-staged, .husky/, scripts de commit',
    dependencies: {
      'husky': '^8.0.3',
      'lint-staged': '^15.2.0'
    }
  }
};

async function createProject(projectName) {
  const spinner = ora('Inicializando projeto Phobos...').start();
  
  try {
    // Perguntar quais módulos incluir
    const { selectedModules } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedModules',
        message: 'Quais módulos você deseja incluir no seu projeto?',
        choices: Object.entries(MODULES).map(([key, module]) => ({
          name: `${module.name} - ${module.description}`,
          value: key,
          checked: ['styled-ui', 'react-router'].includes(key) // Módulos padrão
        }))
      }
    ]);

    spinner.text = 'Criando estrutura do projeto...';
    
    // Criar pasta do projeto
    const projectPath = path.resolve(projectName);
    await fs.ensureDir(projectPath);

    // Copiar template base
    const baseTemplatePath = path.join(__dirname, '../template/base');
    await fs.copy(baseTemplatePath, projectPath);

    // Copiar módulos selecionados (excluindo package.json dos módulos)
    for (const moduleKey of selectedModules) {
      const modulePath = path.join(__dirname, `../template/modules/${moduleKey}`);
      if (await fs.pathExists(modulePath)) {
        // Copiar todos os arquivos exceto package.json
        const files = await fs.readdir(modulePath);
        for (const file of files) {
          if (file !== 'package.json') {
            const sourcePath = path.join(modulePath, file);
            const destPath = path.join(projectPath, file);
            await fs.copy(sourcePath, destPath, { overwrite: true });
          }
        }
      }
    }

    spinner.text = 'Configurando dependências...';
    
    // Ler package.json do projeto
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    // Verificar se o arquivo existe e é válido
    if (!await fs.pathExists(packageJsonPath)) {
      throw new Error(`Arquivo package.json não encontrado em ${packageJsonPath}`);
    }
    
    let packageJson;
    try {
      packageJson = await fs.readJson(packageJsonPath);
    } catch (error) {
      throw new Error(`Erro ao ler package.json: ${error.message}`);
    }

    // Verificar se packageJson é válido
    if (!packageJson || typeof packageJson !== 'object') {
      throw new Error('package.json inválido ou vazio');
    }

    // Garantir que dependencies existe
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    // Adicionar dependências dos módulos selecionados
    for (const moduleKey of selectedModules) {
      const module = MODULES[moduleKey];
      if (module.dependencies) {
        packageJson.dependencies = {
          ...packageJson.dependencies,
          ...module.dependencies
        };
      }
    }

    // Adicionar scripts dos módulos selecionados
    for (const moduleKey of selectedModules) {
      if (moduleKey === 'testing') {
        if (!packageJson.scripts) packageJson.scripts = {};
        packageJson.scripts.test = 'vitest';
        packageJson.scripts['test:ui'] = 'vitest --ui';
        packageJson.scripts['test:coverage'] = 'vitest --coverage';
      }
      
      if (moduleKey === 'local-cli') {
        if (!packageJson.scripts) packageJson.scripts = {};
        packageJson.scripts.generate = 'tsx tools/cli.ts';
      }
    }

    // Salvar package.json atualizado
    try {
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    } catch (error) {
      throw new Error(`Erro ao salvar package.json: ${error.message}`);
    }

    spinner.text = 'Instalando dependências...';
    
    // Detectar gerenciador de pacotes
    const packageManager = detectPackageManager(projectPath);
    
    // Instalar dependências
    try {
      execSync(`${packageManager} install`, { 
        cwd: projectPath, 
        stdio: 'inherit' 
      });
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Aviso: Erro ao instalar dependências. Execute manualmente:'));
      console.warn(chalk.white(`   cd ${projectName}`));
      console.warn(chalk.white(`   ${packageManager} install`));
    }

    // Configurar git hooks se selecionado
    if (selectedModules.includes('git-hooks')) {
      spinner.text = 'Configurando Git hooks...';
      try {
        execSync('npx husky install', { 
          cwd: projectPath, 
          stdio: 'inherit' 
        });
      } catch (error) {
        console.warn(chalk.yellow('⚠️  Aviso: Erro ao configurar Git hooks. Execute manualmente:'));
        console.warn(chalk.white(`   cd ${projectName}`));
        console.warn(chalk.white('   npx husky install'));
      }
    }

    spinner.succeed(chalk.green('✅ Projeto criado com sucesso!'));

    // Exibir resumo
    console.log('\n' + chalk.cyan('📦 Resumo do projeto criado:'));
    console.log(chalk.white(`   Nome: ${projectName}`));
    console.log(chalk.white(`   Módulos incluídos: ${selectedModules.length}`));
    
    selectedModules.forEach(moduleKey => {
      console.log(chalk.green(`   ✓ ${MODULES[moduleKey].name}`));
    });

    console.log('\n' + chalk.yellow('🚀 Para começar:'));
    console.log(chalk.white(`   cd ${projectName}`));
    console.log(chalk.white(`   ${packageManager} dev`));
    
    if (selectedModules.includes('local-cli')) {
      console.log(chalk.white(`   ${packageManager} generate`));
    }

    console.log('\n' + chalk.blue('📚 Documentação:'));
    console.log(chalk.white('   Leia o README.md para mais informações'));

  } catch (error) {
    spinner.fail(chalk.red('❌ Erro ao criar o projeto'));
    throw error;
  }
}

function detectPackageManager(projectPath) {
  // Verificar no diretório do projeto criado
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  
  // Fallback: verificar no diretório atual
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('yarn.lock')) return 'yarn';
  
  return 'npm';
}

module.exports = { createProject }; 