---
title: 2022-04-16-【工程化】vue3-vite4-ts配置eslint、stylelint、prettier
description: ESLint来检测代码是否符合设定的规则，Prettier用于按设定的规则格式化自动工程代码，二者的配置要相符，一致。否则会导致Prettier格式化的代码，不符合ESLint的检测要求，从而发生冲突。
categories: 
 - 规范
tags:
 - git flow
 - git
---



# 一、初始化eslint
1. 安装eslint依赖，工程内安装或全局安装
``` js
yarn -D add eslint // 本地安装
yarn -G add eslint // 全局安装
```

2. 初始化eslint规则
``` js
npx eslint --init
```

- 按照提示依次选择
  
```
How would you like to use ESLint? (Use arrow keys)
  To check syntax only //只检查语法
> To check syntax and find problems//检查语法、发现问题
  To check syntax, find problems, and enforce code style//检查语法、发现问题并执行代码样式
```

- 选择完毕后，将安装相关依赖，并生成 ```.eslintrc.js``` 或 json格式的配置文件

3. 配置lint 命令
```json
{
    "scripts":{
        // lint当前项目中的文件并且开启自动修复
        "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    }
}
```
4. 添加 .eslintignore 忽略配置

```
/node_modules
/dist
/src/assets/js
/src/views
/package-lock.json
.DS_Store
vue.config.js
```
5. 执行 yarn lint 
会提示非常多的下列错误，原因是.vue 文件解析出错。默认eslint不会解析vue文件，所以我们需要一个额外的解析器来帮我们解析vue文件。
```
2:6  error  Parsing error: '>' expected
```
1. 修改eslint.js
```json
{
    ...
    // 新增，解析vue文件
    "parser":"vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    ...
}
// 两个parser的区别在于，外面的parser用来解析vue文件，使得eslint能解析<template>标签中的内容，而parserOptions中的parser，即@typescript-eslint/parser用来解析vue文件中<script>标签中的代码。
```

```
配置说明
env
Environments，指定代码的运行环境。不同的运行环境，全局变量不一样，指明运行环境这样ESLint就能识别特定的全局变量。同时也会开启对应环境的语法支持，例如：es6。

parser
ESLint 默认使用Espree作为其解析器，但它并不能很好的适应 React 环境，你可以安装 babel-eslint 用来代替默认的解析器，在配置里这么写"parser": “babel-eslint”。

plugins
顾名思义就是插件，插件是单独的npm包，命名一般以eslint-plugin开头，写的时候用字符串数组的形式，可以省略eslint-plugin开头。plugins一般包含一个或多个规则配置，可以在extends中引入。
例如：eslint:recommended就是 ESLint 的推荐规则配置，包含了ESLint的规则 里前面有✔︎的部分，recommended 规则只在ESLint升级大版本的才有可能改变。

extends
ESLint 不需要自行定义大量的规则，因为很多规则已被分组作为一个规则配置。
例如：eslint:recommended就是 ESLint 的推荐规则配置，包含了ESLint的规则 里前面有✔︎的部分，recommended 规则只在ESLint升级大版本的才有可能改变。

相对的 eslint:all 是应用所有的规则，但并不推荐这么做。另外，all 规则是根据版本随时变化的。
extends 还可以以字符串数组的形式定义。

"extends": ["eslint:recommended", "plugin:react/recommended"],

plugin:react/recommended 即为 eslint-plugin-react 插件中的提供的推荐规则配置。
另外还有一点，extends定义的规则如果有重复的，后面的规则会覆盖前面的。

rules
这里可以对规则进行细致的定义了，覆盖之前前面说的extends中定义的规则。例如indent就是对缩进的修改。"indent": ["error",4] 前面一项代表错误等级，第二项是具体配置，有些规则有第三项选项，例如 indent 就有 { "SwitchCase": 1 }，代表对switch语句采取什么样的缩进策略，如果不设默认是0。具体可以定义什么 rules，可以 参考这里

错误等级有三级 0，1，2，分别代表off，warning，error。error错误会终止 lint-staged 执行。

0或’off’：关闭规则。
1或’warn’：打开规则，并且作为一个警告（并不会导致检查不通过）。
2或’error’：打开规则，并且作为一个错误 (退出码为1，检查不通过)。
参数说明：
参数1 ： 错误等级
参数2 ： 处理方式

globals
全局变量，如果你的项目用到其他一些自定义的全局变量，"__DEV__": false这样配置，true
和 false 代表可不可以被修改。
```
1. 配置代码注释方式
```
忽略 no-undef 检查
/* eslint-disable no-undef */

忽略 no-new 检查
/* eslint-disable no-new */

设置检查
/*eslint eqeqeq: off*/ /*eslint eqeqeq: 0*/

eslint 检查指令
检查且修复
eslint * --fix

检查指定文件
eslint app.js --fix
```

# 二、初始化styelint
- postcss
- less
- sass
- 

# 三、初始化prettier
1. 安装依赖
```
```
2. 配置规则
3. 配置忽略文件.prettierignore

```
```

**Prettier 和各种 Linters 是什么关系？如何配合使用？**

规则分为两类
- Formatting rules
- Code-quality rules

prettier的作用是对```Formatting rules```这类规则自动化处理，自动格式化代码，但是不会帮你挑出潜在的错误。



### Prettier 和 Linters 的整合需要做两件事：

- 禁用 Linters 自己的 Formatting rules，让 Prettier 接管这些职责。这些配置有现成的 Config，Linters 的配置继承这个 Config 就可以了。
- 让 Linters 执行时首先能够调用 Prettier 格式化带啊，然后再检查 Code-quality 类规则。这是 由 Linters 的 Plugin 实现的。



# 参考文献
[eslint + prettier + lint-staged 项目规范](https://juejin.cn/post/7043702363156119565)
https://blog.csdn.net/sinat_36728518/article/details/124932438