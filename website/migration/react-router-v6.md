# React Router v6 Migration

This guide helps you migrate React Router from v5 to v6 while using ModernX for state management.

## Overview

React Router v6 introduced significant changes that affect how state management integrates with routing. This guide covers the migration process.

## Key Changes in React Router v6

| Feature | v5 | v6 |
|---------|----|----|
| Component | `<Route>` with component prop | `<Route>` with element prop |
| History | useHistory() | useNavigate() |
| Params | useParams() | useParams() (same) |
| Location | useLocation() | useLocation() (same) |
| Switch | `<Switch>` | `<Routes>` |
| Nested Routes | Nested components | Nested `<Routes>` |

## Migration Steps

### 1. Update Dependencies

```bash
npm install react-router-dom@6
npm remove react-router-dom@5
```

### 2. Router Setup Migration

#### React Router v5
```javascript
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/users/:id" component={UserPage} />
        <Route path="/posts" component={PostList} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
```

#### React Router v6
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Navigation Migration

#### React Router v5
```javascript
import { useHistory } from 'react-router-dom';

function UserComponent() {
  const history = useHistory();
  
  const handleNavigate = () => {
    history.push('/users/123');
    history.goBack();
    history.replace('/login');
  };
  
  return <button onClick={handleNavigate}>Navigate</button>;
}
```

#### React Router v6
```javascript
import { useNavigate } from 'react-router-dom';

function UserComponent() {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate('/users/123');
    navigate(-1); // go back
    navigate('/login', { replace: true });
  };
  
  return <button onClick={handleNavigate}>Navigate</button>;
}
```

### 4. ModernX Integration

#### State-Driven Navigation
```javascript
import { useModel } from 'modernx-core';
import { useNavigate } from 'react-router-dom';

const authModel = {
  name: 'auth',
  state: {
    isAuthenticated: false,
    user: null,
    redirectPath: null
  },
  reducers: {
    login: (state, payload) => ({
      ...state,
      isAuthenticated: true,
      user: payload
    }),
    logout: (state) => ({
      ...state,
      isAuthenticated: false,
      user: null
    }),
    setRedirectPath: (state, payload) => ({
      ...state,
      redirectPath: payload
    })
  },
  effects: {
    async loginWithRedirect(credentials) {
      try {
        const user = await api.login(credentials);
        this.login(user);
        
        // Redirect after successful login
        const redirectPath = this.getState().redirectPath || '/';
        this.setRedirectPath(null);
        
        // Navigate will be handled by component
        return { success: true, redirectPath };
      } catch (error) {
        return { success: false, error };
      }
    }
  }
};

function ProtectedRoute({ children }) {
  const [authState, authDispatch] = useModel('auth');
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    if (!authState.isAuthenticated) {
      // Save the attempted location for redirect after login
      authDispatch('setRedirectPath', location.pathname);
      navigate('/login');
    }
  }, [authState.isAuthenticated, authDispatch, navigate, location]);
  
  if (!authState.isAuthenticated) {
    return null; // Will redirect
  }
  
  return children;
}

function LoginPage() {
  const [authState, authDispatch] = useModel('auth');
  const navigate = useNavigate();
  
  const handleLogin = async (credentials) => {
    const result = await authDispatch('loginWithRedirect', credentials);
    
    if (result.success) {
      navigate(result.redirectPath);
    } else {
      alert('Login failed: ' + result.error.message);
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin({
        email: e.target.email.value,
        password: e.target.password.value
      });
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 5. Nested Routes Migration

#### React Router v5
```javascript
function UserPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>User {id}</h1>
      <Switch>
        <Route exact path="/users/:id" component={UserProfile} />
        <Route path="/users/:id/posts" component={UserPosts} />
        <Route path="/users/:id/settings" component={UserSettings} />
      </Switch>
    </div>
  );
}
```

#### React Router v6
```javascript
function UserPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>User {id}</h1>
      <Routes>
        <Route index element={<UserProfile />} />
        <Route path="posts" element={<UserPosts />} />
        <Route path="settings" element={<UserSettings />} />
      </Routes>
    </div>
  );
}

