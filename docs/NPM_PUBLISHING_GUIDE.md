# NPM 发布指南

## 🚀 发布 ModernX 包到 NPM

本指南将帮助你将 ModernX 包发布到 NPM registry。

## 📋 发布前检查清单

### 1. 环境准备

- [ ] 已安装 Node.js (>=16.0.0)
- [ ] 已注册 NPM 账号
- [ ] 已登录 NPM (`npm login`)
- [ ] 已配置正确的 package.json

### 2. 包验证

- [ ] 所有包已构建 (`npm run build`)
- [ ] 版本号正确
- [ ] 依赖关系正确
- [ ] 测试通过
- [ ] 文档完整

### 3. 发布配置

- [ ] package.json 配置正确
- [ ] files 字段包含必要文件
- [ ] repository 信息正确
- [ ] license 信息正确

## 🔧 发布步骤

### 1. 登录 NPM

```bash
# 登录 NPM
npm login

# 输入用户名、密码和邮箱
# 如果启用了 2FA，需要输入一次性密码
```

### 2. 验证登录状态

```bash
# 检查登录状态
npm whoami

# 检查包名是否可用
npm view modernx
```

### 3. 构建包

```bash
# 构建所有包
npm run build

# 或者单独构建
cd packages/modernx && npx father-build
cd packages/modernx-core && npx father-build
cd packages/modernx-immer && npx father-build
cd packages/modernx-loading && npx father-build
```

### 4. 验证包内容

```bash
# 检查包内容
cd packages/modernx
npm pack --dry-run

# 检查其他包
cd ../modernx-core && npm pack --dry-run
cd ../modernx-immer && npm pack --dry-run
cd ../modernx-loading && npm pack --dry-run
```

### 5. 发布包

#### 方法一：使用 Lerna（推荐）

```bash
# 发布所有包
npx lerna publish

# 或者使用项目脚本
npm run release
```

#### 方法二：单独发布

```bash
# 发布 modernx-core（先发布依赖）
cd packages/modernx-core
npm publish

# 发布 modernx-immer
cd ../modernx-immer
npm publish

# 发布 modernx-loading
cd ../modernx-loading
npm publish

# 发布 modernx（主包）
cd ../modernx
npm publish
```

## 📦 发布顺序

由于包之间存在依赖关系，必须按以下顺序发布：

1. **modernx-core** - 核心包，无内部依赖
2. **modernx-immer** - 依赖 modernx
3. **modernx-loading** - 依赖 modernx 和 modernx-core
4. **modernx** - 主包，依赖 modernx-core

## 🔍 验证发布

### 1. 检查 NPM 上的包

```bash
# 检查包信息
npm view modernx
npm view modernx-core
npm view modernx-immer
npm view modernx-loading

# 检查版本
npm view modernx version
```

### 2. 测试安装

```bash
# 创建测试目录
mkdir test-modernx && cd test-modernx

# 初始化项目
npm init -y

# 测试安装
npm install modernx
npm install modernx-core
npm install modernx-immer
npm install modernx-loading

# 测试导入
node -e "console.log(require('modernx'))"
```

## 🛠️ 常见问题

### Q: 发布失败，提示包名已存在

```bash
# 检查包名是否被占用
npm view modernx

# 如果被占用，需要更换包名
# 修改 package.json 中的 name 字段
```

### Q: 发布失败，提示权限不足

```bash
# 检查登录状态
npm whoami

# 重新登录
npm logout
npm login

# 检查包的所有权
npm owner ls modernx
```

### Q: 发布失败，提示文件过大

```bash
# 检查 .npmignore 文件
# 确保排除不必要的文件

# 检查 package.json 的 files 字段
# 只包含必要的文件
```

### Q: 发布失败，提示版本冲突

```bash
# 检查当前版本
npm view modernx version

# 更新版本号
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## 🔄 版本管理

### 语义化版本

- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

### 版本升级命令

```bash
# 自动升级版本
npm version patch    # 修复版本
npm version minor    # 功能版本
npm version major    # 破坏性更新

# 手动指定版本
npm version 1.0.1
```

### 发布预发布版本

```bash
# 发布 alpha 版本
npm version 1.0.1-alpha.0
npm publish --tag alpha

# 发布 beta 版本
npm version 1.0.1-beta.0
npm publish --tag beta

# 发布 rc 版本
npm version 1.0.1-rc.0
npm publish --tag rc
```

## 📊 发布后操作

### 1. 更新文档

- 更新 README.md
- 更新 CHANGELOG.md
- 更新网站文档

### 2. 创建 GitHub Release

```bash
# 创建 Git 标签
git tag v1.0.1
git push origin v1.0.1

# 在 GitHub 上创建 Release
# 访问 https://github.com/perlinson/modernx/releases/new
```

### 3. 通知用户

- 在项目中发布公告
- 更新 CHANGELOG
- 发送社区通知

## 🎯 最佳实践

### 1. 发布前测试

```bash
# 运行所有测试
npm test

# 检查代码质量
npm run lint

# 验证构建
npm run build
```

### 2. 使用 .npmignore

```gitignore
# .npmignore
src/
test/
*.test.js
*.config.js
.gitignore
.github/
.vscode/
.DS_Store
```

### 3. 配置 package.json

```json
{
  "name": "modernx",
  "version": "1.0.1",
  "description": "Modern React state management framework",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "index.d.ts",
  "files": [
    "dist",
    "src",
    "index.d.ts"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/perlinson/modernx.git"
  },
  "keywords": [
    "react",
    "state-management",
    "redux",
    "modernx"
  ],
  "author": "perlinson <perlinson2024@gmail.com>",
  "license": "MIT",
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## 📚 相关资源

- [NPM 文档](https://docs.npmjs.com/)
- [语义化版本](https://semver.org/)
- [Lerna 文档](https://lerna.js.org/)
- [ModernX 项目](https://github.com/perlinson/modernx)

## 📋 快速发布命令

```bash
# 完整发布流程
npm run build
npm run test
npm run release

# 单独发布包
cd packages/modernx-core
npm publish

# 检查发布状态
npm view modernx
```

发布完成后，你的 ModernX 包就可以被全球开发者使用了！🎉
