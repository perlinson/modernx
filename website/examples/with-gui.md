# GUI Integration Example

Example of using ModernX GUI for debugging and development.

## Installation

```bash
npm install modernx modernx-core modernx-gui
```

## Basic GUI Setup

```javascript
import { createApp } from 'modernx';
import { Provider, useModel } from 'modernx-core';
import { ModernXGUI } from 'modernx-gui';

// Define models
const userModel = {
  name: 'user',
  state: {
    currentUser: null,
    preferences: {
      theme: 'light',
      language: 'en'
    }
  },
  reducers: {
    setCurrentUser: (state, payload) => ({
      ...state,
      currentUser: payload
    }),
    updatePreferences: (state, payload) => ({
      ...state,
      preferences: { ...state.preferences, ...payload }
    })
  },
  effects: {
    async login(credentials) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        
        if (!response.ok) throw new Error('Login failed');
        
        const user = await response.json();
        this.setCurrentUser(user);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    async logout() {
      await fetch('/api/logout', { method: 'POST' });
      this.setCurrentUser(null);
    }
  }
};

const postsModel = {
  name: 'posts',
  state: {
    posts: [],
    loading: false,
    error: null,
    filters: {
      category: 'all',
      search: ''
    }
  },
  reducers: {
    setPosts: (state, payload) => ({
      ...state,
      posts: payload
    }),
    setLoading: (state, payload) => ({
      ...state,
      loading: payload
    }),
    setError: (state, payload) => ({
      ...state,
      error: payload
    }),
    setFilters: (state, payload) => ({
      ...state,
      filters: { ...state.filters, ...payload }
    })
  },
  effects: {
    async fetchPosts() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const { filters } = this.getState();
        const params = new URLSearchParams();
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        
        const response = await fetch(`/api/posts?${params}`);
        const posts = await response.json();
        this.setPosts(posts);
      } catch (error) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    },
    
    async createPost(postData) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        });
        
        if (!response.ok) throw new Error('Failed to create post');
        
        const newPost = await response.json();
        const currentPosts = this.getState().posts;
        this.setPosts([...currentPosts, newPost]);
      } catch (error) {
        this.setError(error.message);
      } finally {
        this.setLoading(false);
      }
    }
  }
};

// Create app
const app = createApp({
  models: [userModel, postsModel]
});

// Application components
function LoginForm() {
  const [userDispatch] = useModel('user');
  const [credentials, setCredentials] = React.useState({
    email: '',
    password: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userDispatch('login', credentials);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

function UserProfile() {
  const [userState, userDispatch] = useModel('user');
  
  const handleLogout = () => {
    userDispatch('logout');
  };
  
  const handleThemeChange = (theme) => {
    userDispatch('updatePreferences', { theme });
  };
  
  return (
    <div>
      <h2>Welcome, {userState.currentUser.name}!</h2>
      <p>Email: {userState.currentUser.email}</p>
      
      <div>
        <h3>Preferences</h3>
        <div>
          <label>Theme:</label>
          <select 
            value={userState.preferences.theme}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

function PostList() {
  const [postsState, postsDispatch] = useModel('posts');
  
  React.useEffect(() => {
    postsDispatch('fetchPosts');
  }, [postsDispatch]);
  
  const handleFilterChange = (filters) => {
    postsDispatch('setFilters', filters);
    postsDispatch('fetchPosts');
  };
  
  const handleCreatePost = async (postData) => {
    try {
      await postsDispatch('createPost', postData);
    } catch (error) {
      alert('Failed to create post: ' + error.message);
    }
  };
  
  return (
    <div>
      <h2>Posts</h2>
      
      <div>
        <input
          type="text"
          placeholder="Search posts..."
          value={postsState.filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
        />
        <select
          value={postsState.filters.category}
          onChange={(e) => handleFilterChange({ category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="tech">Technology</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
      </div>
      
      {postsState.loading && <p>Loading posts...</p>}
      {postsState.error && <p>Error: {postsState.error}</p>}
      
      <ul>
        {postsState.posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <small>Category: {post.category}</small>
          </li>
        ))}
      </ul>
      
      <div>
        <h3>Create New Post</h3>
        <button onClick={() => handleCreatePost({
          title: 'Test Post',
          content: 'This is a test post created from the GUI example.',
          category: 'tech'
        })}>
          Create Test Post
        </button>
      </div>
    </div>
  );
}

function App() {
  const [userState] = useModel('user');
  
  return (
    <Provider app={app}>
      <div style={{ padding: '20px' }}>
        <h1>ModernX GUI Example</h1>
        
        {userState.currentUser ? (
          <UserProfile />
        ) : (
          <LoginForm />
        )}
        
        <PostList />
        
        {/* GUI Development Tools */}
        <ModernXGUI 
          app={app}
          position="bottom-right"
          defaultOpen={false}
          features={{
            stateInspector: true,
            actionLogger: true,
            modelExplorer: true,
            performanceMonitor: true
          }}
        />
      </div>
    </Provider>
  );
}

export default App;
```

