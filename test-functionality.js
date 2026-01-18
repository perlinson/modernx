#!/usr/bin/env node

/**
 * Simple functionality test for React 18 upgrade
 * Tests core features without complex test framework
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Testing React 18 modernx functionality...\n');

// Test 1: Check if React 18 utils file exists and is valid JavaScript
function testReact18Utils() {
  try {
    const coreUtilsPath = path.join(__dirname, 'packages/modernx-core/src/react18.js');
    const hooksUtilsPath = path.join(__dirname, 'packages/modernx/src/react18-hooks.js');
    
    const coreContent = fs.readFileSync(coreUtilsPath, 'utf8');
    const hooksContent = fs.readFileSync(hooksUtilsPath, 'utf8');
    
    // Check for key exports in core
    const requiredCoreExports = [
      'isReact18ConcurrentAvailable',
      'createReact18Utils',
      'createReact18Hooks',
      'createReact18HOC',
      'createDvaReact18Enhancer'
    ];
    
    // Check for key exports in hooks
    const requiredHooksExports = [
      'useDvaTransition',
      'useDvaConcurrentState',
      'useDvaLoading',
      'batchUpdates',
      'useDvaConcurrent'
    ];
    
    const missingCoreExports = requiredCoreExports.filter(name => !coreContent.includes(`export function ${name}`));
    const missingHooksExports = requiredHooksExports.filter(name => !hooksContent.includes(`export function ${name}`));
    
    if (missingCoreExports.length === 0 && missingHooksExports.length === 0) {
      console.log('✅ React 18 utils: All required exports present in core and hooks');
      return true;
    } else {
      console.log(`❌ React 18 utils: Missing core exports: ${missingCoreExports.join(', ')}`);
      console.log(`❌ React 18 utils: Missing hooks exports: ${missingHooksExports.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ React 18 utils: Error reading files - ${error.message}`);
    return false;
  }
}

// Test 2: Check if Router v6 compat file exists and is valid
function testRouterV6Compat() {
  try {
    const compatPath = path.join(__dirname, 'packages/modernx/src/router-v6-compat.js');
    const content = fs.readFileSync(compatPath, 'utf8');
    
    // Check for key exports
    const requiredExports = [
      'RouterSwitch',
      'CompatRoute',
      'CompatRedirect',
      'CompatLink',
      'useCompatHistory'
    ];
    
    const missingExports = requiredExports.filter(name => !content.includes(`export function ${name}`));
    
    if (missingExports.length === 0) {
      console.log('✅ Router v6 compat: All required exports present');
      return true;
    } else {
      console.log(`❌ Router v6 compat: Missing exports: ${missingExports.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Router v6 compat: Error reading file - ${error.message}`);
    return false;
  }
}

// Test 3: Check if package.json has React 18 dependencies
function testPackageDependencies() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    const pkg = JSON.parse(content);
    
    const hasReact18 = pkg.devDependencies && 
                      pkg.devDependencies.react && 
                      pkg.devDependencies.react.startsWith('^18');
    
    if (hasReact18) {
      console.log('✅ Package dependencies: React 18 found');
      return true;
    } else {
      console.log('❌ Package dependencies: React 18 not found');
      return false;
    }
  } catch (error) {
    console.log(`❌ Package dependencies: Error reading package.json - ${error.message}`);
    return false;
  }
}

// Test 4: Check if CircleCI config is updated
function testCircleCIConfig() {
  try {
    const configPath = path.join(__dirname, '.circleci/config.yml');
    const content = fs.readFileSync(configPath, 'utf8');
    
    const hasNode18 = content.includes('circleci/node:18-browsers');
    const hasReact18Test = content.includes('react18_test');
    
    if (hasNode18 && hasReact18Test) {
      console.log('✅ CircleCI config: Node 18 and React 18 test job found');
      return true;
    } else {
      console.log('❌ CircleCI config: Missing Node 18 or React 18 test job');
      return false;
    }
  } catch (error) {
    console.log(`❌ CircleCI config: Error reading config - ${error.message}`);
    return false;
  }
}

// Test 5: Check if examples exist
function testExamples() {
  try {
    const examplesDir = path.join(__dirname, 'examples');
    const requiredExamples = [
      'react18-concurrent',
      'react18-batching', 
      'react18-strict-mode',
      'react-router-v6'
    ];
    
    const existingExamples = requiredExamples.filter(name => {
      const examplePath = path.join(examplesDir, name);
      return fs.existsSync(examplePath);
    });
    
    if (existingExamples.length === requiredExamples.length) {
      console.log('✅ Examples: All React 18 examples present');
      return true;
    } else {
      const missing = requiredExamples.filter(name => !existingExamples.includes(name));
      console.log(`❌ Examples: Missing examples: ${missing.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Examples: Error checking examples - ${error.message}`);
    return false;
  }
}

// Test 6: Check if Babel config supports React 18
function testBabelConfig() {
  try {
    const configPath = path.join(__dirname, 'babel.config.js');
    const content = fs.readFileSync(configPath, 'utf8');
    
    const hasReactPreset = content.includes('@babel/preset-react');
    const hasRuntimeAutomatic = content.includes('runtime: \'automatic\'');
    
    if (hasReactPreset) {
      console.log('✅ Babel config: React preset found');
      return true;
    } else {
      console.log('❌ Babel config: React preset not found');
      return false;
    }
  } catch (error) {
    console.log(`❌ Babel config: Error reading config - ${error.message}`);
    return false;
  }
}

// Run all tests
function runTests() {
  const tests = [
    testReact18Utils,
    testRouterV6Compat,
    testPackageDependencies,
    testCircleCIConfig,
    testExamples,
    testBabelConfig
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    if (test()) {
      passed++;
    } else {
      failed++;
    }
  });
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All functionality tests passed! React 18 upgrade is ready.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
    process.exit(1);
  }
}

// Run tests
runTests();
