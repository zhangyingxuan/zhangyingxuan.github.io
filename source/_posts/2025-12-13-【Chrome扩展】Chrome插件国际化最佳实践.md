---
title: Chrome插件国际化(i18n)最佳实践
date: 2025-12-13 16:50:00
tags:
  - Chrome Extension
  - i18n
  - 前端开发
categories:
  - Chrome扩展
---

在全球化日益深入的今天，开发一款支持多语言的 Chrome 插件（Extension）对于扩大用户群体至关重要。Chrome 官方提供了强大的 `chrome.i18n` API，使得插件的国际化（Internationalization，简称 i18n）变得标准化且易于实现。

本文将详细介绍 Chrome 插件国际化的最佳实践方案、具体实现步骤以及开发过程中可能遇到的问题。

<!-- more -->

## 1. 方案详情

Chrome 插件的国际化主要依赖于特定的目录结构和 `messages.json` 文件。核心思想是将所有用户可见的字符串从代码中抽离出来，存放在特定语言的配置文件中。

### 1.1 核心目录结构

在插件的根目录下，必须包含一个名为 `_locales` 的文件夹。该文件夹下包含以语言代码命名的子文件夹（如 `en`, `zh_CN`, `es` 等），每个子文件夹中包含一个 `messages.json` 文件。

```text
my_extension/
├── manifest.json
├── _locales/
│   ├── en/
│   │   └── messages.json
│   ├── zh_CN/
│   │   └── messages.json
│   ├── zh_TW/
│   │   └── messages.json
│   └── es/
│       └── messages.json
├── popup.html
├── popup.js
└── styles.css
```

### 1.2 messages.json 格式

`messages.json` 是一个标准的 JSON 文件，键是消息的名称（ID），值是包含消息内容和描述的对象。

```json
{
  "appName": {
    "message": "My Awesome Extension",
    "description": "The name of the extension"
  },
  "greetUser": {
    "message": "Hello, $USER$!",
    "description": "Greeting message",
    "placeholders": {
      "user": {
        "content": "$1",
        "example": "John"
      }
    }
  }
}
```

### 1.3 预定义消息

Chrome 提供了一些预定义的消息，可以直接在 CSS 和 JavaScript 中使用，无需在 `messages.json` 中定义：

- `@@ui_locale`: 当前的 UI 语言代码（如 `en_US`）。
- `@@bidi_dir`: 文本方向，`ltr` (从左到右) 或 `rtl` (从右到左)。
- `@@bidi_reversed_dir`: 与当前文本方向相反的方向。
- `@@bidi_start_edge`: 文本起始边缘，`left` (LTR) 或 `right` (RTL)。
- `@@bidi_end_edge`: 文本结束边缘，`right` (LTR) 或 `left` (RTL)。
- `@@extension_id`: 扩展的 ID。

## 2. 实现步骤

### 步骤 1：配置 manifest.json

首先，需要在 `manifest.json` 中指定默认语言 (`default_locale`)。这是**必须**的，否则无法加载 `_locales` 目录。

```json
{
  "name": "__MSG_appName__",
  "description": "__MSG_appDesc__",
  "version": "1.0",
  "manifest_version": 3,
  "default_locale": "en",
  "action": {
    "default_popup": "popup.html",
    "default_title": "__MSG_actionTitle__"
  }
}
```

注意：`manifest.json` 中的字符串引用格式为 `__MSG_messageName__`。

### 步骤 2：创建语言包

根据 1.1 节的结构创建 `_locales` 目录及相应的语言文件夹。

**\_locales/en/messages.json**:

```json
{
  "appName": { "message": "My Extension" },
  "appDesc": { "message": "This is a demo extension." },
  "actionTitle": { "message": "Click me" },
  "helloWorld": { "message": "Hello World!" }
}
```

**\_locales/zh_CN/messages.json**:

```json
{
  "appName": { "message": "我的扩展" },
  "appDesc": { "message": "这是一个演示扩展。" },
  "actionTitle": { "message": "点我" },
  "helloWorld": { "message": "你好，世界！" }
}
```

**\_locales/zh_TW/messages.json**:

```json
{
  "appName": { "message": "我的擴充功能" },
  "appDesc": { "message": "這是一個演示擴充功能。" },
  "actionTitle": { "message": "點我" },
  "helloWorld": { "message": "你好，世界！" }
}
```

### 步骤 3：在代码中使用

#### HTML 中使用

HTML 文件不能直接像 `manifest.json` 那样使用 `__MSG_xxx__`。通常的做法是使用 JavaScript 在加载时动态替换，或者使用数据属性标记需要翻译的元素。

**popup.html**:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Popup</title>
    <script src="popup.js"></script>
  </head>
  <body>
    <h1 id="title" data-i18n="appName">Loading...</h1>
    <p id="content" data-i18n="helloWorld">Loading...</p>
  </body>
</html>
```

**popup.js**:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // 查找所有带有 data-i18n 属性的元素
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const messageKey = element.getAttribute("data-i18n");
    const message = chrome.i18n.getMessage(messageKey);
    if (message) {
      element.textContent = message;
    }
  });
});
```

#### JavaScript 中使用

在 JS 中获取本地化字符串非常简单：

```javascript
const appName = chrome.i18n.getMessage("appName");
console.log(appName);

// 带参数的消息
// messages.json: "welcome": { "message": "Welcome, $1!" }
const welcomeMsg = chrome.i18n.getMessage("welcome", ["Alice"]);
```

#### CSS 中使用

CSS 文件支持使用 `__MSG_xxx__` 语法。

```css
body {
  /* 根据语言方向设置边距 */
  margin-left: 0;
  margin-right: 0;
  direction: __MSG_ @@bidi_dir__;
}

.rtl-support {
  /* 如果是 RTL 语言，这里会变成 right，否则是 left */
  text-align: __MSG_ @@bidi_start_edge__;
}
```

## 3. 最佳实践与常见问题

### 3.1 占位符 (Placeholders) 的正确使用

不要在代码中拼接字符串，而应该使用占位符。这对于语序不同的语言尤为重要。

**错误做法**:

```javascript
const msg = "File " + filename + " not found.";
```

**正确做法**:
`messages.json`:

```json
{
  "fileNotFound": {
    "message": "File $FILE$ not found.",
    "placeholders": {
      "file": { "content": "$1" }
    }
  }
}
```

`code.js`:

```javascript
const msg = chrome.i18n.getMessage("fileNotFound", [filename]);
```

### 3.2 语言回退机制 (Fallback)

Chrome 的语言匹配策略如下：

1.  查找用户具体区域设置（如 `zh_CN`）。
2.  如果未找到，查找语言代码（如 `zh`）。
3.  如果仍未找到，使用 `manifest.json` 中定义的 `default_locale`（如 `en`）。

因此，建议在 `default_locale` 中包含所有消息的定义，以防止在某些语言环境下出现空白消息。

### 3.3 字符编码

确保所有文件（HTML, CSS, JS, JSON）都使用 **UTF-8** 编码。否则，非 ASCII 字符（如中文）可能会显示为乱码。

### 3.4 动态内容的国际化

对于动态生成的内容，确保在生成 DOM 节点时立即调用 `chrome.i18n.getMessage` 填充文本，而不是硬编码。

### 3.5 调试技巧

- 在 `chrome://extensions` 页面，开启“开发者模式”。
- 点击“加载已解压的扩展程序”。
- 要测试不同语言，无需更改操作系统语言。可以通过修改 Chrome 启动参数 `--lang=es` 来模拟西班牙语环境（需要重启 Chrome）。或者在 Chrome 设置中更改浏览器显示语言并重启。

## 4. 参考文献

- [Chrome Developers: i18n Documentation](https://developer.chrome.com/docs/extensions/reference/i18n/)
- [Chrome Developers: Internationalization](https://developer.chrome.com/docs/extensions/mv3/i18n/)
- [MDN Web Docs: i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n)

---

通过遵循上述最佳实践，您可以轻松构建出适应全球用户的 Chrome 扩展程序。国际化不仅仅是翻译，更是为了提供符合用户习惯的本地化体验。

[prompt]

1. 为当前 chrome v3 拓展添加国际化支持，至少支持简体中文、繁体中文、英文、日语，默认简体中文，支持主动切换语言
2. 添加关于图标，点击后跳转https://zhangyingxuan.github.io/about 页面
