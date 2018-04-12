---
layout: category
category: markdown
---

# 贯穿vue-cli 
http://blog.csdn.net/u014182411/article/details/72596722

# 问题收集

# 1、npm run build后的dist包无法正常显示
<img src="../assets/vue-build-error.png"/>

## 解决办法
找到config里的index.js,在 build 部分的 assetsPublicPath 里面加一个点即可

```
assetsPublicPath: '/',
改为
assetsPublicPath: './',
```

# 2、移动端点击支持 fastclick

## 安装步骤
### 1、先执行安装fastclick的命令。
```
npm install fastclick -D
```
### 2、之后，在main.js中引入，并绑定到body
```
import FastClick from 'fastclick'

FastClick.attach(document.body);
```