import React from 'react';
import { createRoot } from 'react-dom/client';
import dva, { react18Utils } from 'dva';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 1. Initialize dva app
const app = dva();

// 2. Define models
app.model({
  namespace: 'users',
  state: {
    list: [],
    loading: false,
    searchQuery: ''
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    setSearchQuery(state, { payload }) {
      return { ...state, searchQuery: payload };
    }
  },
  effects: {
    *fetchUsers(action, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      
      // Simulate API call
      yield new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      }));
      
      yield put({ type: 'save', payload: { list: users, loading: false } });
    },
    
    *searchUsers({ payload: query }, { select, put }) {
      const state = yield select(state => state.users);
      const allUsers = state.list;
      
      const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      
      yield put({ type: 'save', payload: { searchQuery: query, list: filteredUsers } });
    }
  }
});

// 3. Start app
app.start();

// 4. Create React 18 root and render
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={app._store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
