# modernx-loading

ModernX 的 Loading 状态管理插件，提供统一的加载状态处理。

## 🎯 特性

- ⚡ **统一管理** - 统一管理所有加载状态
- 🔄 **自动处理** - 自动显示和隐藏加载状态
- 📊 **状态追踪** - 追踪每个操作的加载状态
- 🎨 **组件支持** - 提供 React 组件
- 🔧 **TypeScript** - 完整的类型支持
- 🎯 **零配置** - 开箱即用

## 🚀 快速开始

### 安装
```bash
npm install modernx-loading
```

### 基础使用
```javascript
import { createApp } from 'modernx';
import loading from 'modernx-loading';

const app = createApp({
  plugins: [loading()],
  models: [
    {
      namespace: 'todos',
      state: {
        items: []
      },
      effects: {
        *fetchTodos({ payload }, { put, call }) {
          // 自动显示加载状态
          yield put({ type: 'showLoading', payload: 'fetchTodos' });
          
          try {
            const todos = yield call(api.fetchTodos, payload);
            yield put({ type: 'setTodos', payload: todos });
          } finally {
            // 自动隐藏加载状态
            yield put({ type: 'hideLoading', payload: 'fetchTodos' });
          }
        }
      }
    }
  ]
});
```

## 📋 API 参考

### loading 插件
```javascript
import loading from 'modernx-loading';

const app = createApp({
  plugins: [
    loading({
      // 全局加载状态键名
      globalKey: 'global',
      
      // 自动处理 effects
      autoHandle: true,
      
      // 默认加载状态
      defaultLoading: false,
      
      // 加载状态前缀
      loadingPrefix: 'loading'
    })
  ]
});
```

### Loading Actions
```javascript
// 显示加载状态
dispatch({ type: 'showLoading', payload: 'fetchData' });

// 隐藏加载状态
dispatch({ type: 'hideLoading', payload: 'fetchData' });

// 设置加载状态
dispatch({ type: 'setLoading', payload: { key: 'fetchData', loading: true } });

// 清除所有加载状态
dispatch({ type: 'clearLoading' });
```

### Loading Selectors
```javascript
// 获取所有加载状态
const loading = state.loading;

// 获取特定加载状态
const isFetching = state.loading['fetchData'];

// 获取全局加载状态
const globalLoading = state.loading.global;

// 检查是否有任何加载状态
const hasLoading = Object.values(state.loading).some(Boolean);
```

## 🔧 高级用法

### 自定义加载状态
```javascript
const app = createApp({
  plugins: [
    loading({
      // 自定义加载状态键
      customKeys: ['fetchUsers', 'fetchPosts', 'saveData'],
      
      // 加载状态映射
      mapping: {
        'fetchUsers': 'users.loading',
        'fetchPosts': 'posts.loading',
        'saveData': 'data.saving'
      }
    })
  ]
});
```

### 手动控制加载状态
```javascript
effects: {
  *customOperation({ payload }, { put }) {
    // 手动显示加载状态
    yield put({ type: 'setLoading', payload: { key: 'customOp', loading: true } });
    
    try {
      // 执行异步操作
      const result = yield call(api.customOperation, payload);
      yield put({ type: 'setResult', payload: result });
    } finally {
      // 手动隐藏加载状态
      yield put({ type: 'setLoading', payload: { key: 'customOp', loading: false } });
    }
  }
}
```

### 批量加载状态
```javascript
effects: {
  *fetchMultiple({ payload }, { put, all }) {
    // 显示多个加载状态
    yield put({ type: 'showLoading', payload: 'fetchUsers' });
    yield put({ type: 'showLoading', payload: 'fetchPosts' });
    
    try {
      const [users, posts] = yield all([
        call(api.fetchUsers),
        call(api.fetchPosts)
      ]);
      
      yield put({ type: 'setData', payload: { users, posts } });
    } finally {
      // 隐藏所有加载状态
      yield put({ type: 'hideLoading', payload: 'fetchUsers' });
      yield put({ type: 'hideLoading', payload: 'fetchPosts' });
    }
  }
}
```

## 🎨 React 组件

