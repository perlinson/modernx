#!/usr/bin/env node

/**
 * Module structure test for React 18 upgrade
 * Tests that all required modules and exports are present
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Testing module structure...\n');

// Test if file exists and has expected exports
function testModuleExports(filePath, expectedExports) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const missingExports = [];
    
    expectedExports.forEach(exportName => {
      if (!content.includes(`export function ${exportName}`) && 
          !content.includes(`export const ${exportName}`) &&
          !content.includes(`export { ${exportName}`) &&
          !content.includes(`export ${exportName}`) &&
          !content.includes(`export.*${exportName}`) &&
          !content.includes(`export * from.*${exportName}`)) {
        missingExports.push(exportName);
      }
    });
    
    if (missingExports.length === 0) {
      console.log(`✅ ${path.basename(filePath)}: All required exports present`);
      return true;
    } else {
      console.log(`❌ ${path.basename(filePath)}: Missing exports: ${missingExports.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error testing ${filePath}: ${error.message}`);
    return false;
  }
}

// Test React 18 utils module
function testReact18Utils() {
  const filePath = path.join(__dirname, 'packages/modernx/src/react18-utils.js');
  const expectedExports = [
    'useDvaTransition',
    'useDvaConcurrentState',
    'withDvaConcurrent',
    'batchUpdates',
    'isReact18ConcurrentAvailable',
    'useDvaLoading',
    'useSafeConcurrentHook',
    'createConcurrentDispatch',
    'createConcurrentSelector'
  ];
  
  return testModuleExports(filePath, expectedExports);
}

// Test Router v6 compat module
function testRouterV6Compat() {
  const filePath = path.join(__dirname, 'packages/modernx/src/router-v6-compat.js');
  const expectedExports = [
    'RouterSwitch',
    'CompatRoute',
    'CompatRedirect',
    'CompatLink',
    'useCompatHistory',
    'useCompatLocation',
    'useCompatParams',
    'useCompatRouteMatch',
    'useCompatSearchParams',
    'withRouterV6Compat',
    'createRouteConfig',
    'convertRoutes'
  ];
  
  return testModuleExports(filePath, expectedExports);
}

// Test main dva module
function testDvaModule() {
  const filePath = path.join(__dirname, 'packages/modernx/src/index.js');
  const expectedExports = [
    'connect',
    'dynamic',
    'routerV6Compat'
  ];
  
  return testModuleExports(filePath, expectedExports);
}

// Test dva-core module
function testDvaCoreModule() {
  const filePath = path.join(__dirname, 'packages/modernx-core/src/index.js');
  const expectedExports = [
    'create',
    'saga',
    'utils'
  ];
  
  return testModuleExports(filePath, expectedExports);
}

// Test package.json dependencies
function testPackageDependencies() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    const pkg = JSON.parse(content);
    
    const requiredDeps = ['react', 'react-dom'];
    const missingDeps = [];
    
    requiredDeps.forEach(dep => {
      if (!pkg.devDependencies || !pkg.devDependencies[dep]) {
        missingDeps.push(dep);
      }
    });
    
    if (missingDeps.length === 0) {
      console.log('✅ package.json: All required dependencies present');
      return true;
    } else {
      console.log(`❌ package.json: Missing dependencies: ${missingDeps.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error testing package.json: ${error.message}`);
    return false;
  }
}

// Test examples structure
function testExamplesStructure() {
  const examplesDir = path.join(__dirname, 'examples');
  const requiredExamples = [
    'react18-concurrent',
    'react18-batching',
    'react18-strict-mode',
    'react-router-v6'
  ];
  
  const missingExamples = [];
  
  requiredExamples.forEach(example => {
    const examplePath = path.join(examplesDir, example);
    if (!fs.existsSync(examplePath)) {
      missingExamples.push(example);
    }
  });
  
  if (missingExamples.length === 0) {
    console.log('✅ Examples: All required examples present');
    return true;
  } else {
    console.log(`❌ Examples: Missing examples: ${missingExamples.join(', ')}`);
    return false;
  }
}

// Run all module tests
function runModuleTests() {
  const tests = [
    testReact18Utils,
    testRouterV6Compat,
    testDvaModule,
    testDvaCoreModule,
    testPackageDependencies,
    testExamplesStructure
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
  
  console.log('\n📊 Module Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All module tests passed! React 18 upgrade structure is correct.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some module tests failed.');
    process.exit(1);
  }
}

// Run tests
runModuleTests();
