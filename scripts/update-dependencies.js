#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 ModernX 依赖更新脚本\n');

// 获取命令行参数
const args = process.argv.slice(2);
const options = {
  check: args.includes('--check'),
  fix: args.includes('--fix'),
  workspace: args.includes('--workspace'),
  major: args.includes('--major'),
  minor: args.includes('--minor'),
  patch: args.includes('--patch'),
  package: null,
  dryRun: args.includes('--dry-run')
};

// 解析特定包参数
const packageIndex = args.findIndex(arg => arg.startsWith('--package='));
if (packageIndex !== -1) {
  options.package = args[packageIndex].replace('--package=', '');
}

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

// 获取根目录的 package.json
const rootPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

// 检查过时的依赖
function checkOutdatedDependencies() {
  console.log('📊 检查过时的依赖...\n');
  
  const allPackages = [...packages, { name: 'root', path: path.join(__dirname, '..'), packageJson: rootPackageJson }];
  
  allPackages.forEach(pkg => {
    console.log(`📦 检查 ${pkg.name}...`);
    
    try {
      const outdated = execSync('npm outdated --json', { 
        cwd: pkg.path, 
        encoding: 'utf8', 
        stdio: 'pipe' 
      });
      
      if (outdated.trim()) {
        const outdatedDeps = JSON.parse(outdated);
        const deps = Object.keys(outdatedDeps);
        
        if (deps.length > 0) {
          console.log(`  ⚠️  发现 ${deps.length} 个过时依赖:`);
          deps.forEach(dep => {
            const info = outdatedDeps[dep];
            console.log(`    ${dep}: ${info.current} -> ${info.latest} (${info.type})`);
          });
        } else {
          console.log(`  ✅ 所有依赖都是最新的`);
        }
      } else {
        console.log(`  ✅ 所有依赖都是最新的`);
      }
    } catch (error) {
      // npm outdated 在有过时依赖时会返回非零退出码
      try {
        const output = error.stdout.toString();
        if (output.trim()) {
          const outdatedDeps = JSON.parse(output);
          const deps = Object.keys(outdatedDeps);
          
          console.log(`  ⚠️  发现 ${deps.length} 个过时依赖:`);
          deps.forEach(dep => {
            const info = outdatedDeps[dep];
            console.log(`    ${dep}: ${info.current} -> ${info.latest} (${info.type})`);
          });
        }
      } catch (parseError) {
        console.log(`  ℹ️  无法检查依赖状态`);
      }
    }
    
    console.log('');
  });
}

// 更新依赖
function updateDependencies() {
  console.log('🔄 更新依赖...\n');
  
  const allPackages = options.package 
    ? packages.filter(pkg => pkg.name === options.package)
    : [...packages, { name: 'root', path: path.join(__dirname, '..'), packageJson: rootPackageJson }];
  
  if (options.package && allPackages.length === 0) {
    console.error(`❌ 未找到包: ${options.package}`);
    process.exit(1);
  }
  
  allPackages.forEach(pkg => {
    console.log(`📦 更新 ${pkg.name}...`);
    
    try {
      let updateCommand = 'npm update';
      
      if (options.major) {
        updateCommand += ' --save';
      } else if (options.minor) {
        updateCommand += ' --save';
      } else if (options.patch) {
        updateCommand += ' --save';
      }
      
      if (options.dryRun) {
        console.log(`  💡 将执行: ${updateCommand}`);
        console.log(`  🧪 干运行模式，跳过实际更新`);
      } else {
        execSync(updateCommand, { stdio: 'inherit', cwd: pkg.path });
        console.log(`  ✅ ${pkg.name} 更新完成`);
      }
    } catch (error) {
      console.error(`  ❌ ${pkg.name} 更新失败:`, error.message);
    }
    
    console.log('');
  });
}

// 更新工作区依赖
function updateWorkspaceDependencies() {
  console.log('🔗 更新工作区依赖...\n');
  
  try {
    if (options.dryRun) {
      console.log('💡 将执行: lerna bootstrap');
      console.log('🧪 干运行模式，跳过实际更新');
    } else {
      console.log('📦 重新安装工作区依赖...');
      execSync('lerna bootstrap', { stdio: 'inherit' });
      console.log('✅ 工作区依赖更新完成');
    }
  } catch (error) {
    console.error('❌ 工作区依赖更新失败:', error.message);
    process.exit(1);
  }
}

