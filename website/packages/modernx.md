# modernx

ModernX 的主包，包含完整的状态管理功能和所有插件。

## 🎯 特性

- 🚀 **完整功能** - 包含所有 ModernX 功能
- 📦 **一体化** - 无需额外安装其他包
- 🔧 **开箱即用** - 零配置启动
- 🎨 **现代化** - 支持 React 18 并发特性
- 📊 **开发工具** - 集成 GUI 和 CLI
- 🔌 **插件生态** - 丰富的插件支持

## 🚀 快速开始

### 安装
```bash
npm install modernx
```

### 基础使用
```javascript
import { createApp } from 'modernx';

const app = createApp({
  models: [
    {
      namespace: 'count',
      state: 0,
      reducers: {
        add(state, { payload = 1 }) { return state + payload; },
        minus(state, { payload = 1 }) { return state - payload; }
      },
      effects: {
        *addAsync({ payload }, { put }) {
          yield new Promise(resolve => setTimeout(resolve, 1000));
          yield put({ type: 'add', payload });
        }
      }
    }
  ]
});

app.start('#root');
```

### React 组件使用
```javascript
import React from 'react';
import { connect } from 'modernx';

const Counter = ({ count, dispatch }) => {
  const handleAdd = () => dispatch({ type: 'count/add', payload: 1 });
  const handleMinus = () => dispatch({ type: 'count/minus', payload: 1 });
  const handleAddAsync = () => dispatch({ type: 'count/addAsync', payload: 1 });

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleAdd}>+</button>
      <button onClick={handleMinus}>-</button>
      <button onClick={handleAddAsync}>Add Async</button>
    </div>
  );
};

export default connect(({ count }) => ({ count }))(Counter);
```

## 📋 API 参考

### createApp
创建 ModernX 应用
```javascript
const app = createApp({
  // 模型配置
  models: [],
  
  // 初始状态
  initialState: {},
  
  // 插件配置
  plugins: [],
  
  // 中间件
  extraMiddlewares: [],
  
  // 增强器
  extraEnhancers: [],
  
  // 错误处理
  onError: (error, dispatch) => {},
  
  // 开发工具
  devTools: true
});
```

### app.model
添加模型
```javascript
app.model({
  namespace: 'user',
  state: {
    currentUser: null,
    loading: false
  },
  reducers: {
    setUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    }
  },
  effects: {
    *login({ payload }, { put, call }) {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const user = yield call(api.login, payload);
        yield put({ type: 'setUser', payload: user });
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // 监听路由变化
      return history.listen(({ pathname }) => {
        dispatch({ type: 'route/change', payload: pathname });
      });
    }
  }
});
```

### app.start
启动应用
```javascript
// 启动应用
app.start('#root');

// 获取 store
const store = app._store;

// 获取 history
const history = app._history;
```

## 🔧 核心概念

### Model
```javascript
const userModel = {
  namespace: 'user',
  
  // 状态
  state: {
    currentUser: null,
    loading: false,
    error: null
  },
  
  // 同步操作
  reducers: {
    setUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    }
  },
  
  // 异步操作
  effects: {
    *login({ payload }, { put, call, select }) {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const user = yield call(api.login, payload);
        yield put({ type: 'setUser', payload: user });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    }
  },
  
  // 订阅
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        dispatch({ type: 'route/change', payload: pathname });
      });
    }
  }
};
```

### Effects
```javascript
effects: {
  // 基础 effect
  *fetchData({ payload }, { put, call }) {
    const data = yield call(api.fetchData, payload);
    yield put({ type: 'setData', payload: data });
  },
  
  // 并发执行
  *fetchMultiple({ payload }, { put, call, all }) {
    const [users, posts] = yield all([
      call(api.fetchUsers),
      call(api.fetchPosts)
    ]);
    yield put({ type: 'setData', payload: { users, posts } });
  },
  
  // 条件执行
  *conditionalFetch({ payload }, { put, call, select }) {
    const state = yield select(state => state.data);
    if (!state[payload.id]) {
      const data = yield call(api.fetchData, payload);
      yield put({ type: 'setData', payload: data });
    }
  },
  
  // 错误处理
  *fetchWithErrorHandling({ payload }, { put, call }) {
    try {
      const data = yield call(api.fetchData, payload);
      yield put({ type: 'setData', payload: data });
    } catch (error) {
      yield put({ type: 'setError', payload: error.message });
    }
  }
}
```

### Subscriptions
```javascript
subscriptions: {
  // 键盘事件
  setup({ dispatch }) {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        dispatch({ type: 'submit' });
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  },
  
  // 定时器
  timer({ dispatch }) {
    return setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
  },
  
  // WebSocket
  websocket({ dispatch }) {
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch({ type: 'websocket/message', payload: data });
    };
    
    return () => {
      ws.close();
    };
  }
}
```

## 🔌 插件系统

### 内置插件
```javascript
import { createApp } from 'modernx';
import immer from 'modernx-immer';
import loading from 'modernx-loading';
import logger from 'modernx-logger';

const app = createApp({
  plugins: [
    immer(),      // Immer 集成
    loading(),   // Loading 状态管理
    logger()      // 日志记录
  ]
});
```

### 自定义插件
```javascript
const myPlugin = {
  name: 'my-plugin',
  
  // 初始化
  init: (options) => {
    console.log('Plugin initialized:', options);
  },
  
  // 中间件
  middleware: (store) => (next) => (action) => {
    console.log('Plugin middleware:', action);
    return next(action);
  },
  
  // Store 增强
  enhanceStore: (store) => {
    store.myMethod = () => {
      console.log('Plugin method');
    };
    return store;
  }
};

const app = createApp({
  plugins: [myPlugin]
});
```

