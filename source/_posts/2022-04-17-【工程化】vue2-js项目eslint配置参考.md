---
title: 2022-04-17-【工程化】vue2-js项目eslint配置参考
description: 2022-04-17-【工程化】vue2-js项目eslint配置参考
categories: 
 - 规范
tags:
 - eslint
---
 
``` js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: ['plugin:vue/essential', 'airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['import'],
  settings: {
    // 别名
    'import/resolver': {
      alias: {
        map: [['@', './src/']],
        extensions: ['.js', '.vue'],
      },
    },
  },
  rules: {
    'func-names': 0,
    'import/extensions': 0,
    'no-unused-expressions': 0,
    /**
     * 导入语句前不允许有任何非导入语句
     */
    'import/first': 'error',
    /**
     * 禁止重复导入模块
     */
    'import/no-duplicates': 'error',
    /**
     * 禁止使用 let 导出
     */
    'import/no-mutable-exports': 'warn',
    /**
     * 禁用导入的模块时使用 webpack 特有的语法（感叹号）
     */
    'import/no-webpack-loader-syntax': 'warn',
    /**
     * 当只有一个导出时，必须使用 export default 来导出
     */
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
```