# 资深前端面试 2 周突击计划

这份计划专为准备冲击 **高级/资深前端工程师 (P6+/P7)** 岗位的开发者设计。它涵盖了从底层原理到架构设计，再到软技能的全方位复习路径。

## 📅 计划概览

- **Week 1: 深度夯实 - 核心基础与框架原理**
  - 重点攻克 JavaScript 底层、浏览器原理、框架源码及网络安全。
- **Week 2: 高度拔高 - 工程化、架构与软技能**
  - 聚焦前端工程化体系、性能优化、架构设计模式及面试实战技巧。

---

## Week 1: 核心基础与框架原理

### Day 1: JavaScript 语言深度 (底层机制)

- **核心考点**:
  - **执行上下文与闭包**: 作用域链、变量提升、闭包内存泄漏场景及分析。
  - **原型与继承**: 原型链查找机制、`new` 操作符实现原理、ES5/ES6 继承差异。
  - **异步编程**: Event Loop (宏任务/微任务执行顺序)、Promise A+ 规范 (手写 Promise)、Async/Await 原理 (Generator + 自动执行器)。
  - **类型系统**: `typeof` vs `instanceof` 原理、类型转换规则、0.1 + 0.2 !== 0.3 原因。
- **复习建议**: 手写 `Promise.all`, `Promise.race`, `debounce`, `throttle`, `deepClone`。

### Day 2: CSS 与 浏览器渲染原理

- **核心考点**:
  - **渲染管线**: HTML 解析 -> DOM 树 -> CSSOM 树 -> Render 树 -> 布局 (Layout) -> 绘制 (Paint) -> 合成 (Composite)。
  - **重绘与回流 (Repaint & Reflow)**: 触发条件、如何避免 (CSS 属性选择、批量修改 DOM)。
  - **BFC (块级格式化上下文)**: 触发条件、应用场景 (清除浮动、防止 Margin 重叠)。
  - **布局方案**: Flexbox (主轴/交叉轴对齐)、Grid 布局、移动端适配 (Rem/Viewport/1px 问题)。
- **复习建议**: 熟悉 Chrome DevTools 的 Performance 面板，分析渲染瓶颈。

### Day 3: 框架核心原理 (Vue/React) - Part 1

- **核心考点 (以 Vue 为例，React 类推)**:
  - **响应式原理**: Vue2 (`Object.defineProperty`) vs Vue3 (`Proxy`)，依赖收集与派发更新流程。
  - **虚拟 DOM (Virtual DOM)**: 为什么需要 VDOM？VDOM 的优缺点。
  - **Diff 算法**: Vue2 双端比较、Vue3 最长递增子序列、React Fiber 架构 (时间切片、可中断渲染)。
- **复习建议**: 阅读 Vue/React 核心源码解析文章，尝试手写一个简易的响应式系统。

### Day 4: 框架进阶与生态 - Part 2

- **核心考点**:
  - **组件通信**: Props/Emit, Provide/Inject, EventBus, Vuex/Pinia/Redux 原理。
  - **生命周期**: 父子组件生命周期执行顺序、Hooks (Composition API) 的优势与实现原理。
  - **编译器原理**: Template -> AST -> Render Function 的过程 (Vue3 的静态提升、PatchFlags 优化)。
  - **SSR (服务端渲染)**: 原理、同构应用、Nuxt/Next.js 基础、Hydration (注水) 过程。

### Day 5: 计算机网络

- **核心考点**:
  - **HTTP 协议**: HTTP 1.1 (长连接、管道化) vs HTTP 2.0 (多路复用、头部压缩、Server Push) vs HTTP 3.0 (QUIC、UDP)。
  - **HTTPS**: TLS/SSL 握手流程、对称加密与非对称加密、证书验证。
  - **TCP/UDP**: 三次握手、四次挥手、滑动窗口、拥塞控制。
  - **缓存策略**: 强缓存 (`Cache-Control`, `Expires`) vs 协商缓存 (`ETag`, `Last-Modified`)。

### Day 6: 前端安全

