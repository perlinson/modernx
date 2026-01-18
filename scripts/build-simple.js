#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 简化构建 modernx...\n');

// 1. 检查依赖
console.log('📦 检查依赖...');
try {
  execSync('npm list --depth=0', { stdio: 'pipe' });
  console.log('✅ 依赖检查完成');
} catch (error) {
  console.error('❌ 依赖检查失败:', error.message);
  process.exit(1);
}

// 2. 创建构建目录
console.log('\n📁 创建构建目录...');
const dirs = ['lib', 'es', 'dist'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ 创建目录: ${dir}`);
  }
});

// 3. 简单的文件复制构建
console.log('\n📋 复制源文件到构建目录...');

// 复制主要文件
const filesToCopy = [
  'packages/modernx/src/index.js',
  'packages/modernx/src/dynamic.js', 
  'packages/modernx/src/react18-hooks.js',
  'packages/modernx/src/router-v6-compat.js',
  'packages/modernx-core/src/index.js',
  'packages/modernx-core/src/react18.js',
  'packages/modernx-immer/src/index.js',
  'packages/modernx-loading/src/index.js'
];

filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, '..', file);
  const destPath = path.join(__dirname, '..', 'lib', path.basename(file));
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ 复制: ${file} -> lib/${path.basename(file)}`);
  }
});

// 4. 创建 package.json 用于发布
console.log('\n📦 创建发布用的 package.json...');
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 创建简化版的 package.json 用于构建目录
const buildPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  main: 'lib/index.js',
  module: 'lib/index.js',
  types: 'lib/index.d.ts',
  files: ['lib', 'es', 'dist', 'src'],
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  repository: packageJson.repository,
  homepage: packageJson.homepage,
  bugs: packageJson.bugs,
  dependencies: {
    'react': packageJson.devDependencies.react,
    'react-dom': packageJson.devDependencies['react-dom'],
    'redux': packageJson.devDependencies.redux || '^4.2.0',
    'redux-saga': packageJson.devDependencies['redux-saga'] || '^1.1.0',
    'react-redux': packageJson.devDependencies['react-redux'] || '^8.0.0',
    'warning': packageJson.devDependencies.warning,
    'invariant': packageJson.devDependencies.invariant,
    'is-plain-object': packageJson.devDependencies['is-plain-object'],
    'flatten': packageJson.devDependencies.flatten
  },
  peerDependencies: {
    'react': '^16.14.0 || ^17.0.0 || ^18.0.0',
    'react-dom': '^16.14.0 || ^17.0.0 || ^18.0.0'
  }
};

fs.writeFileSync('lib/package.json', JSON.stringify(buildPackageJson, null, 2));
console.log('✅ 创建 lib/package.json');

// 5. 创建 README
const readmeContent = `# modernx

Modern React state management framework with concurrent features

## Installation

\`\`\`bash
npm install modernx
\`\`\`

## Usage

\`\`\`javascript
import { createApp, connect } from 'modernx';

const app = createApp({
  // your models
});

app.start();
\`\`\`

## React 18 Features

- \`useModernXTransition\`: Concurrent state updates
- \`useModernXConcurrentState\`: Deferred state management
- \`batchUpdates\`: Explicit batching control
- React Router v6 compatibility layer

## License

MIT
`;

fs.writeFileSync('lib/README.md', readmeContent);
console.log('✅ 创建 lib/README.md');

console.log('\n🎉 简化构建完成！');
console.log('\n📦 发布命令:');
console.log('npm publish --prefix ./lib');
console.log('\n📦 本地测试:');
console.log('npm pack --prefix ./lib && npm install ./lib/modernx-*.tgz');
