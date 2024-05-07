---
title: 2024-02-23 -【vue3性能优化-payBack】表格内容高亮
description:
categories:
  - 工程化
tags:
  - 脚手架SDK
---

## 思路

1. v-html 替换原内容方式 高亮
2. 交互上，通过关键字提取，替换原数据中的普通文本 为高亮文本
3. 触发 vue3 reactive 变量进行数据重置 重绘局部页面

```
export function highlightKeyWord(result: string, keyword: string) {
  if (keyword && result) {
    /**
     * 使用正则表达式进行全文匹配关键词
     * ig : 表示 全文查找 ,忽略大小写
     *  i : 忽略大小写
     *  g : 全文查找
    *
    * 使用字符串的replace方法进行替换
    * stringObject.replace('被替换的值',替换的值)
    */
    const replaceReg = new RegExp(keyword, 'ig');
    const replaceString = `<span class="searchWord">${keyword}</span>`;
    result = result.replace(replaceReg, replaceString);
  }
  return result;
}
```

```
function handleKeyWordClick(key: string) {
  data.keyword = key;

  // 过滤个股数据，并排序
  // 修改父组件传过来的值；将重新渲染整个 table 数据，让数据高亮
  // emit('update:currentDateData', _.cloneDeep(superData.currentDateData));
}
```
