#!/usr/bin/env node

/**
 * modernx CLI 发布脚本
 * 发布 CLI 到 npm
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

const CLI_DIR = path.join(__dirname, '../cli');

async function publishCLI() {
  console.log(chalk.blue.bold('\n🚀 Publishing modernx-react18 CLI...\n'));
  
  try {
    // 检查 CLI 目录
    if (!fs.existsSync(CLI_DIR)) {
      throw new Error('CLI directory not found');
    }
    
    console.log(chalk.gray('📁 CLI directory:'), CLI_DIR);
    
    // 检查 CLI package.json
    const packageJsonPath = path.join(CLI_DIR, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('CLI package.json not found');
    }
    
    // 读取 CLI package.json
    const packageJson = fs.readJsonSync(packageJsonPath);
    console.log(chalk.gray('📦 Package:'), packageJson.name);
    console.log(chalk.gray('📦 Version:'), packageJson.version);
    
    // 检查是否已构建
    const libDir = path.join(CLI_DIR, 'lib');
    if (!fs.existsSync(libDir)) {
      console.log(chalk.yellow('⚠️  CLI not built, building first...'));
      await buildCLI();
    }
    
    console.log(chalk.gray('🔨 Publishing CLI to npm...'));
    
    // 发布 CLI
    await publishToNPM();
    
    console.log(chalk.green.bold('\n✅ CLI published successfully!'));
    console.log(chalk.blue.bold('\n📋 Installation:'));
    console.log(chalk.gray('  npm install -g modernx-react18-cli'));
    console.log(chalk.gray('  # 或者直接使用 npx'));
    console.log(chalk.gray('  npx modernx-react18 create my-app'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ CLI publish failed:'), error.message);
    process.exit(1);
  }
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

async function publishToNPM() {
  return new Promise((resolve, reject) => {
    const process = spawn('npm', ['publish'], {
      cwd: CLI_DIR,
      stdio: 'inherit',
      shell: true
    });
    
    process.on('error', reject);
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm publish failed with code ${code}`));
      }
    });
  });
}

// 运行发布
if (require.main === module) {
  publishCLI();
}

module.exports = publishCLI;
