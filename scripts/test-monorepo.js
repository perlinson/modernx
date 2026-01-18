#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 ModernX Monorepo 测试脚本\n');

// 获取命令行参数
const args = process.argv.slice(2);
const options = {
  scope: null,
  since: null,
  coverage: args.includes('--coverage'),
  verbose: args.includes('--verbose'),
  watch: args.includes('--watch'),
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

// 确定要测试的包
let packagesToTest = packages;

if (options.scope) {
  packagesToTest = packages.filter(pkg => pkg.name === options.scope);
  console.log(`🎯 只测试包: ${options.scope}`);
} else if (options.packages.length > 0) {
  packagesToTest = packages.filter(pkg => options.packages.includes(pkg.name));
  console.log(`🎯 测试指定包: ${options.packages.join(', ')}`);
} else if (options.since) {
  try {
    const changedPackages = execSync(`lerna changed --since=${options.since} --json`, { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    if (changedPackages.trim()) {
      const changed = JSON.parse(changedPackages);
      packagesToTest = packages.filter(pkg => 
        changed.some(changed => changed.name === pkg.name)
      );
      console.log(`🔄 测试变更的包: ${packagesToTest.map(p => p.name).join(', ')}`);
    } else {
      console.log('ℹ️  没有变更的包需要测试');
      process.exit(0);
    }
  } catch (error) {
    console.warn('⚠️  无法检测变更的包，测试所有包');
  }
}

// 测试每个包
packagesToTest.forEach((pkg, index) => {
  console.log(`🧪 [${index + 1}/${packagesToTest.length}] 测试 ${pkg.name}...`);
  
  try {
    // 检查包是否有测试脚本
    const scripts = pkg.packageJson.scripts || {};
    const testScript = scripts.test;
    
    if (testScript) {
      console.log(`  📦 执行测试脚本: ${testScript}`);
      
      // 构建测试命令
      let testCmd = testScript;
      if (options.coverage && !testCmd.includes('coverage')) {
        testCmd = testCmd.replace('test', 'test --coverage');
      }
      if (options.watch && !testCmd.includes('--watch')) {
        testCmd += ' --watch';
      }
      
      const fullCmd = `cd "${pkg.path}" && ${testCmd}`;
      
      if (options.verbose) {
        console.log(`  💡 执行命令: ${fullCmd}`);
      }
      
      execSync(fullCmd, { 
        stdio: options.verbose ? 'inherit' : 'pipe',
        cwd: pkg.path 
      });
      console.log(`  ✅ ${pkg.name} 测试通过`);
    } else {
      console.log(`  ⚠️  ${pkg.name} 没有测试脚本，跳过`);
    }
  } catch (error) {
    console.error(`  ❌ ${pkg.name} 测试失败:`, error.message);
    if (options.verbose) {
      console.error(error.stdout?.toString());
      console.error(error.stderr?.toString());
    }
    process.exit(1);
  }
  
  console.log('');
});

console.log('🎉 所有测试通过！');

// 如果启用了覆盖率，显示覆盖率报告
if (options.coverage) {
  console.log('\n📊 覆盖率报告:');
  packagesToTest.forEach(pkg => {
    const coveragePath = path.join(pkg.path, 'coverage');
    if (fs.existsSync(coveragePath)) {
      console.log(`  ${pkg.name}: coverage/ 目录已生成`);
    }
  });
}
