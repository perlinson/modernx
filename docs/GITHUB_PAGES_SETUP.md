# GitHub Pages 设置指南

## 🌐 GitHub Pages 配置

ModernX 项目已配置好 GitHub Pages，可以自动部署文档网站。

### 📋 当前配置

#### 1. 分支结构
- **main**: 主开发分支
- **gh-pages**: GitHub Pages 发布分支

#### 2. 自动部署
- GitHub Actions 工作流自动部署
- 推送到 main 分支时触发部署
- 手动部署脚本可用

## 🚀 部署方式

### 方法一：自动部署（推荐）

1. **推送到 GitHub**
```bash
git push origin main
```

2. **GitHub Actions 自动运行**
- 检测到 main 分支的推送
- 自动构建和部署到 GitHub Pages
- 几分钟后可在以下地址访问：
  - https://perlinson.github.io/modernx

### 方法二：手动部署

1. **运行部署脚本**
```bash
npm run deploy:pages
```

2. **手动步骤**
```bash
# 切换到 gh-pages 分支
git checkout gh-pages

# 合并 main 分支的更改
git merge main

# 推送到 GitHub
git push origin gh-pages

# 切换回 main 分支
git checkout main
```

## ⚙️ GitHub 设置

### 1. 启用 GitHub Pages

1. 进入 GitHub 仓库
2. 点击 **Settings**
3. 滚动到 **Pages** 部分
4. **Source**: 选择 **Deploy from a branch**
5. **Branch**: 选择 `gh-pages` 和 `/ (root)`
6. 点击 **Save**

### 2. 配置 GitHub Actions

仓库已包含 `.github/workflows/pages.yml` 文件，配置了：
- 自动构建和部署
- 正确的权限设置
- 并发控制

### 3. 自定义域名（可选）

如果需要自定义域名：

1. 在 `gh-pages` 分支创建 `CNAME` 文件：
```bash
echo "your-domain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin gh-pages
```

2. 在 GitHub Pages 设置中配置域名

## 📊 网站内容

### 当前页面功能

- **响应式设计**: 适配桌面和移动设备
- **现代 UI**: 渐变背景、卡片布局、悬停效果
- **功能展示**: React 18 特性、TypeScript 支持、插件系统
- **快速开始**: 安装和使用指南
- **链接导航**: GitHub、文档、示例、贡献指南

### 页面结构

```html
index.html                 # 主页面
├── Header                 # 顶部导航
├── Feature Cards          # 功能卡片
├── Key Features          # 核心特性
├── Installation Guide    # 安装指南
├── More Resources        # 更多资源
└── Footer                # 底部信息
```

## 🛠️ 自定义网站

### 修改内容

1. **编辑主页**
```bash
# 编辑 index.html
vim index.html

# 提交更改
git add index.html
git commit -m "Update homepage"
git push origin main
```

2. **添加新页面**
```bash
# 在 gh-pages 分支添加新文件
git checkout gh-pages
echo "New page content" > new-page.html
git add new-page.html
git commit -m "Add new page"
git push origin gh-pages
git checkout main
```

### 更新样式

主页使用内联 CSS，可以直接在 `index.html` 中修改：
- 颜色主题
- 布局结构
- 字体和间距
- 动画效果

## 📈 监控部署

### 检查部署状态

1. **GitHub Actions**
   - 进入仓库的 **Actions** 标签
   - 查看 **pages** 工作流状态

2. **Pages 设置**
   - 进入 **Settings** → **Pages**
   - 查看部署状态和访问链接

3. **手动检查**
```bash
# 检查 gh-pages 分支
git checkout gh-pages
git log --oneline -5
git checkout main
```

## 🔧 故障排除

### 常见问题

**Q: 部署后页面 404**
```bash
# 检查分支是否存在
git branch -a

# 检查 GitHub Pages 设置
# 确保选择了正确的分支和目录
```

**Q: 样式不正确**
```bash
# 检查文件路径
git checkout gh-pages
ls -la
git checkout main
```

**Q: 自动部署不工作**
```bash
# 检查 GitHub Actions 权限
# 确保 Actions 有写入权限
```

### 重新部署

如果需要重新部署：

```bash
# 方法一：使用脚本
npm run deploy:pages

# 方法二：手动操作
git checkout gh-pages
git merge main
git push origin gh-pages --force
git checkout main
```

## 📝 维护建议

### 定期任务

1. **更新内容**: 定期更新主页内容和特性
2. **检查链接**: 确保所有链接指向正确的地址
3. **性能优化**: 监控页面加载速度
4. **SEO 优化**: 更新 meta 标签和描述

### 备份策略

- gh-pages 分支自动包含在 git 历史中
- 定期备份重要的自定义内容
- 使用 GitHub 的版本控制功能

## 🔗 相关链接

- **GitHub Pages**: https://perlinson.github.io/modernx
- **GitHub 仓库**: https://github.com/perlinson/modernx
- **Actions 工作流**: https://github.com/perlinson/modernx/actions
- **Pages 文档**: https://docs.github.com/en/pages

## 📋 检查清单

- [ ] GitHub Pages 已启用
- [ ] gh-pages 分支存在
- [ ] GitHub Actions 工作流配置正确
- [ ] 首次部署已完成
- [ ] 网站可以正常访问
- [ ] 所有链接指向正确地址
- [ ] 移动端显示正常
- [ ] 自定义域名（如需要）

完成以上设置后，你的 ModernX 项目就拥有了专业的文档网站！
