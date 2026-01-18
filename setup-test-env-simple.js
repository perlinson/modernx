#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 设置测试环境隔离\n');

// 创建 Jest 配置文件
const jestConfig = `module.exports = {
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
};`;

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

packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg);
  const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf8'));
  
  // 创建包特定的 Jest 配置
  const pkgJestConfig = {
    displayName: pkg,
    testMatch: [
      '<rootDir>/packages/' + pkg + '/**/__tests__/**/*.js',
      '<rootDir>/packages/' + pkg + '/**/?(*.)+(spec|test).js'
    ],
    collectCoverageFrom: [
      'packages/' + pkg + '/src/**/*.{js,jsx,ts,tsx}'
    ],
    moduleNameMapper: {
      '^@modernx/(.*)$': '<rootDir>/packages/$1/src'
    },
    setupFilesAfterEnv: [
      '<rootDir>/jest.setup.js',
      '<rootDir>/packages/' + pkg + '/test/setup.js'
    ]
  };
  
  const pkgConfigPath = path.join(pkgPath, 'jest.config.js');
  fs.writeFileSync(pkgConfigPath, 'module.exports = ' + JSON.stringify(pkgJestConfig, null, 2) + ';');
  
  // 创建包特定的测试设置
  const pkgSetupPath = path.join(pkgPath, 'test/setup.js');
  if (!fs.existsSync(path.dirname(pkgSetupPath))) {
    fs.mkdirSync(path.dirname(pkgSetupPath), { recursive: true });
  }
  
  const pkgSetup = '// ' + pkg + ' 包测试设置\n// 可以在这里添加包特定的测试工具和模拟';
  fs.writeFileSync(pkgSetupPath, pkgSetup);
  
  console.log('  ✅ 创建 ' + pkg + ' 测试配置');
});

// 创建覆盖率聚合脚本
const coverageScript = '#!/usr/bin/env node\n' +
  'const fs = require("fs");\n' +
  'const path = require("path");\n\n' +
  'console.log("📊 聚合测试覆盖率...");\n\n' +
  'const packagesDir = path.join(__dirname, "packages");\n' +
  'const packages = fs.readdirSync(packagesDir)\n' +
  '  .filter(dir => {\n' +
  '    const packagePath = path.join(packagesDir, dir);\n' +
  '    return fs.statSync(packagePath).isDirectory() && \n' +
  '           fs.existsSync(path.join(packagePath, "package.json"));\n' +
  '  });\n\n' +
  'const coverageDirs = packages\n' +
  '  .map(pkg => path.join(__dirname, "packages", pkg, "coverage"))\n' +
  '  .filter(dir => fs.existsSync(dir));\n\n' +
  'if (coverageDirs.length === 0) {\n' +
  '  console.log("  ⚠️  没有覆盖率报告");\n' +
  '  process.exit(0);\n' +
  '}\n\n' +
  '// 创建合并后的覆盖率目录\n' +
  'const mergedCoverageDir = path.join(__dirname, "coverage");\n' +
  'if (!fs.existsSync(mergedCoverageDir)) {\n' +
  '  fs.mkdirSync(mergedCoverageDir, { recursive: true });\n' +
  '}\n\n' +
  '// 简单复制覆盖率文件\n' +
  'coverageDirs.forEach((dir, index) => {\n' +
  '  const pkgName = packages[index];\n' +
  '  const targetDir = path.join(mergedCoverageDir, pkgName);\n' +
  '  \n' +
  '  if (fs.existsSync(targetDir)) {\n' +
  '    fs.rmSync(targetDir, { recursive: true });\n' +
  '  }\n' +
  '  \n' +
  '  if (fs.existsSync(dir)) {\n' +
  '    fs.cpSync(dir, targetDir, { recursive: true });\n' +
  '    console.log("    📁 复制 " + pkgName + " 覆盖率报告");\n' +
  '  }\n' +
  '});\n' +
  '\n' +
  'console.log("  ✅ 覆盖率报告已生成: " + mergedCoverageDir);\n';

fs.writeFileSync(path.join(__dirname, 'scripts/aggregate-coverage.js'), coverageScript);

// 创建测试清理脚本
const cleanupScript = '#!/usr/bin/env node\n' +
  'const fs = require("fs");\n' +
  'const path = require("path");\n\n' +
  'console.log("🧹 清理测试环境...");\n\n' +
  '// 清理覆盖率报告\n' +
  'const coverageDir = path.join(__dirname, "coverage");\n' +
  'if (fs.existsSync(coverageDir)) {\n' +
  '  fs.rmSync(coverageDir, { recursive: true });\n' +
  '  console.log("  🗑️  清理覆盖率报告");\n' +
  '}\n' +
  '\n' +
  '// 清理临时文件\n' +
  'const tempDirs = [".nyc_output", ".coverage"];\n' +
  'tempDirs.forEach(dir => {\n' +
  '  const dirPath = path.join(__dirname, dir);\n' +
  '  if (fs.existsSync(dirPath)) {\n' +
  '    fs.rmSync(dirPath, { recursive: true });\n' +
  '    console.log("  🗑️  清理临时目录: " + dir);\n' +
  '  }\n' +
  '});\n' +
  '\n' +
  'console.log("✅ 测试环境清理完成");\n';

fs.writeFileSync(path.join(__dirname, 'scripts/test-cleanup.js'), cleanupScript);

console.log('\n✅ 测试环境隔离设置完成!');
console.log('\n📋 创建的文件:');
console.log('  - jest.config.js (根级别配置)');
console.log('  - jest.setup.js (全局测试设置)');
console.log('  - scripts/aggregate-coverage.js (覆盖率聚合)');
console.log('  - scripts/test-cleanup.js (测试清理)');
console.log('  - ' + packages.length + ' 个包的独立测试配置');
console.log('\n🚀 使用方法:');
console.log('  npm test                    # 运行所有测试');
console.log('  npm run test:coverage       # 运行测试并生成覆盖率');
console.log('  npm run test:cleanup         # 清理测试环境');
