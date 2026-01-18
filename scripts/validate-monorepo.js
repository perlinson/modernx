#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 ModernX Monorepo 验证脚本\n');

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

// 验证包结构
function validatePackageStructure() {
  console.log('📁 验证包结构...\n');
  
  let allValid = true;
  
  packages.forEach(pkg => {
    console.log(`📦 验证 ${pkg.name}...`);
    
    const requiredFiles = ['package.json'];
    const requiredDirs = ['src'];
    
    // 检查必需文件
    requiredFiles.forEach(file => {
      const filePath = path.join(pkg.path, file);
      if (!fs.existsSync(filePath)) {
        console.log(`  ❌ 缺少文件: ${file}`);
        allValid = false;
      } else {
        console.log(`  ✅ 文件存在: ${file}`);
      }
    });
    
    // 检查必需目录
    requiredDirs.forEach(dir => {
      const dirPath = path.join(pkg.path, dir);
      if (!fs.existsSync(dirPath)) {
        console.log(`  ⚠️  缺少目录: ${dir}`);
      } else {
        console.log(`  ✅ 目录存在: ${dir}`);
      }
    });
    
    // 检查 package.json 必需字段
    const requiredFields = ['name', 'version', 'description', 'main'];
    requiredFields.forEach(field => {
      if (!pkg.packageJson[field]) {
        console.log(`  ❌ package.json 缺少字段: ${field}`);
        allValid = false;
      } else {
        console.log(`  ✅ package.json 包含字段: ${field}`);
      }
    });
    
    console.log('');
  });
  
  return allValid;
}

// 验证依赖关系
function validateDependencies() {
  console.log('🔗 验证依赖关系...\n');
  
  let allValid = true;
  
  // 构建依赖图
  const dependencyGraph = {};
  packages.forEach(pkg => {
    const allDeps = {
      ...pkg.packageJson.dependencies,
      ...pkg.packageJson.devDependencies,
      ...pkg.packageJson.peerDependencies
    };
    dependencyGraph[pkg.name] = Object.keys(allDeps);
  });
  
  // 检查每个包的依赖
  packages.forEach(pkg => {
    console.log(`📦 检查 ${pkg.name} 的依赖...`);
    
    const deps = dependencyGraph[pkg.name];
    const workspaceDeps = deps.filter(dep => 
      packages.some(p => p.packageJson.name === dep)
    );
    
    // 检查工作区依赖是否存在
    workspaceDeps.forEach(dep => {
      const depPkg = packages.find(p => p.packageJson.name === dep);
      if (!depPkg) {
        console.log(`  ❌ 工作区依赖不存在: ${dep}`);
        allValid = false;
      } else {
        console.log(`  ✅ 工作区依赖有效: ${dep} -> ${depPkg.name}`);
      }
    });
    
    console.log('');
  });
  
  return allValid;
}

// 检测循环依赖
function detectCircularDependencies() {
  console.log('🔄 检测循环依赖...\n');
  
  // 构建工作区依赖图
  const graph = {};
  packages.forEach(pkg => {
    const allDeps = {
      ...pkg.packageJson.dependencies,
      ...pkg.packageJson.devDependencies,
      ...pkg.packageJson.peerDependencies
    };
    graph[pkg.name] = Object.keys(allDeps).filter(dep => 
      packages.some(p => p.packageJson.name === dep)
    );
  });
  
  function hasCycle(node, visited, recursionStack, path) {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);
    
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor, visited, recursionStack, [...path])) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        const cycle = path.slice(cycleStart).concat(neighbor);
        console.log(`❌ 发现循环依赖: ${cycle.join(' -> ')}`);
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
      if (hasCycle(pkg.name, visited, recursionStack, [])) {
        hasCircularDependency = true;
      }
    }
  }
  
  if (!hasCircularDependency) {
    console.log('✅ 没有发现循环依赖');
  }
  
  return !hasCircularDependency;
}

// 验证版本一致性
function validateVersionConsistency() {
  console.log('📊 验证版本一致性...\n');
  
  let allValid = true;
  
  // 检查工作区依赖版本
  packages.forEach(pkg => {
    console.log(`📦 检查 ${pkg.name} 的版本一致性...`);
    
    const allDeps = {
      ...pkg.packageJson.dependencies,
      ...pkg.packageJson.devDependencies
    };
    
    Object.entries(allDeps).forEach(([dep, version]) => {
      const depPkg = packages.find(p => p.packageJson.name === dep);
      if (depPkg) {
        if (version !== '*') {
          console.log(`  ⚠️  工作区依赖版本应为 '*': ${dep}@${version}`);
          allValid = false;
        } else {
          console.log(`  ✅ 工作区依赖版本正确: ${dep}@${version}`);
        }
      }
    });
    
    console.log('');
  });
  
  return allValid;
}

