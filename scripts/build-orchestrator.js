#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 ModernX 统一构建编排器\n');

// 获取命令行参数
const args = process.argv.slice(2);
const options = {
  mode: 'all', // all, affected, packages, changed
  packages: [],
  incremental: false,
  parallel: true,
  maxConcurrency: 4,
  clean: false,
  verbose: false,
  since: 'main',
  dryRun: false,
  force: false
};

// 解析参数
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--mode' && i + 1 < args.length) {
    options.mode = args[i + 1];
    i++; // 跳过下一个参数
  } else if (arg.startsWith('--mode=')) {
    options.mode = arg.replace('--mode=', '');
  } else if (arg === '--packages' && i + 1 < args.length) {
    options.packages = args[i + 1].split(',');
    i++; // 跳过下一个参数
  } else if (arg.startsWith('--packages=')) {
    options.packages = arg.replace('--packages=', '').split(',');
  } else if (arg.startsWith('--since=')) {
    options.since = arg.replace('--since=', '');
  } else if (arg.startsWith('--max-concurrency=')) {
    options.maxConcurrency = parseInt(arg.replace('--max-concurrency=', ''), 10);
  } else if (arg === '--incremental') {
    options.incremental = true;
  } else if (arg === '--parallel') {
    options.parallel = true;
  } else if (arg === '--serial') {
    options.parallel = false;
  } else if (arg === '--clean') {
    options.clean = true;
  } else if (arg === '--verbose') {
    options.verbose = true;
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg === '--force') {
    options.force = true;
  }
}

// 获取所有包
function getPackages() {
  const packagesDir = path.join(__dirname, '..', 'packages');
  return fs.readdirSync(packagesDir)
    .filter(dir => {
      const packagePath = path.join(packagesDir, dir);
      return fs.statSync(packagePath).isDirectory() && 
             fs.existsSync(path.join(packagePath, 'package.json'));
    })
    .map(dir => {
      const packagePath = path.join(packagesDir, dir);
      const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'));
      return {
        name: dir,
        path: packagePath,
        packageJson,
        hasBuildScript: !!(packageJson.scripts?.build || packageJson.scripts?.['build:simple'])
      };
    });
}

// 获取包的依赖关系
function getPackageDependencies(pkg, allPackages) {
  const deps = [];
  const devDeps = [];
  
  // 获取生产依赖
  if (pkg.packageJson.dependencies) {
    Object.keys(pkg.packageJson.dependencies).forEach(dep => {
      const depPkg = allPackages.find(p => p.packageJson.name === dep);
      if (depPkg) {
        deps.push(depPkg);
      }
    });
  }
  
  // 获取开发依赖
  if (pkg.packageJson.devDependencies) {
    Object.keys(pkg.packageJson.devDependencies).forEach(dep => {
      const depPkg = allPackages.find(p => p.packageJson.name === dep);
      if (depPkg) {
        devDeps.push(depPkg);
      }
    });
  }
  
  return { deps, devDeps };
}

