# 安装

## 📦 安装 ModernX

### 使用 npm
```bash
npm install modernx
```

### 使用 yarn
```bash
yarn add modernx
```

### 使用 pnpm
```bash
pnpm add modernx
```

## 🔧 开发环境要求

- Node.js >= 16.0.0
- React >= 16.8.0 (推荐 React 18+)
- 现代浏览器支持

## 📦 可选依赖

根据你的项目需求，你可能还需要安装以下包：

### React 18 并发特性
```bash
npm install react@18 react-dom@18
```

### TypeScript 支持
```bash
npm install @types/react @types/react-dom typescript
```

### 开发工具
```bash
npm install @types/node eslint prettier
```

## 🚀 快速验证

安装完成后，你可以快速验证安装是否成功：

```javascript
import { createApp } from 'modernx';

const app = createApp({
  models: [
    {
      namespace: 'test',
      state: { count: 0 },
      reducers: {
        add(state) { return state + 1; }
      }
    }
  ]
});

console.log('ModernX 安装成功!');
```

## 🔧 项目配置

### Create React App
```bash
npx create-react-app my-app --template typescript
cd my-app
npm install modernx
```

### Next.js
```bash
npx create-next-app@latest my-app --typescript
cd my-app
npm install modernx
```

### Vite
```bash
npm create vite@latest my-app --template react-ts
cd my-app
npm install modernx
```

## 📦 包说明

ModernX 采用 Monorepo 架构，包含以下包：

| 包名 | 描述 | 大小 |
|------|------|------|
| `modernx` | 主包，包含所有功能 | ~50KB |
| `modernx-core` | 核心功能 | ~30KB |
| `modernx-immer` | Immer 集成 | ~5KB |
| `modernx-loading` | Loading 状态管理 | ~8KB |

### 按需安装

如果你只需要特定功能，可以单独安装：

```bash
# 只需要核心功能
npm install modernx-core

# 需要 Immer 支持
npm install modernx-immer

# 需要 Loading 状态管理
npm install modernx-loading
```

## 🔄 版本兼容性

| ModernX 版本 | React 版本 | Node 版本 | 说明 |
|--------------|-----------|-----------|------|
| 1.x | 16.8+ | 16.0+ | 稳定版本 |
| 2.x | 18.0+ | 18.0+ | 推荐版本 |

## 🛠️ 故障排除

### 常见问题

**Q: 安装失败**
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

**Q: TypeScript 错误**
```bash
# 确保安装了类型定义
npm install @types/react @types/react-dom

# 检查 tsconfig.json 配置
```

**Q: React 版本冲突**
```bash
# 检查 React 版本
npm list react react-dom

# 升级到兼容版本
npm install react@18 react-dom@18
```

### 调试安装问题

1. **检查环境**
```bash
node --version
npm --version
```

2. **检查依赖**
```bash
npm ls modernx
```

3. **清理重装**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 下一步

安装完成后，你可以：

- [快速开始](/guide/quick-start) - 创建第一个应用
- [核心概念](/guide/concepts) - 理解核心概念
- [API 参考](/api/) - 查看详细 API
- [示例](/examples/) - 查看实际项目示例

## 💡 提示

- 推荐使用 React 18+ 以获得最佳性能
- TypeScript 项目会自动获得类型提示
- 开发时建议使用 `npm run dev` 启用热重载
- 生产环境记得运行 `npm run build` 构建优化版本

安装完成后，你就可以开始使用 ModernX 构建现代化的 React 应用了！
