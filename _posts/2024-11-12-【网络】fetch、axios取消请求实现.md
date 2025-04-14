---
title: 2024-10-28-【研发】nestjs微服务
description:
categories:
  - 工程化
tags:
  - nestjs
---

## Axios 请求通过 CancelToken 来取消请求

Axios 自带有取消请求的借口，在 Axios 中通过 CancelToken 取消请求发送。下面是一个示例：

```
/ 引入 Axios 库
const axios = require('axios');

// 创建一个 CancelToken.source 对象
const { CancelToken, axiosInstance } = axios;
const source = CancelToken.source();

// 创建一个 Axios 请求
const request = axiosInstance.get('https://api.example.com/data', {
  cancelToken: source.token // 传递 CancelToken 对象到请求配置中
});

// 设置一个定时器，在 3 秒后取消请求
setTimeout(() => {
  source.cancel('Request canceled due to timeout');
}, 3000);

// 发起请求并处理响应
request.then(response => {
  console.log('Response:', response.data);
}).catch(error => {
  if (axios.isCancel(error)) {
    console.log('Request canceled:', error.message);
  } else {
    console.error('Error:', error);
  }
});
```

> 在这个示例中，我们首先引入 Axios 库，并创建了一个 CancelToken.source 对象 source。然后，我们发起一个 GET 请求，并在请求配置中传递了 cancelToken: source.token，以便 Axios 知道我们要使用哪个 CancelToken 来取消请求。
> 接着，我们设置了一个定时器，在 3 秒后调用 source.cancel() 方法取消请求，并传递了一个取消原因。最后，我们发起请求，并在 .then() 和 .catch() 方法中分别处理响应和错误。如果请求被取消，我们通过 axios.isCancel(error) 来检查错误类型，并输出相应的日志。
