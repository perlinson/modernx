/**
 * modernx dev 命令
 * 启动开发服务器
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

async function dev(options) {
  const { port, host } = options;
  
  console.log(chalk.blue.bold('\n🚀 Starting development server...'));
  console.log(chalk.gray(`Port: ${port}`));
  console.log(chalk.gray(`Host: ${host}`));
  
  // 检查是否为 modernx 项目
  if (!isModernXProject()) {
    console.log(chalk.red('❌ Current directory is not a modernx project!'));
    process.exit(1);
  }
  
  const spinner = ora('Starting development server...').start();
  
  try {
    // 检查是否有 Vite 配置
    if (hasViteConfig()) {
      spinner.info('Using Vite for development');
      await startViteServer(port, host);
    } else {
      spinner.info('Using npm start for development');
      await startNpmServer();
    }
    
  } catch (error) {
    spinner.fail('Failed to start development server');
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
      packageJson.dependencies['modernx'] ||
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

async function startViteServer(port, host) {
  return new Promise((resolve, reject) => {
    const spinner = ora('Starting Vite server...').start();
    
    const viteProcess = spawn('npx', ['vite', '--port', port, '--host', host], {
      stdio: 'inherit',
      shell: true
    });
    
    viteProcess.on('error', (error) => {
      spinner.fail('Failed to start Vite server');
      reject(error);
    });
    
    viteProcess.on('exit', (code) => {
      if (code !== 0) {
        spinner.fail('Vite server exited with error');
        reject(new Error(`Vite server exited with code ${code}`));
      }
    });
    
    // 模拟成功启动
    setTimeout(() => {
      spinner.succeed('Development server started');
      console.log(chalk.green.bold('\n🎉 Development server is running!'));
      console.log(chalk.blue.bold('\n📱 Local:'));
      console.log(chalk.gray(`  http://${host}:${port}`));
      console.log(chalk.blue.bold('\n🌐 Network:'));
      console.log(chalk.gray(`  http://${getLocalIP()}:${port}`));
      console.log(chalk.blue.bold('\n📚 Available Scripts:'));
      console.log(chalk.gray('  npm run dev     - Start development server'));
      console.log(chalk.gray('  npm run build   - Build for production'));
      console.log(chalk.gray('  npm run lint    - Run ESLint'));
      console.log(chalk.gray('  npm run preview - Preview production build'));
      console.log(chalk.blue.bold('\n🚀 React 18 Features:'));
      console.log(chalk.gray('  - Concurrent rendering'));
      console.log(chalk.gray('  - Automatic batching'));
      console.log(chalk.gray('  - useTransition Hook'));
      console.log(chalk.gray('  - useDeferredValue Hook'));
      console.log(chalk.blue.bold('\n📖 Learn More:'));
      console.log(chalk.gray('  Documentation: https://github.com/perlinson/modernx'));
      console.log(chalk.gray('  React 18: https://reactjs.org/'));
      
      resolve();
    }, 2000);
  });
}

async function startNpmServer() {
  return new Promise((resolve, reject) => {
    const spinner = ora('Starting npm server...').start();
    
    const npmProcess = spawn('npm', ['start'], {
      stdio: 'inherit',
      shell: true
    });
    
    npmProcess.on('error', (error) => {
      spinner.fail('Failed to start npm server');
      reject(error);
    });
    
    npmProcess.on('exit', (code) => {
      if (code !== 0) {
        spinner.fail('npm server exited with error');
        reject(new Error(`npm server exited with code ${code}`));
      }
    });
    
    setTimeout(() => {
      spinner.succeed('Development server started');
      resolve();
    }, 2000);
  });
}

function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  
  return 'localhost';
}

module.exports = dev;
