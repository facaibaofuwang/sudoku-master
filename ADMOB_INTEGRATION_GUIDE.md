# AdMob 广告接入完整指南

## 📱 第一部分：创建 AdMob 账号

### 1.1 注册 AdMob
1. 访问 https://apps.admob.com
2. 使用 Google 账号登录（与 Play Console 相同账号）
3. 填写付款信息（收款用，可以先跳过）
4. 接受服务条款

### 1.2 添加应用
1. 点击 "应用" → "添加应用"
2. 选择平台：Android
3. 选择状态：
   - 如果应用已上架：输入应用包名 `com.sudoku.master`
   - 如果应用未上架：选择 "手动添加应用"
4. 输入应用名称：数独大师
5. 点击 "添加"

---

## 📋 第二部分：创建广告单元

### 2.1 横幅广告 (Banner)
用于游戏界面底部和首页底部

创建步骤：
1. 选择应用 → 广告单元 → 添加广告单元
2. 选择 "横幅"
3. 广告单元名称：
   - `home_banner` - 首页横幅
   - `game_banner` - 游戏界面横幅
4. 选择横幅类型：
   - 自适应横幅（推荐）
5. 点击 "创建"
6. 记录广告单元 ID：
   - 格式：`ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx`

### 2.2 插页广告 (Interstitial)
用于游戏结束后显示

创建步骤：
1. 添加广告单元 → "插页式"
2. 名称：`game_complete_interstitial`
3. 点击 "创建"
4. 记录广告单元 ID

### 2.3 激励广告 (Rewarded)
用于额外提示奖励

创建步骤：
1. 添加广告单元 → "激励式"
2. 名称：`extra_hint_rewarded`
3. 设置奖励：
   - 奖励类型：提示次数
   - 奖励数量：1
4. 点击 "创建"
5. 记录广告单元 ID

---

## 🔧 第三部分：项目配置

### 3.1 安装 AdMob SDK

修改 `android/app/build.gradle`：

```gradle
dependencies {
    // 现有依赖...
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    implementation "androidx.appcompat:appcompat:$androidxAppCompatVersion"
    
    // 添加 AdMob SDK
    implementation 'com.google.android.gms:play-services-ads:22.6.0'
}
```

### 3.2 添加应用 ID

创建/修改 `android/app/src/main/res/values/strings.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">数独大师</string>
    
    <!-- AdMob 应用 ID (测试用，正式环境替换为你的ID) -->
    <string name="admob_app_id">ca-app-pub-3940256099942544~3347511713</string>
    
    <!-- 广告单元 ID -->
    <string name="banner_ad_unit_id">ca-app-pub-3940256099942544/6300978111</string>
    <string name="interstitial_ad_unit_id">ca-app-pub-3940256099942544/1033173712</string>
    <string name="rewarded_ad_unit_id">ca-app-pub-3940256099942544/5224354917</string>
</resources>
```

**注意**: 
- 上面的 ID 是 Google 提供的测试 ID
- 正式发布前替换为你在 AdMob 创建的广告单元 ID

### 3.3 修改 AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- 添加网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        
        <!-- 添加 AdMob 应用 ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="@string/admob_app_id" />

        <activity ...>
            ...
        </activity>
    </application>
</manifest>
```

---

## 💻 第四部分：前端广告组件

### 4.1 创建广告管理模块

创建 `src/advertising.ts`：

```typescript
// AdMob 广告管理

// 广告单元配置
const AD_UNITS = {
  // 测试 ID
  TEST: {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
    REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  },
  // 正式 ID (替换为你的实际 ID)
  PRODUCTION: {
    BANNER_HOME: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx',
    BANNER_GAME: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx',
    INTERSTITIAL: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx',
    REWARDED: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx',
  }
};

// 当前环境
const IS_PRODUCTION = false; // 发布时改为 true

