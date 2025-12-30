---
title: 2025-12-17-【大模型】claude code初体验
categories:
  - 大模型
tags:
  - claude
---

## IDE 安装

- 1. 史上最强 IDE 安装(速度有点慢，有点耐心)
     `curl -fsSL https://claude.ai/install.sh | bash`
- 2. 执行`claude -h`，如果提示找不到该指令，则配置如下
     > echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
     > 如果提示 `zsh: permission denied:`，则手动写文件，并刷新配置。
     > `vi ~/.zshrc` 添加 `export PATH="$HOME/.local/bin:$PATH"`到底部，保存后刷新配置`source ~/.zshrc`。

## MCP 安装

### 1. chrome-devtools-mcp

- 1. 当前项目范围内生效 `claude mcp add chrome-devtools npx chrome-devtools-mcp@latest`
- 2. 用户级生效：`claude mcp add chrome-devtools npx chrome-devtools-mcp@latest --scope user`

https://github.com/ChromeDevTools/chrome-devtools-mcp

### 科学上网

- 1. 域名（可二级域名）
- 2. 境外服务器（新加坡、日本、美国）香港不行
- vless + ws + udp
  > 注意别漏了 1. TLS => '开启'，2. SIN 配置，值为伪装域名

###
