

# 🛡️ 独立应用组：后端全栈开发 AI 核心约束（.cursorrules）

> **Rule Version:** 1.0 (2026-03)
> **Target Audience:** Backend developers writing React
> **Strictness Level:** FATAL (违反以下规则的代码严禁合入)

## 🏗️ 一、 架构与环境约束 (Environment & Framework)

1.  **React 17 严格锁死：**
    * **禁止**使用 React 18 的新特性（如 `useTransition`, `useDeferredValue` 或并发渲染）。
    * 组件必须使用**函数组件（Functional Components）**，严禁使用过时的 Class 组件。
2.  **构建工具对齐：**
    * 项目基于 **Webpack 5**，所有模块引入必须支持 Webpack 的静态分析。
    * 图片、字体等静态资源引入必须使用 `import img from '@/assets/img.png'` 方式，严禁使用绝对路径。

---

## 🎨 二、 样式隔离红线（Anti-Pattern: Style Pollution）
> *后端写前端最容易导致全站样式错乱，此项为最高优先级！*

1.  **强制 CSS Modules 或 唯一命名空间：**
    * **禁止**在 Less 文件中编写任何全局标签选择器（如 `div { ... }`, `span { ... }`）。
    * 生成的 Less 必须使用 **CSS Modules**（即 `styles.xxx`）或者在组件最外层包裹一个与文件名同名的唯一 Class（如 `.my-user-table { .ant-btn { ... } }`）。
2.  **严禁滥用 `!important`：**
    * 除非是为了覆盖 AntD 极其顽固的底层样式，否则**严禁**输出带 `!important` 的 CSS 代码。
3.  **禁止手写复杂布局：**
    * 所有页面布局、居中、对齐，**必须**优先使用 AntD 的 `<Row>`、`<Col>` 栅格系统或 Flex 布局。严禁使用 `float` 或绝对定位（`absolute`）去拼凑页面。

---

## ⚛️ 三、 React Hooks 防呆约束（Anti-Pattern: Infinite Loops）
> *后端习惯了顺序执行，容易在 Hooks 的生命周期里栽跟头。*

1.  **`useEffect` 依赖项黑盒检查：**
    * 每次生成 `useEffect`，**必须**显式检查其依赖项数组（Dependency Array）。
    * **严禁**将对象或数组直接放入依赖项，除非使用了 `useMemo` 或 `useCallback`，以防造成死循环（Infinite loop）。
2.  **状态（State）更新规范：**
    * 如果新状态依赖于旧状态，**必须**使用函数式更新，如 `setCount(prevCount => prevCount + 1)`。

---

## 🌐 四、 网络请求与异常处理（Anti-Pattern: Unhandled Rejection）
> *后端最懂接口，这部分用后端的“防御性编程”来约束。*

1.  **Axios 拦截与路径：**
    * 所有请求**必须**从项目统一封装的 `@/utils/request`（或你们实际的路径）引入，严禁私自 `import axios from 'axios'`。
2.  **防御性异常捕获：**
    * 所有的异步请求（`async/await`）**必须**包裹在 `try...catch` 块中。
    * 在 `catch` 块中，**必须**调用 AntD 的 `message.error()` 向用户展示错误，绝不能让异常静默消失。
3.  **Loading 状态闭环：**
    * 凡是涉及网络请求的操作，**必须**配有 `loading` 状态（如按钮的 `loading={loading}` 或 Table 的 `loading={loading}`），且必须在 `finally` 块中将 `loading` 置为 `false`。

---

## 🤖 五、 AI 输出格式控制（Output Style）

1.  **少说废话，多给代码：**
    * 在回复时，直接给出可运行的代码块。不要长篇大论解释 React 的原理，后端同学只需要知道“怎么用”。
2.  **用后端思维打注释：**
    * 在关键的 Hooks（如 `useEffect`）和状态流转处，用后端易懂的语言写注释。例如：
        * `// 相当于后端的 @PostConstruct，页面初始化时执行一次`
        * `// 相当于 RPC 远程调用，注意捕获超时和异常`
3.  **提供 Copy-Paste 友好的完整组件：**
    * 不要只给出一行代码的修改，尽量给出包含 `import`、`JSX` 和 `Less` 的**完整单文件组件代码**，方便后端同学一键复制。