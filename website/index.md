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
  - title: 📦 Monorepo 架构
    details: 模块化设计，按需引入，支持 Tree Shaking
  - title: 🎯 性能优化
    details: 通过自动批处理减少 30-50% 的重渲染
  - title: 🛠️ 开发工具
    details: 包含 CLI 工具、GUI 调试器、Logger 插件
  - title: 📚 完整生态
    details: 涵盖状态管理、路由、加载、日志等完整解决方案
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

### 📦 完整的 Monorepo 生态

#### 🔧 核心包
- **[modernx](/packages/modernx/)** - 主包，包含所有功能
- **[modernx-core](/packages/modernx-core/)** - 核心功能，轻量级
- **[modernx-cli](/packages/modernx-cli/)** - 命令行工具

#### 🎨 开发工具
- **[modernx-gui](/packages/modernx-gui/)** - 可视化调试工具 ⭐
- **[modernx-logger](/packages/modernx-logger/)** - 日志插件

#### 🔌 功能插件
- **[modernx-immer](/packages/modernx-immer/)** - Immer 集成
- **[modernx-loading](/packages/modernx-loading/)** - Loading 状态管理

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

## 📦 包生态概览

### 🎯 ModernX GUI v1.3.0
现代化的可视化调试工具，提供：
- 📊 实时状态监控
- 📝 模型编辑器
- 📋 Logger 集成
- 🎨 现代化 UI

```bash
# 启动 GUI
npx modernx-gui@1.3.0
```

### 🛠️ ModernX CLI
强大的命令行工具：
- 📁 项目创建
- 🔧 代码生成
- 🚀 快速部署

```bash
# 创建新项目
npx modernx-cli create my-app
```

### 📊 ModernX Logger
完整的日志解决方案：
- 📝 Redux 日志记录
- 🔍 状态变化追踪
- ⚡ 性能监控

```javascript
import logger from 'modernx-logger';

const app = createApp({
  plugins: [logger()]
});
```

## 📚 文档导航

### 📖 核心文档
- **[指南](/guide/)** - 从入门到进阶的完整指南
- **[API](/api/)** - 详细的 API 参考
- **[示例](/examples/)** - 实际项目示例
- **[迁移](/migration/)** - 从其他框架迁移

### 📦 包文档
- **[modernx](/packages/modernx/)** - 主包文档
- **[modernx-cli](/packages/modernx-cli/)** - CLI 工具文档
- **[modernx-gui](/packages/modernx-gui/)** - GUI 工具文档
- **[modernx-logger](/packages/modernx-logger/)** - Logger 插件文档
- **[modernx-immer](/packages/modernx-immer/)** - Immer 集成文档
- **[modernx-loading](/packages/modernx-loading/)** - Loading 组件文档

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

## 📊 版本信息

| 包名 | 版本 | 描述 |
|------|------|------|
| modernx | 1.3.0 | 主包 |
| modernx-cli | 1.3.0 | 命令行工具 |
| modernx-core | 1.3.0 | 核心库 |
| modernx-gui | 1.3.0 | 可视化调试工具 |
| modernx-logger | 1.3.0 | 日志插件 |
| modernx-immer | 1.3.0 | Immer 集成 |
| modernx-loading | 1.3.0 | Loading 状态管理 |

---

**🚀 享受 React 18 带来的现代化开发体验！**
