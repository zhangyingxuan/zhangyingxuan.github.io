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

- 手动安装，依赖扩展 devDependencies
```
    "eslint-plugin-import": "^2.24.2",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-import-resolver-alias": "^1.1.2",
```

1. 配置lint 命令
```json
{
    "scripts":{
        // lint当前项目中的文件并且开启自动修复
        "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    }
}
```
1. 添加 .eslintignore 忽略配置

```
public
dist
*.d.ts
/src/assets
package.json
.eslintrc.js
.prettierrc.js
commitlint.config.js
stylelint.config.js
```
5. 执行 yarn lint 
会提示非常多的下列错误，原因是.vue 文件解析出错。默认eslint不会解析vue文件，所以我们需要一个额外的解析器来帮我们解析vue文件。
```
2:6  error  Parsing error: '>' expected
```
1. 修改eslint.js
```json
{
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "eslint-config-airbnb-base",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended"
  ],
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "globals": {
    "cy": "readonly",
    "clipboardData": "readonly",
    "PKG_VERSION": true,
    "defineProps": "readonly",
    "defineEmits": "readonly"
  },
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "sourceType": "module",
    "allowImportExportEverywhere": true,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "import/extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx"
    ]
  },
  "rules": {
    "no-console": [
      "error",
      {
        "allow": ["info", "warn", "error"]
      }
    ],
    // code style config
    "no-continue": "off",
    "no-restricted-syntax": "off",
    "no-plusplus": "off",
    "no-param-reassign":  "off",
    "no-shadow":  "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": "off",
    "no-unused-expressions": "off",
    "no-return-assign": "off",
    "no-use-before-define": "off",
    "func-names": "off",
    "guard-for-in": "off",
    "consistent-return": "off",
    "no-restricted-globals": "off",
    "default-param-last": "off",
    "default-case": "off",
    "prefer-spread": "off",

    // import config
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
    "import/no-relative-packages": "off",
    
    // typescript config
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-require-imports": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/prefer-for-of": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "vue/require-default-prop": 0,
    "vue/multi-word-component-names": 0,
    "vue/no-deprecated-slot-attribute": 0
  },
  "overrides": [
    {
      "files": ["*.vue"],
      "rules": {
        "vue/component-name-in-template-casing": [2, "kebab-case"],
        "vue/require-default-prop": 0
      }
    },
    {
      "files": [
        "**/_example/*",
        "script/**/*",
        "script/*",
        "*.js",
        "site/**/*",
        "site/*"
      ],
      "rules": {
        "no-var-requires": 0,
        "no-console": 0,
        "no-unused-expressions": 0,
        "no-alert": 0
      }
    },
    {
      "files": [
        "*.ts",
        "*.tsx"
      ],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": 0
      }
    },
    {
      "files": [
        "*.test.js"
      ],
      "rules": {
        "import/no-dynamic-require": "off",
        "global-require": "off"
      }
    },
    {
      "files": "*"
    }
  ]
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

## 2.1 什么是Stylelint
    Stylelint是一个强大的，现代的代码检查工具，与ESLint类似，Stylelint能够通过定义一系列的编码风格规则帮助我们避免在样式表中出现错误。

    目前在开源社区上，关于CSS Lint的解决方案主要包括了csslint、SCSS-Lint和Stylelint等几种。而由于Stylelint在技术架构上基于AST 的方式扩展CSS，除原生CSS 语法，其也支持 SCSS、Less 这类预处理器，并且也有非常多的第三方插件，因此我们团队选择了Stylelint作为CSS Lint工具。

    官方文档：https://stylelint.io/

## 2.2 安装Stylelint
   可以选采用npm安装Stylelint。其中，stylelint-config-standard是Stylelint的标准配置。如果想使用airbnb或prettier的规范，也可以将stylelint-config-standard改为stylelint-config-airbnb或stylelint-config-prettier。
```
npm install stylelint stylelint-config-standard --save-dev
```

- 问题： stylelint-config-tencent、stylelint-config-prettier、stylelint-config-airbnb区别

## 2.3 安装适配预处理语法的插件
    如果我们项目中采用了如sass或less等css预处理器，那么可以安装适配预处理语法的插件。以sass为例，需要安装stylelint-scss插件。
```
npm install stylelint-scss --save-dev
```
## 2.4 安装CSS属性排序插件
    我们也可以选择安装stylelint-order插件。该插件能够强制我们按照某个顺序编写css，比如先写定位，再写盒模型，再写内容区样式，最后写CSS3相关属性，这样可以更好的保证我们代码的可读性。
```
npm install stylelint-order --save-dev
```
## 2. Stylelint配置
2.1 Stylelint配置方式
    安装好Stylelint之后，就需要对Stylelint进行配置。Stylelint的配置方式包括了以下几种：

在package.json中添加stylelint属性并添加规则
在.stylelintrc文件中指定，.stylelintrc文件支持添加一个文件扩展名来区分 JSON，YAML 或 JS 格式，如创建.stylelintrc.json、.stylelintrc.yaml、.stylelintrc.yml或.stylelintrc.js文件
在stylelint.config.js文件中指定，该文件将会exports一个配置对象
    在这里，我们选择了在项目根目录创建.stylelintrc.js来配置Stylelint。
# 三、初始化prettier
1. 安装依赖
```js
npm install --save-dev --save-exact prettier
// --save-exact 锁版本，去除^ ~
```
2. 配置规则（JS及TS项目均适用），prettier.config.js 参考配置如下
``` js
module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾需要有逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行，注意：tsx 不生效
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: 'lf',
};

