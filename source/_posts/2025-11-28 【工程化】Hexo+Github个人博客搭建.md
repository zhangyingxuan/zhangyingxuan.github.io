---
title: 2025-11-28 【工程化】Hexo+Github个人博客搭建
description:
categories:
  - 小程序
tags:
  - chrome扩展
---

## 背景

记得初次搭建个人博客是在 17 年，本意是想对个人技术栈迭代过程进行记录，同时也当做能力快查的工具；再后来，随着 typro 版本迭代开始收费，没找到合适免费的在线存储编辑器和阅读器，索性就将 Vscode+Hexo+Github 作为个人积累的文档“小助手”，发展到如今。

## 实现步骤

### 1. 准备工作

- 安装 Node.js ≥18（官网）
- 安装 Git（官网）
- 注册 GitHub 账号并新建公开仓库，仓库名必须
  <你的用户名>.github.io（例：coolboy.github.io）

### 1. 创建 Github 仓库

1. 以 `<你的用户名>.github.io（例：coolboy.github.io）`创建你的博客仓库
2. 进入

### 2. 本地初始化 Hexo

```shell
# 1. 全局安装脚手架
npm install -g hexo-cli

# 2. 创建项目
mkdir my-blog && cd my-blog
hexo init .          # 注意后面的“.”
npm install
```

### 3. 部署

方案：GitHub Actions 全自动构建（零本地依赖）

#### 实现步骤

Step 1：把源码仓库设为「源码 / 产物」双分支
main 分支 → 只放 Hexo 源码（\_posts、themes、\_config.yml …）
gh-pages 分支 → Actions 自动生成，GitHub Pages 默认读取，无需手动创建

- 新建 .github/workflows/deploy.yml
  > 触发：push 到 main
  > 环境：ubuntu + Node 18
  > 步骤：cache npm → npm ci → hexo g → peaceiris/actions-gh-pages@v4 推送到 gh-pages 分支
- 脚本如下：

```yml
name: Auto Deploy Hexo to GitHub Pages

on: # 触发条件
  push:
    branches: [main] # 源码所在分支
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

2. 打开 GitHub Pages 开关
   仓库 → Settings → Pages → Build and deployment
   Source 选 Deploy from a branch → Branch 选 gh-pages /(root) → Save。
   稍等 30 s，浏览器访问 https://<用户名>.github.io 即可看到最新博客

## 参考文献

1.
