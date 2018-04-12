\---
layout: category
category: front
---

[vue-router参考文档](https://router.vuejs.org/zh-cn/)

# 前言
> 路由，其实就是指向的意思，当我点击页面上的home按钮时，页面中就要显示home的内容，
如果点击页面上的about 按钮，页面中就要显示about 的内容。Home按钮  => home 内
容， about按钮 => about 内容，也可以说是一种映射. 所以在页面上有两个部分，一
个是点击部分，一个是点击之后，显示内容的部分。

* 路由中有三个基本的概念 route, routes, router。
1. route，它是一条路由，由这个英文单词也可以看出来，它是单数， Home按钮  =>
home内容， 这是一条route,  about按钮 => about 内容， 这是另一条路由。

2. routes 是一组路由，把上面的每一条路由组合起来，形成一个数组。[{home 按钮
=>home内容 }， { about按钮 => about 内容}]

3. router 是一个机制，相当于一个管理者，它来管理路由。因为routes 只是定义了一
组路由，它放在哪里是静止的，当真正来了请求，怎么办？ 就是当用户点击home
按钮的时候，怎么办？这时router 就起作用了，它到routes 中去查找，去找到对应的
home 内容，所以页面中就显示了 home 内容。

4. 客户端中的路由，实际上就是dom 元素的显示和隐藏。当页面中显示home 内容的时候
，about 中的内容全部隐藏，反之也是一样。客户端路由有两种实现方式：
基于hash 和基于html5 history api.

* this.$router 与 this.$route 区别

1. route是路由信息，router是路由操作；

2. 前者用于query、params方式传递参数，
后者用于接收参数内容（this.$route.params/this.$route.query）
3. 路由跳转之后本地刷新,query参数不丢失， params会丢失，  query的参数是路径传参的原理

# 一、安装
1. 指令安装
```
npm install vue-router --save
```

2. 引入vue-cli
```
//ES6语法导入
import VueRouter from 'vue-router'

//注册
Vue.use(VueRouter)

// 注入vue实例中
new Vue({
 el: '#app',
 router,
 template: '<App/>',
 components: { App }
})
```

3. 实例化
```
const router = new VueRouter({
 mode: 'history',
 routes:[
  {path: '/', component:DemoHome},
  {path: '/about', component:DemoAbout},
  {path: '/contact', component:DemoContact}
 ]
})
```

# 二、使用

1. 页面实现（html模版中）

在vue-router中, 我们看到它定义了两个标签
`<router-link> `和`<router-view>`来对应点击和显示部分。`<router-link>`
就是定义页面中点击的部分，`<router-view>` 定义显示部分，就是点击后，
区配的内容显示在什么地方。所以 `<router-link>` 还有一个非常重要的属性 to，
定义点击之后，要到哪里去， 如：`<router-link  to="/home">Home</router-link>`

2. js 中配置路由

首先要定义route,  一条路由的实现。它是一个对象，由两个部分组成： path和component.
path 指路径，component 指的是组件。如：{path:’/home’, component: home}
我们这里有两条路由，组成一个routes:
```
const routes = [
  { path: '/home', component: Home },
  { path: '/about', component: About }
]
```

最后创建router 对路由进行管理，它是由构造函数 new vueRouter() 创建，接受routes 参数。
```
const router = new VueRouter({
      routes // routes: routes 的简写
})
```

编程式导航：这主要应用到按钮点击上。当点击按钮的时候，跳转另一个组件, 这只能用代码，
调用rourter.push() 方法。 当们把router 注入到根实例中后，组件中通过
this.$router 可以获取到router, 所以在组件中使用
```
router.push('home') //参数为字符串
router.push({path:'home'}) //参数为对象
router.push({name:'user',params:{userId:123}})//参数为命名的路由
// 带查询参数，变成 /register?plan=private
router.push({path:'register',query:{plan:'private'}})
// 跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。
router.replace(location)
```
// 参数获取
```
this.$route.params
this.$route.params.userId
```

# 问题集
## 1、打包后，页面空白，不报错
注释 history 代码

## 2、路由切换滚屏至顶端
  ,scrollBehavior:() => ({y: 0})

## 3、路由局部刷新实现
[参考文献1](https://www.jianshu.com/p/be24d09f10bf)

[参考文献2](https://www.cnblogs.com/sysuhanyf/p/7454530.html)

* 方法一
> 利用 include、exclude
>
> include: 字符串或正则表达式。只有匹配的组件会被缓存。
>
> exclude: 字符串或正则表达式。任何匹配的组件都不会被缓存。
>
> 组件中, 与name 同名设置 include/exclude中的参数
```
export default {
    name: 'test-keep-alive'
}
```

```
<keep-alive include="test-keep-alive">
  <!-- 将缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>

<keep-alive include="a,b">
  <!-- 将缓存name为a或者b的组件，结合动态组件使用 -->
  <component :is="view"></component>
</keep-alive>

<!-- 使用正则表达式，需使用v-bind -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 动态判断 -->
<keep-alive :include="includedComponents">
  <router-view></router-view>
</keep-alive>

<keep-alive exclude="test-keep-alive">
  <!-- 将不缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>
```
* 方法二
> activated
```
//通过activated钩子触发请求函数
activated() {
    this.getDetail();
},
//返回详情页面时 隐藏内容div区块 再进入详情时 显示内容div区块
deactivated() {
    this.isShowContent = false;
}
```

* 方法三
> 使用$route.meta的keepAlive属性
>
> 局限性：无法包裹在`<transition>` 中 报错：<transition> can only be used on a single element. Use <transition-group> for lists.
```
<keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>
```

```
//...router.js
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
      meta: {
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/page1',
      name: 'Page1',
      component: Page1,
      meta: {
        keepAlive: true // 需要被缓存
      }
    }
  ]
})
```