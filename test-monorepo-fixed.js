#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 ModernX Monorepo 测试脚本\n');

// 获取命令行参数
const args = process.argv.slice(2);
const options = {
  scope: null,
  coverage: args.includes('--coverage'),
  watch: args.includes('--watch'),
  verbose: args.includes('--verbose'),
  packages: [],
  parallel: args.includes('--parallel'),
  maxConcurrency: 4
};

// 解析参数
args.forEach(arg => {
  if (arg.startsWith('--scope=')) {
    options.scope = arg.replace('--scope=', '');
  } else if (arg.startsWith('--package=')) {
    options.packages.push(arg.replace('--package=', ''));
  } else if (arg.startsWith('--max-concurrency=')) {
    options.maxConcurrency = parseInt(arg.replace('--max-concurrency=', ''), 10);
  }
});

// 获取所有包
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

// 确定要测试的包
let packagesToTest = packages;

if (options.scope) {
  packagesToTest = packages.filter(pkg => pkg.name === options.scope);
  console.log(`🎯 只测试包: ${options.scope}`);
} else if (options.packages.length > 0) {
  packagesToTest = packages.filter(pkg => options.packages.includes(pkg.name));
  console.log(`🎯 测试指定包: ${options.packages.join(', ')}`);
}

// 测试依赖顺序
function getTestOrder(packages) {
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

// 测试单个包
async function testPackage(pkg, index, total) {
  console.log(`🧪 [${index + 1}/${total}] 测试 ${pkg.name}...`);
  
  try {
    const scripts = pkg.packageJson.scripts || {};
    const testScript = scripts.test;
    
    if (testScript) {
      console.log(`  📦 执行测试脚本: ${testScript}`);
      
      let testCmd = `cd "${pkg.path}" && ${testScript}`;
      
      if (options.coverage) {
        testCmd += ' --coverage';
      }
      
      if (options.watch) {
        testCmd += ' --watch';
      }
      
      if (options.verbose) {
        console.log(`  💡 执行命令: ${testCmd}`);
      }
      
      execSync(testCmd, { 
        stdio: options.verbose ? 'inherit' : 'pipe',
        cwd: pkg.path 
      });
      console.log(`  ✅ ${pkg.name} 测试成功`);
      return { success: true, pkg };
    } else {
      console.log(`  ⚠️  ${pkg.name} 没有测试脚本，跳过`);
      return { success: true, pkg, skipped: true };
    }
  } catch (error) {
    console.error(`  ❌ ${pkg.name} 测试失败:`, error.message);
    if (options.verbose) {
      console.error(error.stdout?.toString());
      console.error(error.stderr?.toString());
    }
    return { success: false, pkg, error };
  }
}

// 串行测试函数
async function testSequential(packages) {
  for (let i = 0; i < packages.length; i++) {
    const result = await testPackage(packages[i], i, packages.length);
    if (!result.success) {
      throw new Error(`测试失败: ${result.pkg.name}`);
    }
    console.log('');
  }
}

// 并行测试函数
async function testParallel(packages) {
  const chunks = [];
  for (let i = 0; i < packages.length; i += options.maxConcurrency) {
    chunks.push(packages.slice(i, i + options.maxConcurrency));
  }
  
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];
    console.log(`\n🔄 并行测试块 ${chunkIndex + 1}/${chunks.length} (并发度: ${options.maxConcurrency})`);
    
    const promises = chunk.map((pkg, index) => 
      testPackage(pkg, chunkIndex * options.maxConcurrency + index, packages.length)
    );
    
    const results = await Promise.all(promises);
    
    // 检查是否有失败的测试
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      console.error('\n❌ 并行测试失败:');
      failed.forEach(r => {
        console.error(`  - ${r.pkg.name}: ${r.error.message}`);
      });
      throw new Error(`并行测试失败: ${failed.map(r => r.pkg.name).join(', ')}`);
    }
    
    console.log(`\n✅ 测试块 ${chunkIndex + 1} 完成`);
  }
}

// 聚合测试覆盖率
function aggregateCoverage(packages) {
  console.log('\n📊 聚合测试覆盖率...');
  
  const coverageDirs = packages.map(pkg => path.join(pkg.path, 'coverage')).filter(dir => fs.existsSync(dir));
  
  if (coverageDirs.length === 0) {
    console.log('  ⚠️  没有覆盖率报告');
    return;
  }
  
  try {
    // 创建合并后的覆盖率目录
    const mergedCoverageDir = path.join(__dirname, 'coverage');
    if (!fs.existsSync(mergedCoverageDir)) {
      fs.mkdirSync(mergedCoverageDir, { recursive: true });
    }
    
    console.log(`  📈 合并 ${coverageDirs.length} 个覆盖率报告`);
    console.log(`  📁 输出目录: ${mergedCoverageDir}`);
    
  } catch (error) {
    console.warn('  ⚠️  覆盖率聚合失败:', error.message);
  }
}

try {
  const testOrder = getTestOrder(packagesToTest);
  console.log(`\n📋 测试顺序: ${testOrder.map(p => p.name).join(' -> ')}\n`);

  if (options.parallel) {
    console.log(`🚀 并行测试模式 (并发度: ${options.maxConcurrency})`);
    await testParallel(testOrder);
  } else {
    console.log('🔧 串行测试模式');
    await testSequential(testOrder);
  }

  console.log('\n🎉 所有包测试完成!');
  
  // 聚合覆盖率
  if (options.coverage) {
    aggregateCoverage(testOrder);
  }
  
  // 显示测试结果
  console.log('\n📊 测试结果:');
  testOrder.forEach(pkg => {
    const scripts = pkg.packageJson.scripts || {};
    const hasTest = !!scripts.test;
    console.log(`  ${pkg.name}: ${hasTest ? '✅ 有测试' : '⚠️  无测试'}`);
  });

} catch (error) {
  console.error('\n❌ 测试失败:', error.message);
  process.exit(1);
}
