#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 批量替换 modernx 为 modernx...\n');

// 需要排除的目录和文件
const excludeDirs = [
  'node_modules',
  '.git',
  'dist',
  'lib',
  'es',
  'coverage',
  '.changelog',
  '.lerna',
  'packages/*/dist',
  'packages/*/lib',
  'packages/*/es'
];

const excludeFiles = [
  'CHANGELOG.md',
  'package-lock.json',
  'yarn.lock',
  '*.min.js',
  '*.map'
];

// 检查路径是否应该排除
function shouldExclude(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // 检查排除的目录
  for (const excludeDir of excludeDirs) {
    if (normalizedPath.includes(excludeDir)) {
      return true;
    }
  }
  
  // 检查排除的文件
  for (const excludeFile of excludeFiles) {
    if (normalizedPath.endsWith(excludeFile.replace('*', ''))) {
      return true;
    }
  }
  
  return false;
}

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!shouldExclude(filePath)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      if (!shouldExclude(filePath)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// 替换文件内容
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // 替换规则
    const replacements = [
      // 基本替换
      { from: /modernx/g, to: 'modernx' },
      { from: /ModernX/g, to: 'ModernX' },
      { from: /MODERNX/g, to: 'MODERNX' },
      
      // URL 替换
      { from: /modernxjs\.github\.io\/modernx/g, to: 'perlinson.github.io/modernx' },
      { from: /modernxjs\/modernx/g, to: 'perlinson/modernx' },
      { from: /github\.com\/modernxjs\/modernx/g, to: 'github.com/perlinson/modernx' },
      
      // 包名替换
      { from: /@modernxjs\/modernx/g, to: '@perlinson/modernx' },
      { from: /babel-plugin-modernx-hmr/g, to: 'babel-plugin-modernx-hmr' },
      { from: /modernx-cli/g, to: 'modernx-cli' },
      { from: /modernx-loading/g, to: 'modernx-loading' },
      { from: /modernx-core/g, to: 'modernx-core' },
      { from: /modernx-immer/g, to: 'modernx-immer' },
      
      // 特殊情况处理
      { from: /with-modernx\.html/g, to: 'with-modernx.html' },
      { from: /modernx\/routerV6Compat/g, to: 'modernx/routerV6Compat' },
      { from: /modernx\/react18-utils/g, to: 'modernx/react18-utils' },
      
      // 文档链接
      { from: /modernx-hackernews/g, to: 'modernx-hackernews' },
      { from: /modernx-example-count/g, to: 'modernx-example-count' },
      { from: /react-native-modernx-starter/g, to: 'react-native-modernx-starter' }
    ];
    
    // 应用替换
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });
    
    // 如果内容有变化，写回文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 更新: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
    return false;
  }
}

// 主函数
function main() {
  const rootDir = path.join(__dirname, '..');
  const allFiles = getAllFiles(rootDir);
  
  console.log(`📁 找到 ${allFiles.length} 个文件\n`);
  
  let updatedCount = 0;
  
  allFiles.forEach(filePath => {
    if (replaceInFile(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`\n🎉 完成! 更新了 ${updatedCount} 个文件`);
  
  // 显示一些需要手动检查的重要文件
  console.log('\n📝 建议手动检查以下文件:');
  const importantFiles = [
    'README.md',
    'README_zh-CN.md',
    'package.json',
    'lerna.json',
    'docs/API.md',
    'docs/Concepts.md'
  ];
  
  importantFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  - ${file}`);
    }
  });
}

if (require.main === module) {
  main();
}

module.exports = { replaceInFile, getAllFiles, shouldExclude };
