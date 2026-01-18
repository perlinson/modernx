# React Router v6 Migration Guide

This guide helps you migrate your modernx applications from React Router v5 to v6.

## Overview

React Router v6 introduces several breaking changes but provides better performance and a more intuitive API. modernx now supports React Router v6 while maintaining backward compatibility through compatibility utilities.

## Key Changes

### 1. Route Configuration

**Before (v5):**
```jsx
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/home" exact component={Home} />
      <Route path="/users/:id" component={UserProfile} />
      <Route render={() => <div>Not Found</div>} />
    </Switch>
  );
}
```

**After (v6):**
```jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/users/:id" element={<UserProfile />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}
```

### 2. Navigation

**Before (v5):**
```jsx
import { useHistory } from 'react-router-dom';

function MyComponent() {
  const history = useHistory();
  
  const handleClick = () => {
    history.push('/home');
    history.replace('/login');
    history.goBack();
  };
}
```

**After (v6):**
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/home');
    navigate('/login', { replace: true });
    navigate(-1); // go back
  };
}
```

### 3. Redirects

**Before (v5):**
```jsx
import { Redirect } from 'react-router-dom';

<Redirect to="/home" />
<Redirect from="/old-path" to="/new-path" />
```

**After (v6):**
```jsx
import { Navigate } from 'react-router-dom';

<Navigate to="/home" />
<Route path="/old-path" element={<Navigate to="/new-path" />} />
```

## modernx Compatibility Layer

modernx provides compatibility utilities to make migration easier:

### Using Compatibility Components

```jsx
import modernx, { routerV6Compat } from 'modernx';

// Use v5-style components with v6 under the hood
function App() {
  return (
    <routerV6Compat.RouterSwitch>
      <routerV6Compat.CompatRoute 
        path="/home" 
        component={Home} 
        exact 
      />
      <routerV6Compat.CompatRoute 
        path="/users/:id" 
        component={UserProfile} 
      />
    </routerV6Compat.RouterSwitch>
  );
}
```

### Using Compatibility Hooks

```jsx
import { routerV6Compat } from 'modernx';

function MyComponent() {
  // Use v5-style history hook
  const history = routerV6Compat.useCompatHistory();
  
  // Use v5-style route matching
  const match = routerV6Compat.useCompatRouteMatch('/users/:id');
  
  // Use query parameters helper
  const query = routerV6Compat.useCompatQuery();
  
  return (
    <div>
      <button onClick={() => history.push('/home')}>
        Go Home
      </button>
    </div>
  );
}
```

## Migration Strategy

### Step 1: Update Dependencies

```bash
npm install react-router-dom@6.8.0
npm install connected-react-router@6.9.0
```

### Step 2: Update Route Configuration

Replace `Switch` with `Routes` and `component` with `element`:

```jsx
// Before
<Switch>
  <Route path="/home" exact component={Home} />
</Switch>

// After
<Routes>
  <Route path="/home" element={<Home />} />
</Routes>
```

### Step 3: Update Navigation Logic

Replace `useHistory` with `useNavigate`:

```jsx
// Before
const history = useHistory();
history.push('/home');

// After
const navigate = useNavigate();
navigate('/home');
```

### Step 4: Update Links and Redirects

```jsx
// Before
<Redirect to="/home" />

// After
<Navigate to="/home" />
```

### Step 5: Use Compatibility Layer (Optional)

If you want to migrate gradually, use modernx's compatibility layer:

```jsx
import { routerV6Compat } from 'modernx';

// Keep using v5 patterns
const history = routerV6Compat.useCompatHistory();
```

## Complete Example

### Before Migration (v5)

```jsx
import modernx from 'modernx';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

const app = modernx();

app.model({
  namespace: 'user',
  state: { name: '' },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
});

function UserPage() {
  const history = useHistory();
  const user = useSelector(state => state.user);
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => history.push('/home')}>
        Home
      </button>
    </div>
  );
}

function App() {
  return (
    <Switch>
      <Route path="/user" component={UserPage} />
      <Route path="/home" component={HomePage} />
      <Redirect from="/" to="/home" />
    </Switch>
  );
}
```

### After Migration (v6)

```jsx
import modernx, { routerV6Compat } from 'modernx';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

const app = modernx();

app.model({
  namespace: 'user',
  state: { name: '' },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
});

function UserPage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => navigate('/home')}>
        Home
      </button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/user" element={<UserPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

// Or using compatibility layer for gradual migration
function CompatApp() {
  return (
    <routerV6Compat.RouterSwitch>
      <routerV6Compat.CompatRoute 
        path="/user" 
        component={UserPage} 
      />
      <routerV6Compat.CompatRoute 
        path="/home" 
        component={HomePage} 
      />
      <routerV6Compat.CompatRedirect 
        from="/" 
        to="/home" 
      />
    </routerV6Compat.RouterSwitch>
  );
}
```

## Common Issues and Solutions

### Issue: "component" prop not working
**Solution:** Use `element={<Component />}` instead of `component={Component}`

### Issue: useHistory is undefined
**Solution:** Use `useNavigate()` or `routerV6Compat.useCompatHistory()`

### Issue: Query parameters not working
**Solution:** Use `useSearchParams()` or `routerV6Compat.useCompatQuery()`

### Issue: activeClassName not working
**Solution:** Use `NavLink` instead of `Link` for active styling

## Testing Your Migration

1. **Run existing tests** to ensure functionality is preserved
2. **Test navigation** in your application
3. **Check route matching** for edge cases
4. **Verify redirects** work correctly
5. **Test deep linking** and browser back/forward buttons

## Getting Help

- Check the [React Router v6 documentation](https://reactrouter.com/docs/en/v6)
- Review modernx examples in the `examples/react-router-v6` directory
- Use the migration helper: `routerV6Compat.MigrationHelper.getMigrationTips()`

## Timeline

- **Phase 1:** Update dependencies and use compatibility layer
- **Phase 2:** Gradually migrate routes to v6 syntax
- **Phase 3:** Remove compatibility layer usage
- **Phase 4:** Optimize for v6 features

This migration ensures your modernx applications are ready for React 18 and future React versions.
