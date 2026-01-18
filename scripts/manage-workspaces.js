#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 ModernX 工作区依赖管理脚本\n');

// 获取命令行参数
const args = process.argv.slice(2);
const command = args[0] || 'status';

// 获取所有包
const packagesDir = path.join(__dirname, '..', 'packages');
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

// 获取包的依赖关系
function getPackageDependencies(pkg) {
  const allDeps = {
    ...pkg.packageJson.dependencies,
    ...pkg.packageJson.devDependencies,
    ...pkg.packageJson.peerDependencies
  };
  return Object.keys(allDeps);
}

// 检查工作区依赖
function checkWorkspaceDependencies() {
  console.log('📊 检查工作区依赖关系...\n');
  
  packages.forEach(pkg => {
    const deps = getPackageDependencies(pkg);
    const workspaceDeps = deps.filter(dep => 
      packages.some(p => p.packageJson.name === dep)
    );
    
    if (workspaceDeps.length > 0) {
      console.log(`📦 ${pkg.name}:`);
      workspaceDeps.forEach(dep => {
        const depPkg = packages.find(p => p.packageJson.name === dep);
        console.log(`  └── ${dep} -> ${depPkg.name}`);
      });
      console.log('');
    }
  });
}

// 链接工作区依赖
function linkWorkspaceDependencies() {
  console.log('🔗 链接工作区依赖...\n');
  
  try {
    // 使用 lerna link 来链接包
    console.log('📦 执行 lerna link...');
    execSync('lerna link', { stdio: 'inherit' });
    console.log('✅ 工作区依赖链接完成');
  } catch (error) {
    console.error('❌ 链接失败:', error.message);
    process.exit(1);
  }
}

// 安装依赖
function installDependencies() {
  console.log('📦 安装依赖...\n');
  
  try {
    // 首先安装根目录依赖
    console.log('📦 安装根目录依赖...');
    execSync('npm install', { stdio: 'inherit' });
    
    // 然后使用 lerna bootstrap 安装所有包的依赖
    console.log('📦 安装包依赖...');
    execSync('lerna bootstrap', { stdio: 'inherit' });
    
    console.log('✅ 依赖安装完成');
  } catch (error) {
    console.error('❌ 安装失败:', error.message);
    process.exit(1);
  }
}

// 检查循环依赖
function checkCircularDependencies() {
  console.log('🔄 检查循环依赖...\n');
  
  const graph = {};
  packages.forEach(pkg => {
    const deps = getPackageDependencies(pkg);
    graph[pkg.name] = deps.filter(dep => 
      packages.some(p => p.packageJson.name === dep)
    );
  });
  
  function hasCycle(node, visited, recursionStack) {
    visited.add(node);
    recursionStack.add(node);
    
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor, visited, recursionStack)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }
    
    recursionStack.delete(node);
    return false;
  }
  
  const visited = new Set();
  const recursionStack = new Set();
  let hasCircularDependency = false;
  
  for (const pkg of packages) {
    if (!visited.has(pkg.name)) {
      if (hasCycle(pkg.name, visited, recursionStack)) {
        console.log(`❌ 发现循环依赖: ${pkg.name}`);
        hasCircularDependency = true;
      }
    }
  }
  
  if (!hasCircularDependency) {
    console.log('✅ 没有发现循环依赖');
  }
  
  return !hasCircularDependency;
}

// 显示依赖图
function showDependencyGraph() {
  console.log('📊 依赖关系图:\n');
  
  packages.forEach(pkg => {
    const deps = getPackageDependencies(pkg);
    const workspaceDeps = deps.filter(dep => 
      packages.some(p => p.packageJson.name === dep)
    );
    
    if (workspaceDeps.length > 0) {
      console.log(`${pkg.name}:`);
      workspaceDeps.forEach(dep => {
        console.log(`  └── ${dep}`);
      });
    } else {
      console.log(`${pkg.name}: (无工作区依赖)`);
    }
    console.log('');
  });
}

// 同步版本号
function syncVersions() {
  console.log('🔄 同步工作区包版本...\n');
  
  // 这里可以实现版本同步逻辑
  // 目前只是显示当前版本
  packages.forEach(pkg => {
    console.log(`${pkg.name}: ${pkg.packageJson.version}`);
  });
  
  console.log('\n💡 提示: 使用 lerna version 来管理版本');
}

// 主逻辑
switch (command) {
  case 'status':
    checkWorkspaceDependencies();
    break;
  case 'link':
    linkWorkspaceDependencies();
    break;
  case 'install':
    installDependencies();
    break;
  case 'check':
    const isClean = checkCircularDependencies();
    if (!isClean) {
      process.exit(1);
    }
    break;
  case 'graph':
    showDependencyGraph();
    break;
  case 'sync':
    syncVersions();
    break;
  default:
    console.log('用法: node scripts/manage-workspaces.js <command>\n');
    console.log('可用命令:');
    console.log('  status  - 检查工作区依赖状态');
    console.log('  link    - 链接工作区依赖');
    console.log('  install - 安装所有依赖');
    console.log('  check   - 检查循环依赖');
    console.log('  graph   - 显示依赖关系图');
    console.log('  sync    - 同步版本号');
    break;
}
