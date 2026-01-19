# React 18 Migration

This guide helps you migrate your ModernX application to React 18 and take advantage of concurrent features.

## Overview

React 18 introduces concurrent rendering, automatic batching, and new APIs that work seamlessly with ModernX.

## Key React 18 Features

| Feature | Description | ModernX Integration |
|---------|-------------|---------------------|
| Concurrent Rendering | Interruptible rendering for better UX | Automatic with ModernX |
| Automatic Batching | Multiple state updates batched together | Works with model updates |
| useTransition | Mark non-urgent updates | Can wrap model dispatches |
| useDeferredValue | Defer non-critical UI updates | Useful for large state |
| Suspense Improvements | Better loading states | Works with async effects |

## Migration Steps

### 1. Update Dependencies

```bash
npm install react@18 react-dom@18
npm install --save-dev @types/react@18 @types/react-dom@18
```

### 2. Update ReactDOM

#### React 17
```javascript
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

#### React 18
```javascript
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```

### 3. ModernX with React 18

#### Basic Setup
```javascript
import { createApp } from 'modernx';
import { Provider } from 'modernx-core';
import { createRoot } from 'react-dom/client';

// ModernX models work seamlessly with React 18
const userModel = {
  name: 'user',
  state: {
    currentUser: null,
    loading: false
  },
  reducers: {
    setCurrentUser: (state, payload) => ({
      ...state,
      currentUser: payload
    }),
    setLoading: (state, payload) => ({
      ...state,
      loading: payload
    })
  },
  effects: {
    async login(credentials) {
      this.setLoading(true);
      try {
        const user = await api.login(credentials);
        this.setCurrentUser(user);
      } finally {
        this.setLoading(false);
      }
    }
  }
};

const app = createApp({
  models: [userModel]
});