// 计算构建顺序（拓扑排序）
function calculateBuildOrder(packages) {
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
    
    const { deps, devDeps } = getPackageDependencies(pkg, packages);
    [...deps, ...devDeps].forEach(dep => {
      if (dep.name !== pkg.name) {
        visit(dep);
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

// 获取受影响的包
function getAffectedPackages(since) {
  try {
    const changedPackages = execSync(`lerna changed --since=${since} --json`, { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    
    if (changedPackages.trim()) {
      const changed = JSON.parse(changedPackages);
      const allPackages = getPackages();
      return allPackages.filter(pkg => 
        changed.some(changed => changed.name === pkg.packageJson.name)
      );
    }
    return [];
  } catch (error) {
    console.warn('⚠️  无法检测受影响的包，返回所有包');
    return getPackages();
  }
}

// 增量构建检查
function shouldBuildIncremental(pkg) {
  if (!options.incremental || options.force) {
    return true;
  }

  const distDirs = ['dist', 'lib', 'es'];
  const srcDir = path.join(pkg.path, 'src');
  
  // 检查源码目录是否存在
  if (!fs.existsSync(srcDir)) {
    return true;
  }
  
  // 获取源码文件的最新修改时间
  const srcFiles = getAllFiles(srcDir);
  const srcLatestTime = Math.max(...srcFiles.map(file => fs.statSync(file).mtimeMs));
  
  // 检查输出目录的最新修改时间
  const distDirsExist = distDirs.filter(dir => fs.existsSync(path.join(pkg.path, dir)));
  
  if (distDirsExist.length === 0) {
    return true;
  }
  
  const distLatestTime = Math.max(...distDirsExist.map(dir => {
    const distFiles = getAllFiles(path.join(pkg.path, dir));
    return distFiles.length > 0 ? Math.max(...distFiles.map(file => fs.statSync(file).mtimeMs)) : 0;
  }));
  
  return srcLatestTime > distLatestTime;
}

// 获取目录下所有文件
function getAllFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // 忽略无法读取的目录
    }
  }
  
  traverse(dir);
  return files;
}

// 清理构建目录
function cleanPackage(pkg) {
  const dirsToClean = ['dist', 'lib', 'es'];
  dirsToClean.forEach(dir => {
    const dirPath = path.join(pkg.path, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`  🧹 清理: ${pkg.name}/${dir}`);
    }
  });
}

// 构建单个包
async function buildPackage(pkg, index, total) {
  console.log(`🔨 [${index + 1}/${total}] 构建 ${pkg.name}...`);
  
  if (!pkg.hasBuildScript) {
    console.log(`  ⚠️  ${pkg.name} 没有构建脚本，跳过`);
    return { success: true, pkg, skipped: true };
  }

  try {
    const scripts = pkg.packageJson.scripts || {};
    const buildScript = scripts.build || scripts['build:simple'];
    
    console.log(`  📦 执行构建脚本: ${buildScript}`);
    
    if (options.dryRun) {
      console.log(`  🔍 [DRY RUN] 将执行: cd "${pkg.path}" && ${buildScript}`);
      return { success: true, pkg, dryRun: true };
    }
    
    const buildCmd = `cd "${pkg.path}" && ${buildScript}`;
    
    if (options.verbose) {
      console.log(`  💡 执行命令: ${buildCmd}`);
    }
    
    execSync(buildCmd, { 
      stdio: options.verbose ? 'inherit' : 'pipe',
      cwd: pkg.path 
    });
    
    console.log(`  ✅ ${pkg.name} 构建成功`);
    return { success: true, pkg };
    
  } catch (error) {
    console.error(`  ❌ ${pkg.name} 构建失败:`, error.message);
    if (options.verbose) {
      console.error(error.stdout?.toString());
      console.error(error.stderr?.toString());
    }
    return { success: false, pkg, error };
  }
}

// 并行构建
async function buildParallel(packages) {
  const chunks = [];
  for (let i = 0; i < packages.length; i += options.maxConcurrency) {
    chunks.push(packages.slice(i, i + options.maxConcurrency));
  }
  
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    console.log(`\n🔄 并行构建块 ${chunkIndex + 1}/${chunks.length} (并发度: ${options.maxConcurrency})`);
    
    const promises = chunk.map((pkg, index) => 
      buildPackage(pkg, chunkIndex * options.maxConcurrency + index, packages.length)
    );
    
    const results = await Promise.all(promises);
    
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      console.error('\n❌ 并行构建失败:');
      failed.forEach(r => {
        console.error(`  - ${r.pkg.name}: ${r.error.message}`);
      });
      throw new Error(`并行构建失败: ${failed.map(r => r.pkg.name).join(', ')}`);
    }
    
    console.log(`\n✅ 构建块 ${chunkIndex + 1} 完成`);
  }
}

// 串行构建
async function buildSequential(packages) {
  for (let i = 0; i < packages.length; i++) {
    const result = await buildPackage(packages[i], i, packages.length);
    if (!result.success) {
      throw new Error(`构建失败: ${result.pkg.name}`);
    }
    console.log('');
  }
}

