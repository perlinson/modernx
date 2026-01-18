import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { react18Utils } from 'dva';

// Component demonstrating useDvaConcurrentState
function UserList() {
  const {
    state,
    deferredState,
    isPending,
    dispatch
  } = react18Utils.useDvaConcurrentState('users');
  
  const handleSearch = (query) => {
    // Use transition for non-blocking search
    react18Utils.batchUpdates(() => {
      dispatch({ type: 'users/searchUsers', payload: query });
    });
  };
  
  const handleRefresh = () => {
    // Use transition for data refresh
    const [isPending, startTransition] = react18Utils.useDvaTransition();
    startTransition({ type: 'users/fetchUsers' });
  };
  
  return (
    <div>
      <h2>User List</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search users..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleRefresh} disabled={isPending}>
          {isPending ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {isPending && (
        <div style={{ color: '#666', marginBottom: '10px' }}>
          Updating...
        </div>
      )}
      
      <div>
        <p>Total users: {deferredState.list?.length || 0}</p>
        <ul style={{ maxHeight: '400px', overflow: 'auto' }}>
          {(deferredState.list || []).map(user => (
            <li key={user.id} style={{ padding: '4px 0' }}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Component demonstrating useDvaLoading
function LoadingIndicator() {
  const { isLoading, isEffectLoading, isTransitioning } = react18Utils.useDvaLoading([
    'users/fetchUsers',
    'users/searchUsers'
  ]);
  
  if (!isLoading) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc'
    }}>
      <div>Loading State:</div>
      <div>Effect Loading: {isEffectLoading ? 'Yes' : 'No'}</div>
      <div>Transitioning: {isTransitioning ? 'Yes' : 'No'}</div>
    </div>
  );
}

// Component demonstrating withDvaConcurrent HOC
const EnhancedUserStats = react18Utils.withDvaConcurrent(function UserStats({ state, isPending }) {
  const stats = useMemo(() => {
    if (!state.list) return { total: 0, avgLength: 0 };
    
    const total = state.list.length;
    const avgLength = state.list.reduce((sum, user) => sum + user.name.length, 0) / total;
    
    return { total, avgLength: avgLength.toFixed(2) };
  }, [state.list]);
  
  return (
    <div style={{ 
      background: '#f9f9f9', 
      padding: '15px', 
      borderRadius: '4px',
      marginBottom: '20px'
    }}>
      <h3>User Statistics</h3>
      <div>Total Users: {stats.total}</div>
      <div>Average Name Length: {stats.avgLength}</div>
      {isPending && <div style={{ color: '#666' }}>Updating stats...</div>}
    </div>
  );
}, {
  namespace: 'users',
  selector: state => state,
  deferState: true,
  showLoading: false
});

// Main App component
function App() {
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => {
    // Initial data fetch
    setMounted(true);
  }, []);
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>DVA + React 18 Concurrent Features</h1>
      <p>This example demonstrates React 18 concurrent features with dva framework.</p>
      
      {mounted && (
        <>
          <LoadingIndicator />
          <EnhancedUserStats />
          <UserList />
        </>
      )}
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0' }}>
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>useDvaConcurrentState - Combines dva state with React 18 concurrent features</li>
          <li>useDvaLoading - Manages loading states with transitions</li>
          <li>withDvaConcurrent - HOC for concurrent state management</li>
          <li>batchUpdates - Explicit batching control</li>
          <li>Deferred rendering for better performance</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
