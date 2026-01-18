# 📦 使用 modernx-react18 示例

## 🚀 安装

```bash
npm install modernx-react18
```

## 📖 基本用法

### 1. 创建应用

```javascript
import { createApp } from 'modernx-react18';

const app = createApp({
  // 你的 models
});

app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    add(state, { payload }) {
      return state + payload;
    },
  },
  effects: {
    *addAsync({ payload }, { call, put }) {
      yield put({ type: 'add', payload });
    },
  },
});

app.start();

export default app._store;
```

### 2. 在组件中使用

```javascript
import React from 'react';
import { connect } from 'modernx-react18';

function Counter({ count, dispatch }) {
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch({ type: 'add', payload: 1 })}>
        Add
      </button>
      <button onClick={() => dispatch({ type: 'addAsync', payload: 2 })}>
        Add Async
      </button>
    </div>
  );
}

export default connect(({ count }) => ({ count }))(Counter);
```

## 🎯 React 18 新特性

### 1. 并发特性

```javascript
import { useModernXTransition } from 'modernx-react18/react18-utils';

function AsyncComponent() {
  const [isPending, startTransition] = useModernXTransition();
  
  const handleClick = () => {
    startTransition(() => {
      // 这些更新会被批处理，不会阻塞 UI
      dispatch({ type: 'fetchData' });
      dispatch({ type: 'updateUI' });
    });
  };
  
  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Loading...' : 'Fetch Data'}
    </button>
  );
}
```

### 2. 自动批处理

```javascript
import { batchUpdates } from 'modernx-react18/react18-utils';

function BatchComponent() {
  const handleClick = () => {
    // React 18 会自动批处理这些更新
    dispatch({ type: 'update1' });
    dispatch({ type: 'update2' });
    dispatch({ type: 'update3' });
    
    // 或者显式控制
    batchUpdates(() => {
      dispatch({ type: 'update4' });
      dispatch({ type: 'update5' });
    });
  };
  
  return <button onClick={handleClick}>Batch Updates</button>;
}
```

### 3. React Router v6 兼容

```javascript
import { RouterSwitch, CompatRoute, useCompatHistory } from 'modernx-react18/router-v6-compat';

function App() {
  const history = useCompatHistory();
  
  return (
    <RouterSwitch>
      <CompatRoute path="/" component={Home} exact />
      <CompatRoute path="/about" component={About} />
    </RouterSwitch>
  );
}
```

## 🔧 完整项目示例

### 项目结构

```
my-app/
├── src/
│   ├── index.js
│   ├── App.js
│   ├── models/
│   │   └── count.js
│   └── components/
│       └── Counter.js
├── package.json
└── README.md
```

### package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "modernx-react18": "^2.0.0-react18",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

### src/index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createApp } from 'modernx-react18';
import App from './App';

const app = createApp();

app.model({
  namespace: 'global',
  state: {
    user: null,
    loading: false,
  },
  reducers: {
    setUser(state, { payload }) {
      return { ...state, user: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
  },
  effects: {
    *login({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      // 模拟 API 调用
      yield call(delay, 1000);
      yield put({ type: 'setUser', payload: { name: payload.username } });
      yield put({ type: 'setLoading', payload: false });
    },
  },
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.start();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### src/App.js

```javascript
import React from 'react';
import { connect } from 'modernx-react18';
import { useModernXTransition } from 'modernx-react18/react18-utils';
import Counter from './components/Counter';

function App({ user, loading, dispatch }) {
  const [isPending, startTransition] = useModernXTransition();
  
  const handleLogin = () => {
    startTransition(() => {
      dispatch({ type: 'login', payload: { username: 'john' } });
    });
  };
  
  return (
    <div>
      <h1>modernx-react18 示例</h1>
      
      {user ? (
        <div>
          <p>欢迎, {user.name}!</p>
          <Counter />
        </div>
      ) : (
        <div>
          <button onClick={handleLogin} disabled={isPending}>
            {isPending ? '登录中...' : '登录'}
          </button>
        </div>
      )}
      
      {loading && <p>加载中...</p>}
    </div>
  );
}

export default connect(({ global }) => ({
  user: global.user,
  loading: global.loading,
}))(App);
```

### src/components/Counter.js

```javascript
import React from 'react';
import { connect } from 'modernx-react18';

function Counter({ count, dispatch }) {
  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={() => dispatch({ type: 'count/add', payload: 1 })}>
        +1
      </button>
      <button onClick={() => dispatch({ type: 'count/add', payload: -1 })}>
        -1
      </button>
      <button onClick={() => dispatch({ type: 'count/addAsync', payload: 5 })}>
        +5 (异步)
      </button>
    </div>
  );
}

export default connect(({ count }) => ({ count }))(Counter);
```

### src/models/count.js

```javascript
export default {
  namespace: 'count',
  state: 0,
  reducers: {
    add(state, { payload }) {
      return state + payload;
    },
  },
  effects: {
    *addAsync({ payload }, { call, put }) {
      yield call(delay, 500);
      yield put({ type: 'add', payload });
    },
  },
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## 🔄 从原 modernx 迁移

### 替换导入

```javascript
// 原来的导入
import modernx from 'modernx';

// 新的导入
import modernx from 'modernx-react18';

// 或者保持 API 兼容
import { createApp, connect } from 'modernx-react18';
```

### 更新 package.json

```json
{
  "dependencies": {
-   "modernx": "^2.6.0",
+   "modernx-react18": "^2.0.0-react18",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### 运行迁移

```bash
npm uninstall modernx
npm install modernx-react18
npm install
```

## 🎉 完成！

现在你可以在项目中使用 `modernx-react18` 了，享受 React 18 的所有新特性！

如果有任何问题，请查看 [PUBLISH_GUIDE.md](./PUBLISH_GUIDE.md) 或提交 Issue。