### LoadingProvider
```javascript
import { LoadingProvider, useLoading } from 'modernx-loading';

function App() {
  return (
    <LoadingProvider>
      <MyComponent />
    </LoadingProvider>
  );
}

function MyComponent() {
  const { loading, isLoading, showLoading, hideLoading } = useLoading();
  
  const handleFetch = () => {
    showLoading('fetchData');
    
    api.fetchData()
      .then(data => {
        // 处理数据
      })
      .finally(() => {
        hideLoading('fetchData');
      });
  };
  
  return (
    <div>
      <button onClick={handleFetch}>
        {loading['fetchData'] ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {isLoading('fetchData') && <div>Loading...</div>}
    </div>
  );
}
```

### Loading 组件
```javascript
import { Loading } from 'modernx-loading';

function MyComponent() {
  return (
    <div>
      <Loading key="fetchData" fallback={<div>Loading...</div>}>
        <MyData />
      </Loading>
      
      <Loading 
        key="saveData" 
        fallback={<div>Saving...</div>}
        overlay={true}
      >
        <MyForm />
      </Loading>
    </div>
  );
}
```

### useLoading Hook
```javascript
import { useLoading } from 'modernx-loading';

function MyComponent() {
  const { 
    loading,           // 所有加载状态
    isLoading,         // 检查特定加载状态
    showLoading,       // 显示加载状态
    hideLoading,       // 隐藏加载状态
    setLoading,        // 设置加载状态
    clearLoading,      // 清除加载状态
    hasLoading         // 检查是否有任何加载状态
  } = useLoading();
  
  const handleAsyncOperation = async () => {
    showLoading('operation');
    
    try {
      await performOperation();
    } finally {
      hideLoading('operation');
    }
  };
  
  return (
    <div>
      <button onClick={handleAsyncOperation}>
        {isLoading('operation') ? 'Processing...' : 'Start Operation'}
      </button>
      
      {hasLoading && <div>Some operation is in progress...</div>}
    </div>
  );
}
```

## 🎯 使用场景

### 1. API 请求加载
```javascript
const apiModel = {
  namespace: 'api',
  state: {
    users: [],
    posts: [],
    error: null
  },
  effects: {
    *fetchUsers({ payload }, { put, call }) {
      yield put({ type: 'showLoading', payload: 'fetchUsers' });
      
      try {
        const users = yield call(api.fetchUsers, payload);
        yield put({ type: 'setUsers', payload: users });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'hideLoading', payload: 'fetchUsers' });
      }
    },
    
    *fetchPosts({ payload }, { put, call }) {
      yield put({ type: 'showLoading', payload: 'fetchPosts' });
      
      try {
        const posts = yield call(api.fetchPosts, payload);
        yield put({ type: 'setPosts', payload: posts });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'hideLoading', payload: 'fetchPosts' });
      }
    }
  }
};
```

### 2. 表单提交加载
```javascript
const formModel = {
  namespace: 'form',
  state: {
    submitting: false,
    success: false,
    error: null
  },
  effects: {
    *submitForm({ payload }, { put, call }) {
      yield put({ type: 'showLoading', payload: 'submitForm' });
      
      try {
        const result = yield call(api.submitForm, payload);
        yield put({ type: 'setSuccess', payload: true });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'hideLoading', payload: 'submitForm' });
      }
    }
  }
};
```

### 3. 文件上传加载
```javascript
const uploadModel = {
  namespace: 'upload',
  state: {
    uploading: false,
    progress: 0,
    error: null
  },
  effects: {
    *uploadFile({ payload }, { put, call }) {
      yield put({ type: 'showLoading', payload: 'uploadFile' });
      
      try {
        const result = yield call(api.uploadFile, payload, {
          onProgress: (progress) => {
            put({ type: 'setProgress', payload: progress });
          }
        });
        yield put({ type: 'setSuccess', payload: result });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'hideLoading', payload: 'uploadFile' });
      }
    }
  }
};
```

## 🔌 与其他插件集成

### 与 GUI 集成
```javascript
import { createApp } from 'modernx';
import loading from 'modernx-loading';

const app = createApp({
  plugins: [
    loading({
      // 在 GUI 中显示加载状态
      guiIntegration: true
    })
  ]
});
```

### 与 Logger 集成
```javascript
import { createApp } from 'modernx';
import loading from 'modernx-loading';
import logger from 'modernx-logger';

const app = createApp({
  plugins: [
    loading({
      // 记录加载状态变化
      logChanges: true
    }),
    logger()
  ]
});
```