- **核心考点**:
  - **XSS (跨站脚本攻击)**: 反射型/存储型/DOM 型、防御手段 (转义、CSP)。
  - **CSRF (跨站请求伪造)**: 原理、防御手段 (SameSite、CSRF Token、Referer 验证)。
  - **其他**: 点击劫持 (Clickjacking)、SQL 注入 (Node.js 端)、中间人攻击。
  - **鉴权机制**: Cookie/Session, JWT (JSON Web Token), OAuth 2.0, SSO 单点登录流程。

### Day 7: 算法与数据结构 (高频题)

- **核心考点**:
  - **数据结构**: 数组、链表 (反转链表、环形链表)、栈与队列、二叉树 (遍历、深度/广度优先搜索)。
  - **算法思想**: 双指针、递归、动态规划 (爬楼梯、最大子序和)、排序 (快排、归并)。
- **复习建议**: 刷 LeetCode "Top 100 Liked Questions" 中的简单和中等题，重点关注与前端相关的题目 (如 DOM 树遍历)。

---

## Week 2: 工程化、架构与软技能

### Day 8: 前端工程化体系

- **核心考点**:
  - **构建工具**: Webpack (构建流程、Loader vs Plugin、热更新 HMR 原理) vs Vite (ESM 开发服务器、预构建)。
  - **包管理**: npm vs yarn vs pnpm (硬链接/软链接、幽灵依赖)。
  - **代码规范**: ESLint, Prettier, Husky, Commitlint, Git Hooks。
  - **CI/CD**: Jenkins, GitHub Actions, GitLab CI 流程配置、自动化部署。

### Day 9: 性能优化体系 (重中之重)

- **核心考点**:
  - **性能指标**: Core Web Vitals (LCP, FID/INP, CLS), FCP, TTI。
  - **加载优化**: 资源压缩 (Gzip/Brotli)、图片优化 (WebP/懒加载)、CDN、路由懒加载、Tree Shaking。
  - **渲染优化**: 减少重排重绘、虚拟列表 (Virtual List)、Web Worker、防抖节流。
  - **监控与分析**: Performance API, Lighthouse 使用, 自研监控 SDK 设计思路 (错误捕获、性能上报)。

### Day 10: 架构设计与设计模式

- **核心考点**:
  - **设计模式**: 单例、工厂、观察者/发布订阅、策略、代理、装饰器模式在前端的应用。
  - **微前端**: qiankun (基于 single-spa, 沙箱隔离, 样式隔离), Module Federation (模块联邦)。
  - **组件库设计**: Headless UI, 按需加载, 主题定制, 版本管理。
  - **Monorepo**: Lerna, Nx, Turborepo 的优势与管理策略。

### Day 11: Node.js 与 全栈视野

- **核心考点**:
  - **Node.js 基础**: 事件循环 (libuv)、Buffer、Stream、Process、Cluster (多进程)。
  - **框架**: Koa (洋葱模型) vs Express, NestJS (依赖注入, AOP, 装饰器)。
  - **BFF (Backend for Frontend)**: 聚合接口、裁剪数据、格式化。
  - **数据库**: MySQL vs MongoDB 基础, Redis 缓存应用。

### Day 12: 项目复盘与亮点挖掘 (STAR 法则)

- **任务**:
  - 整理 2-3 个核心项目，使用 **STAR 法则** (Situation 背景, Task 任务, Action 行动, Result 结果) 进行描述。
  - **挖掘亮点**: 解决了什么难点？性能提升了多少？架构做了什么改进？
  - **准备案例**: "最困难的一个 Bug"、"最有成就感的一次优化"。

### Day 13: 软技能与系统设计

- **核心考点**:
  - **团队管理**: 如何做 Code Review？如何做技术选型？如何带领新人？
  - **系统设计题**: "设计一个图片懒加载库"、"设计一个埋点监控 SDK"、"设计一个即时通讯系统"。
  - **沟通协作**: 如何与产品/后端/设计高效沟通？如何处理需求变更？

### Day 14: 模拟面试与心态调整

- **任务**:
  - **自我介绍**: 准备 1 分钟、3 分钟 两个版本的自我介绍，突出优势。
  - **模拟面试**: 找朋友或对着镜子进行模拟，录音复盘。
  - **反问环节**: 准备 3-5 个高质量问题问面试官 (如: "团队目前面临的最大技术挑战是什么？", "团队的技术栈规划是怎样的？")。
  - **心态**: 保持自信，面试是双向选择。

