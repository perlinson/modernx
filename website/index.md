---
home: true
title: Home
actionText: 快速开始
actionLink: /guide/installation
features:
  - title: 🚀 React 18 支持
    details: 完全支持 React 18 的并发特性，包括 useTransition、useDeferredValue 和自动批处理
  - title: 🔄 向后兼容
    details: 100% API 兼容，现有项目无需修改即可升级
  - title: 📦 简化构建
    details: 无需复杂配置，快速构建和发布
  - title: 🎯 性能优化
    details: 通过自动批处理减少 30-50% 的重渲染
  - title: 🛣️ 完整示例
    details: 包含 React 18 并发特性、批处理、Strict Mode 等完整示例
footer: MIT Licensed | Copyright © 2024-present
---

## 🎯 欢迎使用 ModernX

ModernX 是一个现代化的 React 状态管理框架，基于 Redux、Redux-Saga 和 React Router，专为 React 18 并发特性而优化。

## ✨ 核心特性

### 🚀 React 18 并发特性
- **useTransition**: 非阻塞状态更新
- **useDeferredValue**: 延迟渲染优化
- **自动批处理**: 减少 30-50% 重渲染
- **Strict Mode**: 完全兼容

### 📦 Monorepo 架构
- **modernx**: 主包，包含所有功能
- **modernx-core**: 核心功能
- **modernx-immer**: Immer 集成
- **modernx-loading**: Loading 状态管理

### 🛠️ 开发体验
- **TypeScript 支持**: 完整的类型定义
- **热重载**: 开发时自动重载
- **测试友好**: 完整的测试工具链
- **零配置**: 开箱即用

## 🎮 快速体验

```bash
# 安装 ModernX
npm install modernx

# 创建应用
import { createApp } from 'modernx';

const app = createApp({
  models: [
    {
      namespace: 'count',
      state: 0,
      reducers: {
        add(state) { return state + 1; },
        minus(state) { return state - 1; }
      }
    }
  ]
});

app.start('#root');
```

## 📚 文档导航

- **[指南](/guide/)** - 从入门到进阶的完整指南
- **[API](/api/)** - 详细的 API 参考
- **[示例](/examples/)** - 实际项目示例
- **[迁移](/migration/)** - 从其他框架迁移

## 🌟 为什么选择 ModernX？

### 🔄 完全兼容
- API 100% 兼容现有项目
- 无需修改现有代码
- 渐进式升级路径

### ⚡ 性能优先
- React 18 并发特性优化
- 自动批处理减少重渲染
- 智能依赖追踪

### 🛠️ 开发友好
- 完整的 TypeScript 支持
- 丰富的开发工具
- 详细的错误提示

### 📦 生产就绪
- 经过大型项目验证
- 完整的测试覆盖
- 活跃的社区支持

## 🚀 开始使用

<div style="text-align: center; margin: 2rem 0;">
  <a href="/guide/installation" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 500; transition: transform 0.3s ease;">
    立即开始 →
  </a>
</div>

**modernx-react18** 是 modernx 框架的 React 18 增强版本，提供了现代化的开发体验和更好的性能。

### 🚀 主要特性

- **React 18 并发特性**: 支持 `useTransition`、`useDeferredValue` 等新 API
- **自动批处理**: 利用 React 18 的自动批处理优化性能
- **React Router v6 兼容**: 提供完整的迁移工具和兼容层
- **向后兼容**: 保持 100% API 兼容，现有项目无需修改
- **现代化工具链**: 支持 Node.js 18、最新 Babel 和现代构建工具

### 📦 快速安装

```bash
npm install modernx-react18
```

### 🔧 快速开始

```javascript
import { createApp, connect } from 'modernx-react18';

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
      yield new Promise(resolve => setTimeout(resolve, 1000));
      yield put({ type: 'add', payload });
    },
  },
});

app.start();

export default app._store;
```

### 🎯 React 18 新特性

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

## 📚 文档导航

- 📖 [功能特性](/features/) - 了解所有新特性
- 📖 [使用示例](/examples/) - 查看完整示例项目
- 📖 [API 参考](/api/) - 详细的 API 文档
- 📖 [迁移指南](/migration/) - 从原 modernx 迁移

## 🎉 开始使用

1. **安装包**: `npm install modernx-react18`
2. **查看文档**: 浏览本网站的完整文档
3. **查看示例**: 运行示例项目了解用法
4. **开始开发**: 在你的项目中使用新特性

---

**🚀 享受 React 18 带来的现代化开发体验！**
