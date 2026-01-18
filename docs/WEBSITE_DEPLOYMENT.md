# GitHub Pages 网站部署指南

## 🌐 ModernX 网站部署

ModernX 使用 VuePress 构建文档网站，可以部署到 GitHub Pages。

## 📋 部署方式

### 方法一：自动部署（推荐）

#### 1. GitHub Actions 自动部署

项目已配置 `.github/workflows/pages.yml`，推送到 main 分支时自动部署。

#### 2. 设置 GitHub Pages

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. **Source**: 选择 **GitHub Actions**
4. 保存设置

#### 3. 自动部署流程

```bash
# 推送到 main 分支，自动触发部署
git push origin main
```

### 方法二：手动部署

#### 1. 使用部署脚本

```bash
# 一键部署网站
npm run deploy:website
```

#### 2. 手动部署步骤

```bash
# 1. 构建网站
cd website
npm run build

# 2. 切换到 gh-pages 分支
git checkout gh-pages

# 3. 复制构建文件
rm -rf .vuepress dist
cp -r dist/* .
cp -r .vuepress .

# 4. 添加 .nojekyll 文件
touch .nojekyll

# 5. 提交并推送
git add .
git commit -m "Deploy website"
git push origin gh-pages

# 6. 切换回 main 分支
git checkout main
```

## 🔧 本地开发

### 安装依赖

```bash
cd website
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:8000 查看网站

### 构建网站

```bash
npm run build
```

构建文件在 `dist/` 目录中。

## 📁 网站结构

```
website/
├── .vuepress/          # VuePress 配置
├── dist/               # 构建输出
├── guide/              # 指南文档
├── api/                # API 文档
├── examples/           # 示例文档
├── migration/          # 迁移指南
├── index.md           # 首页
├── package.json        # 依赖配置
└── README.md          # 说明文档
```

## 🎨 网站内容

### 主要页面

- **首页**: 项目介绍和快速开始
- **指南**: 从入门到进阶的完整指南
- **API**: 详细的 API 参考文档
- **示例**: 实际项目示例
- **迁移**: 从其他框架迁移指南

### 导航结构

```javascript
nav: [
  { text: 'Home', link: '/' },
  { text: 'Guide', link: '/guide/' },
  { text: 'API', link: '/api/' },
  { text: 'Examples', link: '/examples/' },
  { text: 'Migration', link: '/migration/' },
  { text: 'GitHub', link: 'https://github.com/perlinson/modernx' }
]
```

### 侧边栏

每个部分都有独立的侧边栏配置，便于导航。

## 🚀 部署配置

### VuePress 配置

```javascript
// website/.vuepress/config.js
module.exports = {
  title: 'ModernX',
  description: 'Modern React state management framework',
  base: '/modernx/',
  dest: 'dist',
  port: 8000,
  // ...其他配置
};
```

### GitHub Pages 设置

#### 自动部署配置

```yaml
# .github/workflows/pages.yml
name: GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './website/dist'
          
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 📊 部署状态检查

### 检查部署状态

1. **GitHub Actions**
   - 进入仓库的 **Actions** 标签
   - 查看 **pages** 工作流状态

2. **GitHub Pages 设置**
   - 进入 **Settings** → **Pages**
   - 查看部署状态和访问链接

3. **手动检查**
```bash
# 检查 gh-pages 分支
git checkout gh-pages
git log --oneline -5
git checkout main

# 检查网站内容
curl -I https://perlinson.github.io/modernx
```

## 🔧 故障排除

### 常见问题

**Q: 部署后 404 错误**
```bash
# 检查分支是否存在
git branch -a

# 检查 GitHub Pages 设置
# 确保选择了正确的分支和目录

# 检查 base 配置
# 确保 base: '/modernx/' 正确
```

**Q: 样式不正确**
```bash
# 检查 .vuepress/config.js
# 确认 base 和 dest 配置正确

# 重新构建
npm run build
```

**Q: 自动部署不工作**
```bash
# 检查 GitHub Actions 权限
# 确保 Actions 有写入权限

# 检查工作流文件
# 确保 .github/workflows/pages.yml 存在
```

**Q: 本地构建正常但部署失败**
```bash
# 清理缓存
rm -rf node_modules .vuepress
npm install
npm run build
```

### 重新部署

如果需要重新部署：

```bash
# 方法一：使用脚本
npm run deploy:website

# 方法二：强制推送
git checkout gh-pages
git push origin gh-pages --force
git checkout main
```

## 📝 维护建议

### 定期任务

1. **更新内容**: 定期更新文档和示例
2. **检查链接**: 确保所有链接指向正确地址
3. **性能优化**: 监控网站加载速度
4. **SEO 优化**: 更新 meta 标签和描述

### 内容更新

```bash
# 1. 编辑文档
vim website/guide/new-feature.md

# 2. 本地预览
cd website && npm run dev

# 3. 部署更新
npm run deploy:website
```

### 版本管理

- 文档版本与代码版本保持同步
- 重要更新时更新版本号
- 使用语义化版本控制

## 🔗 相关链接

- **网站地址**: https://perlinson.github.io/modernx
- **GitHub 仓库**: https://github.com/perlinson/modernx
- **VuePress 文档**: https://vuepress.vuejs.org/
- **GitHub Pages 文档**: https://docs.github.com/en/pages/

## 📋 检查清单

- [ ] GitHub Pages 已启用
- [ ] VuePress 配置正确
- [ ] 网站可以正常访问
- [ ] 所有链接指向正确地址
- [ ] 移动端显示正常
- [ ] 搜索功能正常
- [ ] 自动部署工作正常

完成以上设置后，你的 ModernX 项目就拥有了专业的文档网站！
