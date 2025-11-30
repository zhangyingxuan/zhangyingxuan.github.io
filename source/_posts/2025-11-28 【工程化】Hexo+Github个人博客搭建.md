---
title: 2025-11-28 【工程化】Hexo+Github个人博客搭建
description:
categories:
  - Hexo
tags:
  -
---

## 引语

记得初次搭建个人博客是在 17 年，本意是想对个人技术栈迭代过程进行记录，同时也当做能力快查的工具；再后来，随着 typro 版本迭代开始收费，没找到合适免费的在线存储编辑器和阅读器，索性就将 Vscode+Hexo+Github 作为个人积累的文档“小助手”，发展到如今。

> 关键词：Hexo；GitHub Pages；静态博客；Docusaurus；VitePress

## 一、背景与痛点

“写博客”这件事对开发者而言既是知识沉淀，也是个人名片。

- 动态博客（WordPress 等）需要买服务器、备份数据库，成本高；
- 第三方平台（CSDN、知乎）曝光好，却受限于编辑器和广告。

**静态博客**应运而生：

- 本地 Markdown → 生成纯 HTML → 免服务器部署；
- 配合 Git 可实现“写作即 commit，push 即发布”。

在众多静态框架中，**Hexo** 因“零配置、主题多、一键部署 GitHub”成为国内最流行方案之一。本文带你从 0 到 1 搭建可公开访问的 Hexo 个人站，并与 Docusaurus、VitePress 做横向对比，帮你选型不踩坑。

## 二、方案对比：Hexo vs Docusaurus vs VitePress

| 维度     | Hexo                           | Docusaurus            | VitePress            |
| -------- | ------------------------------ | --------------------- | -------------------- |
| 定位     | 博客为主                       | 文档 + 博客           | 文档优先             |
| 上手成本 | ★☆☆☆☆                          | ★★☆☆☆                 | ★★☆☆☆                |
| 主题生态 | 极丰富（Next/Fluid/Matery...） | 官方 + 社区，偏文档风 | 官方默认，博客主题少 |
| 构建速度 | 快（秒级）                     | 中等（Webpack）       | 极快（Vite）         |
| 部署方式 | GitHub Pages 一键推            | 同左                  | 同左                 |
| 中文社区 | 活跃                           | 一般                  | 新兴                 |
| 推荐指数 | ⭐⭐⭐⭐⭐                     | ⭐⭐⭐⭐              | ⭐⭐⭐               |

1. 想要“**开箱即用 + 海量主题**”→ 选 Hexo；
2. 项目需要“**文档 + 博客**”混排 → 选 Docusaurus；
3. 追求**极致构建速度**且接受默认主题 → 选 VitePress。  
   本文聚焦 Hexo，其余框架步骤类似，可触类旁通。

## 三、实现步骤（Hexo + GitHub Pages 全自动部署）

### 0. 前置条件

- Node.js ≥ 18（[官网下载](https://nodejs.org)）
- Git 任意新版（[官网下载](https://git-scm.com)）
- GitHub 账号（无则注册）

### 1. 创建 GitHub 仓库（Pages 专用）

> 仓库名必须 <用户名>.github.io；
> 类型 Public；勾选 “Add a README”。
> → 得到可访问域名 https://<用户名>.github.io 。

### 2. 安装 Hexo CLI 并初始化

```bash
npm i -g pnpm                    # 更快、更省盘
pnpm add -g hexo-cli             # 全局装脚手架
hexo init my-blog && cd my-blog  # 创建项目
pnpm install                     # 装依赖
hexo server                      # 本地预览 http://localhost:4000
```

首次启动看到“Hello Hexo”即成功 。

### 3.GitHub Actions 自动部署

> 把源码推到 main 分支，每次 push 自动构建：

- .github/workflows/pages.yml

```yml
name: Auto Deploy Hexo to GitHub Pages

on: # 触发条件
  push:
    branches: [main]
  workflow_dispatch: # 手动按钮

permissions: # 给 Actions 写 Pages 的权限
  contents: write
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # 1. 拉源码
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: true # 主题用 submodule 时必加

      # 2. 装 Node 20（2025 LTS）
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      # 3. 安装 Hexo 及依赖
      - name: Install dependencies
        run: |
          npm ci --production

      # 4. 生成静态文件
      - name: Build
        run: |
          npx hexo clean
          npx hexo generate

      # 5. 部署到 gh-pages 分支
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          publish_branch: gh-pages
          # cname: | # 如果有自定义域名，把 xxx.com 换成你的
          #   xxx.com
```

配置完提交，后续 git push 即自动发布，无需手动 hexo deploy

### 4. 写文章

```bash
hexo new post "我的第一篇博客"
```

编辑 source/\_posts/我的第一篇博客.md（Markdown），保存后 hexo server 实时预览。

### 5. 换主题

```bash
git clone https://github.com/next-theme/hexo-theme-next themes/next

```

在`_config.yml` 里 theme: next 即可

- 页面配置排序
  > 修改`_config.yml`配置文件
  > 找到：`index_generator:`配置
  > path: ""
  > per_page: 10 # 分页
  > order_by: -path # 排序方式，按 title 中时间降序

### 6. 总结

- Hexo + GitHub Pages 让你“只管写 Markdown，其余交给 Git”——
- 零服务器、零费用、全公开、全备份。
- 跟着本文 30 分钟即可拥有自己的 .github.io 域名博客；
- 后续只需 git push，全球读者即可看到你的下一篇文章。
- Happy Blogging!
