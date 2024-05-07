---
title: 2023-03-12-【工程化】脚手架搭建手册
description:
categories:
  - 工程化
tags:
  - 脚手架SDK
---

LightHouse 分析得出页面 dom 数超 1.5w 个元素

- 页面分析
  4 个 tab 页，一次性全部渲染页面（业务需要），其中一个页面 dom 数量占 4/5，需重点优化

- 大 tab 页 dom 结构分析

  3 个未分页（业务需要）的自定义大 table 组成，每行至少一个 popover 导致大量 popover 被渲染。

- 优化思路

1. 减少 dom 层级，优化页面中无意义的 dom 嵌套。
2. 提取 popover 等可复用的组件，降低渲染成本。
3. 虚拟滚动降低滚动资源消耗（table 总行数 < 1000）

- 项目背景
  vue3 + vite + element-plus + typescript

- 考虑到大量 popover 带来了大量的 dom 渲染，首要任务提取 popover，多地共用的方式优先解决

1. 第一步，页面保留一个 popover，去除几百上千个 popover
   利用 ”虚拟触发“ 向 popover 传入 virtual-ref，在需要的时机 显示 popover，官网示例如下

```
<template>
  <el-button ref="buttonRef" v-click-outside="onClickOutside"
    >Click me</el-button
  >

  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    title="With title"
    virtual-triggering
  >
    <span> Some content </span>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
</script>
```

2. 具体实现代码
   - 将触发元素 传递给 virtual-ref 即可。
   - 为保证全局使用组件，利用 provide、inject 跨祖孙组件使用 popover 组件

```
调用方.vue
<!-- 将触发的dom 传递 给popover -->
  <span
    ref="stockRef"
    @mouseover="(e: Event) => handleShowPoper(e, superData)"
  >
  ...


   function handleShowPoper(e: Event, superData: any) {
      showPoper(e.target, superData);
   }
```

```
popover组件.vue
```
