#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 ModernX Monorepo 构建脚本\n');

// 获取命令行参数
const args = process.argv.slice(2);
const options = {
  scope: null,
  since: null,
  clean: args.includes('--clean'),
  verbose: args.includes('--verbose'),
  packages: []
};

// 解析参数
args.forEach(arg => {
  if (arg.startsWith('--scope=')) {
    options.scope = arg.replace('--scope=', '');
  } else if (arg.startsWith('--since=')) {
    options.since = arg.replace('--since=', '');
  } else if (arg.startsWith('--package=')) {
    options.packages.push(arg.replace('--package=', ''));
  }
});

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

console.log(`📦 发现 ${packages.length} 个包: ${packages.map(p => p.name).join(', ')}\n`);

// 清理构建目录
if (options.clean) {
  console.log('🧹 清理构建目录...');
  packages.forEach(pkg => {
    const dirsToClean = ['dist', 'lib', 'es'];
    dirsToClean.forEach(dir => {
      const dirPath = path.join(pkg.path, dir);
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`  ✅ 清理: ${pkg.name}/${dir}`);
      }
    });
  });
  console.log('');
}

// 确定要构建的包
let packagesToBuild = packages;

if (options.scope) {
  packagesToBuild = packages.filter(pkg => pkg.name === options.scope);
  console.log(`🎯 只构建包: ${options.scope}`);
} else if (options.packages.length > 0) {
  packagesToBuild = packages.filter(pkg => options.packages.includes(pkg.name));
  console.log(`🎯 构建指定包: ${options.packages.join(', ')}`);
} else if (options.since) {
  try {
    const changedPackages = execSync(`lerna changed --since=${options.since} --json`, { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    if (changedPackages.trim()) {
      const changed = JSON.parse(changedPackages);
      packagesToBuild = packages.filter(pkg => 
        changed.some(changed => changed.name === pkg.name)
      );
      console.log(`🔄 构建变更的包: ${packagesToBuild.map(p => p.name).join(', ')}`);
    } else {
      console.log('ℹ️  没有变更的包需要构建');
      process.exit(0);
    }
  } catch (error) {
    console.warn('⚠️  无法检测变更的包，构建所有包');
  }
}

// 构建依赖顺序
function getBuildOrder(packages) {
  const order = [];
  const visited = new Set();
  const visiting = new Set();

  function visit(pkg) {
    if (visiting.has(pkg.name)) {
      throw new Error(`检测到循环依赖: ${pkg.name}`);
    }
    if (visited.has(pkg.name)) {
      return;
    }

    visiting.add(pkg.name);
    
    // 检查依赖
    const deps = Object.keys(pkg.packageJson.dependencies || {});
    const devDeps = Object.keys(pkg.packageJson.devDependencies || {});
    
    [...deps, ...devDeps].forEach(dep => {
      const depPkg = packages.find(p => p.packageJson.name === dep);
      if (depPkg && depPkg.name !== pkg.name) {
        visit(depPkg);
      }
    });

    visiting.delete(pkg.name);
    visited.add(pkg.name);
    order.push(pkg);
  }

  packages.forEach(pkg => {
    if (!visited.has(pkg.name)) {
      visit(pkg);
    }
  });

  return order;
}

try {
  const buildOrder = getBuildOrder(packagesToBuild);
  console.log(`\n📋 构建顺序: ${buildOrder.map(p => p.name).join(' -> ')}\n`);

  // 构建每个包
  buildOrder.forEach((pkg, index) => {
    console.log(`🔨 [${index + 1}/${buildOrder.length}] 构建 ${pkg.name}...`);
    
    try {
      // 检查包是否有构建脚本
      const scripts = pkg.packageJson.scripts || {};
      const buildScript = scripts.build || scripts['build:simple'];
      
      if (buildScript) {
        console.log(`  📦 执行构建脚本: ${buildScript}`);
        const buildCmd = `cd "${pkg.path}" && ${buildScript}`;
        
        if (options.verbose) {
          console.log(`  💡 执行命令: ${buildCmd}`);
        }
        
        execSync(buildCmd, { 
          stdio: options.verbose ? 'inherit' : 'pipe',
          cwd: pkg.path 
        });
        console.log(`  ✅ ${pkg.name} 构建成功`);
      } else {
        console.log(`  ⚠️  ${pkg.name} 没有构建脚本，跳过`);
      }
    } catch (error) {
      console.error(`  ❌ ${pkg.name} 构建失败:`, error.message);
      if (options.verbose) {
        console.error(error.stdout?.toString());
        console.error(error.stderr?.toString());
      }
      process.exit(1);
    }
    
    console.log('');
  });

  console.log('🎉 所有包构建完成！');
  
  // 显示构建结果
  console.log('\n📊 构建结果:');
  buildOrder.forEach(pkg => {
    const distDirs = ['dist', 'lib', 'es'].filter(dir => 
      fs.existsSync(path.join(pkg.path, dir))
    );
    console.log(`  ${pkg.name}: ${distDirs.length > 0 ? distDirs.join(', ') : '无输出目录'}`);
  });

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}
