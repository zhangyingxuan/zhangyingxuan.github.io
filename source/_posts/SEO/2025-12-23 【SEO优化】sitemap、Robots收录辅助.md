---
title: 2025-12-23 【SEO优化】sitemap、Robots收录辅助
description:
categories:
  - 架构
tags:
  - SEO
---

# SEO 配置说明

### 1. Sitemap (站点地图)

- **文件位置**: `/dist/sitemap.xml`
- **生成方式**: 自动在构建时生成
- **包含页面**: 所有可公开访问的路由页面
- **更新频率**: 每次构建时自动更新
- scripts/generate-sitemap.js 脚本

```js
import fs from "node:fs";
import path from "node:path";

// 项目路由配置
// 注意：只包含robots.txt中允许爬取的公开页面
const routes = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/login", priority: "0.8", changefreq: "monthly" },
];

// 生成Sitemap XML内容
function generateSitemap(domain = "https://xxx.xxx.com") {
  const today = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach((route) => {
    xml += "  <url>\n";
    xml += `    <loc>${domain}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += "  </url>\n";
  });

  xml += "</urlset>";
  return xml;
}

// 主函数
function main() {
  const domain = process.env.VITE_SITE_DOMAIN || "https://xxx.xxx.com";
  const outputPath = path.resolve(process.cwd(), "dist/sitemap.xml");

  const sitemapContent = generateSitemap(domain);

  // 确保dist目录存在
  const distDir = path.dirname(outputPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 写入文件
  fs.writeFileSync(outputPath, sitemapContent, "utf8");
  console.log(`✅ Sitemap generated: ${outputPath}`);
  console.log(`🌐 Domain: ${domain}`);
  console.log(`📄 Total URLs: ${routes.length}`);
}

// 如果是直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateSitemap, main };
```

### 2. Robots.txt (爬虫规则)

- **文件位置**: `/public/robots.txt`
- **功能**: 控制搜索引擎爬取行为
- **策略**: 采用白名单模式 (Allow List)
- **允许爬取**: 首页、登录页、静态资源
- **禁止爬取**: 所有后台业务页面 (/merchant/, /api/ 等)、错误页面

```txt
# robots.txt for xxx.xxx.com
User-agent: *

# --- 1. 显式允许公开访问的页面 ---
# 使用 $ 符号进行精确匹配，防止爬虫抓取这些路径下的子路由
Allow: /$
Allow: /login$

# --- 2. 显式允许静态资源 (CSR项目必须) ---
# 确保爬虫能拿到 JS/CSS/图片/字体 来渲染首页内容
Allow: /assets/
Allow: /*.js$
Allow: /*.css$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.ico$
Allow: /*.woff$
Allow: /*.woff2$
Allow: /*.ttf$

# --- 3. 禁止抓取其他所有页面 ---
# 既然除了上述页面外都需要登录，直接封禁根目录
# 爬虫会优先匹配上方的 Allow 规则，剩下的全部 Disallow
Disallow: /

# --- 4. 补充说明 (虽然 Disallow: / 已涵盖，但显式禁止敏感路径是好习惯) ---
Disallow: /api/
Disallow: /bindingEnterprise
Disallow: /result/
Disallow: /merchant/
Disallow: /resource/

# --- 5. 其他配置 ---
Sitemap: https://xxx.xxx.com/sitemap.xml
```

## 使用说明

### 手动生成 Sitemap

```bash
npm run sitemap:generate
```

### 构建时自动生成 SEO 文件

```bash
npm run build:ssg
```

### 普通构建（也包含 SEO 生成）

```bash
npm run build
```

## 维护指南

### 添加新页面到 Sitemap

1. 编辑 `scripts/generate-sitemap.js` 文件
2. 在 `routes` 数组中添加新页面配置
3. 设置合适的优先级和更新频率

### 修改 Robots.txt 规则

1. 编辑 `public/robots.txt` 文件
2. 根据需要调整 `Allow` 和 `Disallow` 规则
3. 确保敏感页面不被搜索引擎索引

## 最佳实践

1. **定期更新**: 每次发布新版本时，确保 Sitemap 和 Meta 标签是最新的
2. **内容质量**: 确保页面内容与 Meta 描述一致
3. **链接结构**: 保持 URL 结构简洁、语义化
4. **移动友好**: 确保页面在移动设备上表现良好
5. **加载速度**: 优化页面加载性能

## 验证工具

- **Google Search Console**: 提交 Sitemap 和监控索引状态
- **Bing Webmaster Tools**: 提交 Sitemap 到 Bing
- **SEO 检查工具**: 使用工具检查页面 SEO 效果

## 注意事项

- 确保 Sitemap 中的 URL 都是可访问的
- Robots.txt 规则不要过于严格，避免影响正常爬取
- Meta 标签内容要真实反映页面内容
- 定期检查搜索引擎的收录情况
