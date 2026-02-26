# 🧩 数独大师 - Sudoku Master

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-19.2.0-cyan.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.9.3-blue.svg)

一个无需登录、可离线游玩的数独游戏，帮助玩家锻炼思维能力。

[在线演示](#) · [功能特性](#-功能特性) · [快速开始](#-快速开始) · [项目结构](#-项目结构)

</div>

## ✨ 功能特性

- 🎮 **三种难度**：入门、中等、困难
- 📝 **笔记模式**：标记候选数字
- ↩️ **撤销功能**：支持回退操作
- 💡 **提示系统**：给出解题建议
- 🧼 **一键擦除**：快速清空格子
- ⏱️ **计时器**：记录解题时间
- 🎉 **完成庆祝**：通关弹窗动画
- 📱 **移动端优化**：适配手机屏幕
- 🌐 **多语言支持**：中文、英文
- 🎨 **主题切换**：浅色、深色模式

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/sudoku-master.git
cd sudoku-master

# 安装依赖
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 即可开始开发。

### 构建

```bash
# 构建 Web 版本
npm run build

# 预览构建结果
npm run preview
```

### Android 打包

```bash
# 构建并同步到 Android 项目
npm run build
npx cap sync android

# 打开 Android Studio
npx cap open android

# 或使用命令行构建
cd android
./gradlew assembleDebug
```

APK 输出路径：`android/app/build/outputs/apk/debug/app-debug.apk`

## 📁 项目结构

```
sudoku-master/
├── src/
│   ├── SudokuGenerator.ts    # 数独生成算法
│   ├── SudokuGame.tsx        # 游戏主组件
│   ├── SudokuGame.css        # 游戏样式
│   ├── HomePage.tsx          # 首页组件
│   ├── HomePage.css          # 首页样式
│   ├── App.tsx               # 主应用
│   ├── i18n.ts               # 国际化配置
│   ├── storage.ts            # 本地存储
│   ├── sound.ts              # 音效管理
│   ├── theme.ts              # 主题配置
│   └── main.tsx              # 入口文件
├── android/                 # Android 原生项目
├── dist/                    # Web 构建输出
├── public/                  # 静态资源
├── capacitor.config.ts       # Capacitor 配置
├── vite.config.ts           # Vite 配置
└── package.json             # 项目配置
```

## 🛠️ 技术栈

- **前端框架**: React 19.2.0
- **开发语言**: TypeScript 5.9.3
- **构建工具**: Vite 7.3.1
- **移动端**: Capacitor 6.2.0
- **代码规范**: ESLint 9.39.1

## 🧮 算法说明

### 数独生成算法

使用**随机回溯法**生成数独：

1. 递归填充 9x9 网格，随机尝试 1-9
2. 检查行、列、宫格冲突
3. 冲突时回溯，尝试下一个数字
4. 生成完整解答后，根据难度挖空
5. 每次挖空验证唯一解

### 难度设置

- **入门**: 挖空 35-40 个数字
- **中等**: 挖空 45-50 个数字
- **困难**: 挖空 55-60 个数字

## 🎯 核心功能实现

### 笔记模式

- 点击格子进入笔记模式
- 可以标记 1-9 的候选数字
- 自动排除已填入的数字

### 撤销功能

- 使用栈结构记录操作历史
- 支持多步撤销
- 保存填入、笔记、擦除等操作

### 提示系统

- 查找唯一解的格子
- 查找只有一个候选数的格子
- 优先提示确定性解

## 📱 移动端适配

- 响应式布局，适配各种屏幕尺寸
- 触摸优化，支持手势操作
- 防止页面缩放，提供原生应用体验
- 状态栏适配，沉浸式体验

## 🌍 国际化

支持多语言切换：

- 🇨🇳 简体中文
- 🇺🇸 English

## 🎨 主题系统

支持主题切换：

- ☀️ 浅色模式
- 🌙 深色模式

主题配置在 `src/theme.ts` 中。

## 📊 性能优化

- 使用 React.memo 优化组件渲染
- 使用 useCallback 缓存函数
- 懒加载非必要资源
- 最小化构建体积

## 🔮 后续开发计划

- [ ] 每日挑战模式
- [ ] 解题技巧教程
- [ ] 本地统计记录
- [ ] 成就系统
- [ ] 声音效果
- [ ] 更多主题
- [ ] 社交分享
- [ ] 云端同步

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者。

---

<div align="center">

Made with ❤️ by Sudoku Master Team

</div>
