---
title: 2022-11-29-【多线程】web worker
description: 
categories:
 - linux
tags:
 - linux
---

1. 问题1： work个数有上限吗？

## 同页面的 Web Worker
### 示例1：Worker 线程完成轮询，模拟消息实时通知
``` js
<script>
  function createWorker(f) {
    // 立即执行函数，转换为二进制数据
    var blob = new Blob(['(' + f.toString() + ')()']);
    var url = window.URL.createObjectURL(blob);
    var worker = new Worker(url);
    return worker;
  }

  var pollingWorker = createWorker(function (e) {
    setInterval(function () {
      self.postMessage({ data: '成功了' });
    }, 1000);
  });

  pollingWorker.onmessage = function (event) {
    // render data
    console.log(event.data);
  };

  pollingWorker.postMessage('init');
</script>
```