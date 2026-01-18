import React from 'react';
import { createRoot } from 'react-dom/client';
import dva, { routerV6Compat } from 'dva';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 1. Initialize dva app
const app = dva();

// 2. Define models
app.model({
  namespace: 'user',
  state: {
    currentUser: null,
    isAuthenticated: false,
    users: []
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload, isAuthenticated: !!payload };
    },
    saveUsers(state, { payload }) {
      return { ...state, users: payload };
    },
    logout(state) {
      return { ...state, currentUser: null, isAuthenticated: false };
    }
  },
  effects: {
    *login({ payload }, { put, call }) {
      // Simulate API call
      yield new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: 1,
        name: payload.username,
        email: `${payload.username}@example.com`
      };
      
      yield put({ type: 'saveCurrentUser', payload: user });
    },
    
    *fetchUsers(action, { put }) {
      // Simulate API call
      yield new Promise(resolve => setTimeout(resolve, 500));
      
      const users = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 2 === 0 ? 'admin' : 'user'
      }));
      
      yield put({ type: 'saveUsers', payload: users });
    }
  }
});

app.model({
  namespace: 'posts',
  state: {
    list: [],
    loading: false,
    currentPost: null
  },
  reducers: {
    savePosts(state, { payload }) {
      return { ...state, list: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    saveCurrentPost(state, { payload }) {
      return { ...state, currentPost: payload };
    }
  },
  effects: {
    *fetchPosts(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      
      // Simulate API call
      yield new Promise(resolve => setTimeout(resolve, 800));
      
      const posts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Post Title ${i + 1}`,
        content: `This is the content of post ${i + 1}`,
        author: `Author ${i + 1}`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString()
      }));
      
      yield put({ type: 'savePosts', payload: posts });
      yield put({ type: 'setLoading', payload: false });
    },
    
    *fetchPost({ payload: id }, { put, select }) {
      const posts = yield select(state => state.posts.list);
      const post = posts.find(p => p.id === parseInt(id));
      
      if (post) {
        yield put({ type: 'saveCurrentPost', payload: post });
      }
    }
  }
});

// 3. Start app
app.start();

// 4. Create React 18 root
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={app._store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
