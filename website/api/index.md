# API 参考

## 📦 核心包

### modernx

主包，包含所有 ModernX 功能。

#### createApp

创建 ModernX 应用实例。

```typescript
import { createApp } from 'modernx';

const app = createApp(options);
```

**参数:**
- `options` (Object): 应用配置选项

**返回值:**
- `app` (Object): 应用实例

**示例:**
```typescript
const app = createApp({
  models: [countModel],
  plugins: [
    require('modernx-loading'),
    require('modernx-immer')
  ]
});
```

#### 应用实例方法

##### start(selector)

启动应用，将应用挂载到指定元素。

```typescript
app.start('#root');
```

##### model(model)

动态添加 model。

```typescript
app.model({
  namespace: 'dynamic',
  state: { count: 0 }
});
```

##### unmodel(namespace)

移除 model。

```typescript
app.unmodel('dynamic');
```

##### use(plugin)

使用插件。

```typescript
app.use(require('modernx-loading'));
```

### modernx-core

核心功能包，提供基础的状态管理能力。

#### createStore

创建 Redux store。

```typescript
import { createStore } from 'modernx-core';

const store = createStore(options);
```

#### connect

连接 React 组件和 store。

```typescript
import { connect } from 'modernx-core';

const Component = connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

### modernx-immer

Immer 集成包，提供不可变状态更新。

#### immer

Immer 插件配置。

```typescript
import immer from 'modernx-immer';

const app = createApp({
  plugins: [immer()]
});
```

### modernx-loading

Loading 状态管理包。

#### loading

Loading 插件配置。

```typescript
import loading from 'modernx-loading';

const app = createApp({
  plugins: [loading()]
});
```

## 🎯 Hooks

### useDvaTransition

基于 React 18 useTransition 的状态更新 Hook。

```typescript
import { useDvaTransition } from 'modernx/react18-utils';

const [isPending, startTransition] = useDvaTransition();
```

### useDvaConcurrentState

基于 React 18 useDeferredValue 的延迟渲染 Hook。

```typescript
import { useDvaConcurrentState } from 'modernx/react18-utils';

const { state, deferredState } = useDvaConcurrentState('namespace');
```

### useDvaLoading

Loading 状态 Hook。

```typescript
import { useDvaLoading } from 'modernx/react18-utils';

const { loading, globalLoading } = useDvaLoading();
```

## 📋 Model API

### Model 结构

```typescript
{
  namespace: string,           // 命名空间
  state: any,                 // 初始状态
  reducers: Object,            // 同步操作
  effects: Object,             // 异步操作
  subscriptions: Object        // 订阅
}
```

### Reducers

同步操作，直接修改状态。

```typescript
{
  add(state) { return state + 1; },
  setUser(state, { payload }) { 
    return { ...state, user: payload }; 
  }
}
```

### Effects

异步操作，使用 Generator 函数。

```typescript
{
  *asyncAdd({ payload }, { put, call, select }) {
    // 调用 API
    const result = yield call(api.add, payload);
    
    // 更新状态
    yield put({ type: 'add', payload: result });
    
    // 获取状态
    const count = yield select(state => state.count);
  }
}
```

### Subscriptions

订阅外部数据源。

```typescript
{
  setup({ dispatch, history }) {
    // 监听键盘事件
    window.addEventListener('keydown', (e) => {
      dispatch({ type: 'keydown', payload: e.keyCode });
    });
    
    // 监听路由变化
    history.listen(({ pathname }) => {
      dispatch({ type: 'route/change', payload: pathname });
    });
  }
}
```

## 🔧 工具函数

### getReducer

获取 reducer。

```typescript
import { getReducer } from 'modernx-core';

const reducer = getReducer(model);
```

### getSaga

获取 saga。

```typescript
import { getSaga } from 'modernx-core';

const saga = getSaga(model);
```

### checkModel

验证 model 结构。

```typescript
import { checkModel } from 'modernx-core';

const isValid = checkModel(model);
```

## 🎨 类型定义

### AppOptions

```typescript
interface AppOptions {
  models?: Model[];
  plugins?: Plugin[];
  initialState?: any;
  onError?: (error: Error) => void;
  onAction?: (action: any) => void;
  onStateChange?: (state: any) => void;
}
```

### Model

```typescript
interface Model {
  namespace: string;
  state: any;
  reducers?: Reducers;
  effects?: Effects;
  subscriptions?: Subscriptions;
}
```

### ConnectProps

```typescript
interface ConnectProps {
  mapStateToProps?: (state: any, ownProps?: any) => any;
  mapDispatchToProps?: (dispatch: any, ownProps?: any) => any;
  mergeProps?: (stateProps: any, dispatchProps: any, ownProps?: any) => any;
}
```

## 🚀 高级用法

### 自定义插件

```typescript
const customPlugin = {
  name: 'custom',
  setup(app) {
    // 插件初始化
    app.model(customModel);
    
    // 返回插件配置
    return {
      onAction(action) {
        // 监听所有 action
        console.log('Action:', action);
      }
    };
  }
};
```

### 中间件

```typescript
const middleware = (store) => (next) => (action) => {
  console.log('Before:', action);
  next(action);
  console.log('After:', action);
};

const app = createApp({
  middlewares: [middleware]
});
```

### HMR 支持

```typescript
if (process.env.NODE_ENV === 'development') {
  app.use(require('modernx/hmr'));
}
```

## 📚 更多信息

- [示例](/examples/) - 查看实际使用示例
- [指南](/guide/) - 学习核心概念
- [迁移](/migration/) - 从其他框架迁移

## 💡 提示

- 使用 TypeScript 获得完整的类型提示
- 查看 `@types/modernx` 获取详细的类型定义
- 参考 `packages/*/src/index.d.ts` 了解内部实现
