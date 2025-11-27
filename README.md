# Hexo 个人博客

一个基于 Hexo 框架构建的个人技术博客，使用 Fluid 主题，部署在 GitHub Pages 上。

## 🚀 项目特色

- **现代化设计**: 采用 Fluid 主题，界面简洁美观
- **响应式布局**: 完美适配各种设备尺寸
- **技术分享**: 涵盖前端开发、小程序、工程化、部署等多个技术领域
- **自动化部署**: 通过 GitHub Actions 实现自动构建和部署

## 📦 技术栈

- **静态站点生成器**: Hexo 8.1.1
- **主题**: Fluid 1.9.8
- **部署平台**: GitHub Pages
- **包管理**: npm / pnpm

## 🛠️ 快速开始

### 环境要求

- Node.js 14.0 或更高版本
- Git

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 本地开发

```bash
# 启动本地服务器
npm run server

# 或使用 pnpm
pnpm run server
```

访问 http://localhost:4000 查看博客效果。

### 常用命令

```bash
# 清理缓存
npm run clean

# 构建静态文件
npm run build

# 部署到 GitHub Pages
npm run deploy

# 一键发布（清理+构建+部署）
npm run publish
```

## 📁 项目结构

```
zhangyingxuan.github.io/
├── source/              # 源文件目录
│   ├── _posts/          # 博客文章
│   └── about/           # 关于页面
├── themes/              # 主题目录
│   └── fluid/           # Fluid 主题
├── _config.yml          # Hexo 配置文件
├── package.json         # 项目依赖配置
└── workflows/           # GitHub Actions 配置
```

## 📝 写作指南

### 创建新文章

```bash
hexo new "文章标题"
```

新文章将创建在 `source/_posts/` 目录下。

### 文章格式

文章使用 Markdown 格式编写，支持以下功能：

- 代码高亮
- 数学公式
- 图表
- 图片嵌入

## 🌐 部署

### GitHub Pages 自动部署

项目已配置 GitHub Actions，当代码推送到 `main` 分支时自动部署：

1. 代码推送到 GitHub
2. GitHub Actions 自动触发构建
3. 生成的静态文件部署到 GitHub Pages

### 手动部署

```bash
npm run publish
```

## 🔧 自定义配置

### 修改主题配置

编辑 `_config.yml` 文件中的相关配置：

```yaml
# 站点信息
title: 你的博客标题
subtitle: 副标题
description: 描述
keywords: 关键词
author: 作者名

# 主题配置
theme: fluid
```

### Fluid 主题配置

主题配置位于 `themes/fluid/_config.yml`，可自定义：

- 颜色主题
- 导航菜单
- 侧边栏
- 页脚信息

## 📚 文章分类

博客文章按技术领域分类：

- 🎨 前端开发
- 📱 小程序
- ⚙️ 工程化
- 🚀 部署运维
- 🔧 工具使用
- 🏗️ 架构设计

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个博客项目。

## 📄 许可证

本项目采用 MIT 许可证。

## 📞 联系

- 博客地址: https://zhangyingxuan.github.io
- GitHub: https://github.com/zhangyingxuan

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