// 获取广告单元 ID
export function getAdUnitId(type: 'banner_home' | 'banner_game' | 'interstitial' | 'rewarded'): string {
  if (IS_PRODUCTION) {
    switch (type) {
      case 'banner_home': return AD_UNITS.PRODUCTION.BANNER_HOME;
      case 'banner_game': return AD_UNITS.PRODUCTION.BANNER_GAME;
      case 'interstitial': return AD_UNITS.PRODUCTION.INTERSTITIAL;
      case 'rewarded': return AD_UNITS.PRODUCTION.REWARDED;
    }
  }
  // 测试环境使用测试 ID
  switch (type) {
    case 'banner_home':
    case 'banner_game':
      return AD_UNITS.TEST.BANNER;
    case 'interstitial':
      return AD_UNITS.TEST.INTERSTITIAL;
    case 'rewarded':
      return AD_UNITS.TEST.REWARDED;
  }
}

// 声明 Capacitor 插件
declare global {
  interface Window {
    admob?: {
      initialize: (options: { appId: string }) => Promise<void>;
      showBanner: (options: { adId: string; position: string }) => Promise<void>;
      hideBanner: () => Promise<void>;
      prepareInterstitial: (options: { adId: string }) => Promise<void>;
      showInterstitial: () => Promise<void>;
      prepareRewardVideo: (options: { adId: string }) => Promise<void>;
      showRewardVideo: () => Promise<{ reward: boolean }>;
    };
  }
}

// 初始化 AdMob
export async function initializeAdMob(): Promise<void> {
  if (window.admob) {
    await window.admob.initialize({
      appId: IS_PRODUCTION ? '你的应用ID' : 'ca-app-pub-3940256099942544~3347511713'
    });
    console.log('AdMob 初始化成功');
  }
}

// 显示横幅广告
export async function showBannerAd(position: 'home' | 'game'): Promise<void> {
  if (window.admob) {
    const adId = getAdUnitId(position === 'home' ? 'banner_home' : 'banner_game');
    await window.admob.showBanner({
      adId,
      position: 'bottom' // 底部显示
    });
  }
}

// 隐藏横幅广告
export async function hideBannerAd(): Promise<void> {
  if (window.admob) {
    await window.admob.hideBanner();
  }
}

// 预加载插页广告
export async function prepareInterstitialAd(): Promise<void> {
  if (window.admob) {
    const adId = getAdUnitId('interstitial');
    await window.admob.prepareInterstitial({ adId });
  }
}

// 显示插页广告
export async function showInterstitialAd(): Promise<void> {
  if (window.admob) {
    await window.admob.showInterstitial();
  }
}

// 预加载激励广告
export async function prepareRewardAd(): Promise<void> {
  if (window.admob) {
    const adId = getAdUnitId('rewarded');
    await window.admob.prepareRewardVideo({ adId });
  }
}

// 显示激励广告
export async function showRewardAd(): Promise<boolean> {
  if (window.admob) {
    const result = await window.admob.showRewardVideo();
    return result.reward;
  }
  return false;
}
```

### 4.2 安装 Capacitor AdMob 插件

```bash
cd /home/admin/openclaw/workspace/sudoku-master
npm install @capacitor-community/admob
npx cap sync android
```

### 4.3 修改 HomePage.tsx 集成广告

```typescript
import { useEffect } from 'react';
import { initializeAdMob, showBannerAd, hideBannerAd } from './advertising';

export function HomePage({ onStartGame, onContinueGame, hasSavedGame }: HomePageProps) {
  // ... 现有代码 ...

  useEffect(() => {
    // 初始化 AdMob
    initializeAdMob();
    
    // 显示首页横幅广告
    showBannerAd('home');
    
    // 清理：隐藏广告
    return () => {
      hideBannerAd();
    };
  }, []);

  // ... 其余代码 ...
}
```

### 4.4 修改 SudokuGame.tsx 集成广告

```typescript
import { useEffect } from 'react';
import { showBannerAd, hideBannerAd, showInterstitialAd, showRewardAd } from './advertising';

