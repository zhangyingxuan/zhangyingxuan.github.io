---
title: 2023-06-06-【研发】web works与service worker对比
description: Web Workers 是通用的“后台计算线程”，Service Workers 是特殊的“网络代理线程”（专为 PWA 离线缓存、推送通知等场景设计）。
categories:
  - 研发
tags:
  - web works
  - service worker
---

**Web Workers** 和 **Service Workers** 均属于浏览器提供的**多线程编程技术**，基于“后台线程独立于主线程运行”的核心思想，但二者的**设计目标、功能特性和应用场景**有显著差异。简单来说：**Web Workers 是通用的“后台计算线程”，Service Workers 是特殊的“网络代理线程”**（专为 PWA 离线缓存、推送通知等场景设计）。

### **一、核心定义与目标**

| **维度**     | **Web Workers（普通 Web Worker）**                                              | **Service Workers**                                                                         |
| ------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **本质**     | 通用的**后台计算线程**，用于在独立线程执行耗时脚本，避免阻塞主线程（UI 线程）。 | 特殊的**事件驱动型 Web Worker**，作为“网络请求代理”，控制页面资源加载、缓存策略、离线体验。 |
| **核心目标** | 解决“主线程阻塞”问题（如大数据计算、复杂渲染、加密解密）。                      | 实现“离线优先”“网络代理”“推送通知”等 PWA（渐进式 Web 应用）核心能力。                       |

### **二、关键特性对比**

#### **1. 生命周期**

- **Web Workers**：

  - **简单线性生命周期**：由主线程通过 `new Worker()` 创建 → 运行中（通过 `postMessage` 通信）→ 主线程调用 `worker.terminate()` 或 Worker 内部调用 `self.close()` 终止。
  - **无持久化**：关闭后资源释放，下次需重新创建。

- **Service Workers**：
  - **复杂多阶段生命周期**（类似操作系统服务）：
    - **安装（Install）**：首次注册时触发，用于预缓存关键资源（如 `install` 事件中调用 `cache.addAll()`）。
    - **激活（Activate）**：安装完成后触发，用于清理旧缓存（如 `activate` 事件中删除过期缓存）。
    - **等待（Waiting）**：若已有旧 Service Worker 运行，新安装的 SW 会进入等待状态，直到旧 SW 终止。
    - **运行（Running）**：激活后长期驻留（即使页面关闭），通过事件监听（如 `fetch`、`push`、`sync`）响应网络请求或系统事件。
  - **持久化**：激活后可长期运行（浏览器后台），除非手动注销或用户清除缓存。

#### **2. 运行环境与权限**

| **特性**     | **Web Workers**                             | **Service Workers**                             |
| ------------ | ------------------------------------------- | ----------------------------------------------- |
| **DOM 访问** | ❌ 完全禁止（无 `window`/`document` 对象）  | ❌ 完全禁止（同普通 Worker）                    |
| **网络访问** | ✅ 可通过 `fetch`/`XMLHttpRequest` 发起请求 | ✅ 核心能力（拦截/修改所有页面网络请求）        |
| **缓存控制** | ❌ 无内置缓存 API                           | ✅ 支持 `Cache API`（持久化缓存资源）           |
| **推送通知** | ❌ 不支持                                   | ✅ 支持 `Push API`/`Notification API`           |
| **后台同步** | ❌ 不支持                                   | ✅ 支持 `Background Sync API`（断网后恢复请求） |
| **运行域**   | 与主线程同域（受同源策略限制）              | 与主线程同域，且需**HTTPS**（localhost 除外）   |

#### **3. 通信机制**

二者均通过 **`postMessage` 发送消息** + **`onmessage` 接收消息** 与主线程通信，但 Service Worker 因需控制页面，通信更复杂：

- **Web Workers**：

  - 单向/双向消息传递（主线程 ↔ Worker 线程），消息为结构化克隆数据（JSON 可序列化）。

  ```javascript
  // 主线程 → Worker
  worker.postMessage({ type: "compute", data: largeArray });
  // Worker → 主线程
  self.postMessage({ result: computedValue });
  ```

