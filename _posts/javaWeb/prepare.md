---
layout: post
title:  "Welcome to Jekyll!"
date:   2014-11-17 13:31:01 +0800
categories: jekyll
tag: jekyll
---

* content
{:toc}
https://www.cnblogs.com/haoyijing/p/5789348.html#z1_2

# 一、基础
## sass
```
@mixin button-variant($color, $background, $border) {
  color: $color;
  background-color: $background;
  background-image: linear-gradient(135deg, lighten($background,10%) 0%, $background 100%);
  border-color: $border;

  &:hover {
    color: $color;
    background-color: darken($background, 5%);
    background-image: linear-gradient(135deg, lighten(darken($background, 5%),10%) 0%, darken($background, 5%) 100%);
        border-color: darken($border, 5%);
  }
  &:active,
  &.active{
    color: $color;
    background-color: darken($background, 10%);
    background-image: linear-gradient(135deg, lighten(darken($background, 10%),10%) 0%, darken($background, 10%) 100%);
        border-color: darken($border, 10%);
  }
}
```
```
.btn--default {@include button-variant($white-color, $btn-default-bg, $btn-default-border);}
```

## CSS
* 1、cookie、localstorage、sessionstorage区别：
1. 存储大小。4K、5M、5M或更大
2. 数据有效期，设置的有效期内、始终有限、当前窗口
3. 作用域不同。所有窗口、所有窗口、当前窗口

vuex存储和本地存储(localstorage、sessionstorage)的区别
1.最重要的区别：vuex存储在内存，localstorage则以文件的方式存储在本地

2.应用场景：vuex用于组件之间的传值，localstorage则主要用于不同页面之间的传值。

3.永久性：当刷新页面时vuex存储的值会丢失，localstorage不会。

注：很多同学觉得用localstorage可以代替vuex, 对于不变的数据确实可以，但是当两个组件共用一个数据源（对象或数组）时，如果其中一个组件改变了该数据源，希望另一个组件响应该变化时，localstorage无法做到，原因就是区别1

* 2、预加载与缓存

* 3、图片如何压缩？
1. 图标字体
2. CSS Sprites，雪碧图
3. 使用png
4. 去掉JPG的 metadata

* 4、盒子模型
内容、填充、边框、边界

IE盒子模型、W3C盒子模型；width = border+padding+内容，后者width = 内容

* 5、flex

> 容器的属性

1. flex-direction
2. flex-wrap
3. flex-flow
4. justify-content 项目在主轴上的对齐方式 （flex-start | flex-end | center | space-between | space-around;）
5. align-items 项目在交叉轴上如何对齐。 （flex-start | flex-end | center | baseline | stretch;）
6. align-content

> 项目的属性

1. order 排序
2. flex-grow 放大
3. flex-shrink 缩小
4. flex-basis 分配多余空间前占据主轴空间
5. flex
6. align-self 单独设置项目占比

* 6、position：

relative和absolute区别
relative是相对定位，相对于本身的位置，本身位置还在
以父级左上角为原点进行定位

* 7、自动换行问题
```
  .box span:last-child{
    flex: 1;
    overflow-wrap: break-word;
    word-wrap:break-word;
    overflow:hidden;
  }
```

## JS

* 7、闭包问题


* 8、this工作原理

* 9、移动端适配
1. 单独的项目
2. media适配尺寸
3. rem相对于根元素的字体大小的单位。等比适配所有屏幕

* 10、前端设计模式
单例、工厂、观察者、适配器、代理模式、策略模式、模板模式、

* 11、正则表达式

* 12、ES6新特性
1. let和const
2. 解构
3. set和map
4. 函数的扩展。箭头函数
5. 字符串扩展，模板字符串
6. 类的扩展，构造器、继承
7. for of 循环的值
8. 模块的概念
9. Symbols

* 11、JS中的六大数据类型

js中有六种数据类型，包括五种基本数据类型（Number,String,Boolean,Undefined,Null）,和一种复杂数据类型（Object）。

## Html5

### 新特性

1. 新增多媒体标签，audio media
2. 存储 localstorage、sessionstorage
3. header、footer、新增标签
4. 设备兼容
5. canvas 三维、图形及特效特性
绘制弧形
优点
1. 多设备、跨平台
2. 网络标准
3. 替代了flash和silverlight
4. 移动端优先，应用于应用程序和游戏

## Jquery

## VUE
### 跨域
1. jsonp原理
> jsonp,即json+padding,动态创建script标签,利用script标签的src属性可以获取任何域下的js脚本,通过这个特性(也可以说漏洞),服
务器端不在返货json格式,而是返回一段调用某个函数的js代码，在src中进行了调用，这样实现了跨域.

2. 遍历数组问题

数组元素 为对象，对象属性变更，为渲染界面

3. 路由切换

routerUpdate 组件复用，子组件切换。

4. 多次访问同一组件

缓存页面问题

5. 打包空白

> 1、static中的文件不进行编译，部分手机浏览器ES6不支持
>
> 2、路由问题导致，history 后端未配合控制加载。

## 混合开发

1、浏览器内核封装

# 二、优化

## 资源优化
1. 预加载与缓存
2. 图片压缩
3. 延迟加载
4. CSS放顶部、JS放body中

## 网络优化
1. 减少HTTP请求个数
2. 减少DNS查询个数
3. 缓存ajax

## 代码优化
* 混淆压缩 CSS、JS
1. CSS ： 减少层级、减少查询范围、代码量
2. JS
3. html


# 三、安全
XSS攻击
禁止危险脚本

1. js加密，混合开发，原生与h5交互
2. 微信开发，用户信息获取加密
3. js立即执行函数
> 做到立即执行，要注意两点，
>
> 一、是函数体后面要有小括号()
>
> 二、是函数体必须是函数表达式而不能是函数声明。
```
(function(){

}())
```

# 四、项目管理