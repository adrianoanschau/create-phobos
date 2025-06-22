const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

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
  const providerPath = path.join(projectPath, 'src/phobos/provider.tsx');
  
  let imports = [];
  let providers = [];
  let children = [];

  if (selectedModules.includes('react-router')) {
    imports.push('import { RouterProvider } from "react-router-dom";');
    imports.push('import { router } from "@/router";');
    children.push('<RouterProvider router={router} />');
  } else {
    imports.push('import HomePage from "@/pages/home";');
    children.push('<HomePage />');
  }

  if (selectedModules.includes('theme-provider')) {
    imports.push('import { PhobosThemeProvider } from "@/theme";');
    providers.push(`<PhobosThemeProvider>
        ${children.join('\n')}
      </PhobosThemeProvider>`);
  } else {
    providers.push(children.join('\n'));
  }

  imports.push("import { PhobosContext } from './context';");
  
  // Gerar o conteúdo do PhobosProvider
  const providerContent = `${imports.join('\n')}

export function PhobosProvider() {
  return (
    <PhobosContext.Provider value={{}}>
      ${providers.join('\n')}
    </PhobosContext.Provider>
  );
};
`;

  await fs.writeFile(providerPath, providerContent, 'utf8');
  console.log(chalk.green('✅ PhobosProvider.tsx gerado dinamicamente'));
}

/**
 * Copia arquivos de módulos de forma integrada
 */
async function copyModuleFiles(modulePath, projectPath, copyRules) {
  if (!copyRules || Object.keys(copyRules).length === 0) {
    // Copiar tudo exceto phobos.meta.json
    const files = await fs.readdir(modulePath);
    for (const file of files) {
      if (file !== 'phobos.meta.json') {
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

async function selectModules(modulesMetadata, options, spinner) {
  // Carregar metadados dos módulos
  const allModuleKeys = Object.keys(modulesMetadata);
  
  if (options.all) {
    spinner.text = 'Incluindo todos os módulos automaticamente (--all)...';

    return allModuleKeys;
  }

  const answer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: 'Quais módulos você deseja incluir no seu projeto:',
      choices: [...allModuleKeys, null].map(key => {
        if (!key) return {
          name: '',
          value: null,
          checked: false,
        };

        const module = modulesMetadata[key];
        const name = `${module.name}`.padEnd(20, ' ');
        const description = `${module.description}`.padEnd(40, ' ');

        return {
          name: `${name}· ${description}`,
          value: key,
          checked: ['react-router', 'theme-provider'].includes(module.key),
        };
      }),
      pageSize: 10,
      default: ['react-router', 'theme-provider'],
    }
  ]);

  return answer.features.filter(Boolean);
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

    const modulesMetadata = await loadModulesMetadata();
    const selectedModules = await selectModules(modulesMetadata, options, spinner);

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
        spinner.text = `Integrando módulo: ${module.name}...`;
        await copyModuleFiles(modulePath, projectPath, module.copyRules);
      }
    }

    spinner.text = 'Gerando aplicação unificada...';

    // Gerar arquivos principais dinamicamente
    await generatePhobosProvider(projectPath, selectedModules, modulesMetadata);

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