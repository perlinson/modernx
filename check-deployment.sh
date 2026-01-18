#!/bin/bash

# GitHub Pages 部署状态检查脚本

echo "🔍 检查 ModernX GitHub Pages 部署状态..."

# 检查 GitHub Actions 状态
echo "📊 GitHub Actions 状态:"
echo "   请访问: https://github.com/perlinson/modernx/actions"
echo ""

# 检查 GitHub Pages 状态
echo "🌐 GitHub Pages 状态:"
echo "   请访问: https://github.com/perlinson/modernx/pages"
echo ""

# 预期的部署 URL
echo "🎯 预期部署 URL:"
echo "   https://perlinson.github.io/modernx/"
echo ""

# 检查工作流配置
echo "🔧 工作流配置检查:"
if [ -f ".github/workflows/pages.yml" ]; then
    echo "   ✅ pages.yml 工作流文件存在"
    
    # 检查关键配置
    if grep -q "working-directory: ./website" .github/workflows/pages.yml; then
        echo "   ✅ 正确配置了 website 工作目录"
    else
        echo "   ❌ 未正确配置 website 工作目录"
    fi
    
    if grep -q "path: './website/dist'" .github/workflows/pages.yml; then
        echo "   ✅ 正确配置了构建输出路径"
    else
        echo "   ❌ 未正确配置构建输出路径"
    fi
    
    if grep -q "npm run build" .github/workflows/pages.yml; then
        echo "   ✅ 正确配置了构建命令"
    else
        echo "   ❌ 未正确配置构建命令"
    fi
else
    echo "   ❌ pages.yml 工作流文件不存在"
fi
echo ""

# 检查 website 目录结构
echo "📁 Website 目录结构检查:"
if [ -d "website" ]; then
    echo "   ✅ website 目录存在"
    
    if [ -f "website/package.json" ]; then
        echo "   ✅ package.json 存在"
    else
        echo "   ❌ package.json 不存在"
    fi
    
    if [ -f "website/.vuepress/config.js" ]; then
        echo "   ✅ VuePress 配置存在"
    else
        echo "   ❌ VuePress 配置不存在"
    fi
    
    if [ -d "website/packages" ]; then
        echo "   ✅ packages 文档目录存在"
        echo "   📚 包文档数量: $(find website/packages -name "*.md" | wc -l)"
    else
        echo "   ❌ packages 文档目录不存在"
    fi
else
    echo "   ❌ website 目录不存在"
fi
echo ""

# 本地构建测试
echo "🧪 本地构建测试:"
if [ -d "website" ]; then
    echo "   📦 安装依赖..."
    cd website && npm ci --silent > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "   ✅ 依赖安装成功"
        
        echo "   🔨 构建测试..."
        npm run build > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "   ✅ 本地构建成功"
            echo "   📊 构建文件大小: $(du -sh dist | cut -f1)"
            echo "   📄 构建文件数量: $(find dist -type f | wc -l)"
        else
            echo "   ❌ 本地构建失败"
        fi
    else
        echo "   ❌ 依赖安装失败"
    fi
    cd ..
else
    echo "   ❌ website 目录不存在，无法测试"
fi
echo ""

echo "🎉 部署状态检查完成！"
echo ""
echo "📋 下一步操作:"
echo "   1. 查看 GitHub Actions 运行状态"
echo "   2. 等待部署完成"
echo "   3. 访问部署的网站"
echo "   4. 如果失败，检查工作流日志"
