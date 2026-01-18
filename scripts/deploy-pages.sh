#!/bin/bash

echo "🚀 Deploying to GitHub Pages..."

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

# 切换到 gh-pages 分支
echo "📂 切换到 gh-pages 分支..."
git checkout gh-pages

# 从 main 分支合并最新更改
echo "🔄 合并 main 分支的更改..."
git merge main --no-edit

# 如果有冲突，停止部署
if [ $? -ne 0 ]; then
    echo "❌ 合并冲突，请手动解决后重试"
    exit 1
fi

# 推送到 GitHub
echo "📤 推送到 GitHub..."
git push origin gh-pages

# 切换回 main 分支
echo "🔙 切换回 main 分支..."
git checkout main

echo "✅ GitHub Pages 部署完成!"
echo "📖 访问: https://perlinson.github.io/modernx"
