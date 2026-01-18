# 概念

ModernX 基于 Redux 和 Redux-Saga 构建，提供了现代化的 React 状态管理解决方案。

## 核心概念

### Model
Model 是 ModernX 的核心概念，包含：
- **namespace**: 命名空间，用于隔离状态
- **state**: 初始状态
- **reducers**: 同步状态更新
- **effects**: 异步操作和副作用
- **subscriptions**: 数据订阅

### Store
Store 是应用的状态管理中心：
- 管理所有 model 的状态
- 提供 dispatch 方法分发 action
- 支持 getState 获取当前状态
- 支持 subscribe 监听状态变化

### Action
Action 是描述状态变化的普通对象：
- **type**: action 类型
- **payload**: 携带的数据

### Reducer
Reducer 是纯函数，用于计算新状态：
```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
}
```

### Effect
Effect 用于处理异步操作：
```javascript
function* fetchData({ payload }, { put, call }) {
  const data = yield call(api.fetchData, payload);
  yield put({ type: 'SET_DATA', payload: data });
}
```

## 数据流

```
Action → Dispatch → Reducer/Effect → State Update → View Update
```

1. 用户交互触发 Action
2. Store 接收并分发 Action
3. Reducer 处理同步更新，Effect 处理异步操作
4. 状态更新后通知视图重新渲染

## 最佳实践

1. **保持 Reducer 纯净** - 不产生副作用
2. **合理命名 namespace** - 避免冲突
3. **拆分复杂 Effect** - 保持代码可读性
4. **使用 TypeScript** - 提升类型安全
