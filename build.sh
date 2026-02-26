#!/bin/bash

echo "🎮 数独大师 - 构建脚本"
echo "======================"

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建 Web
echo "🔨 构建 Web 版本..."
npm run build

# 同步到 Android
echo "📱 同步到 Android 项目..."
npx cap sync android

echo ""
echo "✅ 构建完成！"
echo ""
echo "运行方式:"
echo "  1. Web 预览: npm run dev"
echo "  2. Android Studio: npx cap open android"
echo "  3. 命令行构建: cd android && ./gradlew assembleDebug"
echo ""
echo "APK 输出: android/app/build/outputs/apk/debug/app-debug.apk"