```

3. 配置忽略文件.prettierignore (如果有的话)

```
```

4. 解决eslint冲突

- 安装 ```pnpm install eslint-config-prettier eslint-plugin-prettier -D```
- 添加配置到 eslint.js 文件
```
module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended', 
    'plugin:vue/vue3-recommended', 
    'plugin:prettier/recommended'
    ],
}
```


**Prettier 和各种 Linters 是什么关系？如何配合使用？**

规则分为两类
- Formatting rules
- Code-quality rules

prettier的作用是对```Formatting rules```这类规则自动化处理，自动格式化代码，但是不会帮你挑出潜在的错误。



### Prettier 和 Linters 的整合需要做两件事：

- 禁用 Linters 自己的 Formatting rules，让 Prettier 接管这些职责。这些配置有现成的 Config，Linters 的配置继承这个 Config 就可以了。
- 让 Linters 执行时首先能够调用 Prettier 格式化带啊，然后再检查 Code-quality 类规则。这是 由 Linters 的 Plugin 实现的。

# VSCODE 安装eslint、prettier、vetur、volar插件及配置
1. 安装插件
2. 配置eslint
3. 配置prettier
一般而言，我们还需要集成 vscode-prettier这个插件来完成自动保存格式化，在插件市场安装好了以后，在我们的.vscode/settings.json中添加如下规则
```
{
   "editor.formatOnSave": true, // 开启自动保存
   "editor.defaultFormatter": "esbenp.prettier-vscode", // 默认格式化工具选择prettier
}

  "editor.tabSize": 2, //制表符符号eslint
  "editor.formatOnSave": true, //保存时自动格式化
  //保存时自动将代码按ESLint格式进行修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "prettier.eslintIntegration": true, //让prettier使用eslint的代码格式进行校验
  "prettier.semi": true, //补齐代码结尾的分号
  "prettier.singleQuote": true, //使用单引号替代双引号
  "prettier.trailingComma": "all", // 对象补齐最后一个逗号
```

### 配置 vue 文件 自动eslint，否则.vue文件不会自动格式化
```
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
```
# 参考文献
[styelint](https://www.cnblogs.com/Yellow-ice/p/15346883.html)
[eslint + prettier + lint-staged 项目规范](https://juejin.cn/post/7043702363156119565)
https://blog.csdn.net/sinat_36728518/article/details/124932438