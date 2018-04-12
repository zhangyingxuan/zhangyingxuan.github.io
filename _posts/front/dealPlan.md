---
layout: category
category: front
---

# 一、let 和 const 命令

## 1、let
* 不存在变量提升
> var命令会发生”变量提升“现象，即变量可以在声明之前使用，值为undefined
>
> let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。

* 暂时性死区
> 在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”
>
> typeof x; // ReferenceError
>
> let x;

* 不允许重复声明

## 2、块级作用域
> 为什么需要块级作用域？

## 3、const
* ES6 声明变量的六种方法 ： var function let const import class

综上所述，很难找到一种方法，可以在所有情况下，都取到顶层对象。下面是两种勉强可以使用的方法。
```
// 方法一
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// 方法二
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```


# 模板字符串
* 变量写法 ${name}
> 1、大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性。
>
> 2、模板字符串之中还能调用函数。
>
> 3、比如，大括号中是一个对象，将默认调用对象的toString方法。
>
> 4、如果模板字符串中的变量没有声明，将报错。
```
$('#result').append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`);
```

# 函数的扩展
## 函数参数默认值
> 1、参数变量是默认声明的，所以不能用let或const再次声明。
>
> 2、使用参数默认值时，函数不能有同名参数。
>
## 箭头函数
> 如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。
>
> 如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
```
// 报错
let getTempItem = id => { id: id, name: "Temp" };

// 不报错
let getTempItem = id => ({ id: id, name: "Temp" });
```
* 注意事项
> 箭头函数中的this始终指向函数定义时的this