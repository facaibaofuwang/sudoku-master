#!/bin/bash

# GitHub 发布脚本
# 使用方法: ./publish-to-github.sh YOUR_USERNAME

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查参数
if [ -z "$1" ]; then
    echo -e "${RED}错误: 请提供 GitHub 用户名${NC}"
    echo "使用方法: ./publish-to-github.sh YOUR_USERNAME"
    echo ""
    echo "示例:"
    echo "  ./publish-to-github.sh johndoe"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="sudoku-master"
REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  数独大师 - GitHub 发布脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 显示项目信息
echo -e "${GREEN}项目信息:${NC}"
echo "  仓库名称: ${REPO_NAME}"
echo "  GitHub 用户: ${GITHUB_USERNAME}"
echo "  远程地址: ${REMOTE_URL}"
echo ""

# 检查 Git 状态
echo -e "${YELLOW}检查 Git 状态...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}错误: Git 仓库未初始化${NC}"
    echo "请先运行: git init"
    exit 1
fi

# 检查是否有提交
if [ -z "$(git log --oneline -1 2>/dev/null)" ]; then
    echo -e "${YELLOW}Git 仓库为空，正在添加文件...${NC}"
    git add .
    git commit -m "Initial commit: Sudoku Master v1.1.0"
    echo -e "${GREEN}✓ 初始提交完成${NC}"
else
    echo -e "${GREEN}✓ Git 仓库已初始化${NC}"
fi

# 检查远程仓库
echo ""
echo -e "${YELLOW}检查远程仓库...${NC}"
if git remote get-url origin >/dev/null 2>&1; then
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "当前远程仓库: ${CURRENT_REMOTE}"
    echo ""
    read -p "是否更新远程仓库地址? (y/N): " UPDATE_REMOTE
    if [[ "$UPDATE_REMOTE" =~ ^[Yy]$ ]]; then
        git remote set-url origin "${REMOTE_URL}"
        echo -e "${GREEN}✓ 远程仓库已更新${NC}"
    fi
else
    git remote add origin "${REMOTE_URL}"
    echo -e "${GREEN}✓ 远程仓库已添加${NC}"
fi

# 显示推送说明
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}推送说明:${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "1. 确保你已在 GitHub 上创建了仓库: ${REMOTE_URL}"
echo "2. 如果仓库不存在，请先访问: https://github.com/new"
echo "3. 推送时可能需要认证:"
echo "   - 使用 Personal Access Token（推荐）"
echo "   - 或使用 SSH 密钥"
echo ""

read -p "是否继续推送? (y/N): " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}已取消推送${NC}"
    exit 0
fi

# 推送代码
echo ""
echo -e "${YELLOW}正在推送到 GitHub...${NC}"
echo ""

if git push -u origin master; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ 推送成功！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "仓库地址: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "后续操作:"
    echo "  1. 访问仓库查看代码"
    echo "  2. 启用 GitHub Pages（在 Settings -> Pages）"
    echo "  3. 创建 Release（在 Releases -> Create a new release）"
    echo ""
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ 推送失败${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo "可能的原因:"
    echo "  1. 仓库不存在或没有权限"
    echo "  2. 认证失败"
    echo "  3. 网络问题"
    echo ""
    echo "解决方案:"
    echo "  1. 检查仓库地址是否正确"
    echo "  2. 使用 Personal Access Token 认证"
    echo "  3. 检查网络连接"
    echo ""
    exit 1
fi
