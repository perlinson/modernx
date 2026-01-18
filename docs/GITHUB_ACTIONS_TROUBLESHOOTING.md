# GitHub Actions 故障排除

## 🔍 检查工作流状态

### 1. 验证工作流文件是否在 GitHub 上

访问你的 GitHub 仓库：
1. 进入 https://github.com/perlinson/modernx
2. 点击 **Actions** 标签
3. 查看是否有以下工作流：
   - **CI** (测试工作流)
   - **NPM Publish** (发布工作流)
   - **GitHub Pages** (页面部署工作流)

### 2. 检查工作流文件内容

在 GitHub 仓库中查看：
- `.github/workflows/ci.yml`
- `.github/workflows/npm-publish.yml`
- `.github/workflows/pages.yml`

## 🔧 常见问题和解决方案

### 问题 1: GitHub Actions 未启用

**症状**: Actions 页面显示 "GitHub Actions is disabled"

**解决方案**:
1. 进入仓库设置
2. 点击 **Actions** → **General**
3. 在 "Actions permissions" 中选择 **Allow all actions**
4. 保存设置

### 问题 2: 工作流文件未推送

**症状**: 本地有工作流文件，但 GitHub 上没有

**解决方案**:
```bash
# 强制推送工作流文件
git add .github/workflows/
git commit -m "Add workflow files"
git push origin main --force
```

### 问题 3: 工作流文件语法错误

**症状**: Actions 页面显示工作流错误

**解决方案**:
1. 检查 YAML 语法
2. 使用 YAML 验证工具
3. 修正缩进和格式

### 问题 4: 权限问题

**症状**: 工作流运行但失败

**解决方案**:
1. 检查 Secrets 配置
2. 验证 Token 权限
3. 检查仓库权限设置

## 🚀 手动触发工作流

### 1. 手动触发 CI 工作流

```bash
# 推送代码触发 CI
git commit --allow-empty -m "Trigger CI workflow"
git push origin main
```

### 2. 手动触发发布工作流

```bash
# 创建标签触发发布
git tag v1.0.3
git push origin v1.0.3
```

### 3. 在 GitHub 界面手动触发

1. 进入 **Actions** 标签
2. 选择工作流
3. 点击 **Run workflow**

## 📋 验证清单

### ✅ 基本检查

- [ ] GitHub 仓库存在
- [ ] 工作流文件在 `.github/workflows/` 目录
- [ ] 工作流文件语法正确
- [ ] GitHub Actions 已启用

### ✅ 权限检查

- [ ] 有仓库写入权限
- [ ] Actions 权限已配置
- [ ] Secrets 已设置（如需要）

### ✅ 工作流检查

- [ ] CI 工作流可见
- [ ] 发布工作流可见
- [ ] Pages 工作流可见
- [ ] 工作流可以手动触发

## 🔧 重新设置工作流

如果工作流文件有问题，可以重新创建：

### 1. 备份现有工作流
```bash
mkdir backup
cp .github/workflows/*.yml backup/
```

### 2. 重新创建工作流
```bash
# 删除现有工作流
rm .github/workflows/*.yml

# 重新创建（使用之前的内容）
# 这里会重新创建正确的工作流文件
```

### 3. 推送新工作流
```bash
git add .github/workflows/
git commit -m "Recreate workflow files"
git push origin main
```

## 📞 获取帮助

如果问题仍然存在：

1. **查看 GitHub 文档**: https://docs.github.com/en/actions
2. **检查仓库设置**: 确保所有配置正确
3. **联系 GitHub 支持**: 如果是平台问题

## 🎯 快速测试

### 测试 CI 工作流
```bash
# 创建一个小的更改
echo "test" > test.txt
git add test.txt
git commit -m "Test CI workflow"
git push origin main
```

### 测试发布工作流
```bash
# 创建测试标签
git tag v1.0.3-test
git push origin v1.0.3-test
```

### 清理测试
```bash
# 删除测试文件
git rm test.txt
git commit -m "Clean up test"
git push origin main

# 删除测试标签
git tag -d v1.0.3-test
git push origin :v1.0.3-test
```

---

按照这个指南检查和修复 GitHub Actions 设置！