## 🎨 React 18 支持

### useTransition
```javascript
import { useModernXTransition } from 'modernx/react18';

function AsyncComponent() {
  const [isPending, startTransition] = useModernXTransition();
  
  const handleClick = () => {
    startTransition(() => {
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

### useDeferredValue
```javascript
import { useModernXDeferredValue } from 'modernx/react18';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useModernXDeferredValue(searchTerm);
  
  useEffect(() => {
    dispatch({ type: 'search', payload: deferredSearchTerm });
  }, [deferredSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 自动批处理
```javascript
// React 18 会自动批处理这些更新
function handleClick() {
  dispatch({ type: 'increment' });
  dispatch({ type: 'updateUI' });
  dispatch({ type: 'logAction' });
  // 只会触发一次重渲染
}
```

## 📊 开发工具

### GUI 集成
```javascript
import { createApp } from 'modernx';

const app = createApp({
  // 启用 GUI 集成
  gui: {
    port: 3000,
    autoOpen: true
  },
  models: [
    // 你的模型
  ]
});

// 启动 GUI
npx modernx-gui
```

### CLI 工具
```bash
# 创建项目
npx modernx-cli create my-app

# 生成模型
npx modernx-cli generate model user

# 启动开发服务器
npx modernx-cli dev
```

### Logger 集成
```javascript
import { createApp } from 'modernx';

const app = createApp({
  plugins: [
    // 启用日志记录
    logger({
      collapsed: true,
      duration: true,
      timestamp: true
    })
  ]
});
```

## 🎯 最佳实践

### 1. 模型设计
```javascript
// 使用命名空间
const userModel = {
  namespace: 'user',
  
  // 状态扁平化
  state: {
    currentUser: null,
    loading: false,
    error: null
  },
  
  // 纯函数 reducers
  reducers: {
    setUser: (state, { payload }) => ({ ...state, currentUser: payload }),
    setLoading: (state, { payload }) => ({ ...state, loading: payload })
  },
  
  // 异步 effects
  effects: {
    *login({ payload }, { put, call }) {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const user = yield call(api.login, payload);
        yield put({ type: 'setUser', payload: user });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    }
  }
};
```

### 2. 组件连接
```javascript
// 使用 connect 连接组件
const UserComponent = connect(
  // 选择器
  ({ user, loading }) => ({ user, loading }),
  // action creators
  { login, logout }
)(({ user, loading, login, logout }) => {
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : user ? (
        <div>Welcome, {user.name}!</div>
      ) : (
        <button onClick={() => login({ username: 'admin' })}>
          Login
        </button>
      )}
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
});
```

### 3. 错误处理
```javascript
const app = createApp({
  onError: (error, dispatch) => {
    console.error('Global error:', error);
    dispatch({ type: 'global/error', payload: error.message });
  }
});
```

### 4. 性能优化
```javascript
// 使用 reselect 进行选择器优化
import { createSelector } from 'reselect';

const selectUsers = state => state.users;
const selectPosts = state => state.posts;

const selectUsersWithPosts = createSelector(
  [selectUsers, selectPosts],
  (users, posts) => {
    return users.map(user => ({
      ...user,
      posts: posts.filter(post => post.authorId === user.id)
    }));
  }
);
```

## 🧪 测试

### 测试 Model
```javascript
import { getUserModel } from './models/user';

describe('userModel', () => {
  let model;
  
  beforeEach(() => {
    model = getUserModel();
  });
  
  it('should have correct namespace', () => {
    expect(model.namespace).toBe('user');
  });
  
  it('should handle setUser reducer', () => {
    const state = { currentUser: null };
    const action = { type: 'setUser', payload: { id: 1, name: 'John' } };
    const newState = model.reducers.setUser(state, action);
    
    expect(newState.currentUser).toEqual({ id: 1, name: 'John' });
  });
});
```

### 测试 Effects
```javascript
import { getUserModel } from './models/user';

describe('userModel effects', () => {
  let model, dispatch, call, put;
  
  beforeEach(() => {
    model = getUserModel();
    dispatch = jest.fn();
    call = jest.fn();
    put = jest.fn();
  });
  
  it('should handle login effect', async () => {
    const mockUser = { id: 1, name: 'John' };
    call.mockResolvedValue(mockUser);
    
    const gen = model.effects.login({ payload: { username: 'john' } }, { put, call });
    
    expect(gen.next().value).toEqual(put({ type: 'setLoading', payload: true }));
    expect(call).toHaveBeenCalledWith(api.login, { username: 'john' });
    
    const result = gen.next(mockUser).value;
    expect(result).toEqual(put({ type: 'setUser', payload: mockUser }));
    
    expect(gen.next().value).toEqual(put({ type: 'setLoading', payload: false }));
    expect(gen.next().done).toBe(true);
  });
});
```

## 🚀 版本历史

- **v1.1.1** - 修复 React 18 兼容性问题
- **v1.1.0** - 添加 React 18 并发特性支持
- **v1.0.0** - 初始版本

## 📞 支持

- 📖 [完整文档](https://github.com/perlinson/modernx)
- 🐛 [问题反馈](https://github.com/perlinson/modernx/issues)
- 💬 [讨论区](https://github.com/perlinson/modernx/discussions)

---

**🚀 让 React 开发更加现代化！**
