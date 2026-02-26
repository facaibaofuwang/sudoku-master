# Google Play 应用发布准备清单

## 📋 基本信息

| 项目 | 内容 |
|------|------|
| **应用名称** | 数独大师 (Sudoku Master) |
| **包名** | `com.sudoku.master` |
| **版本号** | 1.0.0 (Build 1) |
| **最低SDK** | 22 (Android 5.1) |
| **目标SDK** | 34 (Android 14) |

---

## ✅ 技术检查清单

### 1. 应用签名配置

在 `android/app/build.gradle` 中添加发布签名配置：

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

在 `~/.gradle/gradle.properties` 中添加：
```properties
MYAPP_UPLOAD_STORE_FILE=sudoku-master.keystore
MYAPP_UPLOAD_KEY_ALIAS=sudoku-master
MYAPP_UPLOAD_STORE_PASSWORD=your_keystore_password
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

### 2. 创建发布密钥库

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore sudoku-master.keystore -alias sudoku-master -keyalg RSA -keysize 2048 -validity 10000
```

### 3. 应用图标

需要准备以下尺寸的图标（放在 `android/app/src/main/res/` 下）：

| 目录 | 尺寸 | 用途 |
|------|------|------|
| `mipmap-mdpi` | 48x48 | 中密度屏幕 |
| `mipmap-hdpi` | 72x72 | 高密度屏幕 |
| `mipmap-xhdpi` | 96x96 | 超高密度屏幕 |
| `mipmap-xxhdpi` | 144x144 | 超超高密度屏幕 |
| `mipmap-xxxhdpi` | 192x192 | 超超超高密度屏幕 |
| `mipmap-anydpi-v26` | 自适应图标 | Android 8.0+ |

### 4. 应用权限检查

当前已声明的权限（`AndroidManifest.xml`）：
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

**注意**: 由于暂未接入AdMob，不需要额外的广告相关权限。

---

## 📱 Google Play 商店资料

### 1. 应用标题（30字符以内）
- 中文: 数独大师 - 经典益智游戏
- 英文: Sudoku Master - Classic Puzzle

### 2. 简短描述（80字符以内）
- 中文: 经典数独游戏，多种难度，每日挑战，锻炼大脑！
- 英文: Classic Sudoku with multiple difficulties and daily challenges!

### 3. 完整描述（4000字符以内）
```
🎯 数独大师 - 最纯粹的数独体验

数独大师是一款经典的数字益智游戏，为您提供最纯粹的数独解谜体验。

✨ 游戏特色：
• 🌱 入门难度 - 轻松上手，适合初学者
• 🤔 中等难度 - 需要思考，挑战自我
• 🔥 困难难度 - 极限挑战，高手专属
• 📅 每日挑战 - 每天新题，保持大脑活跃

🎮 功能亮点：
• ✏️ 笔记模式 - 记录可能的数字
• 💡 智能提示 - 卡住时提供帮助（限3次）
• ↩️ 撤销功能 - 轻松回退操作
• 🧼 一键擦除 - 快速清空格子
• 🎨 主题切换 - 浅色/深色模式
• 📊 统计追踪 - 记录您的进步
• 🏆 成就系统 - 解锁各种成就

🎯 游戏规则：
在9×9的方格中填入数字1-9，使每行、每列、每个3×3宫格内数字不重复。

💪 挑战模式：
• 错误次数限制：5次错误游戏结束
• 提示次数限制：每局最多3次提示
• 计时挑战：挑战最快速度

📱 适配各种屏幕尺寸，流畅的游戏体验。

立即下载，开启您的数独之旅！
```

### 4. 截图要求（最少2张，最多8张）

建议截图场景：
1. 首页 - 展示Logo和难度选择
2. 游戏界面 - 展示9x9棋盘和数字键盘
3. 统计页面 - 展示游戏数据统计
4. 成就页面 - 展示成就系统
5. 设置页面 - 展示主题和声音设置
6. 完成弹窗 - 展示胜利界面

截图规格：
- 手机：16:9 或 9:16，最小 320px，最大 3840px
- 平板：16:9 或 9:16，最小 320px，最大 3840px

### 5. 应用图标（商店展示）
- 512x512px，32位PNG

### 6. 特色图片
- 1024x500px，用于 Google Play 顶部展示

### 7. 隐私政策链接
需要准备一个隐私政策网页，包含：
- 应用收集的数据（目前：无）
- 数据使用方式
- 联系方式

示例隐私政策页面可托管在 GitHub Pages 或其他免费服务上。

---

## 🔧 内容分级

根据 Google Play 内容分级问卷：
- **暴力内容**: 无
- **色情内容**: 无
- **亵渎语言**: 无
- **药品/酒精**: 无
- **赌博**: 无（可选广告变现，非赌博）

**预期分级**: PEGI 3 / ESRB E / 适合所有人

---

## 💰 定价与分发

### 应用定价
- [x] 免费应用
- [ ] 付费应用
- [x] 包含广告（预留AdMob广告位）

### 应用内购买
- [ ] 提供应用内购买

### 分发国家/地区
- [x] 所有国家/地区（可根据需要限制）

### 设备兼容性
- [x] 手机
- [x] 平板
- [ ] TV
- [ ] Wear

---

## 📋 发布前最终检查

### 构建发布版本
```bash
cd /home/admin/openclaw/workspace/sudoku-master

# 1. 更新版本号（如需要）
# 修改 package.json 中的 version
# 修改 src/version.ts 中的 APP_VERSION

# 2. 构建 Web
npm run build

# 3. 同步到 Android
npx cap sync android

# 4. 构建发布 APK
cd android
./gradlew assembleRelease

# APK 输出位置
# android/app/build/outputs/apk/release/app-release.apk
```

### 上传前检查清单
- [ ] 应用版本号已更新
- [ ] 版本说明（What's new）已准备
- [ ] 应用图标（512x512）已准备
- [ ] 特色图片（1024x500）已准备
- [ ] 截图（2-8张）已准备
- [ ] 隐私政策链接有效
- [ ] 内容分级问卷已完成
- [ ] 定价和分发已设置
- [ ] 应用签名已配置
- [ ] 发布APK已构建
- [ ] APK大小检查（< 150MB）

---

## 📦 AAB 打包（推荐）

Google Play 推荐使用 Android App Bundle (AAB) 格式：

```bash
cd /home/admin/openclaw/workspace/sudoku-master/android
./gradlew bundleRelease

# AAB 输出位置
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🚀 发布流程

1. 登录 [Google Play Console](https://play.google.com/console)
2. 创建新应用
3. 填写应用详情（标题、描述、图标、截图等）
4. 上传 APK/AAB
5. 完成内容分级问卷
6. 设置定价和分发
7. 准备隐私政策
8. 添加测试人员（内部测试）
9. 提交审核

---

## 📞 联系信息

**开发者名称**: [您的名字/公司]
**开发者网站**: [可选]
**开发者邮箱**: [您的邮箱]

---

## 🔄 版本更新流程

1. 更新 `package.json` 中的版本号
2. 更新 `src/version.ts` 中的版本信息
3. 更新 `android/app/build.gradle` 中的 versionCode 和 versionName
4. 构建新版本
5. 在 Google Play Console 上传新版本
6. 填写版本说明
7. 提交审核

