---
title: 2023-11-18-【架构】lerna开发README
date: 2023-11-18 00:14:39
description:
categories:
  - 架构
tags:
  - lerna
---

# 应用中枢代码基于 lerna 的 monorepo 开发模式管理

## 目录介绍

- packages/tgac-web-common:公共组件仓库

## 环境依赖

- node 12.16.3
- yarn 1.22.4
- gsm (https://www.npmjs.com/package/git-submodule-management)

## 项目仓库本地初始化

```sh
# 从仓库clone最新代码
git clone git@git.code.tencent.com:gasc/tgac-web-lerna.git

# 进入项目根目录
cd tgac-web-lerna

# 对子模块进行初始化操作
git submodule init

# 更新子模块最新代码
git submodule update
```

## 本地开发前准备

```sh
# 进入项目根目录
cd tgac-web-lerna

# 切换到目标分支
git checkout $TARGET_BRANCH

# 检查子模块是否与当前分支的submodule记录一致
git status

# 如果发现有差异，则需执行
git submodule update
```

## 本地开发流程

```sh
# 进入项目根目录
cd tgac-web-lerna

# 构建依赖包
yarn bootstrap

# 新增某个子应用所需的依赖
lerna add <package_name> --scope=<package_name>

# 给所有子应用新增依赖
lerna add <package_name>

# 新增公用开发工具，比如eslint
yarn add -W -D eslint

# 清除所有依赖
yarn clean
```

## 公用包发布流程（一般先发布 next 版本验证后没问题再发布 latest 版本）

```sh
# 进入项目根目录
cd tgac-web-lerna

# 构建公用包
yarn build

# 发布公用包（预览版）
yarn publish:next

# 发布公用包（正式版）
yarn publish:latest

# 统一更新git提交记录
gsm ac 'feat: publish common'

# 统一推送git仓库到当前分支
gsm push
```

## lerna + yarn workspaces 模式下，子应用开发注意点

- 别直接在子应用中通过`npm`或者`yarn`进行新增包操作
- 不需要发布到`gnpm`的包，必须在`package.json`加`"private": true`

## 其他，待完善
