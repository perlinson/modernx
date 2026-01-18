/**
 * dva-react18 项目入口文件
 * React 18 enhanced dva framework
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import app from './app';

// React 18 的新渲染方式
const root = ReactDOM.createRoot(document.getElementById('root'));

// 启动 dva 应用
const App = () => (
  <Provider store={app._store}>
    <div>
      <h1>Welcome to dva-react18!</h1>
      <p>This project includes React 18 concurrent features.</p>
      <ConcurrentExample />
    </div>
  </Provider>
);

// React 18 Strict Mode 支持
import { StrictMode } from 'react';

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
