---
title: 2022-04-17-【工程化】vue3-vite4-ts配置husky、pre-commit、commitizen、linet-staged
description: ESLint来检测代码是否符合设定的规则，Prettier用于按设定的规则格式化自动工程代码，二者的配置要相符，一致。否则会导致Prettier格式化的代码，不符合ESLint的检测要求，从而发生冲突。
categories: 
 - 规范
tags:
 - Husky
 - git
---

# 什么是 Husky？
Husky是一个工具，它允许我们轻松地处理Git Hooks 并在提交代码时运行我们想要的脚本。

## 第1步：将 Husky 安装到一个项目上
要安装Husky，我们可以使用 yarn 或 npm。

```
yarn add husky
# or
npm install husky
```

## 第2步：配置Husky以运行Git钩子
为git仓库添加一个pre-commit钩子
```
npx husky add .husky/pre-commit "npx --no-install lint-staged"
```
或者执行
```
npx husky add .husky/pre-commit "yarn lint && yarn format && yarn lint:style"
```
## 
现在当我们执行git commit的时候就会执行pnpm lint与pnpm format，当这两条命令出现报错，就不会提交成功。以此来保证提交代码的质量和格式。

# lint-staged
lint-staged的作用，只对更改过的文件运行格式化。

## 1. 安装依赖
```yarn add lint-staged -D```
## 2. 添加prepare脚本
```
{
    "script":{
        "prepare": "husky install"
    }
}
```
prepare脚本会在 yarn install 之后自动运行，这样依赖你的小伙伴clone了你的项目之后会自动安装husky,这里由于我们已经运行过 yarn install 了，所以我们需要手动运行一次yarn run prepare,然后我们就会得到一个目录.husky。

### 参考文献
1. https://juejin.cn/post/7118294114734440455