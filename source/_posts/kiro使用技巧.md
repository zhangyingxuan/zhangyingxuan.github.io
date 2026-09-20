---
title: 2026-03-04-【大模型】工作准备
categories:
  - 大模型
tags:
  - openClaw
---
作为 12 年经验的前端架构师，你一定深知 UI 还原（Design-to-Code）是前端开发中最消耗时间、最容易扯皮，也最适合用 AI 提效的场景。

**Kiro** 凭借其独特的 **Spec-Driven（规格驱动）** 机制，在还原 Figma 页面时，比 Cursor 这种纯 Chat 流派的工具更具“确定性”。它不会盲目地直接堆砌 HTML/CSS，而是会先拆解组件结构，从而避免生成一堆无法维护的垃圾代码。

为了在 **Visha**、**Wallet H5** 等业务线中实现像素级、工程化的快速还原，我为你整理了一份 Kiro 配合 Figma 的**黄金实战链路**和**指令技巧**：

---

## 🛠️ 第一阶段：准备上下文（投喂设计稿）

AI 看不懂模糊的截图。要让 Kiro 还原得准，你必须给它喂入最高清、信息量最足的输入源。

### 1. 优先使用“Figma 插件”导出结构（强烈推荐）
* **痛点**：如果你直接截一张图丢给 Kiro，AI 只能靠视觉盲猜间距、圆角和颜色，极易翻车。
* **破局**：在 Figma 中使用类似 `html.to.design` 或 `Anima` 插件，或者直接使用 Figma 自带的 **Dev Mode（开发模式）**。
* **操作**：选中你要还原的画板，复制其 **Figma 节点的 JSON 数据** 或者 **Figma 原生生成的 Tailwind/CSS 代码片段**。

### 2. 准备组件库上下文
在让 Kiro 写代码前，确保它知道你们公司的公共组件（如 `<v-button>` 或 `<v-cell>`）。
* 在项目的 `tech.md` 或直接在对话中告诉 Kiro：
  > “我们在本项目中使用公司私有的 Visha-UI 组件库。在还原页面时，请优先使用组件库中的基础组件，不要手写原生的 `<div>` 和 `<button>`。”

---

## 📝 第二阶段：Kiro 的“三步走”还原法

严格遵循 Kiro 的 **Spec 模式**，分层推进：

### 步骤 1：发起 Spec（定义结构与命名空间）
将你的 Figma 截图（或者复制的 JSON/CSS 片段）丢给 Kiro，并发送以下指令：

> **Prompt 模板：**
> `@codebase` 请看这张 Figma H5 页面截图（或附加的 JSON 代码）。我需要你帮我在 `@/views/wallet` 下新建一个 `PaymentSuccess.vue` 页面。
> **请先为我输出一份 Spec 规格书**：
> 1. 拆解这个页面包含哪些原子组件（Header, StatusIcon, BillInfo, BottomButtons）。
> 2. 确认需要提取哪些国际化 (i18n) 语料 Key。
> 3. 规划使用的 Flex/Grid 布局策略。

### 步骤 2：人工审查 Spec（扼杀 Bug 于摇篮）
Kiro 会在侧边栏生成 Spec。作为架构师，你此时只需要花 30 秒看一眼：
* 它的组件拆分是否合理？
* 它是不是又偷偷用硬编码写了中文，而没有遵循 i18n 规范？
* **点击 Approve**，让 Kiro 将 Spec 拆解为具体的 Task（任务）去执行。

### 步骤 3：Task 执行与样式微调
Kiro 会自动创建文件、编写 Vue 3 模板和 `<style>`。
* **H5 特殊技巧**：如果你们的 H5 采用的是 `rem` 或者 `vw` 适配方案（例如稿子是 750px，代码里要换算），务必在 Spec 阶段或 `tech.md` 里锁死：
  > “本项目采用 postcss-pxtorem 方案，设计稿基于 750px 宽度。你在编写 CSS 时，请直接写 px，构建工具会自动转换。”

---

## 🚀 第三阶段：Kiro 还原页面的 4 个高级技巧

### 💡 技巧 1：一句话搞定“国际化语料”剥离
出海业务最烦琐的就是国际化。你可以在 Kiro 还原页面的同时，让它顺便把语料剥离出来：
* **指令**：`“在还原该页面时，凡是文案部分，请自动在 locales/en.json 中生成对应的 Key，并在 Vue 模版中使用 $t('key') 引用，不允许出现任何硬编码硬字。”`

### 💡 技巧 2：利用 MCP 协议打通 Figma API
如果你有极客精神，且手头有 Figma 的 Access Token，你可以利用 **MCP (Model Context Protocol)** 协议写一个简单的 Figma Reader Server。
* **效果**：你在 Kiro 里直接输入 `@figma https://www.figma.com/file/...` 链接。Kiro 的 Agent 会直接调用 Figma API 拿到图层的绝对坐标、颜色变量和字体大小，实现**真正的、毫无偏差的 100% 还原**。

### 💡 技巧 3：利用 `Agent Hooks` 自动跑 ESLint 和 Stylelint
还原完页面后，AI 生成的 CSS 往往比较凌乱。
* 确保你在 `kiro.json` 里配置了后置 Hook（如 `npm run lint:style`）。Kiro 在写完 Vue 的 `<style>` 之后，会自动跑一遍格式化，帮你把属性按字母或规范顺序排列整齐。

---

## 📊 总结

传统的 AI 还原页面是 **“一把梭”**（直接生成几百行代码，错漏百出）；
而 Kiro 的正确姿势是 **“切蛋糕”**：
1. **喂图/JSON** $\rightarrow$ 2. **Kiro 出组件拆解 Spec** $\rightarrow$ 3. **人工 Approve** $\rightarrow$ 4. **Task 自动化编写与 Lint 格式化**。





1. 同一功能横向对比： Cursor、Trae CN（字节跳动）、CodeBuddy CN（腾讯）、Lingma（阿里巴巴）和 Comate（百度）这五款开发工具，我一般会同时打开至少2款，对比实现同一功能时的完成度。有的想法也会先做demo看看效果。核心是多用IDE干活（做调研、写方案、开发、验证、写接口文档、整理目录、统计数据等）。感觉cursor,trae 的统计结果偏高点。
2. 提问前的提示词优化：遇到问题时，先借助 LLM 润色提示词再发起提问。由于 AI 回答的质量很大程度上取决于提问者的认知边界，自行撰写的提示词往往存在盲区，借助 LLM 辅助推敲能有效拓宽思路、减少遗漏。
3. 表达前的观点优化：想阐述某个观点时，先让 LLM 帮忙润色。AI 能够帮助发现逻辑漏洞、补充反面论据、完善表达结构，让最终的观点输出更加严谨有力。




figma mcp（remote-额度限制、Desktop花钱-dev20刀/月）

