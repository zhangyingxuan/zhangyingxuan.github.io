---
fileMatch: "**/*.vue"
---
# Vue 2 核心开发规约
- **代码风格**：遵循 Options API 规范，保持 `data`, `methods`, `computed` 的清晰分离。
- **过渡思维**：在维护 Vue 2 时，尽量编写“类 Composition”逻辑，便于未来迁移到 Vue 3。
- **响应式限制**：提醒开发者使用 `this.$set` 处理新增的对象属性或数组索引更新。
- **生命周期**：注意 `destroyed` 与 Vue 3 `unmounted` 的命名差异。
- **混入 (Mixins)**：严禁新增复杂的 Mixin，优先考虑将逻辑提取为外部工具函数。
- 检查 `package.json`，确保插件版本与 Vue 2.x 严格兼容（如 vue-router 3.x, vuex 3.x）。

---

# Vue 3 Kiro 开发规约（精简版）
- 逻辑编写：强制使用 `<script setup>` 语法糖 + Composition API。优先使用 ref（更清晰的显式调用），仅在处理高度相关的对象集合时使用 reactive。
- 性能优化：针对大量日志等大数据数组，必须使用 shallowRef 减少响应式开销。对复杂的静态文档片段使用 v-memo 进行渲染缓存。
- 类型安全：全面启用 TypeScript。组件间通信必须使用 defineProps<{}> 定义类型；跨层级注入须配合 InjectionKey 以确保 Provide/Inject 的类型推导。
- 最佳实践：状态管理统一使用 Pinia；全局 UI 组件（如弹窗、遮罩）利用 Teleport 挂载。组件命名强制遵循 PascalCase 规范。
- 代码整洁：通过 Composables（useX 模式）提取公共逻辑，确保组件代码精简且易于测试。

--- 

# TypeScript 企业级开发规约## 核心原则
- **严禁使用 `any`**：除非是处理极特殊的第三方无类型库，否则必须定义 `unknown` 并进行类型收窄（Type Guarding）。
- **优先使用 `interface`**：对于公共 API 和组件 Props，优先使用 `interface`（支持扩展）；对于复杂的联合类型或工具类型，使用 `type`。
- **强制开启严格模式**：代码必须通过 `strict: true` 校验，特别是 `strictNullChecks`。
- **显式返回类型**：所有导出的函数必须显式标注返回类型。这能显著提升 AI 对代码逻辑的理解速度。
- **Props 规范**：
  - React: 使用 `interface Props {}` 配合 `FC<Props>` 或直接结构赋值。
  - Vue: 使用 `defineProps<{ ... }>()` 宏。
- **只读属性**：对于配置项和常量对象，优先使用 `readonly` 关键字或 `as const` 断言。
- **避免非空断言**：尽量不要使用 `!`，而是通过 `if (item)` 或可选链 `?.` 来处理潜在的空值。
- **类型谓词 (Type Predicates)**：鼓励编写 `isUser(obj): obj is User` 这种函数，帮助 AI 在逻辑分支中精准识别类型。
- **枚举 (Enum)**：禁止使用数值枚举，统一使用 `const enum` 或 `Union Types`（如 `'loading' | 'success' | 'error'`）以获得更好的编译产物。
- **泛型**：泛型字母必须具有语义化，如 `<TData>` 而非简单的 `<T>`（除非是极其通用的工具函数）。

--- 

# Tailwind CSS 编码准则
- **必须遵循 Prettier Tailwind 插件排序**：基础样式 -> 布局 -> 间距 -> 尺寸 -> 颜色 -> 交互状态（hover/active） -> 响应式（md/lg）。
- 例子：`flex items-center justify-between p-4 w-full bg-blue-500 hover:bg-blue-600 md:flex-row`。
- 坚持 **Mobile First** 原则。先写移动端样式，再通过 `md:`, `lg:` 等断点进行覆盖。
- **拒绝魔改样式**：尽量使用配置好的 `theme` 变量（如 `text-primary`），严禁大量使用 `text-[#123456]` 这种魔法值。
- **组件化思维**：当一个类名组合在超过 3 个地方重复时，考虑使用 `@apply` 提取到 base.css 或封装为 React/Vue 基础组件。
- 所有交互状态必须配合 `transition-all duration-200` 或类似的过渡效果，禁止生硬切换。