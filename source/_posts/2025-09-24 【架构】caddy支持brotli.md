---
title: 2025-09-24 【架构】caddy支持brotli
description:
categories:
  - 架构设计
tags:
  - brotli
---

在 Debian 12 上，通过 `apt` 标准仓库安装的 Caddy，通常是不包含 Brotli 模块的。由于 Caddy 是 Go 编写的单二进制文件，**不支持动态加载模块**，必须替换现有的二进制文件。

以下是实现步骤：

---

### 第一步：安装 xcaddy (编译工具)

`xcaddy` 是官方提供的工具，用于在本地定制化编译 Caddy 及其插件。

1. **安装 Go 环境**（编译所需）：

```bash
sudo apt update
sudo apt install golang-go -y

```

2. **下载并安装 xcaddy**：

```bash
sudo apt install debian-keyring debian-archive-keyring apt-transport-https -y
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/xcaddy/gpg.11.txt' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-xcaddy-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/xcaddy/config.debian.repo?locales=true' | sudo tee /etc/apt/sources.list.d/caddy-xcaddy.list
sudo apt update
sudo apt install xcaddy -y

```

---

### 第二步：编译集成 Brotli 的 Caddy

在当前目录下编译一个包含 Brotli 模块的新二进制文件：

```bash
xcaddy build --with github.com/ueffel/caddy-brotli

```

_编译完成后，当前目录下会出现一个名为 `caddy` 的文件。_

---

### 第三步：替换现有的 Caddy 二进制文件

Debian 默认安装的 Caddy 路径在 `/usr/bin/caddy`。

1. **备份旧文件**：

```bash
sudo mv /usr/bin/caddy /usr/bin/caddy.bak

```

2. **移动新文件并设置权限**：

```bash
sudo mv ./caddy /usr/bin/caddy
sudo chmod +x /usr/bin/caddy

```

3. **验证模块是否集成成功**：

```bash
caddy list-modules | grep br

```

_如果输出中包含 `http.handlers.encode.br`，说明安装成功。_

---

### 第四步：配置 Caddyfile

编辑你的配置文件（通常在 `/etc/caddy/Caddyfile`），在 `encode` 指令中加入 `br`：

```caddyfile
yourdomain.com {
    root * /var/www/html
    file_server

    # 开启压缩：br 优先于 gzip
    encode {
        br 5      # 5 是推荐的压缩等级，兼顾性能与压缩率
        gzip 6
    }
}

```

---

### 第五步：重启并测试

1. **重启服务**：

```bash
sudo systemctl restart caddy

```

2. **测试压缩效果**：
   使用 `curl` 模拟支持 Brotli 的浏览器请求：

```bash
curl -I -H "Accept-Encoding: br" https://yourdomain.com

```

查看返回头中是否有：`Content-Encoding: br`。

---

### ⚠️ 重要提示：关于更新

当你通过 `apt upgrade` 更新 Caddy 时，官方仓库的二进制文件可能会**覆盖**掉你手动编译的文件，导致 Brotli 支持失效。

**建议方案：**
为了防止覆盖，你可以通过 `sudo apt-mark hold caddy` 锁定版本，或者创建一个简单的脚本，在每次更新后运行上述编译流程。