- **Service Workers**：
  - **双向通信**：主线程通过 `navigator.serviceWorker.controller.postMessage()` 发送消息，SW 通过 `self.addEventListener('message', ...)` 接收。
  - **网络请求拦截**：通过 `fetch` 事件劫持页面所有网络请求，可返回缓存资源或转发请求：
    ```javascript
    // SW 拦截 fetch 请求
    self.addEventListener("fetch", (e) => {
      e.respondWith(
        caches.match(e.request).then((cacheRes) => cacheRes || fetch(e.request))
      );
    });
    ```

#### **4. 应用场景**

- **Web Workers 适用场景**（通用后台计算）：

  - 大数据处理（如 10 万条数据排序、过滤）；
  - 复杂算法（如图像处理、加密解密、机器学习推理）；
  - 实时数据计算（如股票行情分析、传感器数据处理）；
  - 避免 UI 卡顿（如文件上传时的 MD5 校验）。

- **Service Workers 适用场景**（PWA 核心能力）：
  - **离线缓存**：预缓存静态资源（HTML/CSS/JS/图片），实现“断网可用”（如离线阅读、离线编辑）；
  - **网络代理**：拦截请求，优先返回缓存资源（提升加载速度），或根据网络状态动态切换数据源（如弱网下加载低清图）；
  - **推送通知**：接收服务器推送消息（如新邮件提醒、订单状态更新）；
  - **后台同步**：断网时暂存用户操作（如草稿保存），联网后自动同步到服务器。

### **三、相同点**

1. **独立线程运行**：均在后台线程执行，不阻塞主线程（UI 渲染、事件响应）。
2. **无 DOM 访问**：无法直接操作页面 DOM，需通过消息传递与主线程协作。
3. **同源策略限制**：只能访问与主线程同域的资源（Service Worker 额外要求 HTTPS）。
4. **基于消息通信**：通过 `postMessage` 和 `onmessage` 实现线程间数据交换。

### **四、典型示例对比**

#### **Web Workers 示例：大数据排序**

```javascript
// 主线程（Vue 组件）
const worker = new Worker("sort-worker.js");
worker.postMessage(largeArray); // 发送 10 万条数据
worker.onmessage = (e) => {
  this.sortedArray = e.data; // 接收排序结果（不阻塞 UI）
};

// sort-worker.js（Worker 线程）
self.onmessage = (e) => {
  const sorted = [...e.data].sort((a, b) => a - b); // 耗时排序
  self.postMessage(sorted); // 返回结果
};
```

#### **Service Workers 示例：PWA 离线缓存**

```javascript
// 主线程注册 SW
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("SW 注册成功"));
}

// sw.js（Service Worker 线程）
const CACHE_NAME = "my-pwa-v1";
const ASSETS = ["/", "/index.html", "/app.js", "/style.css"];

// 安装阶段：缓存关键资源
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// 激活阶段：清理旧缓存
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});

// 拦截 fetch 请求：优先返回缓存
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cacheRes) => cacheRes || fetch(e.request))
  );
});
```

### **五、如何选择？**

- **选 Web Workers**：若需**后台执行耗时计算**（如数据处理、算法运算），且不依赖网络拦截或离线功能。
- **选 Service Workers**：若需实现**PWA 核心能力**（离线缓存、推送通知、网络代理），或需长期驻留后台响应系统事件。

### **总结**

| **对比项**   | **Web Workers**            | **Service Workers**               |
| ------------ | -------------------------- | --------------------------------- |
| **角色**     | 通用后台计算线程           | 网络代理与离线服务线程            |
| **核心能力** | 耗时计算、避免 UI 阻塞     | 缓存控制、网络拦截、推送通知      |
| **生命周期** | 简单（创建 → 运行 → 终止） | 复杂（安装 → 激活 → 等待 → 运行） |
| **典型场景** | 大数据排序、图像处理       | PWA 离线应用、后台同步            |

简言之：**Web Workers 是“计算助手”，Service Workers 是“网络管家”**，二者互补而非替代，共同扩展了 Web 应用的能力边界。
