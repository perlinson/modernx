import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { react18Utils } from 'dva';

// Performance monitoring component
function PerformanceMonitor() {
  const [renderCount, setRenderCount] = useState(0);
  const renderStartTime = useRef(Date.now());
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    renderStartTime.current = Date.now();
  });
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      <div>Render Count: {renderCount}</div>
      <div>Render Time: {Date.now() - renderStartTime.current}ms</div>
    </div>
  );
}

// Component demonstrating automatic batching
function BatchingDemo() {
  const {
    state,
    deferredState,
    isPending,
    dispatch
  } = react18Utils.useDvaConcurrentState('batch');
  
  const [localUpdates, setLocalUpdates] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  const handleMultipleUpdates = () => {
    console.log(`Before updates - Render count: ${renderCount.current}`);
    
    // These updates should be automatically batched in React 18
    dispatch({ type: 'increment' });
    dispatch({ type: 'increment' });
    dispatch({ type: 'increment' });
    dispatch({ type: 'addItem', payload: { id: 1, name: 'Test Item' } });
    dispatch({ type: 'addItem', payload: { id: 2, name: 'Another Item' } });
    
    // Local state updates should also be batched
    setLocalUpdates(prev => prev + 1);
    setLocalUpdates(prev => prev + 1);
    setLocalUpdates(prev => prev + 1);
    
    console.log(`After updates - Render count: ${renderCount.current}`);
  };
  
  const handleExplicitBatching = () => {
    // Explicit batching using React 18 utilities
    react18Utils.batchUpdates(() => {
      dispatch({ type: 'increment' });
      dispatch({ type: 'increment' });
      dispatch({ type: 'decrement' });
      dispatch({ type: 'increment' });
      setLocalUpdates(prev => prev + 1);
      setLocalUpdates(prev => prev + 1);
    });
  };
  
  const handleAsyncBatching = () => {
    // Async updates should also be batched
    setTimeout(() => {
      dispatch({ type: 'increment' });
      dispatch({ type: 'increment' });
      setLocalUpdates(prev => prev + 1);
    }, 0);
  };
  
  const handleEffectBatching = () => {
    dispatch({ type: 'batchUpdate' });
  };
  
  const handleReset = () => {
    dispatch({ type: 'reset' });
    setLocalUpdates(0);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Automatic Batching Demo</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>State Updates:</strong> {state.updates}</p>
        <p><strong>Counter:</strong> {state.counter}</p>
        <p><strong>Items:</strong> {state.items.length}</p>
        <p><strong>Local Updates:</strong> {localUpdates}</p>
        <p><strong>Is Pending:</strong> {isPending ? 'Yes' : 'No'}</p>
        <p><strong>Component Renders:</strong> {renderCount.current}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleMultipleUpdates} style={{ marginRight: '10px' }}>
          Multiple Updates (Auto Batched)
        </button>
        <button onClick={handleExplicitBatching} style={{ marginRight: '10px' }}>
          Explicit Batching
        </button>
        <button onClick={handleAsyncBatching} style={{ marginRight: '10px' }}>
          Async Batching
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleEffectBatching} style={{ marginRight: '10px' }}>
          Effect Batching (10+ updates)
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
      </div>
      
      <div>
        <h4>Items:</h4>
        {state.items.map(item => (
          <div key={item.id} style={{ padding: '2px 0', fontSize: '14px' }}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// Component for performance comparison
function PerformanceComparison() {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const dispatch = useDispatch();
  
  const runPerformanceTest = async (testType) => {
    setIsRunning(true);
    const startTime = performance.now();
    
    switch (testType) {
      case 'sequential':
        // Sequential updates (no batching)
        for (let i = 0; i < 100; i++) {
          dispatch({ type: 'increment' });
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        break;
        
      case 'batched':
        // Batched updates
        for (let i = 0; i < 100; i++) {
          dispatch({ type: 'increment' });
        }
        break;
        
      case 'explicit':
        // Explicit batching
        react18Utils.batchUpdates(() => {
          for (let i = 0; i < 100; i++) {
            dispatch({ type: 'increment' });
          }
        });
        break;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    setTestResults(prev => ({
      ...prev,
      [testType]: duration.toFixed(2)
    }));
    
    setIsRunning(false);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '20px' }}>
      <h3>Performance Comparison</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => runPerformanceTest('sequential')} 
          disabled={isRunning}
          style={{ marginRight: '10px' }}
        >
          Sequential (100 updates)
        </button>
        <button 
          onClick={() => runPerformanceTest('batched')} 
          disabled={isRunning}
          style={{ marginRight: '10px' }}
        >
          Auto-Batched (100 updates)
        </button>
        <button 
          onClick={() => runPerformanceTest('explicit')} 
          disabled={isRunning}
        >
          Explicit Batch (100 updates)
        </button>
      </div>
      
      {isRunning && <p>Running test...</p>}
      
      <div>
        <h4>Results (ms):</h4>
        <p>Sequential: {testResults.sequential || 'Not run'}</p>
        <p>Auto-Batched: {testResults.batched || 'Not run'}</p>
        <p>Explicit Batch: {testResults.explicit || 'Not run'}</p>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Expected Results:</strong></p>
        <p>• Sequential updates should be slowest (no batching)</p>
        <p>• Auto-batched updates should be faster (React 18 automatic batching)</p>
        <p>• Explicit batched updates should be fastest (optimal batching)</p>
      </div>
    </div>
  );
}

// Main App component
function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>DVA + React 18 Automatic Batching</h1>
      <p>This example demonstrates React 18 automatic batching with dva framework.</p>
      
      <PerformanceMonitor />
      <BatchingDemo />
      <PerformanceComparison />
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0' }}>
        <h3>Automatic Batching Features:</h3>
        <ul>
          <li>Multiple state updates are automatically batched in React 18</li>
          <li>Redux dispatch calls are batched with React state updates</li>
          <li>Async operations benefit from improved batching</li>
          <li>Explicit control with batchUpdates utility</li>
          <li>Performance improvements for complex state updates</li>
        </ul>
        
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Open the browser console to see batching behavior and performance metrics.
        </p>
      </div>
    </div>
  );
}

export default connect()(App);
