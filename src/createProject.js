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
 * Aplica injeções de código em arquivos
 */
async function applyInjections(projectPath, injections) {
  for (const [filePath, injectionConfig] of Object.entries(injections)) {
    const fullPath = path.join(projectPath, filePath);
    
    if (!await fs.pathExists(fullPath)) {
      console.warn(chalk.yellow(`⚠️  Arquivo não encontrado para injeção: ${filePath}`));
      continue;
    }
    
    try {
      let content = await fs.readFile(fullPath, 'utf8');
      const lines = content.split('\n');
      
      // Encontrar a linha que contém o texto "after"
      const afterIndex = lines.findIndex(line => line.includes(injectionConfig.after));
      
      if (afterIndex !== -1) {
        // Inserir o conteúdo na linha seguinte
        lines.splice(afterIndex + 1, 0, injectionConfig.insert);
        content = lines.join('\n');
        
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(chalk.green(`✅ Injeção aplicada em ${filePath}`));
      } else {
        console.warn(chalk.yellow(`⚠️  Texto '${injectionConfig.after}' não encontrado em ${filePath}`));
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Erro ao aplicar injeção em ${filePath}: ${error.message}`));
    }
  }
}

/**
 * Copia arquivos seguindo as regras de cópia do módulo
 */
async function copyModuleFiles(modulePath, projectPath, copyRules) {
  if (!copyRules || Object.keys(copyRules).length === 0) {
    // Se não há regras específicas, copiar tudo exceto phobos.meta.json
    const files = await fs.readdir(modulePath);
    for (const file of files) {
      if (file !== 'phobos.meta.json') {
        const sourcePath = path.join(modulePath, file);
        const destPath = path.join(projectPath, file);
        await fs.copy(sourcePath, destPath, { overwrite: true });
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
      console.log(chalk.blue(`📁 Copiado: ${source} → ${destination}`));
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
 * Detecta o gerenciador de pacotes
 */
function detectPackageManager(projectPath) {
  // Verificar no diretório do projeto criado
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  
  // Fallback: verificar no diretório atual
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('yarn.lock')) return 'yarn';
  
  return 'npm';
}

/**
 * Função principal para criar o projeto
 */
async function createProject(projectName, options = {}) {
  const spinner = ora('Carregando módulos disponíveis...').start();
  
  try {
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

    // Copiar módulos selecionados
    for (const moduleKey of selectedModules) {
      const module = modulesMetadata[moduleKey];
      const modulePath = path.join(__dirname, `../template/modules/${moduleKey}`);
      
      if (await fs.pathExists(modulePath)) {
        spinner.text = `Copiando módulo: ${module.name}...`;
        await copyModuleFiles(modulePath, projectPath, module.copyRules);
      }
    }

    spinner.text = 'Configurando dependências e scripts...';
    
    // Atualizar package.json
    await updatePackageJson(projectPath, selectedModules, modulesMetadata);

    spinner.text = 'Aplicando injeções de código...';
    
    // Aplicar injeções de código
    for (const moduleKey of selectedModules) {
      const module = modulesMetadata[moduleKey];
      if (module.injections) {
        await applyInjections(projectPath, module.injections);
      }
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
      const module = modulesMetadata[moduleKey];
      console.log(chalk.green(`   ✓ ${module.name}`));
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

// Adaptação para CLI
if (require.main === module) {
  const argv = process.argv.slice(2);
  const projectName = argv[0];
  const options = { all: argv.includes('--all') };
  if (!projectName) {
    if (options.all) {
      console.error(chalk.red('❌ Você usou a flag --all, mas não informou o nome do projeto. Exemplo: npx create-phobos meu-app --all'));
    } else {
      console.error(chalk.red('❌ Informe o nome do projeto. Exemplo: npx create-phobos meu-app [--all]'));
    }
    process.exit(1);
  }
  createProject(projectName, options);
}

module.exports = { createProject }; 