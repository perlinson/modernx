import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { react18Utils } from 'dva';

// Component demonstrating proper useEffect cleanup
function CounterWithCleanup() {
  const [localCount, setLocalCount] = useState(0);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Setup interval
    intervalRef.current = setInterval(() => {
      setLocalCount(prev => prev + 1);
    }, 1000);
    
    // Cleanup function - required for Strict Mode
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once
  
  const handleIncrement = () => {
    dispatch({ type: 'counter/increment' });
  };
  
  const handleDecrement = () => {
    dispatch({ type: 'counter/decrement' });
  };
  
  const handleAsyncIncrement = () => {
    dispatch({ type: 'counter/asyncIncrement' });
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Counter with Proper Cleanup</h3>
      <p>Local Count (updates every second): {localCount}</p>
      <p>Global Count: {useSelector(state => state.counter.count)}</p>
      
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleIncrement} style={{ marginRight: '10px' }}>
          Increment
        </button>
        <button onClick={handleDecrement} style={{ marginRight: '10px' }}>
          Decrement
        </button>
        <button onClick={handleAsyncIncrement}>
          Async Increment
        </button>
      </div>
    </div>
  );
}

// Component demonstrating useDvaConcurrentState with Strict Mode
function ConcurrentCounter() {
  const {
    state,
    deferredState,
    isPending,
    dispatch
  } = react18Utils.useDvaConcurrentState('counter');
  
  const handleMultipleUpdates = () => {
    // Demonstrate batching with React 18
    react18Utils.batchUpdates(() => {
      dispatch({ type: 'counter/increment' });
      dispatch({ type: 'counter/increment' });
      dispatch({ type: 'counter/increment' });
    });
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '20px' }}>
      <h3>Concurrent Counter</h3>
      <p>Current Count: {state.count}</p>
      <p>Deferred Count: {deferredState.count}</p>
      <p>Is Pending: {isPending ? 'Yes' : 'No'}</p>
      
      <button onClick={handleMultipleUpdates}>
        Increment 3 Times (Batched)
      </button>
    </div>
  );
}

// Component demonstrating subscription cleanup
function SubscriptionMonitor() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Cleanup function for Strict Mode
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '20px' }}>
      <h3>Subscription Monitor</h3>
      <p>Network Status: {isOnline ? 'Online' : 'Offline'}</p>
      <p>This component properly cleans up event listeners.</p>
    </div>
  );
}

// Component demonstrating proper resource cleanup
function ResourceManager() {
  const [resources, setResources] = useState(new Set());
  const resourceIdRef = useRef(0);
  
  const allocateResource = () => {
    const id = ++resourceIdRef.current;
    const resource = {
      id,
      data: new Array(1000).fill(0).map(() => Math.random()),
      createdAt: Date.now()
    };
    
    setResources(prev => new Set(prev).add(resource));
    console.log(`Allocated resource ${id}`);
  };
  
  const releaseResource = (resource) => {
    setResources(prev => {
      const newSet = new Set(prev);
      newSet.delete(resource);
      return newSet;
    });
    console.log(`Released resource ${resource.id}`);
  };
  
  useEffect(() => {
    // Cleanup all resources on unmount
    return () => {
      resources.forEach(resource => {
        console.log(`Auto-cleaning resource ${resource.id} on unmount`);
      });
    };
  }, [resources]);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '20px' }}>
      <h3>Resource Manager</h3>
      <p>Active Resources: {resources.size}</p>
      
      <button onClick={allocateResource} style={{ marginRight: '10px' }}>
        Allocate Resource
      </button>
      
      <div style={{ marginTop: '10px' }}>
        {Array.from(resources).map(resource => (
          <div key={resource.id} style={{ padding: '5px', background: '#f0f0f0', margin: '2px 0' }}>
            Resource {resource.id} - {new Date(resource.createdAt).toLocaleTimeString()}
            <button 
              onClick={() => releaseResource(resource)}
              style={{ marginLeft: '10px' }}
            >
              Release
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main App component
function App() {
  const [showComponents, setShowComponents] = useState(true);
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>DVA + React 18 Strict Mode</h1>
      <p>This example demonstrates Strict Mode compatibility with dva framework.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowComponents(!showComponents)}>
          {showComponents ? 'Hide' : 'Show'} Components
        </button>
      </div>
      
      {showComponents && (
        <>
          <CounterWithCleanup />
          <ConcurrentCounter />
          <SubscriptionMonitor />
          <ResourceManager />
        </>
      )}
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0' }}>
        <h3>Strict Mode Features Tested:</h3>
        <ul>
          <li>Proper useEffect cleanup functions</li>
          <li>Event listener cleanup</li>
          <li>Resource management and cleanup</li>
          <li>Subscription cleanup in dva models</li>
          <li>Concurrent features compatibility</li>
          <li>Double-rendering behavior handling</li>
        </ul>
        
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Open the browser console to see cleanup logs when components mount/unmount.
          In Strict Mode, components mount, unmount, and remount to detect cleanup issues.
        </p>
      </div>
    </div>
  );
}

export default connect()(App);
