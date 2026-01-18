#!/usr/bin/env node

console.log('🧪 测试 monorepo 测试功能\n');

const fs = require('fs');
const path = require('path');

// 获取包列表
const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir)
  .filter(dir => {
    const packagePath = path.join(packagesDir, dir);
    return fs.statSync(packagePath).isDirectory() && 
           fs.existsSync(path.join(packagePath, 'package.json'));
  })
  .map(dir => ({
    name: dir,
    path: path.join(packagesDir, dir),
    packageJson: JSON.parse(fs.readFileSync(path.join(packagesDir, dir, 'package.json'), 'utf8'))
  }));

console.log(`📦 发现 ${packages.length} 个包: ${packages.map(p => p.name).join(', ')}\n`);

// 检查测试脚本
packages.forEach((pkg, index) => {
  console.log(`🧪 [${index + 1}/${packages.length}] 检查 ${pkg.name}...`);
  
  const scripts = pkg.packageJson.scripts || {};
  const testScript = scripts.test;
  
  if (testScript) {
    console.log(`  ✅ ${pkg.name} 有测试脚本: ${testScript}`);
  } else {
    console.log(`  ⚠️  ${pkg.name} 没有测试脚本`);
  }
  
  // 检查是否有测试目录
  const testDirs = ['test', 'tests', '__tests__'];
  const hasTestDir = testDirs.some(dir => fs.existsSync(path.join(pkg.path, dir)));
  
  if (hasTestDir) {
    console.log(`  📁 ${pkg.name} 有测试目录`);
  } else {
    console.log(`  📁 ${pkg.name} 没有测试目录`);
  }
  
  console.log('');
});

console.log('🎉 测试检查完成!');
