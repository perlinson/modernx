# ModernX Monorepo 开发工作流

本文档描述了 ModernX monorepo 的开发工作流程和最佳实践。

## 📦 项目结构

```
modernx/
├── packages/           # 所有子包
│   ├── modernx/       # 主包
│   ├── modernx-core/  # 核心包
│   ├── modernx-immer/ # Immer 集成包
│   └── modernx-loading/ # Loading 状态包
├── scripts/           # 构建和管理脚本
├── docs/             # 文档
├── cli/              # CLI 工具
└── lerna.json        # Lerna 配置
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装所有包的依赖
npm run bootstrap

# 或者使用 yarn
yarn bootstrap
```

### 2. 开发模式

```bash
# 启动所有包的开发模式（并行）
npm run dev

# 启动特定包的开发模式
npm run dev -- --scope=modernx
```

### 3. 构建项目

```bash
# 构建所有包
npm run build

# 构建特定包
npm run build:packages -- modernx

# 构建自上次发布以来的变更包
npm run build:since

# 清理并重新构建
npm run clean:build
```

### 4. 运行测试

```bash
# 运行所有测试
npm run test

# 运行特定包的测试
npm run test -- --scope=modernx

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 🔧 常用命令

### 依赖管理

```bash
# 为特定包添加依赖
npm install lodash --scope=modernx-core

# 添加开发依赖
npm install jest --scope=modernx --dev

# 添加包间依赖
npm install modernx-core --scope=modernx
```

### 包管理

```bash
# 列出所有包
lerna list

# 查看变更的包
lerna changed

# 查看包间依赖关系
lerna ls --graph
```

### 发布管理

```bash
# 交互式版本升级和发布
npm run release

# 发布 beta 版本
npm run release:beta

# 只升级版本号不发布
lerna version
```

### 代码质量

```bash
# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 清理所有构建产物和依赖
npm run clean
```

## 📋 开发流程

### 1. 新功能开发

1. 创建功能分支
   ```bash
   git checkout -b feature/new-feature
   ```

2. 开发和测试
   ```bash
   # 开发模式
   npm run dev -- --scope=modernx
   
   # 运行测试
   npm run test -- --scope=modernx
   ```

3. 构建验证
   ```bash
   npm run build:packages -- modernx
   ```

### 2. Bug 修复

1. 定位问题包
   ```bash
   npm run test -- --scope=modernx-core
   ```

2. 修复并测试
   ```bash
   npm run lint:fix
   npm run test
   ```

### 3. 发布流程

1. 更新版本
   ```bash
   lerna version --conventional-commits
   ```

2. 发布到 npm
   ```bash
   lerna publish from-git
   ```

## 🎯 最佳实践

### 依赖管理

- 使用 workspace 语法引用内部包：`"modernx-core": "*"`
- 避免循环依赖
- 保持依赖版本一致性

### 代码组织

- 每个包保持独立的功能边界
- 共享代码放在 `packages/shared/` 或根目录
- 使用 TypeScript 进行类型定义

### 测试策略

- 每个包都应该有自己的测试
- 集成测试在根目录
- 使用覆盖率报告确保测试质量

### 版本管理

- 使用语义化版本
- 遵循 Conventional Commits 规范
- 独立版本管理，避免不必要的版本升级

## 🛠️ 故障排除

### 常见问题

**Q: 构建失败，提示依赖缺失**
```bash
# 重新安装依赖
npm run clean
npm run bootstrap
```

**Q: 包间依赖不生效**
```bash
# 重新链接包
lerna link
```

**Q: 测试失败，提示模块找不到**
```bash
# 检查包的构建状态
npm run build
npm run test
```

### 调试技巧

1. 使用 `--verbose` 参数查看详细输出
   ```bash
   npm run build -- --verbose
   ```

2. 检查包的依赖关系
   ```bash
   lerna ls --graph
   ```

3. 查看变更的包
   ```bash
   lerna changed
   ```

## 📚 相关文档

- [Lerna 官方文档](https://lerna.js.org/)
- [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更（遵循 Conventional Commits）
4. 运行测试确保通过
5. 提交 Pull Request

### Commit 消息格式

```
type(scope): description

feat(core): add new state management feature
fix(immer): resolve memory leak issue
docs(readme): update installation guide
```

类型说明：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动
