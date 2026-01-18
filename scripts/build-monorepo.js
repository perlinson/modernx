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
  incremental: args.includes('--incremental'),
  parallel: args.includes('--parallel'),
  packages: [],
  maxConcurrency: 4
};

// 解析参数
args.forEach(arg => {
  if (arg.startsWith('--scope=')) {
    options.scope = arg.replace('--scope=', '');
  } else if (arg.startsWith('--since=')) {
    options.since = arg.replace('--since=', '');
  } else if (arg.startsWith('--package=')) {
    options.packages.push(arg.replace('--package=', ''));
  } else if (arg.startsWith('--max-concurrency=')) {
    options.maxConcurrency = parseInt(arg.replace('--max-concurrency=', ''), 10);
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

// 增量构建检测
function checkIncrementalBuild(pkg) {
  if (!options.incremental) return true;
  
  const distDirs = ['dist', 'lib', 'es'];
  const srcDir = path.join(pkg.path, 'src');
  
  // 检查源码目录是否存在
  if (!fs.existsSync(srcDir)) {
    return true; // 如果没有源码目录，仍然构建
  }
  
  // 获取源码文件的最新修改时间
  const srcFiles = getAllFiles(srcDir);
  const srcLatestTime = Math.max(...srcFiles.map(file => fs.statSync(file).mtimeMs));
  
  // 检查输出目录的最新修改时间
  const distDirsExist = distDirs.filter(dir => fs.existsSync(path.join(pkg.path, dir)));
  
  if (distDirsExist.length === 0) {
    return true; // 没有输出目录，需要构建
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
  }
  
  traverse(dir);
  return files;
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

// 应用增量构建过滤
if (options.incremental) {
  const originalCount = packagesToBuild.length;
  packagesToBuild = packagesToBuild.filter(pkg => {
    const shouldBuild = checkIncrementalBuild(pkg);
    if (!shouldBuild) {
      console.log(`⏭️  跳过 ${pkg.name} (增量构建检查)`);
    }
    return shouldBuild;
  });
  
  if (originalCount > packagesToBuild.length) {
    console.log(`📊 增量构建: ${packagesToBuild.length}/${originalCount} 个包需要构建`);
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

// 并行构建函数
async function buildPackage(pkg, index, total) {
  console.log(`🔨 [${index + 1}/${total}] 构建 ${pkg.name}...`);
  
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
      return { success: true, pkg };
    } else {
      console.log(`  ⚠️  ${pkg.name} 没有构建脚本，跳过`);
      return { success: true, pkg, skipped: true };
    }
  } catch (error) {
    console.error(`  ❌ ${pkg.name} 构建失败:`, error.message);
    if (options.verbose) {
      console.error(error.stdout?.toString());
      console.error(error.stderr?.toString());
    }
    return { success: false, pkg, error };
  }
}

// 串行构建函数
async function buildSequential(packages) {
  for (let i = 0; i < packages.length; i++) {
    const result = await buildPackage(packages[i], i, packages.length);
    if (!result.success) {
      throw new Error(`构建失败: ${result.pkg.name}`);
    }
    console.log('');
  }
}

// 并行构建函数
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
    
    // 检查是否有失败的构建
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

try {
  const buildOrder = getBuildOrder(packagesToBuild);
  console.log(`\n📋 构建顺序: ${buildOrder.map(p => p.name).join(' -> ')}\n`);

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
