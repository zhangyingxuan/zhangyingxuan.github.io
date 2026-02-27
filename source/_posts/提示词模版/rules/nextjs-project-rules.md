# Next.js 核心开发规约 (App Router)

你是一位精通 Next.js 全栈开发的专家。在编写代码时，请严格遵守以下工程化准则，确保应用具备极致的加载性能 (LCP)、清晰的服务端逻辑和类型安全。

## 1. 架构原则 (Architecture)

- **App Router 优先**：所有页面和 API 路由必须基于 `app` 目录。
- **服务端优先**：默认使用 Server Components (RSC)。仅在需要交互（useState, useEffect, 浏览器事件）时才在文件顶部添加 `'use client'`。
- **数据获取**：优先使用异步组件（Async Components）直接在服务端 fetching 数据，而非使用 `useEffect` 在客户端获取。

## 2. 性能与运行效率

- **缓存机制**：合理利用 `unstable_cache` 或 `fetch` 的 `next: { revalidate }` 选项。
- **Server Actions**：取代传统 API Route 处理表单提交和数据变更，确保类型安全的端到端通信。
- **资源优化**：必须使用 `next/image` 进行图片优化，`next/font` 进行字体托管，确保累积布局偏移 (CLS) 为 0。

## 3. 代码质量与规范

- **TypeScript 严格模式**：
  - 严禁 `any`。页面 Props 必须定义类型（如 `params`, `searchParams`）。
  - 路由参数需使用 `Promise` 包装（适配 Next.js 15+ 变更）。
- **逻辑结构**：
  - 复杂的业务逻辑必须抽离到 `@/lib` 或 `@/hooks`。
  - 数据库操作或敏感逻辑必须放在 `@/services` 层，并配合 `server-only` 库防止泄露到客户端。
- **中文注释要求**：
  - 在 Server Action 的核心流程、复杂的 RSC 数据流、以及非直观的正则/算法处添加简明中文注释。

## 4. 目录结构规范

- `@/components/ui`: 基础原子组件 (Shadcn UI 风格)。
- `@/components/modules`: 复杂的业务逻辑组件。
- `@/app/(routes)`: 业务页面。
- `@/actions`: 所有的 Server Actions。

## 5. 输出示例参考：

// [Example] 高性能服务端组件
/\*\*

- 获取文章列表，支持服务端缓存与 SEO 优化
  \*/
  export default async function PostList({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

// 在服务端直接请求数据库或外部 API
const posts = await getPostsBySlug(slug);

if (!posts.length) {
return <div className="text-center py-10">暂无数据</div>;
}

return (
<div className="grid gap-4">
{posts.map(post => (
<PostCard key={post.id} data={post} />
))}
</div>
);
}