---

## 📚 推荐资源

1.  **书籍**: 《JavaScript 高级程序设计 (红宝书)》、《你不知道的 JavaScript》、《图解 HTTP》。
2.  **文档**: MDN Web Docs, Vue/React 官方文档, Webpack/Vite 文档。
3.  **社区**: GitHub, Stack Overflow, 掘金, Dev.to。

资深前端工程师的面试不仅考察**技术深度**（如框架原理、浏览器底层），更注重**工程能力**（架构设计、性能优化）、**问题解决能力**（复杂场景排查）和**软技能**（技术决策、团队协作）。以下整理了**核心面试项**及**2 周高效准备计划**，覆盖“知识体系 → 实战演练 → 模拟面试”全流程。

### **一、资深前端核心面试项清单**

按优先级和考察频率排序，分为 **6 大模块**，共 **30+ 关键考点**：

#### **模块 1：JavaScript/TypeScript 深度（占比 25%）**

**核心考察**：语言底层原理、异步编程、内存管理、ES6+特性、TS 高级应用。

- **必考点**：
  - 原型链与继承（手写 `new`/`instanceof`/`class` 实现）
  - 闭包原理与应用场景（防抖节流、模块化、柯里化）
  - 事件循环（宏任务/微任务区分、Node.js 与浏览器差异）
  - 异步编程（Promise A+/手写 Promise、async/await、Generator）
  - 内存管理（垃圾回收机制、内存泄漏排查与修复）
  - ES6+特性（Proxy/Reflect、Symbol、迭代器/生成器、模块化）
  - TypeScript（泛型、类型守卫、装饰器、声明文件编写）

#### **模块 2：框架原理与源码（占比 20%）**

**核心考察**：主流框架（Vue/React）核心机制、源码理解、性能优化实践。

- **Vue 3**：
  - 响应式原理（Proxy vs defineProperty、依赖收集与触发更新）
  - Composition API 设计思想（对比 Options API）
  - 虚拟 DOM 与 Diff 算法（patchKeyedChildren 流程）
  - 编译优化（Block Tree、静态提升、PatchFlag）
  - 生命周期（setup、onMounted、onUpdated 执行时机）
- **React 18**：
  - Fiber 架构（双缓存、调度机制、时间切片）
  - 协调（Reconciliation）与 Diff 算法（List Diff 优化）
  - Hooks 原理（useState/useEffect 闭包陷阱、FiberHooks 链表）
  - 并发模式（Suspense、useTransition、startTransition）
- **通用能力**：
  - 组件设计（受控/非受控、高阶组件 HOC、Render Props、自定义 Hook）
  - 状态管理（Redux/MobX/Pinia 设计思想、中间件机制）
  - 框架对比（Vue vs React vs Angular 选型依据）

#### **模块 3：工程化与工具链（占比 15%）**

**核心考察**：构建工具、代码质量、CI/CD、模块化方案。

- **构建工具**：
  - Webpack（Loader/Plugin 原理、Tree Shaking、Code Splitting、性能优化）
  - Vite（ESBuild 预构建、HMR 原理、与 Webpack 对比）
  - Rollup（库打包最佳实践、Tree Shaking 优势）
- **代码质量**：
  - ESLint/Prettier 配置与自定义规则
  - TypeScript 工程化（tsconfig.json、类型声明、第三方库声明）
  - 单元测试（Jest/Vitest、Mock 机制、覆盖率统计）
- **CI/CD 与部署**：
  - Git 工作流（分支策略、Rebase vs Merge、冲突解决）
  - 自动化部署（Docker 容器化、Nginx 配置、CDN 缓存策略）

#### **模块 4：性能优化（占比 15%）**

**核心考察**：首屏加载、运行时性能、监控体系搭建。

- **加载性能**：
  - 资源优化（图片压缩/懒加载、字体子集化、代码分割）
  - 缓存策略（HTTP 缓存、Service Worker、LocalStorage 缓存）
  - 预加载/预解析（`<link rel="preload">`、DNS Prefetch）
- **运行时性能**：
  - 渲染优化（减少重排重绘、CSS 选择器效率、虚拟列表）
  - JS 执行优化（防抖节流、Web Worker 多线程、事件委托）
  - 内存优化（避免内存泄漏、大对象处理、WeakMap/WeakSet 应用）
