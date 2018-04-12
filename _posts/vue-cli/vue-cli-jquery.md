---
layout: category
category: front
---

* 项目中，我们通常会有公共的js，比如 jquery、bootstrap等，那么这时候我们需要将这些公共的js单独打包。这时我们需要用webpack自带的插件：
#  实现步骤如下：
## 1、引入jq
`npm install jquery --save`
## 2. 修改配置
   2.1 找到build文件夹下的webpack.base.conf.js文件打开，修改配置：
```
var webpack = require("webpack");
```
   2.2 在module.exports里面加入：
 ```
plugins: [// 3. 配置全局使用 jquery
     new webpack.ProvidePlugin({
     $: "jquery",
     jQuery: "jquery",
     jquery: "jquery",
     "window.jQuery": "jquery"
 })],
 ```
## 3、在入口文件main.js中加入
`import $ from 'jquery'`