export function SudokuGame({ difficulty, seed, onBack }: SudokuGameProps) {
  // ... 现有代码 ...

  useEffect(() => {
    // 显示游戏界面横幅广告
    showBannerAd('game');
    
    return () => {
      hideBannerAd();
    };
  }, []);

  // 游戏完成时显示插页广告
  useEffect(() => {
    if (isComplete) {
      // 延迟显示插页广告
      setTimeout(() => {
        showInterstitialAd();
      }, 1000);
    }
  }, [isComplete]);

  // 获取额外提示（激励广告）
  const handleExtraHint = async () => {
    const rewarded = await showRewardAd();
    if (rewarded) {
      // 用户观看了广告，奖励额外提示
      setHintCount(prev => Math.max(0, prev - 1)); // 恢复一次提示
    }
  };

  // ... 其余代码 ...
}
```

---

## 🧪 第五部分：测试广告

### 5.1 使用测试 ID
开发阶段使用 Google 提供的测试 ID：
- 应用 ID: `ca-app-pub-3940256099942544~3347511713`
- 横幅: `ca-app-pub-3940256099942544/6300978111`
- 插页: `ca-app-pub-3940256099942544/1033173712`
- 激励: `ca-app-pub-3940256099942544/5224354917`

### 5.2 添加测试设备
1. 在 AdMob 控制台 → 设置 → 测试设备
2. 添加设备 ID（运行应用时查看 logcat 获取）
3. 或使用物理设备测试

### 5.3 验证广告显示
```bash
# 构建并运行
npm run build
npx cap sync android
npx cap open android
```

在 Android Studio 中运行应用，检查：
- [ ] 横幅广告显示在底部
- [ ] 插页广告在游戏结束时显示
- [ ] 激励广告可以正常播放并获得奖励

---

## 🚀 第六部分：正式发布

### 6.1 切换到正式广告 ID
修改 `src/advertising.ts`：

```typescript
const IS_PRODUCTION = true; // 改为 true
```

替换所有 `xxxxxxxxxxxxxxxx/xxxxxxxxxx` 为 AdMob 中的实际广告单元 ID。

### 6.2 重新构建 APK
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

### 6.3 更新 Google Play
上传新的 APK 到 Google Play Console。

---

## 💰 第七部分：收款设置

### 7.1 添加付款方式
1. AdMob 控制台 → 付款
2. 添加付款方式：
   - 银行转账（推荐）
   - 西联汇款
   - PayPal（部分国家）

### 7.2 收款门槛
- 最低付款金额：$100 美元
- 付款周期：每月一次

### 7.3 税务信息
1. 填写税务表单（W-8BEN 或 W-9）
2. 提交身份验证

---

## 📊 第八部分：广告优化

### 8.1 广告位置优化
| 位置 | 广告类型 | 建议 |
|------|----------|------|
| 首页底部 | 横幅 | 自适应尺寸 |
| 游戏界面底部 | 横幅 | 不遮挡游戏 |
| 游戏完成 | 插页 | 用户暂停时显示 |
| 额外提示 | 激励 | 用户主动触发 |

### 8.2 频次控制
- 插页广告：每局游戏最多 1 次
- 避免过度打扰用户

### 8.3 屏蔽敏感广告
在 AdMob 控制台：
1. 屏蔽控制 → 广告审核中心
2. 屏蔽不希望展示的广告类别

---

## ⚠️ 注意事项

1. **合规性**
   - 遵守 Google Play 广告政策
   - 不得诱导点击广告
   - 不得遮挡广告

2. **用户体验**
   - 广告不应影响游戏操作
   - 提供去广告内购选项（可选）

3. **测试充分**
   - 发布前务必用测试 ID 验证
   - 确保正式 ID 正确配置

---

## 📞 获取帮助

- **AdMob 帮助中心**: https://support.google.com/admob
- **AdMob 社区**: https://groups.google.com/g/google-admob-help
- **政策中心**: https://support.google.com/admob/answer/6128543

