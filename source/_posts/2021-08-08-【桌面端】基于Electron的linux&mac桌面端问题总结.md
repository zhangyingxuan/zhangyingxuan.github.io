---
title: 2021-08-08-【架构】基于Electron的linux&mac桌面端问题总结
description: 基于 Electron 8、Vue 2 技术栈，深度解析linux&mac项目的架构设计与实现，涵盖聊天、音视频及会议模块。
categories:
  - 架构设计
tags:
  - Electron
  - Vue2
---

# Electron 8 + Vue 2 政务微信 (Linux/Mac) 疑难排查手册

本文档基于 Electron 8 与 Vue 2 技术栈，针对 Linux (ubuntu) 与 macOS 环境下的政务微信类应用，提供高频问题的排查与优化方案。

## 1. 新窗口白屏优化

Electron 8 默认开启 Node 集成，但渲染进程初始化仍需时间。白屏本质是 HTML 解析与 Vue 挂载的时间差。

### 优化方案

1.  **延迟显示窗口 (Ready-to-show)**
    利用 Electron 生命周期，确保 DOM 绘制完成后再展示窗口。

    ```javascript
    // main.js
    const { BrowserWindow } = require("electron");

    let win = new BrowserWindow({
      width: 1280,
      height: 800,
      show: false, // 关键：初始隐藏
      backgroundColor: "#F5F5F5", // 设置与 App 背景一致的颜色
      webPreferences: {
        nodeIntegration: true, // Electron 8 默认行为，政务内网常用
        webSecurity: false,
      },
    });

    // 仅在渲染进程完成首屏绘制后显示
    win.once("ready-to-show", () => {
      win.show();
    });
    ```

2.  **静态骨架屏 (Skeleton Screen)**
    在 Vue 挂载前，直接在 HTML 中通过 CSS 绘制加载态，避免 JS 解析期间的空白。

    ```html
    <!-- index.html -->
    <div id="app">
      <style>
        .skeleton {
          height: 100vh;
          background: #f0f2f5;
          display: flex;
        }
        .sidebar {
          width: 200px;
          background: #d9d9d9;
        }
      </style>
      <div class="skeleton">
        <div class="sidebar"></div>
        <div class="content">正在加载政务工作台...</div>
      </div>
    </div>
    ```

3.  **窗口池预热 (Window Pool)**
    在应用启动时，预先创建隐藏的空白窗口放入池中。当需要打开新窗口时，直接从池中取出并显示，从而消除进程创建和初始化的耗时，实现**秒开**。

    ```javascript
    // WindowPool.js
    class WindowPool {
      constructor() {
        this.pool = [];
        this.initPool();
      }

      initPool() {
        // 预创建 2 个隐藏窗口
        for (let i = 0; i < 2; i++) {
          this.createWindow();
        }
      }

      createWindow() {
        const win = new BrowserWindow({
          show: false, // 关键：隐藏状态
          webPreferences: { nodeIntegration: true },
        });
        // 加载通用的壳页面
        win.loadURL("file://" + __dirname + "/index.html#/blank");
        this.pool.push(win);
      }

      get() {
        if (this.pool.length === 0) this.createWindow();
        const win = this.pool.shift();
        // 取出一个后，立即补充一个新的
        this.createWindow();
        return win;
      }
    }
    ```

4.  **动态组件挂载 (Dynamic Component)**
    配合窗口池，新窗口加载的是一个通用的“壳”页面。通过 IPC 通信告知该窗口需要渲染哪个 Vue 组件，实现内容的动态切换。

    ```javascript
    // main.js (主进程)
    const win = windowPool.get();
    // 告知窗口加载具体业务组件
    win.webContents.send("load-component", {
      name: "ChatWindow",
      props: { userId: 123 },
    });
    win.show();

    // renderer.js (渲染进程 App.vue)
    // <template>
    //   <component :is="currentComponent" v-bind="currentProps" />
    // </template>

    export default {
      data() {
        return {
          currentComponent: "BlankPage", // 默认空白或骨架屏组件
          currentProps: {},
        };
      },
      created() {
        const { ipcRenderer } = require("electron");
        ipcRenderer.on("load-component", (e, { name, props }) => {
          this.currentComponent = name; // 动态切换组件
          this.currentProps = props;
        });
      },
    };
    ```

## 2. 音频噪点与回声优化 (Audio Quality)

Linux (PulseAudio) 与 macOS (CoreAudio) 底层差异大，需通过 WebRTC 约束与 Chromium 开关双重控制。

### 优化方案

1.  **WebRTC 强约束 (Constraints)**
    在 Vue 组件获取媒体流时，显式开启音频处理算法。

    ```javascript
    // CallComponent.vue
    async function getHighQualityAudio() {
      const constraints = {
        audio: {
          echoCancellation: true, // 回声消除
          noiseSuppression: true, // 降噪
          autoGainControl: true, // 自动增益
          // 规避重采样杂音，建议与系统默认采样率一致 (44.1k 或 48k)
          sampleRate: { ideal: 48000 },
        },
        video: false,
      };
      return navigator.mediaDevices.getUserMedia(constraints);
    }
    ```

2.  **Chromium 底层开关**
    针对 Linux 环境下的杂音，在主进程启动时注入参数。

    ```javascript
    // main.js
    const { app } = require("electron");

    // 强制开启 WebRTC 高级音频处理
    app.commandLine.appendSwitch(
      "force-fieldtrials",
      "WebRTC-Audio-Processing-Agc/Enabled/"
    );
    // Linux 特定：尝试规避 PulseAudio 延迟导致的爆音
    if (process.platform === "linux") {
      app.commandLine.appendSwitch("enable-features", "WebRtcPipeWireCapturer");
    }
    ```

