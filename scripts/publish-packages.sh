#!/bin/bash

echo "🚀 开始发布 ModernX 包到 npm..."

# 检查当前状态
echo "📋 检查包状态..."
echo "当前用户: $(npm whoami)"
echo ""

# 检查需要发布的包
PACKAGES=("modernx-gui" "modernx-logger")

for pkg in "${PACKAGES[@]}"; do
    echo "📦 检查 $pkg..."
    if npm view "$pkg" >/dev/null 2>&1; then
        echo "✅ $pkg 已发布"
    else
        echo "🔄 发布 $pkg..."
        cd "packages/$pkg"
        npm publish --access public
        cd ../..
        echo "✅ $pkg 发布完成"
    fi
    echo ""
done

echo "🎉 所有包发布完成！"
