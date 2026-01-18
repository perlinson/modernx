# GitHub 仓库设置指南

## 🚀 新仓库设置

### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并创建新仓库
2. 仓库名称：`modernx`
3. 描述：`Modern React state management framework with concurrent features`
4. 选择 **Public** 或 **Private**
5. **不要** 初始化 README、.gitignore 或 license（我们已经有了）

### 2. 连接本地仓库到 GitHub

```bash
# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/perlinson/modernx.git

# 推送到 GitHub
git push -u origin main
```

### 3. 设置仓库信息

更新 `package.json` 中的仓库信息：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/perlinson/modernx.git"
  },
  "bugs": {
    "url": "https://github.com/perlinson/modernx/issues"
  },
  "homepage": "https://github.com/perlinson/modernx#readme"
}
```

### 4. 更新各包的仓库信息

每个包的 `package.json` 中的 repository 字段应该指向正确的目录：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/perlinson/modernx.git",
    "directory": "packages/modernx-core"
  }
}
```

## 🔧 GitHub 功能设置

### 1. Issues 和 Pull Requests

- 启用 Issues
- 启用 Pull Requests
- 设置 Issue 模板
- 设置 PR 模板

### 2. Branch Protection

在 GitHub 仓库设置中：

1. 进入 **Settings** → **Branches**
2. 点击 **Add rule**
3. 选择 **main** 分支
4. 启用：
   - **Require pull request reviews before merging**
   - **Require status checks to pass before merging**
   - **Require branches to be up to date before merging**

### 3. Actions 工作流

创建 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Bootstrap packages
      run: npm run bootstrap
    
    - name: Run tests
      run: npm run test
    
    - name: Validate monorepo
      run: npm run validate
    
    - name: Build packages
      run: npm run build
```

### 4. Release 工作流

创建 `.github/workflows/release.yml`：

```yaml
name: Release

on:
  push:
    branches: [ main ]

jobs:
  release:
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, 'skip ci')"
    
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
        token: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        registry-url: 'https://registry.npmjs.org'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Bootstrap packages
      run: npm run bootstrap
    
    - name: Build packages
      run: npm run build
    
    - name: Release packages
      run: npm run release
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 🔐 Secrets 配置

在 GitHub 仓库设置中添加以下 Secrets：

### 1. NPM Token
- **Name**: `NPM_TOKEN`
- **Value**: 你的 npm access token

获取 npm token：
1. 访问 [npmjs.com](https://www.npmjs.com)
2. 进入 **Account Settings** → **Access Tokens**
3. 创建新的 **Automation** token
4. 复制 token 并添加到 GitHub Secrets

### 2. GitHub Token
- **Name**: `GITHUB_TOKEN`
- **Value**: 自动提供，无需手动设置

## 📝 README 更新

确保 README.md 中的徽章和链接指向正确的仓库：

```markdown
[![codecov](https://codecov.io/gh/perlinson/modernx/branch/master/graph/badge.svg)](https://codecov.io/gh/perlinson/modernx)
[![CircleCI](https://circleci.com/gh/perlinson/modernx.svg?style=svg)](https://circleci.com/gh/perlinson/modernx)
[![NPM version](https://img.shields.io/npm/v/modernx.svg?style=flat)](https://npmjs.org/package/modernx)
```

## 🚀 首次发布

### 1. 登录 npm
```bash
npm login
```

### 2. 发布包
```bash
npm run release
```

### 3. 验证发布
访问 [npm](https://www.npmjs.com/package/modernx) 确认包已发布。

## 📊 仓库统计

设置完成后，你可以在 GitHub 仓库中看到：
- 代码统计
- 提交历史
- Issues 和 PR
- Release 版本
- CI/CD 状态

## 🔗 相关链接

- [GitHub 仓库](https://github.com/perlinson/modernx)
- [npm 包页面](https://www.npmjs.com/package/modernx)
- [文档网站](https://perlinson.github.io/modernx)
- [CI/CD 配置](https://github.com/perlinson/modernx/actions)

## 📋 检查清单

- [ ] GitHub 仓库已创建
- [ ] 远程仓库已连接
- [ ] 仓库信息已更新
- [ ] CI/CD 工作流已配置
- [ ] Secrets 已设置
- [ ] 首次发布已完成
- [ ] README 链接已更新
- [ ] 分支保护已启用

完成以上步骤后，你的 ModernX 项目就完全设置好了！
