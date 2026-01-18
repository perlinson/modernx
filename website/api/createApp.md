# createApp

`createApp` 是 ModernX 的核心函数，用于创建应用实例。

## 语法

```javascript
const app = createApp(options);
```

## 参数

### options (Object)

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| models | Array | [] | 模型配置数组 |
| initialState | Object | {} | 初始状态 |
| plugins | Array | [] | 插件数组 |
| extraMiddlewares | Array | [] | 额外的中间件 |
| extraEnhancers | Array | [] | 额外的增强器 |
| onError | Function | undefined | 错误处理函数 |
| devTools | Boolean | true | 是否启用开发工具 |

## 返回值

返回一个应用实例，包含以下方法：

- `app.model(model)` - 添加模型
- `app.start(container)` - 启动应用
- `app.unmodel(namespace)` - 移除模型
- `app.replaceModel(model)` - 替换模型

## 示例

### 基础用法
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
      }
    }
  ]
});

app.start('#root');
```

### 完整配置
```javascript
import { createApp } from 'modernx';
import logger from 'modernx-logger';
import immer from 'modernx-immer';

const app = createApp({
  models: [
    {
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
      }
    }
  ],
  plugins: [
    logger(),
    immer()
  ],
  initialState: {
    app: {
      name: 'My App',
      version: '1.0.0'
    }
  },
  onError: (error, dispatch) => {
    console.error('Global error:', error);
    dispatch({ type: 'global/error', payload: error.message });
  },
  devTools: process.env.NODE_ENV === 'development'
});

app.start('#root');
```

## 方法详解

### app.model(model)

动态添加模型到应用中。

```javascript
app.model({
  namespace: 'todos',
  state: { items: [] },
  reducers: {
    addTodo(state, { payload }) {
      return { ...state, items: [...state.items, payload] };
    }
  }
});
```

### app.start(container)

启动应用，将应用挂载到指定的 DOM 容器中。

```javascript
app.start('#root');
// 或者
app.start(document.getElementById('root'));
```

### app.unmodel(namespace)

移除指定命名空间的模型。

```javascript
app.unmodel('todos');
```

### app.replaceModel(model)

替换现有模型。

```javascript
app.replaceModel({
  namespace: 'todos',
  state: { items: [], completed: [] },
  reducers: {
    // 新的 reducers
  }
});
```

## 配置选项详解

### plugins

插件数组，用于扩展应用功能。

```javascript
const app = createApp({
  plugins: [
    logger({ collapsed: true }),
    immer(),
    loading()
  ]
});
```

### extraMiddlewares

额外的 Redux 中间件。

```javascript
const app = createApp({
  extraMiddlewares: [
    thunkMiddleware,
    customMiddleware
  ]
});
```

### extraEnhancers

额外的 Redux 增强器。

```javascript
const app = createApp({
  extraEnhancers: [
    devToolsEnhancer
  ]
});
```

### onError

全局错误处理函数。

```javascript
const app = createApp({
  onError: (error, dispatch) => {
    // 处理错误
    console.error('Error:', error);
    dispatch({ type: 'ERROR_OCCURRED', payload: error });
  }
});
```

## 注意事项

1. **命名空间唯一** - 每个模型的 namespace 必须唯一
2. **启动时机** - 只能启动一次应用
3. **错误处理** - 建议设置全局错误处理
4. **开发工具** - 生产环境建议关闭 devTools
