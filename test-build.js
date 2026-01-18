#!/usr/bin/env node

// 简化的构建测试脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 测试 monorepo 构建功能\n');

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

// 测试构建脚本
packages.forEach((pkg, index) => {
  console.log(`🔨 [${index + 1}/${packages.length}] 测试 ${pkg.name}...`);
  
  const scripts = pkg.packageJson.scripts || {};
  const buildScript = scripts.build || scripts['build:simple'];
  
  if (buildScript) {
    console.log(`  📦 构建脚本: ${buildScript}`);
    
    try {
      const buildCmd = `cd "${pkg.path}" && ${buildScript}`;
      console.log(`  💡 执行: ${buildCmd}`);
      
      execSync(buildCmd, { stdio: 'pipe', cwd: pkg.path });
      console.log(`  ✅ ${pkg.name} 构建成功`);
    } catch (error) {
      console.error(`  ❌ ${pkg.name} 构建失败:`, error.message);
    }
  } else {
    console.log(`  ⚠️  ${pkg.name} 没有构建脚本`);
  }
  
  console.log('');
});

console.log('🎉 构建测试完成!');
