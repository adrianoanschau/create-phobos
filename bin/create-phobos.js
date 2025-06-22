#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const { createProject } = require('../src/createProject');

async function main() {
  try {
    // Obter argumentos da linha de comando
    const args = process.argv.slice(2);
    let projectName = null;
    let options = {};

    // Processar argumentos
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '--all') {
        options.all = true;
      } else if (arg === '--version' || arg === '-v') {
        console.log('create-phobos version 0.4.0');
        process.exit(0);
      } else if (arg === '--help' || arg === '-h') {
        console.log(`
🚀 Create Phobos - CLI para criar projetos React modernos

Uso:
  npx create-phobos [nome-do-projeto] [opções]

Opções:
  --all     Incluir todos os módulos automaticamente
  --version Mostrar versão
  --help    Mostrar esta ajuda

Exemplos:
  npx create-phobos my-app
  npx create-phobos my-app --all
  yarn create phobos my-app
        `);
        process.exit(0);
      } else if (!arg.startsWith('-')) {
        // Se não é uma flag, é o nome do projeto
        projectName = arg;
      }
    }

    // Se não foi fornecido nome do projeto, perguntar
    if (!projectName) {
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Qual o nome do seu projeto?',
          default: 'my-phobos-app',
          validate: (input) => {
            if (!input.trim()) {
              return 'O nome do projeto é obrigatório';
            }
            if (fs.existsSync(input)) {
              return 'Uma pasta com este nome já existe';
            }
            return true;
          }
        }
      ]);
      projectName = name;
    }

    // Verificar se a pasta já existe
    if (fs.existsSync(projectName)) {
      console.error(chalk.red(`❌ Erro: Uma pasta chamada "${projectName}" já existe`));
      process.exit(1);
    }

    // Criar o projeto
    await createProject(projectName, options);
  } catch (error) {
    console.error(chalk.red('❌ Erro ao criar o projeto:'), error.message);
    process.exit(1);
  }
}

main(); 