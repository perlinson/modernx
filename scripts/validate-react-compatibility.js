#!/usr/bin/env node

/**
 * React Compatibility Validation Script
 * Validates modernx framework compatibility across React versions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REACT_VERSIONS = [
  { version: '16.14.0', label: 'React 16.14 (LTS)' },
  { version: '17.0.2', label: 'React 17.x' },
  { version: '18.2.0', label: 'React 18.x' }
];

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

function validateReactVersion(reactVersion) {
  console.log(`\n🔍 Testing React ${reactVersion}...`);
  
  // Create temporary package.json for testing
  const testPackageJson = {
    name: 'modernx-react-test',
    version: '1.0.0',
    dependencies: {
      react: reactVersion,
      'react-dom': reactVersion,
      modernx: 'file:./packages/modernx'
    },
    devDependencies: {
      '@testing-library/react': '^13.4.0',
      '@testing-library/jest-dom': '^5.16.5'
    }
  };
  
  const testDir = path.join(__dirname, '../temp-test');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(testDir, 'package.json'),
    JSON.stringify(testPackageJson, null, 2)
  );
  
  // Create a simple test file
  const testFile = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import modernx from 'modernx';

const TestComponent = () => <div data-testid="test">Hello MODERNX</div>;

describe('MODERNX React Compatibility', () => {
  test('should render with React ${reactVersion}', () => {
    const app = modernx();
    app.model({
      namespace: 'test',
      state: { message: 'Hello MODERNX' },
      effects: {
        *test(action, { put }) {
          yield put({ type: 'update', payload: action.payload });
        }
      },
      reducers: {
        update(state, { payload }) {
          return { ...state, ...payload };
        }
      }
    });
    
    const Component = () => {
      const { dispatch } = app._store;
      return (
        <div data-testid="test">
          Hello MODERNX - React ${reactVersion}
        </div>
      );
    };
    
    render(<Component />);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });
});
`;
  
  fs.writeFileSync(path.join(testDir, 'test.test.js'), testFile);
  
  // Run tests
  const installResult = runCommand('npm install', testDir);
  if (!installResult.success) {
    console.error(`❌ Failed to install dependencies for React ${reactVersion}`);
    console.error(installResult.error);
    return false;
  }
  
  const testResult = runCommand('npm test -- --passWithNoTests', testDir);
  if (!testResult.success) {
    console.error(`❌ Tests failed for React ${reactVersion}`);
    console.error(testResult.error);
    return false;
  }
  
  console.log(`✅ React ${reactVersion} compatibility validated`);
  return true;
}

function runPerformanceBenchmark() {
  console.log('\n⚡ Running performance benchmarks...');
  
  const benchmarkScript = `
const { performance } = require('perf_hooks');
const modernx = require('./packages/modernx');

// Benchmark modernx app creation and state updates
function benchmark() {
  const iterations = 1000;
  const app = modernx();
  
  app.model({
    namespace: 'benchmark',
    state: { count: 0 },
    reducers: {
      increment(state) {
        return { ...state, count: state.count + 1 };
      }
    }
  });
  
  app.start();
  
  // Benchmark state updates
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    app._store.dispatch({ type: 'benchmark/increment' });
  }
  const end = performance.now();
  
  return {
    iterations,
    duration: end - start,
    avgTime: (end - start) / iterations
  };
}

const result = benchmark();
console.log('Performance Benchmark Results:');
console.log(\`Iterations: \${result.iterations}\`);
console.log(\`Total Duration: \${result.duration.toFixed(2)}ms\`);
console.log(\`Average Time per Update: \${result.avgTime.toFixed(4)}ms\`);
`;
  
  fs.writeFileSync(path.join(__dirname, '../benchmark.js'), benchmarkScript);
  const benchmarkResult = runCommand('node benchmark.js');
  
  if (benchmarkResult.success) {
    console.log('✅ Performance benchmark completed');
    console.log(benchmarkResult.output);
    return true;
  } else {
    console.error('❌ Performance benchmark failed');
    console.error(benchmarkResult.error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting MODERNX React Compatibility Validation\n');
  
  const results = [];
  
  // Test each React version
  for (const { version, label } of REACT_VERSIONS) {
    const isValid = validateReactVersion(version);
    results.push({ version, label, isValid });
  }
  
  // Run performance benchmarks
  const performancePassed = runPerformanceBenchmark();
  
  // Generate report
  console.log('\n📊 Validation Report');
  console.log('==================');
  
  results.forEach(({ version, label, isValid }) => {
    const status = isValid ? '✅ PASS' : '❌ FAIL';
    console.log(\`\${status} \${label}\`);
  });
  
  console.log(\`\${performancePassed ? '✅ PASS' : '❌ FAIL'} Performance Benchmarks\`);
  
  const allPassed = results.every(r => r.isValid) && performancePassed;
  
  if (allPassed) {
    console.log('\n🎉 All compatibility tests passed!');
    process.exit(0);
  } else {
    console.log('\n💥 Some compatibility tests failed!');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { validateReactVersion, runPerformanceBenchmark };
