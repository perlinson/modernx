#!/bin/bash

# ModernX GitHub Pages 部署脚本

echo "🚀 开始部署 ModernX GitHub Pages..."

# 进入 website 目录
cd "$(dirname "$0")/website"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建网站
echo "🔨 构建网站..."
npm run build

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位于: $(pwd)/dist"
    echo "🌐 请将 dist 目录内容推送到 gh-pages 分支"
    echo ""
    echo "部署命令："
    echo "  cd dist"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Deploy to GitHub Pages'"
    echo "  git branch -M gh-pages"
    echo "  git remote add origin https://github.com/perlinson/modernx.git"
    echo "  git push -f origin gh-pages"
else
    echo "❌ 构建失败！"
    exit 1
fi

echo "🎉 部署脚本完成！"
