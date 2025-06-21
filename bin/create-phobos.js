#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

const { createProject } = require('../src/createProject');

program
  .name('create-phobos')
  .description('CLI interativa para criar projetos React modernos com TypeScript e Vite')
  .version('1.0.0')
  .argument('[project-name]', 'Nome do projeto')
  .action(async (projectName) => {
    try {
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

      if (fs.existsSync(projectName)) {
        console.error(chalk.red(`❌ Erro: Uma pasta chamada "${projectName}" já existe`));
        process.exit(1);
      }

      await createProject(projectName);
    } catch (error) {
      console.error(chalk.red('❌ Erro ao criar o projeto:'), error.message);
      process.exit(1);
    }
  });

program.parse(); 