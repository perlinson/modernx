/**
 * dva-react18 React 18 并发特性演示项目入口
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import app from './app';
import UseTransitionExample from './concurrent-examples/UseTransitionExample';
import UseDeferredValueExample from './concurrent-examples/UseDeferredValueExample';
import AutomaticBatchingExample from './concurrent-examples/AutomaticBatchingExample';

// React 18 的新渲染方式
const root = ReactDOM.createRoot(document.getElementById('root'));

// 启动 dva 应用
const App = () => (
  <Provider store={app._store}>
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 dva-react18 React 18 并发特性演示</h1>
      <p>这个项目展示了 React 18 的并发特性与 dva 框架的集成。</p>
      
      <div style={{ marginTop: '30px' }}>
        <UseTransitionExample />
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <UseDeferredValueExample />
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <AutomaticBatchingExample />
      </div>
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
