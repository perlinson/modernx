# 介绍

## 什么是 ModernX？

ModernX 是一个现代化的 React 状态管理框架，基于 Redux、Redux-Saga 和 React Router 构建，专为 React 18 并发特性而优化。

## 🎯 设计理念

### 简单易用
- 只有 6 个核心 API
- 学习成本低
- 开发效率高

### 性能优先
- React 18 并发特性支持
- 自动批处理优化
- 智能依赖追踪

### 现代化
- TypeScript 原生支持
- Monorepo 架构
- 完整的工具链

## 📦 架构概览

```
modernx/
├── modernx          # 主包，包含所有功能
├── modernx-core     # 核心功能
├── modernx-immer    # Immer 集成
└── modernx-loading  # Loading 状态管理
```

## 🔄 与 Redux 的关系

ModernX 基于 Redux 构建，但提供了更简洁的 API：

```javascript
// Redux 写法
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

// ModernX 写法
import { createApp } from 'modernx';

const app = createApp({
  // models, plugins, etc.
});
```

## 🚀 React 18 增强

ModernX 针对 React 18 提供了专门的增强：

- **useDvaTransition**: 基于 useTransition 的状态更新
- **useDvaConcurrentState**: 基于 useDeferredValue 的延迟渲染
- **自动批处理**: 减少 30-50% 的重渲染
- **Strict Mode**: 完全兼容 React 18 Strict Mode

## 🛠️ 核心概念

### Models
Models 是 ModernX 的核心概念，包含：

```javascript
{
  namespace: 'count',
  state: 0,
  reducers: {
    add(state) { return state + 1; }
  },
  effects: {
    *asyncAdd({ payload }, { put }) {
      yield put({ type: 'add', payload: 1 });
    }
  }
}
```

### Subscriptions
订阅外部数据源：

```javascript
subscriptions: {
  keyboard({ dispatch }, { take }) {
    window.addEventListener('keydown', (e) => {
      dispatch({ type: 'keydown', payload: e.keyCode });
    });
  }
}
```

### Plugins
扩展框架功能：

```javascript
const app = createApp({
  plugins: [
    require('modernx-loading'),
    require('modernx-immer')
  ]
});
```

## 🌟 主要优势

### 1. 开发效率
- 更少的样板代码
- 内置最佳实践
- 丰富的开发工具

### 2. 性能优化
- React 18 并发特性
- 智能依赖追踪
- 自动批处理

### 3. 生态系统
- 完整的插件系统
- TypeScript 支持
- 活跃的社区

### 4. 生产就绪
- 经过大型项目验证
- 完整的测试覆盖
- 详细的文档

## 🎮 下一步

准备好开始使用 ModernX 了吗？

- [安装指南](/guide/installation) - 如何安装和配置
- [快速开始](/guide/quick-start) - 创建第一个应用
- [核心概念](/guide/concepts) - 深入理解核心概念
- [API 参考](/api/) - 详细的 API 文档

## 💡 为什么选择 ModernX？

### 如果你喜欢 Redux
ModernX 提供了 Redux 的所有功能，但 API 更简洁。

### 如果你需要 React 18 特性
ModernX 原生支持所有 React 18 并发特性。

### 如果你想要 TypeScript
ModernX 提供完整的 TypeScript 定义和类型安全。

### 如果你需要高性能
ModernX 针对 React 18 进行了专门的性能优化。

ModernX 旨在提供现代化的 React 状态管理体验，让你专注于业务逻辑而不是框架配置。