function App() {
  return (
    <Provider app={app}>
      <MyApp />
    </Provider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```

### 4. Concurrent Features with ModernX

#### useTransition with Model Updates
```javascript
import { useModel } from 'modernx-core';
import { useTransition } from 'react';

function SearchComponent() {
  const [searchState, searchDispatch] = useModel('search');
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (query) => {
    // Mark search as non-urgent
    startTransition(() => {
      searchDispatch('performSearch', query);
    });
  };
  
  return (
    <div>
      <input 
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <div>Searching...</div>}
      <SearchResults results={searchState.results} />
    </div>
  );
}

const searchModel = {
  name: 'search',
  state: {
    query: '',
    results: [],
    loading: false
  },
  reducers: {
    setQuery: (state, payload) => ({ ...state, query: payload }),
    setResults: (state, payload) => ({ ...state, results: payload }),
    setLoading: (state, payload) => ({ ...state, loading: payload })
  },
  effects: {
    async performSearch(query) {
      this.setLoading(true);
      this.setQuery(query);
      
      try {
        const results = await api.search(query);
        this.setResults(results);
      } finally {
        this.setLoading(false);
      }
    }
  }
};
```

#### useDeferredValue for Large State
```javascript
import { useModel } from 'modernx-core';
import { useDeferredValue, useMemo } from 'react';

function LargeDataComponent() {
  const [dataState] = useModel('largeData');
  
  // Defer expensive filtering
  const deferredData = useDeferredValue(dataState.items);
  
  const filteredItems = useMemo(() => {
    return deferredData.filter(item => item.active);
  }, [deferredData]);
  
  return (
    <div>
      <h1>Large Data List</h1>
      <VirtualizedList items={filteredItems} />
    </div>
  );
}

const largeDataModel = {
  name: 'largeData',
  state: {
    items: [],
    loading: false
  },
  reducers: {
    setItems: (state, payload) => ({ ...state, items: payload }),
    setLoading: (state, payload) => ({ ...state, loading: payload })
  },
  effects: {
    async fetchData() {
      this.setLoading(true);
      try {
        const items = await api.fetchLargeDataset();
        this.setItems(items);
      } finally {
        this.setLoading(false);
      }
    }
  }
};
```

### 5. Suspense with Async Effects

#### Async Effects with Suspense
```javascript
import { useModel } from 'modernx-core';
import { Suspense } from 'react';

// Resource for async data
function createDataResource(fetchFunction) {
  let data = null;
  let error = null;
  let promise = null;
  
  const load = async (...args) => {
    if (data !== null) return data;
    
    if (promise) {
      throw promise;
    }
    
    promise = fetchFunction(...args)
      .then(result => {
        data = result;
        promise = null;
      })
      .catch(err => {
        error = err;
        promise = null;
      });
    
    throw promise;
  };
  
  return { load, data, error };
}

const userResource = createDataResource(api.fetchUser);

function UserProfile({ userId }) {
  const [userState, userDispatch] = useModel('user');
  
  // Load user data with Suspense
  const user = userResource.load(userId);
  
  React.useEffect(() => {
    userDispatch('setCurrentUser', user);
  }, [user, userDispatch]);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
```

### 6. Automatic Batching

ModernX automatically benefits from React 18's automatic batching:

```javascript
function Component() {
  const [userState, userDispatch] = useModel('user');
  const [postState, postDispatch] = useModel('posts');
  
  const handleClick = () => {
    // These updates will be automatically batched
    userDispatch('updateUser', { name: 'John' });
    postDispatch('addPost', { title: 'New Post' });
    userDispatch('setLoading', false);
  };
  
  return <button onClick={handleClick}>Update Multiple Models</button>;
}
```

### 7. Concurrent Mode Best Practices

#### Priority-based Updates
```javascript
import { useModel } from 'modernx-core';
import { useTransition, startTransition } from 'react';

function PriorityComponent() {
  const [uiState, uiDispatch] = useModel('ui');
  const [dataState, dataDispatch] = useModel('data');
  
  // High priority - immediate UI feedback
  const handleUrgentUpdate = () => {
    uiDispatch('showLoading', true);
    // This will render immediately
  };
  
  // Low priority - data processing
  const handleDataUpdate = () => {
    startTransition(() => {
      dataDispatch('processLargeDataset');
      // This can be deferred
    });
  };
  
  return (
    <div>
      <button onClick={handleUrgentUpdate}>Urgent Update</button>
      <button onClick={handleDataUpdate}>Data Update</button>
    </div>
  );
}
```

#### Loading States with Transitions
```javascript
function LoadingAwareComponent() {
  const [isPending, startTransition] = useTransition();
  const [dataState, dataDispatch] = useModel('data');
  
  const handleAsyncOperation = async () => {
    startTransition(async () => {
      await dataDispatch('fetchData');
    });
  };
  
  return (
    <div>
      <button onClick={handleAsyncOperation}>
        Fetch Data
      </button>
      
      {/* Show loading only for non-urgent updates */}
      {isPending && (
        <div className="loading-overlay">
          Processing...
        </div>
      )}
      
      <DataList data={dataState.items} />
    </div>
  );
}
```

### 8. Performance Monitoring

#### React DevTools Integration
```javascript
import { useModel } from 'modernx-core';
import { useProfiler } from 'react';

function ProfiledComponent() {
  const [state, dispatch] = useModel('myModel');
  
  useProfiler('ProfiledComponent', {
    onRender: (id, phase, actualDuration) => {
      if (actualDuration > 16) {
        console.warn(`Slow render detected in ${id}: ${actualDuration}ms`);
      }
    }
  });
  
  return <div>Component content</div>;
}
```

## Migration Checklist

- [ ] Update React to v18
- [ ] Update ReactDOM to use createRoot
- [ ] Test concurrent features
- [ ] Implement useTransition where appropriate
- [ ] Add Suspense boundaries
- [ ] Monitor performance
- [ ] Update TypeScript types
- [ ] Test all functionality

## Common Issues

### 1. Strict Mode Warnings
```javascript
// React 18 Strict Mode runs effects twice in development
// Ensure effects are idempotent

React.useEffect(() => {
  const subscription = api.subscribe();
  return () => subscription.unsubscribe();
}, []); // This is fine - cleanup handles double runs
```

### 2. Concurrent Mode Compatibility
```javascript
// Avoid side effects during rendering
function BadComponent() {
  const [state, dispatch] = useModel('data');
  
  // Don't do this - causes issues with concurrent rendering
  if (state.needsUpdate) {
    dispatch('updateData'); // Side effect during render
  }
  
  return <div>Content</div>;
}

// Do this instead
function GoodComponent() {
  const [state, dispatch] = useModel('data');
  
  React.useEffect(() => {
    if (state.needsUpdate) {
      dispatch('updateData');
    }
  }, [state.needsUpdate, dispatch]);
  
  return <div>Content</div>;
}
```

## Benefits of React 18 with ModernX

1. **Better Performance**: Concurrent rendering improves UX
2. **Automatic Batching**: Multiple state updates optimized
3. **Better Loading States**: Improved Suspense support
4. **Priority-based Updates**: Control over rendering priority
5. **Future Ready**: Modern React features

## Performance Tips

1. **Use useTransition** for non-urgent updates
2. **Implement Suspense** for better loading states
3. **Monitor render performance** with React DevTools
4. **Optimize large datasets** with useDeferredValue
5. **Batch model updates** when possible

## Next Steps

1. Update dependencies
2. Update ReactDOM
3. Test concurrent features
4. Implement performance optimizations
5. Monitor and optimize

## Need Help?

- Check [React 18 Documentation](https://react.dev/blog/2022/03/29/react-v18)
- Review [ModernX Examples](../examples/)
- Open an issue on [GitHub](https://github.com/perlinson/modernx)
