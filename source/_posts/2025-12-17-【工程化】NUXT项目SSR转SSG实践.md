---
title: 2025-12-17-【工程化】NUXT项目SSR转SSG实践
categories:
  - 工程化
tags:
  - SSR
  - SSG
---

# 背景

需要将包含动态路由（如 `/convert/:from-to`）的 SSR 项目转换为 SSG，核心在于**“预渲染（Prerender）”**。

在 SSG 模式下，Nuxt 在构建阶段需要知道所有可能的参数组合，以便为每个组合生成一个真实的 `index.html`。

以下是针对您项目情况的完整实施步骤：

---

### 第一步：定义路由生成的范围

在 `nuxt.config.ts` 中，使用 `nitro.prerender` 配置项。

**自动化枚举**
写一个函数动态生成路由数组。

```typescript
const formats = ["jpg", "png", "webp", "ico", "avif"];

const generateConvertRoutes = () => {
  const routes = [];
  for (const from of formats) {
    for (const to of formats) {
      if (from !== to) {
        routes.push(`/convert/${from}-to-${to}`);
      }
    }
  }
  return routes;
};

export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: generateConvertRoutes(),
    },
  },
});
```

---

### 第二步：配置混合渲染规则（Hybrid Rendering）

为了防止有些未定义的路由访问时出错，或者有些页面您确实不想静态化，使用 `routeRules` 进行精细化控制。

```typescript
export default defineNuxtConfig({
  routeRules: {
    // 首页直接静态化
    "/": { prerender: true },

    // 所有的转换详情页开启静态化
    "/convert/**": { prerender: true },

    // 如果有用户中心或其他动态页面，显式关闭 SSR，走 SPA 模式
    "/admin/**": { ssr: false },
  },
});
```

---

### 第三步：处理 SEO 数据的“硬编码”

由于是 SSG，页面的 `title` 和 `meta` 标签必须在构建时确定。

在 `/pages/convert/[from]-to-[to].vue` 中：

```vue
<script setup lang="ts">
const route = useRoute();
const from = route.params.from;
const to = route.params.to;

// 这里的数据会在 generate 期间被抓取并写入静态 HTML
useHead({
  title: `${from.toUpperCase()} 转 ${to.toUpperCase()} - 在线图片转换工具`,
  meta: [
    {
      name: "description",
      content: `专业的在线 ${from} 转 ${to} 工具，基于 Web Worker 浏览器本地转换，不消耗流量。`,
    },
  ],
});
</script>
```

---

### 第四步：执行构建与部署

1. **生成静态产物：**

```bash
npx nuxi generate

```

执行后，你会看到控制台正在一个个爬取页面（Prerendering 12 routes...）。 2. **查看产物：**
产物位于 `.output/public`。你会发现文件夹结构如下：

```text
.output/public/
├── convert/
│   ├── jpg-to-png/index.html
│   ├── png-to-webp/index.html
│   └── ...
└── index.html

```

3. **部署到 1 核 1G 服务器：**
   将 `.output/public` 下的所有内容拷贝到服务器的 Nginx 目录下即可。

---

### 第五步：Nginx 的关键配合

由于路由变成了 `/convert/jpg-to-png/` 这种目录结构，Nginx 需要能自动寻找目录下的 `index.html`。

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/your-nuxt-app;
    index index.html;

    location / {
        # 核心：尝试寻找对应文件、对应目录，最后回退到 404
        try_files $uri $uri/ /index.html;
    }

    # Wasm 文件的 MIME 类型支持（非常重要）
    location ~* \.wasm$ {
        add_header Content-Type application/wasm;
    }
}

```

### 使用子路径（不改变域名）

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 原有的主站配置
    location / {
        # ... 这里的拦截逻辑保持不变
    }

    # 新增 SSG 项目配置
    location /convert/ {
        alias /workspace/git/public/; # 注意这里用 alias，末尾带斜杠
        index index.html;
        try_files $uri $uri/ /convert/index.html;

        # 确保 Wasm 正常加载
        location ~* \.wasm$ {
            types { application/wasm wasm; }
        }
    }
}

```

---

### 总结

将 SSR 转为 SSG 后：

1. **资源**：压力几乎消失，Nginx 只负责静态分发。
2. **SEO**：每一个组合页面都有独立的静态 HTML，SEO 满分。
3. **体验**：用户在不同转换页面切换时，依然是 SPA 的流畅感。
