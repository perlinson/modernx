# ModernX 发布指南

## 📦 发布包

### 1. 发布前检查

```bash
# 验证项目状态
npm run validate

# 检查工作区依赖
npm run workspaces:status

# 检查循环依赖
npm run workspaces:check

# 运行测试
npm run test
```

### 2. 发布所有包

```bash
# 交互式发布（推荐）
npm run release

# 或者分步执行
lerna version
lerna publish from-git
```

### 3. 发布特定包

```bash
# 只发布特定包
lerna publish --scope modernx-core

# 发布 beta 版本
npm run release:beta

# 只升级版本不发布
lerna version --scope modernx-core
```

### 4. 发布流程

1. **提交代码**: 确保所有更改已提交到 Git
2. **运行测试**: `npm run test`
3. **版本检查**: `lerna changed` 查看哪些包会发布
4. **发布**: `npm run release`
5. **验证**: 检查 npm 上的包是否正确发布

## 🆕 增加新包

### 1. 使用脚本创建（推荐）

```bash
# 创建新包
node scripts/create-package.js modernx-utils

# 示例包名
node scripts/create-package.js modernx-logger
node scripts/create-package.js modernx-storage
node scripts/create-package.js modernx-validator
```

### 2. 手动创建

如果需要手动创建包，请按以下步骤：

#### 2.1 创建目录结构

```bash
mkdir packages/modernx-your-plugin
mkdir packages/modernx-your-plugin/src
mkdir packages/modernx-your-plugin/test
```

#### 2.2 创建 package.json

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

#### 2.3 创建源文件

```javascript
// packages/modernx-your-plugin/src/index.js
export default function yourPlugin(options = {}) {
  return {
    name: 'modernx-your-plugin',
    ...options
  };
};

export const someUtility = () => {
  // 实现功能
};
```

#### 2.4 创建测试文件

```javascript
// packages/modernx-your-plugin/test/index.test.js
import yourPlugin from '../src';

describe('modernx-your-plugin', () => {
  test('should create plugin', () => {
    const plugin = yourPlugin();
    expect(plugin.name).toBe('modernx-your-plugin');
  });
});
```

#### 2.5 创建 README

```markdown
# modernx-your-plugin

ModernX your plugin.

## Installation

```bash
npm install modernx-your-plugin
```

## Usage

```javascript
import yourPlugin from 'modernx-your-plugin';

const app = createApp({
  plugins: [yourPlugin()]
});
```
```

### 3. 链接和测试新包

```bash
# 链接工作区依赖
npm run workspaces:link

# 测试新包
npm run test -- --scope modernx-your-plugin

# 构建新包
npm run build -- --scope modernx-your-plugin
```

## 🔄 版本管理

### 版本策略

- **独立版本**: 每个包独立管理版本
- **语义化版本**: 遵循 SemVer 规范
- **自动版本**: 基于 conventional commits 自动生成版本号

### 版本命令

```bash
# 查看变更的包
lerna changed

# 升级特定包版本
lerna version --scope modernx-core --patch
lerna version --scope modernx-core --minor
lerna version --scope modernx-core --major

# 升级所有包版本
lerna version --conventional-commits
```

## 🛠️ 开发工作流

### 1. 开发新功能

```bash
# 创建功能分支
git checkout -b feature/new-plugin

# 开发和测试
npm run workspaces:link
npm run test

# 提交代码
git add .
git commit -m "feat: add new plugin"

# 发布
npm run release
```

### 2. 修复 Bug

```bash
# 创建修复分支
git checkout -b fix/plugin-bug

# 修复和测试
npm run test

# 提交修复
git commit -m "fix: resolve plugin bug"

# 发布补丁版本
lerna version --patch
lerna publish
```

### 3. 更新依赖

```bash
# 检查过时依赖
npm run dependencies:check

# 更新依赖
npm run dependencies:fix

# 同步工作区依赖
npm run dependencies:workspace
```

## 📋 发布检查清单

### 发布前检查

- [ ] 所有测试通过
- [ ] 代码检查通过
- [ ] 文档已更新
- [ ] CHANGELOG 已更新
- [ ] 版本号正确
- [ ] 依赖关系正确

### 发布后验证

- [ ] npm 包已发布
- [ ] 版本号正确
- [ ] 文档网站已更新
- [ ] 示例项目正常工作

## 🚨 注意事项

### 1. 版本兼容性

- 确保新版本向后兼容
- 更新 peerDependencies 版本范围
- 测试与主包的兼容性

### 2. 依赖管理

- 使用工作区依赖语法 `*`
- 避免循环依赖
- 定期更新依赖

### 3. 发布权限

确保有 npm 发布权限：
- `@perlinson/modernx` 组织下的包
- 配置正确的 npm token

### 4. 回滚策略

如果发布出现问题：
```bash
# 废弃有问题的版本
npm deprecate modernx-your-plugin@1.0.0 "Critical bug, use 1.0.1 instead"

# 发布修复版本
lerna version --patch
lerna publish
```

## 📚 相关文档

- [Lerna 文档](https://lerna.js.org/)
- [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [语义化版本](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
