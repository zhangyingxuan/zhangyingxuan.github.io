---
title: 2018-04-12-vue-cli-vuex
layout: category
category: front
---

# 一、Vuex 使用背景

关于 Vuex 官方文档如是说道，“Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化”，说人话就是类似一个单列数据管理中心。
不管我们在移动端开发还是 H5 前端开发过程中，总是会遇到多个视图依赖于同一状态或者来自不同视图的行为需要变更同一状态。例如，行啊项目里面选择乘客界面、添加临客和添加常客的数据源变化存在相互依赖关系，如果采用组件间传值的方式，会存在数据被多次拷贝，维护较为困难等问题，而 Vuex 就是解决诸如此类的问题。

# 二、Vuex 安装和引入

## 1、NPM 安装

```
npm install vuex --save
```

## 2、引入项目

在一个模块化的打包系统中（main.js），必须显式地通过 Vue.use() 来安装 Vuex：

```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

## 3、项目架构引入

<!-- | -->
<!-- |-src -->
<!-- |  | -->
<!-- |  |-components -->
<!-- |  |-stroe -->
<!-- |  |  |-modules -->
<!-- |  |  |  |-choosePsg.js -->
<!-- |  |  |-actions.js -->
<!-- |  |  |-getters.js -->
<!-- |  |  |-index.js -->

<img src="/images/translateVue2/translateVue2-vux-tree.png" width="600px" height="400px"/>

项目中使用到 vuex 后，需要在 src 目录下新建一个 stroe 的目录，用于存放我们 vuex 相关代码和逻辑。store 目录结构解析：

|    文件    | 说明                                          |
| :--------: | :-------------------------------------------- |
|  modules   | 按模块划分的目录，存放对应模块的公共数据源    |
| actions.js | 全局公共方法                                  |
| getters.js | 全局公共属性                                  |
|  index.js  | 所有 store 相关的文件的根文件，类似 style.css |

# 三、Vuex 使用方式

下面以 choosePsg.js 为例，分别声明和实现了 vuex 中的 state、getters、actions、mutations

<!-- ![Alt text](/path/to/img.jpg) -->
<img src="/images/translateVue2/vue-cli-vuex1.png" width="600px" height="400px"/>

然后在 store 目录下 index.js 中引入 choosePsg.js

<img src="/images/translateVue2/vue-cli-vuex2.png" width="600px" height="400px"/>

接着在 main.js，引入 store

<img src="/images/translateVue2/vue-cli-vuex3.png" width="600px" height="400px"/>

最后在，choosePsg.vue 中进行使用，完成根据数据源显示常客，删除选择的乘客和点击下一步时组装乘客数组的操作，如图：

<img src="/images/translateVue2/vue-cli-vuex4.png" width="600px" height="400px"/>

# 四、注意事项

Vuex 在使用模块中可以有多种调用方式，为了方便阅读和维护代码，我们需要在此做出约定，在调用模块使用 vuex 时必须采用以下写法，如图：

1. “mapState，mapGetters，mapMutations，mapActions”，是把全局的 state 和 getters 映射到当前组件的 computed 计算属性中，以及把全局的 mutation 和 action 映射到当前组件的 methods 中，但必须注意我们在写数据管理的方法时，千万别重名，否则可能出现无法映射问题。
2. 使用“...”扩展运算符。例如 mapState，如果不使用扩展运算符，则无法放到 computed 中，会造成 computed 无法添加其他计算属性。
3. 当前界面绑定的数据源、方法和 vuex 中的数据源以及方法必须显式调用，方便大家阅读。
4. 由于 vuex 是一个单列数据管理中心，那么对于某些数据的使用需要注意清空时机。
