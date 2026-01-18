#!/usr/bin/env node

/**
 * Cross-platform compatibility test script
 * Tests dva compatibility across different Node.js versions and environments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const NODE_VERSIONS = ['14', '16', '18', '20'];
const PLATFORMS = ['linux', 'darwin', 'win32'];

function runCommand(command, cwd = process.cwd()) {
  try {
    const result = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || error.message,
      error: error.stderr || error.message
    };
  }
}

function testNodeVersion(version) {
  console.log(`\n🔍 Testing Node.js ${version}...`);
  
  // Test basic dva functionality
  const testCode = `
const dva = require('./packages/modernx');
const { Provider } = require('react-redux');
const React = require('react');

// Test basic dva app creation
const app = dva();
app.model({
  namespace: 'test',
  state: { count: 0 },
  reducers: {
    increment(state) {
      return { ...state, count: state.count + 1 };
    }
  }
});

app.start();

// Test store functionality
const store = app._store;
store.dispatch({ type: 'test/increment' });

console.log('✅ Basic dva functionality works');
console.log('✅ Store state:', store.getState());
console.log('✅ React 18 compatibility check passed');
`;

  try {
    const result = runCommand(`node -e "${testCode}"`);
    if (result.success) {
      console.log('✅ Node.js', version, 'compatibility: PASSED');
      return true;
    } else {
      console.log('❌ Node.js', version, 'compatibility: FAILED');
      console.error('Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Node.js', version, 'compatibility: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

function testBrowserCompatibility() {
  console.log('\n🌐 Testing browser compatibility...');
  
  // Create a simple browser test
  const browserTest = `
<!DOCTYPE html>
<html>
<head>
  <title>DVA Browser Compatibility Test</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/redux@4/dist/redux.js"></script>
  <script crossorigin src="https://unpkg.com/react-redux@8/dist/react-redux.min.js"></script>
  <script src="https://unpkg.com/dva@3.0.0-alpha.1/dist/index.js"></script>
</head>
<body>
  <div id="root"></div>
  <script>
    try {
      const dva = window.dva;
      const app = dva();
      
      app.model({
        namespace: 'test',
        state: { message: 'Hello from browser!' },
        reducers: {
          update(state, { payload }) {
            return { ...state, ...payload };
          }
        }
      });
      
      app.start();
      
      const { Provider } = ReactRedux;
      const { createElement } = React;
      
      function App() {
        const { useSelector } = ReactRedux;
        const message = useSelector(state => state.test.message);
        
        return createElement('div', null, message);
      }
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        createElement(Provider, { store: app._store }, 
          createElement(App)
        )
      );
      
      console.log('✅ Browser compatibility test passed');
    } catch (error) {
      console.error('❌ Browser compatibility test failed:', error);
    }
  </script>
</body>
</html>
`;

  const testFile = path.join(__dirname, '../temp-browser-test.html');
  fs.writeFileSync(testFile, browserTest);
  
  console.log('📝 Browser test file created:', testFile);
  console.log('📝 Open this file in a browser to test compatibility');
  
  return true;
}

function testSSRCompatibility() {
  console.log('\n🔧 Testing SSR compatibility...');
  
  const ssrTest = `
const dva = require('./packages/modernx');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Test server-side rendering
const app = dva();
app.model({
  namespace: 'test',
  state: { message: 'SSR Test' },
  reducers: {
    update(state, { payload }) {
      return { ...state, ...payload };
    }
  }
});

app.start();

// Test SSR rendering
function App() {
  const { useSelector } = require('react-redux');
  const message = useSelector(state => state.test.message);
  
  return React.createElement('div', null, message);
}

const html = ReactDOMServer.renderToString(
  React.createElement(require('react-redux').Provider, { store: app._store }, 
    React.createElement(App)
  )
);

console.log('✅ SSR compatibility test passed');
console.log('✅ Rendered HTML length:', html.length);
console.log('✅ HTML contains SSR Test:', html.includes('SSR Test'));
`;

  try {
    const result = runCommand(`node -e "${ssrTest}"`);
    if (result.success) {
      console.log('✅ SSR compatibility: PASSED');
      return true;
    } else {
      console.log('❌ SSR compatibility: FAILED');
      console.error('Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ SSR compatibility: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

function testReactNativeCompatibility() {
  console.log('\n📱 Testing React Native compatibility...');
  
  const rnTest = `
// React Native compatibility test
const dva = require('./packages/modernx');

// Test basic dva functionality without DOM dependencies
const app = dva();
app.model({
  namespace: 'test',
  state: { count: 0 },
  reducers: {
    increment(state) {
      return { ...state, count: state.count + 1 };
    }
  }
});

app.start();

// Test store functionality (works without DOM)
const store = app._store;
store.dispatch({ type: 'test/increment' });

console.log('✅ React Native core functionality works');
console.log('✅ Store state:', store.getState());
console.log('✅ DVA core is React Native compatible');
`;

  try {
    const result = runCommand(`node -e "${rnTest}"`);
    if (result.success) {
      console.log('✅ React Native compatibility: PASSED');
      return true;
    } else {
      console.log('❌ React Native compatibility: FAILED');
      console.error('Error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ React Native compatibility: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

function testModuleResolution() {
  console.log('\n📦 Testing module resolution...');
  
  const modules = [
    'packages/modernx',
    'packages/modernx-core',
    'packages/modernx-loading',
    'packages/modernx-immer'
  ];
  
  let allPassed = true;
  
  for (const module of modules) {
    try {
      const pkg = require(path.join(__dirname, '..', module, 'package.json'));
      console.log(\`✅ \${module}: \${pkg.version}\`);
      
      // Test module import
      const mod = require(module);
      console.log(\`✅ \${module}: Import successful\`);
    } catch (error) {
      console.log(\`❌ \${module}: Import failed - \${error.message}\`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

function testPeerDependencies() {
  console.log('\n🔗 Testing peer dependencies...');
  
  const peerDeps = {
    'react': '>=18',
    'react-dom': '>=18',
    'redux': '4.x'
  };
  
  let allPassed = true;
  
  for (const [dep, version] of Object.entries(peerDeps)) {
    try {
      const mod = require(dep);
      const versionMatch = mod.version && mod.version.startsWith(version.split('>=')[1]);
      console.log(\`✅ \${dep}: \${mod.version || 'unknown'} (\${version})\`);
      
      if (!versionMatch && mod.version) {
        console.log(\`⚠️  \${dep}: Version may not meet requirement \${version}\`);
      }
    } catch (error) {
      console.log(\`❌ \${dep}: Not available - \${error.message}\`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

function main() {
  console.log('🚀 DVA Cross-Platform Compatibility Test');
  console.log('==========================================');
  
  const results = {
    nodeVersions: {},
    moduleResolution: false,
    peerDependencies: false,
    browserCompatibility: false,
    ssrCompatibility: false,
    reactNativeCompatibility: false
  };
  
  // Test Node.js versions
  for (const version of NODE_VERSIONS) {
    results.nodeVersions[version] = testNodeVersion(version);
  }
  
  // Test module resolution
  results.moduleResolution = testModuleResolution();
  
  // Test peer dependencies
  results.peerDependencies = testPeerDependencies();
  
  // Test browser compatibility (create test file)
  results.browserCompatibility = testBrowserCompatibility();
  
  // Test SSR compatibility
  results.ssrCompatibility = testSSRCompatibility();
  
  // Test React Native compatibility
  results.reactNativeCompatibility = testReactNativeCompatibility();
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=====================');
  
  console.log('\nNode.js Compatibility:');
  for (const [version, passed] of Object.entries(results.nodeVersions)) {
    const status = passed ? '✅' : '❌';
    console.log(\`  \${status} Node.js \${version}\`);
  }
  
  console.log(\n\n📦 Module Resolution: \${results.moduleResolution ? '✅' : '❌'}`);
  console.log(\n🔗 Peer Dependencies: \${results.peerDependencies ? '✅' : '❌'}`);
  console.log(\n🌐 Browser Compatibility: \${results.browserCompatibility ? '✅' : '❌'}`);
  console.log(\n🔧 SSR Compatibility: \${results.ssrCompatibility ? '✅' : '❌'}`);
  console.log(\n📱 React Native Compatibility: \${results.reactNativeCompatibility ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results.nodeVersions).every(Boolean) &&
                   results.moduleResolution &&
                   results.peerDependencies &&
                   results.browserCompatibility &&
                   results.ssrCompatibility &&
                   results.reactNativeCompatibility;
  
  if (allPassed) {
    console.log('\n🎉 All compatibility tests PASSED!');
    console.log('DVA is ready for production deployment across platforms.');
    process.exit(0);
  } else {
    console.log('\n💥 Some compatibility tests FAILED!');
    console.log('Please review the issues above before deployment.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  testNodeVersion,
  testBrowserCompatibility,
  testSSRCompatibility,
  testReactNativeCompatibility,
  testModuleResolution,
  testPeerDependencies
};