// 验证构建配置
function validateBuildConfiguration() {
  console.log('🔨 验证构建配置...\n');
  
  let allValid = true;
  
  packages.forEach(pkg => {
    console.log(`📦 检查 ${pkg.name} 的构建配置...`);
    
    const scripts = pkg.packageJson.scripts || {};
    
    if (scripts.build) {
      console.log(`  ✅ 有构建脚本: build`);
    } else {
      console.log(`  ⚠️  没有构建脚本: build`);
    }
    
    if (scripts.test) {
      console.log(`  ✅ 有测试脚本: test`);
    } else {
      console.log(`  ⚠️  没有测试脚本: test`);
    }
    
    // 检查构建输出目录
    const outputDirs = ['dist', 'lib', 'es'];
    const hasOutputDir = outputDirs.some(dir => fs.existsSync(path.join(pkg.path, dir)));
    
    if (hasOutputDir) {
      console.log(`  ✅ 有构建输出目录`);
    } else {
      console.log(`  ⚠️  没有构建输出目录`);
    }
    
    console.log('');
  });
  
  return allValid;
}

// 验证发布配置
function validatePublishConfiguration() {
  console.log('📤 验证发布配置...\n');
  
  let allValid = true;
  
  packages.forEach(pkg => {
    console.log(`📦 检查 ${pkg.name} 的发布配置...`);
    
    // 检查必需字段
    const requiredFields = ['name', 'version', 'description', 'main'];
    const missingFields = requiredFields.filter(field => !pkg.packageJson[field]);
    
    if (missingFields.length === 0) {
      console.log(`  ✅ 发布配置完整`);
    } else {
      console.log(`  ❌ 缺少发布字段: ${missingFields.join(', ')}`);
      allValid = false;
    }
    
    // 检查 files 字段
    if (pkg.packageJson.files && pkg.packageJson.files.length > 0) {
      console.log(`  ✅ 有 files 配置`);
    } else {
      console.log(`  ⚠️  没有 files 配置`);
    }
    
    // 检查 repository 信息
    if (pkg.packageJson.repository) {
      console.log(`  ✅ 有 repository 配置`);
    } else {
      console.log(`  ⚠️  没有 repository 配置`);
    }
    
    console.log('');
  });
  
  return allValid;
}

// 运行所有验证
function runAllValidations() {
  console.log('🚀 开始完整验证...\n');
  
  const results = {
    structure: validatePackageStructure(),
    dependencies: validateDependencies(),
    circular: detectCircularDependencies(),
    versions: validateVersionConsistency(),
    build: validateBuildConfiguration(),
    publish: validatePublishConfiguration()
  };
  
  console.log('📊 验证结果汇总:\n');
  
  Object.entries(results).forEach(([name, passed]) => {
    const status = passed ? '✅ 通过' : '❌ 失败';
    const labels = {
      structure: '包结构',
      dependencies: '依赖关系',
      circular: '循环依赖',
      versions: '版本一致性',
      build: '构建配置',
      publish: '发布配置'
    };
    console.log(`${status} ${labels[name]}`);
  });
  
  const allPassed = Object.values(results).every(Boolean);
  
  console.log(`\n${allPassed ? '🎉' : '❌'} 验证${allPassed ? '通过' : '失败'}!`);
  
  return allPassed;
}

// 主逻辑
const command = process.argv[2] || 'all';

switch (command) {
  case 'structure':
    validatePackageStructure();
    break;
  case 'dependencies':
    validateDependencies();
    break;
  case 'circular':
    detectCircularDependencies();
    break;
  case 'versions':
    validateVersionConsistency();
    break;
  case 'build':
    validateBuildConfiguration();
    break;
  case 'publish':
    validatePublishConfiguration();
    break;
  case 'all':
    const success = runAllValidations();
    process.exit(success ? 0 : 1);
    break;
  default:
    console.log('用法: node scripts/validate-monorepo.js <command>\n');
    console.log('可用命令:');
    console.log('  structure    - 验证包结构');
    console.log('  dependencies - 验证依赖关系');
    console.log('  circular     - 检测循环依赖');
    console.log('  versions     - 验证版本一致性');
    console.log('  build        - 验证构建配置');
    console.log('  publish      - 验证发布配置');
    console.log('  all          - 运行所有验证');
    break;
}
