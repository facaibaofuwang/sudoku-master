# 🚀 GitHub 发布指南

本指南将帮助你将数独大师项目发布到 GitHub。

## 📋 前置准备

1. **GitHub 账号**：确保你有一个 GitHub 账号
2. **Git 配置**：已配置 Git 用户信息
3. **本地仓库**：项目已初始化并提交

## 🔄 发布步骤

### 1. 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `sudoku-master`
   - **Description**: `A Sudoku game built with React, TypeScript, and Vite`
   - **Visibility**: Public 或 Private（根据需要选择）
   - **Initialize**: ❌ 不要初始化（选择 Add a README file 等都不要勾选）
3. 点击 **Create repository**

### 2. 关联远程仓库

```bash
cd /home/admin/openclaw/workspace/workspace/sudoku-master

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/sudoku-master.git

# 验证远程仓库
git remote -v
```

### 3. 推送代码到 GitHub

```bash
# 推送到 master 分支
git push -u origin master
```

如果遇到认证问题，请使用以下方式之一：

#### 方式 1: 使用 Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 选择权限：`repo`（完全控制私有仓库）
4. 生成 token 并复制
5. 推送时使用 token：

```bash
git push -u origin master
# 用户名输入：YOUR_USERNAME
# 密码输入：YOUR_TOKEN
```

#### 方式 2: 使用 SSH 密钥

```bash
# 生成 SSH 密钥（如果没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 将公钥添加到 GitHub：Settings -> SSH and GPG keys -> New SSH key

# 使用 SSH URL
git remote set-url origin git@github.com:YOUR_USERNAME/sudoku-master.git
git push -u origin master
```

### 4. 验证发布

访问你的 GitHub 仓库页面：
```
https://github.com/YOUR_USERNAME/sudoku-master
```

你应该能看到：
- ✅ README.md 显示在首页
- ✅ 所有源代码文件
- ✅ LICENSE 文件
- ✅ GitHub Actions 工作流

## 🎯 后续操作

### 启用 GitHub Pages

1. 访问仓库的 **Settings** -> **Pages**
2. **Source** 选择：`GitHub Actions`
3. 保存后，GitHub Actions 会自动部署

等待几分钟后，访问：
```
https://YOUR_USERNAME.github.io/sudoku-master
```

### 创建 Releases

1. 访问仓库的 **Releases** -> **Create a new release**
2. 填写信息：
   - **Tag version**: `v1.1.0`
   - **Release title**: `Sudoku Master v1.1.0`
   - **Description**: 初始版本发布
3. 点击 **Publish release**

### 添加 Topics

1. 访问仓库的 **Settings** -> **Topics**
2. 添加以下标签：
   - `sudoku`
   - `game`
   - `react`
   - `typescript`
   - `vite`
   - `mobile-app`
   - `capacitor`

## 📝 项目文件说明

已创建的 GitHub 相关文件：

```
.github/
└── workflows/
    ├── ci.yml          # CI/CD 工作流
    └── deploy.yml      # GitHub Pages 部署

.gitignore              # Git 忽略文件配置
README.md               # 项目说明文档
LICENSE                 # MIT 许可证
CONTRIBUTING.md         # 贡献指南
```

## 🔧 常见问题

### Q: 推送时提示 "Permission denied"

**A**: 检查仓库权限，确保你有推送权限。使用 Personal Access Token 或 SSH 密钥。

### Q: CI 工作流失败

**A**: 检查 Actions 页面的错误日志，确保：
- Node.js 版本正确
- 依赖安装成功
- 构建命令正确

### Q: GitHub Pages 部署失败

**A**: 确保：
- 仓库是公开的
- Pages 设置正确
- deploy.yml 工作流成功运行

### Q: 如何更新项目

**A**: 
```bash
# 修改代码后
git add .
git commit -m "Your commit message"
git push
```

## 🎉 完成！

恭喜！你的数独大师项目已成功发布到 GitHub。

现在你可以：
- 🌍 分享项目链接给他人
- 🤝 接受社区贡献
- 📊 查看项目统计
- 🔄 使用 GitHub Actions 自动化
- 📄 发布新版本

---

需要帮助？查看 [GitHub 文档](https://docs.github.com)
