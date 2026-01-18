# 插件系统

ModernX 提供了强大的插件系统，允许扩展和定制功能。

## 内置插件

### modernx-logger
Redux 日志记录插件：

```javascript
import logger from 'modernx-logger';

const app = createApp({
  plugins: [
    logger({
      collapsed: true,
      duration: true,
      timestamp: true
    })
  ]
});
```

### modernx-immer
不可变状态更新插件：

```javascript
import immer from 'modernx-immer';

const app = createApp({
  plugins: [immer()],
  models: [
    {
      namespace: 'todos',
      state: { items: [] },
      reducers: {
        addTodo: (state, { payload }) => {
          // 使用可变语法
          state.items.push(payload);
        }
      }
    }
  ]
});
```

### modernx-loading
加载状态管理插件：

```javascript
import loading from 'modernx-loading';

const app = createApp({
  plugins: [loading()],
  models: [
    {
      effects: {
        *fetchData({ payload }, { put }) {
          yield put({ type: 'showLoading', payload: 'fetchData' });
          
          try {
            const data = yield call(api.fetchData, payload);
            yield put({ type: 'setData', payload: data });
          } finally {
            yield put({ type: 'hideLoading', payload: 'fetchData' });
          }
        }
      }
    }
  ]
});
```

## 自定义插件

### 插件结构
```javascript
const myPlugin = {
  name: 'my-plugin',
  
  // 初始化
  init: (options) => {
    console.log('Plugin initialized:', options);
  },
  
  // 中间件
  middleware: (store) => (next) => (action) => {
    console.log('Before:', action);
    const result = next(action);
    console.log('After:', store.getState());
    return result;
  },
  
  // Store 增强
  enhanceStore: (store) => {
    store.myMethod = () => {
      console.log('Custom method');
    };
    return store;
  },
  
  // Model 增强
  enhanceModel: (model) => {
    return {
      ...model,
      // 添加额外的 reducers 或 effects
      reducers: {
        ...model.reducers,
        customReducer: (state, { payload }) => {
          return { ...state, custom: payload };
        }
      }
    };
  }
};
```

### 使用自定义插件
```javascript
const app = createApp({
  plugins: [myPlugin({ option: 'value' })]
});
```

## 插件开发

### 1. 创建插件文件
```javascript
// plugins/my-plugin.js
export default function createMyPlugin(options = {}) {
  return {
    name: 'my-plugin',
    options,
    
    init() {
      // 初始化逻辑
    },
    
    middleware(store) {
      return (next) => (action) => {
        // 中间件逻辑
        return next(action);
      };
    }
  };
}
```

### 2. 插件配置
```javascript
// modernx.config.js
module.exports = {
  plugins: [
    require('./plugins/my-plugin')({
      // 插件选项
    })
  ]
};
```

## 插件钩子

### onAction
监听所有 action：
```javascript
const plugin = {
  onAction: (action, state) => {
    console.log('Action dispatched:', action);
  }
};
```

### onStateChange
监听状态变化：
```javascript
const plugin = {
  onStateChange: (prevState, nextState, action) => {
    console.log('State changed:', prevState, nextState);
  }
};
```

### onError
错误处理：
```javascript
const plugin = {
  onError: (error, dispatch) => {
    console.error('Plugin error:', error);
    dispatch({ type: 'HANDLE_ERROR', payload: error });
  }
};
```

## 插件示例

### 1. API 插件
```javascript
const apiPlugin = {
  name: 'api',
  
  init(options) {
    this.api = options.api;
  },
  
  enhanceModel(model) {
    return {
      ...model,
      effects: {
        ...model.effects,
        *apiCall({ payload }, { call, put }) {
          try {
            const response = yield call(this.api, payload);
            yield put({ type: `${model.namespace}/success`, payload: response });
          } catch (error) {
            yield put({ type: `${model.namespace}/error`, payload: error });
          }
        }
      }
    };
  }
};
```

### 2. 缓存插件
```javascript
const cachePlugin = {
  name: 'cache',
  
  init() {
    this.cache = new Map();
  },
  
  middleware(store) {
    return (next) => (action) => {
      const cacheKey = `${action.type}_${JSON.stringify(action.payload)}`;
      
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      
      const result = next(action);
      this.cache.set(cacheKey, result);
      
      return result;
    };
  }
};
```

## 最佳实践

1. **命名规范** - 使用描述性的插件名
2. **错误处理** - 提供完善的错误处理
3. **性能考虑** - 避免阻塞主线程
4. **文档完善** - 提供详细的使用文档
5. **测试覆盖** - 编写完整的测试用例
