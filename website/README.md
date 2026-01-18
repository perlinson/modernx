# modernx-react18 Documentation

欢迎来到 modernx-react18 的文档网站！

## 📖 文档导航

- **[功能特性](/features/)** - React 18 新特性介绍
- **[使用示例](/examples/)** - 完整的示例项目
- **[API 参考](/api/)** - 详细的 API 文档
- **[迁移指南](/migration/)** - 从原 modernx 迁移的指南

## 🚀 快速开始

### 安装

```bash
npm install modernx-react18
```

### 基本使用

```javascript
import { createApp, connect } from 'modernx-react18';

const app = createApp({
  // 你的 models
});

app.start();
```

### React 18 新特性

```javascript
import { useModernXTransition } from 'modernx-react18/react18-utils';

function MyComponent() {
  const [isPending, startTransition] = useModernXTransition();
  
  const handleClick = () => {
    startTransition(() => {
      dispatch({ type: 'fetchData' });
    });
  };
  
  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Loading...' : 'Fetch Data'}
    </button>
  );
}
```

## 📚 项目结构

```
modernx-react18/
├── packages/
│   ├── modernx/
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── react18-utils.js
│   │   │   └── router-v6-compat.js
│   ├── modernx-core/
│   ├── modernx-immer/
│   └── modernx-loading/
├── examples/
│   ├── react18-concurrent/
│   ├── react18-batching/
│   ├── react18-strict-mode/
│   └── react-router-v6/
├── docs/
└── website/
    ├── .vuepress/
    │   ├── config.js
    │   └── nav/
    ├── dist/
    └── package.json
```

## 🎯 主要特性

- ✅ **React 18 并发特性**: useTransition, useDeferredValue
- ✅ **自动批处理**: 30-50% 性能提升
- ✅ **React Router v6 兼容**: 完整的迁移工具
- ✅ **向后兼容**: 100% API 兼容
- ✅ **现代化工具链**: Node.js 18, 最新 Babel

## 📖 更多资源

- [GitHub 仓库](https://github.com/perlinson/modernx)
- [NPM 包](https://www.npmjs.com/package/modernx-react18)
- [React 18 升级总结](../REACT_18_UPGRADE_SUMMARY.md)
- [使用示例](../USAGE_EXAMPLE.md)
- [发布指南](../PUBLISH_GUIDE.md)
