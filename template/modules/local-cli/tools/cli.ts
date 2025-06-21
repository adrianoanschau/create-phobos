#!/usr/bin/env tsx

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

interface ComponentConfig {
  name: string;
  type: 'component' | 'hook' | 'page';
  template: string;
}

const COMPONENT_TEMPLATE = `import React from 'react';
import styled from 'styled-components';

export interface {{name}}Props {
  // Add your props here
}

const Styled{{name}} = styled.div\`
  // Add your styles here
\`;

export const {{name}}: React.FC<{{name}}Props> = (props) => {
  return (
    <Styled{{name}}>
      {/* Add your content here */}
    </Styled{{name}}>
  );
};
`;

const HOOK_TEMPLATE = `import { useState, useEffect } from 'react';

export const use{{name}} = () => {
  // Add your hook logic here
  
  return {
    // Return your hook values here
  };
};
`;

const PAGE_TEMPLATE = `import React from 'react';
import styled from 'styled-components';

const {{name}}Container = styled.div\`
  // Add your page styles here
\`;

export const {{name}}Page: React.FC = () => {
  return (
    <{{name}}Container>
      <h1>{{name}}</h1>
      {/* Add your page content here */}
    </{{name}}Container>
  );
};
`;

const INDEX_TEMPLATE = `export { {{name}} } from './{{name}}';
export type { {{name}}Props } from './{{name}}';
`;

function generateFile(config: ComponentConfig): void {
  const { name, type, template } = config;
  
  // Create directory
  const dirPath = path.join(process.cwd(), 'src', type === 'page' ? 'pages' : type === 'hook' ? 'hooks' : 'components', name);
  fs.ensureDirSync(dirPath);
  
  // Generate main file
  const mainContent = template
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{name\}\}/g, name);
  
  const mainFile = type === 'page' ? `${name}Page.tsx` : `${name}.tsx`;
  const mainPath = path.join(dirPath, mainFile);
  fs.writeFileSync(mainPath, mainContent);
  
  // Generate index file
  const indexContent = INDEX_TEMPLATE
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{name\}\}/g, name);
  
  const indexPath = path.join(dirPath, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  
  console.log(chalk.green(`✅ Generated ${type}: ${name}`));
  console.log(chalk.blue(`📁 Location: ${mainPath}`));
}

program
  .name('generate')
  .description('CLI para gerar componentes, hooks e páginas')
  .version('1.0.0');

program
  .command('component <name>')
  .description('Gerar um novo componente')
  .action((name: string) => {
    generateFile({
      name,
      type: 'component',
      template: COMPONENT_TEMPLATE
    });
  });

program
  .command('hook <name>')
  .description('Gerar um novo hook customizado')
  .action((name: string) => {
    generateFile({
      name,
      type: 'hook',
      template: HOOK_TEMPLATE
    });
  });

program
  .command('page <name>')
  .description('Gerar uma nova página')
  .action((name: string) => {
    generateFile({
      name,
      type: 'page',
      template: PAGE_TEMPLATE
    });
  });

program.parse(); 