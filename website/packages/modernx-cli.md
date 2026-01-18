# modernx-cli

ModernX 的命令行工具，提供项目创建、代码生成、构建部署等功能。

## 🎯 特性

- 📁 **项目创建** - 快速创建 ModernX 项目
- 🔧 **代码生成** - 自动生成模型、组件、页面
- 🚀 **快速部署** - 一键部署到各种平台
- 📦 **依赖管理** - 智能的依赖安装和更新
- 🛠️ **开发工具** - 热重载、构建、测试等
- 🎨 **模板系统** - 丰富的项目模板

## 🚀 快速开始

### 安装
```bash
npm install -g modernx-cli
```

### 创建新项目
```bash
# 创建基础项目
modernx create my-app

# 创建完整项目
modernx create my-app --template=full

# 创建企业级项目
modernx create my-app --template=enterprise

# 创建 React 18 项目
modernx create my-app --template=react18
```

### 项目结构
```
my-app/
├── src/
│   ├── components/     # 组件目录
│   ├── models/         # 模型目录
│   ├── services/       # 服务目录
│   ├── utils/          # 工具函数
│   └── index.js        # 入口文件
├── public/             # 静态资源
├── package.json        # 项目配置
└── README.md          # 项目说明
```

## 📋 命令详解

### create
创建新的 ModernX 项目
```bash
modernx create <project-name> [options]

选项:
  --template <template>    项目模板 (basic|full|enterprise|react18)
  --typescript             使用 TypeScript
  --eslint                 配置 ESLint
  --prettier               配置 Prettier
```

### generate
生成代码文件
```bash
# 生成模型
modernx generate model user

# 生成组件
modernx generate component Header

# 生成页面
modernx generate page Home

# 生成服务
modernx generate service api
```

### build
构建项目
```bash
# 开发构建
modernx build

# 生产构建
modernx build --production

# 分析构建
modernx build --analyze
```

### dev
启动开发服务器
```bash
# 启动开发服务器
modernx dev

# 指定端口
modernx dev --port 3001

# 启用 HTTPS
modernx dev --https
```

### deploy
部署项目
```bash
# 部署到 GitHub Pages
modernx deploy --platform=github-pages

# 部署到 Netlify
modernx deploy --platform=netlify

# 部署到 Vercel
modernx deploy --platform=vercel
```

## 🎨 模板系统

### Basic 模板
最简单的 ModernX 项目模板
```bash
modernx create my-app --template=basic
```

### Full 模板
包含完整功能的模板
```bash
modernx create my-app --template=full
```

### Enterprise 模板
企业级项目模板
```bash
modernx create my-app --template=enterprise
```

### React 18 模板
针对 React 18 优化的模板
```bash
modernx create my-app --template=react18
```

## 🔧 代码生成

### 模型生成
```bash
modernx generate model user
```

生成的文件：
```javascript
// src/models/user.js
export default {
  namespace: 'user',
  state: {
    currentUser: null,
    loading: false,
  },
  effects: {
    *login({ payload }, { put }) {
      yield put({ type: 'setLoading', payload: true });
      // 登录逻辑
      yield put({ type: 'setUser', payload: user });
      yield put({ type: 'setLoading', payload: false });
    },
  },
  reducers: {
    setUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
  },
};
```

### 组件生成
```bash
modernx generate component Header
```

生成的文件：
```javascript
// src/components/Header.js
import React from 'react';
import { connect } from 'modernx';

const Header = ({ user, dispatch }) => {
  const handleLogin = () => {
    dispatch({ type: 'user/login', payload: { username: 'admin' } });
  };

  return (
    <header>
      <h1>My App</h1>
      {user.currentUser ? (
        <div>Welcome, {user.currentUser.name}!</div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </header>
  );
};

export default connect(({ user }) => ({ user }))(Header);
```

### 页面生成
```bash
modernx generate page Home
```

生成的文件：
```javascript
// src/pages/Home.js
import React from 'react';
import { connect } from 'modernx';

const Home = ({ counter, dispatch }) => {
  const handleIncrement = () => {
    dispatch({ type: 'counter/increment' });
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Count: {counter.count}</p>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
};

export default connect(({ counter }) => ({ counter }))(Home);
```

## 📦 配置文件

### modernx.config.js
```javascript
module.exports = {
  // 项目配置
  name: 'my-app',
  version: '1.0.0',
  
  // 构建配置
  build: {
    entry: 'src/index.js',
    output: 'dist',
    publicPath: '/',
  },
  
  // 开发配置
  dev: {
    port: 3000,
    hot: true,
    open: true,
  },
  
  // 部署配置
  deploy: {
    platform: 'github-pages',
    domain: 'myusername.github.io/my-app',
  },
};
```

## 🎯 最佳实践

### 1. 项目命名
```bash
# 使用 kebab-case
modernx create my-awesome-app

# 避免特殊字符
modernx create my_app  # ❌
modernx create my-app  # ✅
```

### 2. 模板选择
```bash
# 学习和小项目
modernx create my-app --template=basic

# 中型项目
modernx create my-app --template=full

# 大型项目
modernx create my-app --template=enterprise

# React 18 项目
modernx create my-app --template=react18
```

### 3. 代码生成
```bash
# 使用复数形式生成多个
modernx generate models user product order

# 使用 PascalCase 生成组件
modernx generate component UserProfile

# 使用 camelCase 生成页面
modernx generate page userProfile
```

## 🔌 插件系统

### 使用插件
```javascript
// modernx.config.js
module.exports = {
  plugins: [
    '@modernx/plugin-typescript',
    '@modernx/plugin-eslint',
    '@modernx/plugin-prettier',
    '@modernx/plugin-jest',
  ],
};
```

### 自定义插件
```javascript
// plugins/my-plugin.js
module.exports = {
  name: 'my-plugin',
  hooks: {
    beforeCreate: (options) => {
      console.log('Creating project:', options.name);
    },
    afterCreate: (options) => {
      console.log('Project created:', options.name);
    },
  },
};
```

## 🚀 版本历史

- **v1.1.1** - 修复构建脚本问题
- **v1.1.0** - 添加 React 18 模板
- **v1.0.0** - 初始版本

## 📞 支持

- 📖 [完整文档](https://github.com/perlinson/modernx)
- 🐛 [问题反馈](https://github.com/perlinson/modernx/issues)
- 💬 [讨论区](https://github.com/perlinson/modernx/discussions)

---

**🛠️ 让 ModernX 开发更加高效！**
