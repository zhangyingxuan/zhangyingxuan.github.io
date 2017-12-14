---
layout: category
category: front
---
# vue.js
# react.js

# jquery用法

## 常用方法汇总


### 一,js 获取元素(父节点,子节点,兄弟节点)
```
var test = document.getElementById("test");
var parent = test.parentNode; // 父节点
var chils = test.childNodes; // 全部子节点
var first = test.firstChild; // 第一个子节点
var last = test.lastChile; // 最后一个子节点　
var previous = test.previousSbiling; // 上一个兄弟节点
var next = test.nextSbiling; // 下一个兄弟节点
```
### 二,jquery 获取元素(父节点,子节点,兄弟节点)
```
$("#test1").parent(); // 父节点
$("#test1").parents(); // 全部父节点
$("#test1").parents(".mui-content");
$("#test").children(); // 全部子节点
$("#test").children("#test1");
$("#test").contents(); // 返回#test里面的所有内容，包括节点和文本
$("#test").contents("#test1");
$("#test1").prev(); // 上一个兄弟节点
$("#test1").prevAll(); // 之前所有兄弟节点
$("#test1").next(); // 下一个兄弟节点
$("#test1").nextAll(); // 之后所有兄弟节点
$("#test1").siblings(); // 所有兄弟节点
$("#test1").siblings("#test2");
$("#test").find("#test1");
```
### 三,元素筛选
```
// 以下方法都返回一个新的jQuery对象，他们包含筛选到的元素
$("ul li").eq(1); // 选取ul li中匹配的索引顺序为1的元素(也就是第2个li元素)
$("ul li").first(); // 选取ul li中匹配的第一个元素
$("ul li").last(); // 选取ul li中匹配的最后一个元素
$("ul li").slice(1, 4); // 选取第2 ~ 4个元素
$("ul li").filter(":even"); // 选取ul li中所有奇数顺序的元素
```

## 查找父元素
1、parent([expr])

取得一个包含着所有匹配元素的唯一父元素的元素集合。
你可以使用可选的表达式来筛选。

```
$('#item1').parent().parent('.parent1');
```

2、:parent

匹配含有子元素或者文本的元素
```
$('li:parent');
```

3、parents([expr])

取得一个包含着所有匹配元素的祖先元素的元素集合（不包含根元素）。可以通过一个可选的表达式进行筛选。
```
$('#items').parents('.parent1');
```

4、closest([expr])

closest会首先检查当前元素是否匹配，如果匹配则直接返回元素本身。如果不匹配则向上查找父元素，一层一层往上，直到找到匹配选择器的元素。如果什么都没找到则返回一个空的jQuery对象。

closest和parents的主要区别是：1，前者从当前元素开始匹配寻找，后者从父元素开始匹配寻找；2，前者逐级向上查找，直到发现匹配的元素后 就停止了，后者一直向上查找直到根元素，然后把这些元素放进一个临时集合中，再用给定的选择器表达式去过滤；3，前者返回0或1个元素，后者可能包含0 个，1个，或者多个元素。

closest对于处理事件委派非常有用。
```
$('#items1').closest('.parent1');
```

## 查找子元素

1、使用筛选条件
```
$('#test span.demo')
```
2、使用find()函数
```
$('#test').find('span.demo')
```
3、使用children()函数
```
$('#test').children('span.demo')
```