## 🎨 最佳实践

### 1. 合理的加载状态命名
```javascript
// ✅ 好的做法
showLoading('fetchUsers');
showLoading('createPost');
showLoading('updateProfile');

// ❌ 避免的做法
showLoading('loading');
showLoading('loading1');
showLoading('loading2');
```

### 2. 自动和手动结合使用
```javascript
// ✅ 自动处理简单操作
effects: {
  *fetchData({ payload }, { put, call }) {
    // 自动显示/隐藏加载状态
    yield put({ type: 'showLoading', payload: 'fetchData' });
    
    try {
      const data = yield call(api.fetchData, payload);
      yield put({ type: 'setData', payload: data });
    } finally {
      yield put({ type: 'hideLoading', payload: 'fetchData' });
    }
  }
}

// ✅ 手动处理复杂操作
effects: {
  *complexOperation({ payload }, { put, call }) {
  yield put({ type: 'setLoading', payload: { key: 'complexOp', loading: true } });
  
  try {
    // 多个异步步骤
    const step1 = yield call(api.step1, payload);
    const step2 = yield call(api.step2, step1);
    const step3 = yield call(api.step3, step2);
    
    yield put({ type: 'setResult', payload: step3 });
  } finally {
    yield put({ type: 'setLoading', payload: { key: 'complexOp', loading: false } });
  }
}
```

### 3. 错误处理
```javascript
effects: {
  *fetchData({ payload }, { put, call }) {
    yield put({ type: 'showLoading', payload: 'fetchData' });
    
    try {
      const data = yield call(api.fetchData, payload);
      yield put({ type: 'setData', payload: data });
    } catch (error) {
      yield put({ type: 'setError', payload: error.message });
      // 确保在错误情况下也隐藏加载状态
    } finally {
      yield put({ type: 'hideLoading', payload: 'fetchData' });
    }
  }
}
```

## 🧪 测试

### 测试 Loading 状态
```javascript
import { getLoadingModel } from './models/loading';

describe('loading model', () => {
  let model;
  
  beforeEach(() => {
    model = getLoadingModel();
  });
  
  it('should handle showLoading action', () => {
    const state = {};
    const action = { type: 'showLoading', payload: 'fetchData' };
    const newState = model.reducers.showLoading(state, action);
    
    expect(newState.loading['fetchData']).toBe(true);
  });
  
  it('should handle hideLoading action', () => {
    const state = { loading: { fetchData: true } };
    const action = { type: 'hideLoading', payload: 'fetchData' };
    const newState = model.reducers.hideLoading(state, action);
    
    expect(newState.loading['fetchData']).toBe(false);
  });
  
  it('should handle setLoading action', () => {
    const state = {};
    const action = { type: 'setLoading', payload: { key: 'test', loading: true } };
    const newState = model.reducers.setLoading(state, action);
    
    expect(newState.loading.test).toBe(true);
  });
});
```

### 测试 Loading 组件
```javascript
import { render, screen } from '@testing-library/react';
import { LoadingProvider, useLoading } from 'modernx-loading';

describe('Loading components', () => {
  it('should show loading state', () => {
    const TestComponent = () => {
      const { loading, showLoading, hideLoading } = useLoading();
      
      return (
        <div>
          <button onClick={() => showLoading('test')}>
            {loading['test'] ? 'Loading...' : 'Show Loading'}
          </button>
          <button onClick={() => hideLoading('test')}>
            Hide Loading
          </button>
        </div>
      );
    };
    
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    );
    
    expect(screen.getByText('Show Loading')).toBeInTheDocument();
    
    screen.getByText('Show Loading').click();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    screen.getByText('Hide Loading').click();
    expect(screen.getByText('Show Loading')).toBeInTheDocument();
  });
});
```

## 🚀 版本历史

- **v1.1.1** - 修复组件渲染问题
- **v1.1.0** - 添加 React 组件支持
- **v1.0.0** - 初始版本

## 📞 支持

- 📖 [完整文档](https://github.com/perlinson/modernx)
- 🐛 [问题反馈](https://github.com/perlinson/modernx/issues)
- 💬 [讨论区](https://github.com/perlinson/modernx/discussions)

---

**⚡ 让加载状态管理更加简单！**
