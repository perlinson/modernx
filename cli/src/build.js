/**
 * modernx-react18 build 命令
 * 构建项目用于生产环境
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

async function build(options) {
  const { output } = options;
  
  console.log(chalk.blue.bold('\n🔨 Building project for production...'));
  console.log(chalk.gray(`Output directory: ${output}`));
  
  // 检查是否为 modernx-react18 项目
  if (!isModernXProject()) {
    console.log(chalk.red('❌ Current directory is not a modernx-react18 project!'));
    process.exit(1);
  }
  
  const spinner = ora('Building project...').start();
  
  try {
    // 检查构建工具
    if (hasViteConfig()) {
      spinner.info('Using Vite for build');
      await buildWithVite(output);
    } else {
      spinner.info('Using npm run build');
      await buildWithNpm(output);
    }
    
  } catch (error) {
    spinner.fail('Build failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function isModernXProject() {
  const packageJsonPath = 'package.json';
  const fs = require('fs-extra');
  
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }
  
  try {
    const packageJson = fs.readJsonSync(packageJsonPath);
    return packageJson.dependencies && (
      packageJson.dependencies['modernx-react18'] ||
      packageJson.dependencies.modernx
    );
  } catch (error) {
    return false;
  }
}

function hasViteConfig() {
  const viteConfigPath = 'vite.config.js';
  const fs = require('fs-extra');
  
  return fs.existsSync(viteConfigPath);
}

async function buildWithVite(output) {
  return new Promise((resolve, reject) => {
    const spinner = ora('Running Vite build...').start();
    
    const buildProcess = spawn('npx', ['vite', 'build', '--outDir', output], {
      stdio: 'inherit',
      shell: true
    });
    
    buildProcess.on('error', (error) => {
      spinner.fail('Vite build failed');
      reject(error);
    });
    
    buildProcess.on('exit', (code) => {
      if (code !== 0) {
        spinner.fail('Vite build exited with error');
        reject(new Error(`Vite build exited with code ${code}`));
      }
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        spinner.succeed('Build completed successfully');
        showBuildSuccess(output);
        resolve();
      } else {
        spinner.fail('Build failed');
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });
  });
}

async function buildWithNpm(output) {
  return new Promise((resolve, reject) => {
    const spinner = ora('Running npm build...').start();
    
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      shell: true
    });
    
    buildProcess.on('error', (error) => {
      spinner.fail('npm build failed');
      reject(error);
    });
    
    buildProcess.on('exit', (code) => {
      if (code !== 0) {
        spinner.fail('npm build exited with error');
        reject(new Error(`npm build exited with code ${code}`));
      }
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        spinner.succeed('Build completed successfully');
        showBuildSuccess(output);
        resolve();
      } else {
        spinner.fail('Build failed');
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });
  });
}

function showBuildSuccess(output) {
  console.log(chalk.green.bold('\n🎉 Build completed successfully!'));
  
  console.log(chalk.blue.bold('\n📁 Build output:'));
  console.log(chalk.gray(`  ${output}/`));
  console.log(chalk.gray('    ├── assets/'));
  console.log(chalk.gray('    ├── index.html'));
  console.log(chalk.gray('    └── ...'));
  
  console.log(chalk.blue.bold('\n🚀 Next Steps:'));
  console.log(chalk.gray('  npm run preview    - Preview production build'));
  console.log(chalk.gray('  npm run deploy      - Deploy to hosting service'));
  
  console.log(chalk.blue.bold('\n📊 Build Features:'));
  console.log(chalk.gray('  ✓ React 18 concurrent features'));
  console.log(chalk.gray('  ✓ Automatic batching'));
  console.log(chalk.gray('  ✓ Code splitting'));
  console.log(chalk.gray('  ✓ Tree shaking'));
  console.log(chalk.gray('  ✓ Minification'));
  console.log(chalk.gray('  ✓ Source maps'));
  
  console.log(chalk.blue.bold('\n📚 Learn More:'));
  console.log(chalk.gray('  Build docs: https://vitejs.dev/guide/build.html'));
  console.log(chalk.gray('  React 18: https://reactjs.org/'));
  console.log(chalk.gray('  modernx-react18: https://github.com/perlinson/modernx'));
}

module.exports = build;
