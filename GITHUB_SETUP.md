# GitHub 仓库设置和推送指南

## 🚀 创建 GitHub 仓库

### 1. 访问 GitHub
打开: https://github.com/new

### 2. 仓库设置
- **Repository name**: `modernx` 或 `modernx-react18`
- **Description**: `React 18 enhanced modernx framework with concurrent features`
- **Visibility**: Public (推荐)
- **不要勾选** "Initialize with README"
- **不要勾选** "Add .gitignore"
- **不要勾选** "Choose a license"

### 3. 创建仓库
点击 "Create repository"

## 📦 推送代码

创建仓库后，运行以下命令：

```bash
# 推送到你的仓库
git push origin master
```

如果遇到权限问题，可能需要设置 GitHub token：

```bash
# 设置 GitHub token (推荐使用 Personal Access Token)
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/perlinson/modernx.git
git push origin master
```

## 🔧 替代方案: 使用 SSH

如果配置了 SSH key：

```bash
# 切换到 SSH
git remote set-url origin git@github.com:perlinson/modernx.git
git push origin master
```

## 📋 推送完成后

### 1. 验证仓库
访问: https://github.com/perlinson/modernx

### 2. 设置 GitHub Pages (可选)
- 进入仓库设置
- 找到 "Pages" 选项
- 选择 "Deploy from a branch"
- 选择 `main` 分支和 `root` 目录
- 保存后访问: https://perlinson.github.io/modernx

### 3. 更新 package.json
确保 package.json 中的仓库地址正确：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/perlinson/modernx.git"
  },
  "homepage": "https://github.com/perlinson/modernx#readme",
  "bugs": {
    "url": "https://github.com/perlinson/modernx/issues"
  }
}
```

## 🎯 下一步

推送完成后，你可以：

1. **发布到 npm**: 使用 granular token
2. **设置 GitHub Actions**: 自动化 CI/CD
3. **配置 GitHub Pages**: 部署文档网站
4. **创建 Release**: 标记版本发布

## 📞 如果遇到问题

1. **权限错误**: 检查 GitHub token 权限
2. **仓库不存在**: 确认仓库名称正确
3. **网络问题**: 检查网络连接和代理设置

## 🎉 完成！

推送成功后，你的 modernx-react18 项目就托管在 GitHub 上了！