// Or use nested routes in main router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/:id" element={<UserPage />}>
          <Route index element={<UserProfile />} />
          <Route path="posts" element={<UserPosts />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 6. Route State Management

#### ModernX Model for Route State
```javascript
const routeModel = {
  name: 'route',
  state: {
    currentPath: '/',
    previousPath: null,
    routeParams: {},
    searchParams: {},
    navigationHistory: []
  },
  reducers: {
    setCurrentRoute: (state, payload) => ({
      ...state,
      previousPath: state.currentPath,
      currentPath: payload.pathname,
      routeParams: payload.params,
      searchParams: Object.fromEntries(new URLSearchParams(payload.search))
    }),
    addToHistory: (state, payload) => ({
      ...state,
      navigationHistory: [...state.navigationHistory, payload]
    })
  }
};

// Hook to sync router state with ModernX
function useRouterSync() {
  const [routeState, routeDispatch] = useModel('route');
  const location = useLocation();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    routeDispatch('setCurrentRoute', {
      pathname: location.pathname,
      search: location.search,
      params: useParams()
    });
    
    routeDispatch('addToHistory', {
      pathname: location.pathname,
      timestamp: Date.now()
    });
  }, [location, routeDispatch]);
  
  const customNavigate = React.useCallback((to, options) => {
    navigate(to, options);
  }, [navigate]);
  
  return {
    ...routeState,
    navigate: customNavigate,
    location
  };
}

// Usage in components
function NavigationComponent() {
  const { currentPath, navigationHistory, navigate } = useRouterSync();
  
  return (
    <nav>
      <p>Current: {currentPath}</p>
      <p>History: {navigationHistory.length} pages</p>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate('/')}>Home</button>
    </nav>
  );
}
```

### 7. Data Loading with Routes

#### Route-based Data Loading
```javascript
const postsModel = {
  name: 'posts',
  state: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null
  },
  reducers: {
    setPosts: (state, payload) => ({ ...state, posts: payload }),
    setCurrentPost: (state, payload) => ({ ...state, currentPost: payload }),
    setLoading: (state, payload) => ({ ...state, loading: payload }),
    setError: (state, payload) => ({ ...state, error: payload })
  },
  effects: {
    async fetchPosts() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const posts = await api.fetchPosts();
        this.setPosts(posts);
      } catch (error) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    },
    
    async fetchPost(id) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const post = await api.fetchPost(id);
        this.setCurrentPost(post);
      } catch (error) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    }
  }
};

// Route loader component
function PostListLoader() {
  const [postsState, postsDispatch] = useModel('posts');
  
  React.useEffect(() => {
    postsDispatch('fetchPosts');
  }, [postsDispatch]);
  
  if (postsState.loading) return <div>Loading posts...</div>;
  if (postsState.error) return <div>Error: {postsState.error}</div>;
  
  return <PostList posts={postsState.posts} />;
}

function PostLoader() {
  const { id } = useParams();
  const [postsState, postsDispatch] = useModel('posts');
  
  React.useEffect(() => {
    postsDispatch('fetchPost', id);
  }, [id, postsDispatch]);
  
  if (postsState.loading) return <div>Loading post...</div>;
  if (postsState.error) return <div>Error: {postsState.error}</div>;
  if (!postsState.currentPost) return <div>Post not found</div>;
  
  return <Post post={postsState.currentPost} />;
}

// Routes with loaders
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostListLoader />} />
        <Route path="/posts/:id" element={<PostLoader />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Migration Checklist

- [ ] Update react-router-dom to v6
- [ ] Replace `<Switch>` with `<Routes>`
- [ ] Update `<Route>` component prop to element prop
- [ ] Replace `useHistory()` with `useNavigate()`
- [ ] Update nested route structure
- [ ] Test all navigation functionality
- [ ] Update ModernX integration if needed
- [ ] Test route-based state management

## Common Issues

### 1. Route Parameters
```javascript
// v5
const { id } = this.props.match.params;

// v6
const { id } = useParams();
```

### 2. Programmatic Navigation
```javascript
// v5
history.push('/path');
history.goBack();

// v6
navigate('/path');
navigate(-1);
```

### 3. Route Matching
```javascript
// v5
<Switch>
  <Route exact path="/" component={Home} />
</Switch>

// v6
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
```

## Benefits of Migration

1. **Better Performance**: Improved route matching
2. **Simpler API**: More intuitive navigation
3. **Better TypeScript**: Improved type support
4. **Nested Routes**: Better nested route handling
5. **Future Ready**: Active development and support

## Next Steps

1. Update dependencies
2. Update router configuration
3. Update navigation code
4. Test thoroughly
5. Update documentation

## Need Help?

- Check [React Router v6 Documentation](https://reactrouter.com/docs/en/v6)
- Review [ModernX Examples](../examples/)
- Open an issue on [GitHub](https://github.com/perlinson/modernx)
