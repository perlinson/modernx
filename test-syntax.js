#!/usr/bin/env node

/**
 * Simple syntax test for React 18 upgrade
 * Tests that all JavaScript files have valid syntax
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing JavaScript syntax...\n');

// Test syntax of a file
function testFileSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax check - try to parse with Function constructor
    // This is a simple way to check for syntax errors without running the code
    try {
      new Function(content);
      return true;
    } catch (syntaxError) {
      console.log(`❌ Syntax error in ${filePath}: ${syntaxError.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error reading ${filePath}: ${error.message}`);
    return false;
  }
}

// Test all JavaScript files in src directories
function testAllSyntax() {
  const srcDirs = [
    'packages/modernx/src',
    'packages/modernx-core/src',
    'packages/modernx-immer/src',
    'packages/modernx-loading/src'
  ];
  
  let totalFiles = 0;
  let passedFiles = 0;
  let failedFiles = 0;
  
  srcDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      return;
    }
    
    const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.js'));
    
    files.forEach(file => {
      const filePath = path.join(fullPath, file);
      totalFiles++;
      
      if (testFileSyntax(filePath)) {
        passedFiles++;
      } else {
        failedFiles++;
      }
    });
  });
  
  console.log('\n📊 Syntax Test Results:');
  console.log(`📁 Total files: ${totalFiles}`);
  console.log(`✅ Passed: ${passedFiles}`);
  console.log(`❌ Failed: ${failedFiles}`);
  console.log(`📈 Success Rate: ${totalFiles > 0 ? Math.round((passedFiles / totalFiles) * 100) : 0}%`);
  
  if (failedFiles === 0) {
    console.log('\n🎉 All syntax tests passed!');
    return true;
  } else {
    console.log('\n⚠️  Some syntax tests failed.');
    return false;
  }
}

// Run syntax tests
const success = testAllSyntax();
process.exit(success ? 0 : 1);
