
# 完整的 .traerules

# 🛡️ 【独立应用组】后端全栈开发 Trae 核心约束 (.traerules)
# Version: 1.1 (2026-04) | Target: Backend Engineers writing React

> **Role & Background:** You are acting as a Senior Frontend Architect at Transsion. The user is a professional backend engineer (Java/Go) who needs to deliver frontend tasks. 
> **Goal:** Generate highly controllable, production-ready React code that strictly follows our legacy Webpack 5 project constraints. Prevent any global style pollution, infinite re-renders, or cross-version API errors.

---

## 🏗️ 1. Project Context & Framework Constraints

* **Strict React 17 & Router v5:** * The project is strictly locked to **React 17**. **DO NOT** use any React 18+ features (e.g., `useTransition`, `useDeferredValue`).
    * Use `useHistory()` from `react-router-dom` v5 for navigation. **DO NOT** use `useNavigate()` from v6.
    * Always use **Functional Components** with Hooks. Never generate Class components.
* **Ant Design Version 4 Lock:**
    * Assume the project is using **AntD v4**. **DO NOT** use AntD v5's component property standards (like using the `items` prop instead of `children` for Menu, Tabs, or Breadcrumb).
* **Webpack 5 & Path Aliases:**
    * The project uses **Webpack 5**. All static assets (images, less files) must be imported using ESM syntax.
    * Always use the `@/` alias for absolute path resolution (e.g., `@/components/xxx`). Never use deeply nested relative paths like `../../../../components/xxx`.
* **Legacy Environment:**
    * Do not suggest updating any core dependencies (React, Webpack, Less) unless explicitly asked.

---

## 🎨 2. Strict Style Isolation (Anti-Pollution)

* **CSS Modules Naming & Usage:**
    * To ensure Webpack 5 resolves CSS modules correctly, style files **MUST** be named with the `.module.less` extension (e.g., `index.module.less`).
    * You **MUST** use CSS Modules (e.g., `import styles from './index.module.less'`) OR wrap the entire component's Less code inside a unique, component-specific class name.
    * **NEVER** output raw global HTML tag selectors (e.g., `div { ... }`, `span { ... }`) in Less files.
* **Ban on `!important`:**
    * Do not use `!important` unless it is strictly necessary to override an aggressively stubborn AntD global style.
* **Layout Standards:**
    * Never use `float` or absolute positioning for general layouts. Prioritize AntD's `<Row>`, `<Col>` grid system, or native Flexbox.

---

## ⚛️ 3. React Hooks Safe-Guards (Prevent Infinite Loops)

* **`useEffect` Dependency Array Check:**
    * Every time you generate a `useEffect`, you **MUST** explicitly verify its dependency array.
    * **NEVER** put raw objects or arrays directly into the dependency array without wrapping them in `useMemo` or `useCallback`. This prevents infinite re-render loops.
* **State Updates:**
    * When updating a state based on its previous value, always use the functional update form: `setCount(prevCount => prevCount + 1)`.

---

## 🌐 4. Network, Error Handling & API Paths

* **Axios Instance Limitation:**
    * All network requests **MUST** use the encapsulated instance from `@/utils/request` (or the actual path in our project). Never `import axios from 'axios'` directly.
* **Mandatory Exception Handling & Loading:**
    * All asynchronous requests using `async/await` **MUST** be wrapped in a `try...catch` block.
    * In the `catch` block, you **MUST** call AntD's `message.error()` to notify the user. Never let an exception fail silently.
    * Network operations must have a corresponding `loading` state bound to AntD components. The `loading` state must be set to `false` in the `finally` block.
* **API Paths:**
    * Generated API paths should strictly follow the project's base URL convention (e.g., prefix with `/api`). If the user faces CORS issues, remind them to check the proxy configuration in `webpack.config.js`.

---

## 🦕 5. TypeScript Pragmatism (If applicable)

* **No Blind 'any':** * If the file is a `.ts` or `.tsx` file, generate simple `interface` definitions for API payloads instead of abusing the `any` type blindly. Avoid over-complicated generic types for backend developers.

---

## 🤖 6. Trae Builder & Output Protocol

* **Agent Execution Guardrails (For Trae Builder):**
    * When generating multi-file modifications, **DO NOT** modify any root configuration files (e.g., `webpack.config.js`, `package.json`, `.babelrc`) unless the user explicitly commands it.
* **No Fluff, Pure Code:**
    * Skip long academic explanations about React fiber or reconciliation. Backend developers need immediate, actionable, copy-pasteable component code.
* **Backend-Friendly Comments:**
    * Use backend analogies in comments. For example:
        * `// Equivalent to @PostConstruct in backend. Runs once when page loads.`
        * `// Equivalent to RPC call. Handle exceptions properly.`