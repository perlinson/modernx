#!/bin/bash

echo "🚀 部署 ModernX 网站到 GitHub Pages..."

# 确保在正确的分支上
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ 请在 main 分支上执行此脚本"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 请先提交所有更改"
    exit 1
fi

# 进入 website 目录
echo "📂 进入 website 目录..."
cd website

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建网站
echo "🔨 构建网站..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，未找到 dist 目录"
    exit 1
fi

# 切换到 gh-pages 分支
echo "📂 切换到 gh-pages 分支..."
git checkout gh-pages

# 清理旧文件
echo "🧹 清理旧文件..."
rm -rf .vuepress dist

# 复制构建文件
echo "📋 复制构建文件..."
cp -r dist/* .
cp -r .vuepress .

# 添加 .nojekyll 文件（GitHub Pages 需要）
echo "📄 添加 .nojekyll 文件..."
touch .nojekyll

# 添加并提交
echo "📝 提交更改..."
git add .
git commit -m "Deploy website - $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到 GitHub
echo "📤 推送到 GitHub..."
git push origin gh-pages

# 切换回 main 分支
echo "🔙 切换回 main 分支..."
git checkout main

echo "✅ 网站部署完成!"
echo "📖 访问: https://perlinson.github.io/modernx"
echo "⏳ 等待 1-2 分钟让 GitHub Pages 更新..."
