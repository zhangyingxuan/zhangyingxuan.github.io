---
title: 2022-04-17-【工程化】vue3-vite4-ts配置commitlint
description: commit message是日常开发中最容易被忽视的规范，实际上它直接关系到后期代码管理与维护，完善且规范的commit message有助于团队review和缺陷回归，传统做法是通过Commitlint做提交前校验，但直接拒绝提交的方式以及大块报错日志排查并不友好，如果引入commitizen工具，将会有飞一般的体验～
categories:
  - 规范
tags:
  - commitizen
  - git
  - husky
---

>

## 优势

- 规范——遵从 AngularJS's commit message convention
- 简单——通过命令行可视化步骤提示填写对应描述，防止遗漏
- 扩展——支持团队自定义提交模板（cz-customizable）
- 分析——支持生成 commit 日志（standard-version），利于版本迭代

## 安装

1. 项目级别安装（可保证团队成员版本一致）

```javascript
npm install --save-dev commitizen
```

2. 初始化 Commitizen 配套的适配器，如果你的 npm 版本在 5.2 以上，那么你可以使用 npx 来初始化.

```javascript
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

该初始化命令主要完成以下 3 步：

1. 安装 cz-conventional-changelog 包（提供日志标准）
2. 将 cz-conventional-changelog 加入 package.json 的 devDependencies 依赖中

```javascript
"devDependencies": {
  "cz-conventional-changelog": "^3.3.0"
	"cz-customizable": "^6.3.0",
},
```

3. 在 package.json 根路径新增 npm 执行命令 config.commit 及 config.commitizen 配置项

```javascript
"scripts": {
	"commit": "cz"
},
"config": {
	"commitizen": {
		"path": "./node_modules/cz-conventional-changelog"
	  }
}
```

## husky

1. 初始化 husky 配置

```javascript
cd ${项目根目录}
npx husky install
```

2. 添加 pre-commit 以及 commit-msg hook

> commitlint 规范具体请查看 git 规范-提交与合并

```javascript
npx husky add .husky/pre-commit "npm run lint && npm run styleLint && git add ."
npx husky add .husky/commit-msg "npx --no-install commitlint --edit \$1"
// yarn commitlint --config .commitlintrc.js --edit $1
```

3. 添加 package scripts

```javascript
# 往 package.json scripts 字段中添加下面的内容
"lint": "eslint --ext .vue,.js,.ts,.tsx ./ --max-warnings 0 --fix",
"styleLint": "stylelint **/*.{css,scss,sass,less,vue} --fix"
```
