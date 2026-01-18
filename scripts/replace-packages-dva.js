#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 替换 packages 目录中的 dva 为 modernx...\n');

// 获取 packages 目录下的所有文件
function getPackageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getPackageFiles(filePath, fileList);
    } else {
      // 只处理特定类型的文件
      const ext = path.extname(filePath);
      if (['.js', '.md', '.ts', '.json', '.d.ts'].includes(ext)) {
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
    
    // 对于源代码文件，需要更谨慎的替换
    const isSourceFile = /\.(js|ts|d\.ts)$/.test(filePath);
    const isTestFile = /test\//.test(filePath) || /\.test\.js$/.test(filePath);
    
    if (isSourceFile && !isTestFile) {
      // 源代码中的替换 - 更保守
      content = content.replace(/dva-core/g, 'modernx-core');
      content = content.replace(/dva-loading/g, 'modernx-loading');
      content = content.replace(/dva-immer/g, 'modernx-immer');
      
      // 只在注释和字符串中替换 dva
      content = content.replace(/\/\/.*dva/g, (match) => match.replace(/dva/g, 'modernx'));
      content = content.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/dva/g, 'modernx'));
      content = content.replace(/['"`]dva['"`]/g, "'modernx'");
      content = content.replace(/['"`]dva-/g, "'modernx-");
    } else if (isTestFile || filePath.endsWith('.md')) {
      // 测试文件和文档可以更自由地替换
      content = content.replace(/dva/g, 'modernx');
      content = content.replace(/Dva/g, 'ModernX');
      content = content.replace(/DVA/g, 'MODERNX');
    } else if (filePath.endsWith('.json')) {
      // JSON 文件的替换
      const jsonData = JSON.parse(content);
      const jsonStr = JSON.stringify(jsonData);
      if (jsonStr.includes('dva')) {
        content = jsonStr.replace(/dva-core/g, 'modernx-core')
                       .replace(/dva-loading/g, 'modernx-loading')
                       .replace(/dva-immer/g, 'modernx-immer')
                       .replace(/dva/g, 'modernx');
        // 重新格式化 JSON
        content = JSON.stringify(JSON.parse(content), null, 2) + '\n';
      }
    }
    
    // 如果内容有变化，写回文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 更新: ${path.relative(process.cwd(), filePath)}`);
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
  const packagesDir = path.join(__dirname, '..', 'packages');
  
  if (!fs.existsSync(packagesDir)) {
    console.error('❌ packages 目录不存在');
    process.exit(1);
  }
  
  const allFiles = getPackageFiles(packagesDir);
  console.log(`📁 找到 ${allFiles.length} 个文件\n`);
  
  let updatedCount = 0;
  
  allFiles.forEach(filePath => {
    if (replaceInFile(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`\n🎉 完成! 更新了 ${updatedCount} 个文件`);
}

if (require.main === module) {
  main();
}
