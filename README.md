# Hexo 个人技术博客

一个基于 Hexo 框架构建的高质量个人技术博客，专注于前端开发、小程序技术、工程化实践和云原生部署。使用 Fluid 主题，部署在 GitHub Pages 上。

## 🚀 项目特色

- **现代化技术栈**: 采用 Hexo 8.1.1 + Fluid 1.9.8，支持最新前端技术
- **响应式设计**: 完美适配桌面、平板、手机等多种设备
- **丰富内容**: 涵盖税务科技、小程序开发、前端架构、工程化等多个技术领域
- **自动化流程**: 完整的 CI/CD 流水线，GitHub Actions 自动构建部署
- **性能优化**: 静态资源优化，快速加载体验

## � 技术栈详情

### 核心框架

- **静态站点生成器**: Hexo 8.1.1
- **主题**: Fluid 1.9.8 (现代化设计语言)
- **部署平台**: GitHub Pages
- **包管理**: npm / pnpm

### 开发工具链

- **构建工具**: Hexo CLI
- **代码高亮**: Prism.js
- **数学公式**: KaTeX
- **图表支持**: Mermaid
- **SEO 优化**: 自动生成 sitemap

## 🛠️ 快速开始

### 环境要求

- Node.js 16.0 或更高版本 (推荐 LTS 版本)
- Git 2.20+

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/zhangyingxuan/zhangyingxuan.github.io.git
cd zhangyingxuan.github.io

# 安装依赖
npm install
# 或使用更快的 pnpm
pnpm install

# 启动本地开发服务器
npm run server
# 或
pnpm run server
```

访问 http://localhost:4000 查看博客效果。

### 常用开发命令

```bash
# 清理缓存和生成文件
npm run clean

# 构建静态文件（生产环境）
npm run build

# 部署到 GitHub Pages
npm run deploy

# 一键发布（清理+构建+部署）
npm run publish

# 创建新文章
hexo new "文章标题"
```

## 📁 项目架构

```
zhangyingxuan.github.io/
├── source/                 # 源文件目录
│   ├── _posts/            # 博客文章（Markdown格式）
│   ├── about/             # 关于页面
│   ├── categories/        # 分类页面
│   └── tags/             # 标签页面
├── themes/               # 主题目录
│   └── fluid/            # Fluid 主题配置
├── scaffolds/            # 文章模板
├── public/               # 构建生成的静态文件
├── _config.yml           # Hexo 主配置文件
├── _config.fluid.yml     # Fluid 主题配置文件
├── package.json          # 项目依赖和脚本
└── .github/workflows/    # GitHub Actions 自动化配置
```

## 📝 内容管理

### 文章分类体系

博客内容按技术领域精细分类：

- **🎯 税务科技**: 发票管家、线上订购、乐企等税务产品开发经验
- **📱 小程序开发**: 微信小程序技术实践、自动化测试、CI/CD
- **⚡ 前端架构**: Vue3、React、微前端、工程化建设
- **🔧 工程化**: 工具链、组件库、监控体系、性能优化
- **☁️ 云原生**: Docker、Kubernetes、Serverless、部署运维
- **🛠️ 工具使用**: 开发工具、效率工具、最佳实践

### 写作规范

文章采用标准 Markdown 格式，支持：

- **代码块高亮** (支持 100+ 编程语言)
- **数学公式渲染** (LaTeX 语法)
- **流程图和图表** (Mermaid 语法)
- **图片嵌入和优化**
- **表格和列表**
- **引用和脚注**

## 🌐 部署流程

### 自动化部署 (推荐)

项目配置了完整的 GitHub Actions 工作流：

1. **代码推送**: 推送到 `main` 分支触发构建
2. **依赖安装**: 自动安装 npm 依赖
3. **静态生成**: Hexo 生成静态文件
4. **质量检查**: 代码格式和构建验证
5. **页面部署**: 自动部署到 GitHub Pages

### 手动部署

```bash
# 完整发布流程
npm run publish
```

## 🔧 自定义配置

### 站点配置 (`_config.yml`)

```yaml
# 基本信息
title: 张英轩的技术博客
subtitle: 专注于前端技术与工程化实践
description: 分享前端开发、小程序技术、工程化建设经验
author: 张英轩
language: zh-CN
timezone: Asia/Shanghai

# 部署配置
deploy:
  type: git
  repo: https://github.com/zhangyingxuan/zhangyingxuan.github.io.git
  branch: gh-pages
```

### 主题配置 (`_config.fluid.yml`)

可自定义外观和功能：

- **颜色主题**: 浅色/深色模式
- **导航菜单**: 自定义导航链接
- **侧边栏**: 文章目录、标签云
- **页脚信息**: 备案号、统计代码

## 📚 技术文章特色

### 实战经验分享

- 小程序开发经验
- 线上订购系统前端架构设计
- 小程序自动化测试流水线
- 微前端在税务系统的实践

### 深度技术解析

- Vue3 + Vite + TDesign 现代化架构
- 半屏授权动态鉴权技术
- RUM 监控与性能优化
- 多租户系统架构设计

## 🤝 参与贡献

欢迎通过以下方式参与项目改进：

1. **提交 Issue**: 报告 bug 或提出功能建议
2. **Pull Request**: 提交代码改进或新功能
3. **内容贡献**: 分享技术文章和经验

## 📄 开源协议

本项目采用 [MIT 许可证](LICENSE)，可自由使用和修改。

## 📞 联系方式

- **博客地址**: https://zhangyingxuan.github.io
- **GitHub**: https://github.com/zhangyingxuan
- **邮箱**: 可通过 GitHub 联系

---

⭐ 如果这个项目对您有帮助，欢迎给个 Star 支持！

💡 持续更新中，关注获取最新技术分享...
