---
title: 2025-04-21- 【chrome扩展】chrome扩展开发
description:
categories:
  - chrome扩展
tags:
---

# 前言

随着 Web 技术的发展，Chrome 扩展（Extension）已成为用户增强浏览器功能、提高效率的重要工具。本指南将为您提供基于 Chrome 扩展 Manifest V3 (MV3)、Vue 3、Vite 和 TypeScript 的现代化开发最佳实践。

## 🚀 一、开发前准备

### 1. Chrome 开发者账号

要发布扩展到 Chrome Web Store，您必须注册一个开发者账号。

- **注册流程：**
  1.  访问 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/developer/dashboard)。
  2.  使用您的 Google 账号登录。
  3.  支付 **一次性 $5 美元** 的注册费用(淘宝可以找到充值谷歌应用商店的店铺)。
  4.  同意开发者协议。
- **重要性：** 只有注册并付费后，您才能上传和发布您的扩展程序。

### 2. 核心技术栈

| 技术                   | 作用                | 优势                                           |
| :--------------------- | :------------------ | :--------------------------------------------- |
| **Manifest V3 (MV3)**  | Chrome 扩展的新标准 | 更安全、性能更高，是 Chrome 强制要求的新架构。 |
| **Vue 3 + TypeScript** | 前端界面开发框架    | 强大的组件化、类型安全、开发效率高。           |
| **Vite**               | 极速前端构建工具    | 开发时热更新快，构建打包体积小。               |

---

## 🔑 二、项目从 0 到 1：最佳实践

由于 MV3 的核心是 **Service Worker**，以及 Vite 默认的构建流程需要特殊处理，我们需要一个定制化的项目结构。

### 1. 基础项目搭建

我们使用 Vue 官方推荐的方式搭建项目，然后进行调整。

```bash
# 1. 创建 Vue + Vite + TS 项目
npm create vue@latest my-chrome-extension -- --typescript

# 2. 进入项目并安装依赖
cd my-chrome-extension
npm install
```

### 2. 项目结构调整

一个 MV3 扩展通常包含三个核心文件：`manifest.json`、Service Worker 和界面（Popup/Options）。

```
my-chrome-extension/
├── public/
│   ├── manifest.json  <-- 扩展的配置清单 (核心)
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   │   ├── popup/     <-- 弹出页面的 Vue 逻辑
│   │   └── options/   <-- 设置页面的 Vue 逻辑
│   ├── background.ts  <-- Service Worker 脚本 (后台逻辑)
│   ├── popup.html     <-- 弹出页面的入口 HTML
│   ├── options.html   <-- 设置页面的入口 HTML
│   └── main.ts        <-- Vue 应用入口
├── vite.config.ts
└── tsconfig.json
```

### 3. 配置 `manifest.json` (MV3 核心)

这是扩展的“身份证”。将其放在 `public` 目录下，Vite 会在构建时自动复制它。

```json
// public/manifest.json
{
  "manifest_version": 3,
  "name": "我的 Chrome 扩展",
  "version": "1.0.0",
  "description": "基于 Vue3 + Vite 的 MV3 扩展",
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },

  // 核心配置一：后台脚本 (Service Worker)
  "background": {
    "service_worker": "background.js",
    "type": "module" // 使用 ES Module 规范
  },

  // 核心配置二：弹出界面
  "action": {
    "default_title": "点击打开扩展",
    "default_popup": "popup.html",
    "default_icon": "icon16.png"
  },

  // 核心配置三：权限声明
  "permissions": [
    "storage", // 允许使用 chrome.storage
    "activeTab" // 允许访问当前活动标签页
  ],

  // 可选：设置页面
  "options_page": "options.html",

  // 可选：内容脚本 (注入到网页中)
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"] // 需要单独打包
    }
  ]
}
```

### 4. 改造 Vite 配置 (`vite.config.ts`)

