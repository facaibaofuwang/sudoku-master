#!/bin/bash
# Android 应用图标生成脚本
# 需要安装 ImageMagick: sudo apt-get install imagemagick

# 配置
ICON_NAME="ic_launcher"
FOREGROUND_NAME="ic_launcher_foreground"
BACKGROUND_NAME="ic_launcher_background"

# 尺寸配置 (MDPI 基准为 48x48)
declare -A SIZES=(
    ["mdpi"]=48
    ["hdpi"]=72
    ["xhdpi"]=96
    ["xxhdpi"]=144
    ["xxxhdpi"]=192
)

# 创建目录
for density in "${!SIZES[@]}"; do
    mkdir -p "mipmap-${density}"
    mkdir -p "mipmap-${density}-v26"
done

# 检查源文件
if [ ! -f "icon_source.png" ]; then
    echo "错误: 未找到 icon_source.png"
    echo "请提供 1024x1024 的图标源文件"
    exit 1
fi

# 生成各尺寸图标
for density in "${!SIZES[@]}"; do
    size=${SIZES[$density]}
    echo "生成 ${density} (${size}x${size})..."
    
    # 普通图标
    convert icon_source.png -resize ${size}x${size} "mipmap-${density}/${ICON_NAME}.png"
    
    # 圆形图标
    convert icon_source.png -resize ${size}x${size} \
        \( -size ${size}x${size} xc:black -fill white -draw "circle $((${size}/2)),$((${size}/2)) $((${size}/2)),0" \) \
        -alpha off -compose CopyOpacity -composite \
        "mipmap-${density}/${ICON_NAME}_round.png"
done

# 生成 512x512 商店图标
convert icon_source.png -resize 512x512 "play_store_icon.png"

echo "图标生成完成!"
echo "请手动将生成的文件复制到 android/app/src/main/res/ 目录"
