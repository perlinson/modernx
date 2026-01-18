import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import dva, { react18Utils } from 'dva';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 1. Initialize dva app
const app = dva();

// 2. Define models with proper cleanup
app.model({
  namespace: 'counter',
  state: { count: 0 },
  reducers: {
    increment(state) {
      return { ...state, count: state.count + 1 };
    },
    decrement(state) {
      return { ...state, count: state.count - 1 };
    }
  },
  effects: {
    *asyncIncrement(action, { put, call }) {
      // Simulate async operation
      yield call(() => new Promise(resolve => setTimeout(resolve, 1000)));
      yield put({ type: 'increment' });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // Proper cleanup function
      const handleVisibilityChange = () => {
        if (document.hidden) {
          console.log('Page is hidden - pausing operations');
        } else {
          console.log('Page is visible - resuming operations');
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Return cleanup function for Strict Mode
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }
});

// 3. Start app
app.start();

// 4. Create React 18 root with Strict Mode
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={app._store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