## Advanced GUI Features

```javascript
import { ModernXGUI } from 'modernx-gui';

function AdvancedApp() {
  return (
    <Provider app={app}>
      <div>
        {/* Your app content */}
        <MyApp />
        
        {/* Advanced GUI Configuration */}
        <ModernXGUI 
          app={app}
          position="top-right"
          defaultOpen={true}
          theme="dark"
          features={{
            // State inspection
            stateInspector: {
              enabled: true,
              showDiff: true,
              allowStateEdit: true,
              persistState: true
            },
            
            // Action logging
            actionLogger: {
              enabled: true,
              maxEntries: 1000,
              showTimestamp: true,
              allowReplay: true,
              filterByModel: true
            },
            
            // Model exploration
            modelExplorer: {
              enabled: true,
              showModelGraph: true,
              showModelStats: true
            },
            
            // Performance monitoring
            performanceMonitor: {
              enabled: true,
              trackRenderTime: true,
              trackActionTime: true,
              trackMemoryUsage: true
            },
            
            // Development tools
            devTools: {
              enabled: true,
              showConsole: true,
              showNetwork: true,
              showStorage: true
            }
          }}
          onAction={(action) => {
            console.log('GUI Action:', action);
          }}
          onStateChange={(state) => {
            console.log('State change detected:', state);
          }}
        />
      </div>
    </Provider>
  );
}
```

## GUI Features

### 1. State Inspector
- **Real-time state viewing**: See current state of all models
- **State diff visualization**: Highlight changes between states
- **State editing**: Modify state directly for testing
- **State persistence**: Save and restore state snapshots

### 2. Action Logger
- **Action history**: View all dispatched actions
- **Action replay**: Replay actions to reproduce states
- **Action filtering**: Filter by model or action type
- **Performance metrics**: See action execution times

### 3. Model Explorer
- **Model graph**: Visualize model relationships
- **Model statistics**: View model usage statistics
- **Model documentation**: Inline model documentation

### 4. Performance Monitor
- **Render performance**: Track component render times
- **Action performance**: Monitor action execution
- **Memory usage**: Track memory consumption
- **Bottleneck detection**: Identify performance issues

## Development Workflow

1. **Development**: Keep GUI open during development
2. **Debugging**: Use state inspector to debug issues
3. **Testing**: Use action replay to test scenarios
4. **Optimization**: Use performance monitor for optimization
5. **Documentation**: Use model explorer for understanding

## Best Practices

1. **Disable in production**: Never include GUI in production builds
2. **Use environment variables**: Control GUI availability
3. **Secure sensitive data**: Filter sensitive information from GUI
4. **Performance awareness**: Monitor GUI impact on app performance
5. **Team collaboration**: Share GUI configurations with team

## Production Safety

```javascript
const isDevelopment = process.env.NODE_ENV === 'development';

function App() {
  return (
    <Provider app={app}>
      <MyApp />
      {isDevelopment && (
        <ModernXGUI 
          app={app}
          features={{
            // Limit features in development
            stateInspector: true,
            actionLogger: true,
            modelExplorer: false,
            performanceMonitor: false
          }}
        />
      )}
    </Provider>
  );
}
```
