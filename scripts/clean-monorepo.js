#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 ModernX Monorepo 清理脚本\n');

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

// 获取所有包
const packages = fs.readdirSync(packagesDir)
  .filter(dir => {
    const packagePath = path.join(packagesDir, dir);
    return fs.statSync(packagePath).isDirectory() && 
           fs.existsSync(path.join(packagePath, 'package.json'));
  });

console.log(`📦 清理 ${packages.length} 个包\n`);

// 清理根目录
const rootDirsToClean = ['node_modules', 'lib', 'es', 'dist'];
rootDirsToClean.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ 清理根目录: ${dir}`);
  }
});

// 清理每个包
packages.forEach(pkgName => {
  const pkgPath = path.join(packagesDir, pkgName);
  const dirsToClean = ['node_modules', 'dist', 'lib', 'es'];
  
  dirsToClean.forEach(dir => {
    const dirPath = path.join(pkgPath, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ 清理 ${pkgName}: ${dir}`);
    }
  });
});

// 清理缓存文件
const cacheDirs = ['.changelog', '.lerna', 'coverage'];
cacheDirs.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ 清理缓存: ${dir}`);
  }
});

console.log('\n🎉 清理完成！');
console.log('\n💡 提示: 运行 `npm run bootstrap` 重新安装依赖');
