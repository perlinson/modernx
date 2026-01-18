/**
 * modernx-react18 create 命令
 * 创建新的 modernx-react18 项目
 */

const { join, basename } = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const handlebars = require('handlebars');

const TEMPLATES_DIR = join(__dirname, '../templates');

async function create(projectName, options) {
  const { template: templateName, install, git } = options;
  
  console.log(chalk.blue.bold('\n🚀 Creating modernx-react18 project...'));
  console.log(chalk.gray(`Project: ${projectName}`));
  console.log(chalk.gray(`Template: ${templateName}`));
  
  const projectPath = join(process.cwd(), projectName);
  
  // 检查目录是否存在
  if (fs.existsSync(projectPath) && fs.readdirSync(projectPath).length > 0) {
    console.log(chalk.red(`❌ Directory ${projectName} already exists and is not empty!`));
    process.exit(1);
  }
  
  const spinner = ora('Creating project structure...').start();
  
  try {
    // 创建项目目录
    await fs.ensureDir(projectPath);
    
    // 选择模板
    const template = await selectTemplate(templateName);
    
    // 生成项目文件
    await generateProject(projectPath, template, projectName);
    
    spinner.succeed('Project structure created');
    
    // 安装依赖
    if (install) {
      await installDependencies(projectPath);
    }
    
    // 初始化 Git
    if (git) {
      await initializeGit(projectPath, projectName);
    }
    
    // 显示完成信息
    showCompletionInfo(projectName, template);
    
  } catch (error) {
    spinner.fail('Failed to create project');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function selectTemplate(templateName) {
  const templates = {
    basic: {
      name: 'basic',
      description: 'Basic modernx-react18 project',
      files: ['package.json', 'vite.config.js', 'src/app.js', 'src/index.js']
    },
    full: {
      name: 'full', 
      description: 'Full featured project with router, immer, loading',
      files: ['package.json', 'vite.config.js', 'src/app.js', 'src/index.js', 'src/router.js', 'src/models/']
    },
    react18: {
      name: 'react18',
      description: 'React 18 concurrent features demo',
      files: ['package.json', 'vite.config.js', 'src/app.js', 'src/index.js', 'src/concurrent-examples/']
    },
    enterprise: {
      name: 'enterprise',
      description: 'Enterprise ready project with best practices',
      files: ['package.json', 'vite.config.js', 'src/app.js', 'src/index.js', 'src/components/', 'src/utils/']
    }
  };
  
  if (templateName && templates[templateName]) {
    return templates[templateName];
  }
  
  // 交互式选择模板
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Choose a template:',
      choices: [
        { name: 'Basic - Basic modernx-react18 project', value: 'basic' },
        { name: 'Full - Full featured project', value: 'full' },
        { name: 'React 18 - Concurrent features demo', value: 'react18' },
        { name: 'Enterprise - Enterprise ready project', value: 'enterprise' }
      ]
    }
  ]);
  
  return templates[template];
}

async function generateProject(projectPath, template, projectName) {
  const templatePath = join(TEMPLATES_DIR, template.name);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${template.name} not found`);
  }
  
  // 复制模板文件
  await fs.copy(templatePath, projectPath);
  
  // 处理模板变量
  await processTemplateFiles(projectPath, {
    projectName,
    templateName: template.name,
    description: template.description
  });
  
  // 创建 README
  await createReadme(projectPath, template, projectName);
}

async function processTemplateFiles(projectPath, variables) {
  const files = fs.readdirSync(projectPath, { recursive: true });
  
  for (const file of files) {
    const filePath = join(projectPath, file);
    
    if (fs.statSync(filePath).isFile() && file.endsWith('.hbs')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const compiled = handlebars.compile(content)(variables);
      
      const newFilePath = filePath.replace('.hbs', '');
      fs.writeFileSync(newFilePath, compiled);
      fs.unlinkSync(filePath);
    }
  }
}

async function createReadme(projectPath, template, projectName) {
  const readmeContent = `# ${projectName}

A modernx-react18 project created with the ${template.name} template.

## Features

- React 18 enhanced modernx framework
- Modern build tools (Vite)
- ESLint and Prettier configuration
- Hot module replacement

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run lint\` - Run ESLint
- \`npm run preview\` - Preview production build

## React 18 Features

This project includes React 18 concurrent features:

\`\`\`javascript
import { useModernXTransition } from 'modernx-react18';

function MyComponent() {
  const [isPending, startTransition] = useModernXTransition();
  
  return (
    <button onClick={() => startTransition(() => {
      dispatch({ type: 'fetchData' });
    })}>
      {isPending ? 'Loading...' : 'Fetch Data'}
    </button>
  );
}
\`\`\`

## Learn More

- [modernx-react18 Documentation](https://github.com/perlinson/modernx)
- [React 18 Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
`;
  
  fs.writeFileSync(join(projectPath, 'README.md'), readmeContent);
}

async function installDependencies(projectPath) {
  const spinner = ora('Installing dependencies...').start();
  
  try {
    // 这里可以添加 npm install 或 pnpm install
    spinner.info('Run npm install in the project directory');
    spinner.succeed('Dependencies installation ready');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    throw error;
  }
}

async function initializeGit(projectPath, projectName) {
  const spinner = ora('Initializing git repository...').start();
  
  try {
    process.chdir(projectPath);
    
    // 这里可以添加 git init 命令
    spinner.info('Run git init in the project directory');
    spinner.succeed('Git repository ready');
  } catch (error) {
    spinner.fail('Failed to initialize git');
    throw error;
  }
}

function showCompletionInfo(projectName, template) {
  console.log(chalk.green.bold('\n🎉 Project created successfully!'));
  console.log(chalk.blue.bold('\n📁 Project Structure:'));
  console.log(chalk.gray(`  ${projectName}/`));
  console.log(chalk.gray('    ├── src/'));
  console.log(chalk.gray('    ├── public/'));
  console.log(chalk.gray('    ├── package.json'));
  console.log(chalk.gray('    ├── vite.config.js'));
  console.log(chalk.gray('    └── README.md'));
  
  console.log(chalk.blue.bold('\n🚀 Next Steps:'));
  console.log(chalk.gray(`  cd ${projectName}`));
  console.log(chalk.gray('  npm install'));
  console.log(chalk.gray('  npm run dev'));
  
  console.log(chalk.blue.bold('\n📚 Learn More:'));
  console.log(chalk.gray(`  Template: ${template.description}`));
  console.log(chalk.gray('  Documentation: https://github.com/perlinson/modernx'));
  console.log(chalk.gray('  React 18 Features: https://reactjs.org/'));
}

module.exports = create;
