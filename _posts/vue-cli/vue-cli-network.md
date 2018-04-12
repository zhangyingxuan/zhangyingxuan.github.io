---
layout: category
category: front
---

> 目的：将项目中所有调用网络的方法，集成在一个js中，可以公共调用，重复使用。

# 步骤：
## 1，将基础配置信息引入到network.js
封装的post方法，封装的get方法。
## 2，将项目所有接口url地址写成常量，在一个urlInfo.js管理。
例如：

export default {
  //登录接口
 loginUrl: 'app/account/login.json',
}
## 3，将所有调用网络的方法，封装在一个htrpService.js，可在所有需要地方调用。
```
import uriInfo from './urllnfo'
import network from '../js/network'
export default {
  //登录
login:function (params) {
  alert(uriInfo.loginUrl)
  return network.post(uriInfo.loginUrl,params);
}
```
## 4，使用方法一：
首先在main.js引入全局函数
```
import httpService from './api/httpService.js'
// 添加的全局方法最好是加上$标识符 这样好区分
Vue.prototype.$axios =  httpService
然后在需要使用的vue中，例如Login.vue
loginAction: function (isRememberPassword, language) {
        var _this = this
 var param = {
          requestObject: {
            corpCode: this.loginInfo.corpCode,
            userNameEq: this.loginInfo.userName,
            passWord: this.loginInfo.password,
            local: language,
            appVersioncode: '3600',
            loginType: ''
          }
        }
       this.$axios.login(param).then(function (response) {
       // 做接口访问成功的数据处理
          })
          .catch(function (error) {
 // 可以写一些异常处理办法，如果没有特别的，可删除.catch()方法
        })
      }
```

## 使用方法二：
需要用哪个接口方法，调用哪一个。
在vue中
```
import httpService from '../../api/httpService'
```