这是最关键的一步。由于 MV3 需要独立打包 Service Worker（`background.js`）和内容脚本（`content-script.js`），我们必须使用 Vite 的 \*\*多入口（Multi-Page）\*\*配置，并调整输出路径。

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// 定义多个入口文件
const input = {
  // 1. 弹出页面的入口 HTML
  popup: resolve(__dirname, "popup.html"),
  // 2. 选项页面的入口 HTML (可选)
  options: resolve(__dirname, "options.html"),
  // 3. Service Worker 脚本的入口 (无需 HTML)
  background: resolve(__dirname, "src/background.ts"),
  // 4. 内容脚本的入口 (无需 HTML)
  // 'content-script': resolve(__dirname, 'src/content-script.ts'),
};

export default defineConfig({
  plugins: [vue()],

  build: {
    // 强制输出到 'dist' 目录
    outDir: "dist",

    // 禁用 CSS 代码分离，确保所有样式都内嵌或打包到各自的 JS/CSS 文件
    cssCodeSplit: false,

    rollupOptions: {
      input: input,
      output: {
        // 配置输出文件名格式，确保文件名是固定的，而不是带 Hash 的，方便 manifest.json 引用
        chunkFileNames: `assets/[name].js`,
        entryFileNames: (chunkInfo) => {
          // 确保 background.js 和 content-script.js 文件名固定
          if (["background", "content-script"].includes(chunkInfo.name)) {
            return `${chunkInfo.name}.js`;
          }
          // 其他文件（popup, options）可以保持默认结构
          return `assets/[name].js`;
        },
        // 确保 CSS 文件名简洁
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
```

### 5. 编写 Service Worker 脚本

Service Worker 负责处理后台逻辑、监听事件和跨组件通信。

```typescript
// src/background.ts
console.log("Service Worker 启动成功! (MV3)");

// 监听扩展首次安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log("扩展已安装。");
});

// 监听来自 popup.js 或 content-script.js 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get_current_url") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || "无法获取URL";
      sendResponse({ url: url });
    });
    // 必须返回 true 来指示 sendResponse 将被异步调用
    return true;
  }
});
```

## ⚙️ 三、跨组件通信和调试

### 1. 跨组件通信 (MV3 核心)

在 MV3 架构中，Popup、Options Page、Content Script 和 Service Worker 运行在完全独立的进程中，必须通过 \*\*消息传递（Message Passing）\*\*进行通信。

| 发送方                   | 接收方             | 通信方法                       | 示例场景                     |
| :----------------------- | :----------------- | :----------------------------- | :--------------------------- |
| **Popup/Content Script** | **Service Worker** | `chrome.runtime.sendMessage()` | 向后台发送请求，保存设置。   |
| **Service Worker**       | **Popup/Options**  | `chrome.runtime.sendMessage()` | 后台数据更新，通知前端刷新。 |
| **Content Script**       | **当前页面 DOM**   | `window.postMessage()`         | 注入脚本与网页原生 JS 通信。 |

### 2. 调试技巧

1.  **打包构建：**

    ```bash
    npm run build
    ```

    这会在 `dist` 目录下生成所有文件。

2.  **加载扩展：**

    - 在 Chrome 浏览器中访问 `chrome://extensions`。
    - 打开右上角的 **“开发者模式”** 开关。
    - 点击 **“加载已解压的扩展程序”**。
    - 选择你项目的 `dist` 目录。

3.  **调试 Service Worker：**

    - 在 `chrome://extensions` 页面找到你的扩展。
    - 点击你的扩展卡片上的 **“Service Worker”** 链接。
    - 这将打开 Chrome DevTools，可以查看 `console.log` 和设置断点。

4.  **调试 Popup/Options Page：**

    - 右键点击浏览器工具栏上的扩展图标。
    - 选择 **“检查弹出内容”** 或在 Options 页面右键选择 **“检查元素”**。
    - 这将打开一个独立的 DevTools 窗口进行调试。

## 总结

MV3 扩展开发的关键在于管理好 manifest.json 和 正确配置 Vite 的多入口打包，以生成符合 MV3 要求的独立脚本文件。一旦通信机制建立，您就可以在 Vue 3 提供的强大组件化能力下，高效开发复杂的用户界面。

# 参考文献

1. [chrome 开发手册](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn)
