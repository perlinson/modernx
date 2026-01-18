# 自动化发布指南

## 🚀 GitHub Actions 自动发布到 NPM

本指南介绍如何设置 GitHub Actions 工作流，实现代码推送后自动发布到 NPM registry。

## 📋 前置条件

### 1. NPM 账号和 Token
- 拥有 NPM 账号
- 创建 NPM Access Token
- Token 需要有发布权限

### 2. GitHub 仓库
- 代码已推送到 GitHub
- 有仓库的写入权限

## 🔧 设置步骤

### 1. 创建 NPM Token

1. 登录 [NPM](https://www.npmjs.com)
2. 进入 **Account Settings** → **Access Tokens**
3. 点击 **Generate New Token**
4. 选择 **Automation** 类型
5. 复制生成的 Token

### 2. 配置 GitHub Secrets

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 Secrets：

#### NPM_TOKEN
- **Name**: `NPM_TOKEN`
- **Value**: 你的 NPM Access Token

#### GITHUB_TOKEN
- **Name**: `GITHUB_TOKEN`
- **Value**: 自动提供，无需手动设置

### 3. 工作流文件

项目已包含以下工作流文件：

#### `.github/workflows/ci.yml`
- **触发条件**: 推送到 main 分支或 PR
- **功能**: 运行测试、构建、验证
- **不发布**: 仅用于 CI/CD

#### `.github/workflows/npm-publish.yml`
- **触发条件**: 推送版本标签 (v*)
- **功能**: 自动发布到 NPM
- **包含**: 构建、发布、创建 Release

## 🎮 使用方法

### 方法一：使用发布脚本（推荐）

```bash
# 补丁版本 (1.0.2 -> 1.0.3)
npm run release:patch

# 次要版本 (1.0.2 -> 1.1.0)
npm run release:minor

# 主要版本 (1.0.2 -> 2.0.0)
npm run release:major

# 指定版本
npm run release 1.0.3
```

### 方法二：手动操作

```bash
# 1. 更新版本
node scripts/release-version.js patch

# 2. 推送标签（自动触发发布）
git push origin main
git push origin v1.0.3
```

### 方法三：直接创建标签

```bash
# 1. 手动更新版本
# 编辑所有 package.json 文件

# 2. 提交更改
git add .
git commit -m "chore: bump version to 1.0.3"

# 3. 创建标签
git tag v1.0.3

# 4. 推送
git push origin main
git push origin v1.0.3
```

## 🔄 自动化流程

### 发布流程图

```
开发者运行发布脚本
        ↓
更新所有包版本
        ↓
构建所有包
        ↓
提交更改到 Git
        ↓
创建版本标签
        ↓
推送到 GitHub
        ↓
GitHub Actions 触发
        ↓
构建和测试
        ↓
发布到 NPM
        ↓
创建 GitHub Release
        ↓
完成 ✅
```

### 工作流详情

#### 1. CI 工作流 (ci.yml)
```yaml
触发: push 到 main 分支或 PR
执行:
  - 安装依赖
  - 构建包
  - 运行测试
  - 验证 monorepo
  - 上传覆盖率报告
```

#### 2. 发布工作流 (npm-publish.yml)
```yaml
触发: 推送 v* 标签
执行:
  - 检出代码
  - 设置 Node.js
  - 安装依赖
  - 构建包
  - 按顺序发布到 NPM
  - 验证发布
  - 创建 GitHub Release
```

## 📦 发布顺序

由于包之间存在依赖关系，必须按以下顺序发布：

1. **modernx-core** (无依赖)
2. **modernx-immer** (依赖 modernx)
3. **modernx-loading** (依赖 modernx, modernx-core)
4. **modernx** (依赖 modernx-core)

## 🔍 监控发布

### 1. GitHub Actions
- 访问仓库的 **Actions** 标签
- 查看 **npm-publish** 工作流
- 监控执行状态和日志

### 2. NPM 包状态
```bash
# 检查包版本
npm view modernx version
npm view modernx-core version
npm view modernx-immer version
npm view modernx-loading version

# 检查发布时间
npm view modernx time
```

### 3. GitHub Release
- 访问仓库的 **Releases** 页面
- 查看自动创建的 Release
- 检查 Release 说明和链接

## ⚠️ 故障排除

### 常见问题

#### 1. NPM Token 过期
```bash
# 症状: 403 Forbidden 错误
# 解决: 更新 NPM_TOKEN Secret
```

#### 2. 发布权限不足
```bash
# 症状: 403 Unauthorized 错误
# 解决: 检查 NPM 账号权限和 Token 权限
```

#### 3. 版本冲突
```bash
# 症状: 403 Conflict 错误
# 解决: 检查版本号是否已存在
npm view modernx@1.0.3
```

#### 4. 构建失败
```bash
# 症状: 构建错误
# 解决: 检查 CI 工作流日志，修复构建问题
```

### 调试技巧

#### 1. 本地测试
```bash
# 本地运行发布脚本测试
node scripts/release-version.js patch --dry-run
```

#### 2. 手动发布测试
```bash
# 手动发布单个包测试
cd packages/modernx-core
npm publish --dry-run
```

#### 3. 工作流调试
```bash
# 在 GitHub Actions 中添加调试步骤
- name: Debug
  run: |
    echo "Current directory: $(pwd)"
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
```

## 🎯 最佳实践

### 1. 版本管理
- 使用语义化版本控制
- 补丁版本用于 bug 修复
- 次要版本用于新功能
- 主要版本用于破坏性更改

### 2. 发布前检查
- 运行完整测试套件
- 检查构建是否成功
- 验证文档是否更新
- 确认 CHANGELOG 已更新

### 3. 发布后验证
- 检查 NPM 包是否正确发布
- 验证 GitHub Release 是否创建
- 测试安装新版本
- 更新文档网站

### 4. 安全考虑
- 定期轮换 NPM Token
- 使用最小权限原则
- 监控异常发布活动
- 保护 GitHub 分支

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [NPM 发布文档](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [语义化版本](https://semver.org/)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

## 🔗 快速参考

### 发布命令
```bash
# 补丁版本
npm run release:patch

# 次要版本
npm run release:minor

# 主要版本
npm run release:major

# 指定版本
npm run release 1.0.3
```

### 监控命令
```bash
# 检查 Actions 状态
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/perlinson/modernx/actions/workflows

# 检查 NPM 包
npm view modernx
npm view modernx-core
npm view modernx-immer
npm view modernx-loading
```

---

设置完成后，你就可以通过简单的命令实现自动化发布到 NPM 了！🚀
