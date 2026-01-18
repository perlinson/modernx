#!/usr/bin/env node

/**
 * modernx CLI 构建脚本
 * 构建 CLI 用于发布
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

const CLI_DIR = path.join(__dirname, '../cli');

async function buildCLI() {
  console.log(chalk.blue.bold('\n🔨 Building modernx CLI...\n'));
  
  try {
    // 检查 CLI 目录
    if (!fs.existsSync(CLI_DIR)) {
      throw new Error('CLI directory not found');
    }
    
    console.log(chalk.gray('📁 CLI directory:'), CLI_DIR);
    
    // 检查 package.json
    const packageJsonPath = path.join(CLI_DIR, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('CLI package.json not found');
    }
    
    console.log(chalk.gray('📦 Installing CLI dependencies...'));
    
    // 安装依赖
    await installDependencies();
    
    console.log(chalk.gray('🔨 Building CLI...'));
    
    // 构建 CLI
    await buildCLI();
    
    console.log(chalk.green.bold('\n✅ CLI build completed successfully!'));
    console.log(chalk.blue.bold('\n📋 CLI Features:'));
    console.log(chalk.gray('  ✓ Project scaffolding'));
    console.log(chalk.gray('  ✓ Multiple templates (basic, full, react18, enterprise)'));
    console.log(chalk.gray('  ✓ Feature management (router, immer, loading, etc.)'));
    console.log(chalk.gray('  ✓ Development tools'));
    console.log(chalk.gray('  ✓ React 18 concurrent features'));
    
    console.log(chalk.blue.bold('\n🚀 Usage:'));
    console.log(chalk.gray('  npx modernx create my-app'));
    console.log(chalk.gray('  npx modernx add router'));
    console.log(chalk.gray('  npx modernx dev'));
    console.log(chalk.gray('  npx modernx build'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ CLI build failed:'), error.message);
    process.exit(1);
  }
}

async function installDependencies() {
  return new Promise((resolve, reject) => {
    const process = spawn('npm', ['install'], {
      cwd: CLI_DIR,
      stdio: 'inherit',
      shell: true
    });
    
    process.on('error', reject);
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });
}

async function buildCLI() {
  return new Promise((resolve, reject) => {
    const process = spawn('npm', ['run', 'build'], {
      cwd: CLI_DIR,
      stdio: 'inherit',
      shell: true
    });
    
    process.on('error', reject);
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`CLI build failed with code ${code}`));
      }
    });
  });
}

// 运行构建
if (require.main === module) {
  buildCLI();
}

module.exports = buildCLI;