- **监控工具**：
  - Lighthouse/WebPageTest 报告解读
  - 性能埋点（FP/FCP/LCP、FID/CLS 指标采集）
  - 错误监控（Sentry/Bugly 集成、Source Map 还原）

#### **模块 5：浏览器与网络（占比 10%）**

**核心考察**：浏览器工作原理、网络协议、安全机制。

- **浏览器原理**：
  - 渲染流程（HTML 解析 →DOM 树 →CSSOM→Render 树 → 布局 → 绘制）
  - 事件机制（事件捕获/冒泡、事件委托、自定义事件）
  - 存储方案（Cookie/LocalStorage/SessionStorage/IndexedDB 对比）
- **网络协议**：
  - HTTP/1.1 vs HTTP/2 vs HTTP/3（多路复用、头部压缩、QUIC 协议）
  - HTTPS（TLS 握手流程、证书验证、加密算法）
  - 跨域解决方案（CORS、JSONP、Nginx 反向代理、postMessage）
- **安全问题**：
  - XSS/CSRF 攻击原理与防御（CSP、SameSite Cookie、Token 验证）
  - 点击劫持（X-Frame-Options）、SQL 注入（前端规避思路）

#### **模块 6：架构设计与软技能（占比 15%）**

**核心考察**：技术方案决策、复杂系统设计、团队协作能力。

- **架构设计**：
  - 微前端（qiankun/single-spa 原理、沙箱机制、应用通信）
  - 组件库设计（主题定制、按需加载、无障碍访问）
  - 状态管理架构（跨应用共享状态、持久化方案）
  - 低代码平台设计（可视化编辑、DSL 解析、渲染引擎）
- **项目经验**：
  - STAR 法则复盘（项目背景、技术难点、解决方案、量化成果）
  - 技术债务处理（重构时机、渐进式重构策略）
  - 团队协作（Code Review 规范、技术分享、新人培养）
- **软技能**：
  - 技术选型依据（业务场景、团队能力、长期维护成本）
  - 跨部门沟通（需求对齐、风险预判、资源协调）

### **二、2 周高效准备计划**

**目标**：覆盖 80%核心考点，重点突破深度与实践，形成结构化知识体系。  
**原则**：**每日聚焦 1-2 模块**，结合“理论学习 → 代码实践 → 面试真题模拟”，周末综合复盘。

#### **第 1 周：夯实基础与核心原理（Day 1-7）**

**目标**：掌握 JS/TS、框架、工程化、性能优化的核心知识点，能手写基础代码。

| **Day** | **模块**                    | **学习内容**                                                                   | **实践任务**                                                                |
| ------- | --------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **1**   | JS 核心（原型链/闭包）      | 原型链继承（手写`class`模拟）、闭包应用场景（防抖节流实现）、内存泄漏案例      | 手写`new`/`instanceof`/`防抖节流函数`，用 Chrome DevTools 分析闭包内存占用  |
| **2**   | JS 异步（Promise/事件循环） | Promise A+规范、手写 Promise、宏微任务队列（Node.js 与浏览器差异）             | 实现`Promise.all`/`race`，分析`setTimeout(fn, 0)`执行时机                   |
| **3**   | TS 高级应用                 | 泛型约束、类型守卫（`typeof`/`instanceof`）、装饰器（类/方法装饰器）           | 用 TS 实现一个泛型缓存工具类，为 React 组件添加日志装饰器                   |
| **4**   | Vue 3 原理                  | 响应式（Proxy 依赖收集）、Composition API、虚拟 DOM Diff（patchKeyedChildren） | 手写简易 Vue3 响应式（`reactive`/`effect`），分析`v-for` key 的作用         |
| **5**   | React 18 原理               | Fiber 架构（双缓存）、Hooks 原理（useState 闭包陷阱）、并发模式（Suspense）    | 手写`useState`简易版，用`startTransition`优化列表渲染                       |
| **6**   | 工程化（Webpack/Vite）      | Webpack Loader/Plugin 原理、Vite HMR 机制、Tree Shaking 配置                   | 用 Webpack 手写一个`markdown-loader`，对比 Vite 与 Webpack 打包速度         |
| **7**   | 性能优化（加载/渲染）       | 首屏优化（代码分割、预加载）、渲染优化（虚拟列表、减少重排重绘）               | 用`react-window`实现虚拟列表，用 Lighthouse 分析项目性能瓶颈并优化 1-2 个点 |

