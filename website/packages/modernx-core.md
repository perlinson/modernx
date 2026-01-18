# modernx-core

ModernX 的核心库，提供轻量级的状态管理功能。

## 🎯 特性

- 🚀 **轻量级** - 核心功能，无额外依赖
- ⚡ **高性能** - 优化的状态更新机制
- 🔧 **可扩展** - 插件系统支持
- 📝 **TypeScript** - 完整的类型定义
- 🔄 **兼容性** - 与 Redux 生态兼容
- 🛠️ **开发友好** - 丰富的开发工具

## 🚀 快速开始

### 安装
```bash
npm install modernx-core
```

### 基础使用
```javascript
import { createStore, applyMiddleware } from 'modernx-core';
import logger from 'redux-logger';

// 创建 store
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(logger)
);

// 使用 store
store.dispatch({ type: 'INCREMENT', payload: 1 });
console.log(store.getState());
```

### 与 ModernX 集成
```javascript
import { createApp } from 'modernx';
import core from 'modernx-core';

const app = createApp({
  core: {
    // 核心配置
    immer: true,
    logger: true,
    devTools: true
  },
  models: [
    // 你的模型
  ]
});
```

## 📋 API 参考

### createStore
创建 Redux store
```javascript
import { createStore } from 'modernx-core';

const store = createStore(
  reducer,
  initialState,
  enhancer
);
```

### applyMiddleware
应用中间件
```javascript
import { applyMiddleware, createStore } from 'modernx-core';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const store = createStore(
  reducer,
  applyMiddleware(thunk, logger)
);
```

### combineReducers
合并 reducers
```javascript
import { combineReducers } from 'modernx-core';

const rootReducer = combineReducers({
  user: userReducer,
  counter: counterReducer,
  todos: todosReducer
});
```

### bindActionCreators
绑定 action creators
```javascript
import { bindActionCreators } from 'modernx-core';

const boundActions = bindActionCreators(
  { increment, decrement },
  dispatch
);
```

## 🔧 核心概念

### Store
```javascript
import { createStore } from 'modernx-core';

const store = createStore(reducer);

// 获取状态
const state = store.getState();

// 分发 action
store.dispatch({ type: 'INCREMENT' });

// 订阅状态变化
const unsubscribe = store.subscribe(() => {
  console.log('State updated:', store.getState());
});

// 取消订阅
unsubscribe();
```

### Reducer
```javascript
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
```

### Action
```javascript
// Action Creator
function increment(payload = 1) {
  return { type: 'INCREMENT', payload };
}

// 使用
store.dispatch(increment(5));
```

### Middleware
```javascript
// 自定义中间件
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

// 应用中间件
const store = createStore(
  reducer,
  applyMiddleware(loggerMiddleware)
);
```

## 🎯 高级功能

### 异步 Action
```javascript
import { createStore, applyMiddleware } from 'modernx-core';
import thunk from 'redux-thunk';

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

// 异步 action creator
function fetchData() {
  return async (dispatch, getState) => {
    dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error });
    }
  };
}

// 使用
store.dispatch(fetchData());
```

### 状态持久化
```javascript
import { createStore, applyMiddleware } from 'modernx-core';

// 持久化中间件
const persistMiddleware = store => next => action => {
  const result = next(action);
  
  // 保存到 localStorage
  localStorage.setItem('state', JSON.stringify(store.getState()));
  
  return result;
};

const store = createStore(
  reducer,
  applyMiddleware(persistMiddleware)
);

// 恢复状态
const savedState = localStorage.getItem('state');
const initialState = savedState ? JSON.parse(savedState) : {};
```

### 开发工具集成
```javascript
import { createStore, compose, applyMiddleware } from 'modernx-core';
import { devToolsEnhancer } from 'redux-devtools-extension';

const store = createStore(
  reducer,
  initialState,
  compose(
    applyMiddleware(thunk, logger),
    devToolsEnhancer({
      name: 'My App',
      trace: true
    })
  )
);
```

## 🔌 插件系统

### 创建插件
```javascript
import { createPlugin } from 'modernx-core';

const myPlugin = createPlugin({
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
});
```

### 使用插件
```javascript
import { createStore, applyMiddleware } from 'modernx-core';

const store = createStore(
  reducer,
  applyMiddleware(myPlugin.middleware)
);

// 增强的 store
store.myMethod();
```

## 🎨 最佳实践

### 1. 状态结构
```javascript
// 使用扁平化状态结构
const initialState = {
  user: {
    currentUser: null,
    loading: false,
    error: null
  },
  posts: {
    items: [],
    loading: false,
    error: null
  },
  ui: {
    sidebarOpen: false,
    theme: 'light'
  }
};
```

### 2. Action 命名
```javascript
// 使用常量定义 action types
const ACTION_TYPES = {
  USER_LOGIN: 'user/login',
  USER_LOGOUT: 'user/logout',
  USER_UPDATE: 'user/update',
  
  POSTS_FETCH: 'posts/fetch',
  POSTS_SUCCESS: 'posts/success',
  POSTS_ERROR: 'posts/error'
};
```

### 3. Reducer 组合
```javascript
import { combineReducers } from 'modernx-core';

const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  ui: uiReducer
});
```

### 4. 错误处理
```javascript
function errorReducer(state = {}, action) {
  switch (action.type) {
    case 'ERROR_OCCURRED':
      return {
        ...state,
        [action.payload.type]: action.payload.error
      };
    case 'ERROR_CLEARED':
      return {
        ...state,
        [action.payload.type]: null
      };
    default:
      return state;
  }
}
```

## 📊 性能优化

### 1. 状态规范化
```javascript
// 使用 normalizr 规范化数据
import { normalize, schema } from 'normalizr';

const userSchema = new schema.Entity('users');
const postSchema = new schema.Entity('posts', {
  author: userSchema
});

const normalizedData = normalize(data, [postSchema]);
```

### 2. 选择器优化
```javascript
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

### 3. 浅比较优化
```javascript
import { shallowEqual } from 'react-redux';

function shouldComponentUpdate(prevProps, nextProps) {
  return !shallowEqual(prevProps, nextProps);
}
```

## 🧪 测试

### 测试 Reducer
```javascript
import counterReducer from './counterReducer';

describe('counterReducer', () => {
  it('should return initial state', () => {
    expect(counterReducer(undefined, {})).toBe(0);
  });
  
  it('should handle INCREMENT', () => {
    expect(counterReducer(0, { type: 'INCREMENT' })).toBe(1);
  });
  
  it('should handle DECREMENT', () => {
    expect(counterReducer(1, { type: 'DECREMENT' })).toBe(0);
  });
});
```

### 测试 Action Creator
```javascript
import { increment, decrement } from './actions';

describe('actions', () => {
  it('should create INCREMENT action', () => {
    expect(increment(5)).toEqual({
      type: 'INCREMENT',
      payload: 5
    });
  });
});
```

### 测试 Store
```javascript
import { createStore } from 'modernx-core';
import rootReducer from './reducers';

describe('store', () => {
  let store;
  
  beforeEach(() => {
    store = createStore(rootReducer);
  });
  
  it('should dispatch actions', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().counter).toBe(1);
  });
});
```

## 🚀 版本历史

- **v1.1.1** - 修复类型定义问题
- **v1.1.0** - 添加插件系统
- **v1.0.0** - 初始版本

## 📞 支持

- 📖 [完整文档](https://github.com/perlinson/modernx)
- 🐛 [问题反馈](https://github.com/perlinson/modernx/issues)
- 💬 [讨论区](https://github.com/perlinson/modernx/discussions)

---

**⚡ 让 ModernX 更加轻量和高效！**
