---
layout: category
category: front
---

# CommonJS 作为 Node.js 的规范，一直沿用至今。

require/exports 相关的规范由于野生性质，在 2010 年前后出生。

# ES6
import/export 相对就晚了许多。被大家所熟知和使用也是 2015 年之后的事了。 这其实要感谢 babel（原来项目名叫做 6to5，后更名为 babel） 这个神一般的项目。由于有了 babel 将还未被宿主环境（各浏览器、Node.js）直接支持的 ES6 Module 编译为 ES5 的 CommonJS —— 也就是 require/exports 这种写法 —— Webpack 插上 babel-loader 这个翅膀才开始高飞，大家也才可以称 " 我在使用 ES6！ "

这也就是为什么前面说 require/exports 是必要且必须的因为事实是，目前你编写的 import/export 最终都是编译为 require/exports 来执行的。


# sass 迁移
## 1、安装依赖


## 2、导入外部sass文件


## 3、全局引入，
### 3.1 main.js引入，或者

### 3.2 app.vue引入
直接引入

a. 修改识别 scss

> \<style lang="scss">

b. @import './scss/style.scss';

4、 字体导入
# 2、sass 字体导入

## 1、将字体文件导入 assets目录下


## 2、将url路径改为 ./assets/***
ps: 原因：由于字体通过sass文件引入，将sass注入至.vue 文件后，字体文件路径应参照.vue文件编写。

```
@font-face {
  font-family: 'oneetrip';
  src:  url('./assets/fonts/oneetrip.eot?moi07n');
  src:  url('./assets/fonts/oneetrip.eot?moi07n#iefix') format('embedded-opentype'),
  url('./assets/fonts/oneetrip.ttf?moi07n') format('truetype'),
  url('./assets/fonts/oneetrip.woff?moi07n') format('woff'),
  url('./assets/fonts/oneetrip.svg?moi07n#oneetrip') format('svg');
  font-weight: normal;
  font-style: normal;
}
```
## 3、查看 webpack.base.conf.js中loader是否有以下配置，没有则添加
```
{
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
  ```

## sass文件

一般以_开头命名，以'.sass'、'.scss'结尾，这里使用的scss文件，这种和我们平时写的css文件格式差不多，使用大括号和分号。