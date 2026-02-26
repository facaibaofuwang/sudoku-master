# AdMob广告集成指南

## 概述

本游戏已预留广告栏位，支持接入 Google AdMob 广告 SDK 获取收益。

## 预留的广告位

### 1. 游戏界面底部横幅广告
- **位置**: `SudokuGame.tsx` - 数字键盘下方
- **容器ID**: `game-ad-banner`
- **尺寸**: 自适应横幅 (320x50 / 320x100)
- **类型**: 横幅广告 (Banner)

### 2. 首页底部横幅广告
- **位置**: `HomePage.tsx` - 广告栏位区域
- **容器ID**: `home-ad-banner`
- **尺寸**: 自适应横幅
- **类型**: 横幅广告 (Banner)

## 集成步骤

### 第1步: 安装 Capacitor AdMob 插件

```bash
cd sudoku-master
npm install @capacitor-community/admob
npx cap sync
```

### 第2步: 配置 AdMob

在 `android/app/src/main/res/values/strings.xml` 中添加：

```xml
<resources>
    <string name="admob_app_id">ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxx</string>
    <string name="banner_ad_unit_id">ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx</string>
</resources>
```

### 第3步: 修改 AndroidManifest.xml

在 `android/app/src/main/AndroidManifest.xml` 中添加：

```xml
<manifest>
    <application>
        <!-- AdMob 配置 -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="@string/admob_app_id" />
    </application>
</manifest>
```

### 第4步: 初始化广告

创建 `src/admob.ts`：

```typescript
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

export async function initializeAdMob() {
  await AdMob.initialize({
    initializeForTesting: false, // 测试时设为 true
  });
}

// 显示横幅广告
export async function showBannerAd(elementId: string) {
  const options: BannerAdOptions = {
    adId: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx', // 替换为真实广告单元ID
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: false, // 测试时设为 true
  };

  await AdMob.showBanner(options);
}

// 隐藏横幅广告
export async function hideBannerAd() {
  await AdMob.hideBanner();
}

// 移除横幅广告
export async function removeBannerAd() {
  await AdMob.removeBanner();
}
```

### 第5步: 在游戏界面显示广告

修改 `SudokuGame.tsx`：

```typescript
import { useEffect } from 'react';
import { initializeAdMob, showBannerAd } from './admob';

export function SudokuGame({ difficulty, seed, onBack }: SudokuGameProps) {
  // ... 其他代码

  useEffect(() => {
    // 显示广告
    showBannerAd('game-ad-banner').catch(console.error);
    
    return () => {
      // 离开页面时移除广告
      removeBannerAd().catch(console.error);
    };
  }, []);

  // ...
}
```

### 第6步: 在首页显示广告

修改 `HomePage.tsx`：

```typescript
import { useEffect } from 'react';
import { showBannerAd } from './admob';

export function HomePage({ onStartGame, onContinueGame, hasSavedGame }: HomePageProps) {
  // ... 其他代码

  useEffect(() => {
    showBannerAd('home-ad-banner').catch(console.error);
  }, []);

  // ...
}
```

## 测试广告

在开发阶段，使用 Google 提供的测试广告单元ID：

- **Android 横幅**: `ca-app-pub-3940256099942544/6300978111`
- **iOS 横幅**: `ca-app-pub-3940256099942544/2934735716`

在 `admob.ts` 中设置 `isTesting: true` 以启用测试模式。

## 发布前检查清单

- [ ] 替换为真实的 AdMob 应用ID和广告单元ID
- [ ] 关闭测试模式 (`isTesting: false`)
- [ ] 确保遵守 Google AdMob 政策
- [ ] 在应用商店列表中声明广告存在
- [ ] 提供应用内购买去除广告的选项（可选）

## 收益优化建议

1. **添加激励视频广告**
   - 观看广告获得额外提示次数
   - 观看广告撤销错误输入

2. **插屏广告**
   - 完成一局游戏后显示
   - 返回首页时显示（限制频率）

3. **A/B 测试**
   - 测试不同广告位置的效果
   - 调整广告展示频率

## 参考文档

- [Capacitor AdMob 插件](https://github.com/capacitor-community/admob)
- [Google AdMob 官方文档](https://developers.google.com/admob/android/quick-start)
- [AdMob 政策指南](https://support.google.com/admob/answer/6128543)