3.  **macOS 权限处理**
    Electron 8 在 macOS Catalina+ 需要显式请求权限。

    ```javascript
    // main.js
    const { systemPreferences } = require("electron");

    if (process.platform === "darwin") {
      const status = systemPreferences.getMediaAccessStatus("microphone");
      if (status !== "granted") {
        // 引导用户去系统设置开启
      }
    }
    ```

## 3. 多人视频卡顿 (Video Lag)

Electron 8 的 `remote` 模块与 Vue 2 的 `Observer` 机制是两大性能杀手。

### 优化方案

1.  **Vue 响应式陷阱规避**
    **严禁**将 `MediaStream` 对象直接放入 Vue 的 `data` 中，否则 Vue 会递归劫持该对象，导致每一帧渲染都触发大量 Getter/Setter，引发严重卡顿。

    ```javascript
    // VideoMeeting.vue
    export default {
      data() {
        return {
          // 错误写法：streams: []
          videoList: [], // 仅存储 ID 或元数据
        };
      },
      created() {
        // 正确写法：将流对象挂载到非响应式属性上
        this.streamMap = new Map();
      },
      methods: {
        onUserJoin(userId, stream) {
          // 必须使用 Object.freeze 防止 Vue 意外劫持（如果必须放 data）
          // 或者直接存入 this.streamMap
          this.streamMap.set(userId, stream);

          // 仅更新 UI 需要的元数据
          this.videoList.push({ userId, isMuted: false });

          this.$nextTick(() => {
            const videoEl = this.$refs[`video-${userId}`][0];
            videoEl.srcObject = stream;
          });
        },
      },
    };
    ```

2.  **强制 GPU 加速**
    Linux 下显卡驱动复杂，Chromium 可能默认禁用 GPU。

    ```javascript
    // main.js
    // 忽略 GPU 黑名单，强制开启加速
    app.commandLine.appendSwitch("ignore-gpu-blacklist");
    app.commandLine.appendSwitch("enable-gpu-rasterization");
    app.commandLine.appendSwitch("enable-zero-copy");
    ```

## 4. 内存泄漏排查 (Memory Leak)

Electron 8 严重依赖 `remote` 模块，这是内存泄漏的重灾区。

### 排查与修复

1.  **Remote 模块滥用**
    渲染进程引用主进程对象时，如果未释放，会导致主进程内存无法回收。

    ```javascript
    // ❌ 错误示范
    const { BrowserWindow } = require("electron").remote;
    // 每次调用都会在主进程创建新的代理对象，极易泄漏

    // ✅ 优化方案：使用 IPC 通信代替 remote
    // renderer.js
    ipcRenderer.send("create-window", params);

    // main.js
    ipcMain.on("create-window", (e, params) => {
      /* ... */
    });
    ```

2.  **Vue 组件销毁清理**
    SPA 应用中，路由切换不会自动清理 IPC 监听器。

    ```javascript
    // ChatWindow.vue
    export default {
      mounted() {
        this.msgHandler = (e, msg) => this.handleMsg(msg);
        ipcRenderer.on("new-message", this.msgHandler);
      },
      beforeDestroy() {
        // 务必移除监听，否则组件实例无法被 GC，且回调会重复执行
        ipcRenderer.removeListener("new-message", this.msgHandler);
      },
    };
    ```

3.  **工具排查实战 (2021 Mainstream Tools)**

    Chrome DevTools 的 Memory 面板是排查 Electron 渲染进程泄漏的神器，而主进程则依赖手动快照对比。

    #### 渲染进程排查 (DevTools)

    1.  **复现路径录制**

        - 打开 DevTools -> **Memory** 面板。
        - 选择 **Allocation instrumentation on timeline** (时间轴上的分配检测)。
        - 点击录制（圆点），执行一次可能导致泄漏的操作（如打开/关闭聊天窗口），然后点击垃圾回收（垃圾桶图标），重复 3 次。
        - 停止录制。

    2.  **分析堆快照**
        - 在生成的柱状图中，如果蓝色柱子（分配内存）在 GC 后没有变灰（释放），且整体趋势呈阶梯状上升，即存在泄漏。
        - 在下方列表中筛选 **Detached DOM tree**。如果存在大量分离的 DOM 节点，说明 Vue 组件销毁后，DOM 仍被 JS 引用（常见于未清理的事件监听或定时器）。

    #### 主进程排查 (Manual Snapshot)

    Electron 8 主进程无法直接使用 DevTools 调试内存，需借助 `v8-inspector` 或手动打印。

    3.  **内存监控钩子**
        在主进程定时打印内存使用情况，观察 RSS (Resident Set Size) 趋势。

        ```javascript
        // main.js
        setInterval(() => {
          const { rss, heapUsed } = process.memoryUsage();
          console.log(`RSS: ${(rss / 1024 / 1024).toFixed(2)} MB`);
        }, 5000);
        ```

    4.  **Heap Snapshot 导出**
        使用 Electron 内置方法导出快照，导入 Chrome 分析。

        ```javascript
        // 触发导出快照
        const { writeHeapSnapshot } = require("v8");

        ipcMain.on("dump-heap", () => {
          const fileName = `/tmp/heap-${Date.now()}.heapsnapshot`;
          writeHeapSnapshot(fileName);
          console.log("Heap snapshot written to", fileName);
        });
        ```

        - **对比分析**: 启动时 dump 一次，操作 N 次后 dump 一次。在 Chrome Memory 面板 Load 这两个文件，选择 **Comparison** 视图，按 **Delta** 排序，查看正增长的对象。