// 审计安全漏洞
function auditDependencies() {
  console.log('🔒 审计安全漏洞...\n');
  
  const allPackages = [...packages, { name: 'root', path: path.join(__dirname, '..'), packageJson: rootPackageJson }];
  
  allPackages.forEach(pkg => {
    console.log(`🔒 审计 ${pkg.name}...`);
    
    try {
      const audit = execSync('npm audit --json', { 
        cwd: pkg.path, 
        encoding: 'utf8', 
        stdio: 'pipe' 
      });
      
      const auditResult = JSON.parse(audit);
      const vulnCount = auditResult.metadata?.vulnerabilities?.total || 0;
      
      if (vulnCount > 0) {
        console.log(`  ⚠️  发现 ${vulnCount} 个安全漏洞`);
        
        if (options.fix && !options.dryRun) {
          console.log(`  🔧 尝试自动修复...`);
          try {
            execSync('npm audit fix', { stdio: 'inherit', cwd: pkg.path });
            console.log(`  ✅ 自动修复完成`);
          } catch (fixError) {
            console.log(`  ⚠️  无法自动修复所有漏洞`);
          }
        }
      } else {
        console.log(`  ✅ 没有发现安全漏洞`);
      }
    } catch (error) {
      console.log(`  ℹ️  无法审计依赖`);
    }
    
    console.log('');
  });
}

// 同步工作区依赖版本
function syncWorkspaceVersions() {
  console.log('🔄 同步工作区依赖版本...\n');
  
  // 获取所有工作区包的最新版本
  const workspaceVersions = {};
  packages.forEach(pkg => {
    workspaceVersions[pkg.packageJson.name] = pkg.packageJson.version;
  });
  
  // 更新每个包中的工作区依赖
  packages.forEach(pkg => {
    let updated = false;
    const packageJson = { ...pkg.packageJson };
    
    // 更新 dependencies
    if (packageJson.dependencies) {
      Object.keys(packageJson.dependencies).forEach(dep => {
        if (workspaceVersions[dep] && packageJson.dependencies[dep] !== '*') {
          packageJson.dependencies[dep] = '*';
          updated = true;
        }
      });
    }
    
    // 更新 devDependencies
    if (packageJson.devDependencies) {
      Object.keys(packageJson.devDependencies).forEach(dep => {
        if (workspaceVersions[dep] && packageJson.devDependencies[dep] !== '*') {
          packageJson.devDependencies[dep] = '*';
          updated = true;
        }
      });
    }
    
    // 更新 peerDependencies
    if (packageJson.peerDependencies) {
      Object.keys(packageJson.peerDependencies).forEach(dep => {
        if (workspaceVersions[dep] && packageJson.peerDependencies[dep] !== '*') {
          // peerDependencies 通常需要版本范围，所以这里只是记录
          console.log(`  📝 ${pkg.name}: ${dep} 需要手动更新 peerDependency`);
        }
      });
    }
    
    if (updated && !options.dryRun) {
      fs.writeFileSync(
        path.join(pkg.path, 'package.json'),
        JSON.stringify(packageJson, null, 2) + '\n'
      );
      console.log(`  ✅ ${pkg.name} 工作区依赖已同步`);
    } else if (updated) {
      console.log(`  🧪 ${pkg.name} 工作区依赖将同步 (干运行)`);
    } else {
      console.log(`  ✅ ${pkg.name} 工作区依赖已是最新`);
    }
  });
}

// 主逻辑
if (options.check) {
  checkOutdatedDependencies();
  auditDependencies();
} else if (options.fix) {
  updateDependencies();
  if (options.workspace) {
    updateWorkspaceDependencies();
  }
} else if (options.workspace) {
  syncWorkspaceVersions();
  updateWorkspaceDependencies();
} else {
  console.log('用法: node scripts/update-dependencies.js <command> [options]\n');
  console.log('命令:');
  console.log('  --check        检查过时依赖和安全漏洞');
  console.log('  --fix          更新过时依赖');
  console.log('  --workspace    同步工作区依赖');
  console.log('');
  console.log('选项:');
  console.log('  --dry-run      干运行模式，不执行实际操作');
  console.log('  --package=<name> 只处理指定包');
  console.log('  --major        更新到主版本');
  console.log('  --minor        更新到次版本');
  console.log('  --patch        更新到补丁版本');
  console.log('');
  console.log('示例:');
  console.log('  npm run dependencies:check');
  console.log('  npm run dependencies:fix --dry-run');
  console.log('  npm run dependencies:workspace');
}
