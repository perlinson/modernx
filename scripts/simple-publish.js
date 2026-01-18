#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始发布 modernx 到 npm...\n');

// 1. 检查 npm registry
try {
  const registry = execSync('npm config get registry', { encoding: 'utf8' }).trim();
  if (!registry.includes('registry.npmjs.org')) {
    console.error('❌ 请先设置 npm registry 为官方源:');
    console.error('npm config set registry https://registry.npmjs.org/');
    process.exit(1);
  }
  console.log('✅ npm registry 正确');
} catch (error) {
  console.error('❌ 检查 npm registry 失败:', error.message);
  process.exit(1);
}

// 2. 检查是否已登录
try {
  const username = execSync('npm whoami', { encoding: 'utf8' }).trim();
  console.log(`✅ 已登录 npm: ${username}`);
} catch (error) {
  console.error('❌ 请先登录 npm:');
  console.error('npm login');
  process.exit(1);
}

// 3. 检查 package.json
try {
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (packageJson.private) {
    console.error('❌ 请先移除 package.json 中的 "private": true');
    process.exit(1);
  }
  
  if (!packageJson.name || packageJson.name === 'modernx') {
    console.error('❌ 请先修改 package.json 中的 name 字段');
    console.error('建议使用: modernx 或 @yourname/modernx');
    process.exit(1);
  }
  
  console.log(`✅ 包名: ${packageJson.name}`);
  console.log(`✅ 版本: ${packageJson.version}`);
} catch (error) {
  console.error('❌ 读取 package.json 失败:', error.message);
  process.exit(1);
}

// 4. 运行测试
console.log('\n🧪 运行测试...');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ 测试通过');
} catch (error) {
  console.error('❌ 测试失败，请修复后再发布');
  process.exit(1);
}

// 5. 简化构建
console.log('\n🔨 运行简化构建...');
try {
  execSync('npm run build:simple', { stdio: 'inherit' });
  console.log('✅ 构建成功');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

// 6. 发布到 npm
console.log('\n📦 发布到 npm...');

// 设置 npm token（如果存在）
const npmToken = process.env.NPM_TOKEN;
if (npmToken) {
  process.env.NPM_CONFIG_AUTH_TOKEN = npmToken;
  console.log('✅ 使用 NPM_TOKEN 进行认证');
}

const publishCmd = 'npm publish --prefix ./lib';
try {
  execSync(publishCmd, { stdio: 'inherit' });
  console.log('✅ 发布成功！');
} catch (error) {
  console.log('❌ 发布失败:', error.message);
  
  if (error.message.includes('403') || error.message.includes('2FA')) {
    console.log('\n🔧 解决方案:');
    console.log('1. 访问 https://www.npmjs.com/settings/perlinson/tokens/create');
    console.log('2. 创建 Granular Access Token');
    console.log('3. 设置环境变量: export NPM_TOKEN="your_token_here"');
    console.log('4. 重新运行: pnpm run publish');
    console.log('\n📖 详细指南: PUBLISH_WITH_TOKEN.md');
  }
  
  process.exit(1);
}

console.log('\n✨ 发布完成！现在你可以在项目中使用:');
console.log('npm install modernx-react18');
