---
title: 2022-04-17-【工程化】vue3-vite4-ts配置TS
description: 2022-04-17-【工程化】vue3-vite4-ts配置TS
categories:
  - 规范
tags:
  - TypeScript
---

## 1. 项目初始化与 TS 依赖

在 Vite 项目中，通常在创建项目时就可以选择 TypeScript 模板。如果是现有项目集成，或者需要手动配置，可以参考以下步骤。

### 1.1 安装依赖

```bash
npm install typescript vue-tsc -D
```

- `typescript`: TS 核心库。
- `vue-tsc`: Vue 的类型检查工具（Vite 仅做转译，不做类型检查，构建时需要它）。

## 2. 配置 tsconfig.json

在项目根目录下创建 `tsconfig.json`。

### 2.1 推荐配置

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2.2 常用参数详解

#### 基础编译配置

- **target**: 指定编译后的 ECMAScript 目标版本（如 `ES5`, `ES2015`, `ESNext`）。在 Vite 项目中推荐 `ESNext`，因为 Vite 的构建工具（Esbuild/Rollup）会负责将代码转换为浏览器兼容的版本，TS 只需负责类型检查。
- **module**: 指定生成模块代码的系统。推荐 `ESNext`，保留 ES 模块语法，交由打包工具处理。
- **lib**: 指定要包含在编译中的库文件。通常包含 `ESNext`（最新 JS 特性）和 `DOM`（浏览器环境 API）。
- **strict**: 启用所有严格类型检查选项（包含 `noImplicitAny`, `strictNullChecks` 等）。强烈建议开启，以保证代码质量和类型安全。

#### 模块解析与路径

- **moduleResolution**: 决定如何处理模块导入。Vite 项目通常使用 `Node`（Node.js 风格解析）或 `Bundler`（适合打包工具）。
- **baseUrl**: 解析非相对模块名称的基准目录。通常设置为 `.`。
- **paths**: 路径映射，常用于配置别名。例如 `"@/*": ["src/*"]`，需配合 Vite 的 `resolve.alias` 配置使用，以便 TS 能识别别名路径。
- **resolveJsonModule**: 允许导入 `.json` 文件。开启后可以 `import data from './data.json'`。

#### 互操作性与兼容性

- **esModuleInterop**: 允许默认导入非 ES 模块（CommonJS）。开启后，可以像 `import React from 'react'` 这样导入 CommonJS 模块，而不是 `import * as React from 'react'`。
- **allowSyntheticDefaultImports**: 允许从没有默认导出的模块中默认导入。通常与 `esModuleInterop` 配合使用。
- **forceConsistentCasingInFileNames**: 强制文件名大小写一致。在 Windows/macOS 等大小写不敏感的文件系统中非常重要，避免部署到 Linux 时出错。

#### 构建与输出

- **noEmit**: 不输出编译后的文件（`.js`, `.map` 等）。在 Vite 架构中，TS 仅用于类型检查，构建工作由 Vite 完成，因此必须开启此项。
- **isolatedModules**: 确保每个文件都可以安全地作为单个模块进行转译。Vite 使用 Esbuild 进行单文件转译，无法分析完整的类型系统，因此必须开启此项以避免使用仅 TS 支持的特性（如 `const enum`）。
- **skipLibCheck**: 跳过声明文件（`.d.ts`）的类型检查。这可以显著提高编译速度，通常建议开启，除非你需要检查库文件的类型定义。

#### 其他选项

- **jsx**: 指定 JSX 代码的生成方式。Vue3 项目中通常设为 `preserve`，表示保留 JSX 语法，后续由 Vite 的 Vue 插件处理。
- **types**: 指定需要包含的类型声明包。默认包含 `node_modules/@types` 下的所有包。如果指定了该数组，则只包含数组中的包。

## 3. Vite 相关配置

### 3.1 tsconfig.node.json

Vite 配置文件 (`vite.config.ts`) 运行在 Node 环境，通常需要单独的配置。

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 3.2 类型声明文件 (vite-env.d.ts)

在 `src` 目录下创建 `vite-env.d.ts`，用于处理 Vue 文件导入和其他静态资源的类型定义。

```typescript
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

## 4. 脚本配置

在 `package.json` 中配置类型检查脚本：

```json
"scripts": {
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "preview": "vite preview"
}
```

- `vue-tsc --noEmit`: 在构建前执行类型检查，如果有类型错误则阻断构建。
