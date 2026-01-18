# ModernX 快速参考指南

## 📦 发布包

### 快速发布
```bash
# 发布所有包
npm run release

# 发布 beta 版本
npm run release:beta

# 发布特定包
lerna publish --scope modernx-core
```

### 发布前检查
```bash
npm run validate
npm run test
npm run workspaces:check
```

## 🆕 创建新包

### 使用脚本创建（推荐）
```bash
# 创建新包
npm run create:package modernx-utils

# 示例
npm run create:package modernx-logger
npm run create:package modernx-storage
npm run create:package modernx-validator
```

### 手动创建
```bash
# 创建目录
mkdir packages/modernx-your-plugin
mkdir packages/modernx-your-plugin/src
mkdir packages/modernx-your-plugin/test

# 创建 package.json（参考现有包）
cp packages/modernx-core/package.json packages/modernx-your-plugin/
# 编辑包名和配置
```

## 🔧 常用命令

### 工作区管理
```bash
npm run workspaces:status    # 检查状态
npm run workspaces:link      # 链接依赖
npm run workspaces:check     # 检查循环依赖
npm run workspaces:graph     # 显示依赖图
```

### 依赖管理
```bash
npm run dependencies:check  # 检查过时依赖
npm run dependencies:fix     # 更新依赖
npm run dependencies:workspace  # 同步工作区
npm run dependencies:audit   # 安全审计
```

### 构建和测试
```bash
npm run build               # 构建所有包
npm run build:packages modernx-core  # 构建特定包
npm run build:since         # 构建变更的包
npm run test                # 测试所有包
npm run test:coverage       # 生成覆盖率
```

### 验证
```bash
npm run validate            # 完整验证
npm run validate:structure   # 验证包结构
npm run validate:dependencies # 验证依赖关系
npm run validate:circular    # 检查循环依赖
```

### 清理
```bash
npm run clean               # 清理所有
npm run clean:build         # 清理构建产物
```

## 📋 包结构模板

### 标准包结构
```
packages/modernx-your-plugin/
├── package.json          # 包配置
├── README.md             # 包文档
├── index.js              # 主入口
├── index.d.ts            # TypeScript 定义
├── src/                  # 源代码
│   └── index.js
├── test/                 # 测试文件
│   └── index.test.js
├── dist/                 # 构建输出（自动生成）
└── lib/                  # 构建输出（自动生成）
```

### package.json 模板
```json
{
  "name": "modernx-your-plugin",
  "version": "1.0.0",
  "description": "ModernX your plugin",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "index.d.ts",
  "sideEffects": false,
  "files": ["dist", "src", "index.d.ts"],
  "repository": {
    "type": "git",
    "url": "https://github.com/perlinson/modernx",
    "directory": "packages/modernx-your-plugin"
  },
  "keywords": ["modernx", "modernx-plugin", "your-plugin"],
  "author": "perlinson <perlinson2024@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "@babel/runtime": "^7.20.0"
  },
  "peerDependencies": {
    "modernx": "^1.0.0"
  },
  "devDependencies": {
    "modernx": "*"
  },
  "scripts": {
    "build": "father-build",
    "test": "jest",
    "lint": "eslint src"
  }
}
```

## 🚀 开发流程

### 1. 创建新功能
```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 创建新包（如果需要）
npm run create:package modernx-new-feature

# 3. 开发和测试
npm run workspaces:link
npm run test -- --scope modernx-new-feature

# 4. 提交代码
git add .
git commit -m "feat: add new feature plugin"

# 5. 发布
npm run release
```

### 2. 修复 Bug
```bash
# 1. 创建修复分支
git checkout -b fix/plugin-bug

# 2. 修复和测试
npm run test

# 3. 提交修复
git commit -m "fix: resolve plugin bug"

# 4. 发布补丁版本
lerna version --patch
lerna publish
```

## 📊 当前包列表

### 核心包
- **modernx**: 主包，包含所有功能
- **modernx-core**: 核心功能包
- **modernx-immer**: Immer 集成包
- **modernx-loading**: Loading 状态包

### 工具包
- **modernx-cli**: 命令行工具

## 🔍 故障排除

### 常见问题

**Q: 构建失败**
```bash
# 清理并重新构建
npm run clean:build
npm run bootstrap
npm run build
```

**Q: 依赖问题**
```bash
# 重新链接依赖
npm run workspaces:link
npm run dependencies:workspace
```

**Q: 发布失败**
```bash
# 检查权限和状态
npm run validate
lerna changed
```

**Q: 循环依赖**
```bash
# 检查依赖图
npm run workspaces:graph
npm run workspaces:check
```

### 调试技巧
```bash
# 详细输出
npm run build -- --verbose

# 检查特定包
npm run test -- --scope modernx-core

# 干运行
npm run dependencies:fix --dry-run
```

## 📚 更多文档

- [完整发布指南](./PUBLISHING_GUIDE_NEW.md)
- [Monorepo 工作流](./MONOREPO_WORKFLOW.md)
- [Monorepo 总结](./MONOREPO_SUMMARY.md)
- [DVA 迁移记录](./DVA_TO_MODERNX_MIGRATION.md)
