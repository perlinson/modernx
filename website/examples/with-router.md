# React Router Integration

Example of integrating ModernX with React Router for navigation.

## Installation

```bash
npm install modernx modernx-core react-router-dom
```

## Setup

```javascript
import { createApp } from 'modernx';
import { Provider, useModel } from 'modernx-core';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Define models
const userModel = {
  name: 'user',
  state: {
    currentUser: null,
    isAuthenticated: false
  },
  reducers: {
    login: (state, payload) => ({
      ...state,
      currentUser: payload,
      isAuthenticated: true
    }),
    logout: (state) => ({
      ...state,
      currentUser: null,
      isAuthenticated: false
    })
  }
};

const postsModel = {
  name: 'posts',
  state: {
    posts: [],
    loading: false
  },
  reducers: {
    setPosts: (state, payload) => ({
      ...state,
      posts: payload
    }),
    setLoading: (state, payload) => ({
      ...state,
      loading: payload
    })
  },
  effects: {
    async fetchPosts() {
      this.setLoading(true);
      try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        this.setPosts(posts);
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

// Components
function HomePage() {
  const [postsState, postsDispatch] = useModel('posts');
  const navigate = useNavigate();
  
  React.useEffect(() => {
    postsDispatch('fetchPosts');
  }, [postsDispatch]);
  
  return (
    <div>
      <h1>Home</h1>
      {postsState.loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {postsState.posts.map(post => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LoginPage() {
  const [userDispatch] = useModel('user');
  const navigate = useNavigate();
  
  const handleLogin = () => {
    userDispatch('login', { id: 1, name: 'John Doe' });
    navigate('/');
  };
  
  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function PostPage({ postId }) {
  const [postsState] = useModel('posts');
  const post = postsState.posts.find(p => p.id === parseInt(postId));
  
  if (!post) return <div>Post not found</div>;
  
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

function App() {
  const [userState] = useModel('user');
  
  return (
    <Provider app={app}>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          {userState.isAuthenticated ? (
            <span>Welcome, {userState.currentUser.name}</span>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
```

## Key Features

1. **Route-based State Management**: Different models for different routes
2. **Navigation Integration**: Use state to control navigation
3. **Data Fetching**: Effects for async operations
4. **Authentication Flow**: User state management across routes

## Benefits

- **Separation of Concerns**: State management separated from routing logic
- **Reactive Updates**: UI automatically updates when state changes
- **Type Safety**: Full TypeScript support available
- **Testability**: Easy to test state and routing logic separately
