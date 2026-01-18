import React from 'react';
import { createRoot } from 'react-dom/client';
import dva, { react18Utils } from 'dva';
import { Provider } from 'react-redux';
import App from './App';

// 1. Initialize dva app
const app = dva();

// 2. Define models for batch testing
app.model({
  namespace: 'batch',
  state: {
    counter: 0,
    items: [],
    updates: 0
  },
  reducers: {
    increment(state) {
      return { ...state, counter: state.counter + 1, updates: state.updates + 1 };
    },
    decrement(state) {
      return { ...state, counter: state.counter - 1, updates: state.updates + 1 };
    },
    addItem(state, { payload }) {
      return { 
        ...state, 
        items: [...state.items, payload], 
        updates: state.updates + 1 
      };
    },
    clearItems(state) {
      return { ...state, items: [], updates: state.updates + 1 };
    },
    reset(state) {
      return { ...state, counter: 0, items: [], updates: state.updates + 1 };
    }
  },
  effects: {
    *batchUpdate(action, { put, select }) {
      const state = yield select(state => state.batch);
      
      // Simulate multiple rapid updates
      for (let i = 0; i < 10; i++) {
        yield put({ type: 'increment' });
      }
      
      for (let i = 0; i < 5; i++) {
        yield put({ 
          type: 'addItem', 
          payload: { id: Date.now() + i, name: `Item ${i}` }
        });
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
    <App />
  </Provider>
);
