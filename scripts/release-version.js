#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 ModernX 版本发布脚本\n');

// 获取版本类型
const versionType = process.argv[2]; // patch, minor, major, 或具体版本号
if (!versionType) {
  console.error('❌ 请提供版本类型:');
  console.error('  node scripts/release-version.js patch   # 1.0.2 -> 1.0.3');
  console.error('  node scripts/release-version.js minor   # 1.0.2 -> 1.1.0');
  console.error('  node scripts/release-version.js major   # 1.0.2 -> 2.0.0');
  console.error('  node scripts/release-version.js 1.0.3   # 指定版本');
  process.exit(1);
}

// 验证版本类型
const validTypes = ['patch', 'minor', 'major'];
const isSpecificVersion = /^\d+\.\d+\.\d+(-.*)?$/.test(versionType);

if (!validTypes.includes(versionType) && !isSpecificVersion) {
  console.error('❌ 无效的版本类型:', versionType);
  process.exit(1);
}

// 获取当前版本
function getCurrentVersion(packagePath) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return packageJson.version;
}

// 更新版本
function updateVersion(packagePath, newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  return newVersion;
}

// 获取新版本号
function getNewVersion(currentVersion, type) {
  if (isSpecificVersion) {
    return type; // type 是具体版本号
  }
  
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'major':
      return `${major + 1}.0.0`;
    default:
      return currentVersion;
  }
}

// 主要包列表
const packages = [
  { name: 'modernx', path: 'packages/modernx' },
  { name: 'modernx-core', path: 'packages/modernx-core' },
  { name: 'modernx-immer', path: 'packages/modernx-immer' },
  { name: 'modernx-loading', path: 'packages/modernx-loading' }
];

try {
  // 检查工作区状态
  console.log('📋 检查 Git 状态...');
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.error('❌ 工作区有未提交的更改，请先提交所有更改');
    process.exit(1);
  }

  // 获取当前版本
  console.log('📦 检查当前版本...');
  const currentVersions = {};
  packages.forEach(pkg => {
    const packagePath = path.join(pkg.path, 'package.json');
    currentVersions[pkg.name] = getCurrentVersion(packagePath);
    console.log(`  ${pkg.name}: ${currentVersions[pkg.name]}`);
  });

  // 计算新版本
  const newVersion = getNewVersion(currentVersions.modernx, versionType);
  console.log(`\n🎯 新版本: ${newVersion}`);

  // 确认发布
  console.log('\n⚠️  即将发布以下更改:');
  packages.forEach(pkg => {
    console.log(`  ${pkg.name}: ${currentVersions[pkg.name]} → ${newVersion}`);
  });

  console.log('\n继续发布? (y/N)');
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (data) => {
    const input = data.trim().toLowerCase();
    if (input === 'y' || input === 'yes') {
      performRelease();
    } else {
      console.log('❌ 发布已取消');
      process.exit(0);
    }
  });

  function performRelease() {
    try {
      // 更新所有包版本
      console.log('\n📝 更新包版本...');
      packages.forEach(pkg => {
        const packagePath = path.join(pkg.path, 'package.json');
        updateVersion(packagePath, newVersion);
        console.log(`  ✅ ${pkg.name}: ${newVersion}`);
      });

      // 更新根 package.json（如果是 monorepo）
      const rootPackagePath = 'package.json';
      if (fs.existsSync(rootPackagePath)) {
        updateVersion(rootPackagePath, newVersion);
        console.log(`  ✅ root: ${newVersion}`);
      }

      // 构建包
      console.log('\n🔨 构建包...');
      packages.forEach(pkg => {
        console.log(`  构建 ${pkg.name}...`);
        execSync(`cd ${pkg.path} && npx father-build`, { stdio: 'inherit' });
      });

      // 提交更改
      console.log('\n📝 提交版本更改...');
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });

      // 创建标签
      console.log(`\n🏷️  创建标签 v${newVersion}...`);
      execSync(`git tag v${newVersion}`, { stdio: 'inherit' });

      // 推送到 GitHub
      console.log('\n📤 推送到 GitHub...');
      execSync('git push origin main', { stdio: 'inherit' });
      execSync(`git push origin v${newVersion}`, { stdio: 'inherit' });

      console.log(`\n✅ 版本 ${newVersion} 发布完成!`);
      console.log('🚀 GitHub Actions 将自动发布到 NPM');
      console.log('📊 查看发布状态: https://github.com/perlinson/modernx/actions');

    } catch (error) {
      console.error('❌ 发布失败:', error.message);
      process.exit(1);
    }
  }

} catch (error) {
  console.error('❌ 脚本执行失败:', error.message);
  process.exit(1);
}
