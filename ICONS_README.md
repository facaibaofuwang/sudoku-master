# 数独大师 - 图标资源说明

## 📁 生成的图标文件

### Android 应用图标

所有图标已自动生成并放置在 `android/app/src/main/res/` 目录下：

| 密度 | 尺寸 | 文件路径 |
|------|------|----------|
| mdpi | 48x48 | `mipmap-mdpi/ic_launcher.png` |
| mdpi | 48x48 | `mipmap-mdpi/ic_launcher_round.png` |
| hdpi | 72x72 | `mipmap-hdpi/ic_launcher.png` |
| hdpi | 72x72 | `mipmap-hdpi/ic_launcher_round.png` |
| xhdpi | 96x96 | `mipmap-xhdpi/ic_launcher.png` |
| xhdpi | 96x96 | `mipmap-xhdpi/ic_launcher_round.png` |
| xxhdpi | 144x144 | `mipmap-xxhdpi/ic_launcher.png` |
| xxhdpi | 144x144 | `mipmap-xxhdpi/ic_launcher_round.png` |
| xxxhdpi | 192x192 | `mipmap-xxxhdpi/ic_launcher.png` |
| xxxhdpi | 192x192 | `mipmap-xxxhdpi/ic_launcher_round.png` |

### Google Play 商店素材

| 用途 | 尺寸 | 文件 | 位置 |
|------|------|------|------|
| 商店图标 | 512x512 | `play_store_icon.png` | 项目根目录 |
| 特色图片 | 1024x500 | `feature_graphic.png` | 项目根目录 |
| 高分辨率源文件 | 1024x1024 | `icon_source_1024.png` | 项目根目录 |

### 截图模板

| 用途 | 尺寸 | 文件 |
|------|------|------|
| 首页截图 | 1080x1920 | `screenshot_home.png` |
| 游戏界面截图 | 1080x1920 | `screenshot_game.png` |
| 完成界面截图 | 1080x1920 | `screenshot_complete.png` |

---

## 🎨 图标设计说明

### 设计理念
- **风格**: 现代简约风格
- **主色调**: 蓝紫渐变 (#4f46e5 → #7c3aed → #2563eb)
- **元素**: 3x3 数独网格，填充部分数字
- **形状**: 圆形图标，带有圆角矩形网格

### 颜色代码
```
主色: #4f46e5 (靛蓝)
辅色: #7c3aed (紫色)
强调: #2563eb (蓝色)
成功: #10b981 (绿色)
错误: #dc2626 (红色)
```

---

## 🔄 重新生成图标

如果需要重新生成图标，运行以下命令：

```bash
# 进入项目目录
cd /home/admin/openclaw/workspace/sudoku-master

# 生成应用图标
python3 assets/generate_icons.py

# 生成推广素材
python3 assets/generate_graphics.py
```

---

## 📋 Google Play 上传清单

### 必需文件
- [x] 应用图标 (512x512) - `play_store_icon.png`
- [x] 特色图片 (1024x500) - `feature_graphic.png`
- [x] 截图 (最少2张，最多8张) - `screenshot_*.png`

### 上传位置
1. 登录 [Google Play Console](https://play.google.com/console)
2. 选择应用 → 商店发布 → 主要商品详情
3. 上传图标、特色图片和截图

---

## 🛠️ 自定义图标

### 使用 SVG 源文件
项目提供了 SVG 格式的图标源文件：
- `assets/icon.svg` - 主图标矢量文件
- `assets/ic_launcher_foreground.xml` - Android 矢量图标

可以使用 Inkscape、Adobe Illustrator 或在线工具编辑。

### 修改图标颜色
编辑 `assets/generate_icons.py` 中的颜色变量：
```python
# 渐变起始颜色
start_color = (79, 70, 229)  # 修改为新的 RGB 值

# 渐变结束颜色  
end_color = (37, 99, 235)    # 修改为新的 RGB 值
```

---

## 📱 自适应图标 (Android 8.0+)

Android 8.0+ 支持自适应图标，可以根据设备形状自动调整。

当前项目已生成传统图标格式。如需添加自适应图标支持，请：

1. 创建 `mipmap-anydpi-v26/ic_launcher.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

2. 添加颜色资源 `values/colors.xml`:
```xml
<color name="ic_launcher_background">#4f46e5</color>
```

---

## 📝 注意事项

1. **保留密钥库**: `android/app/sudoku-master.keystore` 是应用签名密钥，务必妥善保管
2. **图标版权**: 生成的图标使用开源字体，可自由用于商业应用
3. **尺寸准确**: 所有图标尺寸符合 Android 设计规范

---

## ✅ 验证图标

构建 APK 后，可以使用以下命令验证图标是否正确包含：

```bash
# 解压 APK 查看图标
unzip -l android/app/build/outputs/apk/release/app-release.apk | grep mipmap

# 或使用 aapt 工具
/path/to/android-sdk/build-tools/34.0.0/aapt dump badging app-release.apk | grep icon
```

