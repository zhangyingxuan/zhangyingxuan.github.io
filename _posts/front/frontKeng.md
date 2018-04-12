---
layout: category
category: front
---

# 1、localstorage无法存放对象，仅存放字符串

* localStorage.setItem() 不会自动将Json对象转成字符串形式
* 解决方法
* a. 存储前先用JSON.stringify()方法将json对象转换成字符串形式
```
/**
 *
 * @param key
 * @param value
 * @returns {*}
 */
function setSessionStoreData(key, value) {
    var isSuccess = false;
    // 判断浏览器是否支持sessionStorage
    if (window.sessionStorage) {
        if (isJSONStr(value)) {
            window.sessionStorage.setItem(key, value);
        } else if (isJsonObj(value)) {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } else {
            var data = {};
            data.data = value;
            window.sessionStorage.setItem(key, JSON.stringify(data));
        }
        isSuccess = true;
    }
    return isSuccess;
}
```
* b. 读取时将之前存储的JSON字符串先转成JSON对象再进行操作
```
/**
 *  获取 sessionStorage数据
 * @param key
 * @returns {{}}
 */
function getSessionStoreDataObj(key) {
    var responseObj = undefined;
    // 判断浏览器是否支持sessionStorage
    if (window.sessionStorage) {
        var responseJson = window.sessionStorage.getItem(key);
        if (responseJson != null && responseJson != undefined) {
            responseObj = JSON.parse(responseJson);
        }
    }
    return responseObj;
}
```

# 2、vue [数组更新检查](https://cn.vuejs.org/v2/guide/list.html#)，界面渲染未及时更新
* 由于 JavaScript 的限制，Vue 不能检测以下变动的数组：
* 1、当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
```
Vue.set(example1.items, indexOfItem, newValue)
```
* 2、当你修改数组的长度时，例如：vm.items.length = newLength
```
example1.items.splice(newLength)
```
# 3、
# 4、路由切换
#