#### **第 2 周：深入架构与实战模拟（Day 8-14）**

**目标**：掌握架构设计思路，能分析复杂场景，模拟面试查漏补缺。

| **Day** | **模块**                  | **学习内容**                                                                 | **实践任务**                                                                      |
| ------- | ------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **8**   | 浏览器与网络（渲染/安全） | 渲染流程（Layout/Paint）、事件循环（Node.js Event Loop）、XSS/CSRF 防御      | 用`requestAnimationFrame`优化动画，实现 CSRF Token 生成与验证                     |
| **9**   | 架构设计（微前端/组件库） | 微前端沙箱机制（qiankun）、组件库主题定制（CSS Variables）                   | 设计一个简易微前端框架（应用注册、路由劫持），用 CSS Variables 实现组件库换肤     |
| **10**  | 项目经验复盘（STAR 法则） | 梳理过往项目（选 1 个复杂项目），提炼技术难点（如内存泄漏排查、性能优化）    | 按 STAR 法则写项目描述（背景 → 难点 → 方案 → 成果），量化指标（如首屏耗时降 50%） |
| **11**  | 面试真题模拟（JS/框架）   | 刷 LeetCode 前端题（手写深拷贝、扁平化数组、Promise 并发控制）               | 限时手写：深拷贝（处理循环引用）、`Promise.allSettled`、Vue3 响应式核心逻辑       |
| **12**  | 面试真题模拟（工程/性能） | 分析性能优化案例（如 LCP 优化、内存泄漏排查）、工程化问题（Webpack 调优）    | 模拟回答：“如何优化一个 10MB JS 包的加载速度？”“Electron 内存泄漏如何排查？”      |
| **13**  | 软技能与架构设计          | 技术选型方法论（业务/团队/成本权衡）、跨部门沟通案例                         | 准备 1 个“说服团队采用新技术”的案例（如从 Webpack 迁移 Vite 的决策过程）          |
| **14**  | 综合复盘与模拟面试        | 整理思维导图（各模块核心知识点）、错题本（易混淆点：如宏微任务、Fiber 调度） | 找同行/导师模拟面试（1 小时技术面+30 分钟项目面），记录反馈并针对性补漏           |

### **三、关键准备工具与资源**

1. **学习资源**：

   - JS/TS：《JavaScript 高级程序设计》《你不知道的 JavaScript》《TypeScript Deep Dive》
   - 框架：Vue3 源码（github.com/vuejs/core）、React Fiber 架构文档（react.dev）
   - 工程化：Webpack 官方文档、Vite 指南（vitejs.dev）、Lighthouse 使用教程
   - 性能优化：Google Web Fundamentals、高性能 JavaScript 书籍

2. **代码实践**：

   - 手写代码仓库（GitHub）：整理 Promise、防抖节流、深拷贝、框架简易实现等
   - 性能分析工具：Chrome DevTools（Memory/Performance 面板）、Webpack Bundle Analyzer

3. **面试真题**：
   - 牛客网/LeetCode“前端面试高频题”、掘金“资深前端面试专栏”
   - 模拟面试平台：Pramp（免费技术模拟面试）、MeetGeek（AI 模拟面试）

### **四、避坑指南**

1. **避免死记硬背**：理解原理（如“为什么 Vue 用 Proxy 不用 defineProperty？”），而非仅记结论。
2. **突出“资深”特质**：回答时体现“架构思维”（如“为什么选微前端而不是 iframe？”）、“问题解决闭环”（排查 → 定位 → 修复 → 复盘）。
3. **项目经验量化**：用数据说话（如“优化后首屏耗时从 3s 降至 1.2s”“内存占用减少 40%”），避免空泛描述。

通过以上计划，可系统覆盖资深前端面试核心考点，重点突破“原理深度”与“实战能力”，2 周内实现从“知识储备”到“面试表达”的转化。关键是**每日坚持输出**（代码/笔记/复盘），并通过模拟面试暴露薄弱点，针对性强化。
