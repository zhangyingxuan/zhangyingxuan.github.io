---
layout: category
category: front
---

# 前端UI框架比较

1. vonic
2. vux
3. Mint UI
4. MUI
5. Muse-ui

# 一、背景
项目使用vue-cli脚手架，使用sass

## 1.vonic GitHub star 2.4k
依赖以下几个库，在创建 vonic 项目之前，请确保引入它们。 vue.js
```
vue-router.js
axios.js (vue.js 官方推荐的 ajax 方案)
```

点击查看GitHub
点击查看demo
中文文档

## 2.VUX GitHub star 10.7k
必须配合 vux-loader
基于webpack+vue-loader+vux可以快速开发移动端页面，配合 vux-loader方便你在WeUI的基础上定制需要的样式,主要服务于微信页面。
点击查看GitHub
点击查看demo
中文文档
## 3.MUI GitHub star 7.9k
参照：vue.js整合MUI
点击查看GitHub
点击查看demo
中文文档
## 4.Mint UI GitHub star 9k
基于 Vue 2.0 和 Material Design 的 UI 组件库
点击查看GitHub.
点击查看demo
中文文档
## 5.Muse-ui GitHub star 5.1k
点击查看GitHub
点击查看demo
中文文档

# 二、安装
在现有项目上安装，cd到项目目录下，执行：
vonic
npm install vonic@2.0.0-beta.15
vux
npm install vux --save npm install vux-loader --save-dev npm install less less-loader --save-dev npm install yaml-loader --save-dev
配置：build/webpack.base.conf.js 增加下面代码
const vuxLoader = require('vux-loader')
const webpackConfig = originalConfig
module.exports = vuxLoader.merge(webpackConfig,{ plugins: ['vux-ui'] })

Mint UI
npm install mint-ui -S
MUI
参照：vue.js整合MUI

Muse-ui
npm install --save muse-ui

# 三、维护
1.vonic
上次提交修改在Jul 11, 2017，现有36个issues，7月后未更新。
2.vux
上次提交修改在Dec 27, 2017，现有67个issues，基本每月均有更新。
3.Mint UI
上次提交修改在Dec 28, 2017，现有125个issues，更新有间隔。
4.MUI
上次提交修改在Dec 25, 2017，现有234个issues，基本每月均有更新。
5.Muse-ui
 上次提交修改在 Sep 4, 2017，现有147个issues，频率在两个月左右更新一次。
从维护上综合考量：vux > MUI > Mint UI > Muse-ui > vonic

# 四、改动成本
现在项目中使用的前端UI样式主要有：
1）上拉下拉刷新样式
2）pop弹窗（alert、上中下弹窗）
3）折叠面板
4）日期筛选
5）切换navibar
初步计划：优先选择贴近现有样式的框架,比较后发现主要问题更多在弹框上。
比较结果：
mui > Mint UI > vux > Muse-ui > vonic
# 五、总结

1、vonic：更新慢，问题处理不及时，不建议。
2、Mint UI
优点：
通过 webpack 和 babel 实现了按需引入，高度组件化
体积小
缺陷：
文档不详尽
组件功能不完善
参看：https://www.zhihu.com/question/49203207?sort=created
3、MUI
大家都用过了，不做过多介绍
4、VUX
优点：
维护更新快
组件多
缺陷：
打包体积比Mint UI更大
现有组件与项目现有样式差异较多，需要更改的地方较多
网络上相关的搜索较少
5、Muse-ui：较小众，不建议。
