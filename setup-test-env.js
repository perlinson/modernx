#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 设置测试环境隔离\n');

// 创建测试环境配置
const testConfig = {
  // Jest 配置
  jest: {
    testEnvironment: 'node',
    testMatch: [
      '**/__tests__/**/*.js',
      '**/?(*.)+(spec|test).js'
    ],
    collectCoverageFrom: [
      'packages/*/src/**/*.{js,jsx,ts,tsx}',
      '!packages/*/src/**/*.d.ts',
      '!packages/*/src/**/index.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    projects: [
      '<rootDir>/packages/*'
    ],
    moduleNameMapper: {
      '^@modernx/(.*)$': '<rootDir>/packages/$1/src'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
  },
  
  // 测试环境变量
  env: {
    NODE_ENV: 'test',
    MODERNX_ENV: 'test'
  },
  
  // 测试隔离配置
  testIsolation: {
    // 每个包独立测试
    isolatePackages: true,
    // 防止全局状态污染
    resetMocks: true,
    // 清理临时文件
    cleanupTempFiles: true
  }
};

// 创建 Jest 配置文件
const jestConfig = `module.exports = ${JSON.stringify(testConfig.jest, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'jest.config.js'), jestConfig);

// 创建 Jest 设置文件
const jestSetup = `
// 测试环境设置
process.env.NODE_ENV = 'test';
process.env.MODERNX_ENV = 'test';

// 设置测试超时
jest.setTimeout(30000);

// 全局测试工具
global.console = {
  ...console,
  // 在测试中禁用某些日志
  log: jest.fn(),
  warn: jest.fn(),
  error: console.error,
};

// 模拟浏览器环境
if (typeof window === 'undefined') {
  global.window = {};
  global.document = {};
  global.navigator = {};
}
`;

fs.writeFileSync(path.join(__dirname, 'jest.setup.js'), jestSetup);

// 创建包特定的测试配置
const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir)
  .filter(dir => {
    const packagePath = path.join(packagesDir, dir);
    return fs.statSync(packagePath).isDirectory() && 
           fs.existsSync(path.join(packagePath, 'package.json'));
  });

// 为每个包创建测试配置
packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg);
  const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf8'));
  
  // 创建包特定的 Jest 配置
  const pkgJestConfig = {
    displayName: pkg,
    testMatch: [
      `<rootDir>/packages/${pkg}/**/__tests__/**/*.js`,
      `<rootDir>/packages/${pkg}/**/?(*.)+(spec|test).js`
    ],
    collectCoverageFrom: [
      `packages/${pkg}/src/**/*.{js,jsx,ts,tsx}`
    ],
    moduleNameMapper: {
      '^@modernx/(.*)$': '<rootDir>/packages/$1/src'
    },
    setupFilesAfterEnv: [
      '<rootDir>/jest.setup.js',
      `<rootDir>/packages/${pkg}/test/setup.js`
    ]
  };
  
  const pkgConfigPath = path.join(pkgPath, 'jest.config.js');
  fs.writeFileSync(pkgConfigPath, `module.exports = ${JSON.stringify(pkgJestConfig, null, 2)};`);
  
  // 创建包特定的测试设置
  const pkgSetupPath = path.join(pkgPath, 'test/setup.js');
  if (!fs.existsSync(path.dirname(pkgSetupPath))) {
    fs.mkdirSync(path.dirname(pkgSetupPath), { recursive: true });
  }
  
  const pkgSetup = `
// ${pkg} 包测试设置
// 可以在这里添加包特定的测试工具和模拟
`;

  fs.writeFileSync(pkgSetupPath, pkgSetup);
  
  console.log(`  ✅ 创建 ${pkg} 测试配置`);
});

// 创建测试覆盖率聚合脚本
const coverageAggregator = `
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 聚合测试覆盖率...');

const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir)
  .filter(dir => {
    const packagePath = path.join(packagesDir, dir);
    return fs.statSync(packagePath).isDirectory() && 
           fs.existsSync(path.join(packagePath, 'package.json'));
  });

const coverageDirs = packages
  .map(pkg => path.join(__dirname, 'packages', pkg, 'coverage'))
  .filter(dir => fs.existsSync(dir));

if (coverageDirs.length === 0) {
  console.log('  ⚠️  没有覆盖率报告');
  process.exit(0);
}

// 创建合并后的覆盖率目录
const mergedCoverageDir = path.join(__dirname, 'coverage');
if (!fs.existsSync(mergedCoverageDir)) {
  fs.mkdirSync(mergedCoverageDir, { recursive: true });
}

// 合并覆盖率报告
const { execSync } = require('child_process');
try {
  console.log('  📈 合并覆盖率报告...');
  
  // 使用 nyc 合并覆盖率
  const nycCmd = \`nyc merge ${coverageDirs.join(' ')} --reporter=html --reporter=text --reporter=lcov --report-dir=${mergedCoverageDir}\`;
  execSync(nycCmd, { stdio: 'inherit' });
  
  console.log(\`  ✅ 覆盖率报告已生成: \${mergedCoverageDir}\`);
} catch (error) {
  console.warn('  ⚠️  覆盖率聚合失败:', error.message);
  
  // 备用方案：简单复制覆盖率文件
  console.log('  🔄 使用备用方案复制覆盖率文件...');
  coverageDirs.forEach((dir, index) => {
    const pkgName = packages[index];
    const targetDir = path.join(mergedCoverageDir, pkgName);
    
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true });
    }
    
    if (fs.existsSync(dir)) {
      fs.cpSync(dir, targetDir, { recursive: true });
      console.log(\`    📁 复制 \${pkgName} 覆盖率报告\`);
    }
  });
}
`;

fs.writeFileSync(path.join(__dirname, 'scripts/aggregate-coverage.js'), coverageAggregator);

// 创建测试清理脚本
const testCleanup = `
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 清理测试环境...');

// 清理覆盖率报告
const coverageDir = path.join(__dirname, 'coverage');
if (fs.existsSync(coverageDir)) {
  fs.rmSync(coverageDir, { recursive: true });
  console.log('  🗑️  清理覆盖率报告');
}

// 清理临时文件
const tempDirs = ['.nyc_output', '.coverage'];
tempDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true });
    console.log(\`  🗑️  清理临时目录: \${dir}\`);
  }
});

// 清理包级别的测试输出
const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir)
  .filter(dir => {
    const packagePath = path.join(packagesDir, dir);
    return fs.statSync(packagePath).isDirectory();
  });

packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg);
  const cleanDirs = ['coverage', '.nyc_output', 'node_modules/.cache'];
  
  cleanDirs.forEach(dir => {
    const dirPath = path.join(pkgPath, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true });
    }
  });
});

console.log('✅ 测试环境清理完成');
`;

fs.writeFileSync(path.join(__dirname, 'scripts/test-cleanup.js'), testCleanup);

console.log('\n✅ 测试环境隔离设置完成!');
console.log('\n📋 创建的文件:');
console.log('  - jest.config.js (根级别配置)');
console.log('  - jest.setup.js (全局测试设置)');
console.log('  - scripts/aggregate-coverage.js (覆盖率聚合)');
console.log('  - scripts/test-cleanup.js (测试清理)');
console.log(`  - ${packages.length} 个包的独立测试配置`);