// 主构建函数
async function main() {
  try {
    const allPackages = getPackages();
    console.log(`📦 发现 ${allPackages.length} 个包: ${allPackages.map(p => p.name).join(', ')}\n`);

    let packagesToBuild = [];

    // 根据模式确定要构建的包
    switch (options.mode) {
      case 'all':
        packagesToBuild = allPackages;
        console.log('🎯 构建模式: 所有包');
        break;
        
      case 'affected':
        packagesToBuild = getAffectedPackages(options.since);
        console.log(`🔄 构建模式: 受影响的包 (since ${options.since})`);
        break;
        
      case 'packages':
        if (options.packages.length === 0) {
          console.error('❌ --packages 模式需要指定包名列表');
          process.exit(1);
        }
        packagesToBuild = allPackages.filter(pkg => options.packages.includes(pkg.name));
        console.log(`🎯 构建模式: 指定包 - ${options.packages.join(', ')}`);
        break;
        
      case 'changed':
        try {
          const changedPackages = execSync('lerna changed --json', { 
            encoding: 'utf8', 
            stdio: 'pipe' 
          });
          if (changedPackages.trim()) {
            const changed = JSON.parse(changedPackages);
            packagesToBuild = allPackages.filter(pkg => 
              changed.some(changed => changed.name === pkg.packageJson.name)
            );
          }
        } catch (error) {
          console.warn('⚠️  无法检测变更的包，构建所有包');
          packagesToBuild = allPackages;
        }
        console.log('🔄 构建模式: 变更的包');
        break;
        
      default:
        console.error(`❌ 未知的构建模式: ${options.mode}`);
        process.exit(1);
    }

    if (packagesToBuild.length === 0) {
      console.log('ℹ️  没有包需要构建');
      return;
    }

    // 清理构建目录
    if (options.clean) {
      console.log('🧹 清理构建目录...');
      packagesToBuild.forEach(cleanPackage);
      console.log('');
    }

    // 增量构建过滤
    if (options.incremental) {
      const originalCount = packagesToBuild.length;
      packagesToBuild = packagesToBuild.filter(pkg => {
        const shouldBuild = shouldBuildIncremental(pkg);
        if (!shouldBuild) {
          console.log(`⏭️  跳过 ${pkg.name} (增量构建检查)`);
        }
        return shouldBuild;
      });
      
      if (originalCount > packagesToBuild.length) {
        console.log(`📊 增量构建: ${packagesToBuild.length}/${originalCount} 个包需要构建`);
      }
    }

    // 计算构建顺序
    const buildOrder = calculateBuildOrder(packagesToBuild);
    console.log(`\n📋 构建顺序: ${buildOrder.map(p => p.name).join(' -> ')}\n`);

    // 执行构建
    if (options.parallel) {
      console.log(`🚀 并行构建模式 (并发度: ${options.maxConcurrency})`);
      await buildParallel(buildOrder);
    } else {
      console.log('🔧 串行构建模式');
      await buildSequential(buildOrder);
    }

    console.log('\n🎉 所有包构建完成!');
    
    // 显示构建结果
    console.log('\n📊 构建结果:');
    buildOrder.forEach(pkg => {
      const distDirs = ['dist', 'lib', 'es'].filter(dir => 
        fs.existsSync(path.join(pkg.path, dir))
      );
      console.log(`  ${pkg.name}: ${distDirs.length > 0 ? distDirs.join(', ') : '无输出目录'}`);
    });

  } catch (error) {
    console.error('\n❌ 构建失败:', error.message);
    process.exit(1);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
ModernX 统一构建编排器

用法:
  node scripts/build-orchestrator.js [选项]

选项:
  --mode <mode>          构建模式: all, affected, packages, changed (默认: all)
  --packages <list>      指定包名列表，用逗号分隔
  --since <branch>       指定基准分支 (默认: main)
  --incremental          启用增量构建
  --parallel             并行构建 (默认)
  --serial               串行构建
  --max-concurrency <n>  最大并发数 (默认: 4)
  --clean                构建前清理输出目录
  --verbose              详细输出
  --dry-run              预演模式，不实际执行构建
  --force                强制构建所有包
  --help                 显示帮助信息

示例:
  # 构建所有包
  node scripts/build-orchestrator.js

  # 构建受影响的包
  node scripts/build-orchestrator.js --mode affected --since=main

  # 构建指定包
  node scripts/build-orchestrator.js --mode packages --packages=modernx-core,modernx-immer

  # 增量构建
  node scripts/build-orchestrator.js --incremental

  # 清理并构建
  node scripts/build-orchestrator.js --clean

  # 预演构建
  node scripts/build-orchestrator.js --dry-run --verbose
`);
}

// 检查是否需要显示帮助
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  return;
}

// 运行主函数
main();
